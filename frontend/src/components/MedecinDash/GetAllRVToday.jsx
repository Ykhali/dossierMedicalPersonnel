// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "../GetAllRendezVous/rdv-cards-today.css"; // <-- ton CSS

// // nécessaire pour que le dropdown Bootstrap fonctionne
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

// import "bootstrap-icons/font/bootstrap-icons.css";

// function GetAllRVToday() {
//   const [rendezVous, setRendezVous] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [showCreate, setShowCreate] = useState(false); // ✅ modal ouvert/fermé

//   const navigate = useNavigate();

//   //rendez-vous status:
//   const [updatingId, setUpdatingId] = useState(null);

//   const mois = [
//     "janv",
//     "févr",
//     "mars",
//     "avr",
//     "mai",
//     "juin",
//     "juil",
//     "août",
//     "sept",
//     "oct",
//     "nov",
//     "déc",
//   ];

//   const parseRvDateTime = (rv) => {
//     const raw = String(rv.dateRendezVous || rv.date || "").trim();
//     const heureStr = String(rv.heure || "").trim();

//     if (!raw) return null;

//     // Ex: "15/08/2025 16:30" → séparer proprement
//     const [datePart, timeInline] = raw.split(" ");
//     const time = timeInline || heureStr || "00:00";

//     // Supporte "DD/MM/YYYY" ou "DD-MM-YYYY"
//     const m = datePart.split(/[-/]/);
//     if (m.length !== 3) return null;
//     let [dd, mm, yyyy] = m.map((x) => x.trim());

//     // Sécurité
//     if (!yyyy || !mm || !dd) return null;

//     const day = parseInt(dd, 10);
//     const monthIndex = parseInt(mm, 10) - 1; // 0..11
//     const year = parseInt(yyyy, 10);
//     if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) return null;

//     // Heure
//     const [hh = "0", min = "0"] = time.split(":");
//     const hour = parseInt(hh, 10) || 0;
//     const minute = parseInt(min, 10) || 0;

//     // Construit un Date en local
//     const d = new Date(year, monthIndex, day, hour, minute, 0, 0);
//     return isNaN(d.getTime()) ? null : d;
//   };

//   // Formatage pour l'affichage dans la carte
//   const fmtParts = (rv) => {
//     const rawDate = (rv.dateRendezVous || rv.date || "").trim();
//     const heure = (rv.heure || "").trim();
//     //
//     if (!rawDate)
//       return { month: "--", day: "--", year: "----", time: heure || "--" };

//     // Sépare l’éventuelle heure collée : "15/08/2025 16:30"
//     const [datePart, timeInline] = rawDate.split(" ");
//     const [dd, mm, yyyy] = (datePart || "").split(/[-/]/); // accepte "/" ou "-"
//     const monthIndex = (parseInt(mm, 10) || 1) - 1;

//     const month = mois[monthIndex] || "--";
//     const day = String(dd || "").padStart(2, "0");
//     const year = yyyy || "----";
//     const time = timeInline || heure || "--";

//     return { month, day, year, time };
//   };

//   // Couleurs de badge selon le statut
//   const statusBadge = (status) => {
//     if (!status) return "bg-secondary";
//     const s = String(status).toLowerCase();
//     if (s.includes("confirm")) return "bg-success";
//     if (s.includes("annul") || s.includes("refus")) return "bg-danger";
//     if (s.includes("En_attente") || s.includes("pending"))
//       return "bg-warning text-dark";
//     if (s.includes("Planifie")) return "bg-primary";
//     return "bg-secondary";
//   };

//   // Affichage du nom de médecin
//   const medecinLabel = (rv) =>
//     rv.medecinNom ||
//     (rv.medecin &&
//       `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
//     "N/A";
// const patientLabel = (rv) =>
//   rendezVous.patientNom ||
//   (rv.patient && `${rv.patient.prenom ?? ""} ${rv.patient.nom ?? ""}`.trim()) ||
//   "N/A";

