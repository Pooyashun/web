import { useEffect, useRef } from 'react';
import { getImage } from '../data/images';
import { RESULTS_DISCLAIMER } from '../data/resultEngine';
import { ForwardIcon } from './icons';
import type { QuizResult } from '../types';

interface ResultViewProps {
  result: QuizResult;
  onContinue: () => void;
  onRestart: () => void;
}

export function ResultView({ result, onContinue, onRestart }: ResultViewProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headlineRef.current?.focus({ preventScroll: true });
  }, [result]);

  const image = getImage(result.imageKey);

  const chips = [
    { label: 'دسته سلیقه', value: result.categoryLabel },
    { label: 'محیط پیشنهادی', value: result.environmentLabel },
    { label: 'هدف خرید', value: result.purposeLabel },
    { label: 'نوع ملک', value: result.propertyTypeLabel },
    { label: 'اولویت اصلی', value: result.priorityLabel },
    { label: 'روش انتخاب', value: result.styleLabel },
  ];

  return (
    <div className="result" id="quiz-result">
      <div className="result__media">
        <img src={image.url} alt={image.alt} />
        <span className="result__media-tag">محیط پیشنهادی: {result.environmentLabel}</span>
      </div>

      <div className="result__body">
        <span className="eyebrow">نتیجه آزمون تو</span>
        <h3 className="result__headline" ref={headlineRef} tabIndex={-1}>
          {result.headline}
        </h3>
        <p className="result__summary">{result.summary}</p>

        <ul className="result__chips">
          {chips.map((chip) => (
            <li className="chip" key={chip.label}>
              {chip.label}: {chip.value}
            </li>
          ))}
        </ul>

        <div className="result__grid">
          <div className="result__panel">
            <h4>ملک‌هایی که بهتره بررسی کنی</h4>
            <ul className="result__list">
              {result.recommendedTypes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result__panel">
            <h4>قبل از خرید این موارد را بررسی کن</h4>
            <ul className="result__list">
              {result.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="result__panel" style={{ marginBottom: 26 }}>
          <h4>ترجیح اولیه محدوده</h4>
          <p>{result.locationHint}</p>
        </div>

        <div className="btn-row">
          <button type="button" className="btn btn--primary btn--lg" onClick={onContinue}>
            پیدا کردن ملک مناسب من
            <ForwardIcon />
          </button>
          <button type="button" className="btn btn--quiet" onClick={onRestart}>
            آزمون را از نو شروع کنم
          </button>
        </div>

        <p className="result__disclaimer" style={{ marginTop: 20 }}>
          {RESULTS_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
