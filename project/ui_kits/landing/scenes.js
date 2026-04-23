/* scenes.js — 7 animated canvas scenes matching the Mysterium Tech aesthetic.
   4 "original" scenes reimagined from the repo, + 3 new advanced scenes.
   All use the same teal/abyss palette and mouse/scroll reactivity. */

window.__scenes = {};

// Utilities
const TAU = Math.PI * 2;
function radial(ctx, x, y, r, c1, c2) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, c1); g.addColorStop(1, c2); return g;
}

// ─────────────────────────────────────────────
// 1. GRID — isometric pulsing matrix (originally CryptoGridScene)
window.__scenes.grid = function (ctx, w, h, s) {
  const cx = w / 2, cy = h / 2 + 40;
  const cols = 26, spacing = Math.max(22, Math.min(w, h) / 36);
  const half = cols / 2;
  ctx.save();
  ctx.translate(cx + s.sx * 20, cy + s.sy * 12);
  const tilt = 0.55 + s.scroll * 0.25 + s.sy * 0.12;
  for (let x = 0; x < cols; x++) {
    for (let z = 0; z < cols; z++) {
      const px = (x - half) * spacing;
      const pz = (z - half) * spacing;
      const d = Math.hypot(px, pz);
      const wave = Math.sin(d * 0.04 - s.t * 1.5) * 6 + Math.cos(px * 0.03 + s.t) * Math.sin(pz * 0.03 + s.t) * 4;
      const iso = { x: px - pz * 0.5, y: (px + pz) * 0.25 * Math.sin(tilt) - wave };
      const fade = 1 - Math.min(1, d / (cols * spacing * 0.6));
      if (fade <= 0.02) continue;
      const bright = 0.15 + Math.max(0, wave / 10) * 0.8;
      const hl = Math.random() < 0.002 ? 1 : 0;
      ctx.fillStyle = hl
        ? `rgba(64, 224, 208, ${0.9 * fade})`
        : `rgba(64, 224, 208, ${bright * 0.7 * fade})`;
      ctx.fillRect(iso.x - 3, iso.y - 2 - wave, 6, 5 + Math.max(0, wave));
    }
  }
  ctx.restore();
};

// ─────────────────────────────────────────────
// 2. CHROME — rotating polished torus knot silhouette (ChromeLuxuryScene)
window.__scenes.chrome = function (ctx, w, h, s) {
  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) * 0.22;
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 8; i++) {
    const a = s.t * 0.35 + i * 0.6 + s.sx * 0.3;
    const r = R * (1 + i * 0.08);
    ctx.beginPath();
    for (let k = 0; k <= 180; k++) {
      const th = (k / 180) * TAU;
      const p = 2, q = 3;
      const rx = r * Math.cos(q * th + a) * (1 + 0.2 * Math.cos(p * th));
      const ry = r * Math.sin(q * th + a) * (1 + 0.2 * Math.cos(p * th));
      if (k === 0) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
    }
    const alpha = 0.04 + (8 - i) * 0.015;
    ctx.strokeStyle = `rgba(208, 220, 235, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  // Glints
  for (let i = 0; i < 40; i++) {
    const ang = i * 0.75 + s.t * 0.4;
    const rr = R * 2 + 60 * Math.sin(s.t * 0.6 + i);
    const x = Math.cos(ang) * rr, y = Math.sin(ang) * rr * 0.6;
    ctx.fillStyle = `rgba(240, 245, 255, ${0.15 + 0.2 * Math.sin(s.t * 3 + i)})`;
    ctx.beginPath(); ctx.arc(x, y, 1.2, 0, TAU); ctx.fill();
  }
  ctx.restore();
};

// ─────────────────────────────────────────────
// 3. RIPPLE — concentric rings (ChromeRippleScene)
window.__scenes.ripple = function (ctx, w, h, s) {
  const cx = w / 2 + s.sx * 40, cy = h / 2 + s.sy * 25;
  for (let i = 0; i < 18; i++) {
    const r = 40 + i * 28 + (s.t * 40) % 28;
    const alpha = Math.max(0, 0.28 - i * 0.014);
    ctx.strokeStyle = `rgba(64, 224, 208, ${alpha})`;
    ctx.lineWidth = i % 3 === 0 ? 1.4 : 0.6;
    ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.5, 0, 0, TAU); ctx.stroke();
  }
  // Core
  ctx.fillStyle = radial(ctx, cx, cy, 120, "rgba(64, 224, 208, 0.35)", "rgba(64, 224, 208, 0)");
  ctx.beginPath(); ctx.arc(cx, cy, 120, 0, TAU); ctx.fill();
  ctx.fillStyle = "rgba(240, 245, 255, 0.8)";
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, TAU); ctx.fill();
};

// ─────────────────────────────────────────────
// 4. STREAMS — falling rain of light (DataStreamsScene)
if (!window.__streamsState) {
  window.__streamsState = Array.from({ length: 220 }, () => ({
    x: Math.random(), y: Math.random(), l: 30 + Math.random() * 180,
    v: 0.15 + Math.random() * 0.55, hl: Math.random() > 0.82,
  }));
}
window.__scenes.streams = function (ctx, w, h, s) {
  const parts = window.__streamsState;
  for (const p of parts) {
    p.y += p.v * 0.01 + s.scroll * 0.01;
    if (p.y > 1.1) { p.y = -0.1; p.x = Math.random(); }
    const x = p.x * w + Math.sin(s.t + p.y * 8) * 14;
    const y = p.y * h;
    const grad = ctx.createLinearGradient(x, y, x, y + p.l);
    const col = p.hl ? "64, 224, 208" : "26, 143, 168";
    grad.addColorStop(0, `rgba(${col}, 0)`);
    grad.addColorStop(0.4, `rgba(${col}, ${p.hl ? 0.75 : 0.45})`);
    grad.addColorStop(1, `rgba(${col}, 0)`);
    ctx.strokeStyle = grad; ctx.lineWidth = p.hl ? 1.4 : 0.8;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + p.l); ctx.stroke();
  }
};

// ─────────────────────────────────────────────
// NEW ADVANCED 1: CYBER SHIELD — hex lattice shield with orbital glints
window.__scenes.shield = function (ctx, w, h, s) {
  const cx = w / 2 + s.sx * 20, cy = h / 2 + s.sy * 12;
  const R = Math.min(w, h) * 0.28;
  // Outer shield hex-lattice
  for (let i = 0; i < 6; i++) {
    const r = R + i * 18;
    const a = s.t * 0.2 + i * 0.4;
    ctx.beginPath();
    for (let k = 0; k <= 6; k++) {
      const th = (k / 6) * TAU + a;
      const x = cx + Math.cos(th) * r;
      const y = cy + Math.sin(th) * r * 0.65;
      if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(64, 224, 208, ${0.16 - i * 0.02})`;
    ctx.lineWidth = i === 0 ? 1.8 : 0.8;
    ctx.stroke();
  }
  // Inner pulse
  const pulse = 0.6 + 0.4 * Math.sin(s.t * 1.4);
  ctx.fillStyle = radial(ctx, cx, cy, R, `rgba(64, 224, 208, ${0.22 * pulse})`, "rgba(64, 224, 208, 0)");
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
  // Shield core emblem
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(s.t * 0.1);
  ctx.strokeStyle = "rgba(208, 232, 240, 0.7)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, -R * 0.35);
  ctx.lineTo(R * 0.25, -R * 0.15);
  ctx.lineTo(R * 0.2, R * 0.25);
  ctx.lineTo(0, R * 0.4);
  ctx.lineTo(-R * 0.2, R * 0.25);
  ctx.lineTo(-R * 0.25, -R * 0.15);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
  // Orbital glints
  for (let i = 0; i < 60; i++) {
    const ang = s.t * 0.6 + i * 0.5;
    const rr = R * 1.4 + Math.sin(s.t + i) * 30;
    const x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr * 0.55;
    ctx.fillStyle = `rgba(240, 250, 255, ${0.4 + 0.4 * Math.sin(s.t * 3 + i)})`;
    ctx.beginPath(); ctx.arc(x, y, 1.3, 0, TAU); ctx.fill();
  }
};

