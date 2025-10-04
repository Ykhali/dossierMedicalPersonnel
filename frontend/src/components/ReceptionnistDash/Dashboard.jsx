// // src/pages/ReceptionnisteDashboard.jsx
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// /* ===== Helpers auth (adapte si tu as déjà des utils) ===== */
// const getToken = () => localStorage.getItem("token");
// const isTokenValid = (t) => !!t;

// /* Avatar basé sur nom complet (fallback si vide) */
// const avatarUrl = (fullName = "REC") =>
//   `https://ui-avatars.com/api/?name=${encodeURIComponent(
//     fullName
//   )}&background=0D8ABC&color=fff`;

// /* Parse "DD/MM/YYYY" + "HH:mm" ou ISO -> Date */
// const parseDate = (dateStr, timeStr) => {
//   if (!dateStr) return null;
//   if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
//     try {
//       return new Date(timeStr ? `${dateStr}T${timeStr}` : dateStr);
//     } catch {
//       return null;
//     }
//   }
//   const m = String(dateStr).match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
//   if (!m) return null;
//   const [_, dd, mm, yyyy] = m;
//   const [hh = "00", min = "00"] = (timeStr || "00:00").split(":");
//   const d = new Date(+yyyy, +mm - 1, +dd, +hh, +min);
//   return isNaN(d.getTime()) ? null : d;
// };

