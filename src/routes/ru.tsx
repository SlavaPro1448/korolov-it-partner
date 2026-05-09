import { createFileRoute } from "@tanstack/react-router";
import React, { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Mail,
  LifeBuoy,
  ShieldCheck,
  Languages,
  Phone,
  MapPin,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Loader2,
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
import { COMPANY } from "@/config/legal";
import { ReferencesSection } from "@/components/sections/ReferencesSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, localBusinessSchema, organizationSchema, webSiteSchema } from "@/lib/structured-data";
import { buildHreflangLinks, buildSeoMeta } from "@/lib/seo";
import { About } from "@/components/home/About";
import { Problem } from "@/components/home/Problem";
import { Services } from "@/components/home/Services";
import { ForWhom } from "@/components/home/ForWhom";
import { Pricing } from "@/components/home/Pricing";
import { Process } from "@/components/home/Process";

export const Route = createFileRoute("/ru")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Korolov IT-Service | Сайты и IT-поддержка в Leverkusen",
      description:
        "Korolov IT-Service помогает малому бизнесу в Leverkusen, Köln и NRW с сайтами, почтой, хостингом, IT-поддержкой и цифровой организацией.",
      path: "/ru",
      locale: "ru",
      keywords: "IT-сервис Леверкузен, создание сайтов, IT-поддержка NRW, хостинг почты, цифровая организация",
    }),
    links: buildHreflangLinks("/ru"),
  }),
  component: RussianHomePage,
});

