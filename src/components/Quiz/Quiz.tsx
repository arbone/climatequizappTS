import React, { useState, useEffect } from 'react';
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

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(10); // 10 secondi per domanda

  const currentQuestion = questions[state.currentQuestionIndex];

  // Reset timer quando cambia la domanda
  useEffect(() => {
    setTimeLeft(10);
  }, [state.currentQuestionIndex]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !selectedAnswer) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedAnswer) {
      // Tempo scaduto, passa alla prossima domanda
      handleTimeout();
    }
  }, [timeLeft, selectedAnswer]);

  const handleTimeout = () => {
    setSelectedAnswer('');
    setIsAnswerCorrect(false);

    setTimeout(() => {
      moveToNextQuestion(false);
    }, 1000);
  };

  const moveToNextQuestion = (isCorrect: boolean) => {
    setState(prevState => ({
      ...prevState,
      score: isCorrect ? prevState.score + 1 : prevState.score,
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
      isFinished: prevState.currentQuestionIndex === questions.length - 1,
    }));

    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setTimeLeft(10);

    if (state.currentQuestionIndex === questions.length - 1) {
      onFinish(state.score + (isCorrect ? 1 : 0));
    }
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return; // Previene risposte multiple

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correctAnswer;
    setIsAnswerCorrect(isCorrect);

    setTimeout(() => {
      moveToNextQuestion(isCorrect);
    }, 1000);
  };

  // Calcola il colore del timer basato sul tempo rimanente
  const getTimerColor = () => {
    if (timeLeft > 7) return '#4CAF50'; // Verde
    if (timeLeft > 3) return '#FFC107'; // Giallo
    return '#F44336'; // Rosso
  };

  return (
    <div className="quiz-container">
      {/* Progress Bar */}
      <div className="quiz-progress">
        <div className="progress-text">
          Domanda {state.currentQuestionIndex + 1} di {questions.length}
        </div>
        <div className="score-text">
          Punteggio: {state.score}
        </div>
      </div>

      {/* Timer */}
      <div className="quiz-timer-container">
        <div className="time-left">{timeLeft}s</div>
        <div className="quiz-timer">
          <div
            className="quiz-timer-bar"
            style={{
              width: `${(timeLeft / 10) * 100}%`,
              backgroundColor: getTimerColor(),
            }}
          />
        </div>
      </div>

      {/* Question Box */}
      <div className="quiz-question">
        <h2>{currentQuestion.question}</h2>
        
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${
                selectedAnswer === option
                  ? isAnswerCorrect
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="quiz-info">
        {selectedAnswer && (
          <div className={`feedback-message ${isAnswerCorrect ? 'correct' : 'incorrect'}`}>
            {isAnswerCorrect ? 'Corretto!' : 'Sbagliato!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
