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

module.exports = { getClient: getClient, kvGet: kvGet, kvSet: kvSet };
