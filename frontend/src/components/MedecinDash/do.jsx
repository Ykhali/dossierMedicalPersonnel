import React, { useState, useEffect } from "react";
import "./DossierPatient.css";
import API_BASE_URL from "../../config/apiConfig";
import { Modal } from "bootstrap";

// ----------------- Utils -----------------

// cache simple d'objectURLs pour la photo
const photoCache = new Map();

// headers avec JWT
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  };
}

// rafraîchissement basique (remplace par un refetch local si tu veux éviter le reload)
function reload() {
  window.location.reload();
}

// formatages pour le modal Détails
const fmtBool = (v) => (v === true ? "Oui" : v === false ? "Non" : "");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "");

// ----------------- Composants -----------------

/** Affiche la photo protégée du patient (ou un cadre "photo" en fallback) */
function PhotoSecure({ patientId, alt, size = 96, rounded = 12 }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    setSrc(null);
    if (!patientId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = `${API_BASE_URL}/api/Medecin/patients/${patientId}/image`;

    const cached = photoCache.get(url);
    if (cached) {
      setSrc(cached);
      return;
    }

    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ctrl.signal,
        });
        if (!res.ok) return; // 404 = pas de photo -> fallback
        const blob = await res.blob();
        const obj = URL.createObjectURL(blob);
        photoCache.set(url, obj);
        setSrc(obj);
      } catch {
        /* noop */
      }
    })();

    return () => ctrl.abort();
  }, [patientId]);

  const box = {
    width: size,
    height: size,
    objectFit: "cover",
    borderRadius: rounded,
  };

  if (src)
    return <img src={src} alt={alt} style={box} onError={() => setSrc(null)} />;

  return (
    <div
      className="d-flex align-items-center justify-content-center text-muted bg-light"
      style={{ ...box, border: "1px solid #e5e5e5" }}
    >
      photo
    </div>
  );
}

// ----------------- API Helpers (Allergies/Maladies) -----------------

