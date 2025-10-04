// import React, { useState, useEffect } from "react";
// import "./DossierPatient.css";
// import API_BASE_URL from "../../config/apiConfig";
// import { Modal } from "bootstrap";
// import AllergieForm from "./Forms/AllergieForm";
// import MaladieForm from "./Forms/MaladieForm";
// import SigneVitalForm from "./Forms/SigneVitalForm";
// import FactureForm from "./Forms/FactureForm";
// import PrescriptionForm from "./Forms/PrescriptionForm";

// // ----------------- Utils -----------------

// const photoCache = new Map();

// const authHeaders = () => ({
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// });

// function reload() {
//   window.location.reload();
// }

// const fmtBool = (v) => (v === true ? "Oui" : v === false ? "Non" : "");
// const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "");

// // ----------------- Composants -----------------

// function PhotoSecure({ patientId, alt, size = 96, rounded = 12 }) {
//   const [src, setSrc] = useState(null);

//   useEffect(() => {
//     setSrc(null);
//     if (!patientId) return;
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const url = `${API_BASE_URL}/api/Medecin/patients/${patientId}/image`;

//     const cached = photoCache.get(url);
//     if (cached) {
//       setSrc(cached);
//       return;
//     }

//     const ctrl = new AbortController();
//     (async () => {
//       try {
//         const res = await fetch(url, {
//           headers: { Authorization: `Bearer ${token}` },
//           signal: ctrl.signal,
//         });
//         if (!res.ok) return;
//         const blob = await res.blob();
//         const obj = URL.createObjectURL(blob);
//         photoCache.set(url, obj);
//         setSrc(obj);
//       } catch {
//         /* noop */
//       }
//     })();

//     return () => ctrl.abort();
//   }, [patientId]);

//   const box = {
//     width: size,
//     height: size,
//     objectFit: "cover",
//     borderRadius: rounded,
//   };

//   if (src)
//     return <img src={src} alt={alt} style={box} onError={() => setSrc(null)} />;

//   return (
//     <div
//       className="d-flex align-items-center justify-content-center text-muted bg-light"
//       style={{ ...box, border: "1px solid #e5e5e5" }}
//     >
//       photo
//     </div>
//   );
// }

// // ----------------- API Helpers -----------------

// async function deleteAllergie(allergieId) {
//   if (!allergieId) return;
//   if (!window.confirm("Supprimer cette allergie ?")) return;
//   const res = await fetch(
//     `${API_BASE_URL}/api/Medecin/patients/allergies/${allergieId}`,
//     {
//       method: "DELETE",
//       headers: authHeaders(),
//     }
//   );
//   res.ok ? reload() : alert("Suppression impossible.");
// }

// async function deleteMaladie(maladieId) {
//   if (!maladieId) return;
//   if (!window.confirm("Supprimer cette maladie ?")) return;
//   const res = await fetch(
//     `${API_BASE_URL}/api/Medecin/patients/maladies/${maladieId}`,
//     {
//       method: "DELETE",
//       headers: authHeaders(),
//     }
//   );
//   res.ok ? reload() : alert("Suppression impossible.");
// }

// // ----------------- DossierPatient -----------------

// export default function DossierPatient({
//   patient = {},
//   allergies = [],
//   maladies = [],
//   traitements = [],
//   signesVitaux = [],
// }) {
//   const [currentPage, setCurrentPage] = useState("overview");
//   const [detailItem, setDetailItem] = useState(null);
//   const [detailType, setDetailType] = useState(null);
//   const [formType, setFormType] = useState(null);
//   const [formMode, setFormMode] = useState(null);
//   const [formData, setFormData] = useState({});

//   const openDetails = (item, type) => {
//     setDetailItem(item);
//     setDetailType(type);
//     const el = document.getElementById("detailModal");
//     if (el) new Modal(el).show();
//   };

//   const closeDetails = () => {
//     const el = document.getElementById("detailModal");
//     if (el) Modal.getInstance(el)?.hide();
//     setDetailItem(null);
//     setDetailType(null);
//   };

//   const openForm = (type, mode, item = {}) => {
//     setFormType(type);
//     setFormMode(mode);
//     setCurrentPage(type);
//     if (type === "allergie") {
//       setFormData({
//         id: item.id ?? undefined,
//         label: item.label ?? "",
//         reaction: item.reaction ?? "",
//         gravite: item.gravite ?? "",
//         notes: item.notes ?? "",
//         active: item.active ?? true,
//         dateDebut: item.dateDebut ?? "",
//       });
//     } else if (type === "maladie") {
//       setFormData({
//         id: item.id ?? undefined,
//         label: item.label ?? "",
//         code: item.code ?? "",
//         systemeCode: item.systemeCode ?? "",
//         statut: item.statut ?? "",
//         notes: item.notes ?? "",
//         dateDebut: item.dateDebut ?? "",
//         dateFin: item.dateFin ?? "",
//       });
//     } else if (type === "signeVital") {
//       setFormData({
//         id: item.id ?? undefined,
//         temperature: item.temperature ?? "",
//         tension: item.tension ?? "",
//         frequenceRespiratoire: item.frequenceRespiratoire ?? "",
//         saturationOxygene: item.saturationOxygene ?? "",
//         poids: item.poids ?? "",
//         taille: item.taille ?? "",
//         commentaire: item.commentaire ?? "",
//       });
//     }
//     const el = document.getElementById("formModal");
//     if (el) new Modal(el).show();
//   };

