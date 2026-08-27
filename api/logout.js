module.exports = async function handler(req, res) {
  res.setHeader("Set-Cookie", "team_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure");
  res.status(200).json({ ok: true });
};
