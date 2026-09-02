const auth = require("./_auth");
const db = require("./_db");

function genId() {
  return "u-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Accepts whatever the client sent for "which modules can this account
// see" and turns it into either null (full access — the default) or a
// clean array of known module keys.
function sanitizeAllowedModules(input) {
  if (!Array.isArray(input)) return null;
  var clean = input.filter(function (k) { return auth.RESTRICTABLE_MODULES.indexOf(k) > -1; });
  var unique = clean.filter(function (k, i) { return clean.indexOf(k) === i; });
  return unique;
}

function forbid(res, message) {
  res.status(403).json({ error: "forbidden", message: message || "你的账号没有账号管理的权限" });
}

module.exports = async function handler(req, res) {
  var me = await auth.currentUser(req);
  if (!me) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  if (!auth.canAccess(me, "accounts")) {
    forbid(res);
    return;
  }

  if (req.method === "GET") {
    var users = await auth.getUsers();
    var list = users
      .filter(function (u) { return !u.deleted; })
      .map(function (u) {
        return {
          id: u.id,
          name: u.name,
          username: u.username,
          phone: u.phone || "",
          email: u.email || "",
          createdAt: u.createdAt,
          allowedModules: Array.isArray(u.allowedModules) ? u.allowedModules : null,
        };
      });
    res.status(200).json({ users: list, me: me, restrictableModules: auth.RESTRICTABLE_MODULES });
    return;
  }

  if (req.method === "POST") {
    var body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (err) { body = null; }
    }
    body = body || {};
    try {
      if (body.op === "add") {
        // Adding a teammate from inside the app still requires the shared
        // invite code — this does NOT touch the caller's own session.
        if (!process.env.TEAM_PIN) {
          res.status(500).json({ error: "server_not_configured" });
          return;
        }
        if (String(body.teamPin || "") !== process.env.TEAM_PIN) {
          res.status(401).json({ error: "wrong_pin" });
          return;
        }
        var name = String(body.name || "").trim();
        var username = String(body.username || "").trim().toLowerCase();
        var password = String(body.password || "");
        if (!name || !username || password.length < 4) {
          res.status(400).json({ error: "bad_request", message: "请填写姓名、用户名，密码至少 4 位" });
          return;
        }
        var allowedModules = sanitizeAllowedModules(body.allowedModules);
        var phone = String(body.phone || "").trim().slice(0, 40);
        var email = String(body.email || "").trim().slice(0, 120);
        var passwordHash = auth.hashPassword(password);
        try {
          await db.kvUpdate(auth.USERS_KEY, function (raw) {
            var users = Array.isArray(raw) ? raw.slice() : [];
            if (users.some(function (u) { return u.username === username && !u.deleted; })) {
              var err = new Error("username_taken");
              err.httpStatus = 400;
              err.httpBody = { error: "username_taken", message: "这个用户名已经有人用了，换一个试试" };
              throw err;
            }
            users.push({
              id: genId(),
              name: name,
              username: username,
              passwordHash: passwordHash,
              allowedModules: allowedModules,
              phone: phone,
              email: email,
              createdAt: new Date().toISOString(),
            });
            return { value: users };
          });
        } catch (err) {
          if (err && err.httpStatus) { res.status(err.httpStatus).json(err.httpBody); return; }
          throw err;
        }
        res.status(200).json({ ok: true });
        return;
      }

      if (body.op === "setPermissions") {
        if (!body.id) {
          res.status(400).json({ error: "bad_request" });
          return;
        }
        var nextAllowed = sanitizeAllowedModules(body.allowedModules);
        // Guard against locking yourself out of account management —
        // nobody else could undo it for you without direct DB access.
        if (body.id === me.id && Array.isArray(nextAllowed) && nextAllowed.indexOf("accounts") === -1) {
          res.status(400).json({ error: "bad_request", message: "不能取消自己的账号管理权限，请让其他同事帮你调整" });
          return;
        }
        var patch = { allowedModules: nextAllowed };
        if (Object.prototype.hasOwnProperty.call(body, "phone")) {
          patch.phone = String(body.phone || "").trim().slice(0, 40);
        }
        if (Object.prototype.hasOwnProperty.call(body, "email")) {
          patch.email = String(body.email || "").trim().slice(0, 120);
        }
        var permResult = await db.kvUpdate(auth.USERS_KEY, function (raw) {
          var users = Array.isArray(raw) ? raw.slice() : [];
          var idx = users.findIndex(function (u) { return u.id === body.id && !u.deleted; });
          if (idx === -1) return { value: users, found: false };
          var next = users.slice();
          next[idx] = Object.assign({}, next[idx], patch);
          return { value: next, found: true };
        });
        if (!permResult.found) {
          res.status(404).json({ error: "not_found" });
          return;
        }
        res.status(200).json({ ok: true });
        return;
      }

      if (body.op === "remove") {
        var removeResult = await db.kvUpdate(auth.USERS_KEY, function (raw) {
          var users = Array.isArray(raw) ? raw.slice() : [];
          var idx = users.findIndex(function (u) { return u.id === body.id; });
          if (idx === -1) return { value: users, found: false };
          var next = users.slice();
          next[idx] = Object.assign({}, next[idx], { deleted: true });
          return { value: next, found: true };
        });
        if (!removeResult.found) {
          res.status(404).json({ error: "not_found" });
          return;
        }
        res.status(200).json({ ok: true });
        return;
      }

      res.status(400).json({ error: "bad_op" });
    } catch (err) {
      res.status(500).json({ error: "server_error", message: (err && err.message) || "unknown" });
    }
    return;
  }

  res.status(405).json({ error: "method_not_allowed" });
};