//   const closeForm = () => {
//     const el = document.getElementById("formModal");
//     if (el) Modal.getInstance(el)?.hide();
//     setFormType(null);
//     setFormMode(null);
//     setFormData({});
//     setCurrentPage("overview");
//   };

//   const handleFormChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((d) => ({
//       ...d,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const submitForm = async () => {
//     if (!formType || !formMode) return;
//     if (!patient?.id && formMode === "create") {
//       alert("Patient introuvable ");
//       return;
//     }

//     const endpointBase =
//       formType === "allergie"
//         ? "allergies"
//         : formType === "maladie"
//         ? "maladies"
//         : "signeVitaux";
//     const url =
//       formMode === "create"
//         ? `${API_BASE_URL}/api/Medecin/patients/${patient.id}/${endpointBase}`
//         : `${API_BASE_URL}/api/Medecin/patients/${endpointBase}/${formData.id}`;
//     const method = formMode === "create" ? "POST" : "PATCH";

//     const body = {};
//     Object.entries(formData).forEach(([k, v]) => {
//       if (k !== "id" && v !== "" && v !== undefined) body[k] = v;
//     });

//     const res = await fetch(url, {
//       method,
//       headers: authHeaders(),
//       body: JSON.stringify(body),
//     });

//     if (res.ok) {
//       closeForm();
//       reload();
//     } else {
//       const txt = await res.text().catch(() => "");
//       alert(`Erreur lors de la sauvegarde\n${txt}`);
//     }
//   };

//   const handleSigneSuccess = (data) => {
//     closeForm();
//     reload();
//   };

//   const getDetailRows = (item, type) => {
//     if (!item) return [];
//     if (type === "allergie") {
//       return [
//         ["Libellé", item.label],
//         ["Réaction", item.reaction],
//         ["Gravité", item.gravite],
//         ["Notes", item.notes],
//         ["Active", fmtBool(item.active)],
//         ["Date de début", fmtDate(item.dateDebut)],
//         ["ID", item.id],
//       ];
//     } else if (type === "maladie") {
//       return [
//         ["Libellé", item.label],
//         ["Code", item.code],
//         ["Système de code", item.systemeCode],
//         ["Statut", item.statut],
//         ["Notes", item.notes],
//         ["Date de début", fmtDate(item.dateDebut)],
//         ["Date de fin", fmtDate(item.dateFin)],
//         ["ID", item.id],
//       ];
//     } else if (type === "signeVital"){
//         return [
//           ["Température (°C)", item.temperature],
//           ["Tension (mmHg)", item.tension],
//           ["Fréquence respiratoire (cpm)", item.frequenceRespiratoire],
//           ["Saturation en oxygène (%)", item.saturationOxygene],
//           ["Poids (kg)", item.poids],
//           ["Taille (cm)", item.taille],
//           ["Commentaire", item.commentaire],
//           ["Date de mesure", fmtDate(item.dateMesure)],
//           ["ID", item.id],
//         ];
//     } 
//     return [];
//   };

//   const p = patient;

//   return (
//     <div className="dossier-wrap container-fluid py-3">
//       {/* Navigation */}
//       {/* <div className="mb-3">
//         <button
//           className={`btn ${
//             currentPage === "overview" ? "btn-primary" : "btn-outline-primary"
//           } me-2`}
//           onClick={() => setCurrentPage("overview")}
//         >
//           Aperçu
//         </button>
//         <button
//           className={`btn ${
//             currentPage === "allergie" ? "btn-primary" : "btn-outline-primary"
//           } me-2`}
//           onClick={() => openForm("allergie", "create")}
//         >
//           Nouvelle Allergie
//         </button>
//         <button
//           className={`btn ${
//             currentPage === "maladie" ? "btn-primary" : "btn-outline-primary"
//           } me-2`}
//           onClick={() => openForm("maladie", "create")}
//         >
//           Nouvelle Maladie
//         </button>
//         <button
//           className={`btn ${
//             currentPage === "signeVital" ? "btn-primary" : "btn-outline-primary"
//           } me-2`}
//           onClick={() =>
//             openForm(
//               "signeVital",
//               signesVitaux.length > 0 ? "edit" : "create",
//               signesVitaux[0] ?? {}
//             )
//           }
//         >
//           Signes Vitaux
//         </button>
//         <button
//           className={`btn ${
//             currentPage === "facture" ? "btn-primary" : "btn-outline-primary"
//           } me-2`}
//           onClick={() => setCurrentPage("facture")}
//         >
//           Créer Facture
//         </button>
//         <button
//           className={`btn ${
//             currentPage === "prescription"
//               ? "btn-primary"
//               : "btn-outline-primary"
//           }`}
//           onClick={() => setCurrentPage("prescription")}
//         >
//           Créer Prescription
//         </button>
//       </div> */}

