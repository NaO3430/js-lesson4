const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

class Quiz {
  constructor(quizData) {
    this.quizDataList = quizData.results;
    this.correctAnswersNum = 0;
  }
  getQuizCategory(index) {
    return this.quizDataList[index - 1].category;
  }
  getQuizDifficulty(index) {
    return this.quizDataList[index - 1].difficulty;
  }
  getQuizNumber() {
    return this.quizDataList.length;
  }
  getQuizQuestion(index) {
    return this.quizDataList[index - 1].question;
  }
  getCorrectAnswer(index) {
    return this.quizDataList[index - 1].correct_answer;
  }
  getIncorrectAnswers(index) {
    return this.quizDataList[index - 1].incorrect_answers;
  }

  countCorrectAnswersNum(index, answer) {
    const correctAnswer = this.quizDataList[index - 1].correct_answer;
    if (answer === correctAnswer) {
      return this.correctAnswersNum++;
    }
  }
  getCorrectAnswersNum() {
    return this.correctAnswersNum;
  }
}

const titleElement = document.getElementById('title');
const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const startButton = document.getElementById('start-btn');
const genreElement = document.getElementById('genre');
const difficultyElement = document.getElementById('difficulty');

startButton.addEventListener('click', () => {
  startButton.hidden = true;
  fetchQuizData(1);
});

const fetchQuizData = async (index) => {
  titleElement.textContent = '取得中';
  questionElement.textContent = '少々お待ち下さい';
  try {
    const response = await fetch(API_URL);
    const quizData = await response.json();
    const quizInstance = new Quiz(quizData);
    setNextQuiz(quizInstance, index);
  } catch (error) {
    console.log(error);
  }
};

const setNextQuiz = (quizInstance, index) => {
  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.firstChild);
  }
  index <= quizInstance.getQuizNumber()
    ? createQuiz(quizInstance, index)
    : finishQuiz(quizInstance);
};

const createQuiz = (quizInstance, index) => {
  titleElement.innerHTML = `問題${index}`;
  genreElement.innerHTML = `【ジャンル】 ${quizInstance.getQuizCategory(
    index
  )}`;
  difficultyElement.innerHTML = `【難易度】${quizInstance.getQuizDifficulty(
    index
  )}`;
  questionElement.innerHTML = quizInstance.getQuizQuestion(index);

  const answers = createAnswers(quizInstance, index);

  answers.forEach((answer) => {
    const answerElement = document.createElement('li');
    answersContainer.appendChild(answerElement);
    const buttonElement = document.createElement('button');
    buttonElement.innerHTML = answer;
    answersContainer.appendChild(buttonElement);
    buttonElement.addEventListener('click', () => {
      quizInstance.countCorrectAnswersNum(index, answer);
      index++;
      setNextQuiz(quizInstance, index);
    });
  });
};

const finishQuiz = (quizInstance) => {
  titleElement.textContent = `あなたの正答数は${quizInstance.getCorrectAnswersNum()}です`;
  genreElement.textContent = '';
  difficultyElement.textContent = '';
  questionElement.textContent = '再チャレンジしたい場合は下をクリック'; //クイズが終わった後にもう一度スタート画面に戻れるようにする
  const restartButton = document.createElement('button');
  restartButton.textContent = 'ホームに戻る';
  answersContainer.appendChild(restartButton);
  restartButton.addEventListener('click', () => {
    location.reload();
  });
};

const createAnswers = (quizInstance, index) => {
  const answers = [
    quizInstance.getCorrectAnswer(index),
    ...quizInstance.getIncorrectAnswers(index),
  ];
  return shuffleAnswers(answers);
};

const shuffleAnswers = ([...answers]) => {
  for (let i = answers.length - 1; i >= 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[r]] = [answers[r], answers[i]];
  }
  return answers;
};
