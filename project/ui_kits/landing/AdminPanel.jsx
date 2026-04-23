/* global React */
const { useState: useAdmState, useEffect: useAdmEffect } = React;

// Demo-only access code. Stored locally; replace with real auth when deploying.
const ADMIN_CODE = "mt-admin";
const SERVICE_LABELS = {
  bot: "Telegram-бот",
  site: "Сайт / веб-сервис",
  cloud: "Персональное облако",
  security: "Безопасность / аудит",
  other: "Другое",
};

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function AdminPanel() {
  const [open, setOpen] = useAdmState(false);
  const [auth, setAuth] = useAdmState(() => sessionStorage.getItem("mt.admin") === "1");
  const [code, setCode] = useAdmState("");
  const [err, setErr] = useAdmState("");
  const [leads, setLeads] = useAdmState([]);
  const [filter, setFilter] = useAdmState("all");

  // Keyboard shortcut: Shift+A opens the admin panel.
  useAdmEffect(() => {
    const onKey = (e) => {
      if (e.shiftKey && (e.key === "A" || e.key === "a") && !e.target.closest("input,textarea")) {
        e.preventDefault(); setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useAdmEffect(() => {
    if (open && auth) {
      setLeads(JSON.parse(localStorage.getItem("mt.leads") || "[]"));
    }
  }, [open, auth]);

  const submitCode = (e) => {
    e.preventDefault();
    if (code.trim() === ADMIN_CODE) {
      setAuth(true); sessionStorage.setItem("mt.admin", "1"); setErr(""); setCode("");
    } else {
      setErr("Неверный код доступа.");
    }
  };

  const refresh = () => setLeads(JSON.parse(localStorage.getItem("mt.leads") || "[]"));
  const removeLead = (id) => {
    const next = leads.filter((l) => l.id !== id);
    localStorage.setItem("mt.leads", JSON.stringify(next));
    setLeads(next);
  };
  const clearAll = () => {
    if (!confirm("Удалить все заявки?")) return;
    localStorage.setItem("mt.leads", "[]"); setLeads([]);
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(leads, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mt-leads-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.service === filter);

  return (
    <>
      <button
        type="button"
        className="admin-fab"
        onClick={() => setOpen(true)}
        title="Админ-панель (Shift+A)"
        aria-label="Админ-панель"
      >⚙</button>

      {open && (
        <div className="admin-overlay" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="admin-panel">
            <header className="admin-panel__head">
              <div>
                <p className="eyebrow" style={{ marginBottom: 4, fontSize: "0.62rem" }}>Админ</p>
                <h3 style={{ margin: 0 }}>Заявки с сайта</h3>
              </div>
              <button className="admin-close" onClick={() => setOpen(false)} aria-label="Закрыть">✕</button>
            </header>

            {!auth ? (
              <form className="admin-auth" onSubmit={submitCode}>
                <p style={{ color: "var(--text-muted)" }}>
                  Демо-доступ. Введите код <code style={{ color: "var(--accent-2)" }}>mt-admin</code> (в продакшене заменить на реальную авторизацию).
                </p>
                <input
                  className="input" type="password" value={code}
                  onChange={(e) => setCode(e.target.value)} placeholder="Код доступа" autoFocus
                />
                {err && <p className="form-error">{err}</p>}
                <button className="cta" type="submit">Войти</button>
              </form>
            ) : (
              <div className="admin-body">
                <div className="admin-toolbar">
                  <select
                    className="input input--select"
                    value={filter} onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">Все услуги ({leads.length})</option>
                    {Object.entries(SERVICE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v} ({leads.filter((l) => l.service === k).length})</option>
                    ))}
                  </select>
                  <div className="admin-toolbar__right">
                    <button className="cta cta--ghost cta--sm" onClick={refresh}>Обновить</button>
                    <button className="cta cta--ghost cta--sm" onClick={exportJson} disabled={!leads.length}>Экспорт</button>
                    <button className="cta cta--ghost cta--sm" onClick={clearAll} disabled={!leads.length}>Очистить</button>
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <div className="admin-empty">
                    <p style={{ color: "var(--text-muted)" }}>
                      {leads.length === 0 ? "Заявок пока нет." : "По выбранному фильтру заявок нет."}
                    </p>
                  </div>
                ) : (
                  <ul className="admin-leads">
                    {filtered.map((l) => (
                      <li key={l.id} className="admin-lead">
                        <div className="admin-lead__head">
                          <span className="admin-lead__tag">{SERVICE_LABELS[l.service] || l.service}</span>
                          <span className="admin-lead__ts">{fmtDate(l.ts)}</span>
                          <button className="admin-lead__x" onClick={() => removeLead(l.id)} aria-label="Удалить">✕</button>
                        </div>
                        <h4 style={{ margin: "6px 0 2px" }}>{l.name}</h4>
                        <p className="admin-lead__contact">{l.contact}</p>
                        {l.budget && l.budget !== "Пока не знаю" && (
                          <p className="admin-lead__budget">Бюджет: {l.budget}</p>
                        )}
                        {l.message && <p className="admin-lead__msg">{l.message}</p>}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="admin-foot">
                  Данные хранятся локально (localStorage) — это демо. Для продакшена подключите бэкенд или Telegram-бот-приёмник.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
window.AdminPanel = AdminPanel;
