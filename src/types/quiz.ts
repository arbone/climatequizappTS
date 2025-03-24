export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
  }
  
  export interface QuizState {
    currentQuestion: number;
    score: number;
    showResults: boolean;
    questions: Question[];
  }
  
  export type SkillLevel = 'base' | 'intermedio' | 'esperto' | 'maestro';
  