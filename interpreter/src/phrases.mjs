// Schnellsätze für die App: Knopf drücken -> der Gesprächspartner hört den Satz sofort auf Deutsch.
// Werden beim Start einmal vertont (clips.mjs), deshalb ohne Wartezeit.
export const PHRASES = [
  { key: "repeat", ru: "Повторите, пожалуйста", de: "Können Sie das bitte wiederholen?" },
  { key: "slower", ru: "Помедленнее, пожалуйста", de: "Bitte etwas langsamer." },
  { key: "spell", ru: "Продиктуйте по буквам", de: "Können Sie das bitte buchstabieren?" },
  { key: "moment", ru: "Минуту, пожалуйста", de: "Einen Moment bitte." },
  { key: "yes", ru: "Да, верно", de: "Ja, genau." },
  { key: "no", ru: "Нет", de: "Nein." },
  { key: "letter", ru: "Пришлите письменно", de: "Können Sie mir das bitte schriftlich schicken?" },
  { key: "email", ru: "Можно по e-mail?", de: "Können Sie mir das bitte per E-Mail schicken?" },
  { key: "german", ru: "Я плохо говорю по-немецки", de: "Ich spreche nicht so gut Deutsch, deshalb nutze ich einen Dolmetscher." },
  { key: "bye", ru: "Спасибо, до свидания", de: "Vielen Dank, auf Wiederhören." },
];

export const phraseClipKey = (key) => `phrase_${key}`;
