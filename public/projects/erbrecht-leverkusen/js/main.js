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

  /* Scroll reveal with soft stagger ---------------------------------------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        var delay = 0;
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.style.setProperty("--reveal-delay", delay + "ms");
            delay += 80;
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

  /* Time slot options (08:00–18:00, alle 15 Minuten) ------------------------ */
  document.querySelectorAll("select[data-timeslots]").forEach(function (sel) {
    for (var h = 8; h <= 18; h++) {
      for (var m = 0; m < 60; m += 15) {
        if (h === 18 && m > 0) break;
        var val =
          String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
        var opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val + " Uhr";
        sel.appendChild(opt);
      }
    }
  });

  /* Custom dropdowns (styled select replacement) ---------------------------
     Progressive enhancement: the native <select> stays in the form (hidden)
     and keeps the value for FormData; the visible UI is a button + listbox. */
  function enhanceSelect(select) {
    var wrap = document.createElement("div");
    wrap.className = "dropdown";
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dropdown-toggle";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    if (select.id) btn.setAttribute("aria-labelledby", select.id + "-label");

    var labelSpan = document.createElement("span");
    var chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chevron.setAttribute("class", "chevron");
    chevron.setAttribute("width", "18");
    chevron.setAttribute("height", "18");
    chevron.setAttribute("viewBox", "0 0 24 24");
    chevron.setAttribute("fill", "none");
    chevron.setAttribute("stroke", "currentColor");
    chevron.setAttribute("stroke-width", "2");
    chevron.setAttribute("stroke-linecap", "round");
    chevron.setAttribute("stroke-linejoin", "round");
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML = '<path d="m6 9 6 6 6-6"/>';
    btn.appendChild(labelSpan);
    btn.appendChild(chevron);

    var list = document.createElement("ul");
    list.className = "dropdown-menu";
    list.setAttribute("role", "listbox");
    list.tabIndex = -1;

    var options = Array.prototype.slice.call(select.options);
    var focusIdx = Math.max(select.selectedIndex, 0);

    options.forEach(function (opt, i) {
      var li = document.createElement("li");
      li.setAttribute("role", "option");
      li.dataset.value = opt.value;
      li.textContent = opt.textContent;
      if (opt.value === "") li.classList.add("placeholder-option");
      if (i === select.selectedIndex) li.setAttribute("aria-selected", "true");
      li.addEventListener("click", function () {
        choose(i);
        close();
        btn.focus();
      });
      list.appendChild(li);
    });

    function syncLabel() {
      var sel = options[select.selectedIndex];
      if (!sel || sel.value === "") {
        labelSpan.textContent = options[0] ? options[0].textContent : "";
        labelSpan.className = "placeholder";
      } else {
        labelSpan.textContent = sel.textContent;
        labelSpan.className = "";
      }
    }

    function choose(i) {
      select.selectedIndex = i;
      focusIdx = i;
      Array.prototype.forEach.call(list.children, function (li, j) {
        if (j === i) li.setAttribute("aria-selected", "true");
        else li.removeAttribute("aria-selected");
      });
      syncLabel();
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function setFocused(i) {
      focusIdx = Math.max(0, Math.min(options.length - 1, i));
      Array.prototype.forEach.call(list.children, function (li, j) {
        li.classList.toggle("focused", j === focusIdx);
      });
      var el = list.children[focusIdx];
      if (el) el.scrollIntoView({ block: "nearest" });
    }

    function openMenu() {
      wrap.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      setFocused(Math.max(select.selectedIndex, 0));
    }

    function close() {
      wrap.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function () {
      if (wrap.classList.contains("open")) close();
      else openMenu();
    });

    btn.addEventListener("keydown", function (ev) {
      var open = wrap.classList.contains("open");
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
        ev.preventDefault();
        if (!open) { openMenu(); return; }
        setFocused(focusIdx + (ev.key === "ArrowDown" ? 1 : -1));
      } else if ((ev.key === "Enter" || ev.key === " ") && open) {
        ev.preventDefault();
        choose(focusIdx);
        close();
      } else if (ev.key === "Escape" && open) {
        close();
      }
    });

    document.addEventListener("click", function (ev) {
      if (!wrap.contains(ev.target)) close();
    });

    // Keep UI in sync when the select changes externally (e.g. form.reset()).
    select.addEventListener("change", function () {
      var i = Math.max(select.selectedIndex, 0);
      focusIdx = i;
      Array.prototype.forEach.call(list.children, function (li, j) {
        if (j === i) li.setAttribute("aria-selected", "true");
        else li.removeAttribute("aria-selected");
      });
      syncLabel();
    });

    syncLabel();
    wrap.appendChild(btn);
    wrap.appendChild(list);
  }

  document.querySelectorAll("select[data-custom]").forEach(enhanceSelect);

  /* Datepicker (styled calendar, de-DE, Mo–Fr, keine vergangenen Tage) ------ */
  document.querySelectorAll("[data-datepicker]").forEach(function (wrap) {
    var input = wrap.querySelector('input[type="hidden"]');
    var btn = wrap.querySelector(".dropdown-toggle");
    var panel = wrap.querySelector(".datepicker-panel");
    var labelSpan = btn.querySelector("span");

    var MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni",
      "Juli", "August", "September", "Oktober", "November", "Dezember"];
    var WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selected = null;

    function pad(n) { return String(n).padStart(2, "0"); }

    function fmt(d) {
      return pad(d.getDate()) + "." + pad(d.getMonth() + 1) + "." + d.getFullYear();
    }

    function sameDay(a, b) {
      return a && b && a.getTime() === b.getTime();
    }

    function render() {
      panel.innerHTML = "";

      var head = document.createElement("div");
      head.className = "datepicker-head";

      var prev = document.createElement("button");
      prev.type = "button";
      prev.className = "datepicker-nav";
      prev.setAttribute("aria-label", "Vorheriger Monat");
      prev.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
      prev.disabled =
        view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
      prev.addEventListener("click", function () {
        view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
        render();
      });

      var title = document.createElement("span");
      title.className = "datepicker-title";
      title.textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();

      var next = document.createElement("button");
      next.type = "button";
      next.className = "datepicker-nav";
      next.setAttribute("aria-label", "Nächster Monat");
      next.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
      next.addEventListener("click", function () {
        view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
        render();
      });

      head.appendChild(prev);
      head.appendChild(title);
      head.appendChild(next);
      panel.appendChild(head);

      var grid = document.createElement("div");
      grid.className = "datepicker-grid";

      WEEKDAYS.forEach(function (wd) {
        var el = document.createElement("span");
        el.className = "datepicker-weekday";
        el.textContent = wd;
        grid.appendChild(el);
      });

      var firstDay = new Date(view.getFullYear(), view.getMonth(), 1);
      var offset = (firstDay.getDay() + 6) % 7; // Montag = 0
      var daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

      for (var i = 0; i < offset; i++) {
        var padCell = document.createElement("button");
        padCell.type = "button";
        padCell.className = "datepicker-day other-month";
        padCell.tabIndex = -1;
        grid.appendChild(padCell);
      }

      for (var d = 1; d <= daysInMonth; d++) {
        (function (d) {
          var date = new Date(view.getFullYear(), view.getMonth(), d);
          var cell = document.createElement("button");
          cell.type = "button";
          cell.className = "datepicker-day";
          cell.textContent = d;
          var isWeekend = date.getDay() === 0 || date.getDay() === 6;
          if (date < today || isWeekend) cell.disabled = true;
          if (sameDay(date, today)) cell.classList.add("today");
          if (selected && sameDay(date, selected)) cell.classList.add("selected");
          cell.addEventListener("click", function () {
            selected = date;
            input.value = fmt(date);
            labelSpan.textContent = fmt(date);
            labelSpan.className = "";
            close();
            btn.focus();
          });
          grid.appendChild(cell);
        })(d);
      }

      panel.appendChild(grid);

      var hint = document.createElement("p");
      hint.className = "datepicker-hint";
      hint.textContent = "Rückrufe erfolgen Mo–Fr innerhalb der Bürozeiten.";
      panel.appendChild(hint);
    }

    function openPanel() {
      render();
      wrap.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }

    function close() {
      wrap.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function () {
      if (wrap.classList.contains("open")) close();
      else openPanel();
    });

    btn.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") close();
    });

    document.addEventListener("click", function (ev) {
      if (!wrap.contains(ev.target)) close();
    });

    // Reset support (form.reset() clears the hidden input asynchronously)
    var form = wrap.closest("form");
    if (form) {
      form.addEventListener("reset", function () {
        setTimeout(function () {
          selected = null;
          view = new Date(today.getFullYear(), today.getMonth(), 1);
          labelSpan.textContent = "Datum wählen";
          labelSpan.className = "placeholder";
        }, 0);
      });
    }
  });

  /* Testimonials carousel --------------------------------------------------- */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".testimonials-track");
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var dotsWrap = root.querySelector(".carousel-dots");
    var cards = track ? track.querySelectorAll(".testimonial-card") : [];
    if (!track || !cards.length) return;

    function perView() {
      var w = track.clientWidth;
      if (w >= 1024) return 3;
      if (w >= 640) return 2;
      return 1;
    }

    function pageCount() {
      return Math.max(1, Math.ceil(cards.length / perView()));
    }

    function currentPage() {
      var step = track.scrollWidth / pageCount();
      return Math.round(track.scrollLeft / step);
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (var i = 0; i < pageCount(); i++) {
        (function (idx) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "carousel-dot";
          dot.setAttribute("aria-label", "Zu Seite " + (idx + 1));
          dot.addEventListener("click", function () {
            var step = track.scrollWidth / pageCount();
            track.scrollTo({ left: step * idx, behavior: "smooth" });
          });
          dotsWrap.appendChild(dot);
        })(i);
      }
      update();
    }

    function update() {
      var page = currentPage();
      var last = pageCount() - 1;
      if (prev) prev.disabled = page <= 0;
      if (next) next.disabled = page >= last;
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
          d.classList.toggle("active", i === page);
        });
      }
    }

    function go(dir) {
      var step = track.scrollWidth / pageCount();
      var target = (currentPage() + dir) * step;
      track.scrollTo({ left: target, behavior: "smooth" });
    }

    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });

    var raf;
    track.addEventListener("scroll", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });
    window.addEventListener("resize", buildDots);
    buildDots();
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
      var firstInvalid = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea, .field.invalid .dropdown-toggle");
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
          form.querySelectorAll("select[data-custom]").forEach(function (sel) {
            sel.dispatchEvent(new Event("change", { bubbles: true }));
          });
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