// const DashboardCard = ({ icon, label, value, loading }) => (
//   <div className="col-12 col-sm-6 col-lg-3">
//     <div className="card border-0 shadow-sm rounded-4 h-100">
//       <div className="card-body d-flex align-items-center gap-3">
//         <div
//           className="d-flex align-items-center justify-content-center rounded-3"
//           style={{
//             width: 46,
//             height: 46,
//             background: "#e8f5ff",
//             border: "1px solid #d7ecff",
//           }}
//         >
//           <i className={`bi ${icon} fs-5 text-primary`} />
//         </div>
//         <div className="flex-grow-1">
//           <div className="text-muted small">{label}</div>
//           <div className="fs-4 fw-semibold">
//             {loading ? (
//               <span
//                 className="placeholder col-6 d-inline-block"
//                 style={{ height: 22, borderRadius: 8 }}
//               />
//             ) : (
//               value
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default function Dashboard() {
//   const navigate = useNavigate();

//   // Header receptionist info
//   const [rec, setRec] = useState({ nom: "", prenom: "" });
//   const [fullName, setFullName] = useState("");
//   const [loadingHeader, setLoadingHeader] = useState(true);

//   // KPIs
//   const [countToday, setCountToday] = useState(0);
//   const [countWaiting, setCountWaiting] = useState(0);
//   const [countUpcoming, setCountUpcoming] = useState(0);
//   const [countCancelled, setCountCancelled] = useState(0);
//   const [loadingKpis, setLoadingKpis] = useState(true);

//   // Next appointments (mix today+upcoming)
//   const [nextAppointments, setNextAppointments] = useState([]);
//   const [loadingNext, setLoadingNext] = useState(true);

//   const token = getToken();

//   /* ===== 1) Header: infos réceptionniste ===== */
//   useEffect(() => {
//     const controller = new AbortController();
//     (async () => {
//       try {
//         if (!token || !isTokenValid(token)) {
//           navigate("/login", { replace: true });
//           return;
//         }
//         const res = await fetch(
//           `${API_BASE_URL}/api/Receptionniste/basic-info`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             signal: controller.signal,
//           }
//         );
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();
//         const nom = data.nom ?? "";
//         const prenom = data.prenom ?? "";
//         setRec({ nom, prenom });
//         setFullName(`${prenom} ${nom}`.trim());
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoadingHeader(false);
//       }
//     })();
//     return () => controller.abort();
//   }, [token, navigate]);

//   /* ===== 2) KPIs + Prochains RDV ===== */
//   const dedupe = useCallback((arr) => {
//     return Array.from(
//       new Map(
//         (arr || []).map((rv) => {
//           const key =
//             rv.id ??
//             `${rv.dateRendezVous || rv.date}-${rv.heure || ""}-${
//               rv.patient?.id ?? rv.patientFullName ?? rv.patientNom ?? ""
//             }`;
//           return [key, rv];
//         })
//       ).values()
//     );
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     const headers = { Authorization: `Bearer ${token}` };
//     (async () => {
//       try {
//         if (!token || !isTokenValid(token)) return;

//         // RDV d'aujourd'hui + à venir (côté réceptionniste)
//         const [rToday, rUpcoming, rWaiting, rCancelled] = await Promise.all([
//           fetch(`${API_BASE_URL}/api/Receptionniste/rendezVous/aujourdhui`, {
//             headers,
//             signal: controller.signal,
//           }),
//           fetch(`${API_BASE_URL}/api/Receptionniste/rendezVous/avenir`, {
//             headers,
//             signal: controller.signal,
//           }),
//           fetch(`${API_BASE_URL}/api/Receptionniste/salleAttente`, {
//             headers,
//             signal: controller.signal,
//           }),
//           fetch(
//             `${API_BASE_URL}/api/Receptionniste/rendezVous/annulations-jour`,
//             {
//               headers,
//               signal: controller.signal,
//             }
//           ),
//         ]);

//         const todayList = rToday.ok ? await rToday.json() : [];
//         const upcomingList = rUpcoming.ok ? await rUpcoming.json() : [];
//         const waitingList = rWaiting.ok ? await rWaiting.json() : [];
//         const cancelledList = rCancelled.ok ? await rCancelled.json() : [];

//         const uniqToday = dedupe(todayList);
//         const uniqUpcoming = dedupe(upcomingList);

//         setCountToday(uniqToday.length);
//         setCountUpcoming(uniqUpcoming.length);
//         setCountWaiting((waitingList || []).length);
//         setCountCancelled((cancelledList || []).length);

//         // fusion (aujourd’hui + à venir), tri par date croissante, top 5
//         const merged = [...uniqToday, ...uniqUpcoming]
//           .map((rv) => ({
//             ...rv,
//             _dt: parseDate(rv.dateRendezVous || rv.date, rv.heure),
//           }))
//           .filter((rv) => rv._dt)
//           .sort((a, b) => a._dt - b._dt)
//           .slice(0, 5);

//         setNextAppointments(merged);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoadingKpis(false);
//         setLoadingNext(false);
//       }
//     })();
//     return () => controller.abort();
//   }, [token, dedupe]);

//   const headerRight = useMemo(
//     () => (
//       <div className="d-none d-sm-flex align-items-center gap-2">
//         <img
//           src={avatarUrl(fullName || "REC")}
//           className="rounded-circle"
//           alt="Avatar"
//           style={{ width: 36, height: 36 }}
//           onError={(e) => (e.currentTarget.src = avatarUrl("REC"))}
//         />
//         <div className="small">
//           <div className="fw-semibold">
//             {loadingHeader ? (
//               <span
//                 className="placeholder col-6 d-inline-block"
//                 style={{ height: 16, borderRadius: 6 }}
//               />
//             ) : fullName ? (
//               fullName
//             ) : (
//               "Réceptionniste"
//             )}
//           </div>
//         </div>
//       </div>
//     ),
//     [fullName, loadingHeader]
//   );

//   return (
//     <div className="container-fluid py-3">
      

//       {/* KPI Cards */}
//       <div className="row g-3 mb-3">
//         <DashboardCard
//           icon="bi-calendar2-check"
//           label="RDV aujourd'hui"
//           value={countToday}
//           loading={loadingKpis}
//         />
        
//         <DashboardCard
//           icon="bi-calendar-week"
//           label="RDV à venir"
//           value={countUpcoming}
//           loading={loadingKpis}
//         />
//         <DashboardCard
//           icon="bi-x-octagon"
//           label="Annulations du jour"
//           value={countCancelled}
//           loading={loadingKpis}
//         />
//       </div>

//       <div className="row g-3">
//         {/* Prochains rendez-vous */}
//         <div className="col-12 col-xl-12">
//           <div className="card border-0 shadow-sm rounded-4 h-100">
//             <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
//               <h6 className="m-0">Prochains rendez-vous</h6>
//               <button
//                 className="btn btn-sm btn-outline-primary"
//                 onClick={() => navigate("/ReceptionnisteDash/rv-avenir")}
//               >
//                 Voir tout
//               </button>
//             </div>
//             <div className="card-body">
//               {loadingNext ? (
//                 <>
//                   <div className="placeholder-glow mb-2">
//                     <span className="placeholder col-12" />
//                   </div>
//                   <div className="placeholder-glow mb-2">
//                     <span className="placeholder col-10" />
//                   </div>
//                   <div className="placeholder-glow">
//                     <span className="placeholder col-8" />
//                   </div>
//                 </>
//               ) : nextAppointments.length === 0 ? (
//                 <div className="text-muted">Aucun rendez-vous à venir.</div>
//               ) : (
//                 <ul className="list-group list-group-flush">
//                   {nextAppointments.map((rv, idx) => (
//                     <li key={idx} className="list-group-item px-0">
//                       <div className="d-flex align-items-center justify-content-between">
//                         <div className="d-flex align-items-center gap-2">
//                           <div
//                             className="rounded-circle bg-light d-flex align-items-center justify-content-center"
//                             style={{ width: 36, height: 36 }}
//                           >
//                             <i className="bi bi-person text-secondary" />
//                           </div>
//                           <div>
//                             <div className="fw-semibold">
//                               {rv.patient?.fullName ||
//                                 rv.patientFullName ||
//                                 rv.patientNom ||
//                                 "Patient"}
//                             </div>
//                             <div className="text-muted small">
//                               <i className="bi bi-person-badge me-1" />
//                               {rv.medecin?.fullName ||
//                                 rv.medecinNom ||
//                                 "Médecin"}
//                               {" · "}
//                               {rv.motif || "Consultation"}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-end">
//                           <div className="badge bg-primary-subtle text-primary border border-primary-subtle">
//                             {(rv.dateRendezVous || rv.date) ?? ""}{" "}
//                             {rv.heure ?? ""}
//                           </div>
//                           {rv.isTeleconsult || rv.teleconsultation ? (
//                             <div className="small text-success mt-1">
//                               <i className="bi bi-camera-video me-1" />
//                               Téléconsultation
//                             </div>
//                           ) : null}
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
// src/pages/ReceptionnisteDashboard.jsx



// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// /* Helpers */
// const getToken = () => localStorage.getItem("token");
// const isTokenValid = (t) => !!t;

// const parseDate = (dateStr, timeStr) => {
//   if (!dateStr) return null;
//   if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
//     try {
//       return new Date(timeStr ? `${dateStr}T${timeStr}` : dateStr);
//     } catch {
//       return null;
//     }
//   }
//   const m = String(dateStr).match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
//   if (!m) return null;
//   const [_, dd, mm, yyyy] = m;
//   const [hh = "00", min = "00"] = (timeStr || "00:00").split(":");
//   const d = new Date(+yyyy, +mm - 1, +dd, +hh, +min);
//   return isNaN(d.getTime()) ? null : d;
// };



// export default function ReceptionnisteDashboard() {
//   const navigate = useNavigate();

//   // Header receptionist info
//   const [fullName, setFullName] = useState("");
//   const [loadingHeader, setLoadingHeader] = useState(true);

//   // KPIs
//   const [countToday, setCountToday] = useState(0);
//   const [countUpcoming, setCountUpcoming] = useState(0);
//   const [countCancelled, setCountCancelled] = useState(0);
//   const [loadingKpis, setLoadingKpis] = useState(true);

//   // Next appointments
//   const [nextAppointments, setNextAppointments] = useState([]);
//   const [loadingNext, setLoadingNext] = useState(true);
//   // Next ONE appointment (le tout premier)
//   const [nextOne, setNextOne] = useState(null);
//   const [loadingNextOne, setLoadingNextOne] = useState(true);

//   const token = getToken();

  

//   /* KPIs + RV */
//   const dedupe = useCallback((arr) => {
//     return Array.from(
//       new Map(
//         (arr || []).map((rv) => {
//           const key =
//             rv.id ??
//             `${rv.dateRendezVous || rv.date}-${rv.heure || ""}-${
//               rv.patient?.id ?? rv.patientFullName ?? rv.patientNom ?? ""
//             }`;
//           return [key, rv];
//         })
//       ).values()
//     );
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     const headers = { Authorization: `Bearer ${token}` };
//     (async () => {
//       try {
//         if (!token || !isTokenValid(token)) return;

//         const [rToday, rUpcoming, rCancelled] = await Promise.all([
//           fetch(`${API_BASE_URL}/api/Receptionniste/rendezVous/aujourdhui`, {
//             headers,
//             signal: controller.signal,
//           }),
//           fetch(`${API_BASE_URL}/api/Receptionniste/rendezVous/avenir`, {
//             headers,
//             signal: controller.signal,
//           }),
//           fetch(
//             `${API_BASE_URL}/api/Receptionniste/rendezVous/annulations-jour`,
//             {
//               headers,
//               signal: controller.signal,
//             }
//           ),
//         ]);

//         const todayList = rToday.ok ? await rToday.json() : [];
//         const upcomingList = rUpcoming.ok ? await rUpcoming.json() : [];
//         const cancelledList = rCancelled.ok ? await rCancelled.json() : [];

//         const uniqToday = dedupe(todayList);
//         const uniqUpcoming = dedupe(upcomingList);

//         setCountToday(uniqToday.length);
//         setCountUpcoming(uniqUpcoming.length);
//         setCountCancelled((cancelledList || []).length);

//         const merged = [...uniqToday, ...uniqUpcoming]
//           .map((rv) => ({
//             ...rv,
//             _dt: parseDate(rv.dateRendezVous || rv.date, rv.heure),
//           }))
//           .filter((rv) => rv._dt)
//           .sort((a, b) => a._dt - b._dt)
//           .slice(0, 6);

//         setNextAppointments(merged);
//       } catch (e) {
//         // eslint-disable-next-line no-console
//         console.error(e);
//       } finally {
//         setLoadingKpis(false);
//         setLoadingNext(false);
//       }
//     })();
//     return () => controller.abort();
//   }, [token, dedupe]);

//   useEffect(() => {
//     const controller = new AbortController();
//     (async () => {
//       try {
//         if (!token || !isTokenValid(token)) return;

//         const res = await fetch(
//           `${API_BASE_URL}/api/receptionniste/rendezVous/prochain`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             signal: controller.signal,
//           }
//         );

//         if (res.status === 204) {
//           setNextOne(null);
//         } else if (!res.ok) {
//           throw new Error(`HTTP ${res.status}`);
//         } else {
//           const rv = await res.json();
//           // Normalise un _dt pour l’affichage si besoin
//           const _dt = parseDate(rv.dateRendezVous || rv.date, rv.heure);
//           setNextOne({ ...rv, _dt });
//         }
//       } catch (e) {
//         console.error(e);
//         setNextOne(null);
//       } finally {
//         setLoadingNextOne(false);
//       }
//     })();
//     return () => controller.abort();
//   }, [token]);


//   return (
//     <div className="container-fluid py-3 mt-5">
//       {/* KPI Cards */}
//       {/* KPI Cards */}
//       <div className="row g-4 mb-4">
//         <div className="col-12 col-sm-6 col-md-4 col-xl-3">
//           <div className="card text-center shadow-sm border-0 h-100">
//             <div className="card-body">
//               <div
//                 className="d-inline-flex align-items-center justify-content-center rounded-3 bg-light mb-2"
//                 style={{ width: 50, height: 50 }}
//               >
//                 <i className="bi bi-calendar2-check text-primary fs-4" />
//               </div>
//               <div className="text-muted small">RDV aujourd'hui</div>
//               <div className="fs-3 fw-bold">{countToday}</div>
//             </div>
//           </div>
//         </div>

//         <div className="col-12 col-sm-6 col-md-4 col-xl-3">
//           <div className="card text-center shadow-sm border-0 h-100">
//             <div className="card-body">
//               <div
//                 className="d-inline-flex align-items-center justify-content-center rounded-3 bg-light mb-2"
//                 style={{ width: 50, height: 50 }}
//               >
//                 <i className="bi bi-calendar-week text-primary fs-4" />
//               </div>
//               <div className="text-muted small">RDV à venir</div>
//               <div className="fs-3 fw-bold">{countUpcoming}</div>
//             </div>
//           </div>
//         </div>

//         <div className="col-12 col-sm-6 col-md-4 col-xl-3">
//           <div className="card text-center shadow-sm border-0 h-100">
//             <div className="card-body">
//               <div
//                 className="d-inline-flex align-items-center justify-content-center rounded-3 bg-light mb-2"
//                 style={{ width: 50, height: 50 }}
//               >
//                 <i className="bi bi-x-octagon text-danger fs-4" />
//               </div>
//               <div className="text-muted small">Annulations du jour</div>
//               <div className="fs-3 fw-bold">{countCancelled}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Next Appointments */}
//       {/* <div className="row g-3">
//         <div className="col-12">
//           <div className="card shadow-sm border-0 rounded-4">
//             <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
//               <h6 className="m-0">Prochains rendez-vous</h6>
//               <button
//                 className="btn btn-sm btn-outline-primary"
//                 onClick={() => navigate("/ReceptionnisteDash/rv-avenir")}
//               >
//                 Voir tout
//               </button>
//             </div>
//             <div className="card-body">
//               {loadingNext ? (
//                 <>
//                   <div className="placeholder-glow mb-2">
//                     <span className="placeholder col-12" />
//                   </div>
//                   <div className="placeholder-glow mb-2">
//                     <span className="placeholder col-10" />
//                   </div>
//                   <div className="placeholder-glow">
//                     <span className="placeholder col-8" />
//                   </div>
//                 </>
//               ) : nextAppointments.length === 0 ? (
//                 <div className="border rounded-3 p-3 text-muted bg-body-tertiary">
//                   Aucun rendez-vous à venir.
//                 </div>
//               ) : (
//                 <ul className="list-group list-group-flush">
//                   {nextAppointments.map((rv, idx) => (
//                     <li
//                       key={idx}
//                       className="list-group-item d-flex align-items-center justify-content-between px-0"
//                     >
//                       <div className="d-flex align-items-center gap-3">
//                         <div
//                           className="rounded-3 bg-body-tertiary border d-flex align-items-center justify-content-center"
//                           style={{ width: 40, height: 40 }}
//                         >
//                           <i className="bi bi-person text-secondary" />
//                         </div>
//                         <div>
//                           <div className="fw-semibold">
//                             {rv.patient?.fullName ||
//                               rv.patientFullName ||
//                               rv.patientNom ||
//                               "Patient"}
//                           </div>
//                           <div className="text-muted small">
//                             <i className="bi bi-person-badge me-1" />
//                             {rv.medecin?.fullName || rv.medecinNom || "Médecin"}
//                             {" · "}
//                             {rv.motif || "Consultation"}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="text-end">
//                         <span className="badge text-primary-emphasis bg-primary-subtle border border-primary-subtle">
//                           {(rv.dateRendezVous || rv.date) ?? ""}{" "}
//                           {rv.heure ?? ""}
//                         </span>
//                         {rv.isTeleconsult || rv.teleconsultation ? (
//                           <div className="small text-success mt-1">
//                             <i className="bi bi-camera-video me-1" />
//                             Téléconsultation
//                           </div>
//                         ) : null}
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>
//       </div> */}
//       {/* Prochain rendez-vous (seul) */}
//       <div className="row g-3 mb-3">
//         <div className="col-12">
//           <div className="card shadow-sm border-0 rounded-4">
//             <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
//               <h6 className="m-0">Prochain rendez-vous</h6>
//               {nextOne && (
//                 <span className="badge text-success-emphasis bg-success-subtle border border-success-subtle">
//                   {nextOne._dt
//                     ? nextOne._dt.toLocaleString()
//                     : `${nextOne.dateRendezVous || nextOne.date} ${
//                         nextOne.heure || ""
//                       }`}
//                 </span>
//               )}
//             </div>
//             <div className="card-body">
//               {loadingNextOne ? (
//                 <>
//                   <div className="placeholder-glow mb-2">
//                     <span className="placeholder col-12" />
//                   </div>
//                   <div className="placeholder-glow">
//                     <span className="placeholder col-8" />
//                   </div>
//                 </>
//               ) : !nextOne ? (
//                 <div className="border rounded-3 p-3 text-muted bg-body-tertiary">
//                   Aucun prochain rendez-vous.
//                 </div>
//               ) : (
//                 <div className="d-flex align-items-center justify-content-between">
//                   <div className="d-flex align-items-center gap-3">
//                     <div
//                       className="rounded-3 bg-body-tertiary border d-flex align-items-center justify-content-center"
//                       style={{ width: 48, height: 48 }}
//                     >
//                       <i className="bi bi-person text-secondary fs-5" />
//                     </div>
//                     <div>
//                       <div className="fw-semibold">
//                         {nextOne.patient?.fullName ||
//                           nextOne.patientFullName ||
//                           nextOne.patientNom ||
//                           "Patient"}
//                       </div>
//                       <div className="text-muted small">
//                         <i className="bi bi-person-badge me-1" />
//                         {nextOne.medecin?.fullName ||
//                           nextOne.medecinNom ||
//                           "Médecin"}
//                         {" · "}
//                         {nextOne.motif || "Consultation"}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-end">
//                     <span className="badge text-primary-emphasis bg-primary-subtle border border-primary-subtle">
//                       {(nextOne.dateRendezVous || nextOne.date) ?? ""}{" "}
//                       {nextOne.heure ?? ""}
//                     </span>
//                     {nextOne.isTeleconsult || nextOne.teleconsultation ? (
//                       <div className="small text-success mt-1">
//                         <i className="bi bi-camera-video me-1" />
//                         Téléconsultation
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }














