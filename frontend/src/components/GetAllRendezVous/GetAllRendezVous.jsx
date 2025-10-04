// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "./rdv-cards.css"; 

// function GetAllRendezVous() {
//   const [rendezVous, setRendezVous] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Mois FR abrégés
//   const MONTHS_FR = [
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



//   // ---- helpers: construit un Date à partir d'un RV ----
//   const parseRvDateTime = (rv) => {
//     // On prend d’abord dateRendezVous, sinon date
//     const raw = String(rv.dateRendezVous || rv.date || "").trim();
//     const heureStr = String(rv.heure || "").trim(); // "HH:mm" (optionnel)

//     if (!raw) return null;

//     // Ex: "15/08/2025 16:30" → séparer proprement
//     const [datePart, timeInline] = raw.split(" ");
//     const time = timeInline || heureStr || "00:00";

//     // Support "DD/MM/YYYY" ou "DD-MM-YYYY"
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

//   const norm = (s = "") =>
//     s
//       .toString()
//       .normalize("NFD")
//       .replace(/\p{Diacritic}/gu, "")
//       .toLowerCase()
//       .trim();


//   // Comparateur de tri croissant
//   const byDateAsc = (a, b) => {
//     const da = parseRvDateTime(a);
//     const db = parseRvDateTime(b);
//     if (!da && !db) return 0;
//     if (!da) return 1; // sans date → en bas
//     if (!db) return -1;
//     return da - db;
//   };

//   // Formatage pour l'affichage dans la carte
//   const fmtParts = (rv) => {
//     const rawDate = (rv.dateRendezVous || rv.date || "").trim();
//     const heure = (rv.heure || "").trim();
// //
//     if (!rawDate) return { month: "--", day: "--", year: "----", time: heure || "--" };

//     // Sépare l’éventuelle heure collée : "15/08/2025 16:30"
//     const [datePart, timeInline] = rawDate.split(" ");
//     const [dd, mm, yyyy] = (datePart || "").split(/[-/]/); // accepte "/" ou "-"
//     const monthIndex = (parseInt(mm, 10) || 1) - 1;

//     const month = MONTHS_FR[monthIndex] || "--";
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
//     if (s.includes("attente") || s.includes("pending"))
//       return "bg-warning text-dark";
//     return "bg-secondary";
//   };

//   // Affichage du nom de médecin
//   const medecinLabel = (rv) =>
//     rv.medecinNom ||
//     (rv.medecin &&
//       `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
//     "N/A";

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
//         const res = await fetch(`${API_BASE_URL}/api/Patient/rendezvous`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!res.ok) throw new Error("Erreur API");
//         const data = await res.json();

//         const now = new Date();

//         // garder uniquement les RDV >= maintenant puis trier croissant
//         const upcoming = data
//           .filter((rv) => {
//             const d = parseRvDateTime(rv);
//             return (
//               d &&
//               d.getTime() >= now.getTime() &&
//               norm(rv.status) === "planifie"
//             );
//           })
//           .sort(byDateAsc);

//         // const upcoming = data
//         //   .filter((rv) => String(rv.status).toLowerCase() === "planifié")
//         //   .sort(byDateAsc);

//         setRendezVous(upcoming);
//       } catch (e) {
//         setError(e.message || "Erreur lors de la récupération des rendez_vous");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchRendezVous();
//   }, [navigate]);

