import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../../types/achievements';  // Modifica questo percorso
import './AchievementPopup.css';

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
}


const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="achievement-popup"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <div className="achievement-icon">{achievement.icon}</div>
        <div className="achievement-content">
          <h3>{achievement.name}</h3>
          <p>{achievement.description}</p>
        </div>
        <button className="achievement-close" onClick={onClose}>×</button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementPopup;
