const intro = document.querySelector("#motion-intro");
const replay = document.querySelector("#replay-motion");
const signupDialog = document.querySelector("#signup-dialog");
const signupOpeners = [...document.querySelectorAll("[data-open-signup]")];
const signupCloser = document.querySelector("[data-close-signup]");
const revealSignup = document.querySelector("[data-reveal-signup]");
const teaserPanel = document.querySelector('[data-dialog-panel="teaser"]');
const formPanel = document.querySelector('[data-dialog-panel="form"]');
const signupForm = document.querySelector("#dialog-signup-form");
const ambientAudio = document.querySelector("#ambient-audio");
if (ambientAudio) {
  ambientAudio.volume = 0.58;
  ambientAudio.muted = false;
  ambientAudio.defaultMuted = false;
}
let motionStartedAt = 0;
let ambientRetryArmed = false;

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("preview") === "device") {
  document.body.classList.add("device-preview");
}

function setDialogView(view) {
  if (!signupDialog || !teaserPanel || !formPanel) return;
  const showForm = view === "form";
  signupDialog.dataset.view = showForm ? "form" : "teaser";
  teaserPanel.hidden = showForm;
  formPanel.hidden = !showForm;
}

function openSignup(view = "teaser") {
  if (!signupDialog) return;
  setDialogView(view);
  if (!signupDialog.open) signupDialog.showModal();
  if (view === "form") {
    signupForm?.querySelector("input")?.focus({ preventScroll: true });
    signupDialog.scrollTop = 0;
  } else {
    revealSignup?.focus();
  }
}

function runMotion() {
  if (!intro) return;
  if (signupDialog?.open) signupDialog.close();
  setDialogView("teaser");
  document.body.classList.remove("motion-complete");
  intro.classList.remove("is-preparing");
  intro.classList.remove("is-playing");
  void intro.offsetWidth;
  motionStartedAt = performance.now();
  intro.classList.add("is-playing");
}

async function playAmbientMusic({ fromGesture = false, alignToMotion = false } = {}) {
  if (!ambientAudio) return true;
  ambientAudio.volume = 0.58;
  ambientAudio.muted = false;
  if (alignToMotion && motionStartedAt) {
    ambientAudio.currentTime = Math.max(0, (performance.now() - motionStartedAt) / 1000);
  } else {
    ambientAudio.currentTime = 0;
  }
  if (urlParams.get("qa") === "autoplay-blocked" && !fromGesture) {
    throw new Error("Simulated browser autoplay block");
  }
  await ambientAudio.play();
  return true;
}

const ambientRetryEvents = ["pointerdown", "touchstart", "keydown"];

function removeAmbientRetry() {
  ambientRetryEvents.forEach((eventName) => window.removeEventListener(eventName, retryAmbientOnInteraction));
  ambientRetryArmed = false;
}

async function retryAmbientOnInteraction() {
  try {
    await playAmbientMusic({ fromGesture: true, alignToMotion: true });
    removeAmbientRetry();
  } catch {
    // Keep the landing experience unobstructed; another normal interaction can retry.
  }
}

function armAmbientRetry() {
  if (ambientRetryArmed) return;
  ambientRetryArmed = true;
  ambientRetryEvents.forEach((eventName) => window.addEventListener(eventName, retryAmbientOnInteraction, { passive: true }));
}

async function beginExperience({ fromGesture = false } = {}) {
  runMotion();
  try {
    await playAmbientMusic({ fromGesture });
    removeAmbientRetry();
  } catch {
    armAmbientRetry();
  }
  return true;
}

replay?.addEventListener("click", () => beginExperience({ fromGesture: true }));
intro?.addEventListener("animationend", (event) => {
  if (event.target !== intro || event.animationName !== "intro-shell") return;
  openSignup("teaser");
  document.body.classList.add("motion-complete");
  intro.classList.remove("is-playing");
});

signupOpeners.forEach((opener) => {
  opener.addEventListener("click", (event) => {
    event.preventDefault();
    openSignup(opener.dataset.openMode === "teaser" ? "teaser" : "form");
  });
});

revealSignup?.addEventListener("click", () => openSignup("form"));
signupCloser?.addEventListener("click", () => signupDialog?.close());
signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = signupForm.querySelector(".form-message");
  const data = new FormData(signupForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();

  if (!name || !email || !email.includes("@") || !phone) {
    message.textContent = "Please enter your name, a valid email address, and your mobile number.";
    return;
  }

  message.textContent = "Thank you. Returning to the landing page…";
  window.setTimeout(() => {
    signupDialog.close();
    signupForm.reset();
    message.textContent = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 800);
});

window.addEventListener("load", () => beginExperience());

setDialogView("teaser");
