import { useEffect, useRef, useState, type FormEvent } from "react";
import { buildWhatsAppUrl } from "../../lib/event";
import { invitation } from "../../config/invitation";
import "../../styles/rsvp.css";

function Filigree({ position }: { position: "top" | "bottom" }) {
  return <svg className={`filigree ${position}`} viewBox="0 0 140 140" fill="none" aria-hidden="true"><path d="M8 126V34C8 20 20 8 34 8h92M16 115V38c0-12 10-22 22-22h78M30 78c11-36 19-39 36-45-5 22-8 31-36 45ZM46 46c18-2 28-6 32-21-15 0-25 5-32 21Z" stroke="currentColor" strokeWidth="1" /></svg>;
}

export function RSVPForm() {
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
      let message = attending
        ? url.searchParams.get("text")!
        : `¡Hola! Soy ${name.trim()}. Muchas gracias por invitarme a los XV años de ${invitation.honoree}. Lamentablemente no podré acompañarla, pero le deseo una noche mágica e inolvidable.`;
      if (note.trim()) message += `\n\nUn mensaje para ${invitation.honoree}:\n“${note.trim()}”`;
      url.searchParams.set("text", message);
      setError("");
      setCopyStatus("");
      setPrepared({ message, url: url.href });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Revisa tus datos.");
      nameInput.current?.focus();
    }
  }

  async function copyMessage() {
    if (!prepared) return;
    try {
      await navigator.clipboard.writeText(prepared.message);
      setCopyStatus("¡Copiado!");
    } catch {
      setCopyStatus("Selecciona y copia el texto del mensaje.");
    }
  }

  return (
    <div className="premium-rsvp">
      <div className="card-wrap" data-reveal>
        <div className="rsvp-paper">
          <Filigree position="top" /><Filigree position="bottom" />
          <div className="seal" aria-hidden="true"><span>C<small>XV</small></span></div>
          <div className="card-inside">
            <div className="meta">Una invitación muy especial</div>
            <h2>Guardo un lugar<br /><em>para ti.</em></h2>
            <p className="card-copy">No sería la misma celebración sin ti. ¿Me acompañas?</p>
            <div className="ornament-line" aria-hidden="true">✧</div>
            <form onSubmit={submit} noValidate>
              <p className="form-title">01 / ¿Nos vemos esa noche?</p>
              <div className="attendance" role="group" aria-label="¿Asistirás al evento?">
                <button type="button" aria-pressed={attending} onClick={() => setAttending(true)}><span className="choice-icon" aria-hidden="true">✓</span><span className="choice-text"><strong>¡Ahí estaré!</strong><small>Cuenta conmigo</small></span></button>
                <button type="button" aria-pressed={!attending} onClick={() => setAttending(false)}><span className="choice-icon" aria-hidden="true">♡</span><span className="choice-text"><strong>No podré ir</strong><small>Te mando cariño</small></span></button>
              </div>
              <div className="guest-field">
                <label htmlFor="guest-name">02 / Tu nombre, por favor</label>
                <div className="name-control"><input ref={nameInput} id="guest-name" name="name" autoComplete="name" maxLength={70} placeholder="Escribe tu nombre aquí" required value={name} onChange={e => { setName(e.target.value); setError(""); }} aria-invalid={!!error} aria-describedby={error ? "rsvp-name-error" : undefined} /></div>
                {error ? <p className="field-error" id="rsvp-name-error" role="alert">{error}</p> : null}
              </div>
              {attending ? <div className="guest-row">
                <div className="field-head"><span id="guests-label">03 / ¿Cuántos nos acompañan?</span><small>Incluyéndote a ti</small></div>
                <div className="counter" role="group" aria-labelledby="guests-label">
                  <button type="button" aria-label="Restar asistente" disabled={count <= 1} onClick={() => setCount(c => Math.max(1, c - 1))}>−</button>
                  <output aria-live="polite" aria-label="Total de asistentes">{count}</output>
                  <button type="button" aria-label="Agregar asistente" disabled={count >= (invitation.maxGuests ?? Number.MAX_SAFE_INTEGER)} onClick={() => setCount(c => c + 1)}>+</button>
                </div>
              </div> : null}
              <button className="note-toggle" type="button" aria-expanded={noteOpen} aria-controls="rsvp-note-area" onClick={() => { setNoteOpen(open => !open); if (!noteOpen) requestAnimationFrame(() => noteInput.current?.focus()); }}><span className="plus" aria-hidden="true">＋</span> ¿Quieres dejarle unas palabras a Camila?</button>
              <div className={`note-area${noteOpen ? " open" : ""}`} id="rsvp-note-area" inert={!noteOpen} aria-hidden={!noteOpen}><div className="note-inner"><textarea ref={noteInput} maxLength={350} value={note} onChange={e => setNote(e.target.value)} placeholder="Un deseo, un abrazo o unas palabras bonitas…" aria-label="Mensaje opcional para Camila" /></div></div>
              <div className="ticket-preview" aria-label="Vista previa de tu pase simbólico">
                <div className="ticket-info"><small>UN LUGAR EN ESTA HISTORIA</small><strong>{name.trim() || "Tu nombre aquí"}</strong></div>
                <div className="ticket-number"><small>{attending ? "INVITADOS" : "CON CARIÑO"}</small><b>{attending ? String(count).padStart(2, "0") : "♡"}</b><small>{attending ? "PASE PERSONAL" : "MENSAJE PERSONAL"}</small></div>
              </div>
              <button type="submit" className="submit"><span>{attending ? "Preparar mi confirmación" : "Enviar mis mejores deseos"}</span><span aria-hidden="true" className="button-arrow">↗</span></button>
              <p className="deadline">Por favor, confirma {invitation.rsvpDeadline.toLowerCase()}.</p>
            </form>
          </div>
        </div>
      </div>
      <dialog ref={dialog} className="modal" aria-labelledby="rsvp-modal-title" onCancel={() => setPrepared(null)} onClose={() => setPrepared(null)} onClick={e => { if (e.target === e.currentTarget) { const box = e.currentTarget.getBoundingClientRect(); if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) setPrepared(null); } }}>
        <button type="button" className="close-modal" aria-label="Cerrar" onClick={() => setPrepared(null)}>×</button>
        <div className="modal-glyph" aria-hidden="true">✧</div><div className="modal-eyebrow">TU MENSAJE ESTÁ LISTO</div>
        <h3 id="rsvp-modal-title">{attending ? "¡Nos vemos pronto!" : "Tu cariño también cuenta."}</h3>
        <p>{attending ? "Un recuerdo extraordinario empieza con quienes están presentes." : "Preparamos tus palabras para Camila."}</p>
        <div className="message-preview" tabIndex={0}>{prepared?.message}</div>
        <div className="modal-actions"><button type="button" onClick={copyMessage}>Copiar mensaje</button><a href={prepared?.url} target="_blank" rel="noopener noreferrer">Abrir WhatsApp ↗</a></div>
        <p className="hint" role="status">{copyStatus}</p>
        <p className="hint">Tu respuesta se comparte cuando envías el mensaje por WhatsApp.</p>
      </dialog>
    </div>
  );
}
