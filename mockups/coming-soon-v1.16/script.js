const intro = document.querySelector("#motion-intro");
const replay = document.querySelector("#replay-motion");
const signupDialog = document.querySelector("#signup-dialog");
const signupOpeners = [...document.querySelectorAll("[data-open-signup]")];
const signupCloser = document.querySelector("[data-close-signup]");
const revealSignup = document.querySelector("[data-reveal-signup]");
const teaserPanel = document.querySelector('[data-dialog-panel="teaser"]');
const formPanel = document.querySelector('[data-dialog-panel="form"]');
const signupForm = document.querySelector("#dialog-signup-form");
const soundToggle = document.querySelector("#sound-toggle");
const soundLabel = soundToggle?.querySelector("[data-sound-label]");
let ambientAudio = null;

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

function createAmbientAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  const context = new AudioContextClass();
  const master = context.createGain();
  const filter = context.createBiquadFilter();
  const lfo = context.createOscillator();
  const lfoDepth = context.createGain();
  const voices = [174.61, 261.63, 349.23].map((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index * 3 - 3;
    gain.gain.value = index === 0 ? 0.12 : 0.045;
    oscillator.connect(gain).connect(filter);
    oscillator.start();
    return oscillator;
  });

  filter.type = "lowpass";
  filter.frequency.value = 720;
  filter.Q.value = 0.45;
  master.gain.value = 0;
  lfo.type = "sine";
  lfo.frequency.value = 0.075;
  lfoDepth.gain.value = 80;
  lfo.connect(lfoDepth).connect(filter.frequency);
  lfo.start();
  filter.connect(master).connect(context.destination);

  return { context, master, voices, lfo };
}

async function toggleAmbientSound() {
  if (!soundToggle) return;
  if (!ambientAudio) ambientAudio = createAmbientAudio();
  if (!ambientAudio) {
    soundLabel.textContent = "Sound unavailable";
    soundToggle.disabled = true;
    return;
  }

  const isOn = soundToggle.getAttribute("aria-pressed") === "true";
  if (ambientAudio.context.state === "suspended") await ambientAudio.context.resume();
  const now = ambientAudio.context.currentTime;
  ambientAudio.master.gain.cancelScheduledValues(now);
  ambientAudio.master.gain.setValueAtTime(ambientAudio.master.gain.value, now);
  ambientAudio.master.gain.linearRampToValueAtTime(isOn ? 0 : 0.055, now + 1.2);
  soundToggle.setAttribute("aria-pressed", String(!isOn));
  soundLabel.textContent = isOn ? "Play ambience" : "Pause ambience";
}

soundToggle?.addEventListener("click", toggleAmbientSound);

setDialogView("teaser");
