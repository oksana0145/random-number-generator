const form = document.querySelector("#generator-form");
const minInput = document.querySelector("#min");
const maxInput = document.querySelector("#max");
const resultEl = document.querySelector("#result");
const resultLabelEl = document.querySelector("#result-label");
const errorEl = document.querySelector("#error");

const historyListEl = document.querySelector("#history-list");
const clearHistoryBtn = document.querySelector("#clear-history");

const HISTORY_KEY = "random-history";
const HISTORY_LIMIT = 5;

let history = [];

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const setEmptyResultState = () => {
  resultLabelEl.textContent = "Очікуємо рішення долі…";
  resultEl.textContent = "Рішення вже близько";
  resultEl.classList.add("result--empty");
};

const setResult = (value) => {
  resultLabelEl.textContent = "Доля сказала так:";
  resultEl.textContent = value;
  resultEl.classList.remove("result--empty");
};

const clearUI = () => {
  errorEl.textContent = "";
  setEmptyResultState();
};

const validate = (min, max) => {
  if (min >= max) {
    return "Мінімум має бути менше максимуму";
  }

  return null;
};

const renderHistory = () => {
  historyListEl.innerHTML = "";

  history
    .slice()
    .reverse()
    .forEach((value) => {
      const li = document.createElement("li");
      li.className = "history__item";
      li.textContent = value;
      historyListEl.appendChild(li);
    });
};

const saveHistory = () => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

const loadHistory = () => {
  const saved = localStorage.getItem(HISTORY_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      history = parsed;
    }
  } catch {
    history = [];
  }
};

const addToHistory = (value) => {
  history.push(value);

  if (history.length > HISTORY_LIMIT) {
    history = history.slice(history.length - HISTORY_LIMIT);
  }

  saveHistory();
  renderHistory();
};

const clearHistory = () => {
  history = [];
  saveHistory();
  renderHistory();
};

const saveLastRange = (min, max) => {
  localStorage.setItem("random-range", JSON.stringify({ min, max }));
};

const loadLastRange = () => {
  const saved = localStorage.getItem("random-range");
  if (!saved) return;

  try {
    const { min, max } = JSON.parse(saved);
    minInput.value = min;
    maxInput.value = max;
  } catch {}
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearUI();

  const min = Number(minInput.value);
  const max = Number(maxInput.value);

  const error = validate(min, max);
  if (error) {
    errorEl.textContent = error;
    return;
  }

  const randomNumber = getRandomNumber(min, max);
  setResult(randomNumber);

  addToHistory(randomNumber);
  saveLastRange(min, max);
});

clearHistoryBtn.addEventListener("click", clearHistory);

loadLastRange();
loadHistory();
renderHistory();
setEmptyResultState();
