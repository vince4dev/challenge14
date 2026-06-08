// ------------------------------------------------------------------
// --- DOM elements
// ------------------------------------------------------------------
const homeSection = document.getElementById("home");
const quizSection = document.getElementById("quiz");
const scoreSection = document.getElementById("score");
const categoriesBtn = document.getElementById("categories-btn");
const categoriesNav = document.getElementById("categories-nav");
const categoryIcon = document.getElementById("category-icon");
const errorMessage = document.querySelector(".submit__error");
const question = document.getElementById("question");
const options = document.getElementById("quiz-options");
const submitBtn = document.getElementById("submit-btn");
const playAgain = document.getElementById("score-btn");
const range = document.getElementById("progress-bar");
const displayScore = document.getElementById("display-score");
const valSpan = document.getElementById("current-val");
const themeSwitch = document.getElementById("theme-switch");
const categoryTitle = document.getElementById("category-title");
const catIcon = document.getElementById("cat-icon");

// ------------------------------------------------------------------
// --- Initialisation
// ------------------------------------------------------------------
let quizData;
let currentQuiz = null;
let currentQuestionIndex = 0;
let rangeIdx = 0;
let score = 0;

const letters = ["A", "B", "C", "D"];

// ------------------------------------------------------------------
// --- LOAD THE QUIZ
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", initQuiz);

// ------------------------------------------------------------------
// --- Fonction Init QUIZ
// ------------------------------------------------------------------
function initQuiz() {
  valSpan.textContent = 0; // Init the score to 0
  progressBar(valSpan.textContent); // Init to 0 the progress bar
  loadQuizData(); // load the first page
}

// ------------------------------------------------------------------
// --- Load the JSON
// ------------------------------------------------------------------

async function loadQuizData() {
  // init variables
  currentQuiz = null;
  currentQuestionIndex = 0;
  rangeIdx = 0;
  score = 0;
  categoriesBtn.innerHTML = "";
  categoriesNav.style.visibility = "hidden"; // hide category top
  homeSection.style.display = "none"; // hide home section
  quizSection.style.display = "none"; // hide quiz section
  scoreSection.style.display = "none"; // hide score section

  // load the JSON datas
  const res = await fetch("./assets/data/quiz.json");
  quizData = await res.json();
  showHome();
}

// ------------------------------------------------------------------
// --- Show the category buttons
// ------------------------------------------------------------------
function showHome() {
  // show the home section
  homeSection.style.display = "grid";

  // Displays categories
  quizData.quizzes.forEach((quiz, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.innerHTML = `<span class="cat__icon icon__${quiz.title.toLowerCase()}"><img src="${quiz.icon}" alt="" /></span>${quiz.title}`;
    btn.onclick = () => startQuiz(idx);
    categoriesBtn.appendChild(btn);
  });
}

// ------------------------------------------------------------------
// --- Start a quiz – initialise state and show first question
// ------------------------------------------------------------------
function startQuiz(catIndex) {
  // hide the category section
  homeSection.style.display = "none";
  // show quiz section
  quizSection.style.display = "grid";

  currentQuiz = quizData.quizzes[catIndex];

  showCurrentQuestion();
}

// ------------------------------------------------------------------
// --- Render a question and its answer options
// ------------------------------------------------------------------
function showCurrentQuestion() {
  questionsObj = currentQuiz.questions[currentQuestionIndex];
  // Delete question & answers
  question.innerHTML = "";
  options.innerHTML = "";

  // Display the category top
  categoryIcon.src = currentQuiz.icon;
  categoryTitle.textContent = currentQuiz.title;
  catIcon.classList.add(`icon__${currentQuiz.title.toLowerCase()}`);
  categoriesNav.style.visibility = "visible"; // show category top

  // Displays the question
  const quizQuestion = document.createElement("p");
  quizQuestion.textContent = questionsObj.question;
  question.appendChild(quizQuestion);

  // Displays Options
  questionsObj.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "btn answer__btn";

    const letter = letters[i] || String.fromCharCode(65 + i); // Letters A, B, C, D of the icons
    const escapeOpt = escapeHtml(opt); // HTML escape

    btn.innerHTML = `<span class="answer__status"><span class="cat__icon answer__icon">${letter}</span>${escapeOpt}</span>`;

    // The answer and letter are stored in a dataset
    btn.dataset.value = opt;
    btn.dataset.letter = letter;

    btn.onclick = () => {
      btn.classList.add("selected");
      errorMessage.style.display = "none";
      checkAnswer(opt);
    };

    options.appendChild(btn);
  });
}

