import React from 'react';
import './Intro.css';

interface IntroProps {
  onStart: () => void; // Funzione per iniziare il quiz
}

const Intro: React.FC<IntroProps> = ({ onStart }) => {
  return (
    <div className="intro-container">
      <h1 className="intro-title">Benvenuto al Climate Quiz!</h1>
      <p className="intro-text">
        Metti alla prova le tue conoscenze sul cambiamento climatico e
        scopri quanto sei informato su un tema così importante per il nostro pianeta.
        Clicca il pulsante per iniziare!
      </p>
      <button className="intro-button" onClick={onStart}>
        Inizia il Quiz
      </button>
    </div>
  );
};

export default Intro;