import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/* ================= Helpers ================= */
const getToken = () => localStorage.getItem("token");
const isTokenValid = (t) => !!t;

// Parse une date potentiellement "yyyy-mm-dd" ou "dd/mm/yyyy" + "HH:mm"
const parseDate = (dateStr, timeStr) => {
  if (!dateStr) return null;

  // cas: yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    try {
      return new Date(timeStr ? `${dateStr}T${timeStr}` : dateStr);
    } catch {
      return null;
    }
  }

  // cas: dd/mm/yyyy ou dd-mm-yyyy
  const m = String(dateStr).match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const [hh = "00", min = "00"] = (timeStr || "00:00").split(":");
  const d = new Date(+yyyy, +mm - 1, +dd, +hh, +min);
  return isNaN(d.getTime()) ? null : d;
};

// Format dd/mm/yyyy
const pad2 = (n) => String(n).padStart(2, "0");
const formatDateDDMMYYYY = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "";
  const dd = pad2(dateObj.getDate());
  const mm = pad2(dateObj.getMonth() + 1);
  const yyyy = dateObj.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Fullname patient (essaie p.fullName sinon "prenom nom" sinon fallback)
const patientFullName = (rv) => {
  const p = rv?.patient;
  if (p?.fullName) return p.fullName;
  const composed = [p?.prenom, p?.nom].filter(Boolean).join(" ").trim();
  return composed || rv?.patientFullName || rv?.patientNom || "Patient";
};