//   const handleDelete = async (id) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer ce RendezVous ?")) {
//       setIsLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `${API_BASE_URL}/api/Patient/rendezvous/${id}`,
//           {
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             credentials: "include",
//           }
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(
//             errorData.message || `HTTP error! Status: ${response.status}`
//           );
//         }

//         setRendezVous(rendezVous.filter((RDV) => RDV.id !== id));
//       } catch (error) {
//         setError(error.message || "Erreur lors de la suppression du patient");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   }; 

//   return (
//     <div className="container py-3">
//       {/* Bloc global : en‑tête + liste des cartes */}
//       <div className="rdv-list border rounded-4 shadow-sm overflow-hidden card-rv">
//         {/* En‑tête du bloc */}
//         <div className="rdv-list-header px-3 py-2">
//           <h5 className="m-0 fw-semibold text-medical">Mes Rendez‑Vous</h5>
//         </div>

//         {/* Contenu */}
//         <div className="p-3">
//           {error && <div className="alert alert-danger mb-3">{error}</div>}

//           {isLoading ? (
//             <div className="text-center py-4">Chargement…</div>
//           ) : rendezVous.length === 0 ? (
//             <div className="text-center text-muted py-4">
//               Aucun rendez‑vous à venir
//             </div>
//           ) : (
//             // <div className="rdv-scroll">
//               <div className="d-flex flex-column gap-3">
//                 {rendezVous.map((rv) => {
//                   const { month, day, year, time } = fmtParts(rv);
//                   return (
//                     <div
//                       key={rv.id}
//                       className="rdv-card border rounded-3 p-3 d-flex flex-column flex-sm-row align-items-stretch"
//                     >
//                       {/* Bloc date */}
//                       <div className="rdv-datebox me-md-3 mb-3 mb-md-0 d-flex flex-column justify-content-center align-items-center mr-3">
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
//                       </div>

//                       {/* Actions */}
//                       <div className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
//                         <button className="btn btn-outline-medical btn-sm">
//                           Reporter
//                         </button>
//                         <button
//                           className="btn btn-outline-danger btn-sm"
//                           onClick={() => handleDelete(rv.id)}
//                         >
//                           Annuler
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             // </div> 
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GetAllRendezVous;




// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import { Modal, Button } from "react-bootstrap"; // 👈 utiliser react-bootstrap
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "./rdv-cards.css";

// function GetAllRendezVous() {
//   const [rendezVous, setRendezVous] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // ---- Modal "Reporter" ----
//   const [showResch, setShowResch] = useState(false);
//   const [targetRv, setTargetRv] = useState(null);
//   const [reschDate, setReschDate] = useState(""); // "YYYY-MM-DD"
//   const [slots, setSlots] = useState([]); // ["09:00","09:30",...]
//   const [slotLoading, setSlotLoading] = useState(false);
//   const [reschTime, setReschTime] = useState(""); // "HH:mm"
//   const [reschSaving, setReschSaving] = useState(false);
//   const [reschError, setReschError] = useState(null);

//   // Mois FR abrégés
//   const MONTHS_FR = [
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

//   // ---- helpers date ----
//   const parseRvDateTime = (rv) => {
//     const raw = String(rv.dateRendezVous || rv.date || "").trim();
//     const heureStr = String(rv.heure || "").trim();
//     if (!raw) return null;

//     // Support "DD/MM/YYYY", "DD-MM-YYYY" et "YYYY-MM-DD"
//     const [datePart, timeInline] = raw.split(" ");
//     const time = timeInline || heureStr || "00:00";

//     const parts = datePart.split(/[-/]/).map((x) => x.trim());
//     let day, monthIndex, year;

//     if (parts[0].length === 4) {
//       // "YYYY-MM-DD"
//       [year, monthIndex, day] = parts.map((n) => parseInt(n, 10));
//       monthIndex -= 1;
//     } else {
//       // "DD/MM/YYYY" ou "DD-MM-YYYY"
//       [day, monthIndex, year] = parts.map((n) => parseInt(n, 10));
//       monthIndex -= 1;
//     }

//     const [hh = "0", min = "0"] = time.split(":");
//     const d = new Date(
//       year,
//       monthIndex,
//       day,
//       parseInt(hh, 10) || 0,
//       parseInt(min, 10) || 0,
//       0,
//       0
//     );
//     return isNaN(d.getTime()) ? null : d;
//   };

//   const toISODate = (rv) => {
//     const d = parseRvDateTime(rv);
//     if (!d) return "";
//     const y = d.getFullYear();
//     const m = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${y}-${m}-${dd}`;
//   };

//   const norm = (s = "") =>
//     s
//       .toString()
//       .normalize("NFD")
//       .replace(/\p{Diacritic}/gu, "")
//       .toLowerCase()
//       .trim();

//   const byDateAsc = (a, b) => {
//     const da = parseRvDateTime(a);
//     const db = parseRvDateTime(b);
//     if (!da && !db) return 0;
//     if (!da) return 1;
//     if (!db) return -1;
//     return da - db;
//   };

//   const fmtParts = (rv) => {
//     const rawDate = (rv.dateRendezVous || rv.date || "").trim();
//     const heure = (rv.heure || "").trim();

//     if (!rawDate)
//       return { month: "--", day: "--", year: "----", time: heure || "--" };

//     const [datePart, timeInline] = rawDate.split(" ");
//     const p = datePart.split(/[-/]/);

//     let day, monthIndex, year;
//     if (p[0].length === 4) {
//       // YYYY-MM-DD
//       year = p[0];
//       monthIndex = (parseInt(p[1], 10) || 1) - 1;
//       day = p[2];
//     } else {
//       // DD/MM/YYYY ou DD-MM-YYYY
//       day = p[0];
//       monthIndex = (parseInt(p[1], 10) || 1) - 1;
//       year = p[2];
//     }

//     const month = MONTHS_FR[monthIndex] || "--";
//     const time = timeInline || heure || "--";
//     return { month, day: String(day).padStart(2, "0"), year, time };
//   };

//   const statusBadge = (status) => {
//     if (!status) return "bg-secondary";
//     const s = String(status).toLowerCase();
//     if (s.includes("confirm")) return "bg-success";
//     if (s.includes("annul") || s.includes("refus")) return "bg-danger";
//     if (s.includes("attente") || s.includes("pending"))
//       return "bg-warning text-dark";
//     return "bg-secondary";
//   };

//   const medecinLabel = (rv) =>
//     rv.medecinNom ||
//     (rv.medecin &&
//       `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
//     "N/A";

//   // --- fetch list (extrait pour pouvoir recharger après report) ---
//   const fetchRendezVous = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/Patient/rendezvous`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) throw new Error("Erreur API");
//       const data = await res.json();

//       const now = new Date();

//       const upcoming = data
//         .filter((rv) => {
//           const d = parseRvDateTime(rv);
//           return (
//             d && d.getTime() >= now.getTime() && norm(rv.status) === "planifie"
//           );
//         })
//         .sort(byDateAsc);

//       setRendezVous(upcoming);
//     } catch (e) {
//       setError(e.message || "Erreur lors de la récupération des rendez-vous");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchRendezVous();
//   }, [fetchRendezVous]);

//   // ---------------- Reschedule flow ----------------
//   const loadSlots = async (medecinId, dateISO) => {
//     if (!medecinId || !dateISO) return;
//     setSlotLoading(true);
//     setReschError(null);
//     try {
//       const token = localStorage.getItem("token");
//       const r = await fetch(
//         `${API_BASE_URL}/api/Patient/availability?medecinId=${medecinId}&date=${dateISO}&slot=30`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const j = await r.json().catch(() => ({}));
//       const free = Array.isArray(j.free) ? j.free : [];
//       setSlots(free);
//       // Pré-sélectionner le 1er créneau libre si aucun choisi
//       if (!reschTime && free.length) setReschTime(free[0]);
//       if (free.length === 0)
//         setReschError("Aucun créneau disponible pour cette date.");
//     } catch (e) {
//       setSlots([]);
//       setReschError(e.message || "Erreur lors du chargement des créneaux");
//     } finally {
//       setSlotLoading(false);
//     }
//   };

//   const openReschedule = (rv) => {
//     setTargetRv(rv);
//     const iso = toISODate(rv) || new Date().toISOString().slice(0, 10);
//     setReschDate(iso);
//     setReschTime("");
//     setReschError(null);
//     setShowResch(true);

//     const medId = rv.medecin?.id || rv.medecinId;
//     loadSlots(medId, iso);
//   };

//   const submitReschedule = async () => {
//     if (!targetRv || !reschDate || !reschTime) {
//       setReschError("Veuillez choisir une date et une heure.");
//       return;
//     }
//     setReschSaving(true);
//     setReschError(null);
//     try {
//       const token = localStorage.getItem("token");
//       const r = await fetch(
//         `${API_BASE_URL}/api/Patient/rendezvous/${targetRv.id}/reporter`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ newDate: reschDate, newHeure: reschTime }),
//           credentials: "include",
//         }
//       );
//       const j = await r.json().catch(() => ({}));
//       if (!r.ok) throw new Error(j.message || `HTTP ${r.status}`);

//       setShowResch(false);
//       await fetchRendezVous(); // recharger la liste et re-trier
//     } catch (e) {
//       setReschError(e.message);
//     } finally {
//       setReschSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?"))
//       return;
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `${API_BASE_URL}/api/Patient/rendezvous/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         }
//       );
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `HTTP ${response.status}`);
//       }
//       setRendezVous((prev) => prev.filter((RDV) => RDV.id !== id));
//     } catch (e) {
//       setError(e.message || "Erreur lors de l'annulation");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container py-3">
//       <div className="rdv-list border rounded-4 shadow-sm overflow-hidden card-rv">
//         <div className="rdv-list-header px-3 py-2">
//           <h5 className="m-0 fw-semibold text-medical">Mes Rendez-Vous</h5>
//         </div>

//         <div className="p-3">
//           {error && <div className="alert alert-danger mb-3">{error}</div>}

//           {isLoading ? (
//             <div className="text-center py-4">Chargement…</div>
//           ) : rendezVous.length === 0 ? (
//             <div className="text-center text-muted py-4">
//               Aucun rendez-vous à venir
//             </div>
//           ) : (
//             <div className="d-flex flex-column gap-3">
//               {rendezVous.map((rv) => {
//                 const { month, day, year, time } = fmtParts(rv);
//                 return (
//                   <div
//                     key={rv.id}
//                     className="rdv-card border rounded-3 p-3 d-flex flex-column flex-sm-row align-items-stretch"
//                   >
//                     {/* Date */}
//                     <div className="rdv-datebox me-md-3 mb-3 mb-md-0 d-flex flex-column justify-content-center align-items-center mr-3">
//                       <div className="rdv-month">{month}</div>
//                       <div className="rdv-day">
//                         {day} <small className="text-muted">{year}</small>
//                       </div>
//                       <div className="rdv-time">{time}</div>
//                     </div>

//                     {/* Infos */}
//                     <div className="flex-fill d-flex flex-column justify-content-center">
//                       <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
//                         <span className="badge bg-medical-soft text-medical fw-medium">
//                           Rendez-vous
//                         </span>
//                         <span className={`badge ${statusBadge(rv.status)}`}>
//                           {rv.status || "—"}
//                         </span>
//                       </div>
//                       <div className="fw-semibold">
//                         Motif :{" "}
//                         <span className="text-body">{rv.motif || "—"}</span>
//                       </div>
//                       <div className="text-muted">Dr {medecinLabel(rv)}</div>
//                     </div>

//                     {/* Actions */}
//                     <div className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
//                       <button
//                         className="btn btn-outline-medical btn-sm"
//                         onClick={() => openReschedule(rv)}
//                       >
//                         Reporter
//                       </button>
//                       <button
//                         className="btn btn-outline-danger btn-sm"
//                         onClick={() => handleDelete(rv.id)}
//                       >
//                         Annuler
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* -------- Modal Reporter -------- */}
//       <Modal
//         show={showResch}
//         onHide={() => !reschSaving && setShowResch(false)}
//         centered
//       >
//         <Modal.Header closeButton={!reschSaving}>
//           <Modal.Title>Reporter le rendez-vous</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {reschError && <div className="alert alert-danger">{reschError}</div>}

//           <div className="mb-3">
//             <label className="form-label">Date</label>
//             <input
//               type="date"
//               className="form-control"
//               value={reschDate}
//               min={new Date().toISOString().slice(0, 10)}
//               onChange={(e) => {
//                 const v = e.target.value;
//                 setReschDate(v);
//                 setReschTime("");
//                 const medId = targetRv?.medecin?.id || targetRv?.medecinId;
//                 loadSlots(medId, v);
//               }}
//               disabled={reschSaving}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Heure</label>
//             {slotLoading ? (
//               <div className="form-text">Chargement des créneaux…</div>
//             ) : (
//               <select
//                 className="form-select"
//                 value={reschTime}
//                 onChange={(e) => setReschTime(e.target.value)}
//                 disabled={reschSaving || slots.length === 0}
//                 required
//               >
//                 <option value="" disabled>
//                   {slots.length
//                     ? "Choisir un créneau"
//                     : "Aucun créneau disponible"}
//                 </option>
//                 {slots.map((h) => (
//                   <option key={h} value={h}>
//                     {h}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="outline-secondary"
//             onClick={() => setShowResch(false)}
//             disabled={reschSaving}
//           >
//             Fermer
//           </Button>
//           <Button
//             variant="primary"
//             onClick={submitReschedule}
//             disabled={reschSaving || !reschDate || !reschTime}
//           >
//             {reschSaving ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" />
//                 Enregistrement…
//               </>
//             ) : (
//               "Enregistrer"
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default GetAllRendezVous;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import { Modal, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./rdv-cards.css";

function GetAllRendezVous() {
  const navigate = useNavigate();

  // -------- Liste RDV --------
  const [rendezVous, setRendezVous] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------- Modal Reporter --------
  const [showResch, setShowResch] = useState(false);
  const [targetRv, setTargetRv] = useState(null);
  const [reschDate, setReschDate] = useState(""); // "YYYY-MM-DD"
  const [reschTime, setReschTime] = useState(""); // "HH:mm"
  const [slots, setSlots] = useState([]);         // ["09:00","09:30",...]
  const [slotLoading, setSlotLoading] = useState(false);
  const [reschSaving, setReschSaving] = useState(false);
  const [reschError, setReschError] = useState(null);

  // Mois FR abrégés (affichage)
  const MONTHS_FR = [
    "janv","févr","mars","avr","mai","juin","juil","août","sept","oct","nov","déc"
  ];

  // ---------- Helpers ----------
  const norm = (s = "") =>
    s.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

  const isStatusPlanifie = (s = "") => norm(s).includes("planif");

  // date locale YYYY-MM-DD (évite le décalage UTC)
  const localISODate = (d = new Date()) => {
    const tz = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tz * 60000);
    return local.toISOString().slice(0, 10);
  };

  // parse datetime depuis les champs possibles
  const parseRvDateTime = (rv) => {
    const raw = String(rv.dateRendezVous || rv.date || "").trim();
    const heureStr = String(rv.heure || "").trim();
    if (!raw) return null;

    let datePart = raw;
    let time = heureStr || "00:00";
    if (raw.includes(" ")) {
      const [dPart, tPart] = raw.split(" ");
      datePart = dPart;
      time = tPart || time;
    }

    const parts = datePart.split(/[-/]/).map((x) => x.trim());
    let day, monthIndex, year;
    if (parts[0]?.length === 4) {
      // YYYY-MM-DD
      [year, monthIndex, day] = parts.map((n) => parseInt(n, 10));
      monthIndex -= 1;
    } else {
      // DD/MM/YYYY ou DD-MM-YYYY
      [day, monthIndex, year] = parts.map((n) => parseInt(n, 10));
      monthIndex -= 1;
    }

    const [hh = "0", mm = "0"] = String(time).split(":");
    const d = new Date(
      year,
      isNaN(monthIndex) ? 0 : monthIndex,
      day,
      parseInt(hh, 10) || 0,
      parseInt(mm, 10) || 0,
      0,
      0
    );
    return isNaN(d.getTime()) ? null : d;
  };

  const byDateAsc = (a, b) => {
    const da = parseRvDateTime(a);
    const db = parseRvDateTime(b);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return da - db;
  };

  // parts pour affichage "mois, jour, année, heure"
  const fmtParts = (rv) => {
    const rawDate = String(rv.dateRendezVous || rv.date || "").trim();
    const heure = String(rv.heure || "").trim();

    if (!rawDate) return { month: "--", day: "--", year: "----", time: heure || "--" };

    const [datePart, timeInline] = rawDate.split(" ");
    const p = datePart.split(/[-/]/);

    let day, monthIndex, year;
    if (p[0]?.length === 4) {
      // YYYY-MM-DD
      year = p[0];
      monthIndex = (parseInt(p[1], 10) || 1) - 1;
      day = p[2];
    } else {
      // DD/MM/YYYY ou DD-MM-YYYY
      day = p[0];
      monthIndex = (parseInt(p[1], 10) || 1) - 1;
      year = p[2];
    }

    const month = MONTHS_FR[monthIndex] || "--";
    const time = timeInline || heure || "--";
    return { month, day: String(day).padStart(2, "0"), year, time };
  };

  const statusBadge = (status) => {
    if (!status) return "bg-secondary";
    const s = norm(status);
    if (s.includes("confirm")) return "bg-success";
    if (s.includes("annul") || s.includes("refus")) return "bg-danger";
    if (s.includes("attente") || s.includes("pending")) return "bg-warning text-dark";
    if (s.includes("planif")) return "bg-info text-dark";
    return "bg-secondary";
  };

  const medecinLabel = (rv) =>
    rv.medecinNom ||
    (rv.medecin && `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
    "N/A";

  const getMedecinId = (rv) =>
    rv?.medecinId ??
    rv?.medecin?.id ??
    rv?.medecin?.medecinId ??
    rv?.idMedecin ??
    null;

  // ---------- Fetch liste RDV ----------
  const fetchRendezVous = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/Patient/rendezvous`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Erreur API (${res.status})`);
      const data = await res.json();

      const now = new Date();
      const upcoming = (data || [])
        .filter((rv) => {
          const d = parseRvDateTime(rv);
          return d && d.getTime() >= now.getTime() && isStatusPlanifie(rv.status);
        })
        .sort(byDateAsc);

      setRendezVous(upcoming);
    } catch (e) {
      setError(e.message || "Erreur lors de la récupération des rendez-vous");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRendezVous();
  }, [fetchRendezVous]);

  // ---------- Availability (exactement comme CreateRendezVous) ----------
  const loadSlots = async (medecinId, dateISO) => {
    setSlots([]);
    setReschError(null);
    if (!medecinId || !dateISO) return;

    setSlotLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${API_BASE_URL}/api/Patient/availability?medecinId=${medecinId}&date=${dateISO}&slot=60`;

      const resp = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`GET /availability -> ${resp.status} ${text}`);
      }

      const data = await resp.json();

      // 👉 même clé que dans CreateRendezVous :
      const free = Array.isArray(data?.freeSlots) ? data.freeSlots : [];

      setSlots(free);
      if (!reschTime && free.length) setReschTime(free[0]);
      if (free.length === 0) setReschError("Aucun créneau disponible pour cette date.");
    } catch (e) {
      setSlots([]);
      setReschError(e.message || "Erreur lors du chargement des créneaux");
    } finally {
      setSlotLoading(false);
    }
  };

  const openReschedule = (rv) => {
    const medId = getMedecinId(rv);
    setTargetRv(rv);

    // partir de la date du RV si possible, sinon aujourd’hui (local)
    const raw = String(rv.dateRendezVous || rv.date || "").trim();
    let iso = localISODate(); // fallback
    if (raw) {
      const datePart = raw.split(" ")[0];
      const p = datePart.split(/[-/]/);
      if (p[0]?.length === 4) {
        // YYYY-MM-DD
        iso = p.slice(0, 3).join("-");
      } else if (p.length === 3) {
        // DD/MM/YYYY ou DD-MM-YYYY
        const [d, m, y] = p;
        const mm = String(parseInt(m, 10)).padStart(2, "0");
        const dd = String(parseInt(d, 10)).padStart(2, "0");
        iso = `${y}-${mm}-${dd}`;
      }
    }

    setReschDate(iso);
    setReschTime("");
    setReschError(null);
    setShowResch(true);

    // charge les créneaux comme dans CreateRendezVous
    loadSlots(medId, iso);
  };

  const submitReschedule = async () => {
    if (!targetRv || !reschDate || !reschTime) {
      setReschError("Veuillez choisir une date et une heure.");
      return;
    }
    setReschSaving(true);
    setReschError(null);
    try {
      const token = localStorage.getItem("token");
      const r = await fetch(
        `${API_BASE_URL}/api/Patient/rendezvous/${targetRv.id}/reporter`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newDate: reschDate, newHeure: reschTime }),
          credentials: "include",
        }
      );

      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j?.message || `HTTP ${r.status}`);
      }

      setShowResch(false);
      await fetchRendezVous(); // recharger la liste
    } catch (e) {
      setReschError(e.message);
    } finally {
      setReschSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/Patient/rendezvous/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      setRendezVous((prev) => prev.filter((RDV) => RDV.id !== id));
    } catch (e) {
      setError(e.message || "Erreur lors de l'annulation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-3">
      <div className="rdv-list border rounded-4 shadow-sm overflow-hidden card-rv">
        <div className="rdv-list-header px-3 py-2">
          <h5 className="m-0 fw-semibold text-medical">Mes Rendez-Vous</h5>
        </div>

        <div className="p-3">
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          {isLoading ? (
            <div className="text-center py-4">Chargement…</div>
          ) : rendezVous.length === 0 ? (
            <div className="text-center text-muted py-4">
              Aucun rendez-vous à venir
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {rendezVous.map((rv) => {
                const { month, day, year, time } = fmtParts(rv);
                return (
                  <div
                    key={rv.id}
                    className="rdv-card border rounded-3 p-3 d-flex flex-column flex-sm-row align-items-stretch"
                  >
                    {/* Date */}
                    <div className="rdv-datebox me-md-3 mb-3 mb-md-0 d-flex flex-column justify-content-center align-items-center mr-3">
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
                        Motif : <span className="text-body">{rv.motif || "—"}</span>
                      </div>
                      <div className="text-muted">Dr {medecinLabel(rv)}</div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
                      <button
                        className="btn btn-outline-medical btn-sm"
                        onClick={() => openReschedule(rv)}
                      >
                        Reporter
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(rv.id)}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* -------- Modal Reporter -------- */}
      <Modal
        show={showResch}
        onHide={() => !reschSaving && setShowResch(false)}
        centered
      >
        <Modal.Header closeButton={!reschSaving}>
          <Modal.Title>Reporter le rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reschError && <div className="alert alert-danger">{reschError}</div>}

          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={reschDate}
              min={localISODate(new Date())}      
              onChange={(e) => {
                const v = e.target.value;
                setReschDate(v);
                setReschTime("");
                const medId = getMedecinId(targetRv);
                loadSlots(medId, v);               {/* ✅ recharge comme CreateRendezVous */}
              }}
              disabled={reschSaving}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Heure</label>
            {slotLoading ? (
              <div className="form-text">Chargement des créneaux…</div>
            ) : (
              <select
                className="form-select"
                value={reschTime}
                onChange={(e) => setReschTime(e.target.value)}
                disabled={reschSaving || slots.length === 0}
                required
              >
                <option value="">
                  {slots.length ? "Choisir un créneau" : "Aucun créneau disponible"}
                </option>
                {slots.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowResch(false)}
            disabled={reschSaving}
          >
            Fermer
          </Button>
          <Button
            variant="primary"
            onClick={submitReschedule}
            disabled={reschSaving || !reschDate || !reschTime}
          >
            {reschSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Enregistrement…
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GetAllRendezVous;




// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import { Modal, Button } from "react-bootstrap";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "./rdv-cards.css";

// function GetAllRendezVous() {
//   const navigate = useNavigate();

//   // -------- Liste RDV --------
//   const [rendezVous, setRendezVous] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // -------- Modal Reporter --------
//   const [showResch, setShowResch] = useState(false);
//   const [targetRv, setTargetRv] = useState(null);

//   const [reschMedId, setReschMedId] = useState(null);       // médecin figé
//   const [reschMedLabel, setReschMedLabel] = useState("");   // libellé "Dr ..."

//   const [reschDate, setReschDate] = useState("");           // YYYY-MM-DD
//   const [slots, setSlots] = useState([]);                   // ["09:00","09:30",...]
//   const [slotLoading, setSlotLoading] = useState(false);
//   const [reschTime, setReschTime] = useState("");           // HH:mm
//   const [reschSaving, setReschSaving] = useState(false);
//   const [reschError, setReschError] = useState(null);

//   // Mois FR abrégés
//   const MONTHS_FR = ["janv","févr","mars","avr","mai","juin","juil","août","sept","oct","nov","déc"];

//   // -------- Helpers dates --------
//   const parseRvDateTime = (rv) => {
//     const raw = String(rv.dateRendezVous || rv.date || "").trim();
//     const heureStr = String(rv.heure || "").trim();
//     if (!raw) return null;

//     const [datePart, timeInline] = raw.split(" "); // "15/08/2025 16:30"
//     const time = timeInline || heureStr || "00:00";

//     const parts = (datePart || "").split(/[-/]/).map((x) => x.trim());
//     let day, monthIndex, year;
//     if (!parts.length) return null;

//     if (parts[0]?.length === 4) {
//       // YYYY-MM-DD
//       year = parseInt(parts[0], 10);
//       monthIndex = (parseInt(parts[1], 10) || 1) - 1;
//       day = parseInt(parts[2], 10);
//     } else {
//       // DD/MM/YYYY ou DD-MM-YYYY
//       day = parseInt(parts[0], 10);
//       monthIndex = (parseInt(parts[1], 10) || 1) - 1;
//       year = parseInt(parts[2], 10);
//     }
//     if (Number.isNaN(day) || Number.isNaN(monthIndex) || Number.isNaN(year)) return null;

//     const [hh = "0", min = "0"] = time.split(":");
//     const d = new Date(year, monthIndex, day, parseInt(hh, 10) || 0, parseInt(min, 10) || 0, 0, 0);
//     return Number.isNaN(d.getTime()) ? null : d;
//   };

//   const toISODate = (rv) => {
//     const d = parseRvDateTime(rv);
//     if (!d) return "";
//     const y = d.getFullYear();
//     const m = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${y}-${m}-${dd}`;
//   };

//   const norm = (s = "") =>
//     s.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

//   const byDateAsc = (a, b) => {
//     const da = parseRvDateTime(a);
//     const db = parseRvDateTime(b);
//     if (!da && !db) return 0;
//     if (!da) return 1;
//     if (!db) return -1;
//     return da - db;
//   };

//   const fmtParts = (rv) => {
//     const rawDate = (rv.dateRendezVous || rv.date || "").trim();
//     const heure = (rv.heure || "").trim();
//     if (!rawDate) return { month: "--", day: "--", year: "----", time: heure || "--" };

//     const [datePart, timeInline] = rawDate.split(" ");
//     const p = (datePart || "").split(/[-/]/);
//     let day, monthIndex, year;
//     if (p[0]?.length === 4) {
//       year = p[0];
//       monthIndex = (parseInt(p[1], 10) || 1) - 1;
//       day = p[2];
//     } else {
//       day = p[0];
//       monthIndex = (parseInt(p[1], 10) || 1) - 1;
//       year = p[2];
//     }
//     const month = MONTHS_FR[monthIndex] || "--";
//     const time = timeInline || heure || "--";
//     return { month, day: String(day).padStart(2, "0"), year, time };
//   };

//   const statusBadge = (status) => {
//     if (!status) return "bg-secondary";
//     const s = String(status).toLowerCase();
//     if (s.includes("confirm")) return "bg-success";
//     if (s.includes("annul") || s.includes("refus")) return "bg-danger";
//     if (s.includes("attente") || s.includes("pending")) return "bg-warning text-dark";
//     return "bg-secondary";
//   };

//   const medecinLabel = (rv) =>
//     rv.medecinNom ||
//     (rv.medecin && `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
//     "N/A";

//   // -------- Fetch liste RDV --------
//   const fetchRendezVous = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/Patient/rendezvous`, {
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Erreur API");
//       const data = await res.json();

//       const now = new Date();
//       const upcoming = data
//         .filter((rv) => {
//           const d = parseRvDateTime(rv);
//           return d && d.getTime() >= now.getTime() && norm(rv.status) === "planifie";
//         })
//         .sort(byDateAsc);

//       setRendezVous(upcoming);
//     } catch (e) {
//       setError(e.message || "Erreur lors de la récupération des rendez-vous");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchRendezVous();
//   }, [fetchRendezVous]);

//   // -------- Assurer le medecinId pour le modal --------
//   const ensureMedecinId = async (rv) => {
//     let id = rv?.medecin?.id ?? rv?.medecinId ?? null;
//     if (id) return { id, label: medecinLabel(rv) };

//     const token = localStorage.getItem("token");
//     const r = await fetch(`${API_BASE_URL}/api/Patient/rendezvous/${rv.id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const j = await r.json().catch(() => ({}));
//     id = j?.medecin?.id ?? j?.medecinId ?? null;
//     const label =
//       j?.medecinNom ||
//       (j?.medecin && `${j.medecin?.prenom ?? ""} ${j.medecin?.nom ?? ""}`.trim()) ||
//       medecinLabel(rv) ||
//       "N/A";
//     if (!id) throw new Error("Impossible d’identifier le médecin de ce rendez-vous.");
//     return { id, label };
//   };

//   // -------- Charger les créneaux pour CE médecin --------
//   const loadSlots = async (medecinId, dateISO) => {
//     if (!medecinId || !dateISO) return;
//     setSlotLoading(true);
//     setReschError(null);
//     try {
//       const token = localStorage.getItem("token");
//       const r = await fetch(
//         `${API_BASE_URL}/api/Patient/availability?medecinId=${medecinId}&date=${dateISO}&slot=30`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const j = await r.json().catch(() => ({}));
//       const free = Array.isArray(j.free) ? j.free : [];
//       setSlots(free);
//       if (!reschTime && free.length) setReschTime(free[0]);
//       if (free.length === 0) setReschError("Aucun créneau disponible pour cette date.");
//     } catch (e) {
//       setSlots([]);
//       setReschError(e.message || "Erreur lors du chargement des créneaux");
//     } finally {
//       setSlotLoading(false);
//     }
//   };

//   // -------- Ouvrir le modal (médecin figé) --------
//   const openReschedule = async (rv) => {
//     try {
//       setTargetRv(rv);
//       setReschError(null);
//       const iso = toISODate(rv) || new Date().toISOString().slice(0, 10);
//       setReschDate(iso);
//       setReschTime("");

//       const { id, label } = await ensureMedecinId(rv);
//       setReschMedId(id);
//       setReschMedLabel(label);

//       setShowResch(true);
//       await loadSlots(id, iso);
//     } catch (e) {
//       setReschError(e.message);
//       setShowResch(true);
//     }
//   };

//   // -------- Soumettre le report --------
//   const submitReschedule = async () => {
//     if (!targetRv || !reschDate || !reschTime || !reschMedId) {
//       setReschError("Veuillez choisir une date et une heure.");
//       return;
//     }
//     setReschSaving(true);
//     setReschError(null);
//     try {
//       const token = localStorage.getItem("token");
//       const r = await fetch(
//         `${API_BASE_URL}/api/Patient/rendezvous/${targetRv.id}/reporter`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ newDate: reschDate, newHeure: reschTime }),
//           credentials: "include",
//         }
//       );
//       const j = await r.json().catch(() => ({}));
//       if (!r.ok) throw new Error(j.message || `HTTP ${r.status}`);

//       setShowResch(false);
//       await fetchRendezVous(); // refresh liste
//     } catch (e) {
//       setReschError(e.message);
//     } finally {
//       setReschSaving(false);
//     }
//   };

//   // -------- Annuler (soft delete) --------
//   const handleDelete = async (id) => {
//     if (!window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) return;
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE_URL}/api/Patient/rendezvous/${id}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         credentials: "include",
//       });
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `HTTP ${response.status}`);
//       }
//       setRendezVous((prev) => prev.filter((RDV) => RDV.id !== id));
//     } catch (e) {
//       setError(e.message || "Erreur lors de l’annulation");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container py-3">
//       <div className="rdv-list border rounded-4 shadow-sm overflow-hidden card-rv">
//         <div className="rdv-list-header px-3 py-2">
//           <h5 className="m-0 fw-semibold text-medical">Mes Rendez-Vous</h5>
//         </div>

