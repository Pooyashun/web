import { IMAGE_CREDITS } from '../data/images';
import { SITE, scrollToSection } from '../data/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <p className="footer__brand-name">
              {SITE.brandFa} | {SITE.brandEn}
            </p>
            <p className="footer__tagline">{SITE.tagline}</p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => scrollToSection('consult')}
            >
              ثبت درخواست ملک
            </button>
          </div>

          <div>
            <h2 className="footer__heading">ارتباط با ما</h2>
            <ul className="footer__list">
              {Object.values(SITE.contact).map((item) => (
                <li key={item.label}>
                  {item.label}: <span className="footer__placeholder">{item.value}</span>
                </li>
              ))}
            </ul>
            <p className="footer__placeholder" style={{ marginTop: 12, fontSize: '0.82rem' }}>
              {SITE.contactNote}
            </p>
          </div>

          <div>
            <h2 className="footer__heading">مسیرهای سریع</h2>
            <ul className="footer__list">
              <li>
                <a href="#quiz">شروع آزمون خرید ملک</a>
              </li>
              <li>
                <a href="#how">ملک بلد چطور کمک می‌کند؟</a>
              </li>
              <li>
                <a
                  href="#consult"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection('consult');
                  }}
                >
                  درخواست مشاوره خرید
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__credits">
            تصاویر: ویکی‌مدیا کامانز —{' '}
            {IMAGE_CREDITS.map((credit, index) => (
              <span key={credit.source}>
                {index > 0 ? '، ' : ''}
                <a href={credit.source} target="_blank" rel="noreferrer noopener">
                  {credit.artist} ({credit.license})
                </a>
              </span>
            ))}
          </p>
          <p>
            © {year} {SITE.brandFa} | {SITE.brandEn} — همه حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
