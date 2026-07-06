/* Kanzlei Dr. Plutte — Redesign-Konzept: shared behaviour */
(function () {
  "use strict";

  /* Mobile navigation ----------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Scroll reveal ---------------------------------------------------------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }

  /* "Jetzt geöffnet" badge -------------------------------------------------
     Bürozeiten: Mo–Fr 8:00–18:00 (Europe/Berlin) */
  document.querySelectorAll("[data-open-badge]").forEach(function (badge) {
    var now;
    try {
      now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" })
      );
    } catch (err) {
      now = new Date();
    }
    var day = now.getDay(); // 0 So … 6 Sa
    var mins = now.getHours() * 60 + now.getMinutes();
    var isOpen = day >= 1 && day <= 5 && mins >= 8 * 60 && mins < 18 * 60;
    var label = badge.querySelector("[data-open-label]");
    if (isOpen) {
      badge.classList.remove("closed");
      if (label) label.textContent = "Jetzt geöffnet";
    } else {
      badge.classList.add("closed");
      if (label) label.textContent = "Derzeit geschlossen";
    }
  });

  /* Contact form ----------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusBox = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');

  function setFieldError(name, message) {
    var field = form.querySelector('[data-field="' + name + '"]');
    if (!field) return;
    if (message) {
      field.classList.add("invalid");
      var msg = field.querySelector(".error-msg");
      if (msg) msg.textContent = message;
    } else {
      field.classList.remove("invalid");
    }
  }

  function clearErrors() {
    form.querySelectorAll(".field.invalid").forEach(function (f) {
      f.classList.remove("invalid");
    });
    if (statusBox) {
      statusBox.className = "form-status";
      statusBox.textContent = "";
    }
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    clearErrors();

    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var email = String(data.get("email") || "").trim();
    var phone = String(data.get("phone") || "").trim();
    var topic = String(data.get("topic") || "").trim();
    var message = String(data.get("message") || "").trim();
    var date = String(data.get("callback_date") || "").trim();
    var timeFrom = String(data.get("callback_from") || "").trim();
    var timeTo = String(data.get("callback_to") || "").trim();
    var consent = form.querySelector('input[name="consent"]').checked;
    var honey = String(data.get("website") || "");

    var hasError = false;
    if (name.length < 2) {
      setFieldError("name", "Bitte geben Sie Ihren Namen ein.");
      hasError = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("email", "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      hasError = true;
    }
    if (!topic) {
      setFieldError("topic", "Bitte wählen Sie ein Anliegen.");
      hasError = true;
    }
    if (message.length < 10) {
      setFieldError("message", "Bitte geben Sie eine Nachricht mit mindestens 10 Zeichen ein.");
      hasError = true;
    }
    if (!consent) {
      setFieldError("consent", "Bitte bestätigen Sie die Datenschutzerklärung.");
      hasError = true;
    }
    if (hasError) {
      var firstInvalid = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var fullMessage = message;
    var callbackParts = [];
    if (date) callbackParts.push("Wunschdatum: " + date);
    if (timeFrom || timeTo) {
      callbackParts.push("Uhrzeit: " + (timeFrom || "?") + " – " + (timeTo || "?"));
    }
    if (callbackParts.length) {
      fullMessage += "\n\n--- Rückruf-Wunsch ---\n" + callbackParts.join("\n");
    }
    fullMessage += "\n\n[Demo-Anfrage über das Redesign-Konzept erbrecht-leverkusen]";

    submitBtn.classList.add("loading");
    submitBtn.setAttribute("aria-busy", "true");

    fetch("/api/contact.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        topic: "Kanzlei-Demo: " + topic,
        message: fullMessage,
        consent: consent,
        website: honey,
      }),
    })
      .then(function (res) {
        return res.json().then(function (body) {
          return { ok: res.ok, body: body };
        });
      })
      .then(function (result) {
        if (result.ok && result.body && result.body.success !== false) {
          form.reset();
          if (statusBox) {
            statusBox.className = "form-status success";
            statusBox.textContent =
              "Vielen Dank! Ihre Nachricht wurde erfolgreich versendet. Wir melden uns zeitnah bei Ihnen.";
          }
        } else {
          var msg =
            (result.body && result.body.message) ||
            "Ihre Nachricht konnte nicht versendet werden. Bitte versuchen Sie es später erneut.";
          if (statusBox) {
            statusBox.className = "form-status error";
            statusBox.textContent = msg;
          }
        }
      })
      .catch(function () {
        if (statusBox) {
          statusBox.className = "form-status error";
          statusBox.textContent =
            "Netzwerkfehler. Bitte versuchen Sie es später erneut oder rufen Sie uns an: 02171 31932.";
        }
      })
      .finally(function () {
        submitBtn.classList.remove("loading");
        submitBtn.removeAttribute("aria-busy");
        if (statusBox) statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
  });
})();
