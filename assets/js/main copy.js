// ==================================================================
//  STATE
// ==================================================================
const state = {
  quizData: "",
  currentQuiz: null,
  currentQuestionIndex: 0,
  score: 0,
  rangeIdx: 1,
  questionsObj: null,
  letters: ["A", "B", "C", "D"],
};

// ==================================================================
//  DOM (UI)
// ==================================================================
const UI = {
  homeSection: document.getElementById("home-section"),
  quizSection: document.getElementById("quiz-section"),
  scoreSection: document.getElementById("score-section"),
  categoriesContainer: document.getElementById("home-cat-btn"),
  categoriesScore: document.getElementById("categories-score"),
  questionContainer: document.getElementById("quiz-question"),
  optionsContainer: document.getElementById("quiz-options"),
  catIconNav: document.getElementById("nav-cat-icon"),
  catTitleNav: document.getElementById("nav-cat-title"),
  catIconNavContainer: document.getElementById("cat-icon-nav-container"),
  catIconScoreContainer: document.getElementById("cat-icon-score-container"),
  categoryNav: document.getElementById("nav-category"),
  submitBtn: document.getElementById("submit-btn"),
  errorMessage: document.getElementById("submit-error"),
  displayScore: document.getElementById("display-score"),
  catIconScore: document.getElementById("cat-icon-score"),
  catTitleScore: document.getElementById("cat-title-score"),
  playAgainBtn: document.getElementById("score-btn"),
  rangeInput: document.getElementById("progress-range"),
  valSpan: document.getElementById("val-span"),
  themeSwitch: document.getElementById("darkmode-switch"),
};

// ==================================================================
//  RENDER FUNCTION (View)
// ==================================================================
const View = {
  renderCategories() {
    UI.categoriesContainer.innerHTML = "";
    UI.categoryNav.style.visibility = "hidden";

    state.quizData.quizzes.forEach((quiz, idx) => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.innerHTML = `<span class="cat__icon icon__${quiz.title.toLowerCase()}"><img src="${quiz.icon}" alt="Category Title" /></span>${quiz.title}`;
      btn.onclick = () => Controller.startQuiz(idx);
      UI.categoriesContainer.appendChild(btn);
    });
  },

  renderQuestion() {
    UI.questionContainer.innerHTML = "";
    UI.optionsContainer.innerHTML = "";

    // Header Quiz
    UI.catIconNav.src = state.currentQuiz.icon;
    UI.catTitleNav.textContent = state.currentQuiz.title;
    UI.catIconNavContainer.className = `cat__icon icon__${state.currentQuiz.title.toLowerCase()}`;
    UI.categoryNav.style.visibility = "visible";

    // Question
    const quizQuestion = document.createElement("p");
    quizQuestion.textContent = state.questionsObj.question;
    UI.questionContainer.appendChild(quizQuestion);

    // Options
    state.questionsObj.options.forEach((opt, i) => {
      const btn = this.createOptionButton(opt, i);
      UI.optionsContainer.appendChild(btn);
    });
  },

  renderScore() {
    UI.catIconScore.src = state.currentQuiz.icon;
    UI.catTitleScore.textContent = state.currentQuiz.title;
    UI.displayScore.textContent = `${state.score}`;
    UI.catIconScoreContainer.classList.add(
      `icon__${state.currentQuiz.title.toLowerCase()}`,
    );
  },

  showSection(section) {
    UI.homeSection.classList.add("hidden");
    UI.quizSection.classList.add("hidden");
    UI.scoreSection.classList.add("hidden");

    if (section === "home") UI.homeSection.classList.remove("hidden");
    if (section === "quiz") UI.quizSection.classList.remove("hidden");
    if (section === "score") UI.scoreSection.classList.remove("hidden");
  },

  createOptionButton(opt, i) {
    const btn = document.createElement("button");
    btn.className = "btn answer__btn";
    const letter = state.letters[i] || String.fromCharCode(65 + i);

    btn.innerHTML = `<span class="answer__status"><span class="cat__icon answer__icon">${letter}</span>${this.escapeHtml(opt)}</span>`;
    btn.dataset.letter = letter;
    btn.dataset.value = opt;
    btn.onclick = () => Controller.handleAnswerSelection(btn, opt);

    return btn;
  },

  updateAnswerUI(btn, isCorrect) {
    const letter = btn.dataset.letter;
    const value = btn.dataset.value;
    const icon = isCorrect
      ? "./assets/images/icon-correct.svg"
      : "./assets/images/icon-incorrect.svg";

    btn.dataset.status = isCorrect ? "correct" : "incorrect";
    btn.innerHTML = `
            <span class="answer__status">
                <span class="cat__icon answer__icon">${letter}</span>${this.escapeHtml(value)}
            </span>
            <img src="${icon}" class="icon__check"/>
        `;
  },

  createAnswerHTML(letter, value, iconURL) {
    return (
      `<span class="answer__status"><span class="cat__icon answer__icon">${letter}</span>` +
      `${value}</span>` +
      `<img src="${iconURL}" class="icon__check"/>`
    );
  },

  updateProgressBar(value, max) {
    const min = 1;
    const percent = ((value - min) / (max - min)) * 100;

    UI.rangeInput.style.setProperty("--percent", percent + "%");
    UI.rangeInput.setAttribute("aria-valuenow", value);
    UI.valSpan.textContent = Math.round(value);

    // Thumbnail management if percentage is 0
    UI.rangeInput.disabled = percent === 0;
  },

  escapeHtml(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  },

  errorMessage() {
    const hasSelected = !!document.querySelector("#quiz-options .btn.selected");
    return hasSelected;
  },
};

