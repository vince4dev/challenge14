let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("theme-switch");

// DARKMODE
const enabledDarkMode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};

const disabledDarkMode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", null);
};

darkmode = localStorage.getItem("darkmode");
if (darkmode === "active") enabledDarkMode();

themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    enabledDarkMode();
  } else {
    disabledDarkMode();
  }
});
