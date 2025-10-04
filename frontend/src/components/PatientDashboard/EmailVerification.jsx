import { useState } from "react";
import API_BASE_URL from "../../config/apiConfig";

export default function EmailVerification({ email, emailVerifiedAt }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(!!emailVerifiedAt);

  const sendCode = async () => {
    setBusy(true);
    await fetch(`${API_BASE_URL}/auth/email-otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).finally(() => setBusy(false));
    setSent(true);
  };

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true);
    const r = await fetch(`${API_BASE_URL}/auth/email-otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    setBusy(false);
    if (r.ok) setVerified(true);
    else alert("Code invalide ou expiré");
  };

  if (verified) {
    return (
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted">{email}</span>
        <span className="badge bg-success">Vérifié</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="text-muted">{email}</span>
        <span className="badge bg-warning text-dark">Non vérifié</span>
        <button className="btn btn-link p-0" onClick={sendCode} disabled={busy}>
          {busy ? "Envoi..." : sent ? "Renvoyer le code" : "Vérifier l’e-mail"}
        </button>
      </div>

      {sent && (
        <form className="d-flex gap-2" onSubmit={verify}>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            className="form-control"
            placeholder="Code à 6 chiffres"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
          />
          <button className="btn btn-primary" disabled={busy}>
            Valider
          </button>
        </form>
      )}
    </div>
  );
}
