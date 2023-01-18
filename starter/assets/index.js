var questions = [
  {
    question: "Commonly used data types DO Not Include:",
    answers: [
      { text: "1. string", correct: false },
      { text: "2. booleans", correct: false },
      { text: "3. alerts", correct: true },
      { text: "4. numbers", correct: false },
    ],
  },
  {
    question: "Arrays in JavaScript can be used to store _________.",
    answers: [
      { text: "1. numbers and strings", correct: false },
      { text: "2. other arrays", correct: false },
      { text: "3. booleans", correct: false },
      { text: "4. all of the above", correct: true },
    ],
  },
  {
    question:
      "String values must be enclosed with ________ when being assigned to variables.",
    answers: [
      { text: "1. commas", correct: false },
      { text: "2. curly brackets", correct: false },
      { text: "3. quotes", correct: false },
      { text: "4. parenthesis", correct: true },
    ],
  },
  {
    question:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    answers: [
      { text: "1. Javascript", correct: false },
      { text: "2. terminals/bash", correct: false },
      { text: "3. for loops", correct: false },
      { text: "4. console.log", correct: true },
    ],
  },
];

var timeLeft = 75;
var timerID;
var timerEl = document.getElementById("time");
var startButton = document.getElementById("start");

var questionContainerEl = document.getElementById("questions");
var startContainerEl = document.getElementById("start-screen");
var questionEl = document.getElementById("question-title");
var answerButtonsEl = document.getElementById("choices");
var checkAnswerEl = document.getElementById("check-answer");
var viewHighScores = document.getElementById("scores");
var submitButton = document.getElementById("submit");
var clearScoreButton = document.getElementById("clear");
var initialsField = document.getElementById("final-score");
//var restartButton = document.getElementById("restart-btn");
var scoreField = document.getElementById("player-score");
var scores = JSON.parse(localStorage.getItem("highscores")) || [];

var shuffledQuestions, currentQuestionIndex;

// Start button trigger the first question and next button to display
startButton.addEventListener("click", startGame);
answerButtonsEl.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

// Countdown timer
function timeTick() {
  timeLeft--;
  timerEl.textContent = timeLeft;
  if (timeLeft <= 0) {
    saveScore();
  }
}

// Start Quiz
function startGame() {
  timerID = setInterval(timeTick, 1000);
  startContainerEl.classList.add("hide");
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainerEl.classList.remove("hide");

  // Timer will start as soon as start button is clicked
  timeTick();
  setNextQuestion();
}

// Go to next question
function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

// Display questions
function showQuestion(question) {
  questionEl.innerText = question.question;
  question.answers.forEach((answer) => {
    var button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("choices");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsEl.appendChild(button);
  });
}

// Reset state function
function resetState() {
  //clearStatusClass(document.body)

  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild);
  }
}

// Select answer function
function selectAnswer(e) {
  var selectedButton = e.target;
  //console.dir(selectedButton);
  var correct = selectedButton.dataset.correct;
  checkAnswerEl.classList.remove("hide");
  // Check if the answer correct or wrong then show text
  if (correct) {
    checkAnswerEl.innerHTML = "Right";
  } else {
    checkAnswerEl.innerHTML = "Wrong";
    if (timeLeft <= 10) {
      timeLeft = 0;
    } else {
      // If the aswer is wrong, deduct time by 10
      timeLeft -= 15;
    }
  }

  Array.from(answerButtonsEl.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });

  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    answerButtonsEl.classList.remove("hide");
    checkAnswerEl.classList.remove("hide");
  } else {
    startButton.classList.remove("hide");
    saveScore();
  }
}

// Check and show the correct answer by set the buttons colors
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

// Remove all the classes
function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

// Save scores
function saveScore() {
  clearInterval(timerID);
  timerEl.textContent = timeLeft;
  setTimeout(function () {
    localStorage.setItem("scores", JSON.stringify(scores));
    questionContainerEl.classList.add("hide");
    document.getElementById("end-screen").classList.remove("hide");
    document.getElementById("final-score").textContent =
      "Your final score is " + timeLeft;
  }, 2000);
}

var loadScores = function () {
  // Get score from local storage

  if (!saveScore) {
    return false;
  }

  // Convert scores from stringfield format into array
  saveScore = JSON.parse(saveScore);
  var initials = document.querySelector("#final-score").value;
  var newScore = {
    score: timeLeft,
    initials: initials,
  };
  saveScore.push(newScore);
  console.log(saveScore);

  saveScore.forEach((score) => {
    initialsField.innerText = score.initials;
    scoreField.innerText = score.score;
  });
};

// Show high scores
function showHighScores(initials) {
  document.getElementById("scores").classList.remove("hide");
  document.getElementById("end-screen").classList.add("hide");
  startContainerEl.classList.add("hide");
  questionContainerEl.classList.add("hide");
  if (typeof initials == "string") {
    var score = {
      initials,
      timeLeft,
    };
    scores.push(score);
  }

  var highScoreEl = document.getElementById("score");
  highScoreEl.innerHTML = "";
  //console.log(scores)
  for (i = 0; i < scores.length; i++) {
    var div1 = document.createElement("div");
    div1.setAttribute("class", "name-div");
    div1.innerText = scores[i].initials;
    var div2 = document.createElement("div");
    div2.setAttribute("class", "score-div");
    div2.innerText = scores[i].timeLeft;

    highScoreEl.appendChild(div1);
    highScoreEl.appendChild(div2);
  }

  localStorage.setItem("scores", JSON.stringify(scores));
}

// View high scores link
viewHighScores.addEventListener("click", showHighScores);

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  var initials = document.querySelector("#highscore").value;

  showHighScores(initials);
});

// Clear localStorage items
clearScoreButton.addEventListener("click", function () {
  localStorage.clear();
  document.getElementById("scores").innerHTML = "";
});
