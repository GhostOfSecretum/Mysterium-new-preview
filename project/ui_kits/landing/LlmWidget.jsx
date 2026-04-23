/* global React */
const { useState, useRef, useEffect } = React;

function LlmWidget() {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");
  const [msgs, setMsgs] = useState([
    { r: "a", c: "Привет! Я локальный AI-помощник. Отвечаю по вашей базе инструкций о сервисе." },
  ]);
  const feedRef = useRef(null);
  useEffect(() => { if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight; }, [msgs, open]);

  const send = (e) => {
    e.preventDefault();
    const t = val.trim(); if (!t) return;
    setVal("");
    setMsgs((m) => [...m, { r: "u", c: t }]);
    setTimeout(() => {
      setMsgs((m) => [...m, {
        r: "a",
        c: "Мы делаем Telegram-ботов, сайты, персональные облачные решения и отвечаем за безопасность. Чтобы обсудить проект — @GhostOfSecretum. Поддержка по текущим задачам — @SecretumHelp_bot.",
      }]);
    }, 550);
  };

  return (
    <>
      <button type="button" className="llm-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? "Закрыть AI" : "AI-чат"}
      </button>
      <aside className={`llm-panel${open ? " llm-panel--open" : ""}`}>
        <div className="llm-head">
          <p>AI-помощник</p>
          <span>локальная LLM</span>
        </div>
        <div ref={feedRef} className="llm-msgs">
          {msgs.map((m, i) => (
            <p key={i} className={`llm-msg llm-msg--${m.r}`}>{m.c}</p>
          ))}
        </div>
        <form className="llm-form" onSubmit={send}>
          <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Ваш вопрос..." />
          <button type="submit">Отправить</button>
        </form>
      </aside>
    </>
  );
}
window.LlmWidget = LlmWidget;
