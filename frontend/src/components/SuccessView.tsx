import { CheckIcon } from './icons';

interface SuccessViewProps {
  submissionId: string;
  submittedAt: string;
  onRestart: () => void;
}

export function SuccessView({ submissionId, submittedAt, onRestart }: SuccessViewProps) {
  const dateLabel = new Date(submittedAt).toLocaleDateString('fa-IR');

  return (
    <div className="success" id="lead-success" role="status" aria-live="polite">
      <div className="success__badge">
        <CheckIcon />
      </div>
      <h3>درخواستت ثبت شد!</h3>
      <p>اطلاعاتت برای بررسی درخواست خریدت ارسال شد. در صورت نیاز، برای هماهنگی باهات تماس می‌گیریم.</p>
      <p className="success__meta">
        کد پیگیری: <code>{submissionId}</code>
        {dateLabel ? ` — ${dateLabel}` : ''}
      </p>
      <div className="btn-row" style={{ justifyContent: 'center', marginTop: 24 }}>
        <button type="button" className="btn btn--ghost" onClick={onRestart}>
          ثبت یک درخواست جدید
        </button>
      </div>
    </div>
  );
}
