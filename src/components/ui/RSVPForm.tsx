import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { buildWhatsAppUrl } from "../../lib/event";
import { invitation } from "../../config/invitation";

export function RSVPForm() {
  const [error, setError] = useState("");
  const [prepared, setPrepared] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const url = buildWhatsAppUrl(
        String(data.get("name") ?? ""),
        Number(data.get("count")),
      );
      window.open(url, "_blank", "noopener,noreferrer");
      setError("");
      setPrepared(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Revisa tus datos.");
    }
  }
  return (
    <form className="rsvp-form" onSubmit={submit} data-reveal>
      <label htmlFor="guest-name">
        Tu nombre
        <input
          id="guest-name"
          name="name"
          autoComplete="name"
          required
          maxLength={100}
          placeholder="Nombre y apellido"
          onChange={() => setPrepared("")}
        />
      </label>
      <label htmlFor="guest-count">
        Total de asistentes, incluyéndote
        <input
          id="guest-count"
          name="count"
          inputMode="numeric"
          type="number"
          min={1}
          step={1}
          {...(invitation.maxGuests ? { max: invitation.maxGuests } : {})}
          defaultValue={1}
          required
          onChange={() => setPrepared("")}
        />
      </label>
      <button className="button button-gold" type="submit">
        Confirmar por WhatsApp <ArrowUpRight size={17} />
      </button>
      <p className="form-note">
        Envía el mensaje en WhatsApp para completar tu confirmación.
      </p>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      {prepared ? (
        <p role="status" className="form-note">
          La confirmación se completa al enviar el mensaje. Si WhatsApp no se
          abrió,{" "}
          <a href={prepared} target="_blank" rel="noopener noreferrer">
            abre tu mensaje aquí
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
