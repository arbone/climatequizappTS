import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import necessario per i matchers come toBeInTheDocument
import QuizResults from './QuizResults';

describe('QuizResults Component', () => {
  const mockProps = {
    score: 7,
    totalQuestions: 10,
    onRestart: jest.fn(),
    timeTaken: 120,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  test('renders quiz results correctly', () => {
    render(<QuizResults {...mockProps} />);
    expect(screen.getByText('Quiz Completato!')).toBeInTheDocument();
    expect(screen.getByText('7/10')).toBeInTheDocument();
  });

  test('saves and displays best score', () => {
    localStorage.setItem('bestScore', '5');
    render(<QuizResults {...mockProps} />);
    expect(screen.getByText('Miglior Punteggio')).toBeInTheDocument();
    expect(screen.getByText('7/10')).toBeInTheDocument();
  });

  test('shows correct skill level', () => {
    render(<QuizResults {...mockProps} />);
    expect(screen.getByText(/Livello:/)).toBeInTheDocument();
  });

  test('modal appears when restart button is clicked', () => {
    render(<QuizResults {...mockProps} />);
    fireEvent.click(screen.getByText('Gioca Ancora'));
    expect(screen.getByText('Conferma Riavvio')).toBeInTheDocument();
  });

  test('displays formatted time taken', () => {
    render(<QuizResults {...mockProps} />);
    expect(screen.getByText('Tempo: 2:00')).toBeInTheDocument();
  });
});
