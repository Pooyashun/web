import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  BUDGET_OPTIONS,
  CITY_OPTIONS,
  DOCUMENT_STATUS_OPTIONS,
  EMPTY_LEAD_FORM,
  PROPERTY_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
  TIMEFRAME_OPTIONS,
  labelOf,
} from '../data/formOptions';
import { summarizeAnswers } from '../data/resultEngine';
import { createSubmissionId, isLeadApiConfigured, submitLead } from '../services/leadApi';
import { isValidIranMobile, normalizePhone } from '../utils/phone';
import type { LeadFormValues, LeadPayload, QuizAnswers, QuizResult, SelectOption } from '../types';

interface LeadFormProps {
  quizAnswers: QuizAnswers;
  result: QuizResult;
  onSuccess: (info: { submissionId: string; submittedAt: string }) => void;
}

type FormErrors = Record<string, string>;

/** Local, client-side validation. Mirrors the server rules in backend/src/validate.js. */
function validate(values: LeadFormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.fullName.trim().length < 3) {
    errors.fullName = 'نام و نام خانوادگی را کامل وارد کنید.';
  }
  if (!isValidIranMobile(values.phone)) {
    errors.phone = 'شماره موبایل معتبر نیست (نمونه: ۰۹۱۲۳۴۵۶۷۸۹).';
  }
  if (!values.budget) {
    errors.budget = 'بازه بودجه خرید را انتخاب کنید.';
  } else if (values.budget === 'custom' && !values.budgetCustomMin.trim() && !values.budgetCustomMax.trim()) {
    errors.budget = 'برای محدوده دلخواه، حداقل یکی از دو مقدار را وارد کنید.';
  }
  if (!values.city) errors.city = 'شهرستان یا منطقه موردنظر را انتخاب کنید.';
  if (!values.propertyType) errors.propertyType = 'نوع ملک موردنظر را انتخاب کنید.';
  if (!values.purpose) errors.purpose = 'هدف خرید را انتخاب کنید.';
  if (!values.documentStatus) errors.documentStatus = 'وضعیت سند مورد قبول را انتخاب کنید.';
  if (!values.timeframe) errors.timeframe = 'زمان احتمالی خرید را انتخاب کنید.';

  return errors;
}

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  wide?: boolean;
  children: ReactNode;
}

