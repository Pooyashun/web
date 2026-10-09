import { toPersianDigits } from '../utils/phone';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);
  const label = `سؤال ${toPersianDigits(current)} از ${toPersianDigits(total)}`;

  return (
    <div className="quiz-progress">
      <div className="quiz-progress__meta">
        <span className="quiz-progress__step">{label}</span>
        <span>{toPersianDigits(percent)}٪</span>
      </div>
      <div
        className="quiz-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={label}
      >
        <div className="quiz-progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
