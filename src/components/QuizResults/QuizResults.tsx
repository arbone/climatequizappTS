import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './QuizResults.css';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

Modal.setAppElement('#root');

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onRestart,
}) => {
  const [confirmRestart, setConfirmRestart] = useState(false);
  const bestScore = localStorage.getItem('bestScore');

  useEffect(() => {
    if (!bestScore || score > parseInt(bestScore)) {
      localStorage.setItem('bestScore', score.toString());
    }
  }, [score, bestScore]);

  const getSkillLevel = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return 'Maestro/a';
    if (percentage >= 70) return 'Esperto/a';
    if (percentage >= 40) return 'Intermedio';
    return 'Base';
  };

  const getTweetUrl = () => {
    const baseUrl = "https://twitter.com/intent/tweet";
    const text = `Ho completato il Climate Quiz con un punteggio di ${score}/${totalQuestions}! 🌍 Il mio livello è: ${getSkillLevel()}`;
    const hashtags = "ClimateQuiz,Sostenibilità";
    return `${baseUrl}?text=${encodeURIComponent(text)}&hashtags=${hashtags}`;
  };

  const handleRestart = () => {
    setConfirmRestart(false);
    onRestart();
  };

  return (
    <div className="results-container">
      <h1 className="results-title">Quiz Completato!</h1>
      <p className="results-score">Il tuo punteggio: {score}/{totalQuestions}</p>
      <p className="results-skill">Livello: <strong>{getSkillLevel()}</strong></p>
      
      <div className="results-best-score">
        Record personale: {bestScore || score}/{totalQuestions}
      </div>

      <div className="results-actions">
        <button 
          className="results-button restart"
          onClick={() => setConfirmRestart(true)}
        >
          Ricomincia il Quiz
        </button>

        <a
          href={getTweetUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="results-button share"
        >
          Condividi su Twitter
        </a>
      </div>

      <Modal
        isOpen={confirmRestart}
        onRequestClose={() => setConfirmRestart(false)}
        className="restart-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2>Conferma Riavvio</h2>
          <p>Sei sicuro di voler ricominciare il quiz?</p>
          
          <div className="modal-actions">
            <button 
              onClick={handleRestart}
              className="modal-button confirm"
            >
              Sì, ricomincia
            </button>
            <button 
              onClick={() => setConfirmRestart(false)}
              className="modal-button cancel"
            >
              No, torna indietro
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizResults;
