/* global React */
const ORIGINAL = [
  { id: "grid", label: "Матрица" },
  { id: "chrome", label: "Хром" },
  { id: "ripple", label: "Риппл" },
  { id: "streams", label: "Потоки" },
];
const ADVANCED = [
  { id: "shield", label: "Щит" },
  { id: "neural", label: "Нейросеть" },
  { id: "tunnel", label: "Туннель" },
];

function ServicesSection({ active, setActive, onCTA }) {
  return (
    <section className="section container" id="services" data-reveal>
      <div className="section__head">
        <p className="eyebrow">3D-сцены</p>
        <h2>Сайты, боты и свои 3D-решения</h2>
        <p>
          Разработаем для вас сайт или бота под ваши запросы, а также предлагаем
          комплексные решения: персональное облачное хранение данных и защиту
          инфраструктуры. Ниже — примеры 3D-сцен, которые мы используем в проектах.
          Переключайтесь, чтобы увидеть их вживую на фоне.
        </p>
      </div>

      <div className="scene-selector">
        <span className="scene-selector__grouplabel">Базовые</span>
        {ORIGINAL.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`scene-selector__pill${active === s.id ? " scene-selector__pill--active" : ""}`}
            onClick={() => setActive(s.id)}
          >
            <span className="scene-selector__dot" />
            <span className="scene-selector__label">{s.label}</span>
          </button>
        ))}
        <span className="scene-selector__divider" />
        <span className="scene-selector__grouplabel">Продвинутые</span>
        {ADVANCED.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`scene-selector__pill${active === s.id ? " scene-selector__pill--active" : ""}`}
            onClick={() => setActive(s.id)}
          >
            <span className="scene-selector__dot" />
            <span className="scene-selector__label">{s.label}</span>
          </button>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <button className="cta" onClick={() => onCTA("GhostOfSecretum")}>Связаться с нами</button>
      </div>
    </section>
  );
}
window.ServicesSection = ServicesSection;