//         <div className="p-3">
//           {error && <div className="alert alert-danger mb-3">{error}</div>}

//           {isLoading ? (
//             <div className="text-center py-4">Chargement…</div>
//           ) : rendezVous.length === 0 ? (
//             <div className="text-center text-muted py-4">Aucun rendez-vous à venir</div>
//           ) : (
//             <div className="d-flex flex-column gap-3">
//               {rendezVous.map((rv) => {
//                 const { month, day, year, time } = fmtParts(rv);
//                 return (
//                   <div
//                     key={rv.id}
//                     className="rdv-card border rounded-3 p-3 d-flex flex-column flex-sm-row align-items-stretch"
//                   >
//                     {/* Date */}
//                     <div className="rdv-datebox me-md-3 mb-3 mb-md-0 d-flex flex-column justify-content-center align-items-center mr-3">
//                       <div className="rdv-month">{month}</div>
//                       <div className="rdv-day">
//                         {day} <small className="text-muted">{year}</small>
//                       </div>
//                       <div className="rdv-time">{time}</div>
//                     </div>

//                     {/* Infos */}
//                     <div className="flex-fill d-flex flex-column justify-content-center">
//                       <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
//                         <span className="badge bg-medical-soft text-medical fw-medium">Rendez-vous</span>
//                         <span className={`badge ${statusBadge(rv.status)}`}>{rv.status || "—"}</span>
//                       </div>
//                       <div className="fw-semibold">
//                         Motif : <span className="text-body">{rv.motif || "—"}</span>
//                       </div>
//                       <div className="text-muted">Dr {medecinLabel(rv)}</div>
//                     </div>

