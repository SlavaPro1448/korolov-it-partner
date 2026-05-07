import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Wrench,
  Mail,
  LifeBuoy,
  FileText,
  ShieldCheck,
  UserCheck,
  HardHat,
  Building2,
  Scale,
  Users,
  Languages,
  Phone,
  MapPin,
  MessageSquare,
  Sparkles,
  Check,
  Star,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, localBusinessSchema } from "@/lib/structured-data";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/ua")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Korolov IT-Service | Сайти та IT-підтримка в Leverkusen",
      description:
        "Korolov IT-Service допомагає малому бізнесу в Leverkusen, Köln і NRW із сайтами, поштою, хостингом та IT-підтримкою.",
      path: "/ua",
      locale: "ua",
    }),
  }),
  component: UkrainianHomePage,
});

function UkrainianHomePage() {
  const faqItems = faqs.map((item) => ({ question: item.q, answer: item.a }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={localBusinessSchema("uk")} />
      <JsonLd data={faqPageSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Головна", item: "https://korolov-it-service.de/ua" },
        ])}
      />
      <SiteHeader locale="ua" basePath="/ua" />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Services />
        <ForWhom />
        <Pricing />
        <Process />
        <References />
        <About />
        <FAQ />
        <Contact />
      </main>
      <SiteFooter locale="ua" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-grid-bg relative overflow-hidden">
      <div className="container-page py-20 md:py-28 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent-blue" />
            IT-партнер для малого бізнесу в NRW
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-brand leading-[1.05]">
            Сучасні сайти.<br />
            Надійна IT-підтримка.<br />
            <span className="text-accent-blue">Зрозумілий супровід.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Допомагаю малому бізнесу в Leverkusen, Köln і NRW із сайтами, діловою поштою,
            хостингом, IT-підтримкою та цифровою організацією процесів.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="w-full sm:w-auto whitespace-normal h-auto py-3 text-center leading-snug"
            >
              <a href="#kontakt">
                Замовити безкоштовну консультацію <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto whitespace-normal h-auto py-3 text-center leading-snug"
            >
              <a href="#leistungen">Переглянути послуги</a>
            </Button>
          </div>
          <ul className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl">
            {[
              "Прямий контакт із фахівцем",
              "Сайт та IT з одних рук",
              "Консультації DE · RU · UA",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="h-5 w-5 text-accent-teal shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-tr from-accent-blue/10 to-transparent rounded-3xl blur-2xl" />
      <div className="relative card-soft p-6 md:p-7">
        <div className="mt-1 space-y-3">
          <MiniRow icon={<Globe className="h-4 w-4" />} label="Сайт компанії" value="активний · SSL" tone="teal" />
          <MiniRow icon={<Mail className="h-4 w-4" />} label="Ділова пошта" value="info@…de" tone="blue" />
          <MiniRow icon={<ShieldCheck className="h-4 w-4" />} label="Бекапи й оновлення" value="актуально" tone="teal" />
          <MiniRow icon={<LifeBuoy className="h-4 w-4" />} label="Техпідтримка" value="на зв'язку" tone="blue" />
        </div>
      </div>
    </div>
  );
}

function MiniRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "blue" | "teal";
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5">
      <div className="flex items-center gap-2.5 text-sm text-foreground/80">
        <span className={tone === "blue" ? "text-accent-blue" : "text-accent-teal"}>{icon}</span>
        {label}
      </div>
      <span className="text-xs font-medium text-foreground/70">{value}</span>
    </div>
  );
}

