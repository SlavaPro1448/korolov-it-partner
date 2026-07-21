import { ArrowRight, Loader2 } from "lucide-react";
import React, { Fragment, useState } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY } from "@/config/legal";

const EMAIL_FORMAT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Kompakte Anfrage-Form für Landing-Pages (deutschsprachig): Name, E-Mail,
// Nachricht + DSGVO-Einwilligung. Das Anliegen (topic) kommt versteckt von der
// jeweiligen Seite mit — Backend verlangt ein nicht-leeres topic-Feld.
const T = {
  nameLabel: "Name",
  namePlaceholder: "Ihr Name",
  emailLabel: "E-Mail",
  emailPlaceholder: "ihre@email.de",
  messageLabel: "Nachricht",
  messagePlaceholder: "Beschreiben Sie kurz Ihr Anliegen…",
  requiredAria: "erforderlich",
  consentTemplate:
    "Ich habe die {privacy} zur Kenntnis genommen. Ich stimme zu, dass meine Angaben (Name und E-Mail-Adresse) zur Bearbeitung meiner Anfrage erhoben und verarbeitet werden. Diese Einwilligung kann ich jederzeit für die Zukunft per E-Mail an {email} widerrufen.",
  consentPrivacyLabel: "Datenschutzerklärung",
  submit: "Anfrage senden",
  submitting: "Wird gesendet...",
  successTitle: "Vielen Dank!",
  successBody:
    "Ihre Anfrage wurde erfolgreich gesendet. Ich melde mich innerhalb von 24 Stunden bei Ihnen zurück.",
  errorFallback:
    "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie direkt an {email}.",
  validation: {
    nameRequired: "Bitte geben Sie Ihren Namen an.",
    nameMin: "Der Name muss mindestens 2 Zeichen lang sein.",
    emailRequired: "Bitte geben Sie Ihre E-Mail-Adresse an.",
    emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
    messageRequired: "Bitte beschreiben Sie kurz Ihr Anliegen.",
    messageMin: "Die Nachricht muss mindestens 10 Zeichen lang sein.",
    messageMax: "Die Nachricht darf höchstens 2000 Zeichen lang sein.",
  },
};

function validateName(value: string): string | undefined {
  const t = value.trim();
  if (!t) return T.validation.nameRequired;
  if (t.length < 2) return T.validation.nameMin;
}

function validateEmail(value: string): string | undefined {
  const t = value.trim();
  if (!t) return T.validation.emailRequired;
  if (!EMAIL_FORMAT_RE.test(t)) return T.validation.emailInvalid;
}

function validateMessage(value: string): string | undefined {
  const t = value.trim();
  if (!t) return T.validation.messageRequired;
  if (t.length < 10) return T.validation.messageMin;
  if (t.length > 2000) return T.validation.messageMax;
}

function Field({
  label,
  fieldId,
  error,
  children,
}: {
  label: string;
  fieldId: string;
  error?: string;
  children: React.ReactElement;
}) {
  const errorId = `${fieldId}-error`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId} className="text-sm text-foreground/80">
        {label}{" "}
        <span className="text-destructive" aria-label={T.requiredAria}>
          *
        </span>
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

function ConsentText() {
  const parts = T.consentTemplate.split(/(\{privacy\}|\{email\})/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part === "{privacy}") {
          return (
            <Link key={i} to="/datenschutz" className="text-accent-blue hover:underline">
              {T.consentPrivacyLabel}
            </Link>
          );
        }
        if (part === "{email}") {
          return (
            <a key={i} href={`mailto:${COMPANY.email}`} className="text-accent-blue hover:underline">
              {COMPANY.email}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </span>
  );
}

export function LandingContactForm({ topic }: { topic: string }) {
  const [consentChecked, setConsentChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldError = (key: string, err: string | undefined) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[key] = err;
      else delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Record<string, string> = {};
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const messageErr = validateMessage(message);
    if (nameErr) next.name = nameErr;
    if (emailErr) next.email = emailErr;
    if (messageErr) next.message = messageErr;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const honey = String(data.get("_honey") ?? "").trim();
    if (honey) {
      setSubmitted(true);
      return;
    }

    const payload = {
      name,
      email,
      topic,
      message,
      consent: consentChecked,
      locale: "de",
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
      setSubmitError(T.errorFallback.replace("{email}", COMPANY.email));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div role="status" aria-live="polite" className="card-soft p-6 md:p-8 space-y-3 text-left">
        <p className="text-lg font-semibold text-brand">
          <span aria-hidden="true">✓</span> {T.successTitle}
        </p>
        <p className="text-sm text-foreground/85 leading-relaxed">{T.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-soft p-6 md:p-8 space-y-5 text-left" noValidate>
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
        <Field label={T.nameLabel} fieldId="landing-name" error={errors.name}>
          <Input
            name="name"
            placeholder={T.namePlaceholder}
            autoComplete="name"
            disabled={isSubmitting}
            onBlur={(e) => setFieldError("name", validateName(e.target.value))}
          />
        </Field>
        <Field label={T.emailLabel} fieldId="landing-email" error={errors.email}>
          <Input
            type="email"
            name="email"
            placeholder={T.emailPlaceholder}
            autoComplete="email"
            disabled={isSubmitting}
            onBlur={(e) => setFieldError("email", validateEmail(e.target.value))}
          />
        </Field>
      </div>

      <Field label={T.messageLabel} fieldId="landing-message" error={errors.message}>
        <Textarea
          name="message"
          rows={4}
          maxLength={2000}
          placeholder={T.messagePlaceholder}
          disabled={isSubmitting}
          onBlur={(e) => setFieldError("message", validateMessage(e.target.value))}
        />
      </Field>

      <label
        htmlFor="landing-consent"
        className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer"
      >
        <Checkbox
          id="landing-consent"
          checked={consentChecked}
          onCheckedChange={(value) => setConsentChecked(Boolean(value))}
          disabled={isSubmitting}
          aria-required="true"
          className="mt-0.5"
        />
        <ConsentText />
      </label>

      <Button
        type="submit"
        variant="brand"
        size="lg"
        disabled={!consentChecked || isSubmitting}
        className="w-full sm:w-auto inline-flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
            {T.submitting}
          </>
        ) : (
          <>
            {T.submit} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
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
  );
}
