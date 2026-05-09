import { Link } from "@tanstack/react-router";
import { ArrowRight, Languages, Loader2, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import React, { Fragment, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY } from "@/config/legal";
import { getDict, type Locale } from "@/i18n";
import type { ContactDict, ContactTopic } from "@/i18n/types";

const EMAIL_FORMAT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^[\d\s+\-()]*$/;

const TOPIC_ORDER: ContactTopic[] = [
  "website",
  "wartung",
  "email-domain",
  "it-support",
  "digital-setup",
  "sonstiges",
];

type ValidationDict = ContactDict["validation"];

function validateName(value: string, v: ValidationDict): string | undefined {
  const t = value.trim();
  if (!t) return v.nameRequired;
  if (t.length < 2) return v.nameMin;
}

function validateEmail(value: string, v: ValidationDict): string | undefined {
  const t = value.trim();
  if (!t) return v.emailRequired;
  if (!EMAIL_FORMAT_RE.test(t)) return v.emailInvalid;
}

function validatePhone(value: string, v: ValidationDict): string | undefined {
  const t = value.trim();
  if (!t) return undefined;
  if (!PHONE_CHARS_RE.test(t)) return v.phoneInvalid;
}

function validateTopic(topic: string, v: ValidationDict): string | undefined {
  if (!topic) return v.topicRequired;
}

function validateMessage(value: string, v: ValidationDict): string | undefined {
  const t = value.trim();
  if (!t) return v.messageRequired;
  if (t.length < 10) return v.messageMin;
  if (t.length > 2000) return v.messageMax;
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
  error,
  requiredAria,
  children,
}: {
  label: string;
  required?: boolean;
  fieldId: string;
  error?: string;
  requiredAria: string;
  children: React.ReactElement;
}) {
  const errorId = `${fieldId}-error`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId} className="text-sm text-foreground/80">
        {label}{" "}
        {required && (
          <span className="text-destructive" aria-label={requiredAria}>
            *
          </span>
        )}
      </Label>
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        id: fieldId,
        "aria-invalid": !!error,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} role="alert" className="text-destructive text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