//   // Charger + filtrer (>= now) + trier (croissant) les rendez-vous
//   useEffect(() => {
//     const fetchRendezVous = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       setIsLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(
//           `${API_BASE_URL}/api/Medecin/rendezVous/aujourdhui`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!res.ok) throw new Error("Erreur API");
//         const data = await res.json();

//         const now = new Date();

//         // garder uniquement les RDV >= maintenant puis trier croissant
//         const upcoming = data.filter((rv) => {
//           const d = parseRvDateTime(rv);
//           return d && d.getTime() >= now.getTime();
//         });

//         setRendezVous(upcoming);
//       } catch (e) {
//         setError(e.message || "Erreur lors de la récupération des rendez_vous");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchRendezVous();
//   }, [navigate]);

//   // Statuts EXACTS attendus par l’API (value = enum Java)
//   const STATUS_OPTIONS = [
//     { value: "Terminé", label: "Terminé", badge: "bg-success text-light" },
//   ];

//   const getMeta = (v) =>
//     STATUS_OPTIONS.find((o) => o.value === String(v || ""));

//   const handleChangeStatus = async (id, newStatus) => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");

//     try {
//       setUpdatingId(id);
//       const res = await fetch(
//         `${API_BASE_URL}/api/receptionniste/rendezVous/${id}/changerStatus`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json; charset=UTF-8",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ newStatus }), // <-- correspond à ton DTO
//         }
//       );
//       if (!res.ok) throw new Error("Échec changement de statut");

//       // MAJ locale (optimiste)
//       setRendezVous((list) =>
//         list.map((rv) => (rv.id === id ? { ...rv, status: newStatus } : rv))
//       );
//     } catch (e) {
//       setError(e.message || "Erreur lors du changement de statut");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   return (
//     <div className="container py-3">
//       {/* Bloc global : en‑tête + liste des cartes */}
//       <div className="rdv-list border rounded-4 shadow-sm overflow-hidden card-rv">
//         {/* En‑tête du bloc */}
//         <div className="rdv-list-header px-3 py-2">
//           <h5 className="m-0 fw-semibold text-secondary">
//             Les rendezVous d'aujourd'hui
//           </h5>
//         </div>

//         {/* Contenu */}
//         <div className="p-3">
//           {error && <div className="alert alert-danger mb-3">{error}</div>}

//           {isLoading ? (
//             <div className="text-center py-4">Chargement…</div>
//           ) : rendezVous.length === 0 ? (
//             <div className="text-center text-muted py-4">
//               Aucun rendez‑vous aujourd'hui
//             </div>
//           ) : (
//             <div className="rdv-scroll">
//               <div className="d-flex flex-column gap-3">
//                 {rendezVous.map((rv) => {
//                   const { month, day, year, time } = fmtParts(rv);
//                   return (
//                     <div
//                       key={rv.id}
//                       className="rdv-card border rounded-3 p-3 d-flex flex-column flex-md-row align-items-stretch"
//                     >
//                       {/* Bloc date */}
//                       <div className="rdv-datebox me-md-3 mb-3 mb-md-0 d-flex flex-column justify-content-center align-items-center">
//                         <div className="rdv-month">{month}</div>
//                         <div className="rdv-day">
//                           {day} <small className="text-muted">{year}</small>
//                         </div>
//                         <div className="rdv-time">{time}</div>
//                       </div>

//                       {/* Infos RDV */}
//                       <div className="flex-fill d-flex flex-column justify-content-center">
//                         <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
//                           <span className="badge bg-medical-soft text-medical fw-medium">
//                             Rendez‑vous
//                           </span>
//                           <span className={`badge ${statusBadge(rv.status)}`}>
//                             {rv.status || "—"}
//                           </span>
//                         </div>

