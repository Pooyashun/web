import { getImage } from '../data/images';

interface HeroProps {
  onStart: () => void;
}

const TOKENS = ['بدون ثبت‌نام', 'نتیجه فوری', 'مشاوره انسانی'];

export function Hero({ onStart }: HeroProps) {
  const heroImage = getImage('hero');

  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero__grid">
          <div>
            <span className="eyebrow">دستیار خرید ملک در گیلان</span>
            <h1>قبل از خرید ملک در گیلان، ببین کدوم منطقه به تو میاد!</h1>
            <p className="hero__lead">
              به ۵ سؤال کوتاه جواب بده، سلیقه خریدت رو بشناس و برای پیدا کردن ملک مناسب خودت قدم
              اول رو بردار.
            </p>

            <div className="btn-row">
              <button type="button" className="btn btn--primary btn--lg" onClick={onStart}>
                شروع آزمون رایگان
              </button>
              <a className="btn btn--ghost btn--lg" href="#how">
                ملک بلد چطور کمک می‌کند؟
              </a>
            </div>

            <p className="hero__microcopy">حدود ۱ دقیقه زمان می‌بره</p>

            <ul className="hero__tokens">
              {TOKENS.map((token) => (
                <li className="hero__token" key={token}>
                  {token}
                </li>
              ))}
            </ul>
          </div>

          <div className="hero__media">
            <img className="hero__image" src={heroImage.url} alt={heroImage.alt} />
            <div className="hero__badge">
              <strong>۵ سؤال، یک مسیر روشن</strong>
              <span>نتیجه بر اساس اولویت‌ها و سلیقه خودت</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
