const quiz = document.getElementById("quiz");
const choose = document.getElementById("choose");
const home = document.getElementById("home");
const errorMessage = document.querySelector(".submit__error");

// ------------------------------------------------------------------
// --- Load the JSON
// ------------------------------------------------------------------
let quizData;

async function loadQuizData() {
  const res = await fetch("./assets/data/quiz.json");
  quizData = await res.json();
  showHome();
}

// ------------------------------------------------------------------
// --- Show the category buttons
// ------------------------------------------------------------------
function showHome() {
  currentQuiz = null;
  // currentQuestionIndex = 0;

  // hide quiz section
  // quiz.style.display = "none";

  // Delete categories
  choose.innerHTML = "";

  // Displays categories
  quizData.quizzes.forEach((quiz, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.innerHTML = `<span class="cat__icon icon__${quiz.title.toLowerCase()}"><img src="${quiz.icon}" alt="" /></span>${quiz.title}`;
    btn.onclick = () => startQuiz(idx);
    choose.appendChild(btn);
  });
}

// ------------------------------------------------------------------
// --- Start a quiz – initialise state and show first question
// ------------------------------------------------------------------
let currentQuiz = null;
let currentQuestionIndex = 0;

function startQuiz(catIndex) {
  // hide the category section
  home.style.display = "none";
  // show quiz section
  quiz.style.display = "grid";

  currentQuiz = quizData.quizzes[catIndex];
  // currentQuestionIndex = 0;

  showCurrentQuestion();
}

// ------------------------------------------------------------------
// --- Render a question and its answer options
// ------------------------------------------------------------------
function showCurrentQuestion() {
  const question = document.getElementById("question");
  const options = document.getElementById("quiz-options");
  const letters = ["A", "B", "C", "D"];

  const questionsObj = currentQuiz.questions[currentQuestionIndex];

  // Delete question & answers
  question.innerHTML = "";
  options.innerHTML = "";

  // Displays the question
  const quizQuestion = document.createElement("p");
  quizQuestion.textContent = questionsObj.question;
  question.appendChild(quizQuestion);

  // Displays Options
  questionsObj.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "btn answer__btn";

    // Letters A, B, C, D of the icons
    const letter = letters[i] || String.fromCharCode(65 + i);
    // HTML escape
    const escapeOpt = escapeHtml(opt);

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
  const questionsObj = currentQuiz.questions[currentQuestionIndex];

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
// --- Click on Submit button
// ------------------------------------------------------------------
const submitBtn = document.getElementById("submit-btn");
let rangeIdx = 0;

submitBtn.addEventListener("click", () => {
  // We check if an answer is selected.
  const hasSelected = !!document.querySelector("#quiz-options .btn.selected");
  // Check if selected answer
  if (!hasSelected) {
    errorMessage.style.display = "flex";
    return;
  }

  // Progress Bar
  let rangeIdx = progressBar(valSpan.textContent);
  console.log(rangeIdx);
  valSpan.textContent = rangeIdx;

  // Next question
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.questions.length) {
    showCurrentQuestion();
  } else {
    showSore();
  }
});

// ------------------------------------------------------------------
// --- Show a simple finish screen
// ------------------------------------------------------------------
function showSore() {}

// ------------------------------------------------------------------
// --- Progress Bar
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
// --- Load the Quiz
// ------------------------------------------------------------------
loadQuizData();
