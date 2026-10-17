// Kleiner dauerhafter Speicher (JSON-Datei im Volume /app/data): Einstellungen aus der App und je
// Gespräch nur Zahlen (wie lange übersetzt wurde) für die Kostenanzeige. Kein Text, kein Audio.
import fs from "node:fs";
import path from "node:path";

const KEEP_CALLS = 300;

export function createStore(file, { defaults = {}, log = console } = {}) {
  let data = { settings: { ...defaults }, calls: {} };
  if (file) {
    try {
      const saved = JSON.parse(fs.readFileSync(file, "utf8"));
      data = { settings: { ...defaults, ...saved.settings }, calls: saved.calls ?? {} };
    } catch (error) {
      if (error.code !== "ENOENT") log.error("[store]", error.message);
    }
  }

  function save() {
    if (!file) return;
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(`${file}.tmp`, JSON.stringify(data));
      fs.renameSync(`${file}.tmp`, file);
    } catch (error) {
      log.error("[store]", error.message);
    }
  }

  return {
    get settings() {
      return data.settings;
    },
    set(key, value) {
      data.settings[key] = value;
      save();
    },
    call(sid) {
      return data.calls[sid] ?? null;
    },
    get calls() {
      return data.calls;
    },
    recordCall(sid, info) {
      if (!sid) return;
      data.calls[sid] = { ...info, at: Date.now() };
      const sids = Object.keys(data.calls);
      if (sids.length > KEEP_CALLS) {
        sids
          .sort((a, b) => data.calls[a].at - data.calls[b].at)
          .slice(0, sids.length - KEEP_CALLS)
          .forEach((old) => delete data.calls[old]);
      }
      save();
    },
  };
}
