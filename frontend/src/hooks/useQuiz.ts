import { useCallback, useMemo, useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { computeResult } from '../data/resultEngine';
import type { AnswerId, QuizAnswers } from '../types';

/**
 * Owns the quiz state: current step, selected answers and the finished flag.
 * Answers are kept for the whole session so a user can go back and change them.
 */
export function useQuiz() {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const selectedAnswerId = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === QUIZ_QUESTIONS.length - 1;
  const canAdvance = Boolean(selectedAnswerId);
  const allAnswered = QUIZ_QUESTIONS.every((question) => Boolean(answers[question.id]));

  const result = useMemo(
    () => (isFinished && allAnswered ? computeResult(answers) : null),
    [isFinished, allAnswered, answers],
  );

  const selectAnswer = useCallback(
    (optionId: AnswerId) => {
      setAnswers((previous) => ({ ...previous, [currentQuestion.id]: optionId }));
    },
    [currentQuestion.id],
  );

  const goNext = useCallback(() => {
    if (!canAdvance) return;
    if (isLastQuestion) {
      setIsFinished(true);
      return;
    }
    setCurrentIndex((index) => Math.min(index + 1, QUIZ_QUESTIONS.length - 1));
  }, [canAdvance, isLastQuestion]);

  const goBack = useCallback(() => {
    if (isFinished) {
      setIsFinished(false);
      return;
    }
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, [isFinished]);

  const reset = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  }, []);

  return {
    answers,
    currentIndex,
    currentQuestion,
    selectedAnswerId,
    isLastQuestion,
    canAdvance,
    isFinished,
    result,
    total: QUIZ_QUESTIONS.length,
    selectAnswer,
    goNext,
    goBack,
    reset,
  };
}
