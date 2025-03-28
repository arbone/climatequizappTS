export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  timeTaken: number;
}
