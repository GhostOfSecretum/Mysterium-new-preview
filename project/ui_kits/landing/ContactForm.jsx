/* global React */
const { useState: useFormState } = React;

const SERVICE_OPTIONS = [
  { id: "bot", label: "Telegram-бот" },
  { id: "site", label: "Сайт / веб-сервис" },
  { id: "cloud", label: "Персональное облако" },
  { id: "security", label: "Безопасность / аудит" },
  { id: "other", label: "Другое / обсудить" },
];

const BUDGET_OPTIONS = [
  "Пока не знаю",
  "До 50 000 ₽",
  "50 000 – 150 000 ₽",
  "150 000 – 500 000 ₽",
  "Больше 500 000 ₽",
];

function saveLead(lead) {
  const key = "mt.leads";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.unshift({ ...lead, id: crypto.randomUUID?.() || String(Date.now()), ts: Date.now() });
  localStorage.setItem(key, JSON.stringify(list));
}

function ContactForm({ onCTA }) {
  const [service, setService] = useFormState("bot");
  const [name, setName] = useFormState("");
  const [contact, setContact] = useFormState("");
  const [budget, setBudget] = useFormState(BUDGET_OPTIONS[0]);
  const [message, setMessage] = useFormState("");
  const [sent, setSent] = useFormState(false);
  const [err, setErr] = useFormState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setErr("Укажите имя и способ связи.");
      return;
    }
    setErr("");
    saveLead({ service, name: name.trim(), contact: contact.trim(), budget, message: message.trim() });
    setSent(true);
    setName(""); setContact(""); setMessage(""); setBudget(BUDGET_OPTIONS[0]);
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <section className="section container" id="contact" data-reveal>
      <div className="section__head">
        <p className="eyebrow">Связаться</p>
        <h2>Расскажите, что нужно сделать</h2>
        <p>Все проекты считаем индивидуально. Заполните форму — свяжемся в течение рабочего дня. Или напишите напрямую в Telegram.</p>
      </div>

      <div className="contact-layout">
        <form className="contact-form glass-card" onSubmit={submit} noValidate>
          <label className="field">
            <span className="field__label">Какая услуга интересует</span>
            <div className="chip-row" role="radiogroup" aria-label="Услуга">
              {SERVICE_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  role="radio"
                  aria-checked={service === s.id}
                  className={`chip${service === s.id ? " chip--active" : ""}`}
                  onClick={() => setService(s.id)}
                >{s.label}</button>
              ))}
            </div>
          </label>

          <div className="field-row">
            <label className="field">
              <span className="field__label">Как к вам обращаться *</span>
              <input
                className="input" type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Имя или название компании" autoComplete="name"
              />
            </label>
            <label className="field">
              <span className="field__label">Способ связи *</span>
              <input
                className="input" type="text" value={contact} onChange={(e) => setContact(e.target.value)}
                placeholder="@telegram, email или телефон"
              />
            </label>
          </div>

          <label className="field">
            <span className="field__label">Ориентировочный бюджет</span>
            <div className="chip-row">
              {BUDGET_OPTIONS.map((b) => (
                <button
                  type="button" key={b}
                  className={`chip${budget === b ? " chip--active" : ""}`}
                  onClick={() => setBudget(b)}
                >{b}</button>
              ))}
            </div>
          </label>

          <label className="field">
            <span className="field__label">Коротко о задаче</span>
            <textarea
              className="input input--area" rows={4} value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Опишите, что нужно сделать, сроки, ссылки на материалы…"
            />
          </label>

          {err && <p className="form-error">{err}</p>}
          {sent && <p className="form-success">Заявка отправлена. Мы свяжемся с вами.</p>}

          <div className="form-actions">
            <button type="submit" className="cta">Отправить заявку</button>
            <button type="button" className="cta cta--ghost" onClick={() => onCTA("GhostOfSecretum")}>
              Написать в Telegram
            </button>
          </div>
        </form>

        <aside className="contact-aside glass-card">
          <p className="eyebrow" style={{ marginBottom: 10, fontSize: "0.62rem" }}>Прямой контакт</p>
          <h3 style={{ marginTop: 0 }}>@GhostOfSecretum</h3>
          <p style={{ color: "var(--text-muted)" }}>Личный Telegram владельца. Пишите по любому проекту — отвечаем обычно в течение нескольких часов.</p>
          <button className="cta cta--block" onClick={() => onCTA("GhostOfSecretum")}>Открыть чат</button>

          <div className="contact-aside__divider" />

          <p className="eyebrow" style={{ marginBottom: 10, fontSize: "0.62rem" }}>Поддержка по текущим задачам</p>
          <h3 style={{ marginTop: 0 }}>@SecretumHelp_bot</h3>
          <p style={{ color: "var(--text-muted)" }}>Если вы уже наш клиент — все технические вопросы сюда.</p>
          <button className="cta cta--ghost cta--block" onClick={() => onCTA("SecretumHelp_bot")}>Открыть поддержку</button>
        </aside>
      </div>
    </section>
  );
}
window.ContactForm = ContactForm;