//                         <div className="fw-semibold">
//                           Motif :{" "}
//                           <span className="text-body">{rv.motif || "—"}</span>
//                         </div>
//                         <div className="text-muted">Dr {medecinLabel(rv)}</div>
//                         <div className="text-muted small">
//                           <i className="bi bi-person me-1"></i>
//                           <strong>Patient :</strong> {patientLabel(rv)}
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
//                         {/* <button className="btn btn-outline-medical btn-sm">
//                           changer Status
//                         </button> */}
//                         <div className="dropdown">
//                           <button
//                             className="btn btn-outline-medical btn-sm dropdown-toggle"
//                             type="button"
//                             data-bs-toggle="dropdown"
//                             data-bs-display="static"
//                             aria-expanded="false"
//                             disabled={updatingId === rv.id}
//                           >
//                             {updatingId === rv.id
//                               ? "Mise à jour..."
//                               : "Modifier statut"}
//                           </button>

//                           <ul className="dropdown-menu dropdown-menu-end">
//                             {STATUS_OPTIONS.map((opt) => {
//                               const isCurrent = rv.status === opt.value;
//                               return (
//                                 <li key={opt.value}>
//                                   <button
//                                     className="dropdown-item d-flex align-items-center gap-2"
//                                     onClick={() =>
//                                       handleChangeStatus(rv.id, opt.value)
//                                     }
//                                     disabled={isCurrent || updatingId === rv.id}
//                                   >
//                                     {isCurrent ? (
//                                       <i className="bi bi-check2" />
//                                     ) : (
//                                       <i className="bi bi-circle" />
//                                     )}
//                                     <span>{opt.label}</span>
//                                     <span
//                                       className={`badge ms-auto ${opt.badge}`}
//                                     >
//                                       {opt.label}
//                                     </span>
//                                   </button>
//                                 </li>
//                               );
//                             })}
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GetAllRVToday;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "../GetAllRendezVous/rdv-cards-today.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// function GetAllRVToday({ onCountChange }) {
//   const [rendezVous, setRendezVous] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [updatingId, setUpdatingId] = useState(null);
//   const navigate = useNavigate();

//   const mois = [
//     "janv",
//     "févr",
//     "mars",
//     "avr",
//     "mai",
//     "juin",
//     "juil",
//     "août",
//     "sept",
//     "oct",
//     "nov",
//     "déc",
//   ];

//   // Parse "DD/MM/YYYY HH:mm" ou "DD-MM-YYYY" (+ rv.heure)
//   const parseRvDateTime = (rv) => {
//     const raw = String(rv.dateRendezVous || rv.date || "").trim();
//     const heureStr = String(rv.heure || "").trim();
//     if (!raw) return null;

//     const [datePart, timeInline] = raw.split(" ");
//     const time = (timeInline || heureStr || "00:00").trim();

//     const parts = (datePart || "").split(/[-/]/);
//     if (parts.length !== 3) return null;

//     let [dd, mm, yyyy] = parts.map((x) => x.trim());
//     const day = parseInt(dd, 10);
//     const monthIndex = parseInt(mm, 10) - 1;
//     const year = parseInt(yyyy, 10);
//     if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) return null;

//     const [hh = "0", min = "0"] = time.split(":");
//     const hour = parseInt(hh, 10) || 0;
//     const minute = parseInt(min, 10) || 0;

//     const d = new Date(year, monthIndex, day, hour, minute, 0, 0);
//     return isNaN(d.getTime()) ? null : d;
//   };

//   // Formatage pour la carte
//   const fmtParts = (rv) => {
//     const rawDate = String(rv.dateRendezVous || rv.date || "").trim();
//     const heure = String(rv.heure || "").trim();
//     if (!rawDate)
//       return { month: "--", day: "--", year: "----", time: heure || "--" };

//     const [datePart, timeInline] = rawDate.split(" ");
//     const [dd, mm, yyyy] = (datePart || "").split(/[-/]/);
//     const monthIndex = (parseInt(mm, 10) || 1) - 1;

//     return {
//       month: mois[monthIndex] || "--",
//       day: String(dd || "").padStart(2, "0"),
//       year: yyyy || "----",
//       time: (timeInline || heure || "--").trim(),
//     };
//   };

