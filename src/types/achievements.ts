export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    condition: (score: number, time: number, totalQuestions: number) => boolean;
    unlocked?: boolean;
  }
  
  export const ACHIEVEMENTS: Achievement[] = [
    {
      id: 'speedster',
      name: 'Velocista',
      description: 'Completa il quiz in meno di 3 minuti',
      icon: '⚡',
      condition: (score, time) => time < 180
    },
    {
      id: 'perfectionist',
      name: 'Perfezionista',
      description: 'Ottieni il punteggio perfetto',
      icon: '🌟',
      condition: (score, time, totalQuestions) => score === totalQuestions
    },
    {
      id: 'quickThinking',
      name: 'Mente Rapida',
      description: 'Rispondi correttamente in meno di 10 secondi',
      icon: '🧠',
      condition: (score, time, totalQuestions) => (time / totalQuestions) < 10 && score > totalQuestions * 0.8
    }
  ];
  