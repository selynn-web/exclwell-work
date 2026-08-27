const auth = require("./_auth");
const db = require("./_db");

function genId() {
  return "u-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

module.exports = async function handler(req, res) {
  var me = await auth.currentUser(req);
  if (!me) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  if (req.method === "GET") {
    var users = await auth.getUsers();
    var list = users
      .filter(function (u) { return !u.deleted; })
      .map(function (u) { return { id: u.id, name: u.name, username: u.username, createdAt: u.createdAt }; });
    res.status(200).json({ users: list, me: me });
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
        var users2 = await auth.getUsers();
        if (users2.some(function (u) { return u.username === username && !u.deleted; })) {
          res.status(400).json({ error: "username_taken", message: "这个用户名已经有人用了，换一个试试" });
          return;
        }
        users2.push({
          id: genId(),
          name: name,
          username: username,
          passwordHash: auth.hashPassword(password),
          createdAt: new Date().toISOString(),
        });
        await db.kvSet(auth.USERS_KEY, users2);
        res.status(200).json({ ok: true });
        return;
      }

      if (body.op === "remove") {
        var users3 = await auth.getUsers();
        var target = users3.find(function (u) { return u.id === body.id; });
        if (!target) {
          res.status(404).json({ error: "not_found" });
          return;
        }
        target.deleted = true;
        await db.kvSet(auth.USERS_KEY, users3);
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
