const themeSwitch = document.getElementById("theme-switch");
const range = document.getElementById("progress-bar");
const valSpan = document.getElementById("current-val");
const btnCategories = document.querySelectorAll(".btn-cat");

let darkmode = localStorage.getItem("darkmode");
let currentRangeIndex = 0;

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

// --- PROGRESS BAR (INPUT RANGE) ---
function updatePercent(r) {
  const min = parseFloat(r.min) || 1;
  const max = parseFloat(r.max) || 10;
  const val = parseFloat(r.value);

  // Percentage calculation (1 to 10)
  const percent = ((val - min) / (max - min)) * 100;

  // hides the progress bar thumbnail
  if (percent === 0) {
    range.disabled = !range.disabled;
  }

  // The CSS variable is applied to the same element.
  r.style.setProperty("--percent", percent + "%");

  // Update the value in the span
  if (valSpan) valSpan.textContent = Math.round(val);
}

// Initialize the value on load
updatePercent(range);

// Update when the user changes the range
// range.addEventListener("input", () => updatePercent(range));

// // --- JSON FETCH ---
// async function loadQuizData() {
//   const res = await fetch("../assets/data/quiz.json");
//   quizData = await res.json();
// }
// loadQuizData();

// // --- QUIZ QUESTIONS / RESPONSES ---
// btnCategories.forEach((btn) => {
//   btn.addEventListener("click", () => showQuiz(btn.dataset.cat));
// });

// let question;

// function showQuiz(cat) {
//   currentQuiz = quizData.quizzes.find((q) => q.title === cat);
//   if (!currentQuiz) return;

//   currentQuiz.questions
//     .map((q, i) => {
//       question = q.question;
//     })
//     .join("");
//   console.log(question);
// }
