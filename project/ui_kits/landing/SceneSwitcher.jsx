/* global React */
// SceneSwitcher.jsx — renders the active scene into a full-viewport canvas.
// We fake the R3F scenes with Canvas2D / WebGL-lite visuals that preserve the
// visual DNA of the originals (mouse/scroll reactive, same palette, same mood).
const { useEffect, useRef } = React;

function SceneSwitcher({ active }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ t: 0, mx: 0, my: 0, sx: 0, sy: 0, scroll: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (x, y) => {
      stateRef.current.mx = (x / window.innerWidth) * 2 - 1;
      stateRef.current.my = -(y / window.innerHeight) * 2 + 1;
    };
    const mm = (e) => onMove(e.clientX, e.clientY);
    const tm = (e) => { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); };
    const sc = () => { stateRef.current.scroll = window.scrollY / Math.max(1, window.innerHeight); };
    window.addEventListener("mousemove", mm, { passive: true });
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("scroll", sc, { passive: true });

    const render = (now) => {
      const s = stateRef.current;
      s.t = now / 1000;
      s.sx += (s.mx - s.sx) * 0.06;
      s.sy += (s.my - s.sy) * 0.06;
      ctx.clearRect(0, 0, w, h);

      const scene = window.__scenes[active] || window.__scenes.grid;
      scene(ctx, w, h, s);

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("scroll", sc);
    };
  }, [active]);

  return (
    <div className="scene-shell" aria-hidden="true">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

window.SceneSwitcher = SceneSwitcher;