//                     {/* Actions */}
//                     <div className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
//                       <button
//                         className="btn btn-outline-medical btn-sm"
//                         onClick={() => openReschedule(rv)}
//                       >
//                         Reporter
//                       </button>
//                       <button
//                         className="btn btn-outline-danger btn-sm"
//                         onClick={() => handleDelete(rv.id)}
//                       >
//                         Annuler
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* -------- Modal Reporter -------- */}
//       <Modal show={showResch} onHide={() => !reschSaving && setShowResch(false)} centered>
//         <Modal.Header closeButton={!reschSaving}>
//           <Modal.Title>Reporter le rendez-vous</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {reschError && <div className="alert alert-danger">{reschError}</div>}

//           {/* Médecin (lecture seule) */}
//           <div className="mb-3">
//             <label className="form-label">Médecin</label>
//             <input className="form-control" value={reschMedLabel || "—"} disabled />
//           </div>

//           {/* Date */}
//           <div className="mb-3">
//             <label className="form-label">Date</label>
//             <input
//               type="date"
//               className="form-control"
//               value={reschDate}
//               min={new Date().toISOString().slice(0, 10)}
//               onChange={(e) => {
//                 const v = e.target.value;
//                 setReschDate(v);
//                 setReschTime("");
//                 if (reschMedId) loadSlots(reschMedId, v);
//               }}
//               disabled={reschSaving}
//               required
//             />
//           </div>

