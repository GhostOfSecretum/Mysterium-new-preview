import { useEffect, useState } from "react";
import SceneSwitcher from "./components/SceneSwitcher.jsx";
import LlmChatWidget from "./components/LlmChatWidget.jsx";
import ContactForm from "./components/ContactForm.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

const TELEGRAM_HELP    = "https://t.me/SecretumHelp_bot";
const TELEGRAM_CONTACT = "https://t.me/GhostOfSecretum";

const SCENES = [
  { id: "grid",    label: "Матрица" },
  { id: "chrome",  label: "Хром"    },
  { id: "ripple",  label: "Риппл"   },
  { id: "streams", label: "Потоки"  },
];

const SERVICES = [
  {
    id: "bots",
    code: "BOT",
    title: "Telegram-боты",
    desc:  "Продажи, поддержка клиентов, автоматизация бизнес-процессов и мини-приложения — от простого бота до сложной системы с интеграциями.",
  },
  {
    id: "web",
    code: "WEB",
    title: "Разработка сайтов",
    desc:  "Лендинги, корпоративные сайты, личные кабинеты и внутренние порталы с современным дизайном и высокой производительностью.",
  },
  {
    id: "cloud",
    code: "CLD",
    title: "Облачные решения",
    desc:  "Частные хранилища, резервное копирование, синхронизация данных — на собственных серверах без зависимости от внешних платформ.",
  },
  {
    id: "sec",
    code: "SEC",
    title: "Безопасность",
    desc:  "Аудит инфраструктуры, защита от угроз, настройка защищённых каналов связи и комплексное сопровождение.",
  },
];

