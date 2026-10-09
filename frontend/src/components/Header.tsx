import { SITE, scrollToSection } from '../data/site';

interface HeaderProps {
  onStart: () => void;
}

export function Header({ onStart }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#top" aria-label={`${SITE.brandFa} — ${SITE.tagline}`}>
          <span className="brand__mark" aria-hidden="true">
            م
          </span>
          <span className="brand__text">
            <span>{SITE.brandFa}</span>
            <span className="brand__latin">{SITE.brandEn}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="منوی اصلی">
          <a href="#how">ملک بلد چطور کمک می‌کند؟</a>
          <a href="#quiz">آزمون خرید ملک</a>
          <a
            href="#consult"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection('consult');
            }}
          >
            درخواست مشاوره
          </a>
        </nav>

        <button type="button" className="btn btn--primary" onClick={onStart}>
          شروع آزمون رایگان
        </button>
      </div>
    </header>
  );
}
