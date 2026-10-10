import { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { GalleryStrip } from './components/GalleryStrip';
import { HowItWorks } from './components/HowItWorks';
import { Quiz } from './components/Quiz';
import { ResultView } from './components/ResultView';
import { LeadForm } from './components/LeadForm';
import { SuccessView } from './components/SuccessView';
import { Footer } from './components/Footer';
import { useQuiz } from './hooks/useQuiz';
import { scrollToSection } from './data/site';

interface Submission {
  submissionId: string;
  submittedAt: string;
}

export default function App() {
  const quiz = useQuiz();
  const [submission, setSubmission] = useState<Submission | null>(null);

  // Once the result renders, bring it into view.
  useEffect(() => {
    if (quiz.result) scrollToSection('quiz-result');
  }, [quiz.result]);

  const startQuiz = useCallback(() => {
    scrollToSection('quiz');
  }, []);

  const handleRestart = useCallback(() => {
    setSubmission(null);
    quiz.reset();
    scrollToSection('quiz');
  }, [quiz]);

  return (
    <>
      <Header onStart={startQuiz} />

      <main>
        <Hero onStart={startQuiz} />

        <div className="container gallery-wrap">
          <GalleryStrip />
        </div>

        <HowItWorks />

        <section className="section" id="quiz">
          <div className="container">
            <div className="quiz-shell">
              {quiz.result ? (
                <ResultView
                  result={quiz.result}
                  onContinue={() => scrollToSection('consult')}
                  onRestart={handleRestart}
                />
              ) : (
                <>
                  <div
                    className="section-head"
                    style={{ textAlign: 'center', marginInline: 'auto' }}
                  >
                    <span className="eyebrow">آزمون خرید ملک</span>
                    <h2>سلیقه خریدت رو بشناس</h2>
                    <p>
                      پنج سؤال کوتاه و بدون ثبت‌نام. هر زمان خواستی می‌توانی به سؤال قبلی برگردی و
                      پاسخت را تغییر بدهی.
                    </p>
                  </div>
                  <Quiz quiz={quiz} />
                </>
              )}
            </div>
          </div>
        </section>

        {quiz.result ? (
          <section className="section section--tinted" id="consult">
            <div className="container">
              <div className="quiz-shell">
                <div className="section-head" style={{ textAlign: 'center', marginInline: 'auto' }}>
                  <span className="eyebrow">قدم بعدی</span>
                  <h2>حالا بریم دنبال ملک مناسب تو</h2>
                  <p>
                    اطلاعاتت رو ثبت کن تا برای بررسی گزینه‌های متناسب با بودجه و خواسته‌هات باهات
                    تماس بگیریم.
                  </p>
                </div>

                {submission ? (
                  <SuccessView
                    submissionId={submission.submissionId}
                    submittedAt={submission.submittedAt}
                    onRestart={handleRestart}
                  />
                ) : (
                  <LeadForm
                    quizAnswers={quiz.answers}
                    result={quiz.result}
                    onSuccess={setSubmission}
                  />
                )}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
