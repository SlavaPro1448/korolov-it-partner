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

export const Route = createFileRoute("/ua")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Korolov IT-Service | Сайти та IT-підтримка в Leverkusen",
      description:
        "Korolov IT-Service допомагає малому бізнесу в Leverkusen, Köln і NRW із сайтами, поштою, хостингом та IT-підтримкою.",
      path: "/ua",
      locale: "ua",
      keywords: "IT-сервіс Леверкузен, створення сайтів, IT-підтримка NRW, хостинг пошти, цифрова організація",
    }),
    links: buildHreflangLinks("/ua"),
  }),
  component: UkrainianHomePage,
});

function UkrainianHomePage() {
  const faqItems = faqs.map((item) => ({ question: item.q, answer: item.a }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={localBusinessSchema("uk")} />
      <JsonLd data={organizationSchema("uk")} />
      <JsonLd data={webSiteSchema("uk")} />
      <JsonLd data={faqPageSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([{ name: "Головна", item: "https://korolov-it-service.de/ua" }])}
      />
      <SiteHeader locale="ua" basePath="/ua" />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        <Problem locale="uk" />
        <Services locale="uk" />
        <ForWhom locale="uk" />
        <Pricing locale="uk" />
        <Process locale="uk" />
        <ReferencesSection locale="ua" />
        <About locale="uk" />
        <FAQ />
        <Contact />
      </main>
      <SiteFooter locale="ua" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-grid-bg relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="container-page py-20 md:py-28 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
            IT-партнер для малого бізнесу в NRW
          </div>
          <h1
            id="hero-heading"
            className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-brand leading-[1.05]"
          >
            Більше заявок із сайту та IT-підтримки з Леверкузена
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Допомагаю малому бізнесу в Леверкузені із сайтом, діловою поштою, хостингом та
            IT-підтримкою - зрозуміло і надійно.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base bg-accent-blue hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/30"
            >
              <a href="#kontakt">
                Замовити безкоштовну консультацію{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="default" className="w-full sm:w-auto">
              <a href="#leistungen">Переглянути послуги</a>
            </Button>
          </div>
          <ul className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl">
            {["Особистий контакт", "Сайт + IT", "DE · RU · UA"].map((t) => (
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
        <div className="lg:col-span-5">
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
        <div className="mt-1 space-y-3">
          <MiniRow
            icon={<Globe className="h-4 w-4" />}
            label="Сайт компанії"
            value="активний · SSL"
            tone="teal"
          />
          <MiniRow
            icon={<Mail className="h-4 w-4" />}
            label="Ділова пошта"
            value="info@…de"
            tone="blue"
          />
          <MiniRow
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Бекапи й оновлення"
            value="актуально"
            tone="teal"
          />
          <MiniRow
            icon={<LifeBuoy className="h-4 w-4" />}
            label="Техпідтримка"
            value="на зв'язку"
            tone="blue"
          />
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
    <section
      id="faq"
      className="py-20 md:py-28 bg-section scroll-mt-20"
      aria-labelledby="faq-heading"
    >
      <div className="container-page max-w-3xl">
        <SectionHeading
          headingId="faq-heading"
          eyebrow="FAQ"
          title="Часті запитання"
          subtitle="Відповіді на найпоширеніші запитання перед першою консультацією."
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
      locale: "ua",
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
            : "Не вдалося надіслати повідомлення. Спробуйте ще раз.",
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Не вдалося надіслати повідомлення. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="py-20 md:py-28 scroll-mt-20" aria-labelledby="contact-heading">
      <div className="container-page grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">
            Контакти
          </div>
          <h2
            id="contact-heading"
            className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight"
          >
            Запросити безкоштовну консультацію
          </h2>
          <div className="mt-8 space-y-4">
            <ContactRow
              icon={<Mail className="h-5 w-5" aria-hidden="true" />}
              label="E-mail"
              value={COMPANY.email}
              href={`mailto:${COMPANY.email}`}
              ariaLabel="Надіслати e-mail"
            />
            <ContactRow
              icon={<Phone className="h-5 w-5" aria-hidden="true" />}
              label="Телефон"
              value={COMPANY.phoneDisplay}
              href={COMPANY.phoneHref}
              ariaLabel="Зателефонувати"
            />
            <ContactRow
              icon={<MessageSquare className="h-5 w-5" aria-hidden="true" />}
              label="WhatsApp"
              value="Написати в WhatsApp"
              href={COMPANY.whatsappHref}
              external
              ariaLabel="Написати в WhatsApp"
            />
            <ContactRow
              icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
              label="Локація"
              value="Leverkusen, NRW"
            />
            <ContactRow
              icon={<Languages className="h-5 w-5" aria-hidden="true" />}
              label="Мови"
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
              <Field label="Ім'я" required fieldId="ua-name">
                <Input required name="name" placeholder="Ваше ім'я" autoComplete="name" disabled={isSubmitting} />
              </Field>
              <Field label="Компанія" fieldId="ua-company">
                <Input
                  name="company"
                  placeholder="Назва компанії (опціонально)"
                  autoComplete="organization"
                  disabled={isSubmitting}
                />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="E-mail" required fieldId="ua-email">
                <Input
                  required
                  type="email"
                  name="email"
                  placeholder="your@email.de"
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </Field>
              <Field label="Телефон" fieldId="ua-phone">
                <Input name="phone" placeholder="опціонально" autoComplete="tel" disabled={isSubmitting} />
              </Field>
            </div>
            <Field label="Тема звернення" required fieldId="ua-topic">
              <Select value={topic} onValueChange={setTopic} disabled={isSubmitting}>
                <SelectTrigger id="ua-topic">
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
            <Field label="Повідомлення" required fieldId="ua-message">
              <Textarea
                required
                name="message"
                rows={5}
                placeholder="Коротко опишіть вашу задачу..."
                disabled={isSubmitting}
              />
            </Field>

            <label
              htmlFor="dsgvo-ua"
              className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer"
            >
              <Checkbox
                id="dsgvo-ua"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(Boolean(v))}
                required
                aria-required="true"
                disabled={isSubmitting}
              />
              <span>
                Я ознайомився(лась) з{" "}
                <a href="/datenschutz" className="text-accent-blue underline">
                  політикою конфіденційності
                </a>{" "}
                та погоджуюся на обробку даних для зв'язку.
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
                  Надсилання...
                </>
              ) : (
                <>
                  Надіслати заявку <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
                Дякую! Ваше повідомлення успішно надіслано. Я зв'яжуся з вами найближчим часом.
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
          <span className="text-destructive" aria-label="обов'язково">
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
