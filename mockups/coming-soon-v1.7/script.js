const intro = document.querySelector("#motion-intro");
const replay = document.querySelector("#replay-motion");
const signupDialog = document.querySelector("#signup-dialog");
const signupOpeners = [...document.querySelectorAll("[data-open-signup]")];
const signupCloser = document.querySelector("[data-close-signup]");
const compactSignup = window.matchMedia("(max-width: 900px)");
const themeButtons = [...document.querySelectorAll("[data-theme-option]")];
const themes = new Set(["storyboard", "midnight", "botanical", "stone"]);

const urlParams = new URLSearchParams(window.location.search);
const requestedTheme = urlParams.get("theme");
const initialTheme = themes.has(requestedTheme) ? requestedTheme : "storyboard";

if (urlParams.get("preview") === "device") {
  document.body.classList.add("device-preview");
}

function setTheme(theme) {
  if (!themes.has(theme)) return;
  document.body.dataset.theme = theme;
  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeOption === theme));
  });
  const url = new URL(window.location.href);
  url.searchParams.set("theme", theme);
  window.history.replaceState({}, "", url);
}

function replayMotion() {
  if (!intro) return;
  document.body.classList.remove("motion-complete");
  intro.classList.remove("is-playing");
  void intro.offsetWidth;
  intro.classList.add("is-playing");
}

setTheme(initialTheme);
themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.themeOption));
});
replay?.addEventListener("click", replayMotion);
intro?.addEventListener("animationend", (event) => {
  if (event.target !== intro || event.animationName !== "intro-shell") return;
  intro.classList.remove("is-playing");
  document.body.classList.add("motion-complete");
});

signupOpeners.forEach((opener) => {
  opener.addEventListener("click", (event) => {
    if (!compactSignup.matches || !signupDialog) return;
    event.preventDefault();
    signupDialog.showModal();
    signupDialog.querySelector("input")?.focus();
  });
});

signupCloser?.addEventListener("click", () => signupDialog?.close());
signupDialog?.addEventListener("click", (event) => {
  if (event.target === signupDialog) signupDialog.close();
});

document.querySelectorAll(".join__form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector(".form-message");
    const data = new FormData(form);
    const firstName = String(data.get("first_name") || "").trim();
    const email = String(data.get("email") || "").trim();

    if (!firstName || !email || !email.includes("@")) {
      message.textContent = "Please enter your first name and a valid email address.";
      return;
    }

    message.textContent = "Mockup only — no information was submitted.";
  });
});
