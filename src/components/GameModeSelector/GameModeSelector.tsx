// components/GameModeSelector.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { GameMode, GAME_MODES } from '../../types/gameMode';
import './GameModeSelector.css';

interface GameModeSelectorProps {
  onSelect: (mode: GameMode) => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="gamemode-selector">
      <h2>Scegli la Modalità di Gioco</h2>
      <div className="gamemode-options">
        {(Object.keys(GAME_MODES) as GameMode[]).map((mode) => {
          const settings = GAME_MODES[mode];
          return (
            <motion.button
              key={mode}
              className="gamemode-option"
              onClick={() => onSelect(mode)}
              style={{ backgroundColor: settings.color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3>{settings.name}</h3>
              <p>{settings.description}</p>
              <div className="gamemode-details">
                {settings.timeLimit > 0 && (
                    <span>
                    ⏱️ {settings.name === 'Time Attack' ? `${settings.timeLimit}s` : `${settings.timeLimit}s per domanda`}
                    </span>
                )}
                {settings.livesCount && (
                    <span>❤️ {settings.livesCount} {settings.livesCount === 1 ? 'vita' : 'vite'}</span>
                )}
                {settings.pointMultiplier > 0 && (
                    <span>🎯 x{settings.pointMultiplier} punti</span>
                )}
                {settings.showExplanations && (
                    <span>📖 Con spiegazioni</span>
                )}
                </div>

            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default GameModeSelector;