// ─────────────────────────────────────────────
// NEW ADVANCED 2: NEURAL MESH — points connected by thin lines ("network")
if (!window.__neuralState) {
  window.__neuralState = Array.from({ length: 80 }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0008,
    vy: (Math.random() - 0.5) * 0.0008,
    r: 0.6 + Math.random() * 1.8,
  }));
}
window.__scenes.neural = function (ctx, w, h, s) {
  const pts = window.__neuralState;
  const mx = (s.sx + 1) * 0.5, my = 1 - (s.sy + 1) * 0.5;
  for (const p of pts) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > 1) p.vx *= -1;
    if (p.y < 0 || p.y > 1) p.vy *= -1;
    // attract slightly to mouse
    p.vx += (mx - p.x) * 0.00002;
    p.vy += (my - p.y) * 0.00002;
  }
  // Lines
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j];
      const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
      const d = Math.hypot(dx, dy);
      const MAX = 160;
      if (d < MAX) {
        const alpha = (1 - d / MAX) * 0.35;
        ctx.strokeStyle = `rgba(64, 224, 208, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke();
      }
    }
  }
  // Nodes
  for (const p of pts) {
    const x = p.x * w, y = p.y * h;
    ctx.fillStyle = "rgba(64, 224, 208, 0.9)";
    ctx.beginPath(); ctx.arc(x, y, p.r, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(64, 224, 208, 0.15)";
    ctx.beginPath(); ctx.arc(x, y, p.r + 4, 0, TAU); ctx.fill();
  }
};

// ─────────────────────────────────────────────
// NEW ADVANCED 3: QUANTUM TUNNEL — procedural encrypted pipe
window.__scenes.tunnel = function (ctx, w, h, s) {
  const cx = w / 2 + s.sx * 30, cy = h / 2 + s.sy * 20;
  const steps = 28;
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    const depth = (s.t * 0.8 + t * 6) % 6 / 6;
    const r = 20 + depth * Math.min(w, h) * 0.9;
    const sides = 8;
    const twist = s.t * 0.4 + depth * 3;
    ctx.beginPath();
    for (let k = 0; k <= sides; k++) {
      const th = (k / sides) * TAU + twist;
      const x = cx + Math.cos(th) * r;
      const y = cy + Math.sin(th) * r;
      if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    const alpha = (1 - depth) * 0.45;
    ctx.strokeStyle = `rgba(64, 224, 208, ${alpha})`;
    ctx.lineWidth = 1 + (1 - depth) * 2;
    ctx.stroke();
    // Glyphs at corners (encrypted feel)
    if (i % 3 === 0) {
      for (let k = 0; k < sides; k++) {
        const th = (k / sides) * TAU + twist;
        const x = cx + Math.cos(th) * r;
        const y = cy + Math.sin(th) * r;
        ctx.fillStyle = `rgba(208, 232, 240, ${alpha * 0.7})`;
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }
  }
  // Core light
  const core = radial(ctx, cx, cy, 80, "rgba(64, 224, 208, 0.45)", "rgba(64, 224, 208, 0)");
  ctx.fillStyle = core;
  ctx.beginPath(); ctx.arc(cx, cy, 80, 0, TAU); ctx.fill();
};
