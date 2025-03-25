export type Difficulty = 'facile' | 'normale' | 'difficile' | 'esperto';

export interface DifficultySettings {
  timeLimit: number;
  pointMultiplier: number;
  name: string;
  color: string;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  facile: {
    timeLimit: 40,
    pointMultiplier: 1,
    name: 'Facile',
    color: '#4CAF50'
  },
  normale: {
    timeLimit: 30,
    pointMultiplier: 1.5,
    name: 'Normale',
    color: '#2196F3'
  },
  difficile: {
    timeLimit: 20,
    pointMultiplier: 2,
    name: 'Difficile',
    color: '#FFC107'
  },
  esperto: {
    timeLimit: 15,
    pointMultiplier: 2.5,
    name: 'Esperto',
    color: '#F44336'
  }
};