//   // Badge de statut
//   const statusBadge = (status) => {
//     if (!status) return "bg-secondary";
//     const s = String(status).toLowerCase();

//     if (s.includes("confirm") || s.includes("termin")) return "bg-success";
//     if (s.includes("annul") || s.includes("refus")) return "bg-danger";
//     if (
//       s.includes("attente") ||
//       s.includes("pending") ||
//       s.includes("en_attente")
//     )
//       return "bg-warning text-dark";
//     if (s.includes("planifi")) return "bg-primary";
//     if (s.includes("no_show") || s.includes("non_honor")) return "bg-dark";
//     return "bg-secondary";
//   };

//   // Libellés
//   const medecinLabel = (rv) =>
//     rv.medecinNom ||
//     rv.medecinFullName ||
//     (rv.medecin &&
//       `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
//     "N/A";

//   const patientLabel = (rv) =>
//     rv.patientNom ||
//     rv.patientFullName ||
//     (rv.patient &&
//       `${rv.patient.prenom ?? ""} ${rv.patient.nom ?? ""}`.trim()) ||
//     "N/A";

//   // Fetch + dédoublonnage + filtre >= now + tri
//   useEffect(() => {
//     const fetchRendezVous = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       setIsLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(
//           `${API_BASE_URL}/api/Medecin/rendezVous/aujourdhui`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!res.ok) throw new Error("Erreur API");

//         const data = await res.json();

//         // Dédoublonnage par id ; fallback clé composée si id manquant
//         const unique = Array.from(
//           new Map(
//             data.map((rv) => {
//               const key =
//                 rv.id ??
//                 `${rv.dateRendezVous || rv.date}-${rv.heure}-${
//                   rv.patient?.id ?? rv.patientNom ?? rv.patientFullName ?? ""
//                 }`;
//               return [key, rv];
//             })
//           ).values()
//         );

//         const now = new Date();

//         const upcoming = unique
//           .map((rv) => ({ rv, d: parseRvDateTime(rv) }))
//           .filter((x) => x.d && x.d.getTime() >= now.getTime())
//           .sort((a, b) => a.d - b.d)
//           .map((x) => x.rv);

//         setRendezVous(upcoming);

//         if (onCountChange) onCountChange(upcoming.length);
//       } catch (e) {
//         setError(e.message || "Erreur lors de la récupération des rendez-vous");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRendezVous();
//   }, [onCountChange]); // en dev, React.StrictMode appelle 2x mais on écrase le state avec la réponse dédoublonnée

//   // Statuts disponibles (à adapter à ton enum)
//   const STATUS_OPTIONS = [
//     { value: "Terminé", label: "Terminé", badge: "bg-success text-light" },
//   ];

//   const handleChangeStatus = async (id, newStatus) => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");

//     try {
//       setUpdatingId(id);
//       const res = await fetch(
//         `${API_BASE_URL}/api/Medecin/rendezVous/${id}/changerStatus`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json; charset=UTF-8",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ newStatus }),
//         }
//       );
//       if (!res.ok) throw new Error("Échec changement de statut");

//       // Mise à jour optimiste
//       setRendezVous((list) =>
//         list.map((rv) => (rv.id === id ? { ...rv, status: newStatus } : rv))
//       );
//     } catch (e) {
//       setError(e.message || "Erreur lors du changement de statut");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   return (
//     <div className="container py-3">
//       <div className="rdv-list border rounded-4 shadow-sm card-rv">
//         <div className="rdv-list-header px-3 py-2">
//           <h5 className="m-0 fw-semibold text-secondary">
//             Les rendez-vous d'aujourd'hui
//           </h5>
//         </div>

//         <div className="p-3">
//           {error && <div className="alert alert-danger mb-3">{error}</div>}