function Problem() {
  const items = [
    { title: "Пояснюю просто", text: "Без складного технічного жаргону: зрозуміло, що і навіщо робиться." },
    { title: "Роблю системно", text: "Охайна реалізація з фокусом на надійність, безпеку та стабільність." },
    { title: "Підтримую після запуску", text: "За потреби беру на себе регулярний технічний супровід." },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container-page max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-brand leading-tight">
          Невеликому бізнесу частіше потрібен не великий підрядник, а{" "}
          <span className="text-accent-blue">надійний технічний партнер</span>.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-3xl">
          Застарілий сайт, проблеми з поштою, форми що не працюють, оновлення які постійно
          відкладаються, або в команді немає відповідального за техніку. Саме тут я допомагаю:
          практично, зрозуміло і з фокусом на потреби вашого бізнесу.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {items.map((it) => (
            <div key={it.title} className="card-soft p-6">
              <CheckCircle2 className="h-5 w-5 text-accent-blue" />
              <h3 className="mt-4 font-semibold text-brand">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    icon: Globe,
    title: "Створення сайтів",
    text:
      "Сучасні, швидкі та адаптивні сайти для компаній, самозайнятих і локальних сервісів. Чітка структура та професійний вигляд під ваші послуги.",
    tags: ["Responsive Design", "SEO-основа", "Форма зворотного зв'язку", "SSL"],
  },
  {
    icon: Wrench,
    title: "Підтримка та обслуговування сайту",
    text:
      "Після запуску залишаюся вашим технічним контактним спеціалістом: оновлення, резервні копії, невеликі зміни та перевірка форм.",
    tags: ["Оновлення", "Бекапи", "Технічний контроль"],
  },
  {
    icon: Mail,
    title: "Пошта, домен та хостинг",
    text:
      "Налаштування ділової пошти, домену, хостингу, DNS, SPF, DKIM, DMARC і стабільної відправки форм.",
    tags: ["Домен", "Business E-mail", "DNS", "SMTP"],
  },
  {
    icon: LifeBuoy,
    title: "IT-підтримка для малого бізнесу",
    text:
      "Допомога з комп'ютерами, мережею, принтерами, хмарою, резервним копіюванням і щоденними технічними питаннями.",
    tags: ["Віддалено", "On-site", "Мережа", "Хмара"],
  },
  {
    icon: FileText,
    title: "Цифрові документи та порядок",
    text:
      "Структура для рахунків, комерційних пропозицій, PDF-шаблонів, QR-кодів і цифрового архіву документів.",
    tags: ["Рахунки", "Пропозиції", "PDF", "QR-коди"],
  },
  {
    icon: ShieldCheck,
    title: "Технічна реалізація DSGVO",
    text:
      "Технічне впровадження SSL, cookie-банера, форм, сторінок Impressum і Datenschutz. Юридичні тексти бажано додатково перевірити в профільному сервісі або у юриста.",
    tags: ["SSL", "Cookie-банер", "Datenschutz", "Impressum"],
  },
];

function Services() {
  return (
    <section id="leistungen" className="py-20 md:py-28 bg-section scroll-mt-20">
      <div className="container-page">
        <SectionHeading eyebrow="Послуги" title="Цифрові рішення для щоденних бізнес-завдань" />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <article key={s.title} className="card-soft p-6 flex flex-col">
              <div className="h-11 w-11 rounded-xl bg-brand/5 text-accent-blue flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-brand text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{s.text}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-section text-foreground/70 border border-border">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const audiences = [
  { icon: UserCheck, title: "Підприємці та самозайняті", text: "Професійний старт із надійною технічною основою." },
  { icon: HardHat, title: "Локальні сервіси та майстри", text: "Зрозумілий сайт з послугами та контактами." },
  { icon: Building2, title: "Керуючі компанії та сервіси нерухомості", text: "Структурована подача послуг і технічна підтримка в щоденній роботі." },
  { icon: Scale, title: "Офіси, практики та консультаційні служби", text: "Професійний онлайн-образ, безпечна пошта й надійний технічний контакт." },
  { icon: Users, title: "Невеликі компанії без власного IT-відділу", text: "Один відповідальний спеціаліст із сайту, пошти, хостингу й щоденних IT-питань." },
  { icon: Languages, title: "Багатомовні підприємці в Німеччині", text: "Консультації та реалізація німецькою, російською та українською." },
];

function ForWhom() {
  return (
    <section id="fuer-wen" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page">
        <SectionHeading eyebrow="Для кого" title="Кому підходить Korolov IT-Service" />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {audiences.map((a) => (
            <div key={a.title} className="card-soft p-6">
              <a.icon className="h-5 w-5 text-accent-teal" />
              <h3 className="mt-4 font-semibold text-brand">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const packages = [
  {
    name: "Start Website",
    price: "від 890 €",
    suffix: "netto",
    desc: "Для самозайнятих і невеликих компаній, яким потрібен професійний старт.",
    features: ["1-3 сторінки", "Адаптивний дизайн", "Контактна форма", "SSL та підключення домену", "Базове SEO"],
    recommended: false,
  },
  {
    name: "Business Website",
    price: "від 1.500 €",
    suffix: "netto",
    desc: "Для компаній із кількома напрямами послуг і більш складною структурою.",
    features: ["4-7 сторінок", "Індивідуальна структура", "Сторінки послуг", "Контактна форма та e-mail інтеграція", "SEO-основа", "Допомога з текстами за домовленістю"],
    recommended: true,
  },
  {
    name: "Digital Setup",
    price: "від 390 €",
    suffix: "netto",
    desc: "Для чистого налаштування домену, пошти та технічної бази компанії.",
    features: ["Налаштування домену та хостингу", "Ділова e-mail адреса", "SPF, DKIM, DMARC", "Підпис e-mail", "Відправка форм", "Базове налаштування Google Business Profile"],
    recommended: false,
  },
  {
    name: "Щомісячний супровід",
    price: "від 79 €",
    suffix: "/ місяць",
    desc: "Регулярна технічна підтримка після запуску.",
    features: ["Оновлення та резервні копії", "Регулярна технічна перевірка", "Невеликі зміни за домовленістю", "Перевірка форм", "Постійний технічний контакт"],
    note: "Обсяг робіт і час реакції узгоджуються індивідуально.",
    recommended: false,
  },
];

function Pricing() {
  return (
    <section id="preise" className="py-20 md:py-28 bg-section scroll-mt-20">
      <div className="container-page">
        <SectionHeading eyebrow="Пакети та ціни" title="Прозорі стартові пропозиції" />
        <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {packages.map((p) => (
            <div key={p.name} className={`relative card-soft p-6 flex flex-col ${p.recommended ? "ring-2 ring-accent-blue border-accent-blue" : ""}`}>
              {p.recommended && (
                <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-accent-blue text-white text-xs font-medium px-2.5 py-1">
                  <Star className="h-3 w-3" /> Рекомендовано
                </div>
              )}
              <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <div className="text-3xl font-bold text-brand">{p.price}</div>
                <div className="text-sm text-muted-foreground">{p.suffix}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              <ul className="mt-5 space-y-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                    <Check className="h-4 w-4 text-accent-teal shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {"note" in p && p.note && (
                <p className="mt-4 text-xs text-muted-foreground italic">{p.note}</p>
              )}
              <Button asChild variant={p.recommended ? "brand" : "outline"} className="mt-6">
                <a href="#kontakt">Залишити заявку</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    {
      title: "Безкоштовна первинна консультація",
      text: "Обговорюємо ваш бізнес, поточну ситуацію та цілі.",
    },
    {
      title: "Короткий аналіз і рекомендації",
      text: "Визначаю оптимальне рішення: сайт, пошта, хостинг, підтримка або комбінація.",
    },
    {
      title: "Прозора комерційна пропозиція",
      text: "Ви отримуєте чіткий обсяг робіт, вартість і наступні кроки.",
    },
    {
      title: "Реалізація",
      text: "Виконую узгоджені завдання структуровано та зрозуміло.",
    },
    {
      title: "Передача та супровід",
      text: "Після запуску пояснюю, як усе працює. За потреби беру на себе подальшу підтримку.",
    },
  ];

  return (
    <section id="ablauf" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page">
        <SectionHeading eyebrow="Етапи" title="Як проходить співпраця" subtitle="Чітко, структуровано й без сюрпризів." />
        <ol className="mt-12 grid gap-5 lg:grid-cols-5 md:grid-cols-2">
          {steps.map((step, i) => (
            <li key={step.title} className="card-soft p-6 relative">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Крок {i + 1}</div>
              <div className="mt-2 h-9 w-9 rounded-lg bg-brand text-brand-foreground flex items-center justify-center font-semibold">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold text-brand">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function References() {
  const refs = [
    {
      title: "Hausverwaltung Natalie Frank",
      type: "Сайт і технічний супровід",
      text:
        "Професійний вебсайт для компанії з управління нерухомістю: чітка структура, контакти та налаштована технічна база.",
      cta: "Переглянути проєкт",
      href: "#",
    },
    {
      title: "IT-підтримка для офісу / практики",
      type: "IT-підтримка та обслуговування",
      text:
        "Регулярна технічна підтримка в щоденній роботі з фокусом на надійність, конфіденційність і практичні рішення.",
      cta: "Дізнатися більше",
      href: "#",
    },
  ];

  return (
    <section id="referenzen" className="py-20 md:py-28 bg-section scroll-mt-20">
      <div className="container-page">
        <SectionHeading eyebrow="Референси" title="Вибрані проєкти" subtitle="Приклади з попередньої співпраці." />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {refs.map((r) => (
            <article key={r.title} className="card-soft p-7 flex flex-col">
              <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-brand/90 to-accent-blue/80 relative overflow-hidden">
                <div className="absolute bottom-4 left-5 text-white">
                  <div className="text-xs uppercase tracking-wider opacity-80">{r.type}</div>
                  <div className="text-lg font-semibold">{r.title}</div>
                </div>
              </div>
              <p className="mt-5 text-sm text-muted-foreground leading-relaxed flex-1">{r.text}</p>
              <Button asChild variant="outline" className="mt-5 self-start">
                <a href={r.href}>
                  {r.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const trust = [
    "Персональний супровід",
    "Зрозуміла комунікація без зайвої технічної термінології",
    "Практичні рішення для щоденних бізнес-завдань",
    "Консультації німецькою, російською та українською",
  ];
  return (
    <section id="ueber-mich" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">Про мене</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">
            Про Korolov IT-Service
          </h2>
          <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
            <p>
              Мене звати <span className="font-medium text-brand">Viacheslav Korolov</span>. Я
              допомагаю малому бізнесу, приватним фахівцям і локальним сервісам у Leverkusen, Köln та NRW
              із сайтами, діловою поштою, IT-питаннями та цифровою організацією.
            </p>
            <p>
              Моя мета - вирішувати технічні задачі просто і практично. Багатьом компаніям не
              потрібна велика агенція, а потрібен надійний партнер, який пояснює, реалізує
              і залишається на зв'язку після запуску.
            </p>
          </div>
          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {trust.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground/85">
                <CheckCircle2 className="h-5 w-5 text-accent-teal shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <div className="card-soft p-7 bg-gradient-to-br from-white to-section">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 pt-1">
                <div className="font-semibold text-brand text-lg">Viacheslav Korolov</div>
                <div className="text-sm text-muted-foreground">Засновник · Korolov IT-Service</div>
              </div>
              <div className="w-24 sm:w-28 aspect-[4/5] rounded-2xl overflow-hidden shadow-sm shrink-0">
                <img
                  src="/images/viacheslav-portrait-v4.jpeg"
                  alt="Viacheslav Korolov – Inhaber Korolov IT-Service"
                  loading="lazy"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="mt-6 space-y-2.5 text-sm text-foreground/80">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent-blue" /> Leverkusen, NRW</div>
              <div className="flex items-center gap-2"><Languages className="h-4 w-4 text-accent-blue" /> Deutsch · Русский · Українська</div>
              <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-accent-blue" /> Прямий контакт без посередників</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Скільки часу займає створення сайту?",
    a: "Простий сайт зазвичай займає від кількох днів до кількох тижнів - залежно від контенту та погоджень.",
  },
  {
    q: "Чи можна вносити зміни після запуску?",
    a: "Так. Можна узгодити регулярну технічну підтримку та невеликі доопрацювання.",
  },
  {
    q: "Ви допомагаєте з доменом і поштою?",
    a: "Так. Допомагаю з доменом, хостингом, діловою поштою, DNS, SPF, DKIM, DMARC і налаштуванням відправки форм.",
  },
  {
    q: "Наскільки сайт відповідає DSGVO?",
    a: "Я допомагаю з технічною DSGVO-орієнтованою реалізацією. Юридичні тексти бажано додатково перевірити через профільний сервіс або у юриста.",
  },
  {
    q: "Ви працюєте також офлайн?",
    a: "Залежно від проєкту можлива віддалена робота та підтримка у Leverkusen, Köln і навколишніх районах.",
  },
  {
    q: "Чи можлива консультація російською або українською?",
    a: "Так, консультації можливі німецькою, російською та українською мовами.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-28 bg-section">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Часті запитання" subtitle="Відповіді на найпоширеніші запитання перед першою консультацією." />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="card-soft overflow-hidden">
                <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between text-left p-5 gap-4" aria-expanded={isOpen}>
                  <span className="font-medium text-brand">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <div className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed">{f.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="kontakt" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">Контакти</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">Запросити безкоштовну консультацію</h2>
          <div className="mt-8 space-y-4">
            <ContactRow icon={<Mail className="h-5 w-5" />} label="E-mail" value="info@korolov-it-service.de" />
            <ContactRow icon={<Phone className="h-5 w-5" />} label="Телефон / WhatsApp" value="+49 …" />
            <ContactRow icon={<MapPin className="h-5 w-5" />} label="Локація" value="Leverkusen, NRW" />
            <ContactRow icon={<Languages className="h-5 w-5" />} label="Мови" value="Deutsch · Русский · Українська" />
            <ContactRow icon={<MessageSquare className="h-5 w-5" />} label="Формат" value="Віддалено та за домовленістю on-site" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="card-soft p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Ім'я" required>
                <Input required name="name" placeholder="Ваше ім'я" />
              </Field>
              <Field label="Компанія">
                <Input name="company" placeholder="Назва компанії (опціонально)" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="E-mail" required>
                <Input required type="email" name="email" placeholder="your@email.de" />
              </Field>
              <Field label="Телефон">
                <Input name="phone" placeholder="опціонально" />
              </Field>
            </div>
            <Field label="Тема звернення" required>
              <Select name="topic">
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть варіант" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Створення сайту</SelectItem>
                  <SelectItem value="support">Підтримка сайту</SelectItem>
                  <SelectItem value="email-domain">Пошта, домен і хостинг</SelectItem>
                  <SelectItem value="it-support">IT-підтримка</SelectItem>
                  <SelectItem value="other">Інше</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Повідомлення" required>
              <Textarea required name="message" rows={5} placeholder="Коротко опишіть вашу задачу..." />
            </Field>

            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <Checkbox id="dsgvo-ua" checked={agreed} onCheckedChange={(v) => setAgreed(Boolean(v))} required />
              <span>
                Я ознайомився(лась) з{" "}
                <a href="/datenschutz" className="text-accent-blue underline">політикою конфіденційності</a>{" "}
                та погоджуюся на обробку даних для зв'язку.
              </span>
            </label>

            <Button type="submit" variant="brand" size="lg" disabled={!agreed} className="w-full sm:w-auto">
              Надіслати заявку <ArrowRight className="h-4 w-4" />
            </Button>

            {submitted && (
              <div className="rounded-lg border border-border bg-section p-4 text-sm text-foreground/85">
                Форма поки що не підключена до сервісу відправки.
                <br />
                Напишіть, будь ласка, напряму на{" "}
                <a className="text-accent-blue underline" href="mailto:info@korolov-it-service.de">
                  info@korolov-it-service.de
                </a>
                .
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-lg bg-section text-accent-blue flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-foreground/80">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">{eyebrow}</div>
      <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