// ------------------------------------------------------------------
// --- Check answer, give feedback and move on
// ------------------------------------------------------------------
function checkAnswer(selected) {
  // add the score
  if (selected === questionsObj.answer) {
    score++;
  }

  // Disable all answer buttons
  Array.from(document.querySelectorAll(".answer__btn")).forEach((btn) => {
    btn.disabled = true;
    const btnValue = btn.dataset.value;
    const letter = btn.dataset.letter;

    if (btnValue === questionsObj.answer) {
      btn.dataset.status = "correct";
      btn.innerHTML = createAnswerHTML(
        letter,
        escapeHtml(btnValue),
        "./assets/images/icon-correct.svg",
      );
    } else if (btnValue === selected) {
      btn.dataset.status = "incorrect";
      btn.innerHTML = createAnswerHTML(
        letter,
        escapeHtml(btnValue),
        "./assets/images/icon-incorrect.svg",
      );
    }
  });

  // Enabled submit button
  submitBtn.classList.add("active");
  submitBtn.textContent = "Next Question";
}

// ------------------------------------------------------------------
// --- Click on Submit Answer button
// ------------------------------------------------------------------
submitBtn.addEventListener("click", () => {
  // Check if an answer is selected.
  const hasSelected = !!document.querySelector("#quiz-options .btn.selected");
  if (!hasSelected) {
    errorMessage.style.display = "flex"; // Display "Please select an answer"
    return;
  }

  // Progress Bar
  rangeIdx = progressBar(valSpan.textContent);
  valSpan.textContent = rangeIdx;

  // Next question
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.questions.length) {
    showCurrentQuestion();
  } else if (currentQuestionIndex === currentQuiz.questions.length) {
    submitBtn.textContent = "Display Score";
  } else {
    showSore();
  }
});

// ------------------------------------------------------------------
// --- Show score screen
// ------------------------------------------------------------------
function showSore() {
  displayScore.textContent = score;
  // hide the quiz section
  quizSection.style.display = "none";
  // show score section
  scoreSection.style.display = "grid";
}

// ------------------------------------------------------------------
// --- Click on Score button
// ------------------------------------------------------------------
playAgain.addEventListener("click", initQuiz);

// ------------------------------------------------------------------
// --- Progress Bar Update Index
// ------------------------------------------------------------------
function progressBar(rangeIdx) {
  if (rangeIdx < parseInt(range.max, 10)) {
    rangeIdx++;
    range.value = rangeIdx;
    updatePercent(range);
  }
  return rangeIdx;
}

// ------------------------------------------------------------------
// --- PROGRESS BAR (INPUT RANGE)
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// --- HTML escape
// ------------------------------------------------------------------
function escapeHtml(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ------------------------------------------------------------------
// --- Create answer with status Correct/incorrect
// ------------------------------------------------------------------
function createAnswerHTML(letter, value, iconURL) {
  return (
    `<span class="answer__status"><span class="cat__icon answer__icon">${letter}</span>` +
    `${value}</span>` +
    `<img src="${iconURL}" class="icon__check"/>`
  );
}

// ------------------------------------------------------------------
// --- DARKMODE
// ------------------------------------------------------------------
let darkmode = localStorage.getItem("darkmode");

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