export default function App() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [activeScene, setActiveScene] = useState("grid");
  const [showAdmin,  setShowAdmin]  = useState(false);

  useEffect(() => {
    const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));

    // Immediately show all above-the-fold elements
    revealEls.forEach((el) => setTimeout(() => el.classList.add("is-visible"), 80));

    const observer  = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        });
      },
      { threshold: 0.05 },
    );
    revealEls.forEach((el) => observer.observe(el));

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <SceneSwitcher activeScene={activeScene} />
      <div className="ambient-mesh" aria-hidden="true" />

      {/* ---- Topbar ---- */}
      <header className={`topbar${scrolled ? " topbar--scrolled" : ""}`}>
        <div className="topbar__inner">
          <a className="brand" href="#hero" onClick={closeMenu}>
            <span className="brand__dot" />
            <span>Mysterium Tech</span>
          </a>

          <nav className="desktop-nav">
            <a href="#services">Услуги</a>
            <a href="#contact">Оставить заявку</a>
            <a href={TELEGRAM_CONTACT} target="_blank" rel="noreferrer">Связаться</a>
          </nav>

          <button
            type="button"
            className={`menu-btn${menuOpen ? " menu-btn--open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ---- Mobile nav ---- */}
      <div className={`mobile-nav${menuOpen ? " mobile-nav--open" : ""}`}>
        <div className="mobile-nav__group">
          <p>Навигация</p>
          <a href="#services" onClick={closeMenu}>Услуги</a>
          <a href="#contact"  onClick={closeMenu}>Оставить заявку</a>
          <a href={TELEGRAM_CONTACT} target="_blank" rel="noreferrer" onClick={closeMenu}>
            Связаться с нами
          </a>
        </div>
      </div>

      <main>
        {/* ---- Hero ---- */}
        <section className="section hero" id="hero">
          <div className="container">
            <div className="hero__content" data-reveal>
              <p className="eyebrow">IT / Безопасность / Разработка</p>
              <h1>
                Инженерная команда под задачи{" "}
                <span>вашего бизнеса</span>
              </h1>
              <p className="hero__lead">
                Разрабатываем Telegram-боты, сайты, персональные облачные решения
                и обеспечиваем безопасность вашей инфраструктуры — под ключ,
                на собственных серверах, с поддержкой 24/7.
              </p>

              <div className="hero__kpis">
                {[
                  { val: "4",    lbl: "направления" },
                  { val: "24/7", lbl: "поддержка"   },
                  { val: "VPS",  lbl: "свои серверы" },
                  { val: "∞",    lbl: "под ключ"     },
                ].map((k) => (
                  <div className="kpi" key={k.lbl}>
                    <span className="kpi__val">{k.val}</span>
                    <span className="kpi__lbl">{k.lbl}</span>
                  </div>
                ))}
              </div>

              <div className="hero__actions">
                <a className="cta" href="#contact">Оставить заявку</a>
                <a
                  className="cta cta--ghost"
                  href={TELEGRAM_CONTACT}
                  target="_blank"
                  rel="noreferrer"
                >
                  Связаться с нами
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Services / features ---- */}
        <section className="section" id="services">
          <div className="container">
            <div className="section__head" data-reveal>
              <p className="eyebrow">Что мы делаем</p>
              <h2>Услуги</h2>
            </div>
            <div className="feature-grid" data-reveal>
              {SERVICES.map((s) => (
                <div className="glass-card" key={s.id}>
                  <div className="glass-card__icon">{s.code}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 3D demo / scene selector ---- */}
        <section className="section section--demo">
          <div className="container">
            <div className="section__head" data-reveal>
              <p className="eyebrow">Визуальный кит</p>
              <h2>Пример продвинутой 3D-анимации</h2>
              <p className="services__text">
                Пример того, как может выглядеть продвинутая 3D-анимация, вы можете
                посмотреть, переключаясь между вариантами ниже. Такие интерактивные
                сцены доступны для ваших проектов.
              </p>
            </div>

            <div className="scene-selector" data-reveal>
              {SCENES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`scene-selector__pill${activeScene === s.id ? " scene-selector__pill--active" : ""}`}
                  onClick={() => setActiveScene(s.id)}
                >
                  <span className="scene-selector__dot" />
                  <span className="scene-selector__label">{s.label}</span>
                </button>
              ))}
            </div>

            <a
              className="cta services__contact"
              href={TELEGRAM_CONTACT}
              target="_blank"
              rel="noreferrer"
              data-reveal
            >
              Связаться с нами
            </a>
          </div>
        </section>

        {/* ---- Contact form ---- */}
        <section className="section section--contact" id="contact">
          <div className="container">
            <div className="section__head" data-reveal>
              <p className="eyebrow">Контакты</p>
              <h2>Обсудим ваш проект</h2>
              <p className="services__text">
                Расскажите о задаче — мы свяжемся с вами для уточнения деталей.
                Все условия по запросу.
              </p>
            </div>

            <div className="contact-grid">
              <ContactForm />

              <aside className="contact-aside">
                <div className="contact-card contact-card--highlight">
                  <h4>Написать напрямую</h4>
                  <p>Обсудить проект или задать вопрос можно напрямую через Telegram.</p>
                  <a href={TELEGRAM_CONTACT} target="_blank" rel="noreferrer">
                    @GhostOfSecretum
                  </a>
                </div>
                <div className="contact-card">
                  <h4>Поддержка</h4>
                  <p>По вопросам работы услуг и технической поддержке.</p>
                  <a href={TELEGRAM_HELP} target="_blank" rel="noreferrer">
                    @SecretumHelp_bot
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      {/* ---- Footer ---- */}
      <footer className="footer">
        <div className="footer__layout">
          <a className="brand" href="#hero">
            <span className="brand__dot" />
            <span>Mysterium Tech</span>
          </a>
          <p>© 2025 Mysterium Tech</p>
          <div className="footer__links">
            <a href={TELEGRAM_CONTACT} target="_blank" rel="noreferrer">@GhostOfSecretum</a>
            <a href={TELEGRAM_HELP}    target="_blank" rel="noreferrer">@SecretumHelp_bot</a>
            <button
              type="button"
              className="footer__admin"
              onClick={() => setShowAdmin(true)}
              title="Панель администратора"
            >
              ◆
            </button>
          </div>
        </div>
      </footer>

      <LlmChatWidget />

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
