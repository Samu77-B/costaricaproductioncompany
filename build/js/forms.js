(function () {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvkzkdav";

  const LOCATION_LABELS = {
    "lorem-valley": "Lorem Valley",
    "ipsum-coast": "Ipsum Coast",
    "dolor-highlands": "Dolor Highlands",
    "amet-city": "Amet City",
    "consectetur-rainforest": "Consectetur Rainforest",
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function subjectFor(locationLabel, imageRef) {
    if (!locationLabel) return "Website enquiry — Costa Rica Production Company";
    const place = imageRef ? " / " + imageRef : "";
    return "Location enquiry — " + locationLabel + place;
  }

  function formMarkup(options) {
    const locationLabel = (options && options.locationLabel) || "";
    const imageRef = (options && options.imageRef) || "";
    const isLocation = Boolean(locationLabel || (options && options.forceLocation));
    const thanksHours = isLocation ? "48 hours" : "24 hours";
    const extraClass = isLocation ? " contact-form--location" : "";

    const locationFields = isLocation
      ? `<label>
          Location Type
          <input type="text" name="Location Type" value="${escapeHtml(locationLabel)}" readonly>
        </label>
        <label>
          Place Name
          <input type="text" name="Place Name" value="${escapeHtml(imageRef)}" readonly>
        </label>`
      : "";

    return `<form class="contact-form${extraClass}" action="${FORMSPREE_ENDPOINT}" method="POST">
      <input type="hidden" name="_subject" value="${escapeHtml(subjectFor(locationLabel, imageRef))}">
      <input type="text" name="_gotcha" class="contact-form__hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      ${locationFields}
      <label>
        Name
        <input type="text" name="name" required autocomplete="name">
      </label>
      <label>
        Email
        <input type="email" name="email" required autocomplete="email">
      </label>
      <label class="contact-form__full">
        Phone <span class="contact-form__optional">(optional)</span>
        <input type="tel" name="phone" autocomplete="tel">
      </label>
      <label class="contact-form__full">
        Message
        <textarea name="message" required></textarea>
      </label>
      <p class="contact-form__status" role="status" hidden data-thanks="Thanks — one of the team will be in touch within ${thanksHours}."></p>
      <button type="submit">Send enquiry</button>
    </form>`;
  }

  function setStatus(form, kind, text) {
    const status = form.querySelector(".contact-form__status");
    if (!status) return;
    status.hidden = !text;
    status.textContent = text || "";
    status.classList.remove("contact-form__status--ok", "contact-form__status--err");
    if (kind) status.classList.add("contact-form__status--" + kind);
  }

  function fillLocationFields(form, locationLabel, imageRef) {
    const loc = form.querySelector('[name="Location Type"]');
    const place = form.querySelector('[name="Place Name"]');
    const subject = form.querySelector('[name="_subject"]');
    if (loc) loc.value = locationLabel || "";
    if (place) place.value = imageRef || "";
    if (subject) subject.value = subjectFor(locationLabel, imageRef);
  }

  function bindForm(form) {
    if (!form || form.dataset.formspreeBound === "true") return;
    form.dataset.formspreeBound = "true";
    form.action = FORMSPREE_ENDPOINT;
    form.method = "POST";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      const thanks =
        (form.querySelector(".contact-form__status") || {}).dataset.thanks ||
        "Thanks — we'll be in touch shortly.";

      setStatus(form, "", "");
      if (button) button.disabled = true;

      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(
              (data) => {
                const msg =
                  (data && data.error) ||
                  "Something went wrong. Please email hola@costaricaproductioncompany.com.";
                throw new Error(msg);
              },
              () => {
                throw new Error(
                  "Something went wrong. Please email hola@costaricaproductioncompany.com."
                );
              }
            );
          }

          const loc = form.querySelector('[name="Location Type"]');
          const place = form.querySelector('[name="Place Name"]');
          const savedLoc = loc ? loc.value : "";
          const savedPlace = place ? place.value : "";
          form.reset();
          fillLocationFields(form, savedLoc, savedPlace);
          setStatus(form, "ok", thanks);
        })
        .catch((err) => {
          setStatus(
            form,
            "err",
            err.message ||
              "Something went wrong. Please email hola@costaricaproductioncompany.com."
          );
        })
        .finally(() => {
          if (button) button.disabled = false;
        });
    });
  }

  function mountForm(container, options) {
    if (!container) return;
    container.innerHTML = formMarkup(options);
    bindForm(container.querySelector("form"));
  }

  function imageRefFromSrc(src) {
    if (!src) return "";
    try {
      const path = src.split("?")[0];
      const name = decodeURIComponent(path.split("/").pop() || "");
      return name.replace(/\.[^.]+$/, "");
    } catch (err) {
      return "";
    }
  }

  function mountLightboxEnquiry(container, options) {
    if (!container) return;

    const locationSlug = (options && options.locationSlug) || "";
    const imageRef = (options && options.imageRef) || "";
    const locationLabel = LOCATION_LABELS[locationSlug] || "";

    const existing = container.querySelector("form");
    if (existing) {
      fillLocationFields(existing, locationLabel, imageRef);
      return;
    }

    mountForm(container, {
      locationLabel,
      imageRef,
      forceLocation: true,
    });
  }

  function clearLightboxEnquiry(container) {
    if (!container) return;
    container.innerHTML = "";
  }

  function init() {
    const contact = document.getElementById("gph-contact-form");
    if (contact) {
      if (contact.tagName === "FORM") {
        bindForm(contact);
      } else {
        mountForm(contact, {});
      }
    }

    const location = document.getElementById("location-enquiry-form");
    if (location) {
      const slug = location.dataset.location || document.body.dataset.location || "";
      if (location.tagName === "FORM") {
        fillLocationFields(location, LOCATION_LABELS[slug] || "", "");
        bindForm(location);
      } else {
        mountForm(location, {
          locationLabel: LOCATION_LABELS[slug] || "",
          forceLocation: true,
        });
      }
    }
  }

  window.GPHForms = {
    LOCATION_LABELS,
    imageRefFromSrc,
    mountLightboxEnquiry,
    clearLightboxEnquiry,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
