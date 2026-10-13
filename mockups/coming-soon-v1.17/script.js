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
if (ambientAudio) ambientAudio.volume = 0.22;

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

function replayMotion() {
  if (!intro) return;
  if (signupDialog?.open) signupDialog.close();
  setDialogView("teaser");
  document.body.classList.remove("motion-complete");
  intro.classList.remove("is-playing");
  void intro.offsetWidth;
  intro.classList.add("is-playing");
}

replay?.addEventListener("click", replayMotion);
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

async function startAmbientMusic() {
  if (!ambientAudio) return;
  ambientAudio.volume = 0.22;
  if (!ambientAudio.paused) return;
  try {
    await ambientAudio.play();
  } catch {
    // Audible autoplay is blocked in some browsers. The first visitor gesture retries playback.
  }
}

function startAmbientMusicFromGesture() {
  startAmbientMusic();
  window.removeEventListener("pointerdown", startAmbientMusicFromGesture, true);
  window.removeEventListener("keydown", startAmbientMusicFromGesture, true);
  window.removeEventListener("touchstart", startAmbientMusicFromGesture, true);
}

window.addEventListener("load", startAmbientMusic);
window.addEventListener("pointerdown", startAmbientMusicFromGesture, true);
window.addEventListener("keydown", startAmbientMusicFromGesture, true);
window.addEventListener("touchstart", startAmbientMusicFromGesture, true);

setDialogView("teaser");
