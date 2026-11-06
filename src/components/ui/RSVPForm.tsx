import { useEffect, useRef, useState, type FormEvent } from "react";
import { buildWhatsAppUrl } from "../../lib/event";
import { invitation } from "../../config/invitation";
import { useLanguage } from "../../config/language";
import "../../styles/rsvp.css";

function Filigree({ position }: { position: "top" | "bottom" }) {
  return <svg className={`filigree ${position}`} viewBox="0 0 140 140" fill="none" aria-hidden="true"><path d="M8 126V34C8 20 20 8 34 8h92M16 115V38c0-12 10-22 22-22h78M30 78c11-36 19-39 36-45-5 22-8 31-36 45ZM46 46c18-2 28-6 32-21-15 0-25 5-32 21Z" stroke="currentColor" strokeWidth="1" /></svg>;
}

export function RSVPForm() {
  const { language, t } = useLanguage();
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [prepared, setPrepared] = useState<{ message: string; url: string } | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const noteInput = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!prepared) return;
    const modal = dialog.current;
    modal?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal?.close();
      document.body.style.overflow = overflow;
    };
  }, [prepared]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      // Reutiliza las validaciones vigentes, también para respuestas negativas.
      const url = new URL(buildWhatsAppUrl(name, attending ? count : 1));
      const cleanName = name.trim();
      let message = language === "en"
        ? attending
          ? `Hi, I'm ${cleanName}. I'm happy to RSVP to ${invitation.honoree}'s quinceañera. There will be ${count} guest${count === 1 ? "" : "s"} in total. Thank you for inviting me!`
          : `Hi! I'm ${cleanName}. Thank you so much for inviting me to ${invitation.honoree}'s quinceañera. Unfortunately, I can't make it, but I wish you a magical and unforgettable night.`
        : attending
          ? url.searchParams.get("text")!
          : `¡Hola! Soy ${cleanName}. Muchas gracias por invitarme a los XV años de ${invitation.honoree}. Lamentablemente no podré acompañarla, pero le deseo una noche mágica e inolvidable.`;
      if (note.trim()) message += language === "en" ? `\n\nA message for ${invitation.honoree}:\n“${note.trim()}”` : `\n\nUn mensaje para ${invitation.honoree}:\n“${note.trim()}”`;
      url.searchParams.set("text", message);
      setError("");
      setCopyStatus("");
      setPrepared({ message, url: url.href });
    } catch (reason) {
      setError(t("form.error"));
      nameInput.current?.focus();
    }
  }

  async function copyMessage() {
    if (!prepared) return;
    try {
      await navigator.clipboard.writeText(prepared.message);
      setCopyStatus(t("rsvp.copy.done"));
    } catch {
      setCopyStatus(t("rsvp.copy.fail"));
    }
  }

  return (
    <div className="premium-rsvp">
      <div className="card-wrap" data-reveal>
        <div className="rsvp-paper">
          <Filigree position="top" /><Filigree position="bottom" />
          <div className="seal" aria-hidden="true"><span>C<small>XV</small></span></div>
          <div className="card-inside">
            <div className="meta">{t("rsvp.meta")}</div>
            <h2>{t("rsvp.title")}<br /><em>{t("rsvp.title2")}</em></h2>
            <p className="card-copy">{t("rsvp.copy")}</p>
            <div className="ornament-line" aria-hidden="true">✧</div>
            <form onSubmit={submit} noValidate>
              <p className="form-title">{t("rsvp.form.title")}</p>
              <div className="attendance" role="group" aria-label={t("rsvp.aria")}>
                <button type="button" aria-pressed={attending} onClick={() => setAttending(true)}><span className="choice-icon" aria-hidden="true">✓</span><span className="choice-text"><strong>{t("rsvp.yes")}</strong><small>{t("rsvp.yes.small")}</small></span></button>
                <button type="button" aria-pressed={!attending} onClick={() => setAttending(false)}><span className="choice-icon" aria-hidden="true">♡</span><span className="choice-text"><strong>{t("rsvp.no")}</strong><small>{t("rsvp.no.small")}</small></span></button>
              </div>
              <div className="guest-field">
                <label htmlFor="guest-name">{t("rsvp.name.label")}</label>
                <div className="name-control"><input ref={nameInput} id="guest-name" name="name" autoComplete="name" maxLength={70} placeholder={t("rsvp.name.placeholder")} required value={name} onChange={e => { setName(e.target.value); setError(""); }} aria-invalid={!!error} aria-describedby={error ? "rsvp-name-error" : undefined} /></div>
                {error ? <p className="field-error" id="rsvp-name-error" role="alert">{error}</p> : null}
              </div>
              {attending ? <div className="guest-row">
                <div className="field-head"><span id="guests-label">{t("rsvp.guests.label")}</span><small>{t("rsvp.guests.small")}</small></div>
                <div className="counter" role="group" aria-labelledby="guests-label">
                  <button type="button" aria-label={t("rsvp.guest.remove")} disabled={count <= 1} onClick={() => setCount(c => Math.max(1, c - 1))}>−</button>
                  <output aria-live="polite" aria-label={t("rsvp.guest.total")}>{count}</output>
                  <button type="button" aria-label={t("rsvp.guest.add")} disabled={count >= (invitation.maxGuests ?? Number.MAX_SAFE_INTEGER)} onClick={() => setCount(c => c + 1)}>+</button>
                </div>
              </div> : null}
              <button className="note-toggle" type="button" aria-expanded={noteOpen} aria-controls="rsvp-note-area" onClick={() => { setNoteOpen(open => !open); if (!noteOpen) requestAnimationFrame(() => noteInput.current?.focus()); }}><span className="plus" aria-hidden="true">＋</span> {t("rsvp.note.toggle")}</button>
              <div className={`note-area${noteOpen ? " open" : ""}`} id="rsvp-note-area" inert={!noteOpen} aria-hidden={!noteOpen}><div className="note-inner"><textarea ref={noteInput} maxLength={350} value={note} onChange={e => setNote(e.target.value)} placeholder={t("rsvp.note.placeholder")} aria-label={t("rsvp.note.aria")} /></div></div>
              <div className="ticket-preview" aria-label={t("rsvp.ticket.aria")}>
                <div className="ticket-info"><small>{t("rsvp.ticket.label")}</small><strong>{name.trim() || t("rsvp.ticket.name")}</strong></div>
                <div className="ticket-number"><small>{attending ? t("rsvp.ticket.guests") : t("rsvp.ticket.love")}</small><b>{attending ? String(count).padStart(2, "0") : "♡"}</b><small>{attending ? t("rsvp.ticket.pass") : t("rsvp.ticket.message")}</small></div>
              </div>
              <button type="submit" className="submit"><span>{attending ? t("rsvp.submit.yes") : t("rsvp.submit.no")}</span><span aria-hidden="true" className="button-arrow">↗</span></button>
              <p className="deadline">{t("rsvp.deadline")}</p>
            </form>
          </div>
        </div>
      </div>
      <dialog ref={dialog} className="modal" aria-labelledby="rsvp-modal-title" onCancel={() => setPrepared(null)} onClose={() => setPrepared(null)} onClick={e => { if (e.target === e.currentTarget) { const box = e.currentTarget.getBoundingClientRect(); if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) setPrepared(null); } }}>
        <button type="button" className="close-modal" aria-label={t("rsvp.modal.close")} onClick={() => setPrepared(null)}>×</button>
        <div className="modal-glyph" aria-hidden="true">✧</div><div className="modal-eyebrow">{t("rsvp.modal.ready")}</div>
        <h3 id="rsvp-modal-title">{attending ? t("rsvp.modal.yes") : t("rsvp.modal.no")}</h3>
        <p>{attending ? t("rsvp.modal.body.yes") : t("rsvp.modal.body.no")}</p>
        <div className="message-preview" tabIndex={0}>{prepared?.message}</div>
        <div className="modal-actions"><button type="button" onClick={copyMessage}>{t("rsvp.modal.copy")}</button><a href={prepared?.url} target="_blank" rel="noopener noreferrer">{t("rsvp.modal.open")}</a></div>
        <p className="hint" role="status">{copyStatus}</p>
        <p className="hint">{t("rsvp.modal.sent")}</p>
      </dialog>
    </div>
  );
}
