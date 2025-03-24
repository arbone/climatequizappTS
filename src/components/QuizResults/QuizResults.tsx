import React from 'react';
import './QuizResults.css';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onRestart,
}) => {
  // Determina il livello di skill in base al punteggio
  const getSkillLevel = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return 'Maestro/a';
    if (percentage >= 70) return 'Esperto/a';
    if (percentage >= 40) return 'Intermedio';
    return 'Base';
  };

  return (
    <div className="results-container">
      <h1 className="results-title">Quiz Completato!</h1>
      <p className="results-score">Il tuo punteggio: {score} / {totalQuestions}</p>
      <p className="results-skill">Livello: <strong>{getSkillLevel()}</strong></p>
      <button className="results-button" onClick={onRestart}>
        Ricomincia il Quiz
      </button>
    </div>
  );
};

export default QuizResults;