// Fullname medecin (essaie m.fullName sinon "prenom nom" sinon fallback)
const medecinFullName = (rv) => {
  const m = rv?.medecin;
  if (m?.fullName) return m.fullName;
  const composed = [m?.prenom, m?.nom].filter(Boolean).join(" ").trim();
  return composed || rv?.medecinFullName || rv?.medecinNom || "Médecin";
};

// Affichage badge date (dd/mm/yyyy + heure)
// - si _dt dispo → formate dd/mm/yyyy puis concat heure si fournie par l'API
// - sinon retombe sur brut (dateRendezVous|date + heure)
const formatRvDateForBadge = (rv) => {
  if (rv?._dt instanceof Date && !isNaN(rv._dt.getTime())) {
    const d = formatDateDDMMYYYY(rv._dt);
    return `${d} ${rv.heure ?? ""}`.trim();
  }
  const rawDate = rv?.dateRendezVous || rv?.date || "";
  const rawTime = rv?.heure || "";
  return `${rawDate} ${rawTime}`.trim();
};

/* ================= Component ================= */
export default function ReceptionnisteDashboard() {
  const navigate = useNavigate();

  // Header receptionist info (non utilisé visuellement ici, garde si besoin plus tard)
  const [fullName, setFullName] = useState("");
  const [loadingHeader, setLoadingHeader] = useState(true);

  // KPIs
  const [countToday, setCountToday] = useState(0);
  const [countUpcoming, setCountUpcoming] = useState(0);
  const [countCancelled, setCountCancelled] = useState(0);
  const [loadingKpis, setLoadingKpis] = useState(true);

  // Next appointments (liste)
  const [nextAppointments, setNextAppointments] = useState([]);
  const [loadingNext, setLoadingNext] = useState(true);

  // Prochain RDV (unique)
  const [nextOne, setNextOne] = useState(null);
  const [loadingNextOne, setLoadingNextOne] = useState(true);

  const token = getToken();

  /* ====== KPIs + RDV list ====== */
  const dedupe = useCallback((arr) => {
    return Array.from(
      new Map(
        (arr || []).map((rv) => {
          const key =
            rv.id ??
            `${rv.dateRendezVous || rv.date}-${rv.heure || ""}-${
              rv.patient?.id ?? rv.patientFullName ?? rv.patientNom ?? ""
            }`;
          return [key, rv];
        })
      ).values()
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const headers = { Authorization: `Bearer ${token}` };

    (async () => {
      try {
        if (!token || !isTokenValid(token)) return;

        const [rToday, rUpcoming, rCancelled] = await Promise.all([
          fetch(`${API_BASE_URL}/api/Receptionniste/rendezVous/aujourdhui`, {
            headers,
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/Receptionniste/rendezVous/avenir`, {
            headers,
            signal: controller.signal,
          }),
          fetch(
            `${API_BASE_URL}/api/Receptionniste/rendezVous/annulations-jour`,
            {
              headers,
              signal: controller.signal,
            }
          ),
        ]);

        const todayList = rToday.ok ? await rToday.json() : [];
        const upcomingList = rUpcoming.ok ? await rUpcoming.json() : [];
        const cancelledList = rCancelled.ok ? await rCancelled.json() : [];

        const uniqToday = dedupe(todayList);
        const uniqUpcoming = dedupe(upcomingList);

        setCountToday(uniqToday.length);
        setCountUpcoming(uniqUpcoming.length);
        setCountCancelled((cancelledList || []).length);

        const merged = [...uniqToday, ...uniqUpcoming]
          .map((rv) => ({
            ...rv,
            _dt: parseDate(rv.dateRendezVous || rv.date, rv.heure),
          }))
          .filter((rv) => rv._dt)
          .sort((a, b) => a._dt - b._dt)
          .slice(0, 6);

        setNextAppointments(merged);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingKpis(false);
        setLoadingNext(false);
      }
    })();

    return () => controller.abort();
  }, [token, dedupe]);

  /* ====== Prochain RDV (unique) ====== */
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        if (!token || !isTokenValid(token)) return;

        // ⚠️ Vérifie la casse du chemin côté backend:
        // ici "receptionniste" en minuscule
        const res = await fetch(
          `${API_BASE_URL}/api/receptionniste/rendezVous/prochain`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        if (res.status === 204) {
          setNextOne(null);
        } else if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        } else {
          const rv = await res.json();
          const _dt = parseDate(rv.dateRendezVous || rv.date, rv.heure);
          setNextOne({ ...rv, _dt });
        }
      } catch (e) {
        console.error(e);
        setNextOne(null);
      } finally {
        setLoadingNextOne(false);
      }
    })();
    return () => controller.abort();
  }, [token]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        if (!token || !isTokenValid(token)) return;
        const res = await fetch(
          `${API_BASE_URL}/api/receptionniste/rendezVous/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCountToday(data.today || 0);
        setCountUpcoming(data.upcoming || 0);
        setCountCancelled(data.cancelled || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingKpis(false);
      }
    })();
    return () => controller.abort();
  }, [token]);


  return (
    <div className="container-fluid py-3 mt-5">
      {/* ===== KPI Cards ===== */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-md-4 col-xl-4">
          <div className="card text-center shadow-sm border-0 h-100">
            <div className="card-body">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-3 bg-light mb-2"
                style={{ width: 50, height: 50 }}
              >
                <i className="bi bi-calendar2-check text-primary fs-4" />
              </div>
              <div className="text-muted small">RDV aujourd&apos;hui</div>
              <div className="fs-3 fw-bold">{countToday}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-xl-4">
          <div className="card text-center shadow-sm border-0 h-100">
            <div className="card-body">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-3 bg-light mb-2"
                style={{ width: 50, height: 50 }}
              >
                <i className="bi bi-calendar-week text-primary fs-4" />
              </div>
              <div className="text-muted small">RDV à venir</div>
              <div className="fs-3 fw-bold">{countUpcoming}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-xl-4">
          <div className="card text-center shadow-sm border-0 h-100">
            <div className="card-body">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-3 bg-light mb-2"
                style={{ width: 50, height: 50 }}
              >
                <i className="bi bi-x-octagon text-danger fs-4" />
              </div>
              <div className="text-muted small">Annulations du jour</div>
              <div className="fs-3 fw-bold">{countCancelled}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Prochain rendez-vous (unique) ===== */}
      <div className="row g-3 mb-3">
        <div className="col-12">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h6 className="m-0">Prochain rendez-vous</h6>
              {nextOne && (
                <span className="badge text-success-emphasis bg-success-subtle border border-success-subtle">
                  {formatRvDateForBadge(nextOne)}
                </span>
              )}
            </div>

            <div className="card-body">
              {loadingNextOne ? (
                <>
                  <div className="placeholder-glow mb-2">
                    <span className="placeholder col-12" />
                  </div>
                  <div className="placeholder-glow">
                    <span className="placeholder col-8" />
                  </div>
                </>
              ) : !nextOne ? (
                <div className="border rounded-3 p-3 text-muted bg-body-tertiary">
                  Aucun prochain rendez-vous.
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 bg-body-tertiary border d-flex align-items-center justify-content-center"
                      style={{ width: 48, height: 48 }}
                    >
                      <i className="bi bi-person text-secondary fs-5" />
                    </div>
                    <div>
                      <div className="fw-semibold">
                        Patient: {patientFullName(nextOne)}
                      </div>
                      <div className="text-muted ">
                        <i className="bi bi-person-badge me-1" />
                        {medecinFullName(nextOne)}
                        {" · "}
                        {nextOne.motif || "Consultation"}
                      </div>
                      <div className="text-muted small text-center">
                        Motif: {nextOne.motif || "Consultation"}
                      </div>
                    </div>
                  </div>

                  <div className="text-end">
                    <span className="badge text-primary-emphasis bg-primary-subtle border border-primary-subtle">
                      {formatRvDateForBadge(nextOne)}
                    </span>
                    {nextOne.isTeleconsult || nextOne.teleconsultation ? (
                      <div className="small text-success mt-1">
                        <i className="bi bi-camera-video me-1" />
                        Téléconsultation
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