//           {/* Heure */}
//           <div className="mb-3">
//             <label className="form-label">Heure</label>
//             {slotLoading ? (
//               <div className="form-text">Chargement des créneaux…</div>
//             ) : (
//               <select
//                 className="form-select"
//                 value={reschTime}
//                 onChange={(e) => setReschTime(e.target.value)}
//                 disabled={reschSaving || slots.length === 0}
//                 required
//               >
//                 <option value="" disabled>
//                   {slots.length ? "Choisir un créneau" : "Aucun créneau disponible"}
//                 </option>
//                 {slots.map((h) => (
//                   <option key={h} value={h}>{h}</option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-secondary" onClick={() => setShowResch(false)} disabled={reschSaving}>
//             Fermer
//           </Button>
//           <Button variant="primary" onClick={submitReschedule} disabled={reschSaving || !reschDate || !reschTime}>
//             {reschSaving ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" />
//                 Enregistrement…
//               </>
//             ) : (
//               "Enregistrer"
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default GetAllRendezVous;


















// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import { Modal, Button } from "react-bootstrap";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "./rdv-cards.css";

// function GetAllRendezVous() {
//   const navigate = useNavigate();

//   // -------- Liste RDV --------
//   const [rendezVous, setRendezVous] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // -------- Modal Reporter --------
//   const [showResch, setShowResch] = useState(false);
//   const [targetRv, setTargetRv] = useState(null);

