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
import { ReferencesSection } from "@/components/sections/ReferencesSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, localBusinessSchema } from "@/lib/structured-data";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/ru")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Korolov IT-Service | Сайты и IT-поддержка в Leverkusen",
      description:
        "Korolov IT-Service помогает малому бизнесу в Leverkusen, Köln и NRW с сайтами, почтой, хостингом, IT-поддержкой и цифровой организацией.",
      path: "/ru",
      locale: "ru",
    }),
  }),
  component: RussianHomePage,
});

function RussianHomePage() {
  const faqItems = faqs.map((item) => ({ question: item.q, answer: item.a }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={localBusinessSchema("ru")} />
      <JsonLd data={faqPageSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Главная", item: "https://korolov-it-service.de/ru" },
        ])}
      />
      <SiteHeader locale="ru" basePath="/ru" />
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
      <SiteFooter locale="ru" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-grid-bg relative overflow-hidden">
      <div className="container-page py-20 md:py-28 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent-blue" />
            IT-партнер для малого бизнеса в NRW
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-brand leading-[1.05]">
            Больше заявок с сайта и IT-поддержки из Леверкузена
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Помогаю малому бизнесу в Леверкузене с сайтом, деловой почтой, хостингом и
            IT-поддержкой - просто и надежно.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base bg-accent-blue hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/30"
            >
              <a href="#kontakt">
                Запросить бесплатную консультацию <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="default"
              className="w-full sm:w-auto"
            >
              <a href="#leistungen">Посмотреть услуги</a>
            </Button>
          </div>
          <ul className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl">
            {[
              "Личный контакт",
              "Сайт + IT",
              "DE · RU · UA",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="h-5 w-5 text-accent-teal shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 fade-in-up">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="text-xs text-muted-foreground">korolov-it-service.de</div>
        </div>
        <div className="mt-5 space-y-3">
          <MiniRow icon={<Globe className="h-4 w-4" />} label="Сайт" value="активен · SSL" tone="teal" />
          <MiniRow icon={<Mail className="h-4 w-4" />} label="Деловая почта" value="info@…de" tone="blue" />
          <MiniRow icon={<ShieldCheck className="h-4 w-4" />} label="Бэкапы и обновления" value="актуально" tone="teal" />
          <MiniRow icon={<LifeBuoy className="h-4 w-4" />} label="Техподдержка" value="на связи" tone="blue" />
        </div>
        <div className="mt-6 p-4 rounded-xl bg-section">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Languages className="h-3.5 w-3.5" /> Консультации
          </div>
          <div className="mt-1 text-sm text-foreground">
            Возможны на <span className="font-medium">немецком</span>,{" "}
            <span className="font-medium">русском</span> и{" "}
            <span className="font-medium">украинском</span>.
          </div>
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
    {
      title: "Понятно объясняю",
      text: "Без сложного жаргона. Вы всегда понимаете, что делается и зачем.",
    },
    {
      title: "Аккуратно реализую",
      text: "Структурный подход с фокусом на надежность, безопасность и прозрачность.",
    },
    {
      title: "Остаюсь на связи после проекта",
      text: "При необходимости беру на себя регулярное техническое сопровождение.",
    },
  ];
  return (
    <section className="py-20 md:py-28">
      <div className="container-page max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-brand leading-tight">
          Многим небольшим компаниям не нужна большая агентство — нужен{" "}
          <span className="text-accent-blue">надежный технический партнер</span>.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-3xl">
          Устаревший сайт, проблемы с почтой, неработающие формы и отсутствие ответственного за IT
          человека в команде. Именно здесь я подключаюсь: практично, понятно и с учетом задач
          вашего бизнеса.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {items.map((it) => (
            <div key={it.title} className="card-soft p-6">
              <div className="h-10 w-10 rounded-lg bg-section flex items-center justify-center text-accent-blue">
                <CheckCircle2 className="h-5 w-5" />
              </div>
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
    title: "Создание сайтов",
    text:
      "Современные, быстрые и адаптивные сайты для компаний, самозанятых и локальных услуг.",
    tags: ["Адаптивный дизайн", "SEO-основа", "Форма обратной связи", "SSL"],
  },
  {
    icon: Wrench,
    title: "Поддержка и обслуживание",
    text:
      "После запуска остаюсь вашим техническим контактом: обновления, бэкапы, мелкие доработки и помощь.",
    tags: ["Обновления", "Резервные копии", "Технический контроль"],
  },
  {
    icon: Mail,
    title: "Почта, домен и хостинг",
    text:
      "Настройка деловой почты, домена, хостинга, DNS, SPF, DKIM, DMARC и отправки форм.",
    tags: ["Домен", "Business E-mail", "DNS", "SMTP"],
  },
  {
    icon: LifeBuoy,
    title: "IT-поддержка для малого бизнеса",
    text:
      "Помощь с компьютерами, сетью, принтерами, облаком, резервным копированием и повседневными IT-вопросами.",
    tags: ["Удаленно", "На месте", "Сеть", "Облако"],
  },
  {
    icon: FileText,
    title: "Цифровые документы и порядок",
    text:
      "Структура для счетов, коммерческих предложений, PDF-шаблонов, QR-кодов и хранения документов.",
    tags: ["Счета", "Предложения", "PDF", "QR-коды"],
  },
  {
    icon: ShieldCheck,
    title: "Техническая реализация под DSGVO",
    text:
      "Техническое внедрение SSL, cookie-баннера, форм, страниц Impressum и Datenschutz.",
    tags: ["SSL", "Cookie-баннер", "Datenschutz", "Impressum"],
  },
];

function Services() {
  return (
    <section id="leistungen" className="py-20 md:py-28 bg-section scroll-mt-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Услуги"
          title="Цифровые решения для повседневных бизнес-задач"
          subtitle="От сайта до регулярного технического сопровождения."
        />
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
  { icon: UserCheck, title: "Самозанятые и предприниматели", text: "Нужен профессиональный старт и надежная техническая база." },
  { icon: HardHat, title: "Мастера и локальные сервисы", text: "Понятный сайт с услугами, контактами и локальным акцентом." },
  { icon: Building2, title: "Управляющие компании и сервисы недвижимости", text: "Структурная подача услуг и техническая поддержка в ежедневной работе." },
  { icon: Scale, title: "Юридические и консалтинговые офисы", text: "Солидный цифровой образ, безопасная почта и надежный IT-контакт." },
  { icon: Users, title: "Компании без собственного IT-отдела", text: "Один ответственный специалист по сайту, почте, хостингу и техвопросам." },
  { icon: Languages, title: "Многоязычные предприниматели в Германии", text: "Консультации и реализация на немецком, русском и украинском." },
];

function ForWhom() {
  return (
    <section id="fuer-wen" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page">
        <SectionHeading eyebrow="Для кого" title="Кому подходит Korolov IT-Service" subtitle="С кем я чаще всего работаю." />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {audiences.map((a) => (
            <div key={a.title} className="card-soft p-6">
              <div className="h-10 w-10 rounded-lg bg-section text-accent-teal flex items-center justify-center">
                <a.icon className="h-5 w-5" />
              </div>
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
    price: "от 890 €",
    suffix: "netto",
    desc: "Для самозанятых и небольших компаний, которым нужен профессиональный старт.",
    features: ["1-3 страницы", "Адаптивный дизайн", "Форма контакта", "SSL и подключение домена", "Базовое SEO"],
    recommended: false,
  },
  {
    name: "Business Website",
    price: "от 1.500 €",
    suffix: "netto",
    desc: "Для компаний с несколькими услугами и более сложной структурой.",
    features: ["4-7 страниц", "Индивидуальная структура", "Страницы услуг", "Форма и почтовая интеграция", "SEO-структура"],
    recommended: true,
  },
  {
    name: "Digital Setup",
    price: "от 390 €",
    suffix: "netto",
    desc: "Для аккуратной настройки домена, почты и базовой IT-инфраструктуры.",
    features: ["Домен и хостинг", "Деловая почта", "SPF, DKIM, DMARC", "Подпись e-mail", "Отправка формы"],
    recommended: false,
  },
  {
    name: "Ежемесячное сопровождение",
    price: "от 79 €",
    suffix: "/ месяц",
    desc: "Регулярная техническая поддержка после запуска.",
    features: [
      "Обновления и резервные копии",
      "Периодическая техническая проверка",
      "Небольшие изменения по согласованию",
      "Проверка форм",
      "Постоянный технический контакт",
    ],
    note: "Объем работ и сроки реакции согласуются индивидуально.",
    recommended: false,
  },
];

function Pricing() {
  return (
    <section id="preise" className="py-20 md:py-28 bg-section scroll-mt-20">
      <div className="container-page">
        <SectionHeading eyebrow="Пакеты и цены" title="Прозрачные стартовые тарифы" subtitle="Финальное предложение формируется после бесплатной консультации." />
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
                <a href="#kontakt">Запросить</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { title: "Бесплатная первичная консультация", text: "Обсуждаем ваш бизнес, текущую ситуацию и цели." },
  { title: "Краткий анализ и рекомендации", text: "Определяю оптимальное решение: сайт, почта, поддержка или комплекс." },
  { title: "Прозрачное предложение", text: "Вы получаете четкий объем работ, стоимость и следующие шаги." },
  { title: "Реализация", text: "Выполняю согласованные задачи структурно и последовательно." },
  { title: "Передача и сопровождение", text: "После запуска объясняю, как все работает, и при необходимости сопровождаю дальше." },
];

function Process() {
  return (
    <section id="ablauf" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page">
        <SectionHeading eyebrow="Этапы" title="Как строится сотрудничество" subtitle="Понятно, структурно и без сюрпризов." />
        <ol className="mt-12 grid gap-5 lg:grid-cols-5 md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.title} className="card-soft p-6 relative">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Шаг {i + 1}</div>
              <div className="mt-2 h-9 w-9 rounded-lg bg-brand text-brand-foreground flex items-center justify-center font-semibold">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold text-brand">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function References() {
  return <ReferencesSection locale="ru" />;
}

function About() {
  const trust = [
    "Личное сопровождение",
    "Понятная коммуникация",
    "Практические решения для ежедневных задач бизнеса",
    "Консультации возможны на немецком, русском и украинском",
  ];
  return (
    <section id="ueber-mich" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">Обо мне</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">О Korolov IT-Service</h2>
          <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
            <p>
              Меня зовут <span className="font-medium text-brand">Viacheslav Korolov</span>. Я помогаю
              малому бизнесу, самозанятым и локальным сервисам в Leverkusen, Köln и NRW с сайтами,
              деловой почтой и IT-задачами.
            </p>
            <p>
              Моя цель — сделать технические темы понятными и решить их практично. Вы получаете
              надежного специалиста, который объясняет, внедряет и остается на связи.
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
                <div className="text-sm text-muted-foreground">Основатель · Korolov IT-Service</div>
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
              <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-accent-blue" /> Личный контакт без посредников</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "Сколько времени занимает создание сайта?", a: "Простой сайт обычно занимает от нескольких дней до нескольких недель — в зависимости от контента и согласований." },
  { q: "Можно ли потом вносить изменения?", a: "Да, можно договориться о регулярной поддержке и небольших доработках." },
  { q: "Вы помогаете с доменом и почтой?", a: "Да, помогаю с доменом, хостингом, почтой, DNS и настройкой отправки форм." },
  { q: "Насколько сайт соответствует DSGVO?", a: "Я помогаю с технической DSGVO-ориентированной реализацией. Юридические тексты лучше дополнительно проверить у профильного сервиса или юриста." },
  { q: "Работаете ли вы офлайн?", a: "В зависимости от проекта возможна удаленная работа и выезд по Leverkusen и Köln." },
  { q: "Можно ли получить консультацию на русском или украинском?", a: "Да, консультации возможны на немецком, русском и украинском языках." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 md:py-28 bg-section">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Частые вопросы" subtitle="Ответы на основные вопросы перед первым разговором." />
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
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">Контакты</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">Запросить бесплатную консультацию</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Коротко опишите задачу, и я свяжусь с первичной оценкой.
          </p>
          <div className="mt-8 space-y-4">
            <ContactRow icon={<Mail className="h-5 w-5" />} label="E-mail" value="info@korolov-it-service.de" />
            <ContactRow icon={<Phone className="h-5 w-5" />} label="Телефон / WhatsApp" value="+49 …" />
            <ContactRow icon={<MapPin className="h-5 w-5" />} label="Локация" value="Leverkusen, NRW" />
            <ContactRow icon={<Languages className="h-5 w-5" />} label="Языки" value="Deutsch · Русский · Українська" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="card-soft p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Имя" required>
                <Input required name="name" placeholder="Ваше имя" />
              </Field>
              <Field label="Компания">
                <Input name="company" placeholder="Название компании (опционально)" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="E-mail" required>
                <Input required type="email" name="email" placeholder="your@email.de" />
              </Field>
              <Field label="Телефон">
                <Input name="phone" placeholder="опционально" />
              </Field>
            </div>
            <Field label="Тема запроса" required>
              <Select name="topic">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите вариант" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Создание сайта</SelectItem>
                  <SelectItem value="wartung">Поддержка сайта</SelectItem>
                  <SelectItem value="email-domain">Почта, домен и хостинг</SelectItem>
                  <SelectItem value="it-support">IT-поддержка</SelectItem>
                  <SelectItem value="digital-setup">Digital Setup</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Сообщение" required>
              <Textarea required name="message" rows={5} placeholder="Кратко опишите вашу задачу..." />
            </Field>

            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <Checkbox id="dsgvo-ru" checked={agreed} onCheckedChange={(v) => setAgreed(Boolean(v))} required />
              <span>
                Я ознакомился(ась) с{" "}
                <a href="/datenschutz" className="text-accent-blue underline">политикой конфиденциальности</a>{" "}
                и соглашаюсь на обработку данных для связи.
              </span>
            </label>

            <Button type="submit" variant="brand" size="lg" disabled={!agreed} className="w-full sm:w-auto">
              Отправить заявку <ArrowRight className="h-4 w-4" />
            </Button>

            {submitted && (
              <div className="rounded-lg border border-border bg-section p-4 text-sm text-foreground/85">
                Форма пока не подключена к сервису отправки.
                <br />
                Пожалуйста, напишите напрямую на{" "}
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
