import React, { useState } from 'react';
import Intro from './components/Intro/Intro';
import Quiz from './components/Quiz/Quiz';
import QuizResults from './components/QuizResults/QuizResults';
import { quizQuestions } from './data/quizQuestions';
import './App.css';

const App: React.FC = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setFinalScore(0);
    setTimeTaken(0);
  };

  const handleQuizFinish = (score: number, time: number) => {
    setFinalScore(score);
    setTimeTaken(time);
    setQuizFinished(true);
  };

  return (
    <div className="app-container">
      {!quizStarted ? (
        <Intro onStart={startQuiz} />
      ) : !quizFinished ? (
        <Quiz 
          questions={quizQuestions} 
          onFinish={handleQuizFinish} 
        />
      ) : (
        <QuizResults
          score={finalScore}
          totalQuestions={quizQuestions.length}
          onRestart={startQuiz}
          timeTaken={timeTaken}
        />
      )}
    </div>
  );
};

export default App;
