import { useState } from "react";

const STORAGE_KEY = "mysterium_contacts";

export function saveContact(data) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  list.push({ ...data, id: Date.now(), date: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const SERVICE_OPTIONS = [
  "Telegram-бот",
  "Разработка сайта",
  "Облачное решение",
  "Безопасность / аудит",
  "Другое",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    service: "",
    name: "",
    contact: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.service) e.service = "Выберите услугу";
    if (!form.name.trim()) e.name = "Укажите имя";
    if (!form.contact.trim()) e.contact = "Укажите Telegram или email";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setTimeout(() => {
      saveContact(form);
      setSent(true);
      setLoading(false);
    }, 600);
  }

  if (sent) {
    return (
      <div className="contact-form">
        <div className="contact-form__success">
          <div className="contact-form__success-icon">✓</div>
          <h3>Заявка отправлена</h3>
          <p>
            Мы получили вашу заявку и свяжемся с вами в ближайшее время.
            <br />
            Для срочных вопросов — <a href="https://t.me/GhostOfSecretum" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>@GhostOfSecretum</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <Field
          label="Услуга"
          error={errors.service}
          as="select"
          name="service"
          value={form.service}
          onChange={handleChange}
        >
          <option value="">Выберите направление</option>
          {SERVICE_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </Field>
      </div>

      <div className="contact-form__row contact-form__row--2col">
        <Field
          label="Ваше имя"
          error={errors.name}
          name="name"
          placeholder="Как к вам обращаться"
          value={form.name}
          onChange={handleChange}
        />
        <Field
          label="Telegram или email"
          error={errors.contact}
          name="contact"
          placeholder="@username или mail@example.com"
          value={form.contact}
          onChange={handleChange}
        />
      </div>

      <div className="contact-form__row">
        <Field
          label="Описание задачи"
          as="textarea"
          name="message"
          placeholder="Опишите, что нужно сделать — чем подробнее, тем точнее мы сможем помочь"
          value={form.message}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="cta contact-form__submit"
        disabled={loading}
      >
        {loading ? "Отправка..." : "Отправить заявку"}
      </button>
    </form>
  );
}

function Field({ label, error, as: Tag = "input", children, ...props }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <Tag {...props}>{children}</Tag>
      {error && (
        <span style={{ color: "#ff8e8e", fontSize: "0.78rem" }}>{error}</span>
      )}
    </div>
  );
}
