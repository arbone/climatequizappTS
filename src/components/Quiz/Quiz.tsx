import React, { useState, useEffect } from 'react';
import { Question } from '../../types/quiz';
import { motion, AnimatePresence } from 'framer-motion';
import './Quiz.css';

interface QuizProps {
  questions: Question[];
  onFinish: (score: number, time: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [quizStartTime] = useState<number>(Date.now());
  const [showQuestion, setShowQuestion] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isStreak, setIsStreak] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (timeLeft > 0 && !selectedAnswer) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedAnswer) {
      handleTimeout();
    }
  }, [timeLeft, selectedAnswer]);

  const handleTimeout = () => {
    setSelectedAnswer('');
    setIsAnswerCorrect(false);
    setShowFeedback(true);
    setFeedbackMessage('Tempo scaduto!');
    setCorrectStreak(0);
    setTimeout(() => {
      moveToNextQuestion(false);
    }, 1000);
  };

  const moveToNextQuestion = (isCorrect: boolean) => {
    setShowQuestion(false);
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setShowFeedback(false);

    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
        onFinish(newScore, totalTime);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setTimeLeft(30);
        setShowQuestion(true);
      }
    }, 300);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correctAnswer;
    setIsAnswerCorrect(isCorrect);
    setShowFeedback(true);

    if (isCorrect) {
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      if (newStreak >= 3) {
        setIsStreak(true);
        setFeedbackMessage('🔥 Hot Streak!');
      } else {
        setFeedbackMessage('Corretto! 👍');
      }
    } else {
      setCorrectStreak(0);
      setIsStreak(false);
      setFeedbackMessage('Sbagliato 😔');
    }

    setTimeout(() => {
      moveToNextQuestion(isCorrect);
    }, 1000);
  };

  const questionVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const feedbackVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  return (
    <div className="quiz-container">
      <motion.div 
        className="quiz-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="quiz-progress">
          <div className="progress-text">
            Domanda {currentQuestionIndex + 1} di {questions.length}
          </div>
          <div className="score-text">
            Punteggio: {score}
            {isStreak && <span className="streak-icon">🔥</span>}
          </div>
        </div>

        <div className="quiz-timer-container">
          <div className={`time-left ${timeLeft <= 5 ? 'time-critical' : ''}`}>
            {timeLeft}s
          </div>
          <div className="quiz-timer">
            <motion.div
              className="quiz-timer-bar"
              initial={{ width: "100%" }}
              animate={{ 
                width: `${(timeLeft / 30) * 100}%`,
                backgroundColor: timeLeft > 15 ? '#4CAF50' : timeLeft > 5 ? '#FFC107' : '#F44336'
              }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode='wait'>
        {showFeedback && (
          <motion.div
            className={`feedback-overlay ${isAnswerCorrect ? 'correct' : 'incorrect'}`}
            variants={feedbackVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {feedbackMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {showQuestion && (
          <motion.div
            key={currentQuestionIndex}
            className="quiz-question"
            variants={questionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <h2>{currentQuestion.question}</h2>
            <div className="quiz-options">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`quiz-option ${
                    selectedAnswer === option
                      ? isAnswerCorrect
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  }`}
                  disabled={!!selectedAnswer}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                  whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
