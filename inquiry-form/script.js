/* ============================================================
   Avian Technology — Business Inquiry Form
   v1: no backend. Validates, saves to localStorage, and offers
   a one-click mailto: copy. A later admin view (Tool #4) can
   read the same localStorage key to list inquiries.
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "avian_inquiries";
  var INBOX = "hello@aviantechnology.com";

  var form        = document.getElementById("inquiryForm");
  var note        = document.getElementById("formNote");
  var successPanel = document.getElementById("successPanel");
  var successName  = document.getElementById("successName");
  var mailtoBtn    = document.getElementById("mailtoBtn");
  var anotherBtn   = document.getElementById("anotherBtn");

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Required fields and their friendly labels for error messages
  var REQUIRED = {
    name:        "Please tell us your name.",
    email:       "Please enter your email.",
    service:     "Please choose a service.",
    description: "Please describe your project."
  };

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldWrap(input) {
    return input.closest(".field");
  }

  function setError(input, message) {
    var wrap = fieldWrap(input);
    if (wrap) wrap.classList.add("invalid");
    var slot = document.querySelector('.err[data-err-for="' + input.id + '"]');
    if (slot) slot.textContent = message || "";
  }

  function clearError(input) {
    var wrap = fieldWrap(input);
    if (wrap) wrap.classList.remove("invalid");
    var slot = document.querySelector('.err[data-err-for="' + input.id + '"]');
    if (slot) slot.textContent = "";
  }

  function validate() {
    var firstInvalid = null;

    Object.keys(REQUIRED).forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      if (input.value.trim() === "") {
        setError(input, REQUIRED[id]);
        if (!firstInvalid) firstInvalid = input;
      } else {
        clearError(input);
      }
    });

    // Email format (only if non-empty — the empty case is handled above)
    var email = document.getElementById("email");
    if (email.value.trim() !== "" && !EMAIL_RE.test(email.value.trim())) {
      setError(email, "That email doesn't look right.");
      if (!firstInvalid) firstInvalid = email;
    }

    return firstInvalid;
  }

  // Clear a field's error as soon as the user starts fixing it
  form.addEventListener("input", function (e) {
    if (e.target.matches("input, textarea, select")) clearError(e.target);
  });
  form.addEventListener("change", function (e) {
    if (e.target.matches("select")) clearError(e.target);
  });

  function collect() {
    return {
      name:        document.getElementById("name").value.trim(),
      company:     document.getElementById("company").value.trim(),
      email:       document.getElementById("email").value.trim(),
      phone:       document.getElementById("phone").value.trim(),
      service:     document.getElementById("service").value,
      description: document.getElementById("description").value.trim(),
      budget:      document.getElementById("budget").value,
      timeline:    document.getElementById("timeline").value,
      source:      document.getElementById("source").value.trim(),
      submittedAt: new Date().toISOString(),
      id:          "inq_" + Date.now().toString(36)
    };
  }

  function save(inquiry) {
    try {
      var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(list)) list = [];
      list.push(inquiry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (err) {
      // Private mode / storage disabled — not fatal, mailto still works
      return false;
    }
  }

  function buildMailto(d) {
    var subject = "New project inquiry — " + d.name + (d.company ? " (" + d.company + ")" : "");
    var lines = [
      "Name: " + d.name,
      d.company ? "Company: " + d.company : null,
      "Email: " + d.email,
      d.phone ? "Phone: " + d.phone : null,
      "",
      "Service needed: " + d.service,
      "Budget: " + (d.budget || "Not specified"),
      "Timeline: " + (d.timeline || "Not specified"),
      d.source ? "Heard about us via: " + d.source : null,
      "",
      "Project description:",
      d.description
    ].filter(function (l) { return l !== null; });

    return "mailto:" + INBOX +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function showSuccess(d, saved) {
    form.hidden = true;
    successName.textContent = d.name.split(" ")[0] || "there";
    mailtoBtn.setAttribute("href", buildMailto(d));
    successPanel.hidden = false;
    successPanel.scrollIntoView({ behavior: "smooth", block: "start" });

    if (!saved) {
      var hint = successPanel.querySelector(".success__hint");
      if (hint) hint.textContent =
        "We couldn't save a local copy in this browser, so please send the email copy below to make sure it reaches us.";
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    note.textContent = "";
    note.className = "formcard__note";

    var firstInvalid = validate();
    if (firstInvalid) {
      note.textContent = "Please fix the highlighted fields.";
      note.classList.add("err");
      firstInvalid.focus();
      return;
    }

    var inquiry = collect();
    var saved = save(inquiry);
    showSuccess(inquiry, saved);
  });

  anotherBtn.addEventListener("click", function () {
    form.reset();
    Object.keys(REQUIRED).forEach(function (id) {
      var input = document.getElementById(id);
      if (input) clearError(input);
    });
    note.textContent = "";
    note.className = "formcard__note";
    successPanel.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("name").focus();
  });

})();
