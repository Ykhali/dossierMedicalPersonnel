import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";

export default function FactureForm() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [tvaPct, setTvaPct] = useState(20);
  const [remisePct, setRemisePct] = useState(0);
  const [delai, setDelai] = useState(15);
  const [note, setNote] = useState("");
  const [items, setItems] = useState([
    { designation: "", quantite: 1, prixUnitaire: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${API_BASE_URL}/api/patients/light`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (resp.ok) setPatients(await resp.json());
      } catch {}
    })();
  }, []);

  const addLine = () =>
    setItems([...items, { designation: "", quantite: 1, prixUnitaire: 0 }]);
  const rmLine = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateLine = (i, key, val) => {
    const arr = [...items];
    arr[i] = { ...arr[i], [key]: key === "designation" ? val : Number(val) };
    setItems(arr);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const body = {
        patientId: Number(patientId),
        tvaPct: Number(tvaPct),
        remisePct: Number(remisePct),
        delaiEcheanceJours: Number(delai),
        note,
        items: items.map((it) => ({
          designation: it.designation,
          quantite: Number(it.quantite),
          prixUnitaire: Number(it.prixUnitaire),
        })),
      };
      const resp = await fetch(`${API_BASE_URL}/api/factures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h3>Créer une facture</h3>
      <form onSubmit={submit} className="card p-3">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Patient</label>
            <select
              className="form-select"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              <option value="">-- Sélectionner --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomComplet || p.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">TVA %</label>
            <input
              type="number"
              className="form-control"
              value={tvaPct}
              onChange={(e) => setTvaPct(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Remise %</label>
            <input
              type="number"
              className="form-control"
              value={remisePct}
              onChange={(e) => setRemisePct(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Échéance (jours)</label>
            <input
              type="number"
              className="form-control"
              value={delai}
              onChange={(e) => setDelai(e.target.value)}
            />
          </div>
        </div>

        <hr />

        <h6>Lignes</h6>
        {items.map((it, i) => (
          <div className="row g-2 align-items-end mb-2" key={i}>
            <div className="col-md-6">
              <label className="form-label">Désignation</label>
              <input
                className="form-control"
                value={it.designation}
                onChange={(e) => updateLine(i, "designation", e.target.value)}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Qté</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={it.quantite}
                onChange={(e) => updateLine(i, "quantite", e.target.value)}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">PU HT</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={it.prixUnitaire}
                onChange={(e) => updateLine(i, "prixUnitaire", e.target.value)}
                required
              />
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button
                className="btn btn-outline-danger w-100"
                type="button"
                onClick={() => rmLine(i)}
                disabled={items.length === 1}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}
        <button
          className="btn btn-outline-primary mb-3"
          type="button"
          onClick={addLine}
        >
          <i className="bi bi-plus"></i> Ajouter une ligne
        </button>

        <div className="mb-3">
          <label className="form-label">Note (optionnelle)</label>
          <textarea
            className="form-control"
            rows="2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Création…" : "Créer la facture + PDF"}
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {result && (
          <div className="alert alert-success mt-3">
            Facture <strong>{result.numero}</strong> créée.{" "}
            <a
              href={API_BASE_URL + result.pdfUrl}
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir le PDF
            </a>
            <div>
              <small className="text-muted">
                La facture a été envoyée à la réceptionniste.
              </small>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