//   const [reschMedId, setReschMedId] = useState(null);       // médecin figé
//   const [reschMedLabel, setReschMedLabel] = useState("");   // libellé "Dr ..."

//   const [reschDate, setReschDate] = useState("");           // YYYY-MM-DD
//   const [slots, setSlots] = useState([]);                   // ["09:00","09:30",...]
//   const [slotLoading, setSlotLoading] = useState(false);
//   const [reschTime, setReschTime] = useState("");           // HH:mm
//   const [reschSaving, setReschSaving] = useState(false);
//   const [reschError, setReschError] = useState(null);

//   // Suggestion “prochaine date dispo”
//   const [nextSuggestion, setNextSuggestion] = useState(null);
//   // { dateISO: "YYYY-MM-DD", free: ["09:00", ...] }

//   // Mois FR abrégés
//   const MONTHS_FR = ["janv","févr","mars","avr","mai","juin","juil","août","sept","oct","nov","déc"];

//   // -------- Helpers dates --------
//   const parseRvDateTime = (rv) => {
//     const raw = String(rv.dateRendezVous || rv.date || "").trim();
//     const heureStr = String(rv.heure || "").trim();
//     if (!raw) return null;

//     const [datePart, timeInline] = raw.split(" "); // "15/08/2025 16:30"
//     const time = timeInline || heureStr || "00:00";

//     const parts = (datePart || "").split(/[-/]/).map((x) => x.trim());
//     let day, monthIndex, year;
//     if (!parts.length) return null;

//     if (parts[0]?.length === 4) {
//       // YYYY-MM-DD
//       year = parseInt(parts[0], 10);
//       monthIndex = (parseInt(parts[1], 10) || 1) - 1;
//       day = parseInt(parts[2], 10);
//     } else {
//       // DD/MM/YYYY ou DD-MM-YYYY
//       day = parseInt(parts[0], 10);
//       monthIndex = (parseInt(parts[1], 10) || 1) - 1;
//       year = parseInt(parts[2], 10);
//     }
//     if (Number.isNaN(day) || Number.isNaN(monthIndex) || Number.isNaN(year)) return null;

//     const [hh = "0", min = "0"] = time.split(":");
//     const d = new Date(year, monthIndex, day, parseInt(hh, 10) || 0, parseInt(min, 10) || 0, 0, 0);
//     return Number.isNaN(d.getTime()) ? null : d;
//   };

//   const toISODate = (rv) => {
//     const d = parseRvDateTime(rv);
//     if (!d) return "";
//     const y = d.getFullYear();
//     const m = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${y}-${m}-${dd}`;
//   };

//   const norm = (s = "") =>
//     s.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

//   const byDateAsc = (a, b) => {
//     const da = parseRvDateTime(a);
//     const db = parseRvDateTime(b);
//     if (!da && !db) return 0;
//     if (!da) return 1;
//     if (!db) return -1;
//     return da - db;
//   };

