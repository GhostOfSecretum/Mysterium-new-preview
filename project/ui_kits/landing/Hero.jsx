/* global React */
function Hero({ onCTA }) {
  return (
    <section className="section hero container" data-reveal>
      <p className="eyebrow">Боты · Сайты · Облако · Безопасность</p>
      <h1>Инженерная команда под задачи вашего <span>бизнеса</span>.</h1>
      <p className="hero__lead">
        Разрабатываем Telegram-боты и сайты, разворачиваем персональные облачные решения
        и выстраиваем безопасность инфраструктуры. Под ключ, с поддержкой и своими серверами.
      </p>
      <div className="hero__actions">
        <button className="cta" onClick={() => onCTA("GhostOfSecretum")}>Обсудить проект</button>
        <button className="cta cta--ghost" onClick={() => onCTA("SecretumHelp_bot")}>Написать в поддержку</button>
      </div>
      <div className="kpi-row">
        <div className="kpi"><div className="kpi__v">4</div><div className="kpi__l">направления</div></div>
        <div className="kpi"><div className="kpi__v">24/7</div><div className="kpi__l">поддержка</div></div>
        <div className="kpi"><div className="kpi__v">Свои</div><div className="kpi__l">серверы</div></div>
        <div className="kpi"><div className="kpi__v">Под ключ</div><div className="kpi__l">от идеи до релиза</div></div>
      </div>
    </section>
  );
}
window.Hero = Hero;
