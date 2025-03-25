import React, { useState, useEffect } from 'react';
import { Question } from '../../types/quiz';
import { Achievement, ACHIEVEMENTS } from '../../types/achievements';
import { motion, AnimatePresence } from 'framer-motion';
import AchievementPopup from '../Achievements/AchievementPopup';
import './Quiz.css';
import { GameMode, GAME_MODES } from '../../types/gameMode';
import GameModeSelector from '../GameModeSelector/GameModeSelector';

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
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const modeSettings = gameMode ? GAME_MODES[gameMode] : null;

  useEffect(() => {
    if (!gameMode || !quizStarted) return;
    
    if (gameMode === 'timeAttack') {
      if (currentQuestionIndex === 0) {
        setTimeLeft(modeSettings!.timeLimit);
      }
    } else if (gameMode !== 'practice') {
      setTimeLeft(modeSettings!.timeLimit);
    }
  }, [currentQuestionIndex, gameMode, quizStarted, modeSettings]);

  useEffect(() => {
    if (timeLeft > 0 && !selectedAnswer && quizStarted && gameMode !== 'practice') {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedAnswer && quizStarted && gameMode !== 'practice') {
      handleTimeout();
    }
  }, [timeLeft, selectedAnswer, quizStarted, gameMode]);

  const checkAchievements = (finalScore: number, totalTime: number) => {
    const newAchievements = ACHIEVEMENTS.filter(
      achievement =>
        !achievements.includes(achievement) &&
        achievement.condition(finalScore, totalTime, questions.length)
    );

    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
      let delay = 0;
      newAchievements.forEach((achievement) => {
        setTimeout(() => {
          setCurrentAchievement(achievement);
          setTimeout(() => setCurrentAchievement(null), 3000);
        }, delay);
        delay += 3500;
      });
    }
  };

  const handleTimeout = () => {
    setSelectedAnswer('');
    setIsAnswerCorrect(false);
    setShowFeedback(true);
    setFeedbackMessage('Tempo scaduto!');
    setCorrectStreak(0);
    setTimeout(() => moveToNextQuestion(false), 1000);
  };

  const moveToNextQuestion = (isCorrect: boolean) => {
    setShowQuestion(false);
    setShowFeedback(false);

    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
        checkAchievements(score, totalTime);
        onFinish(score, totalTime);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
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

    if (gameMode === 'suddenDeath' && !isCorrect) {
      setFeedbackMessage('Game Over! ☠️');
      setTimeout(() => {
        const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
        onFinish(score, totalTime);
      }, 1000);
      return;
    }

    if (gameMode === 'practice') {
      const feedback = isCorrect 
        ? 'Corretto! 👍' 
        : `Sbagliato 😔 La risposta corretta era: ${currentQuestion.correctAnswer}`;
      setFeedbackMessage(feedback);
      setTimeout(() => moveToNextQuestion(isCorrect), 2000);
      return;
    }

    if (isCorrect) {
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      setIsStreak(true);
      setFeedbackMessage(newStreak >= 3 ? '🔥 Hot Streak!' : 'Corretto! 👍');
      setScore(prev => prev + modeSettings!.pointMultiplier);
    } else {
      setCorrectStreak(0);
      setIsStreak(false);
      setFeedbackMessage('Sbagliato 😔');
    }

    setTimeout(() => moveToNextQuestion(isCorrect), 1000);
  };

  const questionVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const feedbackVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  if (!gameMode) {
    return <GameModeSelector onSelect={(mode) => {
      setGameMode(mode);
      setQuizStarted(true);
      const settings = GAME_MODES[mode];
      if (settings.timeLimit) {
        setTimeLeft(settings.timeLimit);
      }
    }} />;
  }

  return (
    <div className="quiz-container">
      <motion.div className="quiz-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="quiz-progress">
          <div className="progress-text">
            Domanda {currentQuestionIndex + 1} di {questions.length}
          </div>
          <div className="score-text">
            Punteggio: {score}
            {isStreak && <span className="streak-icon">🔥</span>}
          </div>
        </div>

        {gameMode !== 'practice' && (
          <div className="quiz-timer-container">
            <div className={`time-left ${timeLeft <= 5 ? 'time-critical' : ''}`}>
              {timeLeft}s
            </div>
            <div className="quiz-timer">
              <motion.div
                className={`quiz-timer-bar ${gameMode}`}
                initial={{ width: '100%' }}
                animate={{
                  width: `${(timeLeft / modeSettings!.timeLimit) * 100}%`,
                }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
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

      <AnimatePresence>
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

      <AnimatePresence>
        {currentAchievement && (
          <AchievementPopup 
            achievement={currentAchievement} 
            onClose={() => setCurrentAchievement(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
