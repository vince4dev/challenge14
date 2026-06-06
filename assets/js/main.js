import { updatePercent } from "./ui.js";
import { loadQuizData } from "./quiz.js";

document.addEventListener("DOMContentLoaded", () => {
  updatePercent();
  loadQuizData();
});