function ConsentText({
  template,
  privacyLabel,
  email,
}: {
  template: string;
  privacyLabel: string;
  email: string;
}) {
  const parts = template.split(/(\{privacy\}|\{email\})/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part === "{privacy}") {
          return (
            <Link key={i} to="/datenschutz" className="text-accent-blue hover:underline">
              {privacyLabel}
            </Link>
          );
        }
        if (part === "{email}") {
          return (
            <a key={i} href={`mailto:${email}`} className="text-accent-blue hover:underline">
              {email}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </span>
  );
}

export function Contact({ locale }: { locale: Locale }) {
  const t = getDict(locale).contact;
  const v = t.validation;

  const [consentChecked, setConsentChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearFieldError = (key: string) => {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const setFieldError = (key: string, err: string | undefined) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[key] = err;
      else delete next[key];
      return next;
    });
  };

  const validateAll = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next: Record<string, string> = {};
    const nameErr = validateName(String(data.get("name") ?? ""), v);
    const emailErr = validateEmail(String(data.get("email") ?? ""), v);
    const phoneErr = validatePhone(String(data.get("phone") ?? ""), v);
    const topicErr = validateTopic(topic, v);
    const messageErr = validateMessage(String(data.get("message") ?? ""), v);
    if (nameErr) next.name = nameErr;
    if (emailErr) next.email = emailErr;
    if (phoneErr) next.phone = phoneErr;
    if (topicErr) next.topic = topicErr;
    if (messageErr) next.message = messageErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const form = e.currentTarget;
    if (!validateAll(form)) return;

    const data = new FormData(form);
    const honey = String(data.get("_honey") ?? "").trim();
    if (honey) {
      setSubmitted(true);
      return;
    }

    const payload = {
      name: String(data.get("name") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      topic,
      message: String(data.get("message") ?? "").trim(),
      consent: consentChecked,
      locale,
      _honey: honey,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !(result?.success ?? result?.ok)) {
        if (result?.errors && typeof result.errors === "object") {
          setErrors((prev) => ({ ...prev, ...result.errors }));
        }
        if (typeof result?.message === "string") {
          setSubmitError(result.message);
          return;
        }
        if (typeof result?.error === "string") {
          setSubmitError(result.error);
          return;
        }
        throw new Error("request_failed");
      }
      setSubmitted(true);
    } catch {
      setSubmitError(t.form.errorFallback.replace("{email}", COMPANY.email));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="py-20 md:py-28 scroll-mt-20" aria-labelledby="contact-heading">
      <div className="container-page grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">
            {t.eyebrow}
          </div>
          <h2
            id="contact-heading"
            className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight"
          >
            {t.heading}
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">{t.description}</p>
          <div className="mt-8 space-y-4">
            <ContactRow
              icon={<Mail className="h-5 w-5" aria-hidden="true" />}
              label={t.rows.emailLabel}
              value={COMPANY.email}
              href={`mailto:${COMPANY.email}`}
              ariaLabel={t.rows.emailAria}
            />
            <ContactRow
              icon={<Phone className="h-5 w-5" aria-hidden="true" />}
              label={t.rows.phoneLabel}
              value={COMPANY.phoneDisplay}
              href={COMPANY.phoneHref}
              ariaLabel={t.rows.phoneAria}
            />
            <ContactRow
              icon={<MessageSquare className="h-5 w-5" aria-hidden="true" />}
              label={t.rows.whatsappLabel}
              value={t.rows.whatsappValue}
              href={COMPANY.whatsappHref}
              external
              ariaLabel={t.rows.whatsappAria}
            />
            <ContactRow
              icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
              label={t.rows.locationLabel}
              value={t.rows.locationValue}
            />
            <ContactRow
              icon={<Languages className="h-5 w-5" aria-hidden="true" />}
              label={t.rows.languagesLabel}
              value={t.rows.languagesValue}
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          {submitted ? (
            <div role="status" aria-live="polite" className="card-soft p-6 md:p-8 space-y-3">
              <p className="text-lg font-semibold text-brand">
                <span aria-hidden="true">✓</span> {t.form.successTitle}
              </p>
              <p className="text-sm text-foreground/85 leading-relaxed">{t.form.successBody}</p>
            </div>
          ) : (
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
                <Field
                  label={t.form.nameLabel}
                  required
                  fieldId="contact-name"
                  error={errors.name}
                  requiredAria={t.form.requiredAria}
                >
                  <Input
                    name="name"
                    placeholder={t.form.namePlaceholder}
                    autoComplete="name"
                    disabled={isSubmitting}
                    onBlur={(e) => setFieldError("name", validateName(e.target.value, v))}
                  />
                </Field>
                <Field
                  label={t.form.companyLabel}
                  fieldId="contact-company"
                  requiredAria={t.form.requiredAria}
                >
                  <Input
                    name="company"
                    placeholder={t.form.companyPlaceholder}
                    autoComplete="organization"
                    disabled={isSubmitting}
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label={t.form.emailLabel}
                  required
                  fieldId="contact-email"
                  error={errors.email}
                  requiredAria={t.form.requiredAria}
                >
                  <Input
                    type="email"
                    name="email"
                    placeholder={t.form.emailPlaceholder}
                    autoComplete="email"
                    disabled={isSubmitting}
                    onBlur={(e) => setFieldError("email", validateEmail(e.target.value, v))}
                  />
                </Field>
                <Field
                  label={t.form.phoneLabel}
                  fieldId="contact-phone"
                  error={errors.phone}
                  requiredAria={t.form.requiredAria}
                >
                  <Input
                    name="phone"
                    placeholder={t.form.phonePlaceholder}
                    autoComplete="tel"
                    disabled={isSubmitting}
                    onBlur={(e) => setFieldError("phone", validatePhone(e.target.value, v))}
                  />
                </Field>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-topic" className="text-sm text-foreground/80">
                  {t.form.topicLabel}{" "}
                  <span className="text-destructive" aria-label={t.form.requiredAria}>
                    *
                  </span>
                </Label>
                <Select
                  value={topic}
                  onValueChange={(value) => {
                    setTopic(value);
                    clearFieldError("topic");
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="contact-topic"
                    aria-invalid={!!errors.topic}
                    aria-describedby={errors.topic ? "contact-topic-error" : undefined}
                    onBlur={() => setFieldError("topic", validateTopic(topic, v))}
                  >
                    <SelectValue placeholder={t.form.topicPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPIC_ORDER.map((key) => (
                      <SelectItem key={key} value={key}>
                        {t.form.topicOptions[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.topic && (
                  <p id="contact-topic-error" role="alert" className="text-destructive text-xs mt-1">
                    {errors.topic}
                  </p>
                )}
              </div>

              <Field
                label={t.form.messageLabel}
                required
                fieldId="contact-message"
                error={errors.message}
                requiredAria={t.form.requiredAria}
              >
                <Textarea
                  name="message"
                  rows={5}
                  maxLength={2000}
                  placeholder={t.form.messagePlaceholder}
                  disabled={isSubmitting}
                  onBlur={(e) => setFieldError("message", validateMessage(e.target.value, v))}
                />
              </Field>

              <label
                htmlFor="contact-consent"
                className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer"
              >
                <Checkbox
                  id="contact-consent"
                  checked={consentChecked}
                  onCheckedChange={(value) => setConsentChecked(Boolean(value))}
                  disabled={isSubmitting}
                  aria-required="true"
                  className="mt-0.5"
                />
                <ConsentText
                  template={t.form.consentTemplate}
                  privacyLabel={t.form.consentPrivacyLabel}
                  email={COMPANY.email}
                />
              </label>

              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={!consentChecked || isSubmitting}
                className="w-full sm:w-auto inline-flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                    {t.form.submitting}
                  </>
                ) : (
                  <>
                    {t.form.submit} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
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
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
