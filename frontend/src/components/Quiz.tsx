import { useEffect, useRef } from 'react';
import { ProgressBar } from './ProgressBar';
import { toPersianDigits } from '../utils/phone';
import type { useQuiz } from '../hooks/useQuiz';

type QuizState = ReturnType<typeof useQuiz>;

interface QuizProps {
  quiz: QuizState;
}

export function Quiz({ quiz }: QuizProps) {
  const questionRef = useRef<HTMLHeadingElement>(null);

  // Move keyboard focus to the new question so screen readers announce it.
  useEffect(() => {
    questionRef.current?.focus({ preventScroll: true });
  }, [quiz.currentIndex, quiz.isFinished]);

  const handleNext = () => {
    quiz.goNext();
  };

  const questionId = `question-${quiz.currentQuestion.id}`;

  return (
    <div className="quiz-card">
      <ProgressBar current={quiz.currentIndex + 1} total={quiz.total} />

      <h3 className="quiz-question" ref={questionRef} tabIndex={-1}>
        {quiz.currentQuestion.text}
      </h3>

      <ul className="quiz-options">
        {quiz.currentQuestion.options.map((option, index) => {
          const selected = quiz.selectedAnswerId === option.id;
          return (
            <li key={option.id}>
              <label className={`quiz-option${selected ? ' quiz-option--selected' : ''}`}>
                <input
                  type="radio"
                  name={questionId}
                  value={option.id}
                  checked={selected}
                  onChange={() => quiz.selectAnswer(option.id)}
                />
                <span className="quiz-option__dot" aria-hidden="true">
                  {toPersianDigits(index + 1)}
                </span>
                <span className="quiz-option__label">{option.label}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="quiz-nav">
        <button
          type="button"
          className="btn btn--quiet"
          onClick={quiz.goBack}
          disabled={quiz.currentIndex === 0}
        >
          سؤال قبلی
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleNext}
          disabled={!quiz.canAdvance}
        >
          {quiz.isLastQuestion ? 'دیدن نتیجه' : 'سؤال بعدی'}
        </button>
      </div>

      {!quiz.canAdvance && <p className="quiz-hint">برای ادامه، یکی از گزینه‌ها را انتخاب کن.</p>}
    </div>
  );
}