function FieldShell({ id, label, required, hint, error, wide, children }: FieldShellProps) {
  return (
    <div className={`field${wide ? ' field--wide' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="field__required">*</span> : null}
      </label>
      {hint ? <span className="field__hint">{hint}</span> : null}
      {children}
      {error ? (
        <span className="field__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  wide?: boolean;
}

function SelectField({
  id,
  label,
  options,
  value,
  error,
  onChange,
  placeholder = 'انتخاب کن…',
  wide,
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} required error={error} wide={wide}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function LeadForm({ quizAnswers, result, onSuccess }: LeadFormProps) {
  const [values, setValues] = useState<LeadFormValues>(EMPTY_LEAD_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [alert, setAlert] = useState<{ tone: 'error' | 'info'; message: string } | null>(null);
  const [submissionId] = useState(createSubmissionId);

  const isSubmitting = status === 'submitting';

  function setField(key: keyof LeadFormValues, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!(key in previous)) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const fieldErrors = validate(values);
    setErrors(fieldErrors);

    const firstErrorKey = Object.keys(fieldErrors)[0];
    if (firstErrorKey) {
      setAlert({ tone: 'error', message: 'برای ثبت درخواست، موارد مشخص‌شده را کامل کن.' });
      document.getElementById(firstErrorKey)?.focus();
      return;
    }

    setAlert(null);
    setStatus('submitting');

    const submittedAt = new Date().toISOString();
    const payload: LeadPayload = {
      submissionId,
      submittedAt,
      contact: { fullName: values.fullName.trim(), phone: normalizePhone(values.phone) },
      form: {
        budget: values.budget,
        budgetLabel: labelOf(BUDGET_OPTIONS, values.budget),
        budgetCustomMin: values.budgetCustomMin.trim(),
        budgetCustomMax: values.budgetCustomMax.trim(),
        city: values.city,
        cityLabel: labelOf(CITY_OPTIONS, values.city),
        propertyType: values.propertyType,
        propertyTypeLabel: labelOf(PROPERTY_TYPE_OPTIONS, values.propertyType),
        purpose: values.purpose,
        purposeLabel: labelOf(PURPOSE_OPTIONS, values.purpose),
        documentStatus: values.documentStatus,
        documentStatusLabel: labelOf(DOCUMENT_STATUS_OPTIONS, values.documentStatus),
        timeframe: values.timeframe,
        timeframeLabel: labelOf(TIMEFRAME_OPTIONS, values.timeframe),
        notes: values.notes.trim(),
      },
      quiz: {
        answers: summarizeAnswers(quizAnswers),
        result: {
          category: result.category,
          categoryLabel: result.categoryLabel,
          environment: result.environment,
          environmentLabel: result.environmentLabel,
          headline: result.headline,
          summary: result.summary,
        },
      },
    };

    const outcome = await submitLead(payload);

    if (outcome.ok) {
      onSuccess({ submissionId, submittedAt });
      return;
    }

    // Keep every value so the user can simply retry.
    setStatus('idle');
    setAlert({ tone: 'error', message: outcome.message });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      {!isLeadApiConfigured ? (
        <p className="form-alert form-alert--info" style={{ marginBottom: 24 }}>
          <span aria-hidden="true">ℹ️</span>
          <span>
            اتصال ارسال هنوز فعال نشده است. می‌توانی فرم را پر کنی و مسیر را ببینی، اما در این نسخه
            اطلاعاتی برای ما ارسال یا ذخیره نمی‌شود.
          </span>
        </p>
      ) : null}

      <div className="form-grid">
        <FieldShell id="fullName" label="نام و نام خانوادگی" required error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => setField('fullName', event.target.value)}
            aria-invalid={errors.fullName ? 'true' : undefined}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
        </FieldShell>

        <FieldShell
          id="phone"
          label="شماره موبایل"
          required
          hint="شماره را با کد ۰۹ وارد کن."
          error={errors.phone}
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            style={{ textAlign: 'left' }}
            value={values.phone}
            onChange={(event) => setField('phone', event.target.value)}
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
        </FieldShell>

        <FieldShell
          id="budget"
          label="بودجه خرید"
          required
          error={errors.budget}
          hint={values.budget === 'custom' ? 'محدوده دلخواهت را به میلیون تومان وارد کن.' : undefined}
        >
          <select
            id="budget"
            value={values.budget}
            onChange={(event) => setField('budget', event.target.value)}
            aria-invalid={errors.budget ? 'true' : undefined}
            aria-describedby={errors.budget ? 'budget-error' : undefined}
          >
            <option value="">انتخاب کن…</option>
            {BUDGET_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {values.budget === 'custom' ? (
            <div className="field__row" style={{ marginTop: 10 }}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="از (میلیون تومان)"
                aria-label="حداقل بودجه دلخواه به میلیون تومان"
                value={values.budgetCustomMin}
                onChange={(event) => setField('budgetCustomMin', event.target.value)}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="تا (میلیون تومان)"
                aria-label="حداکثر بودجه دلخواه به میلیون تومان"
                value={values.budgetCustomMax}
                onChange={(event) => setField('budgetCustomMax', event.target.value)}
              />
            </div>
          ) : null}
        </FieldShell>

        <SelectField
          id="city"
          label="شهرستان یا منطقه موردنظر"
          options={CITY_OPTIONS}
          value={values.city}
          error={errors.city}
          onChange={(value) => setField('city', value)}
        />

        <SelectField
          id="propertyType"
          label="نوع ملک"
          options={PROPERTY_TYPE_OPTIONS}
          value={values.propertyType}
          error={errors.propertyType}
          onChange={(value) => setField('propertyType', value)}
        />

        <SelectField
          id="purpose"
          label="هدف خرید"
          options={PURPOSE_OPTIONS}
          value={values.purpose}
          error={errors.purpose}
          onChange={(value) => setField('purpose', value)}
        />

        <SelectField
          id="documentStatus"
          label="وضعیت سند مورد قبول"
          options={DOCUMENT_STATUS_OPTIONS}
          value={values.documentStatus}
          error={errors.documentStatus}
          onChange={(value) => setField('documentStatus', value)}
        />

        <SelectField
          id="timeframe"
          label="زمان احتمالی خرید"
          options={TIMEFRAME_OPTIONS}
          value={values.timeframe}
          error={errors.timeframe}
          onChange={(value) => setField('timeframe', value)}
        />

        <FieldShell
          id="notes"
          label="توضیحات تکمیلی"
          hint="اختیاری — هر نکته‌ای که فکر می‌کنی به ما کمک می‌کند."
          wide
        >
          <textarea
            id="notes"
            name="notes"
            value={values.notes}
            onChange={(event) => setField('notes', event.target.value)}
            maxLength={2000}
          />
        </FieldShell>
      </div>

      {alert ? (
        <p className={`form-alert form-alert--${alert.tone}`} role="alert" style={{ marginTop: 24 }}>
          <span aria-hidden="true">!</span>
          <span>{alert.message}</span>
        </p>
      ) : null}

      <div className="form-actions">
        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={isSubmitting}>
          {isSubmitting ? 'در حال ارسال…' : 'ثبت درخواست و دریافت مشاوره'}
        </button>
        <p className="field__hint" style={{ textAlign: 'center' }}>
          اطلاعات تو فقط برای بررسی همین درخواست استفاده می‌شود.
        </p>
      </div>
    </form>
  );
}
