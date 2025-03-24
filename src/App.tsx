import React, { useState } from 'react';
import Intro from './components/Intro/Intro';
import Quiz from './components/Quiz/Quiz';
import { quizQuestions } from './data/quizQuestions';
import './App.css';

const App: React.FC = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleQuizFinish = (score: number) => {
    setFinalScore(score);
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
        <div>
          <h2>Quiz completato!</h2>
          <p>Punteggio finale: {finalScore}</p>
          {/* Aggiungeremo la schermata finale più tardi */}
        </div>
      )}
    </div>
  );
};

export default App;
