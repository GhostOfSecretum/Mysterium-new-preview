/* global React, ReactDOM, SceneSwitcher, Topbar, Hero, FeatureGrid, PricingGrid, ServicesSection, Footer, LlmWidget */
const { useState, useEffect } = React;

function App() {
  const [active, setActive] = useState(() => localStorage.getItem("mt.scene") || "grid");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { localStorage.setItem("mt.scene", active); }, [active]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0 }
    );
    const nodes = document.querySelectorAll("[data-reveal]");
    nodes.forEach((el) => io.observe(el));
    // Fallback: guarantee reveal after first paint in case IO never fires (e.g. inside an iframe preview).
    const fallback = setTimeout(() => {
      nodes.forEach((el) => el.classList.add("is-visible"));
    }, 120);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(fallback); io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);

  const onCTA = (handle) => {
    setToast(`Открываем @${handle}…`);
    clearTimeout(window.__toastT);
    window.__toastT = setTimeout(() => setToast(""), 1800);
  };

  return (
    <div className="app-shell">
      <SceneSwitcher active={active} />
      <div className="ambient-mesh" aria-hidden="true" />
      <Topbar scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero onCTA={onCTA} />
        <FeatureGrid />
        <PricingGrid onCTA={onCTA} />
        <ServicesSection active={active} setActive={setActive} onCTA={onCTA} />
      </main>
      <Footer onCTA={onCTA} />
      <LlmWidget />
      <div className={`toast${toast ? " toast--visible" : ""}`}>{toast}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
