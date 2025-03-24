import React, { useState } from 'react';
import { Question, QuizState } from '../../types/quiz';
import './Quiz.css';

interface QuizProps {
  questions: Question[];
  onFinish: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onFinish }) => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    isFinished: false,
  });

  const currentQuestion = questions[state.currentQuestionIndex];

  const handleAnswer = (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setState(prevState => ({
      ...prevState,
      score: isCorrect ? prevState.score + 1 : prevState.score,
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
      isFinished: prevState.currentQuestionIndex === questions.length - 1,
    }));

    if (state.currentQuestionIndex === questions.length - 1) {
      onFinish(state.score + (isCorrect ? 1 : 0));
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        Domanda {state.currentQuestionIndex + 1} di {questions.length}
      </div>
      
      <div className="quiz-question">
        <h2>{currentQuestion.question}</h2>
        
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="quiz-option"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
