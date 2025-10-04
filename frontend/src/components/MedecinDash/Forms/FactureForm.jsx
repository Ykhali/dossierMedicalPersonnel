import React, { useState } from "react";
import API_BASE_URL from "../../../config/apiConfig";

export default function FactureForm({ patient, closeForm }) {
  const [invoice, setInvoice] = useState({
    note: "",
    lignes: [{ description: "", prix: "" }],
  });
  const [invLoading, setInvLoading] = useState(false);
  const [invError, setInvError] = useState(null);
  const [invResult, setInvResult] = useState(null);

  const setLigne = (idx, key, value) =>
    setInvoice((s) => ({
      ...s,
      lignes: s.lignes.map((ln, i) =>
        i === idx ? { ...ln, [key]: value } : ln
      ),
    }));

  const addLigne = () =>
    setInvoice((s) => ({
      ...s,
      lignes: [...s.lignes, { description: "", prix: "" }],
    }));

  const removeLigne = (idx) =>
    setInvoice((s) => ({ ...s, lignes: s.lignes.filter((_, i) => i !== idx) }));

  const totalCalc = invoice.lignes.reduce((acc, ln) => {
    const v = Number(ln.prix);
    return acc + (isNaN(v) ? 0 : v);
  }, 0);

  const submitInvoice = async (e) => {
    e?.preventDefault();
    if (!patient?.id) {
      alert("Patient introuvable.");
      return;
    }
    if (!invoice.lignes?.length) {
      alert("Ajoutez au moins une ligne.");
      return;
    }
    const hasInvalid = invoice.lignes.some(
      (ln) => !ln.description || Number(ln.prix) <= 0 || isNaN(Number(ln.prix))
    );
    if (hasInvalid) {
      alert("Chaque ligne doit avoir une description et un prix > 0.");
      return;
    }

    setInvLoading(true);
    setInvError(null);
    setInvResult(null);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        patientId: Number(patient.id),
        notes: invoice.note,
        lignes: invoice.lignes.map((ln) => ({
          description: ln.description,
          prix: Number(ln.prix),
        })),
      };

      const res = await fetch(`${API_BASE_URL}/api/factures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setInvResult(data);
      window.open(`${API_BASE_URL}/api/factures/${data.id}/pdf`, "_blank");
    } catch (err) {
      setInvError(err.message || "Erreur inconnue");
    } finally {
      setInvLoading(false);
    }
  };

  return (
    <form onSubmit={submitInvoice} className="vstack gap-3">
      <div
        className="alert alert-light border d-flex align-items-center"
        role="alert"
      >
        <i className="bi bi-person-badge me-2"></i>
        <div>
          <div className="small text-muted">Patient</div>
          <div className="fw-semibold">
            {patient?.nom ?? "Nom"} {patient?.prenom ?? "Prénom"}{" "}
            {patient?.id ? `(ID: ${patient.id})` : ""}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="m-0">Lignes</h6>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={addLigne}
        >
          <i className="bi bi-plus"></i> Ajouter une ligne
        </button>
      </div>
      {invoice.lignes.map((ln, i) => (
        <div className="row g-2 align-items-end mt-1" key={i}>
          <div className="col-md-7">
            <label className="form-label">Description</label>
            <input
              className="form-control"
              value={ln.description}
              onChange={(e) => setLigne(i, "description", e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Prix (MAD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={ln.prix}
              onChange={(e) => setLigne(i, "prix", e.target.value)}
              required
            />
          </div>
          <div className="col-md-2 d-grid">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => removeLigne(i)}
              disabled={invoice.lignes.length === 1}
              title="Supprimer la ligne"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      ))}
      <div className="mt-2">
        <label className="form-label">Note (optionnelle)</label>
        <textarea
          className="form-control"
          rows="2"
          value={invoice.note}
          onChange={(e) => setInvoice((s) => ({ ...s, note: e.target.value }))}
        />
      </div>
      <div className="d-flex justify-content-end">
        <div className="fs-5">
          Total : <strong>{Number(totalCalc).toFixed(2)} MAD</strong>
        </div>
      </div>
      {invError && <div className="alert alert-danger">{invError}</div>}
      {invResult && (
        <div className="alert alert-success">
          Facture <strong>{invResult.numero}</strong> créée.
          <div className="small text-muted">
            La réceptionniste peut l’imprimer et la cacheter.
          </div>
        </div>
      )}
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={closeForm}>
          Fermer
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={submitInvoice}
          disabled={
            invLoading ||
            !invoice.lignes?.length ||
            invoice.lignes.some(
              (ln) =>
                !ln.description ||
                Number(ln.prix) <= 0 ||
                isNaN(Number(ln.prix))
            )
          }
        >
          {invLoading ? "Création…" : "Créer la facture"}
        </button>
      </div>
    </form>
  );
}
