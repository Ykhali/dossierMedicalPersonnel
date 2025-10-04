import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";

export default function ResetPassword() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [validating, setValidating] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function validate() {
      try {
        const r = await fetch(`${API_BASE_URL}/auth/reset-password/validate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        });
        if (!r.ok) throw new Error();
      } catch {
        setInvalid(true);
      } finally {
        setValidating(false);
      }
    }
    validate();
  }, [email, token]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword: pwd }),
      });
      if (!r.ok) throw new Error();
      setDone(true);
    } catch {
      alert(
        "Erreur lors de la réinitialisation. Réessayez avec un nouveau lien."
      );
    } finally {
      setBusy(false);
    }
  };

  if (validating) {
    return (
      <div className="container py-5">
        <div className="text-center">Vérification du lien…</div>
      </div>
    );
  }
  if (invalid) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: 420 }}>
          Lien invalide ou expiré. Relancez “Mot de passe oublié ?” pour obtenir
          un nouveau lien.
        </div>
      </div>
    );
  }
  if (done) {
    return (
      <div className="container py-5">
        <div className="alert alert-success mx-auto" style={{ maxWidth: 420 }}>
          Mot de passe mis à jour. Vous pouvez vous connecter maintenant.
        </div>
      </div>
    );
  }

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <form
        onSubmit={submit}
        className="card shadow p-4 w-100"
        style={{ maxWidth: 420 }}
      >
        <h5 className="mb-3">Nouveau mot de passe</h5>
        <div className="mb-2 text-muted small">
          Compte: <strong>{email}</strong>
        </div>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Nouveau mot de passe (min. 8 caractères)"
          value={pwd}
          minLength={8}
          onChange={(e) => setPwd(e.target.value)}
          required
          disabled={busy}
        />
        <button className="btn btn-success w-100" disabled={busy}>
          {busy ? "Mise à jour…" : "Réinitialiser"}
        </button>
      </form>
    </div>
  );
}
