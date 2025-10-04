import React, { useState } from "react";
import API_BASE_URL from "../../../config/apiConfig";

export default function PrescriptionForm({ patient, closeForm }) {
  const [rx, setRx] = useState({
    numeroOrdonnance: "",
    dateValidite: "",
    note: "",
    lignes: [
      {
        nomMedicament: "",
        dosage: "",
        posologie: "",
        duree: "",
        instructions: "",
      },
    ],
  });
  const [rxLoading, setRxLoading] = useState(false);
  const [rxError, setRxError] = useState(null);
  const [rxResult, setRxResult] = useState(null);

  const setRxLigne = (idx, key, value) =>
    setRx((s) => ({
      ...s,
      lignes: s.lignes.map((ln, i) =>
        i === idx ? { ...ln, [key]: value } : ln
      ),
    }));

  const addRxLigne = () =>
    setRx((s) => ({
      ...s,
      lignes: [
        ...s.lignes,
        {
          nomMedicament: "",
          dosage: "",
          posologie: "",
          duree: "",
          instructions: "",
        },
      ],
    }));

  const removeRxLigne = (idx) =>
    setRx((s) => ({ ...s, lignes: s.lignes.filter((_, i) => i !== idx) }));

  const submitPrescription = async (e) => {
    e?.preventDefault();
    if (!patient?.id) {
      alert("Patient introuvable.");
      return;
    }
    if (!rx.lignes?.length) {
      alert("Ajoutez au moins une ligne.");
      return;
    }
    const hasInvalid = rx.lignes.some(
      (ln) =>
        !ln.nomMedicament?.trim() ||
        !ln.dosage?.trim() ||
        !ln.posologie?.trim() ||
        (ln.duree !== "" && (isNaN(Number(ln.duree)) || Number(ln.duree) < 0))
    );
    if (hasInvalid) {
      alert(
        "Chaque ligne doit contenir au minimum: médicament, dosage, posologie. Durée ≥ 0 si renseignée."
      );
      return;
    }

    setRxLoading(true);
    setRxError(null);
    setRxResult(null);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        patientId: Number(patient.id),
        numeroOrdonnance: rx.numeroOrdonnance || undefined,
        dateValidite: rx.dateValidite || undefined,
        note: rx.note || undefined,
        lignes: rx.lignes.map((ln) => ({
          nomMedicament: ln.nomMedicament.trim(),
          dosage: ln.dosage.trim(),
          posologie: ln.posologie.trim(),
          duree:
            ln.duree === "" || ln.duree === null || ln.duree === undefined
              ? 0
              : Number(ln.duree),
          instructions: (ln.instructions || "").trim(),
        })),
      };

      const res = await fetch(`${API_BASE_URL}/api/ordonnances`, {
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
      setRxResult(data);
      window.open(`${API_BASE_URL}/api/ordonnances/${data.id}/pdf`, "_blank");
    } catch (err) {
      setRxError(err.message || "Erreur inconnue");
    } finally {
      setRxLoading(false);
    }
  };

  return (
    <form onSubmit={submitPrescription} className="vstack gap-3">
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
      <div className="row g-2">
        <div className="col-md-6">
          <label className="form-label">N° ordonnance (optionnel)</label>
          <input
            className="form-control"
            value={rx.numeroOrdonnance}
            onChange={(e) =>
              setRx((s) => ({ ...s, numeroOrdonnance: e.target.value }))
            }
            placeholder="ex: ORD-2025-0001"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Valable jusqu’au (optionnel)</label>
          <input
            type="date"
            className="form-control"
            value={rx.dateValidite}
            onChange={(e) =>
              setRx((s) => ({ ...s, dateValidite: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="m-0">Lignes de prescription</h6>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={addRxLigne}
        >
          <i className="bi bi-plus"></i> Ajouter une ligne
        </button>
      </div>
      {rx.lignes.map((ln, i) => (
        <div className="row g-2 align-items-end mt-1" key={i}>
          <div className="col-md-4">
            <label className="form-label">Médicament</label>
            <input
              className="form-control"
              value={ln.nomMedicament}
              onChange={(e) => setRxLigne(i, "nomMedicament", e.target.value)}
              placeholder="ex: Amoxicilline"
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Dosage</label>
            <input
              className="form-control"
              value={ln.dosage}
              onChange={(e) => setRxLigne(i, "dosage", e.target.value)}
              placeholder="ex: 500 mg"
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Posologie</label>
            <input
              className="form-control"
              value={ln.posologie}
              onChange={(e) => setRxLigne(i, "posologie", e.target.value)}
              placeholder="ex: 2 fois/jour"
              required
            />
          </div>
          <div className="col-md-1">
            <label className="form-label">Durée</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={ln.duree}
              onChange={(e) => setRxLigne(i, "duree", e.target.value)}
              placeholder="jrs"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Instructions</label>
            <input
              className="form-control"
              value={ln.instructions}
              onChange={(e) => setRxLigne(i, "instructions", e.target.value)}
              placeholder="ex: après repas"
            />
          </div>
          <div className="col-md-12 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => removeRxLigne(i)}
              disabled={rx.lignes.length === 1}
              title="Supprimer la ligne"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      ))}
      <div className="mt-2">
        <label className="form-label">Observations / Note (optionnelle)</label>
        <textarea
          className="form-control"
          rows="2"
          value={rx.note}
          onChange={(e) => setRx((s) => ({ ...s, note: e.target.value }))}
        />
      </div>
      {rxError && <div className="alert alert-danger">{rxError}</div>}
      {rxResult && (
        <div className="alert alert-success">
          Ordonnance <strong>{rxResult.numeroOrdonnance ?? rxResult.id}</strong>{" "}
          créée.
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
          onClick={submitPrescription}
          disabled={
            rxLoading ||
            !rx.lignes?.length ||
            rx.lignes.some(
              (ln) =>
                !ln.nomMedicament?.trim() ||
                !ln.dosage?.trim() ||
                !ln.posologie?.trim() ||
                (ln.duree !== "" &&
                  (isNaN(Number(ln.duree)) || Number(ln.duree) < 0))
            )
          }
        >
          {rxLoading ? "Création…" : "Créer la prescription"}
        </button>
      </div>
    </form>
  );
}
