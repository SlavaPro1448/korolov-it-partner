/**
 * Kundenstimmen aus überprüfbaren Quellen.
 *
 * Regeln für diese Datei:
 * - Nur echte, öffentlich nachprüfbare Rückmeldungen mit Link zur Quelle.
 * - `quote` ist der unveränderte Originaltext. Nicht kürzen, nicht glätten,
 *   nicht übersetzen — sonst ist es kein Zitat mehr. Deshalb steht der
 *   deutsche Originaltext auch auf /ru und /uk; die Quelle ist verlinkt.
 * - Kein Review-JSON-LD dafür: Google ignoriert bzw. sanktioniert
 *   selbstreferenzielle Bewertungs-Markups auf der eigenen Unternehmensseite.
 */
export type Testimonial = {
  id: string;
  /** Originaltext, unverändert übernommen. */
  quote: string;
  /** Sprache des Originalzitats. */
  quoteLocale: "de";
  author: string;
  rating: number;
  /** Anzeigename der Quelle, z. B. "Google-Rezension". */
  source: string;
  /** Link zum öffentlichen Original, damit das Zitat überprüfbar bleibt. */
  sourceUrl: string;
  /** Grober Zeitpunkt der Veröffentlichung. */
  date: string;
};

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/Korolov+IT+Service/@51.0280169,7.006804,17z/data=!3m1!4b1!4m6!3m5!1s0x47bf2f914131ec29:0xe45edaccea4dea0!8m2!3d51.0280169!4d7.006804!16s%2Fg%2F11zbfj169z";

export const testimonials: Testimonial[] = [
  {
    id: "maczewski-google",
    quote:
      "Top Zusammenarbeit & erstklassiges Ergebnis! Die Zusammenarbeit mit Viacheslav war von Anfang bis Ende absolut klasse. Alle Absprachen wurden extrem sauber, zügig und wie vereinbart umgesetzt. Besonders geschätzt habe ich, dass er nicht nur stur Vorgaben abgearbeitet, sondern auch eigene, sehr durchdachte Ideen eingebracht hat, die das Projekt spürbar aufgewertet haben. Das Ergebnis überzeugt auf ganzer Linie: Eine moderne, blitzschnelle Website, bei der ich dank des eingerichteten CMS nun alle relevanten Inhalte problemlos selbst verwalten kann. Wer einen verlässlichen, technisch versierten und mitdenkenden Partner für seine Website sucht, ist hier an der richtigen Adresse. Uneingeschränkte Empfehlung!",
    quoteLocale: "de",
    author: "Tobias Maczewski",
    rating: 5,
    source: "Google-Rezension",
    sourceUrl: GOOGLE_REVIEWS_URL,
    date: "Juli 2026",
  },
];
