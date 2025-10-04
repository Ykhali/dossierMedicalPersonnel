// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";

// function MedecinList() {
//   const [medecins, setMedecins] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const tokenHeader = () => {
//     const t = localStorage.getItem("token");
//     return t ? { Authorization: `Bearer ${t}` } : {};
//   };

//   useEffect(() => {
//     let alive = true;
//     const fetchMeds = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         // Endpoint principal côté médecin (à exposer côté backend)
//         // GET /api/medecin/receptionnistes -> retourne la liste des réceptionnistes du médecin connecté
//         const res = await fetch(
//           `${API_BASE_URL}/api/receptionniste/mes-medecins`,
//           {
//             method: "GET",
//             headers: { "Content-Type": "application/json", ...tokenHeader() },
//             credentials: "include",
//           }
//         );

//         if (!res.ok) {
//           const e = await res.json().catch(() => ({}));
//           throw new Error(e.message || `HTTP ${res.status}`);
//         }

//         const data = await res.json().catch(() => []);
//         if (alive) {
//           setMedecins(Array.isArray(data) ? data : data.items ?? []);
//         }
//       } catch (e) {
//         if (alive) {
//           setError(
//             e.message ||
//               "Impossible de charger vos médecin gérer. "
//           );
//         }
//       } finally {
//         if (alive) setIsLoading(false);
//       }
//     };

//     fetchMeds();
//     return () => {
//       alive = false;
//     };
//   }, [navigate]);

//   return (
//     <div className="py-4">
//       <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
//         <h2 className="h4 mb-0 d-flex align-items-center gap-2">
//           <i className="bi bi-person-badge" />
//           Mes médecins gérés
//           {medecins?.length > 0 && (
//             <span className="badge text-bg-primary ms-1">
//               {medecins.length}
//             </span>
//           )}
//         </h2>

//         <button
//           className="btn btn-outline-secondary"
//           //onClick={fetchMeds}
//           disabled={isLoading}
//           title="Rafraîchir"
//         >
//           <i
//             className={`bi ${
//               isLoading ? "bi-arrow-repeat spin" : "bi-arrow-clockwise"
//             }`}
//           />
//         </button>
//       </div>
//       {error && <div className="alert alert-danger">{error}</div>}

//       {isLoading && (
//         <div className="d-flex align-items-center gap-2 text-secondary">
//           <div className="spinner-border spinner-border-sm" role="status" />
//           <span>Chargement des médecins…</span>
//         </div>
//       )}

//       {!isLoading && !error && medecins.length === 0 && (
//         <div className="text-center text-muted py-5">
//           <i className="bi bi-emoji-neutral fs-1 d-block mb-2" />
//           <div className="fw-semibold">Aucun médecin trouvé</div>
//           <div className="small">
//             Vous n'avez pas encore de médecins assignés.
//           </div>
//         </div>
//       )}

//       {!isLoading && !error && medecins.length > 0 && (
//         <div className="row g-3">
//           {medecins.map((m) => (
//             <div
//               className="col-12 col-md-6 col-lg-4"
//               key={m?.id ?? `${m?.email}-${m?.nom}`}
//             >
//               <div className="card h-100 shadow-sm">
//                 <div className="card-body d-flex flex-column">
//                   <div className="d-flex align-items-center gap-3 mb-3">
//                     <div
//                       className="rounded-circle bg-light d-flex align-items-center justify-content-center"
//                       style={{ width: 56, height: 56 }}
//                     >
//                       <i className="bi bi-person-circle fs-3" />
//                     </div>
//                     <div>
//                       <div className="fw-semibold">
//                         {m?.prenom ?? ""} {m?.nom ?? ""}
//                       </div>
//                       <div className="text-muted small">{m?.email ?? "-"}</div>
//                     </div>
//                   </div>

//                   <div className="mb-2">
//                     <span className="badge text-bg-info-subtle border">
//                       <i className="bi bi-hospital me-1" />
//                       {m?.specialite ??
//                         m?.specialty ??
//                         "Spécialité non renseignée"}
//                     </span>
//                   </div>

//                   {m?.telephone && (
//                     <div className="text-muted small mb-2">
//                       <i className="bi bi-telephone me-1" />
//                       {m.telephone}
//                     </div>
//                   )}

//                   <div className="mt-auto d-flex justify-content-end gap-2">
//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       onClick={() => handleOpenMedecin(m)}
//                       disabled={!m?.id}
//                       title="Ouvrir la fiche du médecin"
//                     >
//                       <i className="bi bi-box-arrow-up-right me-1" />
//                       Ouvrir
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Petite animation pour l'icône de refresh */}
//       <style>{`
//         .spin {
//           animation: spin 0.8s linear infinite;
//         }
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default MedecinList;

// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// function MedecinList() {
//   const [medecins, setMedecins] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const tokenHeader = () => {
//     const t = localStorage.getItem("token");
//     return t ? { Authorization: `Bearer ${t}` } : {};
//   };

//   // Utilitaires UI
//   const initials = (p, n) =>
//     `${(p ?? "").trim().charAt(0)}${(n ?? "")
//       .trim()
//       .charAt(0)}`.toUpperCase() || "MD";

//   const colorFromName = (name = "") => {
//     // palette douce basée sur le nom
//     const colors = [
//       "#E3F2FD",
//       "#E8F5E9",
//       "#FFF3E0",
//       "#F3E5F5",
//       "#E0F7FA",
//       "#FBE9E7",
//     ];
//     let hash = 0;
//     for (let i = 0; i < name.length; i++)
//       hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     return colors[Math.abs(hash) % colors.length];
//   };

//   const handleOpenMedecin = (m) => {
//     if (m?.id) navigate(`/medecins/${m.id}`);
//   };

//   const fetchMeds = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const res = await fetch(
//         `${API_BASE_URL}/api/receptionniste/mes-medecins`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json", ...tokenHeader() },
//           credentials: "include",
//         }
//       );

//       if (!res.ok) {
//         const e = await res.json().catch(() => ({}));
//         throw new Error(e.message || `HTTP ${res.status}`);
//       }

//       const data = await res.json().catch(() => []);
//       const list = Array.isArray(data) ? data : data.items ?? [];
//       setMedecins(list);
//     } catch (e) {
//       setError(
//         e?.message || "Impossible de charger les médecins gérés pour le moment."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMeds();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Squelettes de chargement (6 cartes fantômes)
//   const skeletons = useMemo(() => new Array(6).fill(0), []);

//   return (
//     <div className="py-4">
//       {/* Header amélioré */}
//       <div className="glass-header d-flex flex-wrap align-items-center justify-content-between gap-2 p-3 rounded-4 mb-3 shadow-sm">
//         <div className="d-flex align-items-center gap-2">
//           <span className="badge badge-pill bg-gradient px-3 py-2 me-1">
//             <i className="bi bi-person-badge me-2" />
//             Médecins gérés
//           </span>
//           {medecins?.length > 0 && (
//             <span className="badge text-bg-primary rounded-pill">
//               {medecins.length}
//             </span>
//           )}
//         </div>
//         <button
//           className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
//           onClick={fetchMeds}
//           disabled={isLoading}
//           data-bs-toggle="tooltip"
//           data-bs-title="Rafraîchir la liste"
//         >
//           <i
//             className={`bi ${
//               isLoading ? "bi-arrow-repeat spin" : "bi-arrow-clockwise"
//             }`}
//           />
//           <span className="d-none d-sm-inline">Rafraîchir</span>
//         </button>
//       </div>

//       {error && (
//         <div
//           className="alert alert-danger d-flex align-items-start"
//           role="alert"
//         >
//           <i className="bi bi-exclamation-triangle-fill me-2"></i>
//           <div>
//             <div className="fw-semibold">Erreur</div>
//             <div className="small">{error}</div>
//           </div>
//         </div>
//       )}

