// Minimal wrapper around Resend's HTTP API for sending the daily reminder
// digest email. No SDK dependency — Vercel's Node runtime has a global
// fetch, so sending an email is just one POST request.
//
// Needs RESEND_API_KEY (from https://resend.com — free tier, no business
// verification) set as a Vercel environment variable. Never put this key
// in chat or commit it to the repo — same rule as SUPABASE_SERVICE_ROLE_KEY.
async function sendEmail(opts) {
  var apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    var err = new Error("resend_not_configured");
    err.code = "resend_not_configured";
    throw err;
  }
  var from = process.env.REMINDER_EMAIL_FROM || "Team Archive <onboarding@resend.dev>";
  var toRaw = opts.to;
  var toList = Array.isArray(toRaw)
    ? toRaw
    : String(toRaw || "")
        .split(",")
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
  if (!toList.length) {
    var err2 = new Error("no_recipient");
    err2.code = "no_recipient";
    throw err2;
  }

  var res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: from, to: toList, subject: opts.subject, html: opts.html }),
  });
  var body = await res.json().catch(function () { return null; });
  if (!res.ok) {
    var err3 = new Error((body && (body.message || body.name)) || "resend_send_failed");
    err3.code = "resend_send_failed";
    err3.status = res.status;
    err3.detail = body;
    throw err3;
  }
  return body;
}

module.exports = { sendEmail: sendEmail };
