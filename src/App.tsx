import React, { useState } from 'react';
import Intro from './components/Intro/Intro';
import Quiz from './components/Quiz/Quiz';
import QuizResults from './components/QuizResults/QuizResults';
import { quizQuestionsPool } from './data/quizQuestions';
import { getRandomQuestions, shuffleOptions } from './data/quizUtils';
import './App.css';

const App: React.FC = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  
  // Modifica la funzione per ottenere domande random con opzioni mescolate
  const getRandomQuestionsWithShuffledOptions = () => {
    const randomQuestions = getRandomQuestions(quizQuestionsPool, 10);
    return randomQuestions.map(question => shuffleOptions(question));
  };

  const [currentQuestions, setCurrentQuestions] = useState(getRandomQuestionsWithShuffledOptions());

  const startQuiz = () => {
    setCurrentQuestions(getRandomQuestionsWithShuffledOptions());
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
          questions={currentQuestions}
          onFinish={handleQuizFinish} 
        />
      ) : (
        <QuizResults
          score={finalScore}
          totalQuestions={10}
          onRestart={startQuiz}
          timeTaken={timeTaken}
        />
      )}
    </div>
  );
};

export default App;
