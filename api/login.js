const auth = require("./_auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }
  if (!process.env.TEAM_PIN || !process.env.AUTH_SECRET) {
    res.status(500).json({ error: "server_not_configured" });
    return;
  }
  var body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (err) {
      body = null;
    }
  }
  var pin = body && body.pin != null ? String(body.pin) : "";
  if (pin !== process.env.TEAM_PIN) {
    res.status(401).json({ error: "wrong_pin" });
    return;
  }
  var token = auth.expectedToken();
  var maxAge = 60 * 60 * 24 * 180; // 180 days
  res.setHeader(
    "Set-Cookie",
    "team_auth=" + token + "; HttpOnly; Path=/; Max-Age=" + maxAge + "; SameSite=Lax; Secure"
  );
  res.status(200).json({ ok: true });
};