//       {/* Main Content */}
//       {currentPage === "overview" && (
//         <div className="row g-3">
//           {/* Colonne gauche */}
//           <div className="col-12 col-lg-4">
//             <div className="d-flex flex-column gap-3 h-100">
//               <div className="card border-0 shadow-sm rounded-4 flex-shrink-0">
//                 <div className="card-header bg-white border-0 pb-0">
//                   <h6 className="m-0 text-med fw-semibold">
//                     Dossier Médical — Id : {p?.id ?? "—"}
//                   </h6>
//                 </div>
//                 <div className="card-body">
//                   <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3">
//                     <div className="photo-box border rounded-3 d-flex align-items-center justify-content-center overflow-hidden mb-2 mb-sm-0 me-sm-2">
//                       <PhotoSecure
//                         patientId={p?.id}
//                         alt={`${p?.nom ?? ""} ${p?.prenom ?? ""}`}
//                         size={96}
//                         rounded={12}
//                       />
//                     </div>
//                     <div className="flex-grow-1 small text-center text-sm-start">
//                       <div className="fw-semibold">
//                         {p?.nom ?? "Nom"} {p?.prenom ?? "Prénom"}
//                       </div>
//                       <div>CIN : {p?.cin ?? "—"}</div>
//                       <div>Né le : {p?.dateNaissance ?? "—"}</div>
//                       <div>Téléphone : {p?.telephone ?? "—"}</div>
//                       <div className="text-break">
//                         Email : {p?.email ?? "—"}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="card border-0 shadow-sm rounded-4 flex-shrink-0">
//                 <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
//                   <h6 className="m-0">Allergies</h6>
//                   <button
//                     type="button"
//                     className="btn btn-add"
//                     title="Ajouter une allergie"
//                     onClick={() => openForm("allergie", "create")}
//                   >
//                     <i className="bi bi-plus-lg"></i>
//                   </button>
//                 </div>
//                 <div className="card-body small">
//                   {allergies?.length ? (
//                     <ul className="m-0 ps-3">
//                       {allergies.map((a, i) => (
//                         <li
//                           key={a.id ?? i}
//                           className="d-flex align-items-center justify-content-between py-1 border-bottom"
//                         >
//                           <span>{a.label ?? a}</span>
//                           <div className="btn-group btn-group-sm gap-1">
//                             <button
//                               type="button"
//                               className="btn-med btn-detail"
//                               title="Détails"
//                               onClick={() => openDetails(a, "allergie")}
//                             >
//                               <i className="bi bi-info-circle"></i>
//                             </button>
//                             <button
//                               type="button"
//                               className="btn-med btn-edit"
//                               title="Modifier"
//                               onClick={() => openForm("allergie", "edit", a)}
//                             >
//                               <i className="bi bi-pencil"></i>
//                             </button>
//                             <button
//                               type="button"
//                               className="btn-med btn-delete"
//                               title="Supprimer"
//                               onClick={() => deleteAllergie(a.id)}
//                             >
//                               <i className="bi bi-trash"></i>
//                             </button>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <div className="text-muted">
//                       Aucune allergie renseignée.
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="card border-0 shadow-sm rounded-4 flex-grow-1 d-flex flex-column">
//                 <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
//                   <h6 className="m-0">Maladies</h6>
//                   <button
//                     type="button"
//                     className="btn btn-add"
//                     title="Ajouter une maladie"
//                     onClick={() => openForm("maladie", "create")}
//                   >
//                     <i className="bi bi-plus-lg"></i>
//                   </button>
//                 </div>
//                 <div className="card-body small overflow-auto">
//                   {maladies?.length ? (
//                     <ul className="m-0 ps-3">
//                       {maladies.map((m, i) => (
//                         <li
//                           key={m.id ?? i}
//                           className="d-flex align-items-center justify-content-between py-1 border-bottom"
//                         >
//                           <span>{m.label ?? m}</span>
//                           <div className="btn-group btn-group-sm gap-1">
//                             <button
//                               type="button"
//                               className="btn-med btn-detail"
//                               title="Détails"
//                               onClick={() => openDetails(m, "maladie")}
//                             >
//                               <i className="bi bi-info-circle"></i>
//                             </button>
//                             <button
//                               type="button"
//                               className="btn-med btn-edit"
//                               title="Modifier"
//                               onClick={() => openForm("maladie", "edit", m)}
//                             >
//                               <i className="bi bi-pencil"></i>
//                             </button>
//                             <button
//                               type="button"
//                               className="btn-med btn-delete"
//                               title="Supprimer"
//                               onClick={() => deleteMaladie(m.id)}
//                             >
//                               <i className="bi bi-trash"></i>
//                             </button>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <div className="text-muted">Aucune maladie renseignée.</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Colonne droite */}
//           <div className="col-12 col-lg-8">
//             <div className="grid-2x2 h-100">
//               <section className="panel card border-0 shadow-sm rounded-4">
//                 <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
//                   <h6 className="m-0">Traitements en cours</h6>
//                   <button
//                     type="button"
//                     className="btn btn-add"
//                     title="Ajouter un traitement"
//                   >
//                     <i className="bi bi-plus-lg"></i>
//                   </button>
//                 </div>
//                 <div className="card-body overflow-auto small">
//                   {traitements?.length ? (
//                     <ul className="m-0 ps-3">
//                       {traitements.map((t) => (
//                         <li key={t.id ?? `${t.nom}-${t.debut}`}>
//                           <span className="fw-semibold">{t.nom ?? "—"}</span>
//                           {t.posologie ? ` • ${t.posologie}` : ""}{" "}
//                           {t.debut || t.fin ? (
//                             <span className="text-muted">
//                               ({t.debut ?? "?"} → {t.fin ?? "?"})
//                             </span>
//                           ) : null}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <div className="text-muted">— vide —</div>
//                   )}
//                 </div>
//               </section>
//               <section className="panel card border-0 shadow-sm rounded-4">
//                 <div className="card-header d-flex justify-content-between bg-white border-0">
//                   <h6 className="m-0">Signes vitaux</h6>
//                   <button
//                     type="button"
//                     className="btn btn-add"
//                     title={
//                       signesVitaux.length > 0
//                         ? "Modifier les signes vitaux"
//                         : "Ajouter les signes vitaux"
//                     }
//                     onClick={() =>
//                       openForm(
//                         "signeVital",
//                         signesVitaux.length > 0 ? "edit" : "create",
//                         signesVitaux[0] ?? {}
//                       )
//                     }
//                   >
//                     <i
//                       className={
//                         signesVitaux.length > 0
//                           ? "bi bi-pencil"
//                           : "bi bi-plus-lg"
//                       }
//                     ></i>
//                   </button>
//                 </div>
//                 <div className="card-body small overflow-auto">
//                   {signesVitaux?.length ? (
//                     <table className="table table-sm">
//                       <thead>
//                         <tr>
//                           <th>Température</th>
//                           <th>Tension</th>
//                           <th>FR</th>
//                           <th>SpO₂</th>
//                           <th>Poids</th>
//                           <th>Taille</th>
//                           <th>Commentaire</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {/* <tr>
//                           <td>{signesVitaux[0].temperature ?? "—"}</td>
//                           <td>{signesVitaux[0].tension ?? "—"}</td>
//                           <td>
//                             {signesVitaux[0].frequenceRespiratoire ?? "—"}
//                           </td>
//                           <td>{signesVitaux[0].saturationOxygene ?? "—"}</td>
//                           <td>{signesVitaux[0].poids ?? "—"}</td>
//                           <td>{signesVitaux[0].taille ?? "—"}</td>
//                           <td>{signesVitaux[0].commentaire ?? "—"}</td>
//                         </tr> */}
//                         {signesVitaux.map((sv, i) => (
//                           <tr key={sv.id ?? i}>
//                             <td>{fmtDate(sv.dateMesure) || "—"}</td>
//                             <td>{sv.temperature ?? "—"}</td>
//                             <td>{sv.tension ?? "—"}</td>
//                             <td>{sv.frequenceRespiratoire ?? "—"}</td>
//                             <td>{sv.saturationOxygene ?? "—"}</td>
//                             <td>{sv.poids ?? "—"}</td>
//                             <td>{sv.taille ?? "—"}</td>
//                             <td>{sv.commentaire ?? "—"}</td>
//                             <td>
//                               <div className="btn-group btn-group-sm gap-1">
//                                 <button
//                                   type="button"
//                                   className="btn-med btn-detail"
//                                   title="Détails"
//                                   onClick={() => openDetails(sv, "signeVital")}
//                                 >
//                                   <i className="bi bi-info-circle"></i>
//                                 </button>
//                                 <button
//                                   type="button"
//                                   className="btn-med btn-edit"
//                                   title="Modifier"
//                                   onClick={() =>
//                                     openForm("signeVital", "edit", sv)
//                                   }
//                                 >
//                                   <i className="bi bi-pencil"></i>
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   ) : (
//                     <div className="text-muted">
//                       Aucun signe vital enregistré.
//                     </div>
//                   )}
//                 </div>
//               </section>
//             </div>
//           </div>
//           <div className="d-flex column mb-3 gap-2">
//             <button
//               className="btn btn-outline-info flex-grow-1"
//               onClick={() => setCurrentPage("facture")}
//               type="button"
//             >
//               Créer facture
//             </button>
//             <button
//               className="btn btn-outline-info flex-grow-1"
//               type="button"
//               onClick={() => setCurrentPage("prescription")}
//             >
//               Créer prescription
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Form Pages */}
//       {currentPage === "allergie" && (
//         <div
//           className="modal fade show d-block"
//           id="formModal"
//           tabIndex="-1"
//           aria-hidden="true"
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content rounded-4">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {formMode === "create"
//                     ? "Ajouter une allergie"
//                     : "Modifier une allergie"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={closeForm}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <AllergieForm
//                   formData={formData}
//                   formMode={formMode}
//                   handleFormChange={handleFormChange}
//                   submitForm={submitForm}
//                   closeForm={closeForm}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {currentPage === "maladie" && (
//         <div
//           className="modal fade show d-block"
//           id="formModal"
//           tabIndex="-1"
//           aria-hidden="true"
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content rounded-4">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {formMode === "create"
//                     ? "Ajouter une maladie"
//                     : "Modifier une maladie"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={closeForm}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <MaladieForm
//                   formData={formData}
//                   formMode={formMode}
//                   handleFormChange={handleFormChange}
//                   submitForm={submitForm}
//                   closeForm={closeForm}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {currentPage === "signeVital" && (
//         <div
//           className="modal fade show d-block"
//           id="formModal"
//           tabIndex="-1"
//           aria-hidden="true"
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content rounded-4">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {formMode === "create"
//                     ? "Ajouter les signes vitaux"
//                     : "Modifier les signes vitaux"}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={closeForm}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <SigneVitalForm
//                   patientId={p?.id}
//                   formMode={formMode}
//                   initialData={formData}
//                   onSuccess={handleSigneSuccess}
//                   onClose={closeForm}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {currentPage === "facture" && (
//         <div
//           className="modal fade show d-block"
//           id="invoiceModal"
//           tabIndex="-1"
//           aria-hidden="true"
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content rounded-4">
//               <div className="modal-header">
//                 <h5 className="modal-title">Créer une facture</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setCurrentPage("overview")}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <FactureForm
//                   patient={patient}
//                   closeForm={() => setCurrentPage("overview")}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {currentPage === "prescription" && (
//         <div
//           className="modal fade show d-block"
//           id="prescriptionModal"
//           tabIndex="-1"
//           aria-hidden="true"
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content rounded-4">
//               <div className="modal-header">
//                 <h5 className="modal-title">Créer une prescription</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setCurrentPage("overview")}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <PrescriptionForm
//                   patient={patient}
//                   closeForm={() => setCurrentPage("overview")}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal Détails */}
//       <div
//         className="modal fade"
//         id="detailModal"
//         tabIndex="-1"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content rounded-4">
//             <div className="modal-header">
//               <h5 className="modal-title">
//                 {detailType === "allergie"
//                   ? "Détails de l’allergie"
//                   : detailType === "maladie"
//                   ? "Détails de la maladie"
//                   : "Détails"}
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={closeDetails}
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               {detailItem ? (
//                 <div className="table-responsive">
//                   <table className="table table-sm align-middle mb-0">
//                     <tbody>
//                       {getDetailRows(detailItem, detailType)
//                         .filter(
//                           ([_, v]) =>
//                             v !== undefined &&
//                             v !== null &&
//                             String(v).trim() !== ""
//                         )
//                         .map(([k, v]) => (
//                           <tr key={k}>
//                             <th
//                               style={{ width: "40%" }}
//                               className="text-muted fw-normal"
//                             >
//                               {k}
//                             </th>
//                             <td>{String(v)}</td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-muted">Aucun détail à afficher.</div>
//               )}
//             </div>
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={closeDetails}
//               >
//                 Fermer
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   ); 
// }













import React, { useState, useEffect } from "react";
import "./DossierPatient.css";
import API_BASE_URL from "../../config/apiConfig";
import { Modal } from "bootstrap";
import AllergieForm from "./Forms/AllergieForm";
import MaladieForm from "./Forms/MaladieForm";
import SigneVitalForm from "./Forms/SigneVitalForm";
import FactureForm from "./Forms/FactureForm";
import PrescriptionForm from "./Forms/PrescriptionForm";

// ----------------- Utils -----------------

const photoCache = new Map();

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function reload(){
  window.location.reload();
}

const fmtBool = (v) => (v === true ? "Oui" : v === false ? "Non" : "");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "");

