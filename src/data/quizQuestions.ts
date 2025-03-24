import { Question } from '../types/quiz';

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Quale gas è principalmente responsabile dell'effetto serra?",
    options: [
      "Ossigeno",
      "Anidride carbonica",
      "Azoto",
      "Idrogeno"
    ],
    correctAnswer: "Anidride carbonica"
  },
  {
    id: 2,
    question: "Qual è la principale conseguenza del riscaldamento globale?",
    options: [
      "Aumento del livello del mare",
      "Aumento della popolazione",
      "Diminuzione delle piogge",
      "Aumento della vegetazione"
    ],
    correctAnswer: "Aumento del livello del mare"
  },
  {
    id: 3,
    question: "Quale attività umana contribuisce maggiormente al cambiamento climatico?",
    options: [
      "Uso di dispositivi elettronici",
      "Consumo di combustibili fossili",
      "Agricoltura biologica",
      "Riciclaggio"
    ],
    correctAnswer: "Consumo di combustibili fossili"
  }
  // Aggiungeremo altre domande dopo
];
