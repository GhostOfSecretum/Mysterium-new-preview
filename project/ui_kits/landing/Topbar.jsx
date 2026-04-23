/* global React */
const { useState } = React;

function Topbar({ scrolled, menuOpen, setMenuOpen }) {
  return (
    <>
      <header className={`topbar ${scrolled ? "topbar--scrolled" : ""}`}>
        <div className="topbar__inner">
          <a className="brand" href="#services">
            <span className="brand__dot" />
            <span>Mysterium Tech Portal</span>
          </a>
          <nav className="desktop-nav">
            <a href="#features">Возможности</a>
            <a href="#pricing">Тарифы</a>
            <a href="#services">Разработка</a>
          </nav>
          <button
            type="button"
            className={`menu-btn ${menuOpen ? "menu-btn--open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            <span /><span />
          </button>
        </div>
      </header>
      <div className={`mobile-nav ${menuOpen ? "mobile-nav--open" : ""}`}>
        <a href="#features" onClick={() => setMenuOpen(false)}>Возможности</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Тарифы</a>
        <a href="#services" onClick={() => setMenuOpen(false)}>Разработка</a>
      </div>
    </>
  );
}

window.Topbar = Topbar;