// ----------------- Composants -----------------

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
        if (!res.ok) return;
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

// ----------------- API Helpers -----------------

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
  if (res.ok) {
    // TODO: Update local state instead of reloading
    window.location.reload();
  } else {
    alert("Suppression impossible.");
  }
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
  if (res.ok) {
    // TODO: Update local state instead of reloading
    window.location.reload();
  } else {
    alert("Suppression impossible.");
  }
}

async function deleteSigneVital(signeVitalId) {
  if (!signeVitalId) return;
  if (!window.confirm("Supprimer ce signe vital ?")) return;
  const res = await fetch(
    `${API_BASE_URL}/api/Medecin/patients/signeVitaux/${signeVitalId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
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
}) {
  const [currentPage, setCurrentPage] = useState("overview");
  const [detailItem, setDetailItem] = useState(null);
  const [detailType, setDetailType] = useState(null);
  const [formType, setFormType] = useState(null);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState({});
  const [localSignesVitaux, setLocalSignesVitaux] = useState(signesVitaux);

  // Sync prop with local state when prop changes
  useEffect(() => {
    setLocalSignesVitaux(signesVitaux);
  }, [signesVitaux]);

  const openDetails = (item, type) => {
    setDetailItem(item);
    setDetailType(type);
    const el = document.getElementById("detailModal");
    if (el) new Modal(el).show();
  };

  const closeDetails = () => {
    const el = document.getElementById("detailModal");
    if (el) Modal.getInstance(el)?.hide();
    setDetailItem(null);
    setDetailType(null);
  };

  const openForm = (type, mode, item = {}) => {
    setFormType(type);
    setFormMode(mode);
    setCurrentPage(type);
    if (type === "allergie") {
      setFormData({
        id: item.id ?? undefined,
        label: item.label ?? "",
        reaction: item.reaction ?? "",
        gravite: item.gravite ?? "",
        notes: item.notes ?? "",
        active: item.active ?? true,
        dateDebut: item.dateDebut ?? "",
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
    } else if (type === "signeVital") {
      setFormData({
        id: item.id ?? undefined,
        temperature: item.temperature ?? "",
        tension: item.tension ?? "",
        frequenceRespiratoire: item.frequenceRespiratoire ?? "",
        saturationOxygene: item.saturationOxygene ?? "",
        poids: item.poids ?? "",
        taille: item.taille ?? "",
        commentaire: item.commentaire ?? "",
        dateMesure: item.dateMesure ?? "",
      });
    }
    const el = document.getElementById("formModal");
    if (el) new Modal(el).show();
  };

  const closeForm = () => {
    const el = document.getElementById("formModal");
    if (el) Modal.getInstance(el)?.hide();
    setFormType(null);
    setFormMode(null);
    setFormData({});
    setCurrentPage("overview");
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((d) => ({
      ...d,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitForm = async () => {
    if (!formType || !formMode) return;
    if (!patient?.id && formMode === "create") {
      alert("Patient introuvable ");
      return;
    }

    const endpointBase =
      formType === "allergie"
        ? "allergies"
        : formType === "maladie"
        ? "maladies"
        : "signeVitaux";
    const url =
      formMode === "create"
        ? `${API_BASE_URL}/api/Medecin/patients/${patient.id}/${endpointBase}`
        : `${API_BASE_URL}/api/Medecin/patients/${endpointBase}/${formData.id}`;
    const method = formMode === "create" ? "POST" : "PATCH";

    const body = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (k !== "id" && v !== "" && v !== undefined) body[k] = v;
    });

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        if (formType === "signeVital") {
          if (formMode === "create") {
            setLocalSignesVitaux((prev) => [...prev, data]);
          } else {
            setLocalSignesVitaux((prev) =>
              prev.map((sv) => (sv.id === data.id ? data : sv))
            );
          }
        }
        closeForm();
        if (formMode === "create") {
          reload();
        }else {
          reload();
        }
      } else {
        const txt = await res.text().catch(() => "");
        alert(`Erreur lors de la sauvegarde\n${txt}`);
      }
    } catch (err) {
      alert(`Erreur lors de la sauvegarde\n${err.message}`);
    }
  };

  const handleSigneSuccess = (data) => {
    if (formMode === "create") {
      setLocalSignesVitaux((prev) => [...prev, data]);
    } else {
      setLocalSignesVitaux((prev) =>
        prev.map((sv) => (sv.id === data.id ? data : sv))
      );
    }
    closeForm();
    reload();
  };

  const getDetailRows = (item, type) => {
    if (!item) return [];
    if (type === "allergie") {
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
    } else if (type === "signeVital") {
      return [
        ["temperature", item.temperature ? `${item.temperature}°c` : ""],
        ["tension", item.tension ? `${item.tension} mmhg` : ""],
        [
          "fréquence respiratoire",
          item.frequenceRespiratoire ? `${item.frequenceRespiratoire} cpm` : "",
        ],
        [
          "saturation en oxygène",
          item.saturationOxygene ? `${item.saturationOxygene}%` : "",
        ],
        ["poids", item.poids ? `${item.poids} kg` : ""],
        ["taille", item.taille ? `${item.taille} cm` : ""],
        ["commentaire", item.commentaire],
        ["date de mesure", fmtDate(item.dateMesure)],
        ["ID", item.id],
      ];
    }
    return [];
  };

  const p = patient;
  console.log(signesVitaux);
  console.log(allergies)

  return (
    <div className="dossier-wrap container-fluid py-3">
      {/* Main Content */}
      {currentPage === "overview" && (
        <div className="row g-3">
          {/* Colonne gauche */}
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column gap-3 h-100">
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
                      <div className="text-break">
                        Email : {p?.email ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                            <button
                              type="button"
                              className="btn-med btn-detail"
                              title="Détails"
                              onClick={() => openDetails(a, "allergie")}
                            >
                              <i className="bi bi-info-circle"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-med btn-edit"
                              title="Modifier"
                              onClick={() => openForm("allergie", "edit", a)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
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
                    <div className="text-muted">
                      Aucune allergie renseignée.
                    </div>
                  )}
                </div>
              </div>
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
                            <button
                              type="button"
                              className="btn-med btn-detail"
                              title="Détails"
                              onClick={() => openDetails(m, "maladie")}
                            >
                              <i className="bi bi-info-circle"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-med btn-edit"
                              title="Modifier"
                              onClick={() => openForm("maladie", "edit", m)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-med btn-delete"
                              title="Supprimer"
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
          {/* Colonne droite */}
          <div className="col-12 col-lg-8">
            <div className="grid-2x2 h-100">
              {/* <section className="panel card border-0 shadow-sm rounded-4">
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
              </section> */}
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
                        <li key={t.id ?? `${t.nomTraitement}`}>
                          <span className="fw-semibold">
                            {t.nomTraitement ?? "—"}
                          </span>
                          {t.dureeJour ? ` • ${t.dureeJour} jours` : ""}
                          {t.compteur >= 0
                            ? ` • Jours restants: ${t.compteur}`
                            : ""}
                          {t.statut ? (
                            <span className="text-muted"> ({t.statut})</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted">— vide —</div>
                  )}
                </div>
              </section>
              {/* <section className="panel card border-0 shadow-sm rounded-4">
                <div className="card-header d-flex justify-content-between bg-white border-0">
                  <h6 className="m-0">Signes vitaux</h6>
                  <button
                    type="button"
                    className="btn btn-add"
                    title="Ajouter un signe vital"
                    onClick={() => openForm("signeVital", "create", {})}
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </div>
                <div className="card-body small overflow-auto">
                  {localSignesVitaux?.length ? (
                    <div className="d-flex flex-column gap-3">
                      {localSignesVitaux
                        .sort(
                          (a, b) =>
                            new Date(b.dateMesure) - new Date(a.dateMesure)
                        )
                        .map((sv, i) => (
                          <div
                            key={sv.id ?? i}
                            className="border rounded p-3 bg-light vital-signs-entry"
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="m-0">
                                Mesure du {fmtDate(sv.dateMesure) || "—"}
                              </h6>
                              <div className="btn-group btn-group-sm gap-1">
                                <button
                                  type="button"
                                  className="btn-med btn-detail"
                                  title="Détails"
                                  onClick={() => openDetails(sv, "signeVital")}
                                >
                                  <i className="bi bi-info-circle"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn-med btn-edit"
                                  title="Modifier"
                                  onClick={() =>
                                    openForm("signeVital", "edit", sv)
                                  }
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </div>
                            </div>
                            <div className="vstack gap-1 small">
                              {sv.temperature && (
                                <div>Température: {sv.temperature}°C</div>
                              )}
                              {sv.tension && (
                                <div>Tension: {sv.tension} mmHg</div>
                              )}
                              {sv.frequenceRespiratoire && (
                                <div>
                                  Fréquence respiratoire:{" "}
                                  {sv.frequenceRespiratoire} cpm
                                </div>
                              )}
                              {sv.saturationOxygene && (
                                <div>
                                  Saturation en oxygène: {sv.saturationOxygene}%
                                </div>
                              )}
                              {sv.poids && <div>Poids: {sv.poids} kg</div>}
                              {sv.taille && <div>Taille: {sv.taille} cm</div>}
                              {sv.commentaire && (
                                <div>Commentaire: {sv.commentaire}</div>
                              )}
                              {sv.dateMesure && (
                                <div>
                                  Date de mesure: {fmtDate(sv.dateMesure)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-muted">
                      Aucun signe vital enregistré.
                    </div>
                  )}
                </div>
              </section> */}
              <section className="panel card border-0 shadow-sm rounded-4">
                <div className="card-header d-flex justify-content-between bg-white border-0">
                  <h6 className="m-0">Signes vitaux</h6>
                  <button
                    type="button"
                    className="btn btn-add"
                    title="Ajouter un signe vital"
                    onClick={() => openForm("signeVital", "create", {})}
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </div>
                <div className="card-body small overflow-auto">
                  {signesVitaux?.length ? (
                    <div className="d-flex flex-column gap-3">
                      {signesVitaux
                        .sort(
                          (a, b) =>
                            new Date(b.dateMesure) - new Date(a.dateMesure)
                        )
                        .map((sv, i) => (
                          <div
                            key={sv.id ?? i}
                            className="border rounded p-3 bg-light vital-signs-entry"
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="m-0">
                                Mesure du {fmtDate(sv.dateMesure) || "—"}
                              </h6>
                              <div className="btn-group btn-group-sm gap-1">
                                <button
                                  type="button"
                                  className="btn-med btn-detail"
                                  title="Détails"
                                  onClick={() => openDetails(sv, "signeVital")}
                                >
                                  <i className="bi bi-info-circle"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn-med btn-edit"
                                  title="Modifier"
                                  onClick={() =>
                                    openForm("signeVital", "edit", sv)
                                  }
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn-med btn-delete"
                                  title="Supprimer"
                                  onClick={() => deleteSigneVital(sv.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                            <div className="vstack gap-1 small">
                              {sv.temperature && (
                                <div>temperature: {sv.temperature}°c</div>
                              )}
                              {sv.tension && (
                                <div>tension: {sv.tension} mmhg</div>
                              )}
                              {sv.frequenceRespiratoire && (
                                <div>
                                  fréquence respiratoire:{" "}
                                  {sv.frequenceRespiratoire} cpm
                                </div>
                              )}
                              {sv.saturationOxygene && (
                                <div>
                                  saturation en oxygène: {sv.saturationOxygene}%
                                </div>
                              )}
                              {sv.poids && <div>poids: {sv.poids} kg</div>}
                              {sv.taille && <div>taille: {sv.taille} cm</div>}
                              {sv.commentaire && (
                                <div>commentaire: {sv.commentaire}</div>
                              )}
                              {sv.dateMesure && (
                                <div>
                                  date de mesure: {fmtDate(sv.dateMesure)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-muted">
                      Aucun signe vital enregistré.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
          <div className="d-flex flex-column mb-3 gap-2">
            <button
              className="btn btn-outline-info flex-grow-1"
              onClick={() => setCurrentPage("facture")}
              type="button"
            >
              Créer facture
            </button>
            <button
              className="btn btn-outline-info flex-grow-1"
              type="button"
              onClick={() => setCurrentPage("prescription")}
            >
              Créer prescription
            </button>
          </div>
        </div>
      )}

      {/* Form Pages */}
      {currentPage === "allergie" && (
        <div
          className="modal fade show d-block"
          id="formModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">
                  {formMode === "create"
                    ? "Ajouter une allergie"
                    : "Modifier une allergie"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeForm}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <AllergieForm
                  formData={formData}
                  formMode={formMode}
                  handleFormChange={handleFormChange}
                  submitForm={submitForm}
                  closeForm={closeForm}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {currentPage === "maladie" && (
        <div
          className="modal fade show d-block"
          id="formModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">
                  {formMode === "create"
                    ? "Ajouter une maladie"
                    : "Modifier une maladie"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeForm}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <MaladieForm
                  formData={formData}
                  formMode={formMode}
                  handleFormChange={handleFormChange}
                  submitForm={submitForm}
                  closeForm={closeForm}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {currentPage === "signeVital" && (
        <div
          className="modal fade show d-block"
          id="formModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">
                  {formMode === "create"
                    ? "Ajouter les signes vitaux"
                    : "Modifier les signes vitaux"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeForm}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <SigneVitalForm
                  patientId={p?.id}
                  formMode={formMode}
                  initialData={formData}
                  onSuccess={handleSigneSuccess}
                  onClose={closeForm}
                />
              </div>
            </div>
          </div>
        </div>
      )} */}
      {currentPage === "signeVital" && (
        <div
          className="modal fade show d-block"
          id="formModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">
                  {formMode === "create"
                    ? "Ajouter les signes vitaux"
                    : "Modifier les signes vitaux"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeForm}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <SigneVitalForm
                  formData={formData}
                  formMode={formMode}
                  handleFormChange={handleFormChange}
                  submitForm={submitForm}
                  closeForm={closeForm}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {currentPage === "facture" && (
        <div
          className="modal fade show d-block"
          id="invoiceModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Créer une facture</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setCurrentPage("overview")}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <FactureForm
                  patient={patient}
                  closeForm={() => setCurrentPage("overview")}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {currentPage === "prescription" && (
        <div
          className="modal fade show d-block"
          id="prescriptionModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Créer une prescription</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setCurrentPage("overview")}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <PrescriptionForm
                  patient={patient}
                  closeForm={() => setCurrentPage("overview")}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails */}
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
                  : detailType === "signeVital"
                  ? "Détails des signes vitaux"
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
    </div>
  );
}