// ==================================================================
//  CONTROLLER
// ==================================================================
const Controller = {
  async fetchData(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Erreur HTTP : ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      state.quizData = data;
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données :",
        error.message,
      );
    }
  },

  startQuiz(quizIndex) {
    state.currentQuiz = state.quizData.quizzes[quizIndex];
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.rangeIdx = 1;

    View.showSection("quiz");
    this.loadQuestion();
  },

  loadQuestion() {
    state.questionsObj =
      state.currentQuiz.questions[state.currentQuestionIndex];

    View.updateProgressBar(
      state.rangeIdx,
      state.currentQuiz.questions.length + 1,
    );
    View.renderQuestion();
  },

  handleAnswerSelection(btn, selectedValue) {
    const isCorrect = selectedValue === state.questionsObj.answer;
    UI.errorMessage.style.display = "none";
    btn.classList.add("selected");

    // add the score
    if (isCorrect) state.score++;

    // Disable all answer buttons
    Array.from(UI.optionsContainer.querySelectorAll(".answer__btn")).forEach(
      (b) => {
        const btnValue = b.dataset.value;
        b.disabled = true;

        if (btnValue === state.questionsObj.answer) {
          b.dataset.status = "correct";
          View.updateAnswerUI(b, true);
        } else if (btnValue === selectedValue) {
          b.dataset.status = "incorrect";
          View.updateAnswerUI(b, false);
        }
      },
    );
  },

  nextQuestion() {
    const hasSelected = View.errorMessage();

    if (!hasSelected) {
      UI.errorMessage.style.display = "flex";
      return;
    } else {
      UI.errorMessage.style.display = "none";
    }

    state.currentQuestionIndex++;
    if (state.currentQuestionIndex < state.currentQuiz.questions.length) {
      state.rangeIdx++;
      this.loadQuestion();
    } else if (
      state.currentQuestionIndex === state.currentQuiz.questions.length
    ) {
      UI.submitBtn.textContent = "Display Score";
      View.updateProgressBar(
        state.rangeIdx,
        state.currentQuiz.questions.length,
      );
    } else {
      this.finishQuiz();
    }
  },

  finishQuiz() {
    View.renderScore();
    View.showSection("score");
  },

  initDarkMode() {
    const isDark = localStorage.getItem("darkmode") === "active";

    if (isDark) {
      this.enableDarkMode();
    }

    UI.themeSwitch.addEventListener("change", () => {
      if (UI.themeSwitch.checked) {
        this.enableDarkMode();
      } else {
        this.disableDarkMode();
      }
    });
  },

  enableDarkMode() {
    UI.themeSwitch.checked = true;
    UI.themeSwitch.classList.add("switch-checked");
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
  },

  disableDarkMode() {
    UI.themeSwitch.checked = false;
    UI.themeSwitch.classList.remove("switch-checked");
    document.body.classList.remove("darkmode");
    localStorage.removeItem("darkmode");
  },

  initQuiz() {
    View.renderCategories();
    View.showSection("home");
  },
};

// ==================================================================
//  CLICK BUTTONS
// ==================================================================
UI.playAgainBtn.onclick = () => Controller.initQuiz();
UI.submitBtn.onclick = () => Controller.nextQuestion();

// ==================================================================
//  LOAD APPLICATION
// ==================================================================
document.addEventListener("DOMContentLoaded", async () => {
  // load JSON data
  await Controller.fetchData("./assets/data/data.json");

  View.renderCategories();
  Controller.initDarkMode();
});
