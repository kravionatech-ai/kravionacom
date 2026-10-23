/**
 * AssistantFormGuide.js
 * Intelligent real-time observer for form fields across the website.
 * Detects focus, extracts field metadata, provides contextual guidance hints,
 * coordinates robot eye gaze toward the active field, and handles validation explanations.
 */

export function extractFieldMetadata(element) {
  if (!element || !(element instanceof HTMLElement)) return null;

  const tag = element.tagName.toLowerCase();
  if (!["input", "textarea", "select"].includes(tag)) return null;

  const type = (element.getAttribute("type") || "text").toLowerCase();
  const name = element.getAttribute("name") || "";
  const id = element.getAttribute("id") || "";
  const placeholder = element.getAttribute("placeholder") || "";
  const isRequired = element.hasAttribute("required") || element.getAttribute("aria-required") === "true";

  // Ignore hidden, password, or sensitive fields
  if (["hidden", "password"].includes(type)) return null;

  // Resolve associated label
  let labelText = "";
  if (id) {
    const labelEl = document.querySelector(`label[for="${id}"]`);
    if (labelEl) labelText = labelEl.innerText.trim();
  }
  if (!labelText && element.closest("label")) {
    labelText = element.closest("label").innerText.trim();
  }
  if (!labelText) {
    const prevLabel = element.parentElement?.querySelector("label");
    if (prevLabel) labelText = prevLabel.innerText.trim();
  }
  if (!labelText) {
    labelText = element.getAttribute("aria-label") || "";
  }

  // Derive guidance message intelligently from field attributes
  const labelClean = labelText.toLowerCase();
  const nameClean = name.toLowerCase();
  let guidance = "";

  if (type === "email" || labelClean.includes("email") || nameClean.includes("email")) {
    guidance = "Enter your work email address so our team can send your proposal and reply to you.";
  } else if (type === "tel" || labelClean.includes("phone") || labelClean.includes("whatsapp") || nameClean.includes("phone")) {
    guidance = "Add your phone number or WhatsApp with country code for quick project updates.";
  } else if (labelClean.includes("first name") || nameClean.includes("firstname")) {
    guidance = "Please enter your first name here.";
  } else if (labelClean.includes("last name") || nameClean.includes("lastname")) {
    guidance = "Please enter your last name.";
  } else if (labelClean.includes("name") || nameClean.includes("name")) {
    guidance = "Please enter your full name.";
  } else if (tag === "textarea" || labelClean.includes("message") || nameClean.includes("message") || labelClean.includes("project")) {
    guidance = "Tell us briefly about the project you want to build, tech requirements, or goals.";
  } else if (labelClean.includes("subject") || nameClean.includes("subject")) {
    guidance = "Enter a short subject, such as 'Next.js Web Build' or 'Technical SEO Audit'.";
  } else if (placeholder) {
    guidance = `Here you can enter ${placeholder.toLowerCase().replace(/^(e\.g\.?|enter)\s*/i, "")}.`;
  } else if (labelText) {
    guidance = `Please fill in your ${labelText}.`;
  } else {
    guidance = "Complete this field to continue.";
  }

  if (isRequired) {
    guidance += " (Required field)";
  }

  // Compute field screen coordinates for robot eye gaze tracking
  const rect = element.getBoundingClientRect();
  const fieldCenterX = rect.left + rect.width / 2;
  const fieldCenterY = rect.top + rect.height / 2;

  return {
    element,
    tag,
    type,
    name,
    id,
    labelText: labelText || placeholder || name,
    placeholder,
    isRequired,
    guidance,
    fieldCenterX,
    fieldCenterY,
  };
}

export function attachFormObserver({ onFieldFocus, onFieldBlur, onValidationNotice }) {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};

  let lastSpokenField = null;

  const handleFocusIn = (e) => {
    const meta = extractFieldMetadata(e.target);
    if (!meta) return;

    // Subtly highlight the field with a focus indicator without breaking styles
    meta.element.classList.add("ring-2", "ring-teal-500/20");

    if (onFieldFocus) {
      onFieldFocus(meta, meta.name !== lastSpokenField);
    }
    lastSpokenField = meta.name;
  };

  const handleFocusOut = (e) => {
    const target = e.target;
    if (target && target instanceof HTMLElement) {
      target.classList.remove("ring-2", "ring-teal-500/20");

      // Check for validation error on blur
      if (typeof target.checkValidity === "function" && !target.checkValidity()) {
        const message = target.validationMessage || "Please complete this required field properly.";
        if (onValidationNotice) {
          onValidationNotice(message, target);
        }
      }
    }
    if (onFieldBlur) onFieldBlur(e);
  };

  document.addEventListener("focusin", handleFocusIn, true);
  document.addEventListener("focusout", handleFocusOut, true);

  return () => {
    document.removeEventListener("focusin", handleFocusIn, true);
    document.removeEventListener("focusout", handleFocusOut, true);
  };
}
