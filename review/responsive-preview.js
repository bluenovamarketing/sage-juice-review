const deviceShell = document.querySelector("#device-shell");
const deviceFrame = document.querySelector("#device-frame");
const previewLabel = document.querySelector("#preview-label");
const deviceButtons = [...document.querySelectorAll("[data-device]")];
const params = new URLSearchParams(window.location.search);
const devices = new Set(["phone", "tablet"]);
const themes = new Set(["storyboard", "midnight", "botanical", "stone"]);
const theme = themes.has(params.get("theme")) ? params.get("theme") : "storyboard";

function setDevice(device) {
  if (!devices.has(device)) return;
  deviceShell.dataset.device = device;
  previewLabel.textContent = device === "tablet" ? "Tablet preview · 768px" : "Phone preview · 390px";
  deviceButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.device === device));
  });
  deviceFrame.src = `../mockups/coming-soon-v1.7/?theme=${theme}&preview=device`;
  const url = new URL(window.location.href);
  url.searchParams.set("device", device);
  url.searchParams.set("theme", theme);
  window.history.replaceState({}, "", url);
}

deviceButtons.forEach((button) => {
  button.addEventListener("click", () => setDevice(button.dataset.device));
});

setDevice(devices.has(params.get("device")) ? params.get("device") : "phone");
