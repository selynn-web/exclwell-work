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
      // Gated by the shared team invite code (TEAM_PIN). This now does
      // TWO different things depending on whether the team already has
      // any accounts:
      //
      //  - Normal case (at least one account already exists): PASSWORD
      //    RESET ONLY for an existing username. Brand-new accounts can no
      //    longer be self-registered here — account creation is deliberately
      //    internal-only, done by an already-logged-in admin from 账号管理
      //    (see api/users.js's "add" op, which requires an authenticated
      //    session with accounts permission).
      //
      //  - Bootstrap case (the team has ZERO accounts — a fresh deployment,
      //    or every account was somehow removed): this still creates the
      //    very first account, so a new deployment can never be locked out
      //    with literally no way to log in and no admin session to use
      //    api/users.js's "add" op. Once that first account exists, this
      //    path stops accepting new usernames and only resets passwords.
      if (!process.env.TEAM_PIN) {
        res.status(500).json({ error: "server_not_configured" });
        return;
      }
      // The team invite code is shared (not per-account), so brute-force
      // attempts against it are tracked under one bucket rather than per
      // username — see api/_auth.js's comment on LOGIN_ATTEMPTS_KEY.
      var pinLock = await auth.checkLoginLock("teampin");
      if (pinLock) {
        res.status(429).json({ error: "locked", message: auth.lockMessage(pinLock.lockedUntil) });
        return;
      }
      var pin = body.teamPin != null ? String(body.teamPin) : "";
      if (pin !== process.env.TEAM_PIN) {
        await auth.recordLoginFailure("teampin");
        res.status(401).json({ error: "wrong_pin" });
        return;
      }
      await auth.clearLoginFailures("teampin");
      var username = String(body.username || "").trim().toLowerCase();
      var password = String(body.password || "");
      if (!username || password.length < 4) {
        res.status(400).json({ error: "bad_request", message: "请填写用户名，密码至少 4 位" });
        return;
      }
      var existingUsers = await auth.getUsers();
      var activeUsers = existingUsers.filter(function (u) { return !u.deleted; });
      var existingUser = activeUsers.find(function (u) { return u.username === username; });

      if (!existingUser && activeUsers.length > 0) {
        // Not the bootstrap case, and this username isn't a real account —
        // refuse instead of silently creating one.
        res.status(404).json({
          error: "no_such_account",
          message: "还没有这个用户名的账号——新账号需要请管理员在「账号管理」里帮你开通，不能自己注册",
        });
        return;
      }

      var passwordHash = auth.hashPassword(password);
      var joinResult;
      if (existingUser) {
        // Password reset for an existing account — leave name/permissions
        // untouched, only replace the password hash.
        joinResult = await db.kvUpdate(auth.USERS_KEY, function (raw) {
          var users = Array.isArray(raw) ? raw.slice() : [];
          var idx = users.findIndex(function (u) { return u.username === username && !u.deleted; });
          if (idx === -1) {
            var err = new Error("no_such_account");
            err.httpStatus = 404;
            err.httpBody = { error: "no_such_account", message: "还没有这个用户名的账号——新账号需要请管理员在「账号管理」里帮你开通，不能自己注册" };
            throw err;
          }
          users[idx] = Object.assign({}, users[idx], { passwordHash: passwordHash });
          return { value: users, uid: users[idx].id, name: users[idx].name };
        });
      } else {
        // Bootstrap: no accounts exist yet at all, so this is the very
        // first one. Needs a name since there's no existing record to
        // reuse one from.
        var bootstrapName = String(body.name || "").trim() || username;
        joinResult = await db.kvUpdate(auth.USERS_KEY, function (raw) {
          var users = Array.isArray(raw) ? raw.slice() : [];
          // Re-check under the lock in case another request bootstrapped
          // the first account in between our read and write.
          if (users.some(function (u) { return !u.deleted; })) {
            var err = new Error("no_such_account");
            err.httpStatus = 404;
            err.httpBody = { error: "no_such_account", message: "还没有这个用户名的账号——新账号需要请管理员在「账号管理」里帮你开通，不能自己注册" };
            throw err;
          }
          var uid = genId();
          users.push({
            id: uid,
            name: bootstrapName,
            username: username,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
          });
          return { value: users, uid: uid, name: bootstrapName };
        });
      }
      setSessionCookie(res, joinResult.uid);
      res.status(200).json({ ok: true, name: joinResult.name });
      return;
    }

    // Normal login with an existing personal account.
    var username2 = String(body.username || "").trim().toLowerCase();
    var password2 = String(body.password || "");
    var loginLockKey = "login:" + username2;
    var loginLock = username2 ? await auth.checkLoginLock(loginLockKey) : null;
    if (loginLock) {
      res.status(429).json({ error: "locked", message: auth.lockMessage(loginLock.lockedUntil) });
      return;
    }
    var users2 = await auth.getUsers();
    var u = users2.find(function (x) { return x.username === username2 && !x.deleted; });
    if (!u || !auth.verifyPassword(password2, u.passwordHash)) {
      if (username2) await auth.recordLoginFailure(loginLockKey);
      res.status(401).json({ error: "wrong_login" });
      return;
    }
    await auth.clearLoginFailures(loginLockKey);
    setSessionCookie(res, u.id);
    res.status(200).json({ ok: true, name: u.name });
  } catch (err) {
    if (err && err.httpStatus) {
      res.status(err.httpStatus).json(err.httpBody);
      return;
    }
    res.status(500).json({ error: "server_error", message: (err && err.message) || "unknown" });
  }
};
