// types/gameMode.ts
export interface GameModeSettings {
    name: string;
    description: string;
    timeLimit: number;
    pointMultiplier: number;
    color: string;
    livesCount?: number;
    showExplanations?: boolean;
  }
  
  export type GameMode = 'classic' | 'timeAttack' | 'suddenDeath' | 'practice';
  
  export const GAME_MODES: Record<GameMode, GameModeSettings> = {
    classic: {
      name: 'Classica',
      description: '20 secondi per risposta, modalità bilanciata',
      timeLimit: 20,
      pointMultiplier: 1,
      color: '#2196F3',
      livesCount: 3
    },
    timeAttack: {
      name: 'Time Attack',
      description: '120 secondi totali per completare il quiz',
      timeLimit: 120,
      pointMultiplier: 2,
      color: '#FFC107'
    },
    suddenDeath: {
      name: 'Sudden Death',
      description: '15 secondi per risposta, un errore e sei fuori!',
      timeLimit: 15,
      pointMultiplier: 3,
      color: '#F44336',
      livesCount: 1
    },
    practice: {
      name: 'Allenamento',
      description: 'Nessun limite di tempo, feedback dettagliato',
      timeLimit: 0,
      pointMultiplier: 0,
      color: '#4CAF50',
      showExplanations: true
    }
  };
  