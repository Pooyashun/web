const STEPS = [
  {
    title: 'شناخت نیاز و بودجه',
    body: 'اول با یک آزمون کوتاه، سلیقه و اولویت‌های تو را می‌فهمیم و بعد بودجه و محدوده مورد نظرت را دقیق می‌کنیم.',
  },
  {
    title: 'پیدا کردن گزینه‌های متناسب در گیلان',
    body: 'ملک‌هایی که با خواسته‌های تو هم‌خوانی دارند را در مناطق مختلف گیلان بررسی و برایت جمع‌بندی می‌کنیم.',
  },
  {
    title: 'بررسی اولیه ملک و همراهی در مسیر بازدید و خرید',
    body: 'در بازدید و بررسی اولیه همراهت هستیم تا با دید بازتری تصمیم بگیری و مسیر خرید برات روشن‌تر باشه.',
  },
];

export function HowItWorks() {
  return (
    <section className="section section--tinted" id="how">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">مسیر همکاری</span>
          <h2>ملک بلد چطور کمکت می‌کنه؟</h2>
          <p>سه قدم ساده، از شناخت سلیقه خرید تا همراهی در مسیر بازدید.</p>
        </div>

        <ol className="steps">
          {STEPS.map((step, index) => (
            <li className="step" key={step.title}>
              <span className="step__number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="notice">
          <span className="notice__icon" aria-hidden="true">
            !
          </span>
          <span>
            وضعیت سند، کاربری زمین و شرایط ملک باید پیش از هر معامله به‌صورت مستقل و کارشناسی بررسی
            شود. ملک بلد جایگزین بررسی حقوقی و کارشناسی نیست و تضمینی برای سود یا حذف کامل ریسک خرید
            ارائه نمی‌دهد.
          </span>
        </p>
      </div>
    </section>
  );
}