//           {isLoading ? (
//             <div className="text-center py-4">Chargement…</div>
//           ) : rendezVous.length === 0 ? (
//             <div className="text-center text-muted py-4">
//               Aucun rendez-vous aujourd'hui
//             </div>
//           ) : (
//             <div className="rdv-scroll">
//               <div className="d-flex flex-column gap-3">
//                 {rendezVous.map((rv) => {
//                   const { month, day, year, time } = fmtParts(rv);
//                   return (
//                     <div
//                       key={
//                         rv.id ?? `${rv.date}-${rv.heure}-${patientLabel(rv)}`
//                       }
//                       className="rdv-card border rounded-3 p-3 d-flex flex-column flex-md-row align-items-stretch"
//                     >
//                       {/* Date */}
//                       <div className="rdv-datebox me-md-3 mb-3 mb-md-0 d-flex flex-column justify-content-center align-items-center">
//                         <div className="rdv-month">{month}</div>
//                         <div className="rdv-day">
//                           {day} <small className="text-muted">{year}</small>
//                         </div>
//                         <div className="rdv-time">{time}</div>
//                       </div>

//                       {/* Infos */}
//                       <div className="flex-fill d-flex flex-column justify-content-center">
//                         <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
//                           <span className="badge bg-medical-soft text-medical fw-medium">
//                             Rendez-vous
//                           </span>
//                           <span className={`badge ${statusBadge(rv.status)}`}>
//                             {rv.status || "—"}
//                           </span>
//                         </div>

//                         <div className="fw-semibold">
//                           Motif :{" "}
//                           <span className="text-body">{rv.motif || "—"}</span>
//                         </div>
//                         <div className="text-muted">Dr {medecinLabel(rv)}</div>
//                         <div className="text-muted small">
//                           <i className="bi bi-person me-1" />
//                           <strong>Patient :</strong> {patientLabel(rv)}
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
//                         <div className="dropdown position-static">
//                           <button
//                             className="btn btn-outline-medical btn-sm dropdown-toggle"
//                             type="button"
//                             data-bs-toggle="dropdown"
//                             data-bs-display="static"
//                             aria-expanded="false"
//                             disabled={updatingId === rv.id}
//                           >
//                             {updatingId === rv.id
//                               ? "Mise à jour..."
//                               : "Modifier statut"}
//                           </button>

//                           <ul className="dropdown-menu dropdown-menu-end">
//                             {STATUS_OPTIONS.map((opt) => {
//                               const isCurrent = rv.status === opt.value;
//                               return (
//                                 <li key={opt.value}>
//                                   <button
//                                     className="dropdown-item d-flex align-items-center gap-2"
//                                     onClick={() =>
//                                       handleChangeStatus(rv.id, opt.value)
//                                     }
//                                     disabled={isCurrent || updatingId === rv.id}
//                                   >
//                                     {isCurrent ? (
//                                       <i className="bi bi-check2" />
//                                     ) : (
//                                       <i className="bi bi-circle" />
//                                     )}
//                                     <span>{opt.label}</span>
//                                     <span
//                                       className={`badge ms-auto ${opt.badge}`}
//                                     >
//                                       {opt.label}
//                                     </span>
//                                   </button>
//                                 </li>
//                               );
//                             })}
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GetAllRVToday;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import "../GetAllRendezVous/rdv-cards-today.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Dropdown } from "bootstrap"; 

