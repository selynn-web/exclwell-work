// Supabase client + tiny key/value helpers on top of a single table.
// Table needed in Supabase (see README for the exact SQL to run once):
//   kv_store(key text primary key, value jsonb, updated_at timestamptz)

const { createClient } = require("@supabase/supabase-js");

let client = null;
function getClient() {
  if (!client) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("supabase_not_configured");
    }
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}

async function kvGet(key) {
  var supabase = getClient();
  var res = await supabase.from("kv_store").select("value").eq("key", key).maybeSingle();
  if (res.error) throw res.error;
  return res.data ? res.data.value : null;
}

async function kvSet(key, value) {
  var supabase = getClient();
  var res = await supabase
    .from("kv_store")
    .upsert({ key: key, value: value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (res.error) throw res.error;
}

// Version-aware read: also returns the row's updated_at so a caller can do
// an optimistic-concurrency write back (see kvSetIfUnchanged / kvUpdate).
async function kvGetWithVersion(key) {
  var supabase = getClient();
  var res = await supabase.from("kv_store").select("value, updated_at").eq("key", key).maybeSingle();
  if (res.error) throw res.error;
  return res.data ? { value: res.data.value, updatedAt: res.data.updated_at } : { value: null, updatedAt: null };
}

// Write back only if the row's updated_at still matches what we read
// (expectedUpdatedAt). Returns false — meaning "someone else wrote in
// between, try again" — instead of throwing, so callers can retry.
async function kvSetIfUnchanged(key, value, expectedUpdatedAt) {
  var supabase = getClient();
  var newTimestamp = new Date().toISOString();
  if (expectedUpdatedAt) {
    var res = await supabase
      .from("kv_store")
      .update({ value: value, updated_at: newTimestamp })
      .eq("key", key)
      .eq("updated_at", expectedUpdatedAt)
      .select("key");
    if (res.error) throw res.error;
    return !!(res.data && res.data.length > 0);
  }
  // No row existed when we read — try a plain insert. If another request
  // created the row first, this fails on the primary key; the caller
  // retries and takes the update-with-match path above instead.
  var insertRes = await supabase.from("kv_store").insert({ key: key, value: value, updated_at: newTimestamp });
  if (insertRes.error) {
    if (insertRes.error.code === "23505") return false; // unique violation -> lost the race, retry
    throw insertRes.error;
  }
  return true;
}

// Read-modify-write with automatic retry on a concurrent write.
// `mutate(currentValue)` receives the current stored value (or null) and
// must return the new value to store. It may run more than once if another
// request wins the race, so it should be side-effect-free apart from
// deriving the new value (no direct DB/network calls inside it).
async function kvUpdate(key, mutate, maxAttempts) {
  var attempts = maxAttempts || 8;
  for (var i = 0; i < attempts; i++) {
    var current = await kvGetWithVersion(key);
    var next = await mutate(current.value);
    var ok = await kvSetIfUnchanged(key, next.value, current.updatedAt);
    if (ok) return next;
  }
  throw new Error("conflict_retry_exhausted");
}

module.exports = {
  getClient: getClient,
  kvGet: kvGet,
  kvSet: kvSet,
  kvGetWithVersion: kvGetWithVersion,
  kvSetIfUnchanged: kvSetIfUnchanged,
  kvUpdate: kvUpdate,
};