//       {isLoading && (
//         <div className="row g-3">
//           {skeletons.map((_, i) => (
//             <div className="col-12 col-md-6 col-lg-4" key={`sk-${i}`}>
//               <div className="card h-100 shadow-sm card-raise">
//                 <div className="card-body">
//                   <div className="d-flex align-items-center gap-3 mb-3">
//                     <div className="avatar shimmer" />
//                     <div className="flex-grow-1">
//                       <div className="shimmer-line w-75 mb-2"></div>
//                       <div className="shimmer-line w-50"></div>
//                     </div>
//                   </div>
//                   <div className="shimmer-chip mb-2"></div>
//                   <div className="shimmer-line w-25 mb-3"></div>
//                   <div className="d-flex justify-content-end">
//                     <div className="btn btn-sm btn-outline-primary disabled placeholder-btn">
//                       Ouvrir
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {!isLoading && !error && medecins.length === 0 && (
//         <div className="text-center text-muted py-5">
//           <i className="bi bi-emoji-neutral fs-1 d-block mb-2" />
//           <div className="fw-semibold">Aucun médecin trouvé</div>
//           <div className="small">
//             Vous n'avez pas encore de médecins assignés.
//           </div>
//         </div>
//       )}

//       {!isLoading && !error && medecins.length > 0 && (
//         <div className="row g-3">
//           {medecins.map((m) => {
//             const fullName = `${m?.prenom ?? ""} ${m?.nom ?? ""}`.trim();
//             const chip =
//               m?.specialite ?? m?.specialty ?? "Spécialité non renseignée";
//             return (
//               <div
//                 className="col-12 col-md-6 col-lg-4"
//                 key={m?.id ?? `${m?.email}-${m?.nom}`}
//               >
//                 <div className="card h-100 shadow-sm card-raise border-0">
//                   <div className="accent-top" />
//                   <div className="card-body d-flex flex-column">
//                     <div className="d-flex align-items-center gap-3 mb-3">
//                       <div
//                         className="rounded-circle d-flex align-items-center justify-content-center avatar-initials"
//                         style={{ background: colorFromName(fullName) }}
//                         title={fullName || "Médecin"}
//                       >
//                         {initials(m?.prenom, m?.nom)}
//                       </div>
//                       <div>
//                         <div className="fw-semibold">
//                           {fullName || "Nom indisponible"}
//                         </div>
//                         <div className="text-muted small">
//                           {m?.email ?? "-"}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mb-2">
//                       <span className="badge badge-soft d-inline-flex align-items-center gap-1">
//                         <i className="bi bi-hospital"></i>
//                         {chip}
//                       </span>
//                     </div>

//                     {m?.telephone && (
//                       <div className="text-muted small mb-2">
//                         <i className="bi bi-telephone me-1" />
//                         {m.telephone}
//                       </div>
//                     )}

//                     <div className="mt-auto d-flex justify-content-end gap-2">
//                       <button
//                         className="btn btn-sm btn-outline-primary"
//                         onClick={() => handleOpenMedecin(m)}
//                         disabled={!m?.id}
//                         title="Ouvrir la fiche du médecin"
//                       >
//                         <i className="bi bi-box-arrow-up-right me-1" />
//                         Ouvrir
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Styles dédiés */}
//       <style>{`
//         /* header effet verre + gradient pill */
//         .glass-header {
//           background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.6));
//           backdrop-filter: blur(6px);
//           border: 1px solid rgba(0,0,0,0.05);
//         }
//         .bg-gradient {
//           background: linear-gradient(90deg, #e8f6f9, #e6eeff);
//           color: #0b5ed7;
//           border: 1px solid rgba(13,110,253,.15);
//         }

//         /* spinner refresh */
//         .spin { animation: spin .8s linear infinite; }
//         @keyframes spin { from {transform: rotate(0)} to {transform: rotate(360deg)} }

//         /* card hover */
//         .card-raise { transition: transform .15s ease, box-shadow .15s ease; }
//         .card-raise:hover { transform: translateY(-2px); box-shadow: 0 .35rem 1rem rgba(0,0,0,.08); }

//         /* barre d'accent en haut de carte */
//         .accent-top {
//           height: 4px;
//           background: linear-gradient(90deg, #90E0EF, #74c0fc 40%, #b197fc 100%);
//           border-top-left-radius: .75rem;
//           border-top-right-radius: .75rem;
//         }

//         /* avatar */
//         .avatar-initials {
//           width: 56px; height: 56px;
//           font-weight: 700; font-size: 1rem;
//           color: #1f2d3d;
//           box-shadow: inset 0 0 0 2px rgba(255,255,255,.7);
//         }

//         /* badge soft */
//         .badge-soft {
//           background: #f6f9ff;
//           color: #0b5ed7;
//           border: 1px solid rgba(13,110,253,.15);
//           padding: .4rem .6rem;
//           border-radius: 999px;
//           font-weight: 500;
//         }

//         /* skeletons */
//         .shimmer {
//           background: linear-gradient(90deg, #f2f2f2 25%, #e9ecef 37%, #f2f2f2 63%);
//           background-size: 400% 100%;
//           animation: shimmer 1.2s ease-in-out infinite;
//           border-radius: 50%;
//           width: 56px; height: 56px;
//         }
//         .shimmer-line {
//           height: 10px; border-radius: 6px;
//           background: linear-gradient(90deg, #f2f2f2 25%, #e9ecef 37%, #f2f2f2 63%);
//           background-size: 400% 100%;
//           animation: shimmer 1.2s ease-in-out infinite;
//         }
//         .shimmer-chip {
//           height: 28px; width: 160px; border-radius: 999px;
//           background: linear-gradient(90deg, #f2f2f2 25%, #e9ecef 37%, #f2f2f2 63%);
//           background-size: 400% 100%;
//           animation: shimmer 1.2s ease-in-out infinite;
//         }
//         .placeholder-btn {
//           pointer-events: none;
//           opacity: .6;
//         }
//         @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:0 0} }
//       `}</style>
//     </div>
//   );
// }

// export default MedecinList;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// function MedecinList() {
//   const [medecins, setMedecins] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const tokenHeader = () => {
//     const t = localStorage.getItem("token");
//     return t ? { Authorization: `Bearer ${t}` } : {};
//   };

//   const fetchMeds = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const res = await fetch(
//         `${API_BASE_URL}/api/receptionniste/mes-medecins`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json", ...tokenHeader() },
//           credentials: "include",
//         }
//       );

//       if (!res.ok) {
//         const e = await res.json().catch(() => ({}));
//         throw new Error(e.message || `HTTP ${res.status}`);
//       }

//       const data = await res.json().catch(() => []);
//       const list = Array.isArray(data) ? data : data.items ?? [];
//       setMedecins(list);
//     } catch (e) {
//       setError(e?.message || "Impossible de charger les médecins gérés.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMeds();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleOpenMedecin = (m) => {
//     if (m?.id) navigate(`/medecins/${m.id}`);
//   };

//   return (
//     <div className="py-4">
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <h2 className="h4 mb-0">
//           <i className="bi bi-person-badge me-2" />
//           Mes médecins gérés
//           {medecins?.length > 0 && (
//             <span className="badge text-bg-primary ms-2">
//               {medecins.length}
//             </span>
//           )}
//         </h2>
//         <button
//           className="btn btn-outline-secondary"
//           onClick={fetchMeds}
//           disabled={isLoading}
//         >
//           <i
//             className={`bi ${
//               isLoading ? "bi-arrow-repeat spin" : "bi-arrow-clockwise"
//             }`}
//           />
//         </button>
//       </div>

//       {error && <div className="alert alert-danger">{error}</div>}

//       {isLoading && (
//         <div className="text-muted">
//           <div
//             className="spinner-border spinner-border-sm me-2"
//             role="status"
//           />
//           Chargement des médecins…
//         </div>
//       )}

//       {!isLoading && !error && medecins.length === 0 && (
//         <div className="text-center text-muted py-5">
//           <i className="bi bi-emoji-neutral fs-1 d-block mb-2" />
//           <div className="fw-semibold">Aucun médecin trouvé</div>
//           <div className="small">
//             Vous n'avez pas encore de médecins assignés.
//           </div>
//         </div>
//       )}

//       {!isLoading && !error && medecins.length > 0 && (
//         <div className="table-responsive">
//           <table className="table table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>#</th>
//                 <th>Nom complet</th>
//                 <th>Email</th>
//                 <th>Spécialité</th>
//                 <th>Téléphone</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {medecins.map((m, idx) => (
//                 <tr key={m?.id ?? `${m?.email}-${idx}`}>
//                   <td>{idx + 1}</td>
//                   <td>
//                     {m?.prenom ?? ""} {m?.nom ?? ""}
//                   </td>
//                   <td>{m?.email ?? "-"}</td>
//                   <td>{m?.specialite ?? m?.specialty ?? "-"}</td>
//                   <td>{m?.telephone ?? "-"}</td>
//                   <td className="text-end">
//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       disabled={!m?.id}
//                     >
//                       <i className="bi bi-box-arrow-up-right me-1" />
//                       Availabilité
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <style>{`
//         .spin { animation: spin 0.8s linear infinite; }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// }

// export default MedecinList;

// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// function MedecinList() {
//   const [medecins, setMedecins] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Modal states
//   const [showAvail, setShowAvail] = useState(false);
//   const [selectedMed, setSelectedMed] = useState(null);
//   const [availLoading, setAvailLoading] = useState(false);
//   const [availError, setAvailError] = useState(null);
//   const [absences, setAbsences] = useState([]);
//   const [hours, setHours] = useState([]);

//   const navigate = useNavigate();

//   const tokenHeader = () => {
//     const t = localStorage.getItem("token");
//     return t ? { Authorization: `Bearer ${t}` } : {};
//   };

//   const fetchMeds = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const res = await fetch(
//         `${API_BASE_URL}/api/receptionniste/mes-medecins`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json", ...tokenHeader() },
//           credentials: "include",
//         }
//       );

//       if (!res.ok) {
//         const e = await res.json().catch(() => ({}));
//         throw new Error(e.message || `HTTP ${res.status}`);
//       }

//       const data = await res.json().catch(() => []);
//       const list = Array.isArray(data) ? data : data.items ?? [];
//       setMedecins(list);
//     } catch (e) {
//       setError(e?.message || "Impossible de charger les médecins gérés.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMeds();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Helpers
//   const days = useMemo(
//     () => ({
//       1: "Lundi",
//       2: "Mardi",
//       3: "Mercredi",
//       4: "Jeudi",
//       5: "Vendredi",
//       6: "Samedi",
//       7: "Dimanche",
//       0: "Dimanche", // si jamais le backend renvoie 0
//       MONDAY: "Lundi",
//       TUESDAY: "Mardi",
//       WEDNESDAY: "Mercredi",
//       THURSDAY: "Jeudi",
//       FRIDAY: "Vendredi",
//       SATURDAY: "Samedi",
//       SUNDAY: "Dimanche",
//     }),
//     []
//   );

//   const fmtDate = (d) => {
//     try {
//       const x = typeof d === "string" ? new Date(d) : d;
//       if (Number.isNaN(x?.getTime?.())) return d ?? "-";
//       return x.toLocaleDateString("fr-FR");
//     } catch {
//       return d ?? "-";
//     }
//   };
//   const fmtTime = (t) => {
//     // support "HH:mm[:ss]" ou "HHmm" ou ISO time
//     if (!t) return "-";
//     if (/^\d{2}:\d{2}(:\d{2})?$/.test(t)) return t.slice(0, 5);
//     try {
//       const x = new Date(`1970-01-01T${t}`);
//       if (!Number.isNaN(x.getTime())) {
//         return x.toLocaleTimeString("fr-FR", {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//       }
//     } catch {}
//     if (/^\d{4}$/.test(t)) return `${t.slice(0, 2)}:${t.slice(2)}`;
//     return t;
//   };

//   // Ouvrir le modal et charger disponibilité + absences
//   const openAvailability = async (med) => {
//     if (!med?.id) return;
//     setSelectedMed(med);
//     setShowAvail(true);
//     setAvailLoading(true);
//     setAvailError(null);
//     setAbsences([]);
//     setHours([]);

//     try {
//       // ⚠️ Adapte les endpoints si les tiens diffèrent:
//       // Possibles variantes: /api/medecins/{id}/absences, /api/medecin/{id}/weekly-hours, etc.
//       const [resAbs, resHours] = await Promise.all([
//         fetch(
//           `${API_BASE_URL}/api/receptionniste/mes-medecins/${med.id}/absences`,
//           {
//             method: "GET",
//             headers: { "Content-Type": "application/json", ...tokenHeader() },
//             credentials: "include",
//           }
//         ),
//         fetch(
//           `${API_BASE_URL}/api/receptionniste/mes-medecins/${med.id}/horaires`,
//           {
//             method: "GET",
//             headers: { "Content-Type": "application/json", ...tokenHeader() },
//             credentials: "include",
//           }
//         ),
//       ]);

//       if (!resAbs.ok) {
//         const e = await resAbs.json().catch(() => ({}));
//         throw new Error(e.message || `Absences: HTTP ${resAbs.status}`);
//       }
//       if (!resHours.ok) {
//         const e = await resHours.json().catch(() => ({}));
//         throw new Error(e.message || `Horaires: HTTP ${resHours.status}`);
//       }

//       const dataAbs = await resAbs.json().catch(() => []);
//       const dataHours = await resHours.json().catch(() => []);

//       setAbsences(Array.isArray(dataAbs) ? dataAbs : dataAbs.items ?? []);
//       setHours(Array.isArray(dataHours) ? dataHours : dataHours.items ?? []);
//     } catch (e) {
//       setAvailError(
//         e?.message || "Impossible de charger la disponibilité du médecin."
//       );
//     } finally {
//       setAvailLoading(false);
//     }
//   };

//   const closeAvailability = () => {
//     setShowAvail(false);
//     setSelectedMed(null);
//     setAvailError(null);
//     setAbsences([]);
//     setHours([]);
//   };

//   return (
//     <div className="py-4">
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <h2 className="h4 mb-0">
//           <i className="bi bi-person-badge me-2" />
//           Mes médecins gérés
//           {medecins?.length > 0 && (
//             <span className="badge text-bg-primary ms-2">
//               {medecins.length}
//             </span>
//           )}
//         </h2>
//         <button
//           className="btn btn-outline-secondary"
//           onClick={fetchMeds}
//           disabled={isLoading}
//         >
//           <i
//             className={`bi ${
//               isLoading ? "bi-arrow-repeat spin" : "bi-arrow-clockwise"
//             }`}
//           />
//         </button>
//       </div>

//       {error && <div className="alert alert-danger">{error}</div>}

//       {isLoading && (
//         <div className="text-muted">
//           <div
//             className="spinner-border spinner-border-sm me-2"
//             role="status"
//           />
//           Chargement des médecins…
//         </div>
//       )}

//       {!isLoading && !error && medecins.length === 0 && (
//         <div className="text-center text-muted py-5">
//           <i className="bi bi-emoji-neutral fs-1 d-block mb-2" />
//           <div className="fw-semibold">Aucun médecin trouvé</div>
//           <div className="small">
//             Vous n'avez pas encore de médecins assignés.
//           </div>
//         </div>
//       )}

//       {!isLoading && !error && medecins.length > 0 && (
//         <div className="table-responsive">
//           <table className="table table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>#</th>
//                 <th>Nom complet</th>
//                 <th>Email</th>
//                 <th>Spécialité</th>
//                 <th>Téléphone</th>
//                 <th className="text-end">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {medecins.map((m, idx) => (
//                 <tr key={m?.id ?? `${m?.email}-${idx}`}>
//                   <td>{idx + 1}</td>
//                   <td>{`${m?.prenom ?? ""} ${m?.nom ?? ""}`.trim()}</td>
//                   <td>{m?.email ?? "-"}</td>
//                   <td>{m?.specialite ?? m?.specialty ?? "-"}</td>
//                   <td>{m?.telephone ?? "-"}</td>
//                   <td className="text-end">
//                     <div className="btn-group">
//                       <button
//                         className="btn btn-sm btn-outline-primary"
//                         onClick={() => openAvailability(m)}
//                         disabled={!m?.id}
//                       >
//                         <i className="bi bi-calendar-week me-1" />
//                         Disponibilité
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal Disponibilité */}
//       {showAvail && (
//         <div
//           className="modal d-block"
//           tabIndex="-1"
//           role="dialog"
//           aria-modal="true"
//         >
//           <div className="modal-dialog modal-lg modal-dialog-scrollable">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title d-flex align-items-center gap-2">
//                   <i className="bi bi-calendar-week" />
//                   Disponibilité —{" "}
//                   {selectedMed
//                     ? `${selectedMed.prenom ?? ""} ${
//                         selectedMed.nom ?? ""
//                       }`.trim()
//                     : ""}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={closeAvailability}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 {availLoading && (
//                   <div className="text-muted">
//                     <div
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />
//                     Chargement des absences et horaires…
//                   </div>
//                 )}

//                 {availError && (
//                   <div className="alert alert-danger">{availError}</div>
//                 )}

//                 {!availLoading && !availError && (
//                   <>
//                     {/* Horaires hebdomadaires */}
//                     <div className="mb-4">
//                       <h6 className="mb-2">
//                         <i className="bi bi-clock-history me-2" />
//                         Horaires hebdomadaires
//                       </h6>
//                       {hours?.length > 0 ? (
//                         <div className="table-responsive">
//                           <table className="table table-sm table-bordered align-middle">
//                             <thead className="table-light">
//                               <tr>
//                                 <th>Jour</th>
//                                 <th>Début</th>
//                                 <th>Fin</th>
//                                 <th>Durée créneau</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {hours.map((h, i) => (
//                                 <tr key={`h-${i}`}>
//                                   <td>
//                                     {days[h?.weekday] ?? h?.weekday ?? "-"}
//                                   </td>
//                                   <td>
//                                     {fmtTime(h?.start_time ?? h?.startTime)}
//                                   </td>
//                                   <td>{fmtTime(h?.end_time ?? h?.endTime)}</td>
//                                   <td>
//                                     {h?.slot_minutes ?? h?.slotMinutes ?? "-"}{" "}
//                                     min
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       ) : (
//                         <div className="text-muted small">
//                           Aucun horaire enregistré.
//                         </div>
//                       )}
//                     </div>

//                     {/* Absences */}
//                     <div>
//                       <h6 className="mb-2">
//                         <i className="bi bi-person-walking me-2" />
//                         Absences
//                       </h6>
//                       {absences?.length > 0 ? (
//                         <div className="table-responsive">
//                           <table className="table table-sm table-bordered align-middle">
//                             <thead className="table-light">
//                               <tr>
//                                 <th>Début</th>
//                                 <th>Fin</th>
//                                 <th>Motif</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {absences.map((a, i) => (
//                                 <tr key={`a-${i}`}>
//                                   <td>
//                                     {fmtDate(
//                                       a?.date_debut ?? a?.debut ?? a?.startDate
//                                     )}
//                                   </td>
//                                   <td>
//                                     {fmtDate(
//                                       a?.date_fin ?? a?.fin ?? a?.endDate
//                                     )}
//                                   </td>
//                                   <td>{a?.motif ?? a?.reason ?? "-"}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       ) : (
//                         <div className="text-muted small">
//                           Aucune absence enregistrée.
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={closeAvailability}
//                 >
//                   Fermer
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* Backdrop */}
//           <div className="modal-backdrop show"></div>
//         </div>
//       )}

//       <style>{`
//         .spin { animation: spin 0.8s linear infinite; }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         /* Empêche le scroll du body quand le modal est ouvert si nécessaire */
//         body:has(.modal.d-block) { overflow: hidden; }
//       `}</style>
//     </div>
//   );
// }

// export default MedecinList;

// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// function MedecinList() {
//   const [medecins, setMedecins] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Modal states
//   const [showAvail, setShowAvail] = useState(false);
//   const [selectedMed, setSelectedMed] = useState(null);
//   const [availLoading, setAvailLoading] = useState(false);
//   const [availError, setAvailError] = useState(null);
//   const [absences, setAbsences] = useState([]);
//   const [hours, setHours] = useState([]);

//   // Créneaux (nouveau)
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [slotsError, setSlotsError] = useState(null);
//   const [freeSlots, setFreeSlots] = useState([]);
//   const [slotSize, setSlotSize] = useState(30);
//   const [selectedDate, setSelectedDate] = useState(() => {
//     // défaut: aujourd'hui au format yyyy-mm-dd
//     const d = new Date();
//     const mm = `${d.getMonth() + 1}`.padStart(2, "0");
//     const dd = `${d.getDate()}`.padStart(2, "0");
//     return `${d.getFullYear()}-${mm}-${dd}`;
//   });

//   const navigate = useNavigate();

//   const tokenHeader = () => {
//     const t = localStorage.getItem("token");
//     return t ? { Authorization: `Bearer ${t}` } : {};
//   };

//   const fetchMeds = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const res = await fetch(
//         `${API_BASE_URL}/api/receptionniste/mes-medecins`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json", ...tokenHeader() },
//           credentials: "include",
//         }
//       );

//       if (!res.ok) {
//         const e = await res.json().catch(() => ({}));
//         throw new Error(e.message || `HTTP ${res.status}`);
//       }

//       const data = await res.json().catch(() => []);
//       const list = Array.isArray(data) ? data : data.items ?? [];
//       setMedecins(list);
//     } catch (e) {
//       setError(e?.message || "Impossible de charger les médecins gérés.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMeds();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Helpers
//   const days = useMemo(
//     () => ({
//       1: "Lundi",
//       2: "Mardi",
//       3: "Mercredi",
//       4: "Jeudi",
//       5: "Vendredi",
//       6: "Samedi",
//       7: "Dimanche",
//       0: "Dimanche",
//       MONDAY: "Lundi",
//       TUESDAY: "Mardi",
//       WEDNESDAY: "Mercredi",
//       THURSDAY: "Jeudi",
//       FRIDAY: "Vendredi",
//       SATURDAY: "Samedi",
//       SUNDAY: "Dimanche",
//     }),
//     []
//   );

//   const fmtDate = (d) => {
//     try {
//       const x = typeof d === "string" ? new Date(d) : d;
//       if (Number.isNaN(x?.getTime?.())) return d ?? "-";
//       return x.toLocaleDateString("fr-FR");
//     } catch {
//       return d ?? "-";
//     }
//   };

//   const fmtTime = (t) => {
//     if (!t) return "-";
//     if (/^\d{2}:\d{2}(:\d{2})?$/.test(t)) return t.slice(0, 5);
//     try {
//       const x = new Date(`1970-01-01T${t}`);
//       if (!Number.isNaN(x.getTime())) {
//         return x.toLocaleTimeString("fr-FR", {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//       }
//     } catch {}
//     if (/^\d{4}$/.test(t)) return `${t.slice(0, 2)}:${t.slice(2)}`;
//     return t;
//   };

//   // Ouvrir le modal et charger base (absences + horaires)
//   const openAvailability = async (med) => {
//     if (!med?.id) return;
//     setSelectedMed(med);
//     setShowAvail(true);
//     setAvailLoading(true);
//     setAvailError(null);
//     setAbsences([]);
//     setHours([]);
//     setFreeSlots([]);
//     setSlotsError(null);

//     try {
//       const [resAbs, resHours] = await Promise.all([
//         fetch(
//           `${API_BASE_URL}/api/receptionniste/mes-medecins/${med.id}/absences`,
//           {
//             method: "GET",
//             headers: { "Content-Type": "application/json", ...tokenHeader() },
//             credentials: "include",
//           }
//         ),
//         fetch(
//           `${API_BASE_URL}/api/receptionniste/mes-medecins/${med.id}/horaires`,
//           {
//             method: "GET",
//             headers: { "Content-Type": "application/json", ...tokenHeader() },
//             credentials: "include",
//           }
//         ),
//       ]);

//       if (!resAbs.ok) {
//         const e = await resAbs.json().catch(() => ({}));
//         throw new Error(e.message || `Absences: HTTP ${resAbs.status}`);
//       }
//       if (!resHours.ok) {
//         const e = await resHours.json().catch(() => ({}));
//         throw new Error(e.message || `Horaires: HTTP ${resHours.status}`);
//       }

//       const dataAbs = await resAbs.json().catch(() => []);
//       const dataHours = await resHours.json().catch(() => []);
//       setAbsences(Array.isArray(dataAbs) ? dataAbs : dataAbs.items ?? []);
//       setHours(Array.isArray(dataHours) ? dataHours : dataHours.items ?? []);

//       // déclenche un premier chargement de slots pour la date par défaut
//       await fetchFreeSlots(med.id, selectedDate, slotSize);
//     } catch (e) {
//       setAvailError(
//         e?.message || "Impossible de charger la disponibilité du médecin."
//       );
//     } finally {
//       setAvailLoading(false);
//     }
//   };

//   const closeAvailability = () => {
//     setShowAvail(false);
//     setSelectedMed(null);
//     setAvailError(null);
//     setAbsences([]);
//     setHours([]);
//     setFreeSlots([]);
//     setSlotsError(null);
//   };

//   // Appel de l’endpoint unifié: /api/receptionniste/medecins/{id}/availability?date=YYYY-MM-DD&slot=30
//   const fetchFreeSlots = async (medId, dateStr, slot) => {
//     if (!medId || !dateStr) return;
//     setSlotsLoading(true);
//     setSlotsError(null);
//     setFreeSlots([]);
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/api/receptionniste/medecins/${medId}/availability?date=${encodeURIComponent(
//           dateStr
//         )}&slot=${slot}`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json", ...tokenHeader() },
//           credentials: "include",
//         }
//       );
//       if (!res.ok) {
//         const e = await res.json().catch(() => ({}));
//         throw new Error(e.message || `Availability: HTTP ${res.status}`);
//       }
//       const dto = await res.json();
//       setFreeSlots(Array.isArray(dto?.free) ? dto.free : []);
//     } catch (e) {
//       setSlotsError(
//         e?.message || "Impossible de charger les créneaux disponibles."
//       );
//     } finally {
//       setSlotsLoading(false);
//     }
//   };

//   return (
//     <div className="py-4">
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <h2 className="h4 mb-0">
//           <i className="bi bi-person-badge me-2" />
//           Mes médecins gérés
//           {medecins?.length > 0 && (
//             <span className="badge text-bg-primary ms-2">
//               {medecins.length}
//             </span>
//           )}
//         </h2>
//         <button
//           className="btn btn-outline-secondary"
//           onClick={fetchMeds}
//           disabled={isLoading}
//         >
//           <i
//             className={`bi ${
//               isLoading ? "bi-arrow-repeat spin" : "bi-arrow-clockwise"
//             }`}
//           />
//         </button>
//       </div>

//       {error && <div className="alert alert-danger">{error}</div>}

//       {isLoading && (
//         <div className="text-muted">
//           <div
//             className="spinner-border spinner-border-sm me-2"
//             role="status"
//           />
//           Chargement des médecins…
//         </div>
//       )}

//       {!isLoading && !error && medecins.length === 0 && (
//         <div className="text-center text-muted py-5">
//           <i className="bi bi-emoji-neutral fs-1 d-block mb-2" />
//           <div className="fw-semibold">Aucun médecin trouvé</div>
//           <div className="small">
//             Vous n'avez pas encore de médecins assignés.
//           </div>
//         </div>
//       )}

//       {!isLoading && !error && medecins.length > 0 && (
//         <div className="table-responsive">
//           <table className="table table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>#</th>
//                 <th>Nom complet</th>
//                 <th>Email</th>
//                 <th>Spécialité</th>
//                 <th>Téléphone</th>
//                 <th className="text-end">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {medecins.map((m, idx) => (
//                 <tr key={m?.id ?? `${m?.email}-${idx}`}>
//                   <td>{idx + 1}</td>
//                   <td>{`${m?.prenom ?? ""} ${m?.nom ?? ""}`.trim()}</td>
//                   <td>{m?.email ?? "-"}</td>
//                   <td>{m?.specialite ?? m?.specialty ?? "-"}</td>
//                   <td>{m?.telephone ?? "-"}</td>
//                   <td className="text-end">
//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       onClick={() => openAvailability(m)}
//                       disabled={!m?.id}
//                     >
//                       <i className="bi bi-calendar-week me-1" />
//                       Disponibilité
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal Disponibilité */}
//       {showAvail && (
//         <div
//           className="modal d-block"
//           tabIndex="-1"
//           role="dialog"
//           aria-modal="true"
//         >
//           <div className="modal-dialog modal-lg modal-dialog-scrollable">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title d-flex align-items-center gap-2">
//                   <i className="bi bi-calendar-week" />
//                   Disponibilité —{" "}
//                   {selectedMed
//                     ? `${selectedMed.prenom ?? ""} ${
//                         selectedMed.nom ?? ""
//                       }`.trim()
//                     : ""}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={closeAvailability}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 {availLoading && (
//                   <div className="text-muted">
//                     <div
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />
//                     Chargement des absences et horaires…
//                   </div>
//                 )}

//                 {availError && (
//                   <div className="alert alert-danger">{availError}</div>
//                 )}

//                 {!availLoading && !availError && (
//                   <>
//                     {/* --- Créneaux disponibles (nouveau) --- */}
//                     <div className="mb-4">
//                       <h6 className="mb-2 d-flex align-items-center gap-2">
//                         <i className="bi bi-clock me-1" />
//                         Créneaux disponibles
//                       </h6>

//                       <div className="row g-2 align-items-end mb-2">
//                         <div className="col-12 col-md-5">
//                           <label className="form-label">Date</label>
//                           <input
//                             type="date"
//                             className="form-control"
//                             value={selectedDate}
//                             onChange={(e) => setSelectedDate(e.target.value)}
//                           />
//                         </div>
//                         <div className="col-6 col-md-3">
//                           <label className="form-label">Durée (min)</label>
//                           <select
//                             className="form-select"
//                             value={slotSize}
//                             onChange={(e) =>
//                               setSlotSize(parseInt(e.target.value, 10))
//                             }
//                           >
//                             {[10, 15, 20, 30, 40, 45, 60].map((v) => (
//                               <option key={v} value={v}>
//                                 {v}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div className="col-6 col-md-4 d-grid">
//                           <button
//                             className="btn btn-primary"
//                             disabled={slotsLoading || !selectedMed?.id}
//                             onClick={() =>
//                               fetchFreeSlots(
//                                 selectedMed.id,
//                                 selectedDate,
//                                 slotSize
//                               )
//                             }
//                           >
//                             {slotsLoading ? (
//                               <>
//                                 <span
//                                   className="spinner-border spinner-border-sm me-2"
//                                   role="status"
//                                 />
//                                 Chargement…
//                               </>
//                             ) : (
//                               <>
//                                 <i className="bi bi-arrow-repeat me-1" />
//                                 Rafraîchir les créneaux
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       </div>

//                       {slotsError && (
//                         <div className="alert alert-warning">{slotsError}</div>
//                       )}

//                       {!slotsError && (
//                         <div className="d-flex flex-wrap gap-2">
//                           {freeSlots.length > 0 ? (
//                             freeSlots.map((t) => (
//                               <span
//                                 key={t}
//                                 className="badge text-bg-success-subtle border"
//                               >
//                                 <i className="bi bi-check2-circle me-1" />
//                                 {t}
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-muted small">
//                               Aucun créneau disponible pour cette date.
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* Horaires hebdomadaires */}
//                     <div className="mb-4">
//                       <h6 className="mb-2">
//                         <i className="bi bi-clock-history me-2" />
//                         Horaires hebdomadaires
//                       </h6>
//                       {hours?.length > 0 ? (
//                         <div className="table-responsive">
//                           <table className="table table-sm table-bordered align-middle">
//                             <thead className="table-light">
//                               <tr>
//                                 <th>Jour</th>
//                                 <th>Début</th>
//                                 <th>Fin</th>
//                                 <th>Durée créneau</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {hours.map((h, i) => (
//                                 <tr key={`h-${i}`}>
//                                   <td>
//                                     {days[h?.weekday] ?? h?.weekday ?? "-"}
//                                   </td>
//                                   <td>
//                                     {fmtTime(h?.start_time ?? h?.startTime)}
//                                   </td>
//                                   <td>{fmtTime(h?.end_time ?? h?.endTime)}</td>
//                                   <td>
//                                     {h?.slot_minutes ?? h?.slotMinutes ?? "-"}{" "}
//                                     min
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       ) : (
//                         <div className="text-muted small">
//                           Aucun horaire enregistré.
//                         </div>
//                       )}
//                     </div>

//                     {/* Absences */}
//                     <div>
//                       <h6 className="mb-2">
//                         <i className="bi bi-person-walking me-2" />
//                         Absences
//                       </h6>
//                       {absences?.length > 0 ? (
//                         <div className="table-responsive">
//                           <table className="table table-sm table-bordered align-middle">
//                             <thead className="table-light">
//                               <tr>
//                                 <th>Début</th>
//                                 <th>Fin</th>
//                                 <th>Motif</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {absences.map((a, i) => (
//                                 <tr key={`a-${i}`}>
//                                   <td>
//                                     {fmtDate(
//                                       a?.date_debut ?? a?.debut ?? a?.startDate
//                                     )}
//                                   </td>
//                                   <td>
//                                     {fmtDate(
//                                       a?.date_fin ?? a?.fin ?? a?.endDate
//                                     )}
//                                   </td>
//                                   <td>{a?.motif ?? a?.reason ?? "-"}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       ) : (
//                         <div className="text-muted small">
//                           Aucune absence enregistrée.
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={closeAvailability}
//                 >
//                   Fermer
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="modal-backdrop show"></div>
//         </div>
//       )}

//       <style>{`
//         .spin { animation: spin 0.8s linear infinite; }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         body:has(.modal.d-block) { overflow: hidden; }
//       `}</style>
//     </div>
//   );
// }

// export default MedecinList;

// src/components/MedecinList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function MedecinList() {
  const [medecins, setMedecins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [showAvail, setShowAvail] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [availLoading, setAvailLoading] = useState(false);
  const [availError, setAvailError] = useState(null);
  const [absences, setAbsences] = useState([]);
  const [hours, setHours] = useState([]);

  // Créneaux
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [freeSlots, setFreeSlots] = useState([]);
  const [slotSize, setSlotSize] = useState(60);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const mm = `${d.getMonth() + 1}`.padStart(2, "0");
    const dd = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  });

  const navigate = useNavigate();

  const tokenHeader = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  const fmtDateTime = (dateStr, timeStr) => {
    if (!dateStr && !timeStr) return "-";
    const d = dateStr ? fmtDate(dateStr) : "";
    const t = timeStr ? fmtTime(timeStr) : "";
    return [d, t].filter(Boolean).join(" ");
  };

  const fetchMeds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await fetch(
        `${API_BASE_URL}/api/receptionniste/mes-medecins`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", ...tokenHeader() },
          credentials: "include",
        }
      );
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `HTTP ${res.status}`);
      }
      const data = await res.json().catch(() => []);
      const list = Array.isArray(data) ? data : data.items ?? [];
      setMedecins(list);
    } catch (e) {
      setError(e?.message || "Impossible de charger les médecins gérés.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock scroll + fermer sur ESC quand le modal est ouvert
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setShowAvail(false);
    if (showAvail) {
      document.body.classList.add("modal-open");
      window.addEventListener("keydown", onEsc);
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onEsc);
    };
  }, [showAvail]);

  // Helpers
  const days = useMemo(
    () => ({
      1: "Lundi",
      2: "Mardi",
      3: "Mercredi",
      4: "Jeudi",
      5: "Vendredi",
      6: "Samedi",
      7: "Dimanche",
      0: "Dimanche",
      MONDAY: "Lundi",
      TUESDAY: "Mardi",
      WEDNESDAY: "Mercredi",
      THURSDAY: "Jeudi",
      FRIDAY: "Vendredi",
      SATURDAY: "Samedi",
      SUNDAY: "Dimanche",
    }),
    []
  );

  const fmtDate = (d) => {
    try {
      const x = typeof d === "string" ? new Date(d) : d;
      if (Number.isNaN(x?.getTime?.())) return d ?? "-";
      return x.toLocaleDateString("fr-FR");
    } catch {
      return d ?? "-";
    }
  };

  const fmtTime = (t) => {
    if (!t) return "-";
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(t)) return t.slice(0, 5);
    try {
      const x = new Date(`1970-01-01T${t}`);
      if (!Number.isNaN(x.getTime())) {
        return x.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch {}
    if (/^\d{4}$/.test(t)) return `${t.slice(0, 2)}:${t.slice(2)}`;
    return t;
  };

  // // Normalise le "weekday" venant du backend (nombre, string EN, parfois 0=Dimanche)
  // const normWeekday = (w) => {
  //   if (w == null) return null;
  //   const map = {
  //     MONDAY: 1,
  //     TUESDAY: 2,
  //     WEDNESDAY: 3,
  //     THURSDAY: 4,
  //     FRIDAY: 5,
  //     SATURDAY: 6,
  //     SUNDAY: 7,
  //     0: 7,
  //   };
  //   if (typeof w === "string") {
  //     const up = w.toUpperCase();
  //     if (map[up]) return map[up];
  //     const n = Number(w);
  //     if (!Number.isNaN(n)) return map[n] ?? n;
  //     return null;
  //   }
  //   return map[w] ?? Number(w);
  // };

  // // Transforme la liste brute en lignes groupées par jour
  // const groupHoursForDisplay = (list, daysDict) => {
  //   const byDay = new Map();

  //   (list ?? []).forEach((h) => {
  //     const wd = normWeekday(h?.weekday ?? h?.dayOfWeek ?? h?.jourSemaine);
  //     if (!wd) return;

  //     const start = h?.start_time ?? h?.startTime ?? h?.heureDebut;
  //     const end = h?.end_time ?? h?.endTime ?? h?.heureFin;
  //     const slot = h?.slot_minutes ?? h?.slotMinutes ?? h?.dureeCreneau;

  //     if (!byDay.has(wd))
  //       byDay.set(wd, { weekday: wd, intervals: [], slotMin: slot ?? null });
  //     const row = byDay.get(wd);
  //     if (!row.slotMin && slot) row.slotMin = slot;
  //     if (start || end) row.intervals.push([start, end]);
  //   });

  //   // Trie par jour puis par heure de début
  //   return Array.from(byDay.values())
  //     .sort((a, b) => a.weekday - b.weekday)
  //     .map((row) => {
  //       const label = daysDict[row.weekday] ?? row.weekday;
  //       const intervalsText = row.intervals
  //         .filter(([s, e]) => s || e)
  //         .sort((a, b) =>
  //           String(a?.[0] ?? "").localeCompare(String(b?.[0] ?? ""))
  //         )
  //         .map(([s, e]) => `[${s ? fmtTime(s) : "-"} ${e ? fmtTime(e) : "-"}]`)
  //         .join(" ");
  //       return { label, intervalsText, slotMin: row.slotMin };
  //     });
  // };

  // --- helpers hoistés ---
  // --- helpers hoistés ---
  function normWeekday(w) {
    if (w == null) return null;
    const map = {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
      SUNDAY: 7,
      0: 7,
    };
    if (typeof w === "string") {
      const up = w.toUpperCase();
      if (map[up]) return map[up];
      const n = Number(w);
      if (!Number.isNaN(n)) return map[n] ?? n;
      return null;
    }
    return map[w] ?? Number(w);
  }

  function groupHoursForDisplay(list, daysDict, fmtTime) {
    const byDay = new Map();

    (list ?? []).forEach((h) => {
      const wd = normWeekday(h?.weekday ?? h?.dayOfWeek ?? h?.jourSemaine);
      if (!wd) return;

      const start = h?.start_time ?? h?.startTime ?? h?.heureDebut;
      const end = h?.end_time ?? h?.endTime ?? h?.heureFin;
      const slot = h?.slot_minutes ?? h?.slotMinutes ?? h?.dureeCreneau;

      if (!byDay.has(wd))
        byDay.set(wd, { weekday: wd, intervals: [], slotMin: slot ?? null });
      const row = byDay.get(wd);
      if (!row.slotMin && slot) row.slotMin = slot;
      if (start || end) row.intervals.push([start, end]);
    });

    return Array.from(byDay.values())
      .sort((a, b) => a.weekday - b.weekday)
      .map((row) => {
        const label = daysDict[row.weekday] ?? row.weekday;
        const intervalsText = row.intervals
          .filter(([s, e]) => s || e)
          .sort((a, b) =>
            String(a?.[0] ?? "").localeCompare(String(b?.[0] ?? ""))
          )
          .map(([s, e]) => `[${s ? fmtTime(s) : "-"} ${e ? fmtTime(e) : "-"}]`)
          .join(" ");
        return {
          label,
          slotMin: row.slotMin,
          intervals: row.intervals,
          intervalsText,
        };
      });
  }

  const groupedHours = useMemo(
    () => groupHoursForDisplay(hours, days, fmtTime),
    [hours, days] // fmtTime est stable si défini inline; sinon ajoute-le ici
  );

  // Ouvrir le modal et charger base (absences + horaires)
  const openAvailability = async (med) => {
    if (!med?.id) return;
    setSelectedMed(med);
    setShowAvail(true);
    setAvailLoading(true);
    setAvailError(null);
    setAbsences([]);
    setHours([]);
    setFreeSlots([]);
    setSlotsError(null);

    try {
      const [resAbs, resHours] = await Promise.all([
        fetch(
          `${API_BASE_URL}/api/receptionniste/mes-medecins/${med.id}/absences`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json", ...tokenHeader() },
            credentials: "include",
          }
        ),
        fetch(
          `${API_BASE_URL}/api/receptionniste/mes-medecins/${med.id}/horaires`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json", ...tokenHeader() },
            credentials: "include",
          }
        ),
      ]);

      if (!resAbs.ok) {
        const e = await resAbs.json().catch(() => ({}));
        throw new Error(e.message || `Absences: HTTP ${resAbs.status}`);
      }
      if (!resHours.ok) {
        const e = await resHours.json().catch(() => ({}));
        throw new Error(e.message || `Horaires: HTTP ${resHours.status}`);
      }

      const dataAbs = await resAbs.json().catch(() => []);
      const dataHours = await resHours.json().catch(() => []);
      setAbsences(Array.isArray(dataAbs) ? dataAbs : dataAbs.items ?? []);
      setHours(Array.isArray(dataHours) ? dataHours : dataHours.items ?? []);

      // premier chargement de slots pour la date par défaut
      await fetchFreeSlots(med.id, selectedDate, slotSize);
    } catch (e) {
      setAvailError(
        e?.message || "Impossible de charger la disponibilité du médecin."
      );
    } finally {
      setAvailLoading(false);
    }
  };

  const closeAvailability = () => {
    setShowAvail(false);
    setSelectedMed(null);
    setAvailError(null);
    setAbsences([]);
    setHours([]);
    setFreeSlots([]);
    setSlotsError(null);
  };

  // Endpoint unifié: /api/receptionniste/medecins/{id}/availability?date=YYYY-MM-DD&slot=30
  // const fetchFreeSlots = async (medId, dateStr, slot) => {
  //   if (!medId || !dateStr) return;
  //   setSlotsLoading(true);
  //   setSlotsError(null);
  //   setFreeSlots([]);
  //   try {
  //     ///medecins/${medId}
  //     const res = await fetch(
  //       `${API_BASE_URL}/api/receptionniste/availability?medecinId=${medId}&date=${encodeURIComponent(dateStr)}&slot=${slot}`
  //       {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json", ...tokenHeader() },
  //         credentials: "include",
  //       }
  //     );
  //     if (!res.ok) {
  //       const e = await res.json().catch(() => ({}));
  //       throw new Error(e.message || `Availability: HTTP ${res.status}`);
  //     }
  //     const dto = await res.json();
  //     setFreeSlots(Array.isArray(dto?.free) ? dto.free : []);
  //   } catch (e) {
  //     setSlotsError(
  //       e?.message || "Impossible de charger les créneaux disponibles."
  //     );
  //   } finally {
  //     setSlotsLoading(false);
  //   }
  // };

  // GET /api/receptionniste/availability?medecinId=..&date=YYYY-MM-DD&slot=30
  const fetchFreeSlots = async (medId, dateStr, slot) => {
    if (!medId || !dateStr) return;
    setSlotsLoading(true);
    setSlotsError(null);
    setFreeSlots([]);

    try {
      const url = `${API_BASE_URL}/api/receptionniste/availability?medecinId=${encodeURIComponent(
        medId
      )}&date=${encodeURIComponent(dateStr)}&slot=${slot}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...tokenHeader() },
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Availability: HTTP ${res.status} ${txt}`);
      }

      const dto = await res.json().catch(() => ({}));
      // nouveau format: { freeSlots: [...] } ; ancien (fallback): { free: [...] }
      const slots = Array.isArray(dto?.freeSlots)
        ? dto.freeSlots
        : Array.isArray(dto?.free)
        ? dto.free
        : [];
      setFreeSlots(slots);
    } catch (e) {
      setSlotsError(
        e?.message || "Impossible de charger les créneaux disponibles."
      );
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (!showAvail || !selectedMed?.id) return;
    fetchFreeSlots(selectedMed.id, selectedDate, slotSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, slotSize, selectedMed?.id, showAvail]);

  // -------- Absences: helpers --------
  function _hasExplicitTime(v) {
    if (!v) return false;
    if (v instanceof Date) return true;
    if (typeof v === "string")
      return /T\d{2}:\d{2}| \d{2}:\d{2}|^\d{2}:\d{2}/.test(v);
    return false;
  }
  function _toDate(d) {
    try {
      const x = new Date(d);
      return Number.isNaN(x) ? null : x;
    } catch {
      return null;
    }
  }
  function _sameDay(a, b) {
    const da = _toDate(a),
      db = _toDate(b);
    return (
      !!(da && db) &&
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  }
  function isFullDayAbsence(a) {
    // format nouveau : { date, start_time?, end_time? }
    const hasSingleDate = a?.date != null;
    const sTime = a?.start_time ?? a?.startTime ?? a?.heureDebut ?? null;
    const eTime = a?.end_time ?? a?.endTime ?? a?.heureFin ?? null;

    const sDate = hasSingleDate
      ? a.date
      : a?.date_debut ?? a?.debut ?? a?.startDate ?? a?.dateDebut ?? null;
    const eDate = hasSingleDate
      ? a.date
      : a?.date_fin ?? a?.fin ?? a?.endDate ?? a?.dateFin ?? null;

    // 1) juste "date" sans heures
    if (hasSingleDate && !sTime && !eTime) return true;

    // 2) même jour, pas d'heures explicites (dans champs date ni start/end_time)
    if (
      sDate &&
      eDate &&
      _sameDay(sDate, eDate) &&
      !_hasExplicitTime(sDate) &&
      !_hasExplicitTime(eDate) &&
      !sTime &&
      !eTime
    )
      return true;

    // 3) 00:00 -> 23:59/24:00 sur le même jour
    const st = (sTime || "").slice(0, 5);
    const et = (eTime || "").slice(0, 5);
    if (
      _sameDay(sDate, eDate) &&
      st === "00:00" &&
      (et === "23:59" || et === "24:00")
    )
      return true;

    return false;
  }

  return (
    <div className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 mb-0">
          <i className="bi bi-person-badge me-2" />
          Mes médecins gérés
          {medecins?.length > 0 && (
            <span className="badge text-bg-primary ms-2">
              {medecins.length}
            </span>
          )}
        </h2>
        <button
          className="btn btn-outline-secondary"
          onClick={fetchMeds}
          disabled={isLoading}
        >
          <i
            className={`bi ${
              isLoading ? "bi-arrow-repeat spin" : "bi-arrow-clockwise"
            }`}
          />
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading && (
        <div className="text-muted">
          <div
            className="spinner-border spinner-border-sm me-2"
            role="status"
          />
          Chargement des médecins…
        </div>
      )}

      {!isLoading && !error && medecins.length === 0 && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-emoji-neutral fs-1 d-block mb-2" />
          <div className="fw-semibold">Aucun médecin trouvé</div>
          <div className="small">
            Vous n'avez pas encore de médecins assignés.
          </div>
        </div>
      )}

      {!isLoading && !error && medecins.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Spécialité</th>
                <th>Téléphone</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medecins.map((m, idx) => (
                <tr key={m?.id ?? `${m?.email}-${idx}`}>
                  <td>{idx + 1}</td>
                  <td>{`${m?.prenom ?? ""} ${m?.nom ?? ""}`.trim()}</td>
                  <td>{m?.email ?? "-"}</td>
                  <td>{m?.specialite ?? m?.specialty ?? "-"}</td>
                  <td>{m?.telephone ?? "-"}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openAvailability(m)}
                      disabled={!m?.id}
                    >
                      <i className="bi bi-calendar-week me-1" />
                      Disponibilité
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Disponibilité (Portal) */}
      {showAvail &&
        createPortal(
          <>
            {/* Backdrop cliquable pour fermer */}
            <div
              className="modal-backdrop fade show"
              onClick={closeAvailability}
            />
            <div className="modal show d-block" role="dialog" aria-modal="true">
              <div
                className="modal-dialog modal-lg modal-dialog-scrollable"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title d-flex align-items-center gap-2">
                      <i className="bi bi-calendar-week" />
                      Disponibilité —{" "}
                      {selectedMed
                        ? `${selectedMed.prenom ?? ""} ${
                            selectedMed.nom ?? ""
                          }`.trim()
                        : ""}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeAvailability}
                    />
                  </div>

                  <div className="modal-body">
                    {availLoading && (
                      <div className="text-muted">
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Chargement des absences et horaires…
                      </div>
                    )}

                    {availError && (
                      <div className="alert alert-danger">{availError}</div>
                    )}

                    {!availLoading && !availError && (
                      <>
                        {/* --- Créneaux disponibles --- */}
                        <div className="mb-4">
                          <h6 className="mb-2 d-flex align-items-center gap-2">
                            <i className="bi bi-clock me-1" />
                            Créneaux disponibles
                          </h6>

                          <div className="row g-2 align-items-end mb-2">
                            <div className="col-12 col-md-5">
                              <label className="form-label">Date</label>
                              <input
                                type="date"
                                className="form-control"
                                value={selectedDate}
                                onChange={(e) =>
                                  setSelectedDate(e.target.value)
                                }
                              />
                            </div>
                            <div className="col-6 col-md-3">
                              <label className="form-label">Durée (min)</label>
                              <select
                                className="form-select"
                                value={slotSize}
                                onChange={(e) =>
                                  setSlotSize(parseInt(e.target.value, 10))
                                }
                              >
                                {[60].map((v) => (
                                  <option key={v} value={v}>
                                    {v}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-6 col-md-4 d-grid">
                              <button
                                className="btn btn-primary"
                                disabled={slotsLoading || !selectedMed?.id}
                                onClick={() =>
                                  fetchFreeSlots(
                                    selectedMed.id,
                                    selectedDate,
                                    slotSize
                                  )
                                }
                              >
                                {slotsLoading ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                    />
                                    Chargement…
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-arrow-repeat me-1" />
                                    Rafraîchir les créneaux
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {slotsError && (
                            <div className="alert alert-warning">
                              {slotsError}
                            </div>
                          )}

                          {!slotsError && (
                            <div className="d-flex flex-wrap gap-2">
                              {freeSlots.length > 0 ? (
                                freeSlots.map((t) => (
                                  <span
                                    key={t}
                                    className="badge text-bg-success-subtle text-dark border"
                                  >
                                    <i className="bi bi-check2-circle me-1" />
                                    {t}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted small">
                                  Aucun créneau disponible pour cette date.
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Horaires hebdomadaires */}
                        {/* <div className="mb-4">
                          <h6 className="mb-2">
                            <i className="bi bi-clock-history me-2" />
                            Disponibilité du médecin
                          </h6>
                          {hours?.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-sm table-bordered align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Jour</th>
                                    <th>Début</th>
                                    <th>Fin</th>
                                    <th>Durée créneau</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {hours.map((h, i) => {
                                    const weekday =
                                      h?.weekday ??
                                      h?.dayOfWeek ??
                                      h?.jourSemaine;
                                    const start =
                                      h?.start_time ??
                                      h?.startTime ??
                                      h?.heureDebut;
                                    const end =
                                      h?.end_time ?? h?.endTime ?? h?.heureFin;
                                    const slotMin =
                                      h?.slot_minutes ??
                                      h?.slotMinutes ??
                                      h?.dureeCreneau;
                                    return (
                                      <tr key={`h-${i}`}>
                                        <td>
                                          {days[weekday] ?? weekday ?? "-"}
                                        </td>
                                        <td>{fmtTime(start)}</td>
                                        <td>{fmtTime(end)}</td>
                                        <td>{slotMin ?? "-"} min</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-muted small">
                              Aucun horaire enregistré.
                            </div>
                          )}
                        </div> */}
                        <div className="mb-4">
                          <h6 className="mb-2">
                            <i className="bi bi-clock-history me-2" />
                            Disponibilité du médecin
                          </h6>

                          {groupedHours.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-sm table-bordered align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Jour</th>
                                    <th>Début</th>
                                    <th>Fin</th>
                                    <th>Durée créneau</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {groupedHours.map((row, i) => {
                                    const slotCell = row.slotMin
                                      ? `${row.slotMin} min`
                                      : "- min";

                                    // S'il n'y a qu'un seul créneau : on garde Début / Fin séparés
                                    if ((row.intervals?.length ?? 0) === 1) {
                                      const [s, e] = row.intervals[0] ?? [];
                                      return (
                                        <tr key={`wh-${i}`}>
                                          <td>{row.label}</td>
                                          <td>{s ? fmtTime(s) : "-"}</td>
                                          <td>{e ? fmtTime(e) : "-"}</td>
                                          <td>{slotCell}</td>
                                        </tr>
                                      );
                                    }

                                    // Sinon : plusieurs créneaux -> on les regroupe sur une seule ligne
                                    return (
                                      <tr key={`wh-${i}`}>
                                        <td>{row.label}</td>
                                        <td colSpan={2}>
                                          {row.intervalsText || "-"}
                                        </td>
                                        <td>{slotCell}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-muted small">
                              Aucun horaire enregistré.
                            </div>
                          )}
                        </div>

                        {/* Absences */}
                        {/* <div>
                          <h6 className="mb-2">
                            <i className="bi bi-person-walking me-2" />
                            Absences
                          </h6>
                          {absences?.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-sm table-bordered align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Début</th>
                                    <th>Fin</th>
                                    <th>Motif</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {absences.map((a, i) => {
                                    const startDate = a?.date_debut ?? a?.debut ?? a?.startDate ?? a?.dateDebut;
                                    const endDate = a?.date_fin ?? a?.fin ?? a?.endDate ?? a?.dateFin;
                                    return (
                                      <tr key={`a-${i}`}>
                                        <td>{fmtDate(startDate)}</td>
                                        <td>{fmtDate(endDate)}</td>
                                        <td>{a?.motif ?? a?.reason ?? "-"}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-muted small">Aucune absence enregistrée.</div>
                          )}
                        </div> */}
                        {/* Absences */}
                        <div>
                          <h6 className="mb-2">
                            <i className="bi bi-person-walking me-2" />
                            Absences
                          </h6>

                          {absences?.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-sm table-bordered align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Début</th>
                                    <th>Fin</th>
                                    <th>Motif</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {absences.map((a, i) => {
                                    const hasSingleDate = a?.date != null;
                                    const dateUnique = a?.date ?? null;

                                    const startTime =
                                      a?.start_time ??
                                      a?.startTime ??
                                      a?.heureDebut ??
                                      null;
                                    const endTime =
                                      a?.end_time ??
                                      a?.endTime ??
                                      a?.heureFin ??
                                      null;

                                    const startDateOld =
                                      a?.date_debut ??
                                      a?.debut ??
                                      a?.startDate ??
                                      a?.dateDebut ??
                                      null;
                                    const endDateOld =
                                      a?.date_fin ??
                                      a?.fin ??
                                      a?.endDate ??
                                      a?.dateFin ??
                                      null;

                                    const startDate = hasSingleDate
                                      ? dateUnique
                                      : startDateOld;
                                    const endDate = hasSingleDate
                                      ? dateUnique
                                      : endDateOld;

                                    const motif = a?.motif ?? a?.reason ?? "";

                                    if (isFullDayAbsence(a)) {
                                      const theDate =
                                        startDate || endDate || dateUnique;
                                      return (
                                        <tr key={`a-${i}`}>
                                          <td colSpan={2}>
                                            {fmtDate(theDate)}
                                          </td>
                                          <td>
                                            {motif.trim()
                                              ? motif
                                              : "Journée entière"}
                                          </td>
                                        </tr>
                                      );
                                    }

                                    // Absence partielle -> on garde Début / Fin séparés (date + heure si dispo)
                                    return (
                                      <tr key={`a-${i}`}>
                                        <td>
                                          {fmtDateTime(startDate, startTime)}
                                        </td>
                                        <td>{fmtDateTime(endDate, endTime)}</td>
                                        <td>{motif || "-"}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-muted small">
                              Aucune absence enregistrée.
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeAvailability}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Modal fixes */
        .modal { z-index: 1055 !important; }
        .modal-backdrop { z-index: 1050 !important; }
        .modal-open { overflow: hidden; }
      `}</style>
    </div>
  );
}

export default MedecinList;