async function deleteAllergie(allergieId) {
  if (!allergieId) return;
  if (!window.confirm("Supprimer cette allergie ?")) return;
  const res = await fetch(
    `${API_BASE_URL}/api/Medecin/patients/allergies/${allergieId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );
  res.ok ? reload() : alert("Suppression impossible.");
}

async function deleteMaladie(maladieId) {
  if (!maladieId) return;
  if (!window.confirm("Supprimer cette maladie ?")) return;
  const res = await fetch(
    `${API_BASE_URL}/api/Medecin/patients/maladies/${maladieId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );
  res.ok ? reload() : alert("Suppression impossible.");
}

async function deleteSigneVital(id) {
  if (!id) return;
  if (!confirm("Supprimer ce signe vital ?")) return;
  const res = await fetch(
    `${API_BASE_URL}/api/Medecin/patients/signeVitaux/${id}`,
    { method: "DELETE", headers: authHeaders() }
  );
  res.ok ? reload() : alert("Suppression impossible.");
}

// ----------------- DossierPatient -----------------

export default function DossierPatient({
  patient = {},
  allergies = [],
  maladies = [],
  traitements = [],
  signesVitaux = [],
  examens = [],
  documents = [],
}) {
  // ---- Etat du modal Détails ----
  const [detailItem, setDetailItem] = useState(null); // objet sélectionné
  const [detailType, setDetailType] = useState(null); // "allergie" | "maladie"

  // ---- Etat modal Form (create/edit) ----
  const [formType, setFormType] = useState(null); // "allergie" | "maladie"
  const [formMode, setFormMode] = useState(null); // "create" | "edit"
  const [formData, setFormData] = useState({}); // champs du formulaire

  // ==== FACTURE: états & handlers (simplifié : montant + note) ====
  // const [invoice, setInvoice] = useState({
  //   montant: 0,
  //   note: "",
  // });
  // const [invLoading, setInvLoading] = useState(false);
  // const [invError, setInvError] = useState(null);
  // const [invResult, setInvResult] = useState(null);

  // function openInvoiceForm() {
  //   setInvoice({ montant: 0, note: "" });
  //   setInvError(null);
  //   setInvResult(null);
  //   const el = document.getElementById("invoiceModal");
  //   if (el) new Modal(el).show();
  // }

  // function closeInvoiceForm() {
  //   const el = document.getElementById("invoiceModal");
  //   if (el) Modal.getInstance(el)?.hide();
  // }

  // async function submitInvoice(e) {
  //   e?.preventDefault();
  //   if (!patient?.id) {
  //     alert("Patient introuvable.");
  //     return;
  //   }
  //   if (Number(invoice.montant) <= 0) {
  //     alert("Veuillez saisir un montant strictement positif.");
  //     return;
  //   }
  //   setInvLoading(true);
  //   setInvError(null);
  //   setInvResult(null);

  //   try {
  //     const token = localStorage.getItem("token");
  //     const payload = {
  //       patientId: Number(patient.id),
  //       montant: Number(invoice.montant),
  //       notes: invoice.note,
  //     };

  //     const res = await fetch(`${API_BASE_URL}/api/factures`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token || ""}`,
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(payload),
  //     });

  //     if (!res.ok) {
  //       const txt = await res.text().catch(() => "");
  //       throw new Error(txt || `HTTP ${res.status}`);
  //     }
  //     const data = await res.json();
  //     setInvResult(data);

  //     // Ouvrir le PDF généré immédiatement
  //     window.open(`${API_BASE_URL}/api/factures/${data.id}/pdf`, "_blank");
  //   } catch (err) {
  //     setInvError(err.message || "Erreur inconnue");
  //   } finally {
  //     setInvLoading(false);
  //   }
  // }
  const [invoice, setInvoice] = useState({
    note: "",
    lignes: [{ description: "", prix: "" }],
  });
  const [invLoading, setInvLoading] = useState(false);
  const [invError, setInvError] = useState(null);
  const [invResult, setInvResult] = useState(null);

  function openInvoiceForm() {
    setInvoice({ note: "", lignes: [{ description: "", prix: "" }] });
    setInvError(null);
    setInvResult(null);
    const el = document.getElementById("invoiceModal");
    if (el) new Modal(el).show();
  }

  function closeInvoiceForm() {
    const el = document.getElementById("invoiceModal");
    if (el) Modal.getInstance(el)?.hide();
  }

  // helpers lignes
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

  // total calculé
  const totalCalc = invoice.lignes.reduce((acc, ln) => {
    const v = Number(ln.prix);
    return acc + (isNaN(v) ? 0 : v);
  }, 0);

  // envoi
  async function submitInvoice(e) {
    e?.preventDefault();
    if (!patient?.id) {
      alert("Patient introuvable.");
      return;
    }

    // validations basiques
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

      // Ouvrir le PDF immédiatement (optionnel)
      window.open(`${API_BASE_URL}/api/factures/${data.id}/pdf`, "_blank");
    } catch (err) {
      setInvError(err.message || "Erreur inconnue");
    } finally {
      setInvLoading(false);
    }
  }
  // ==== /FACTURE ====

  // ==== PRESCRIPTION: états & handlers ====
  const [rx, setRx] = useState({
    numeroOrdonnance: "",
    dateValidite: "", // YYYY-MM-DD (optionnel)
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

  function openPrescriptionForm() {
    setRx({
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
    setRxError(null);
    setRxResult(null);
    const el = document.getElementById("prescriptionModal");
    if (el) new Modal(el).show();
  }

  function closePrescriptionForm() {
    const el = document.getElementById("prescriptionModal");
    if (el) Modal.getInstance(el)?.hide();
  }

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

  async function submitPrescription(e) {
    e?.preventDefault();
    if (!patient?.id) {
      alert("Patient introuvable.");
      return;
    }
    if (!rx.lignes?.length) {
      alert("Ajoutez au moins une ligne.");
      return;
    }
    // validations de base
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
        dateValidite: rx.dateValidite || undefined, // "YYYY-MM-DD"
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
      // Ouvrir le PDF de l’ordonnance (si ton endpoint existe)
      window.open(`${API_BASE_URL}/api/ordonnances/${data.id}/pdf`, "_blank");
    } catch (err) {
      setRxError(err.message || "Erreur inconnue");
    } finally {
      setRxLoading(false);
    }
  }
  // ==== /PRESCRIPTION ====

  // Construit les lignes de détails selon tes DTO backend
  function getDetailRows(item, type) {
    if (!item) return [];

    if (type === "allergie") {
      // AllergieResponse: id, label, reaction, gravite, notes, active, dateDebut
      return [
        ["Libellé", item.label],
        ["Réaction", item.reaction],
        ["Gravité", item.gravite],
        ["Notes", item.notes],
        ["Active", fmtBool(item.active)],
        ["Date de début", fmtDate(item.dateDebut)],
        ["ID", item.id],
      ];
    } else if (type === "maladie") {
      // MaladieResponse: id, label, code, systemeCode, statut, notes, dateDebut, dateFin
      return [
        ["Libellé", item.label],
        ["Code", item.code],
        ["Système de code", item.systemeCode],
        ["Statut", item.statut],
        ["Notes", item.notes],
        ["Date de début", fmtDate(item.dateDebut)],
        ["Date de fin", fmtDate(item.dateFin)],
        ["ID", item.id],
      ];
    } else {
      return null;
    }
  }

  // Ouvrir / fermer modal Détails
  function openDetails(item, type) {
    setDetailItem(item);
    setDetailType(type);
    const el = document.getElementById("detailModal");
    if (el) new Modal(el).show();
  }

  function closeDetails() {
    const el = document.getElementById("detailModal");
    if (el) Modal.getInstance(el)?.hide();
    setDetailItem(null);
    setDetailType(null);
  }

  // Ouvrir / fermer modal Form
  function openForm(type, mode, item = {}) {
    setFormType(type);
    setFormMode(mode);
    // Normaliser les champs connus pour éviter les "controlled/uncontrolled"
    if (type === "allergie") {
      setFormData({
        id: item.id ?? undefined,
        label: item.label ?? "",
        reaction: item.reaction ?? "",
        gravite: item.gravite ?? "",
        notes: item.notes ?? "",
        active: item.active ?? true,
        dateDebut: item.dateDebut ?? "", // "YYYY-MM-DD"
      });
    } else if (type === "maladie") {
      setFormData({
        id: item.id ?? undefined,
        label: item.label ?? "",
        code: item.code ?? "",
        systemeCode: item.systemeCode ?? "",
        statut: item.statut ?? "",
        notes: item.notes ?? "",
        dateDebut: item.dateDebut ?? "",
        dateFin: item.dateFin ?? "",
      });
    } else if (type === "signeVital"){
      setFormData({
        id: item.id ?? undefined,
        temperature: item.temperature ?? "",
        tension: item.tension ?? "",
        frequenceRespiratoire: item.frequenceRespiratoire ?? "",
        saturationOxygene: item.saturationOxygene ?? "",
        poids: item.poids ?? "",
        taille: item.taille ?? "",
        commentaire: item.commentaire ?? "",
      });
    }
    const el = document.getElementById("formModal");
    if (el) new Modal(el).show();
  }

  function closeForm() {
    const el = document.getElementById("formModal");
    if (el) Modal.getInstance(el)?.hide();
    setFormType(null);
    setFormMode(null);
    setFormData({});
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((d) => ({
      ...d,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function submitForm() {
    if (!formType || !formMode) return;
    if (!patient?.id && formMode === "create") {
      alert("Patient introuvable ");
      return;
    }

    const isAllergie = formType === "allergie";
    //const endpointBase = isAllergie ? "allergies" : "maladies";
    const endpointBase =
      formType === "allergie"
        ? "allergies"
        : formType === "maladie"
        ? "maladies"
        : "signeVitaux";

    let url = "";
    let method = "";

    if (formMode === "create") {
      url = `${API_BASE_URL}/api/Medecin/patients/${patient.id}/${endpointBase}`;
      method = "POST";
    } else if (formMode === "edit") {
      url = `${API_BASE_URL}/api/Medecin/patients/${endpointBase}/${formData.id}`;
      method = "PATCH";
    }

    // corps à envoyer : on enlève les champs vides pour éviter d’écraser
    const body = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (k === "id") return;
      if (v !== "" && v !== undefined) body[k] = v;
    });

    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    if (res.ok) {
      closeForm();
      reload();
    } else {
      const txt = await res.text().catch(() => "");
      alert(`Erreur lors de la sauvegarde\n${txt}`);
    }
  }

  const p = patient;

  return (
    <div className="dossier-wrap container-fluid py-3">
      <div className="row g-3">
        {/* ========= Colonne gauche ========= */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-3 h-100">
            {/* Identité */}
            <div className="card border-0 shadow-sm rounded-4 flex-shrink-0">
              <div className="card-header bg-white border-0 pb-0">
                <h6 className="m-0 text-med fw-semibold">
                  Dossier Médical — Id : {p?.id ?? "—"}
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3">
                  <div className="photo-box border rounded-3 d-flex align-items-center justify-content-center overflow-hidden mb-2 mb-sm-0 me-sm-2">
                    <PhotoSecure
                      patientId={p?.id}
                      alt={`${p?.nom ?? ""} ${p?.prenom ?? ""}`}
                      size={96}
                      rounded={12}
                    />
                  </div>

                  <div className="flex-grow-1 small text-center text-sm-start">
                    <div className="fw-semibold">
                      {p?.nom ?? "Nom"} {p?.prenom ?? "Prénom"}
                    </div>
                    <div>CIN : {p?.cin ?? "—"}</div>
                    <div>Né le : {p?.dateNaissance ?? "—"}</div>
                    <div>Téléphone : {p?.telephone ?? "—"}</div>
                    <div className="text-break">Email : {p?.email ?? "—"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="card border-0 shadow-sm rounded-4 flex-shrink-0">
              <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
                <h6 className="m-0">Allergies</h6>
                <button
                  type="button"
                  className="btn btn-add"
                  title="Ajouter une allergie"
                  onClick={() => openForm("allergie", "create")}
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>
              <div className="card-body small">
                {allergies?.length ? (
                  <ul className="m-0 ps-3">
                    {allergies.map((a, i) => (
                      <li
                        key={a.id ?? i}
                        className="d-flex align-items-center justify-content-between py-1 border-bottom"
                      >
                        <span>{a.label ?? a}</span>
                        <div className="btn-group btn-group-sm gap-1">
                          {/* Détails */}
                          <button
                            type="button"
                            className="btn-med btn-detail"
                            title="Détails"
                            onClick={() => openDetails(a, "allergie")}
                          >
                            <i className="bi bi-info-circle"></i>
                          </button>
                          {/* Modifier */}
                          <button
                            type="button"
                            className="btn-med btn-edit"
                            title="Modifier"
                            onClick={() => openForm("allergie", "edit", a)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          {/* Supprimer */}
                          <button
                            type="button"
                            className="btn-med btn-delete"
                            title="Supprimer"
                            onClick={() => deleteAllergie(a.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted">Aucune allergie renseignée.</div>
                )}
              </div>
            </div>

            {/* Maladies */}
            <div className="card border-0 shadow-sm rounded-4 flex-grow-1 d-flex flex-column">
              <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
                <h6 className="m-0">Maladies</h6>
                <button
                  type="button"
                  className="btn btn-add"
                  title="Ajouter une maladie"
                  onClick={() => openForm("maladie", "create")}
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>
              <div className="card-body small overflow-auto">
                {maladies?.length ? (
                  <ul className="m-0 ps-3">
                    {maladies.map((m, i) => (
                      <li
                        key={m.id ?? i}
                        className="d-flex align-items-center justify-content-between py-1 border-bottom"
                      >
                        <span>{m.label ?? m}</span>
                        <div className="btn-group btn-group-sm gap-1">
                          {/* Détails */}
                          <button
                            type="button"
                            className="btn-med btn-detail "
                            title="Détails"
                            aria-label="Afficher les détails"
                            onClick={() => openDetails(m, "maladie")}
                          >
                            <i className="bi bi-info-circle"></i>
                          </button>
                          {/* Modifier */}
                          <button
                            type="button"
                            className="btn-med btn-edit"
                            title="Modifier"
                            aria-label="Modifier"
                            onClick={() => openForm("maladie", "edit", m)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          {/* Supprimer */}
                          <button
                            type="button"
                            className="btn-med btn-delete"
                            title="Supprimer"
                            aria-label="Supprimer"
                            onClick={() => deleteMaladie(m.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted">Aucune maladie renseignée.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========= Colonne droite (grille 2×2) ========= */}
        <div className="col-12 col-lg-8 ">
          <div className="grid-2x2 h-100">
            {/* Traitements */}
            <section className="panel card border-0 shadow-sm rounded-4">
              <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
                <h6 className="m-0">Traitements en cours</h6>
                <button
                  type="button"
                  className="btn btn-add"
                  title="Ajouter un traitement"
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>
              <div className="card-body overflow-auto small">
                {traitements?.length ? (
                  <ul className="m-0 ps-3">
                    {traitements.map((t) => (
                      <li key={t.id ?? `${t.nom}-${t.debut}`}>
                        <span className="fw-semibold">{t.nom ?? "—"}</span>
                        {t.posologie ? ` • ${t.posologie}` : ""}{" "}
                        {t.debut || t.fin ? (
                          <span className="text-muted">
                            ({t.debut ?? "?"} → {t.fin ?? "?"})
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted">— vide —</div>
                )}
              </div>
            </section>
            {/* Signes vitaux */}
            <section className="panel card border-0 shadow-sm rounded-4">
              <div className="card-header d-flex justify-content-between bg-white border-0">
                <h6 className="m-0">Signes vitaux</h6>
                <button
                  type="button"
                  className="btn btn-add"
                  title={
                    signesVitaux.length > 0
                      ? "Modifier les signes vitaux"
                      : "Ajouter les signes vitaux"
                  }
                  onClick={() =>
                    openForm(
                      "signeVital",
                      signesVitaux.length > 0 ? "edit" : "create",
                      signesVitaux[0] ?? {}
                    )
                  }
                >
                  <i
                    className={
                      signesVitaux.length > 0 ? "bi bi-pencil" : "bi bi-plus-lg"
                    }
                  ></i>
                </button>
              </div>
              <div className="card-body small overflow-auto">
                {signesVitaux?.length ? (
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Température</th>
                        <th>Tension</th>
                        <th>FR</th>
                        <th>SpO₂</th>
                        <th>Poids</th>
                        <th>Taille</th>
                        <th>Commentaire</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{signesVitaux[0].temperature ?? "—"}</td>
                        <td>{signesVitaux[0].tension ?? "—"}</td>
                        <td>{signesVitaux[0].frequenceRespiratoire ?? "—"}</td>
                        <td>{signesVitaux[0].saturationOxygene ?? "—"}</td>
                        <td>{signesVitaux[0].poids ?? "—"}</td>
                        <td>{signesVitaux[0].taille ?? "—"}</td>
                        <td>{signesVitaux[0].commentaire ?? "—"}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="text-muted">— vide —</div>
                )}
              </div>
            </section>

            
          </div>
        </div>

        {/* Boutons bas de page */}
        <div className="d-flex column mb-3 gap-2 ">
          <button
            className="btn btn-outline-info flex-grow-1"
            onClick={openInvoiceForm}
            type="button"
          >
            Créer facture
          </button>
          <button
            className="btn btn-outline-info flex-grow-1"
            type="button"
            onClick={openPrescriptionForm}
          >
            Créer prescription
          </button>
        </div>
      </div>

      {/* ===== Modal Détails ===== */}
      <div
        className="modal fade"
        id="detailModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-header">
              <h5 className="modal-title">
                {detailType === "allergie"
                  ? "Détails de l’allergie"
                  : detailType === "maladie"
                  ? "Détails de la maladie"
                  : "Détails"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeDetails}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {detailItem ? (
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <tbody>
                      {getDetailRows(detailItem, detailType)
                        .filter(
                          ([_, v]) =>
                            v !== undefined &&
                            v !== null &&
                            String(v).trim() !== ""
                        )
                        .map(([k, v]) => (
                          <tr key={k}>
                            <th
                              style={{ width: "40%" }}
                              className="text-muted fw-normal"
                            >
                              {k}
                            </th>
                            <td>{String(v)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted">Aucun détail à afficher.</div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDetails}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ===== /Modal Détails ===== */}

      {/* ===== Modal Form Allergie/Maladie/ signeVital ===== */}
      <div
        className="modal fade"
        id="formModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-header">
            
              <h5 className="modal-title">
                {formMode === "create" ? "Ajouter" : "Modifier"}{" "}
                {formType === "allergie"
                  ? "une allergie"
                  : formType === "maladie"
                  ? "une maladie"
                  : "les signes vitaux"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeForm}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {formType && (
                <form className="vstack gap-3">
                  {formType === "allergie" && (
                    <>
                      <div>
                        <label className="form-label">Libellé</label>
                        <input
                          type="text"
                          className="form-control"
                          name="label"
                          value={formData.label || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">Réaction</label>
                        <input
                          type="text"
                          className="form-control"
                          name="reaction"
                          value={formData.reaction || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">Gravité</label>
                        <input
                          type="text"
                          className="form-control"
                          name="gravite"
                          value={formData.gravite || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="allergie-active"
                          name="active"
                          checked={!!formData.active}
                          onChange={handleFormChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="allergie-active"
                        >
                          Active
                        </label>
                      </div>
                      <div>
                        <label className="form-label">Date de début</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateDebut"
                          value={formData.dateDebut || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                    </>
                  )}

                  {formType === "maladie" && (
                    <>
                      <div>
                        <label className="form-label">Libellé</label>
                        <input
                          type="text"
                          className="form-control"
                          name="label"
                          value={formData.label || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="code"
                          value={formData.code || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">Système de code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="systemeCode"
                          value={formData.systemeCode || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">Statut</label>
                        <input
                          type="text"
                          className="form-control"
                          name="statut"
                          value={formData.statut || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">Date de début</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateDebut"
                          value={formData.dateDebut || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">Date de fin</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateFin"
                          value={formData.dateFin || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">Notes</label>
                        <textarea
                          className="form-control"
                          name="notes"
                          rows={3}
                          value={formData.notes || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                    </>
                  )}
                  {formType === "signeVital" && (
                    <>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control mb-2"
                        name="temperature"
                        placeholder="Température °C"
                        value={formData.temperature}
                        onChange={handleFormChange}
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="tension"
                        placeholder="Tension (ex: 120/80)"
                        value={formData.tension}
                        onChange={handleFormChange}
                      />
                      <input
                        type="number"
                        className="form-control mb-2"
                        name="frequenceRespiratoire"
                        placeholder="Fréquence respiratoire"
                        value={formData.frequenceRespiratoire}
                        onChange={handleFormChange}
                      />
                      <input
                        type="number"
                        step="0.1"
                        className="form-control mb-2"
                        name="saturationOxygene"
                        placeholder="SpO₂ %"
                        value={formData.saturationOxygene}
                        onChange={handleFormChange}
                      />
                      <input
                        type="number"
                        step="0.1"
                        className="form-control mb-2"
                        name="poids"
                        placeholder="Poids kg"
                        value={formData.poids}
                        onChange={handleFormChange}
                      />
                      <input
                        type="number"
                        step="0.1"
                        className="form-control mb-2"
                        name="taille"
                        placeholder="Taille cm"
                        value={formData.taille}
                        onChange={handleFormChange}
                      />
                      <textarea
                        className="form-control"
                        name="commentaire"
                        placeholder="Commentaire"
                        value={formData.commentaire}
                        onChange={handleFormChange}
                      />
                    </>
                  )}
                </form>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeForm}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitForm}
              >
                {formMode === "create" ? "Créer" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ===== /Modal Form ===== */}
      
    </div>
  );
}
