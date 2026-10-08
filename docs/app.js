"use strict";

const prompts = [
  { category: "Everyday", text: "Recommend a book, film, or podcast to a friend. Give one reason it is worth their time.", cue: "Recommendation → reason → who it is for" },
  { category: "Everyday", text: "Explain a hobby to someone who has never tried it. Help them take a first step.", cue: "What it is → why you enjoy it → first step" },
  { category: "Everyday", text: "Describe a small change that made your day easier. Make the benefit concrete.", cue: "Before → change → after" },
  { category: "Everyday", text: "Politely turn down an invitation while keeping the relationship warm.", cue: "Appreciation → clear answer → alternative, if you want one" },
  { category: "Everyday", text: "Explain a familiar technical term without using other technical terms.", cue: "Plain definition → everyday example → why it matters" },
  { category: "Everyday", text: "Ask for help with a task. Make it clear what you have tried and what you need.", cue: "Goal → what you tried → specific request" },
  { category: "Meetings", text: "Give an update on a project that is on track. End with what happens next.", cue: "Current status → useful detail → next step" },
  { category: "Meetings", text: "A deadline is at risk. Explain the obstacle and recommend a realistic next step.", cue: "Risk → impact → recommendation" },
  { category: "Meetings", text: "Disagree with a proposal while showing that you understand its goal.", cue: "Shared goal → concern → alternative" },
  { category: "Meetings", text: "Ask your team to choose between a faster solution and a more flexible one.", cue: "Decision → tradeoff → your recommendation" },
  { category: "Meetings", text: "Summarize a long discussion into a decision, an owner, and a next action. Invent a simple scenario.", cue: "Decision → owner → next action" },
  { category: "Meetings", text: "Explain why a task needs more time without getting lost in its implementation details.", cue: "Outcome → reason → revised plan" },
  { category: "Interviews", text: "Introduce yourself for a role you would like. Connect your experience to the work.", cue: "Current focus → relevant experience → what you want next" },
  { category: "Interviews", text: "Describe a time you solved an unclear problem. Explain your own contribution.", cue: "Situation → task → action → result" },
  { category: "Interviews", text: "Talk about a mistake and what you changed afterward. Choose an example you are comfortable sharing.", cue: "Mistake → responsibility → change" },
  { category: "Interviews", text: "Explain how you handled a disagreement with a teammate.", cue: "Difference → conversation → outcome" },
  { category: "Interviews", text: "Describe something you learned quickly and how you put it into practice.", cue: "Need → learning approach → application" },
  { category: "Interviews", text: "Answer a question about a skill you have not used yet, honestly and constructively.", cue: "Current experience → related skill → learning plan" },
  { category: "Stories", text: "Tell a short story about a plan that went wrong and what you did next.", cue: "Setup → surprise → response → ending" },
  { category: "Stories", text: "Describe a moment when you changed your mind.", cue: "Original view → new information → new view" },
  { category: "Stories", text: "Tell someone about a small win that mattered to you.", cue: "Why it mattered → what happened → what you took from it" },
  { category: "Stories", text: "Describe the first time you tried something unfamiliar.", cue: "Expectation → experience → discovery" },
  { category: "Stories", text: "Tell a story about a helpful piece of advice. Include what you did with it.", cue: "Situation → advice → action → outcome" },
  { category: "Stories", text: "Describe a place through one memorable moment rather than a list of features.", cue: "Place → moment → why you remember it" },
  { category: "Impromptu", text: "Should a team have one meeting-free day each week? Pick a position and acknowledge one tradeoff.", cue: "Point → reason → example → point" },
  { category: "Impromptu", text: "Which everyday skill deserves more attention in school? Explain your choice.", cue: "Choice → reason → practical example" },
  { category: "Impromptu", text: "Is it better to start with a rough draft or a detailed plan? Explain when your answer applies.", cue: "Position → context → example" },
  { category: "Impromptu", text: "If you could improve one part of your neighborhood, what would you choose and why?",
    cue: "Change → who it helps → first step" },
  { category: "Impromptu", text: "What makes feedback useful? Explain using an invented example.", cue: "Principle → example → takeaway" },
  { category: "Impromptu", text: "Choose an ordinary object and explain what it teaches you about good design.", cue: "Object → observation → lesson" }
];

const category = document.querySelector("#category");
const duration = document.querySelector("#duration");
const promptText = document.querySelector("#prompt-text");
const promptCategory = document.querySelector("#prompt-category");
const cue = document.querySelector("#cue");
const timer = document.querySelector("#timer");
const toggle = document.querySelector("#toggle-timer");
const status = document.querySelector("#timer-status");
let currentIndex = 0;
let remaining = Number(duration.value) * 1000;
let deadline = 0;
let interval = null;

function renderTime() {
  const seconds = Math.max(0, Math.ceil(remaining / 1000));
  timer.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function stopInterval() {
  if (interval !== null) window.clearInterval(interval);
  interval = null;
}

function resetTimer() {
  stopInterval();
  remaining = Number(duration.value) * 1000;
  toggle.textContent = "Start practice";
  status.textContent = "Ready when you are. Take a breath, then begin.";
  renderTime();
}

function tick() {
  remaining = Math.max(0, deadline - Date.now());
  renderTime();
  if (remaining === 0) {
    stopInterval();
    toggle.textContent = "Practice again";
    status.textContent = "Time is up. Finish your thought, then reflect below.";
  }
}

toggle.addEventListener("click", () => {
  if (interval !== null) {
    remaining = Math.max(0, deadline - Date.now());
    stopInterval();
    renderTime();
    toggle.textContent = remaining > 0 ? "Resume practice" : "Practice again";
    status.textContent = remaining > 0 ? "Paused. Continue when you are ready." : "Time is up. Finish your thought, then reflect below.";
    return;
  }
  if (remaining <= 0) remaining = Number(duration.value) * 1000;
  deadline = Date.now() + remaining;
  toggle.textContent = "Pause";
  status.textContent = "Say your answer aloud. Aim for one clear idea.";
  interval = window.setInterval(tick, 100);
  tick();
});

function nextPrompt() {
  const candidates = prompts.map((prompt, index) => ({ ...prompt, index }))
    .filter((prompt) => (category.value === "All" || prompt.category === category.value) && prompt.index !== currentIndex);
  const next = candidates[Math.floor(Math.random() * candidates.length)];
  currentIndex = next.index;
  promptText.textContent = next.text;
  promptCategory.textContent = next.category;
  cue.textContent = next.cue;
  resetTimer();
}

category.addEventListener("change", nextPrompt);
duration.addEventListener("change", resetTimer);
document.querySelector("#next-prompt").addEventListener("click", nextPrompt);
document.querySelector("#reset-timer").addEventListener("click", resetTimer);
document.addEventListener("visibilitychange", () => { if (interval !== null) tick(); });
renderTime();
