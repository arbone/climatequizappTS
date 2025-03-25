import React from 'react';
import { Difficulty, DIFFICULTY_SETTINGS } from '../../types/difficulty';
// In DifficultySelector.tsx o nel componente dove gestisci il selettore
import './DifficultySelector.css';


interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelectDifficulty }) => {
  return (
    <div className="difficulty-selector">
      <h2>Scegli la Difficoltà</h2>
      <div className="difficulty-options">
        {Object.entries(DIFFICULTY_SETTINGS).map(([key, settings]) => (
          <button
            key={key}
            className={`difficulty-button ${key}`}
            onClick={() => onSelectDifficulty(key as Difficulty)}
          >
            <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
            <p>Tempo: {settings.timeLimit}s</p>
            <p>Moltiplicatore: x{settings.pointMultiplier}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