function RussianHomePage() {
  const faqItems = faqs.map((item) => ({ question: item.q, answer: item.a }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={localBusinessSchema("ru")} />
      <JsonLd data={organizationSchema("ru")} />
      <JsonLd data={webSiteSchema("ru")} />
      <JsonLd data={faqPageSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([{ name: "Главная", item: "https://korolov-it-service.de/ru" }])}
      />
      <SiteHeader locale="ru" basePath="/ru" />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        <Problem locale="ru" />
        <Services locale="ru" />
        <ForWhom locale="ru" />
        <Pricing locale="ru" />
        <Process locale="ru" />
        <ReferencesSection locale="ru" />
        <About locale="ru" />
        <FAQ />
        <Contact />
      </main>
      <SiteFooter locale="ru" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-grid-bg relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="container-page py-20 md:py-28 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
            IT-партнер для малого бизнеса в NRW
          </div>
          <h1
            id="hero-heading"
            className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-brand leading-[1.05]"
          >
            Больше заявок с сайта и IT-поддержки из Леверкузена
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Помогаю малому бизнесу в Леверкузене с сайтом, деловой почтой, хостингом и IT-поддержкой
            - просто и надежно.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base bg-accent-blue hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/30"
            >
              <a href="#kontakt">
                Запросить бесплатную консультацию{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="default" className="w-full sm:w-auto">
              <a href="#leistungen">Посмотреть услуги</a>
            </Button>
          </div>
          <ul className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl">
            {["Личный контакт", "Сайт + IT", "DE · RU · UA"].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2
                  className="h-5 w-5 text-accent-teal shrink-0 mt-0.5"
                  aria-hidden="true"
                />
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
    <div className="relative" aria-hidden="true">
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
          <MiniRow
            icon={<Globe className="h-4 w-4" />}
            label="Сайт"
            value="активен · SSL"
            tone="teal"
          />
          <MiniRow
            icon={<Mail className="h-4 w-4" />}
            label="Деловая почта"
            value="info@…de"
            tone="blue"
          />
          <MiniRow
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Бэкапы и обновления"
            value="актуально"
            tone="teal"
          />
          <MiniRow
            icon={<LifeBuoy className="h-4 w-4" />}
            label="Техподдержка"
            value="на связи"
            tone="blue"
          />
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

const faqs = [
  {
    q: "Сколько времени занимает создание сайта?",
    a: "Простой сайт обычно занимает от нескольких дней до нескольких недель — в зависимости от контента и согласований.",
  },
  {
    q: "Можно ли потом вносить изменения?",
    a: "Да, можно договориться о регулярной поддержке и небольших доработках.",
  },
  {
    q: "Вы помогаете с доменом и почтой?",
    a: "Да, помогаю с доменом, хостингом, почтой, DNS и настройкой отправки форм.",
  },
  {
    q: "Насколько сайт соответствует DSGVO?",
    a: "Я помогаю с технической DSGVO-ориентированной реализацией. Юридические тексты лучше дополнительно проверить у профильного сервиса или юриста.",
  },
  {
    q: "Работаете ли вы офлайн?",
    a: "В зависимости от проекта возможна удаленная работа и выезд по Leverkusen и Köln.",
  },
  {
    q: "Можно ли получить консультацию на русском или украинском?",
    a: "Да, консультации возможны на немецком, русском и украинском языках.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="py-20 md:py-28 bg-section scroll-mt-20"
      aria-labelledby="faq-heading"
    >
      <div className="container-page max-w-3xl">
        <SectionHeading
          headingId="faq-heading"
          eyebrow="FAQ"
          title="Частые вопросы"
          subtitle="Ответы на основные вопросы перед первым разговором."
        />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div key={f.q} className="card-soft overflow-hidden">
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left p-5 gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-md"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    type="button"
                  >
                    <span className="font-medium text-brand">{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed"
                >
                  {f.a}
                </div>
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      topic,
      consent: agreed,
      locale: "ru",
      _honey: String(data.get("_honey") ?? "").trim(),
    };

    if (payload._honey) {
      setSubmitted(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !(result?.success ?? result?.ok)) {
        setSubmitError(
          typeof result?.message === "string"
            ? result.message
            : typeof result?.error === "string"
              ? result.error
            : "Не удалось отправить сообщение. Попробуйте ещё раз.",
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Не удалось отправить сообщение. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="py-20 md:py-28 scroll-mt-20" aria-labelledby="contact-heading">
      <div className="container-page grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">
            Контакты
          </div>
          <h2
            id="contact-heading"
            className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight"
          >
            Запросить бесплатную консультацию
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Коротко опишите задачу, и я свяжусь с первичной оценкой.
          </p>
          <div className="mt-8 space-y-4">
            <ContactRow
              icon={<Mail className="h-5 w-5" aria-hidden="true" />}
              label="E-mail"
              value={COMPANY.email}
              href={`mailto:${COMPANY.email}`}
              ariaLabel="Отправить e-mail"
            />
            <ContactRow
              icon={<Phone className="h-5 w-5" aria-hidden="true" />}
              label="Телефон"
              value={COMPANY.phoneDisplay}
              href={COMPANY.phoneHref}
              ariaLabel="Позвонить"
            />
            <ContactRow
              icon={<MessageSquare className="h-5 w-5" aria-hidden="true" />}
              label="WhatsApp"
              value="Написать в WhatsApp"
              href={COMPANY.whatsappHref}
              external
              ariaLabel="Написать в WhatsApp"
            />
            <ContactRow
              icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
              label="Локация"
              value="Leverkusen, NRW"
            />
            <ContactRow
              icon={<Languages className="h-5 w-5" aria-hidden="true" />}
              label="Языки"
              value="Deutsch · Русский · Українська"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="card-soft p-6 md:p-8 space-y-5"
            noValidate
            aria-labelledby="contact-heading"
          >
            <input type="hidden" name="topic" value={topic} />
            <input
              type="text"
              name="_honey"
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Имя" required fieldId="ru-name">
                <Input required name="name" placeholder="Ваше имя" autoComplete="name" disabled={isSubmitting} />
              </Field>
              <Field label="Компания" fieldId="ru-company">
                <Input
                  name="company"
                  placeholder="Название компании (опционально)"
                  autoComplete="organization"
                  disabled={isSubmitting}
                />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="E-mail" required fieldId="ru-email">
                <Input
                  required
                  type="email"
                  name="email"
                  placeholder="your@email.de"
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </Field>
              <Field label="Телефон" fieldId="ru-phone">
                <Input name="phone" placeholder="опционально" autoComplete="tel" disabled={isSubmitting} />
              </Field>
            </div>
            <Field label="Тема запроса" required fieldId="ru-topic">
              <Select value={topic} onValueChange={setTopic} disabled={isSubmitting}>
                <SelectTrigger id="ru-topic">
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
            <Field label="Сообщение" required fieldId="ru-message">
              <Textarea
                required
                name="message"
                rows={5}
                placeholder="Кратко опишите вашу задачу..."
                disabled={isSubmitting}
              />
            </Field>

            <label
              htmlFor="dsgvo-ru"
              className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer"
            >
              <Checkbox
                id="dsgvo-ru"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(Boolean(v))}
                required
                aria-required="true"
                disabled={isSubmitting}
              />
              <span>
                Я ознакомился(ась) с{" "}
                <a href="/datenschutz" className="text-accent-blue underline">
                  политикой конфиденциальности
                </a>{" "}
                и соглашаюсь на обработку данных для связи.
              </span>
            </label>

            <Button
              type="submit"
              variant="brand"
              size="lg"
              disabled={!agreed || isSubmitting}
              className="w-full sm:w-auto inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                  Отправка...
                </>
              ) : (
                <>
                  Отправить заявку <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>

            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground/85"
              >
                {submitError}
              </div>
            )}

            {submitted && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-lg border border-border bg-section p-4 text-sm text-foreground/85"
              >
                Спасибо! Ваше сообщение успешно отправлено. Я свяжусь с вами в ближайшее время.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  ariaLabel,
  external,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  ariaLabel?: string;
  external?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="h-10 w-10 rounded-lg bg-section text-accent-blue flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        {href ? (
          <a
            href={href}
            aria-label={ariaLabel}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="text-sm font-medium text-foreground hover:text-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm transition-colors"
          >
            {value}
          </a>
        ) : (
          <div className="text-sm font-medium text-foreground">{value}</div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  fieldId,
  children,
}: {
  label: string;
  required?: boolean;
  fieldId: string;
  children: ReactNode;
}) {
  const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId} className="text-sm text-foreground/80">
        {label}{" "}
        {required && (
          <span className="text-destructive" aria-label="обязательно">
            *
          </span>
        )}
      </Label>
      {React.cloneElement(child, {
        id: fieldId,
        ...(required ? { "aria-required": "true" } : {}),
      })}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  headingId,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  headingId?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">{eyebrow}</div>
      <h2 id={headingId} className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
