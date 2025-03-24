import { Question } from '../types/quiz';

export const getRandomQuestions = (allQuestions: Question[], numberOfQuestions: number = 10): Question[] => {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numberOfQuestions);
};

export const calculateScore = (correctAnswers: number): string => {
  const percentage = (correctAnswers / 10) * 100;
  if (percentage >= 90) return "Esperto Ambientale";
  if (percentage >= 70) return "Eco-Consapevole";
  if (percentage >= 50) return "Principiante Verde";
  return "Novizio Ambientale";
};

export const shuffleOptions = (question: Question): Question => {
  const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
  return {
    ...question,
    options: shuffledOptions
  };
};