function GetAllRVToday({ onCountChange }) {
  const [rendezVous, setRendezVous] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const mois = [
    "janv",
    "févr",
    "mars",
    "avr",
    "mai",
    "juin",
    "juil",
    "août",
    "sept",
    "oct",
    "nov",
    "déc",
  ];

  // Parse "DD/MM/YYYY HH:mm" ou "DD-MM-YYYY" (+ rv.heure)
  const parseRvDateTime = (rv) => {
    const raw = String(rv.dateRendezVous || rv.date || "").trim();
    const heureStr = String(rv.heure || "").trim();
    if (!raw) return null;
    const [datePart, timeInline] = raw.split(" ");
    const time = (timeInline || heureStr || "00:00").trim();
    const parts = (datePart || "").split(/[-/]/);
    if (parts.length !== 3) return null;
    let [dd, mm, yyyy] = parts.map((x) => x.trim());
    const day = parseInt(dd, 10);
    const monthIndex = parseInt(mm, 10) - 1;
    const year = parseInt(yyyy, 10);
    if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) return null;
    const [hh = "0", min = "0"] = time.split(":");
    const hour = parseInt(hh, 10) || 0;
    const minute = parseInt(min, 10) || 0;
    const d = new Date(year, monthIndex, day, hour, minute, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  };

  const fmtParts = (rv) => {
    const rawDate = String(rv.dateRendezVous || rv.date || "").trim();
    const heure = String(rv.heure || "").trim();
    if (!rawDate)
      return { month: "--", day: "--", year: "----", time: heure || "--" };
    const [datePart, timeInline] = rawDate.split(" ");
    const [dd, mm, yyyy] = (datePart || "").split(/[-/]/);
    const monthIndex = (parseInt(mm, 10) || 1) - 1;
    return {
      month: mois[monthIndex] || "--",
      day: String(dd || "").padStart(2, "0"),
      year: yyyy || "----",
      time: (timeInline || heure || "--").trim(),
    };
  };

  const statusBadge = (status) => {
    if (!status) return "bg-secondary";
    const s = String(status).toLowerCase();
    if (s.includes("confirm") || s.includes("termin")) return "bg-success";
    if (s.includes("annul") || s.includes("refus")) return "bg-danger";
    if (
      s.includes("attente") ||
      s.includes("pending") ||
      s.includes("en_attente")
    )
      return "bg-warning text-dark";
    if (s.includes("planifi")) return "bg-primary";
    if (s.includes("no_show") || s.includes("non_honor")) return "bg-dark";
    return "bg-secondary";
  };

  const medecinLabel = (rv) =>
    rv.medecinNom ||
    rv.medecinFullName ||
    (rv.medecin &&
      `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
    "N/A";

  const patientLabel = (rv) =>
    rv.patientNom ||
    rv.patientFullName ||
    (rv.patient &&
      `${rv.patient.prenom ?? ""} ${rv.patient.nom ?? ""}`.trim()) ||
    "N/A";

  useEffect(() => {
    const fetchRendezVous = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/Medecin/rendezVous/aujourdhui`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Erreur API");
        const data = await res.json();

        const unique = Array.from(
          new Map(
            data.map((rv) => {
              const key =
                rv.id ??
                `${rv.dateRendezVous || rv.date}-${rv.heure}-${
                  rv.patient?.id ?? rv.patientNom ?? rv.patientFullName ?? ""
                }`;
              return [key, rv];
            })
          ).values()
        );

        const now = new Date();
        const upcoming = unique
          .map((rv) => ({ rv, d: parseRvDateTime(rv) }))
          .filter((x) => x.d && x.d.getTime() >= now.getTime())
          .sort((a, b) => a.d - b.d)
          .map((x) => x.rv);

        setRendezVous(upcoming);
        onCountChange && onCountChange(upcoming.length);
      } catch (e) {
        setError(e.message || "Erreur lors de la récupération des rendez-vous");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRendezVous();
  }, [onCountChange, navigate]);

  // ⬇️ Ajuste ces valeurs selon ton enum backend si nécessaire
  const STATUS_OPTIONS = [
    { value: "Terminé", label: "Terminé", badge: "bg-success text-light" },
  ];

  const handleChangeStatus = async (id, newStatus, toggleId) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      setUpdatingId(id);
      const res = await fetch(
        `${API_BASE_URL}/api/Medecin/rendezVous/${id}/changerStatus`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newStatus }),
        }
      );
      if (!res.ok) throw new Error("Échec changement de statut");

      setRendezVous((list) =>
        list.map((rv) => (rv.id === id ? { ...rv, status: newStatus } : rv))
      );
    } catch (e) {
      setError(e.message || "Erreur lors du changement de statut");
    } finally {
      setUpdatingId(null);
      // ferme le dropdown proprement
      const btn = document.getElementById(toggleId);
      if (btn) {
        const dd = Dropdown.getInstance(btn);
        dd && dd.hide();
      }
    }
  };

  // Ouvre/ferme via l’API (fiable même si la data-API ne s’attache pas)
  const toggleDropdown = (toggleId) => (e) => {
    e.preventDefault();
    const btn = document.getElementById(toggleId);
    if (!btn) return;
    Dropdown.getOrCreateInstance(btn).toggle();
  };

  return (
    <div className="container py-3">
      <div className="rdv-list border rounded-4 shadow-sm card-rv">
        <div className="rdv-list-header px-3 py-2">
          <h5 className="m-0 fw-semibold text-secondary">
            Les rendez-vous d'aujourd'hui
          </h5>
        </div>

        <div className="p-3">
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          {isLoading ? (
            <div className="text-center py-4">Chargement…</div>
          ) : rendezVous.length === 0 ? (
            <div className="text-center text-muted py-4">
              Aucun rendez-vous aujourd'hui
            </div>
          ) : (
            <div className="rdv-scroll">
              <div className="d-flex flex-column gap-3">
                {rendezVous.map((rv, idx) => {
                  const { month, day, year, time } = fmtParts(rv);
                  const toggleId = `statusToggle-today-${rv.id ?? idx}`;
                  return (
                    <div
                      key={
                        rv.id ?? `${rv.date}-${rv.heure}-${patientLabel(rv)}`
                      }
                      className="rdv-card border rounded-3 p-3 d-flex flex-column flex-md-row align-items-stretch"
                    >
                      {/* Date */}
                      <div className="rdv-datebox me-md-3 mb-3 mb-md-0 d-flex flex-column justify-content-center align-items-center">
                        <div className="rdv-month">{month}</div>
                        <div className="rdv-day">
                          {day} <small className="text-muted">{year}</small>
                        </div>
                        <div className="rdv-time">{time}</div>
                      </div>

                      {/* Infos */}
                      <div className="flex-fill d-flex flex-column justify-content-center">
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                          <span className="badge bg-medical-soft text-medical fw-medium">
                            Rendez-vous
                          </span>
                          <span className={`badge ${statusBadge(rv.status)}`}>
                            {rv.status || "—"}
                          </span>
                        </div>

                        <div className="fw-semibold">
                          Motif :{" "}
                          <span className="text-body">{rv.motif || "—"}</span>
                        </div>
                        <div className="text-muted">Dr {medecinLabel(rv)}</div>
                        <div className="text-muted small">
                          <i className="bi bi-person me-1" />
                          <strong>Patient :</strong> {patientLabel(rv)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
                        {/* position-static = meilleur comportement dans des cartes scrollables */}
                        <div className="dropdown position-static">
                          <button
                            id={toggleId}
                            className="btn btn-outline-medical btn-sm dropdown-toggle"
                            type="button"
                            aria-expanded="false"
                            onClick={toggleDropdown(toggleId)}
                            disabled={updatingId === rv.id}
                          >
                            {updatingId === rv.id
                              ? "Mise à jour..."
                              : "Modifier statut"}
                          </button>

                          <ul className="dropdown-menu dropdown-menu-end">
                            {STATUS_OPTIONS.map((opt) => {
                              const isCurrent = rv.status === opt.value;
                              return (
                                <li key={opt.value}>
                                  <button
                                    className="dropdown-item d-flex align-items-center gap-2"
                                    onClick={() =>
                                      handleChangeStatus(
                                        rv.id,
                                        opt.value,
                                        toggleId
                                      )
                                    }
                                    disabled={isCurrent || updatingId === rv.id}
                                  >
                                    {isCurrent ? (
                                      <i className="bi bi-check2" />
                                    ) : (
                                      <i className="bi bi-circle" />
                                    )}
                                    <span>{opt.label}</span>
                                    <span
                                      className={`badge ms-auto ${opt.badge}`}
                                    >
                                      {opt.label}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetAllRVToday;

