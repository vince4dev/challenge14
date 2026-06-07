const themeSwitch = document.getElementById("theme-switch");
const valSpan = document.getElementById("current-val");

let darkmode = localStorage.getItem("darkmode");

// --- DARKMODE ---
const enabledDarkMode = () => {
  themeSwitch.classList.add("switch-checked");
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};

const disabledDarkMode = () => {
  themeSwitch.classList.remove("switch-checked");
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", null);
};

darkmode = localStorage.getItem("darkmode");
if (darkmode === "active") {
  themeSwitch.checked = true;
  themeSwitch.classList.add("switch-checked");
  enabledDarkMode();
}

themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    enabledDarkMode();
  } else {
    disabledDarkMode();
  }
});

// Initialize the value on load
// updatePercent(range);