//   const fmtParts = (rv) => {
//     const rawDate = (rv.dateRendezVous || rv.date || "").trim();
//     const heure = (rv.heure || "").trim();
//     if (!rawDate) return { month: "--", day: "--", year: "----", time: heure || "--" };

//     const [datePart, timeInline] = rawDate.split(" ");
//     const p = (datePart || "").split(/[-/]/);
//     let day, monthIndex, year;
//     if (p[0]?.length === 4) {
//       year = p[0];
//       monthIndex = (parseInt(p[1], 10) || 1) - 1;
//       day = p[2];
//     } else {
//       day = p[0];
//       monthIndex = (parseInt(p[1], 10) || 1) - 1;
//       year = p[2];
//     }
//     const month = MONTHS_FR[monthIndex] || "--";
//     const time = timeInline || heure || "--";
//     return { month, day: String(day).padStart(2, "0"), year, time };
//   };

//   const statusBadge = (status) => {
//     if (!status) return "bg-secondary";
//     const s = String(status).toLowerCase();
//     if (s.includes("confirm")) return "bg-success";
//     if (s.includes("annul") || s.includes("refus")) return "bg-danger";
//     if (s.includes("attente") || s.includes("pending")) return "bg-warning text-dark";
//     return "bg-secondary";
//   };

//   const medecinLabel = (rv) =>
//     rv.medecinNom ||
//     (rv.medecin && `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
//     "N/A";

//   // -------- Fetch liste RDV --------
//   const fetchRendezVous = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/Patient/rendezvous`, {
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Erreur API");
//       const data = await res.json();

//       const now = new Date();
//       const upcoming = data
//         .filter((rv) => {
//           const d = parseRvDateTime(rv);
//           return d && d.getTime() >= now.getTime() && norm(rv.status) === "planifie";
//         })
//         .sort(byDateAsc);

//       setRendezVous(upcoming);
//     } catch (e) {
//       setError(e.message || "Erreur lors de la récupération des rendez-vous");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchRendezVous();
//   }, [fetchRendezVous]);

//   // -------- Assurer le medecinId pour le modal --------
//   const ensureMedecinId = async (rv) => {
//     let id = rv?.medecin?.id ?? rv?.medecinId ?? null;
//     if (id) return { id, label: medecinLabel(rv) };

//     const token = localStorage.getItem("token");
//     const r = await fetch(`${API_BASE_URL}/api/Patient/rendezvous/${rv.id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const j = await r.json().catch(() => ({}));
//     id = j?.medecin?.id ?? j?.medecinId ?? null;
//     const label =
//       j?.medecinNom ||
//       (j?.medecin && `${j.medecin?.prenom ?? ""} ${j.medecin?.nom ?? ""}`.trim()) ||
//       medecinLabel(rv) ||
//       "N/A";
//     if (!id) throw new Error("Impossible d’identifier le médecin de ce rendez-vous.");
//     return { id, label };
//   };

//   // -------- Trouver la prochaine date dispo (jusqu’à 30 jours) --------
//   async function findNextAvailability(medecinId, fromISO, maxDays = 30) {
//     const token = localStorage.getItem("token");
//     let d = new Date(fromISO);
//     for (let i = 1; i <= maxDays; i++) {
//       const nd = new Date(d); nd.setDate(d.getDate() + i);
//       const iso = nd.toISOString().slice(0, 10); // YYYY-MM-DD
//       const r = await fetch(
//         //`${API_BASE_URL}/api/Patient/availability?medecinId=${medecinId}&date=${iso}&slot=60`
//         `${API_BASE_URL}/api/Patient/availability?medecinId=${reschMedId}&date=${dateISO}&slot=30&excludeRendezVousId=${
//           targetRv?.id || ""
//         }`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const j = await r.json().catch(() => ({}));
//       const free = Array.isArray(j.free) ? j.free : [];
//       if (free.length) return { dateISO: iso, free };
//     }
//     return null;
//   }

//   // -------- Charger les créneaux pour CE médecin --------
//   // const loadSlots = async (medecinId, dateISO) => {
//   //   if (!medecinId || !dateISO) return;
//   //   setSlotLoading(true);
//   //   setReschError(null);
//   //   setNextSuggestion(null);

//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const r = await fetch(
//   //       `${API_BASE_URL}/api/Patient/availability?medecinId=${medecinId}&date=${dateISO}&slot=30`,
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );
//   //     const j = await r.json().catch(() => ({}));
//   //     const free = Array.isArray(j.free) ? j.free : [];
//   //     setSlots(free);
//   //     if (!reschTime && free.length) setReschTime(free[0]);

//   //     if (free.length === 0) {
//   //       setReschError("Aucun créneau disponible pour cette date.");
//   //       const sugg = await findNextAvailability(medecinId, dateISO, 30);
//   //       if (sugg) setNextSuggestion(sugg);
//   //     }
//   //   } catch (e) {
//   //     setSlots([]);
//   //     setReschError(e.message || "Erreur lors du chargement des créneaux");
//   //   } finally {
//   //     setSlotLoading(false);
//   //   }
//   // };
//   const loadSlots = async (medecinId, dateISO, excludeId) => {
//     if (!medecinId || !dateISO) return;
//     setSlotLoading(true);
//     setReschError(null);
//     setNextSuggestion(null);

//     try {
//       const token = localStorage.getItem("token");
//       const url =
//         `${API_BASE_URL}/api/Patient/availability` +
//         `?medecinId=${medecinId}` +
//         `&date=${encodeURIComponent(dateISO)}` +
//         `&slot=30` +
//         (excludeId ? `&excludeRendezVousId=${excludeId}` : "");

//       const r = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const j = await r.json().catch(() => ({}));
//       const free = Array.isArray(j.free) ? j.free : [];

//       setSlots(free);
//       if (!reschTime && free.length) setReschTime(free[0]);

//       if (free.length === 0) {
//         setReschError("Aucun créneau disponible pour cette date.");
//         const sugg = await findNextAvailability(medecinId, dateISO, 30);
//         if (sugg) setNextSuggestion(sugg);
//       }
//     } catch (e) {
//       setSlots([]);
//       setReschError(e.message || "Erreur lors du chargement des créneaux");
//     } finally {
//       setSlotLoading(false);
//     }
//   };


//   // -------- Ouvrir le modal (médecin figé) --------
//   // const openReschedule = async (rv) => {
//   //   try {
//   //     setTargetRv(rv);
//   //     setReschError(null);
//   //     setNextSuggestion(null);

//   //     const iso = toISODate(rv) || new Date().toISOString().slice(0, 10);
//   //     setReschDate(iso);
//   //     setReschTime("");

//   //     const { id, label } = await ensureMedecinId(rv);
//   //     setReschMedId(id);
//   //     setReschMedLabel(label);

//   //     setShowResch(true);
//   //     await loadSlots(id, iso);
//   //   } catch (e) {
//   //     setReschError(e.message);
//   //     setShowResch(true);
//   //   }
//   // };

//   const openReschedule = async (rv) => {
//     try {
//       setTargetRv(rv);
//       setReschError(null);
//       setNextSuggestion(null);

//       const iso = toISODate(rv) || new Date().toISOString().slice(0, 10);
//       setReschDate(iso);
//       setReschTime("");

