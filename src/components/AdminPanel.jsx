import { useState, useEffect } from "react";

const STORAGE_KEY   = "mysterium_contacts";
const SESSION_KEY   = "mysterium_admin_auth";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin";

function getContacts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
function deleteContact(id) {
  const list = getContacts().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function AdminPanel({ onClose }) {
  const [authed,    setAuthed]    = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [password,  setPassword]  = useState("");
  const [pwError,   setPwError]   = useState("");
  const [contacts,  setContacts]  = useState([]);
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (authed) setContacts(getContacts().reverse());
  }, [authed]);

  function login(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      setPwError("Неверный пароль");
    }
  }

  function remove(id) {
    deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    forceRender((n) => n + 1);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPassword("");
  }

  return (
    <div className="admin-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="admin-panel">
        <div className="admin-panel__close">
          <h2>{authed ? "Заявки" : "Вход в панель"}</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {authed && (
              <button type="button" onClick={logout}>Выйти</button>
            )}
            <button type="button" onClick={onClose}>Закрыть</button>
          </div>
        </div>

        {!authed ? (
          <div className="admin-login">
            <p>Введите пароль для доступа к заявкам.</p>
            <form onSubmit={login}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPwError(""); }}
                  placeholder="••••••••"
                  autoFocus
                />
                {pwError && (
                  <span style={{ color: "#ff8e8e", fontSize: "0.78rem" }}>{pwError}</span>
                )}
              </div>
              <button type="submit" className="cta" style={{ width: "100%" }}>
                Войти
              </button>
            </form>
          </div>
        ) : contacts.length === 0 ? (
          <div className="admin-empty">
            <p>Заявок пока нет.</p>
          </div>
        ) : (
          <>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>
              Всего заявок: {contacts.length}
            </p>
            <div className="admin-submissions">
              {contacts.map((c) => (
                <div key={c.id} className="submission-card">
                  <div>
                    <div className="submission-card__meta">
                      <span className="submission-card__service">{c.service}</span>
                      <span className="submission-card__date">
                        {new Date(c.date).toLocaleString("ru-RU")}
                      </span>
                    </div>
                    <h4>{c.name}</h4>
                    <p className="submission-card__contact">{c.contact}</p>
                    {c.message && (
                      <p style={{ marginTop: 6 }}>{c.message}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="submission-card__delete"
                    onClick={() => remove(c.id)}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
