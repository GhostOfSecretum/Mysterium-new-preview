/* global React */
const PROJECTS = [
  {
    id: "bot",
    tag: "Telegram-бот",
    title: "Бот продаж с личным кабинетом",
    desc: "Каталог, оплата картой / СБП / криптой, интеграция с CRM, панель оператора. Запуск за 2–4 недели.",
    cta: "Заказать бота",
  },
  {
    id: "site",
    tag: "Сайт под ключ",
    title: "Корпоративный сайт и личный кабинет",
    desc: "Современный дизайн, адаптив, своя админка, интеграция с внутренними системами клиента.",
    cta: "Обсудить сайт",
    featured: true,
  },
  {
    id: "cloud",
    tag: "Облако + безопасность",
    title: "Частное облако и аудит",
    desc: "Развёртывание хранилища, бэкапы, шифрование, разграничение доступов, сопровождение 24/7.",
    cta: "Запросить аудит",
  },
];

function PricingGrid({ onCTA }) {
  return (
    <section className="section container" id="pricing" data-reveal>
      <div className="section__head">
        <p className="eyebrow">Пакеты</p>
        <h2>С чего обычно начинают</h2>
        <p>Собираем решение под вашу задачу — ниже три типовых сценария, от которых можно оттолкнуться.</p>
      </div>
      <div className="pricing-grid">
        {PROJECTS.map((p) => (
          <div key={p.id} className={`price-card ${p.featured ? "price-card--featured" : ""}`}>
            {p.featured && <p className="price-card__tag">★ Чаще всего</p>}
            <p className="price-card__tag" style={{ color: "var(--text-muted)", marginBottom: 0 }}>{p.tag}</p>
            <h3 style={{ marginTop: 8 }}>{p.title}</h3>
            <p className="price-card__note" style={{ marginTop: 14 }}>{p.desc}</p>
            <button className="cta cta--block" onClick={() => onCTA("GhostOfSecretum")}>{p.cta}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
window.PricingGrid = PricingGrid;