//       const { id, label } = await ensureMedecinId(rv);
//       setReschMedId(id);
//       setReschMedLabel(label);

//       setShowResch(true);
//       await loadSlots(id, iso, rv.id); // 👈 excludeId passé ici
//     } catch (e) {
//       setReschError(e.message);
//       setShowResch(true);
//     }
//   };


//   // -------- Soumettre le report --------
//   const submitReschedule = async () => {
//     if (!targetRv || !reschDate || !reschTime || !reschMedId) {
//       setReschError("Veuillez choisir une date et une heure.");
//       return;
//     }
//     setReschSaving(true);
//     setReschError(null);
//     try {
//       const token = localStorage.getItem("token");
//       const r = await fetch(
//         `${API_BASE_URL}/api/Patient/rendezvous/${targetRv.id}/reporter`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ newDate: reschDate, newHeure: reschTime }),
//           credentials: "include",
//         }
//       );
//       const j = await r.json().catch(() => ({}));
//       if (!r.ok) throw new Error(j.message || `HTTP ${r.status}`);

//       setShowResch(false);
//       await fetchRendezVous(); // refresh liste
//     } catch (e) {
//       setReschError(e.message);
//     } finally {
//       setReschSaving(false);
//     }
//   };

//   // -------- Annuler (soft delete) --------
//   const handleDelete = async (id) => {
//     if (!window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) return;
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE_URL}/api/Patient/rendezvous/${id}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         credentials: "include",
//       });
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `HTTP ${response.status}`);
//       }
//       setRendezVous((prev) => prev.filter((RDV) => RDV.id !== id));
//     } catch (e) {
//       setError(e.message || "Erreur lors de l’annulation");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container py-3">
//       <div className="rdv-list border rounded-4 shadow-sm overflow-hidden card-rv">
//         <div className="rdv-list-header px-3 py-2">
//           <h5 className="m-0 fw-semibold text-medical">Mes Rendez-Vous</h5>
//         </div>

//         <div className="p-3">
//           {error && <div className="alert alert-danger mb-3">{error}</div>}

//           {isLoading ? (
//             <div className="text-center py-4">Chargement…</div>
//           ) : rendezVous.length === 0 ? (
//             <div className="text-center text-muted py-4">
//               Aucun rendez-vous à venir
//             </div>
//           ) : (
//             <div className="d-flex flex-column gap-3">
//               {rendezVous.map((rv) => {
//                 const { month, day, year, time } = fmtParts(rv);
//                 return (
//                   <div
//                     key={rv.id}
//                     className="rdv-card border rounded-3 p-3 d-flex flex-column flex-sm-row align-items-stretch"
//                   >
//                     {/* Date */}
//                     <div className="rdv-datebox me-md-3 mb-3 mb-md-0 d-flex flex-column justify-content-center align-items-center mr-3">
//                       <div className="rdv-month">{month}</div>
//                       <div className="rdv-day">
//                         {day} <small className="text-muted">{year}</small>
//                       </div>
//                       <div className="rdv-time">{time}</div>
//                     </div>

//                     {/* Infos */}
//                     <div className="flex-fill d-flex flex-column justify-content-center">
//                       <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
//                         <span className="badge bg-medical-soft text-medical fw-medium">
//                           Rendez-vous
//                         </span>
//                         <span className={`badge ${statusBadge(rv.status)}`}>
//                           {rv.status || "—"}
//                         </span>
//                       </div>
//                       <div className="fw-semibold">
//                         Motif :{" "}
//                         <span className="text-body">{rv.motif || "—"}</span>
//                       </div>
//                       <div className="text-muted">Dr {medecinLabel(rv)}</div>
//                     </div>

//                     {/* Actions */}
//                     <div className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
//                       <button
//                         className="btn btn-outline-medical btn-sm"
//                         onClick={() => openReschedule(rv)}
//                       >
//                         Reporter
//                       </button>
//                       <button
//                         className="btn btn-outline-danger btn-sm"
//                         onClick={() => handleDelete(rv.id)}
//                       >
//                         Annuler
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* -------- Modal Reporter -------- */}
//       <Modal
//         show={showResch}
//         onHide={() => !reschSaving && setShowResch(false)}
//         centered
//       >
//         <Modal.Header closeButton={!reschSaving}>
//           <Modal.Title>Reporter le rendez-vous</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {reschError && <div className="alert alert-danger">{reschError}</div>}

//           {/* Suggestion “prochaine dispo” */}
//           {nextSuggestion && (
//             <div className="alert alert-info">
//               Des créneaux existent le{" "}
//               <strong>
//                 {nextSuggestion.dateISO.split("-").reverse().join("/")}
//               </strong>{" "}
//               ({nextSuggestion.free.length} créneau(x)).
//               <div className="mt-2">
//                 <button
//                   type="button"
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => {
//                     setReschDate(nextSuggestion.dateISO);
//                     setSlots(nextSuggestion.free);
//                     setReschTime(nextSuggestion.free[0] || "");
//                     setNextSuggestion(null);
//                     setReschError(null);
//                   }}
//                 >
//                   Choisir cette date
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Médecin (lecture seule) */}
//           <div className="mb-3">
//             <label className="form-label">Médecin</label>
//             <input
//               className="form-control"
//               value={reschMedLabel || "—"}
//               disabled
//             />
//           </div>

//           {/* Date */}
//           <div className="mb-3">
//             <label className="form-label">Date</label>
//             {/* <input
//               type="date"
//               className="form-control"
//               value={reschDate}
//               min={new Date().toISOString().slice(0, 10)}
//               onChange={(e) => {
//                 const v = e.target.value;
//                 setReschDate(v);
//                 setReschTime("");
//                 if (reschMedId) loadSlots(reschMedId, v);
//               }}
//               disabled={reschSaving}
//               required
//             /> */}
//             <input
//               type="date"
//               className="form-control"
//               value={reschDate}
//               min={new Date().toISOString().slice(0, 10)}
//               onChange={(e) => {
//                 const v = e.target.value;
//                 setReschDate(v);
//                 setReschTime("");
//                 if (reschMedId) loadSlots(reschMedId, v, targetRv?.id); // 👈 pas de variable globale "dateISO"
//               }}
//               disabled={reschSaving}
//               required
//             />
//           </div>

//           {/* Heure */}
//           <div className="mb-3">
//             <label className="form-label">Heure</label>
//             {slotLoading ? (
//               <div className="form-text">Chargement des créneaux…</div>
//             ) : (
//               <select
//                 className="form-select"
//                 value={reschTime}
//                 onChange={(e) => setReschTime(e.target.value)}
//                 disabled={reschSaving || slots.length === 0}
//                 required
//               >
//                 <option value="" disabled>
//                   {slots.length
//                     ? "Choisir un créneau"
//                     : "Aucun créneau disponible"}
//                 </option>
//                 {slots.map((h) => (
//                   <option key={h} value={h}>
//                     {h}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="outline-secondary"
//             onClick={() => setShowResch(false)}
//             disabled={reschSaving}
//           >
//             Fermer
//           </Button>
//           <Button
//             variant="primary"
//             onClick={submitReschedule}
//             disabled={reschSaving || !reschDate || !reschTime}
//           >
//             {reschSaving ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" />
//                 Enregistrement…
//               </>
//             ) : (
//               "Enregistrer"
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default GetAllRendezVous;
