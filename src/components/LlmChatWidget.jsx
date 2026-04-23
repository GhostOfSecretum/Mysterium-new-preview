import { useEffect, useRef, useState } from "react";

const WELCOME = {
  role: "assistant",
  content: "Привет! Я локальный AI-помощник. Отвечаю по базе инструкций о сервисе Mysterium Tech.",
};

export default function LlmChatWidget() {
  const [open,        setOpen]        = useState(false);
  const [input,       setInput]       = useState("");
  const [messages,    setMessages]    = useState([WELCOME]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [modelLabel,  setModelLabel]  = useState("локальная LLM");
  const feedRef = useRef(null);

  useEffect(() => {
    if (!open || !feedRef.current) return;
    feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/local-llm/health")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { if (!cancelled) setModelLabel(d?.model || "локальная LLM"); })
      .catch(() => { if (!cancelled) setError("Локальный AI недоступен. Запустите Ollama и `npm run llm:server`."); });
    return () => { cancelled = true; };
  }, []);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/local-llm/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: next.filter((m) => m.role === "user" || m.role === "assistant").slice(-8),
        }),
      });
      if (!res.ok) throw new Error(`Ошибка API (${res.status})`);
      const data = await res.json();
      if (data?.model) setModelLabel(data.model);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data?.answer || "Не получилось сформировать ответ." },
      ]);
    } catch (err) {
      setError(err.message || "Неизвестная ошибка.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Сейчас не могу ответить. Проверьте, что Ollama и локальный сервер запущены." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="llm-widget-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="llm-widget-panel"
      >
        {open ? "Закрыть AI" : "AI-чат"}
      </button>

      <aside
        id="llm-widget-panel"
        className={`llm-widget${open ? " llm-widget--open" : ""}`}
        aria-hidden={!open}
      >
        <div className="llm-widget__head">
          <p>AI-помощник</p>
          <span>{modelLabel}</span>
        </div>

        <div ref={feedRef} className="llm-widget__messages">
          {messages.map((m, i) => (
            <article key={`${m.role}-${i}`} className={`llm-msg llm-msg--${m.role}`}>
              {m.content}
            </article>
          ))}
          {loading && <article className="llm-msg llm-msg--assistant">Пишу ответ...</article>}
        </div>

        {error && <p className="llm-widget__error">{error}</p>}

        <form className="llm-widget__form" onSubmit={send}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ваш вопрос..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Отправить
          </button>
        </form>
      </aside>
    </>
  );
}
