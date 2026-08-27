const auth = require("./_auth");
const db = require("./_db");

function genId() {
  return "u-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function setSessionCookie(res, uid) {
  var token = auth.sessionToken(uid);
  var maxAge = 60 * 60 * 24 * 180; // 180 days
  res.setHeader(
    "Set-Cookie",
    "team_session=" + token + "; HttpOnly; Path=/; Max-Age=" + maxAge + "; SameSite=Lax; Secure"
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }
  if (!process.env.AUTH_SECRET) {
    res.status(500).json({ error: "server_not_configured" });
    return;
  }
  var body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (err) { body = null; }
  }
  body = body || {};

  try {
    if (body.mode === "join") {
      // Self-service: create a new personal account, or reset a forgotten
      // password for an existing username — both gated by the shared
      // team invite code (TEAM_PIN). Used from the login screen.
      if (!process.env.TEAM_PIN) {
        res.status(500).json({ error: "server_not_configured" });
        return;
      }
      var pin = body.teamPin != null ? String(body.teamPin) : "";
      if (pin !== process.env.TEAM_PIN) {
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
      // Optimistic-concurrency update: if someone else's account change
      // (another join, or an admin add/remove) saves in between our read
      // and write, retry against the fresh list instead of clobbering it.
      var passwordHash = auth.hashPassword(password);
      var joinResult = await db.kvUpdate(auth.USERS_KEY, function (raw) {
        var users = Array.isArray(raw) ? raw.slice() : [];
        var existing = users.find(function (u) { return u.username === username && !u.deleted; });
        var uid;
        if (existing) {
          var idx = users.indexOf(existing);
          users[idx] = Object.assign({}, existing, { passwordHash: passwordHash, name: name });
          uid = existing.id;
        } else {
          uid = genId();
          users.push({
            id: uid,
            name: name,
            username: username,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
          });
        }
        return { value: users, uid: uid };
      });
      setSessionCookie(res, joinResult.uid);
      res.status(200).json({ ok: true, name: name });
      return;
    }

    // Normal login with an existing personal account.
    var username2 = String(body.username || "").trim().toLowerCase();
    var password2 = String(body.password || "");
    var users2 = await auth.getUsers();
    var u = users2.find(function (x) { return x.username === username2 && !x.deleted; });
    if (!u || !auth.verifyPassword(password2, u.passwordHash)) {
      res.status(401).json({ error: "wrong_login" });
      return;
    }
    setSessionCookie(res, u.id);
    res.status(200).json({ ok: true, name: u.name });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: (err && err.message) || "unknown" });
  }
};
