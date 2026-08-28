// Daily email digest of overdue / soon-due items — 追踪记录 (trackers),
// 汽车管理 (vehicle road tax & insurance), 设备校准记录 (equipment
// calibration/maintenance). Unlike every other reminder in this app
// (WhatsApp: one click at a time, a person reviews and taps Send), this
// one sends on its own, with nobody in the loop — see the email-reminder
// section in README before turning it on.
//
// Runs two ways:
//   1. Vercel Cron (see vercel.json), once a day. Vercel signs the request
//      with `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set
//      as an env var — that's how this tells a real scheduled run apart
//      from a public GET request to this same URL.
//   2. A manual "send test email now" button in 账号管理 (gated behind
//      the normal login-session cookie + accounts-module permission), so
//      the user can confirm their setup works without waiting a day.
//      A manual send always goes out (even a "nothing due" test message,
//      so a click reliably produces a visible email) and never touches
//      the once-a-day guard below, so it can't block or double up with
//      that day's real scheduled send.

const db = require("../_db");
const auth = require("../_auth");
const { sendEmail } = require("../_email");

const STATE_KEY = "team-archive:state";
const REMINDER_LOG_KEY = "team-archive:reminder_log";

function daysUntil(dateStr) {
  if (!dateStr) return null;
  var due = new Date(dateStr + "T00:00:00");
  if (isNaN(due.getTime())) return null;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

// Mirrors trackerReminderInfo() in public/app.js (same 3-day window, same
// "already completed / already flagged overdue" exclusions) so the email
// digest agrees with what the app itself shows as due.
function trackerDue(r) {
  if (!r || r.deleted || r.status === "已完成") return null;
  var days = daysUntil(r.dueDate);
  var overdue = r.status === "已延误" || (days !== null && days < 0);
  if (overdue) return { overdue: true, days: days !== null ? Math.abs(days) : null };
  if (days !== null && days <= 3) return { overdue: false, days: days };
  return null;
}

function expiryStatus(dateStr, warnDays) {
  var days = daysUntil(dateStr);
  if (days === null) return null;
  if (days < 0) return { overdue: true, days: Math.abs(days) };
  if (days <= warnDays) return { overdue: false, days: days };
  return null;
}

// Mirrors vehicleReminderUrgent() — 30-day window, skips decommissioned
// vehicles.
function vehicleDue(r) {
  if (!r || r.deleted || r.status === "已停用") return null;
  var rt = expiryStatus(r.roadTaxExpiry, 30);
  var ins = expiryStatus(r.insuranceExpiry, 30);
  if (!rt && !ins) return null;
  return { roadTax: rt, insurance: ins };
}

// Mirrors calibrations' extraBadge() — 14-day window.
function calibrationDue(r) {
  if (!r || r.deleted) return null;
  return expiryStatus(r.nextDueDate, 14);
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function fmtDays(d) {
  if (d.overdue) return "已逾期 " + d.days + " 天";
  if (d.days === 0) return "今天到期";
  return d.days + " 天后到期";
}

function buildDigest(state) {
  var trackers = (state.trackers || [])
    .map(function (r) { var info = trackerDue(r); return info ? { r: r, info: info } : null; })
    .filter(Boolean);

  var vehicles = (state.vehicles || [])
    .map(function (r) { var info = vehicleDue(r); return info ? { r: r, info: info } : null; })
    .filter(Boolean);

  var calibrations = (state.calibrations || [])
    .map(function (r) { var info = calibrationDue(r); return info ? { r: r, info: info } : null; })
    .filter(Boolean);

  var total = trackers.length + vehicles.length + calibrations.length;
  if (!total) return null;

  var sections = [];

  if (trackers.length) {
    sections.push(
      "<h2>追踪记录（" + trackers.length + "）</h2><ul>" +
        trackers
          .map(function (x) {
            return "<li><b>" + esc(x.r.title || x.r.id) + "</b> — " + fmtDays(x.info) +
              (x.r.owner ? "（负责人：" + esc(x.r.owner) + "）" : "") + "</li>";
          })
          .join("") +
        "</ul>"
    );
  }

  if (vehicles.length) {
    sections.push(
      "<h2>车辆到期提醒（" + vehicles.length + "）</h2><ul>" +
        vehicles
          .map(function (x) {
            var bits = [];
            if (x.info.roadTax) bits.push("路税：" + fmtDays(x.info.roadTax));
            if (x.info.insurance) bits.push("保险：" + fmtDays(x.info.insurance));
            return "<li><b>" + esc(x.r.plateNo || x.r.id) + "</b>" +
              (x.r.model ? "（" + esc(x.r.model) + "）" : "") +
              " — " + bits.join("，") +
              (x.r.responsible ? "（负责人：" + esc(x.r.responsible) + "）" : "") + "</li>";
          })
          .join("") +
        "</ul>"
    );
  }

  if (calibrations.length) {
    sections.push(
      "<h2>设备校准 / 保养到期（" + calibrations.length + "）</h2><ul>" +
        calibrations
          .map(function (x) {
            return "<li><b>" + esc(x.r.equipment || x.r.id) + "</b> — " + fmtDays(x.info) + "</li>";
          })
          .join("") +
        "</ul>"
    );
  }

  var html =
    '<div style="font-family:sans-serif;line-height:1.6;color:#222;">' +
    "<p>团队档案台 每日提醒 · " + new Date().toISOString().slice(0, 10) + "</p>" +
    sections.join("") +
    '<p style="color:#888;font-size:12px;margin-top:24px;">这是系统自动发送的提醒邮件，无需回复。</p>' +
    "</div>";

  return { html: html, total: total };
}

module.exports = async function handler(req, res) {
  try {
    var cronSecret = process.env.CRON_SECRET;
    var authHeader = req.headers.authorization || "";
    var isCron = !!cronSecret && authHeader === "Bearer " + cronSecret;
    var manual = false;

    if (!isCron) {
      var me = await auth.currentUser(req);
      if (!me || !auth.canAccess(me, "accounts")) {
        res.status(401).json({ error: "unauthorized" });
        return;
      }
      manual = true;
    }

    if (!process.env.RESEND_API_KEY || !process.env.REMINDER_EMAIL_TO) {
      res.status(200).json({ sent: false, reason: "not_configured" });
      return;
    }

    var today = new Date().toISOString().slice(0, 10);
    if (!manual) {
      var log = await db.kvGet(REMINDER_LOG_KEY);
      if (log && log.lastSentDate === today) {
        res.status(200).json({ sent: false, reason: "already_sent_today" });
        return;
      }
    }

    var state = (await db.kvGet(STATE_KEY)) || {};
    var digest = buildDigest(state);

    if (!digest) {
      if (manual) {
        await sendEmail({
          to: process.env.REMINDER_EMAIL_TO,
          subject: "团队档案台 测试邮件",
          html:
            '<div style="font-family:sans-serif;">这是一封测试邮件。邮件提醒功能已经设置成功——目前没有需要提醒的到期事项。</div>',
        });
        res.status(200).json({ sent: true, test: true, total: 0 });
        return;
      }
      res.status(200).json({ sent: false, reason: "nothing_due" });
      return;
    }

    await sendEmail({
      to: process.env.REMINDER_EMAIL_TO,
      subject: "团队档案台 每日提醒 · " + digest.total + " 项待处理",
      html: digest.html,
    });

    if (!manual) {
      await db.kvSet(REMINDER_LOG_KEY, { lastSentDate: today });
    }

    res.status(200).json({ sent: true, total: digest.total });
  } catch (err) {
    var msg = (err && err.message) || "server_error";
    res.status(500).json({ error: "server_error", message: msg, code: err && err.code });
  }
};
