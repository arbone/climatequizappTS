import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import './QuizResults.css';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  timeTaken: number;
}

interface ScoreData {
  score: number;
  date: string;
  total: number;
  time: number;
}

// Configura react-modal
Modal.setAppElement('#root');

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onRestart,
  timeTaken,
}) => {
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [savedScores, setSavedScores] = useState<ScoreData[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Carica i punteggi salvati
    const scores: ScoreData[] = JSON.parse(localStorage.getItem('quizScores') || '[]');
    
    // Crea il nuovo punteggio
    const newScore: ScoreData = {
      score,
      date: new Date().toISOString(),
      total: totalQuestions,
      time: timeTaken
    };

    // Verifica se esiste già un punteggio identico
    const isDuplicate = scores.some(
      (s: ScoreData) => 
        s.score === newScore.score && 
        s.time === newScore.time && 
        s.total === newScore.total
    );

    // Aggiorna i punteggi salvati solo se non è un duplicato
    const updatedScores = isDuplicate 
      ? scores 
      : [...scores, newScore]
          .sort((a, b) => b.score - a.score || a.time - b.time)
          .slice(0, 3);

    localStorage.setItem('quizScores', JSON.stringify(updatedScores));
    setSavedScores(updatedScores);

    // Aggiorna il miglior punteggio se necessario
    const bestScore = localStorage.getItem('bestScore');
    if (!bestScore || score > parseInt(bestScore)) {
      localStorage.setItem('bestScore', score.toString());
    }

    // Attiva l'animazione dopo un breve ritardo
    setTimeout(() => setShowAnimation(true), 100);
  }, [score, totalQuestions, timeTaken]);

  const getSkillLevel = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return { level: 'Maestro/a', color: '#FFD700' };
    if (percentage >= 80) return { level: 'Esperto/a', color: '#2196F3' };
    if (percentage >= 60) return { level: 'Intermedio', color: '#4CAF50' };
    return { level: 'Principiante', color: '#FF5722' };
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTweetUrl = () => {
    const baseUrl = "https://twitter.com/intent/tweet";
    const text = `Ho completato il Climate Quiz con un punteggio di ${score}/${totalQuestions} in ${formatTime(timeTaken)}! 🌍 Livello: ${getSkillLevel().level}`;
    const hashtags = "ClimateQuiz,Sostenibilità";
    return `${baseUrl}?text=${encodeURIComponent(text)}&hashtags=${hashtags}`;
  };

  const handleRestart = () => {
    setConfirmRestart(false);
    onRestart();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const scoreVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div 
          className="results-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.h1 
            className="results-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Quiz Completato!
          </motion.h1>

          <motion.div 
            className="current-score"
            variants={scoreVariants}
          >
            <h2>Il tuo punteggio</h2>
            <p className="score" style={{ color: getSkillLevel().color }}>
              {score}/{totalQuestions}
            </p>
            <p className="time-taken">Tempo: {formatTime(timeTaken)}</p>
            <p className="skill-level">
              Livello: <span style={{ color: getSkillLevel().color }}>{getSkillLevel().level}</span>
            </p>
          </motion.div>

          <motion.div 
            className="best-score"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3>Miglior Punteggio</h3>
            <p>{localStorage.getItem('bestScore') || score}/{totalQuestions}</p>
          </motion.div>

          <motion.div 
            className="previous-scores"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3>Classifica</h3>
            <ul>
              {savedScores.map((scoreData, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1) }}
                >
                  <span className="score-value">{scoreData.score}/{scoreData.total}</span>
                  <span className="score-time">{formatTime(scoreData.time)}</span>
                  <span className="score-date">
                    {new Date(scoreData.date).toLocaleDateString()}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="results-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button 
              className="restart-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setConfirmRestart(true)}
            >
              Gioca Ancora
            </motion.button>

            <motion.a
              href={getTweetUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="share-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Condividi su Twitter
            </motion.a>
          </motion.div>

          <Modal
            isOpen={confirmRestart}
            onRequestClose={() => setConfirmRestart(false)}
            className="restart-modal"
            overlayClassName="modal-overlay"
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <h2>Conferma Riavvio</h2>
              <p>Sei sicuro di voler ricominciare il quiz?</p>
              <div className="modal-actions">
                <motion.button 
                  onClick={handleRestart}
                  className="modal-button confirm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sì, ricomincia
                </motion.button>
                <motion.button 
                  onClick={() => setConfirmRestart(false)}
                  className="modal-button cancel"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  No, torna indietro
                </motion.button>
              </div>
            </motion.div>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizResults;
