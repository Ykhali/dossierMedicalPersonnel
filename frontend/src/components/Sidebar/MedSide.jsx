// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import "./sidebar-medecin.css";

// export default function MedSide() {
//   return (
//     <div className="med-shell">
//       {/* Sidebar fixe (≥ lg) */}
//       <aside className="sidebar-fixed d-none d-lg-flex flex-column border-end">
//         <Brand />
//         <NavMenu />
//       </aside>

//       {/* Offcanvas (< lg) */}
//       <div
//         className="offcanvas offcanvas-start offcanvas-med"
//         tabIndex="-1"
//         id="medSidebar"
//         aria-labelledby="medSidebarLabel"
//         data-bs-scroll="true"
//         data-bs-backdrop="true"
//       >
//         <div className="offcanvas-header">
//           <div className="d-flex align-items-center gap-2">
//             <div className="brand-logo rounded-3 d-inline-flex align-items-center justify-content-center">
//               <i className="bi bi-activity" />
//             </div>
//             <h6 id="medSidebarLabel" className="mb-0">
//               Espace Médecin
//             </h6>
//           </div>
//           <button
//             className="btn-close"
//             type="button"
//             data-bs-dismiss="offcanvas"
//             aria-label="Fermer"
//           />
//         </div>
//         <div className="offcanvas-body p-0">
//           <NavMenu dismissOnClick />
//         </div>
//       </div>

//       {/* Contenu */}
//       <div className="med-content">
//         <header className="topbar border-bottom">
//           <div className="d-flex align-items-center gap-2">
//             {/* Bouton menu mobile */}
//             <button
//               className="btn btn-outline-med btn-sm d-lg-none"
//               type="button"
//               data-bs-toggle="offcanvas"
//               data-bs-target="#medSidebar"
//               aria-controls="medSidebar"
//             >
//               <i className="bi bi-list me-1" /> Menu
//             </button>
//             <h5 className="mb-0 fw-semibold text-medical">Espace Médecin</h5>
//           </div>

//           <div className="d-flex align-items-center gap-3">
//             <div className="d-none d-sm-flex align-items-center gap-2">
//               <img
//                 src="https://ui-avatars.com/api/?name=Dr+Mehdi"
//                 className="rounded-circle avatar"
//                 alt="Avatar"
//               />
//               <div className="small">
//                 <div className="fw-semibold">Dr. Mehdi</div>
//                 <div className="text-muted">Cardiologie</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="page-area">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// function Brand() {
//   return (
//     <div className="d-flex align-items-center gap-2 brand px-3 pt-3 pb-2">
//       <div className="brand-logo rounded-3 d-inline-flex align-items-center justify-content-center">
//         <i className="bi bi-activity" />
//       </div>
//       <div className="brand-text">
//         <div className="fw-bold text-medical mb-0">AloExpert PRO</div>
//         <small className="text-muted">Dashboard Médecin</small>
//       </div>
//     </div>
//   );
// }

// function NavMenu({ dismissOnClick = false }) {
//   // On ajoute data-bs-dismiss="offcanvas" pour que Bootstrap ferme le menu tout seul en mobile
//   const dismiss = dismissOnClick ? { "data-bs-dismiss": "offcanvas" } : {};
//   const linkBase =
//     "nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3";

//   const Item = ({ to, icon, label, badge, end = false }) => (
//     <li>
//       <NavLink
//         to={to}
//         end={end}
//         className={({ isActive }) => `${linkBase} ${isActive ? "active" : ""}`}
//         {...dismiss}
//       >
//         <i className={`bi ${icon} fs-5`} />
//         <span className="label">{label}</span>
//         {badge && (
//           <span className="badge ms-auto bg-soft-med text-medical">
//             {badge}
//           </span>
//         )}
//       </NavLink>
//     </li>
//   );

//   return (
//     <nav className="menu mt-2 mb-3">
//       <ul className="nav nav-pills flex-column">
//         <Item
//           to="/medecin"
//           icon="bi-speedometer2"
//           label="Tableau de bord"
//           end
//         />

//         <li className="mt-2 small text-muted px-3">Rendez-vous</li>
//         <Item
//           to="/medecin/rendezvous/auj"
//           icon="bi-calendar-check"
//           label="Aujourd’hui"
//           badge="12"
//         />
//         <Item
//           to="/medecin/rendezvous/a-venir"
//           icon="bi-calendar-event"
//           label="À venir"
//         />
//         <Item
//           to="/medecin/horaires"
//           icon="bi-clock-history"
//           label="Mes horaires"
//         />

//         <li className="mt-2 small text-muted px-3">Patients</li>
//         <Item to="/medecin/patients" icon="bi-people" label="Liste patients" />
//         <Item
//           to="/medecin/dossiers"
//           icon="bi-journal-medical"
//           label="Dossiers médicaux"
//         />

//         <li className="mt-2 small text-muted px-3">Communication</li>
//         <Item
//           to="/medecin/messages"
//           icon="bi-chat-dots"
//           label="Messages"
//           badge="5"
//         />
//         <Item
//           to="/medecin/notifications"
//           icon="bi-bell"
//           label="Notifications"
//         />

//         <li className="mt-2 small text-muted px-3">Compte</li>
//         <Item to="/medecin/parametres" icon="bi-gear" label="Paramètres" />
//         <Item to="/logout" icon="bi-box-arrow-right" label="Déconnexion" />
//       </ul>
//     </nav>
//   );
// }
// MedSide.jsx
// import React from "react";
// import { NavLink } from "react-router-dom"; // garde si tu utilises le mode router
// import "./sidebar-medecin.css";

// /**
//  * Props supportées :
//  * - activeSection?: string         // si défini -> mode contrôlé
//  * - onSectionChange?: (id) => void // si défini -> mode contrôlé
//  */
// export default function MedSide({ 
//     activeSection,
//     onSectionChange, 
//     badgeToday = 0, 
//     badgeUpcoming = 0, 
// }) {
//   const controlled = typeof onSectionChange === "function";

//   // Rend un item soit en <button> (contrôlé), soit en <NavLink> (router)
//   const Item = ({ id, to, icon, label, badge, end = false }) => {
//     const base = "d-flex align-items-center gap-2 px-3 py-2 rounded-3";
//     if (controlled) {
//       const isActive = activeSection === id;
//       return (
//         <li>
//           <button
//             type="button"
//             className={`nav-link w-100 text-start ${base} ${isActive ? "active" : ""}`}
//             onClick={() => onSectionChange(id)}
//             data-bs-dismiss="offcanvas" /* ferme l’offcanvas en mobile */
//             title={label}
//           >
//             <i className={`bi ${icon} fs-5`} />
//             <span className="label">{label}</span>
//             {badge && <span className="badge ms-auto bg-soft-med text-medical">{badge}</span>}
//           </button>
//         </li>
//       );
//     }

//     // Mode router (comportement actuel)
//     return (
//       <li>
//         <NavLink
//           to={to}
//           end={end}
//           className={({ isActive }) => `nav-link ${base} ${isActive ? "active" : ""}`}
//           data-bs-dismiss="offcanvas"
//           title={label}
//         >
//           <i className={`bi ${icon} fs-5`} />
//           <span className="label">{label}</span>
//           {badge && <span className="badge ms-auto bg-soft-med text-medical">{badge}</span>}
//         </NavLink>
//       </li>
//     );
//   };

//   return (
//     <>
//       {/* Sidebar fixe (≥ lg) */}
//       <aside className="sidebar-fixed d-none d-lg-flex flex-column border-end">
//         <Brand />
//         <nav className="menu mt-2 mb-3">
//           <ul className="nav nav-pills flex-column">
//             <Item id="dashboard" to="/medecin" icon="bi-speedometer2" label="Tableau de bord" end />

//             <li className="mt-2 small text-muted px-3">Rendez-vous</li>
//             <Item id="rv-auj" to="/medecin/rendezvous/auj" icon="bi-calendar-check" label="Aujourd’hui" badge="12" />
//             <Item id="rv-avenir" to="/medecin/rendezvous/a-venir" icon="bi-calendar-event" label="À venir" />
//             <Item id="horaires" to="/medecin/horaires" icon="bi-clock-history" label="Mes horaires" />

//             <li className="mt-2 small text-muted px-3">Patients</li>
//             <Item id="patients" to="/medecin/patients" icon="bi-people" label="Liste patients" />
//             <Item id="dossiers" to="/medecin/dossiers" icon="bi-journal-medical" label="Dossiers médicaux" />

//             <li className="mt-2 small text-muted px-3">Communication</li>
//             <Item id="messages" to="/medecin/messages" icon="bi-chat-dots" label="Messages" badge="5" />
            

//             <li className="mt-2 small text-muted px-3">Compte</li>
//             <Item id="parametres" to="/medecin/parametres" icon="bi-gear" label="Paramètres" />
//             <Item id="logout" to="/logout" icon="bi-box-arrow-right" label="Déconnexion" />
//           </ul>
//         </nav>
//       </aside>

//       {/* Offcanvas (< lg) — id utilisé par le bouton topbar */}
//       <div
//         className="offcanvas offcanvas-start offcanvas-med"
//         id="medSidebar"
//         tabIndex="-1"
//         aria-labelledby="medSidebarLabel"
//         data-bs-scroll="true"
//         data-bs-backdrop="true"
//       >
//         <div className="offcanvas-header">
//           <div className="d-flex align-items-center gap-2">
//             <div className="brand-logo rounded-3 d-inline-flex align-items-center justify-content-center">
//               <i className="bi bi-activity" />
//             </div>
//             <h6 id="medSidebarLabel" className="mb-0">Espace Médecin</h6>
//           </div>
//           <button className="btn-close" type="button" data-bs-dismiss="offcanvas" aria-label="Fermer" />
//         </div>

//         <div className="offcanvas-body p-0">
//           <nav className="menu mt-2 mb-3">
//             <ul className="nav nav-pills flex-column">
//               <Item id="dashboard" to="/medecin" icon="bi-speedometer2" label="Tableau de bord" end />
//               <li className="mt-2 small text-muted px-3">Rendez-vous</li>
//               <Item id="rv-auj" to="/medecin/rendezvous/auj" icon="bi-calendar-check" label="Aujourd’hui" badge="12" />
//               <Item id="rv-avenir" to="/medecin/rendezvous/a-venir" icon="bi-calendar-event" label="À venir" />
//               <Item id="horaires" to="/medecin/horaires" icon="bi-clock-history" label="Mes horaires" />
//               <li className="mt-2 small text-muted px-3">Patients</li>
//               <Item id="patients" to="/medecin/patients" icon="bi-people" label="Liste patients" />
//               <Item id="dossiers" to="/medecin/dossiers" icon="bi-journal-medical" label="Dossiers médicaux" />
//               <li className="mt-2 small text-muted px-3">Communication</li>
//               <Item id="messages" to="/medecin/messages" icon="bi-chat-dots" label="Messages" badge="5" />
//               <li className="mt-2 small text-muted px-3">Compte</li>
//               <Item id="parametres" to="/medecin/parametres" icon="bi-gear" label="Paramètres" />
//               <Item id="logout" to="/logout" icon="bi-box-arrow-right" label="Déconnexion" />
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </>
//   );
// }

// function Brand() {
//   return (
//     <div className="d-flex align-items-center gap-2 brand px-3 pt-3 pb-2">
//       <div className="brand-logo rounded-3 d-inline-flex align-items-center justify-content-center">
//         <i className="bi bi-activity" />
//       </div>
//       <div className="brand-text">
//         <div className="fw-bold text-medical mb-0">AloExpert PRO</div>
//         <small className="text-muted">Dashboard Médecin</small>
//       </div>
//     </div>
//   );
// }
// MedSide.jsx




// import React from "react";
// import "./sidebar-medecin.css";
// import { useNavigate, NavLink } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";

// /**
//  * Props:
//  * - activeSection?: string
//  * - onSectionChange?: (id) => void
//  * - badgeToday?: number
//  * - badgeUpcoming?: number
//  */
// export default function MedSide({
//   activeSection,
//   onSectionChange,
//   badgeToday = 0,
//   badgeUpcoming = 0,
// }) {

//   const navigate = useNavigate();

//   const handleLogoutClick = async () => {
//     try {
//       await fetch(`${API_BASE_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include", // supprime le cookie refresh côté serveur
//       });
//     } catch {
//       // même si l'appel échoue, on nettoie côté client
//     } finally {
//       localStorage.removeItem("token");
//       navigate("/login", { replace: true });
//     }
//   };

//   const controlled = typeof onSectionChange === "function";

//   const Item = ({ id, to, icon, label, badge, end = false }) => {
//     const base = "d-flex align-items-center gap-2 px-3 py-2 rounded-3";

//     if (controlled) {
//       const isActive = activeSection === id;
//       return (
//         <li>
//           <button
//             type="button"
//             className={`nav-link w-100 text-start ${base} ${isActive ? "active" : ""}`}
//             onClick={() => onSectionChange(id)}
//             data-bs-dismiss="offcanvas"
//             title={label}
//           >
//             <i className={`bi ${icon} fs-5`} />
//             <span className="label">{label}</span>
//             {typeof badge === "number" && (
//               <span className="badge ms-auto bg-soft-med text-medical">{badge}</span>
//             )}
//           </button>
//         </li>
//       );
//     }

//     return (
//       <li>
//         <NavLink
//           to={to}
//           end={end}
//           className={({ isActive }) => `nav-link ${base} ${isActive ? "active" : ""}`}
//           data-bs-dismiss="offcanvas"
//           title={label}
//         >
//           <i className={`bi ${icon} fs-5`} />
//           <span className="label">{label}</span>
//           {typeof badge === "number" && (
//             <span className="badge ms-auto bg-soft-med text-medical">{badge}</span>
//           )}
//         </NavLink>
//       </li>
//     );
//   };

//   return (
//     <>
//       {/* Desktop */}
//       <aside className="sidebar-fixed d-none d-lg-flex flex-column border-end">
//         <Brand />
//         <nav className="menu mt-2 mb-3">
//           <ul className="nav nav-pills flex-column">
//             <Item
//               id="dashboard"
//               to="/medecin"
//               icon="bi-speedometer2"
//               label="Tableau de bord"
//               end
//             />

//             <li className="mt-2 small text-muted px-3">Rendez-vous</li>
//             <Item
//               id="rv-auj"
//               to="/medecin/rendezvous/auj"
//               icon="bi-calendar-check"
//               label="Aujourd’hui"
//               badge={badgeToday}
//             />
//             <Item
//               id="rv-avenir"
//               to="/medecin/rendezvous/a-venir"
//               icon="bi-calendar-event"
//               label="À venir"
//               badge={badgeUpcoming}
//             />
//             <Item
//               id="horaires"
//               to="/medecin/horaires"
//               icon="bi-clock-history"
//               label="Mes horaires"
//             />

//             <li className="mt-2 small text-muted px-3">Patients</li>
            
//             <Item
//               id="dossiers"
//               to="/medecin/dossiers"
//               icon="bi-journal-medical"
//               label="Dossiers médicaux"
//             />

//             <li className="mt-2 small text-muted px-3">Communication</li>
//             <Item
//               id="messages"
//               to="/medecin/messages"
//               icon="bi-chat-dots"
//               label="Messages"
//             />

//             <li className="mt-2 small text-muted px-3">Compte</li>
//             <Item
//               id="profil"
//               to="/medecin/profil"
//               icon="bi-person-circle"
//               label="Profil"
//             />
//             <Item
//               id="logout"
//               icon="bi-box-arrow-right"
//               label="Déconnexion"
//               onClick={handleLogoutClick}
//             />
//           </ul>
//         </nav>
//       </aside>

//       {/* Mobile offcanvas */}
//       <div
//         className="offcanvas offcanvas-start offcanvas-med"
//         id="medSidebar"
//         tabIndex="-1"
//         aria-labelledby="medSidebarLabel"
//         data-bs-scroll="true"
//         data-bs-backdrop="true"
//       >
//         <div className="offcanvas-header">
//           <div className="d-flex align-items-center gap-2">
//             <div className="brand-logo rounded-3 d-inline-flex align-items-center justify-content-center">
//               <i className="bi bi-activity" />
//             </div>
//             <h6 id="medSidebarLabel" className="mb-0">
//               Espace Médecin
//             </h6>
//           </div>
//           <button
//             className="btn-close"
//             type="button"
//             data-bs-dismiss="offcanvas"
//             aria-label="Fermer"
//           />
//         </div>

//         <div className="offcanvas-body p-0">
//           <nav className="menu mt-2 mb-3">
//             <ul className="nav nav-pills flex-column">
//               <Item
//                 id="dashboard"
//                 to="/medecin"
//                 icon="bi-speedometer2"
//                 label="Tableau de bord"
//                 end
//               />
//               <li className="mt-2 small text-muted px-3">Rendez-vous</li>
//               <Item
//                 id="rv-auj"
//                 to="/medecin/rendezvous/auj"
//                 icon="bi-calendar-check"
//                 label="Aujourd’hui"
//                 badge={badgeToday}
//               />
//               <Item
//                 id="rv-avenir"
//                 to="/medecin/rendezvous/a-venir"
//                 icon="bi-calendar-event"
//                 label="À venir"
//                 badge={badgeUpcoming}
//               />
//               <Item
//                 id="horaires"
//                 to="/medecin/horaires"
//                 icon="bi-clock-history"
//                 label="Mes horaires"
//               />
//               <li className="mt-2 small text-muted px-3">Patients</li>
//               <Item
//                 id="dossiers"
//                 to="/medecin/dossiers"
//                 icon="bi-journal-medical"
//                 label="Dossiers médicaux"
//               />
//               <li className="mt-2 small text-muted px-3">Communication</li>
//               <Item
//                 id="messages"
//                 to="/medecin/messages"
//                 icon="bi-chat-dots"
//                 label="Messages"
//               />
//               <li className="mt-2 small text-muted px-3">Compte</li>
//               <Item
//                 id="parametres"
//                 to="/medecin/parametres"
//                 icon="bi-person-circle"
//                 label="Profil"
//               />
//               <Item
//                 id="logout"
//                 to="/logout"
//                 icon="bi-box-arrow-right"
//                 label="Déconnexion"
//               />
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </>
//   );
// }

// function Brand() {
//   return (
//     <div className="d-flex align-items-center gap-2 brand px-3 pt-3 pb-2">
//       <div className="brand-logo rounded-3 d-inline-flex align-items-center justify-content-center">
//         <i className="bi bi-activity" />
//       </div>
//       <div className="brand-text">
//         <div className="fw-bold text-medical mb-0">AloExpert PRO</div>
//         <small className="text-muted">Dashboard Médecin</small>
//       </div>
//     </div>
//   );
// }


// MedSide.jsx (corrigé)



//version fixe:


// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import "./sidebar-medecin.css";
// import API_BASE_URL from "../../config/apiConfig";
// import "bootstrap-icons/font/bootstrap-icons.css";

// export default function MedSide({
//   activeSection,
//   onSectionChange,
//   badgeToday = 0,
//   badgeUpcoming = 0,
// }) {
//   const navigate = useNavigate();

//   const handleLogoutClick = async () => {
//     try {
//       await fetch(`${API_BASE_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include", 
//       });
//     } catch {
//       // même si l'appel échoue, on nettoie côté client
//     } finally {
//       localStorage.clear();
//       navigate("/login", { replace: true });
//     }
//   };

//   const controlled = false;;

//   // Un item : si onClick est fourni -> bouton; sinon -> contrôlé ou NavLink
//   const Item = ({ id, to, icon, label, badge, end = false, onClick }) => {
//     const base = "d-flex align-items-center gap-2 px-3 py-2 rounded-3";

//     // 1) Forcer un bouton si onClick (ex: Déconnexion)
//     if (typeof onClick === "function") {
//       return (
//         <li>
//           <button
//             type="button"
//             className={`nav-link w-100 text-start ${base}`}
//             onClick={onClick}
//             data-bs-dismiss="offcanvas"
//             title={label}
//           >
//             <i className={`bi ${icon} fs-5`} />
//             <span className="label">{label}</span>
//             {typeof badge === "number" && (
//               <span className="badge ms-auto bg-soft-med text-medical">
//                 {badge}
//               </span>
//             )}
//           </button>
//         </li>
//       );
//     }

//     // 2) Mode contrôlé : bouton qui bascule la section
//     if (controlled) {
//       const isActive = activeSection === id;
//       return (
//         <li>
//           <button
//             type="button"
//             className={`nav-link w-100 text-start ${base} ${
//               isActive ? "active" : ""
//             }`}
//             onClick={() => onSectionChange(id)}
//             data-bs-dismiss="offcanvas"
//             title={label}
//           >
//             <i className={`bi ${icon} fs-5`} />
//             <span className="label">{label}</span>
//             {typeof badge === "number" && (
//               <span className="badge ms-auto bg-soft-med text-medical">
//                 {badge}
//               </span>
//             )}
//           </button>
//         </li>
//       );
//     }

//     // 3) Mode routeur : lien classique
//     return (
//       <li>
//         <NavLink
//           to={to}
//           end={end}
//           className={({ isActive }) =>
//             `nav-link ${base} ${isActive ? "active" : ""}`
//           }
//           data-bs-dismiss="offcanvas"
//           title={label}
//         >
//           <i className={`bi ${icon} fs-5`} />
//           <span className="label">{label}</span>
//           {typeof badge === "number" && (
//             <span className="badge ms-auto bg-soft-med text-medical">
//               {badge}
//             </span>
//           )}
//         </NavLink>
//       </li>
//     );
//   };

//   return (
//     <>
//       {/* Sidebar fixe (≥ lg) */}
//       <aside className="sidebar-fixed d-none d-lg-flex flex-column border-end">
//         <Brand />
//         <nav className="menu mt-2 mb-3">
//           <ul className="nav nav-pills flex-column">
//             <Item
//               id="dashboard"
//               to="/MedecinDash"
//               icon="bi-speedometer2"
//               label="Tableau de bord"
//               end
//             />

//             <li className="mt-2 small text-muted px-3">Rendez-vous</li>
//             <Item
//               id="rv-auj"
//               to="/MedecinDash/rv-auj"
//               icon="bi-calendar-check"
//               label="Aujourd’hui"
//               badge={badgeToday}
//             />
//             <Item
//               id="rv-avenir"
//               to="/MedecinDash/rv-avenir"
//               icon="bi-calendar-event"
//               label="À venir"
//               badge={badgeUpcoming}
//             />
//             <Item
//               id="horaires"
//               to="/MedecinDash/horaires"
//               icon="bi-clock-history"
//               label="Mes horaires"
//             />

//             <li className="mt-2 small text-muted px-3">Patients</li>
//             <Item
//               id="dossiers"
//               to="/MedecinDash/dossiers"
//               icon="bi-journal-medical"
//               label="Dossiers médicaux"
//             />

//             <li className="mt-2 small text-muted px-3">Communication</li>
//             <Item
//               id="messages"
//               to="/MedecinDash/messages"
//               icon="bi-chat-dots"
//               label="Messages"
//             />

//             <li className="mt-2 small text-muted px-3">Compte</li>
//             <Item
//               id="profil"
//               to="/MedecinDash/profil"
//               icon="bi-person-circle"
//               label="Profil"
//             />

//             {/* Déconnexion (bouton) */}
//             <Item
//               id="logout"
//               icon="bi-box-arrow-right"
//               label="Déconnexion"
//               onClick={handleLogoutClick}
//             />
//           </ul>
//         </nav>
//       </aside>

//       {/* Offcanvas mobile (< lg) */}
//       <div
//         className="offcanvas offcanvas-start offcanvas-med"
//         id="medSidebar"
//         tabIndex="-1"
//         aria-labelledby="medSidebarLabel"
//         data-bs-scroll="true"
//         data-bs-backdrop="true"
//       >
//         <div className="offcanvas-header">
//           <div className="d-flex align-items-center gap-2">
//             <div className="brand-logo rounded-3 d-inline-flex align-items-center justify-content-center">
//               <i className="bi bi-activity" />
//             </div>
//             <h6 id="medSidebarLabel" className="mb-0">
//               Espace Médecin
//             </h6>
//           </div>
//           <button
//             className="btn-close"
//             type="button"
//             data-bs-dismiss="offcanvas"
//             aria-label="Fermer"
//           />
//         </div>

//         <div className="offcanvas-body p-0">
//           <nav className="menu mt-2 mb-3">
//             <ul className="nav nav-pills flex-column">
//               <Item
//                 id="dashboard"
//                 to="/MedecinDash"
//                 icon="bi-speedometer2"
//                 label="Tableau de bord"
//                 end
//               />

//               <li className="mt-2 small text-muted px-3">Rendez-vous</li>
//               <Item
//                 id="rv-auj"
//                 to="/MedecinDash/rv-auj"
//                 icon="bi-calendar-check"
//                 label="Aujourd’hui"
//                 badge={badgeToday}
//               />
//               <Item
//                 id="rv-avenir"
//                 to="/MedecinDash/rv-avenir"
//                 icon="bi-calendar-event"
//                 label="À venir"
//                 badge={badgeUpcoming}
//               />
//               <Item
//                 id="horaires"
//                 to="/MedecinDash/horaires"
//                 icon="bi-clock-history"
//                 label="Mes horaires"
//               />

//               <li className="mt-2 small text-muted px-3">Patients</li>
//               <Item
//                 id="dossiers"
//                 to="/MedecinDash/dossiers"
//                 icon="bi-journal-medical"
//                 label="Dossiers médicaux"
//               />

//               <li className="mt-2 small text-muted px-3">Communication</li>
//               <Item
//                 id="messages"
//                 to="/MedecinDash/messages"
//                 icon="bi-chat-dots"
//                 label="Messages"
//               />

//               <li className="mt-2 small text-muted px-3">Compte</li>
//               <Item
//                 id="profil"
//                 to="/MedecinDash/profil"
//                 icon="bi-person-circle"
//                 label="Profil"
//               />

//               {/* Déconnexion (bouton aussi en mobile) */}
//               <Item
//                 id="logout"
//                 icon="bi-box-arrow-right"
//                 label="Déconnexion"
//                 onClick={handleLogoutClick}
//               />
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </>
//   );
// }

// function Brand() {
//   return (
//     <div className="d-flex align-items-center gap-2 brand px-3 pt-3 pb-2">
//       <div className="brand-logo rounded-3 d-inline-flex align-items-center justify-content-center">
//         <i className="bi bi-activity" />
//       </div>
//       <div className="brand-text">
//         <div className="fw-bold text-medical mb-0">Alo Docteur</div>
//         <small className="text-muted">Dashboard Médecin</small>
//       </div>
//     </div>
//   );
// }

// src/components/Sidebar/MedSide.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar-medecin.css";
import API_BASE_URL from "../../config/apiConfig";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function MedSide({
  // props gardés pour compat, mais non utilisés en mode routeur
  activeSection,
  onSectionChange,
  badgeToday = 0,
  badgeUpcoming = 0,
}) {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // même si l'appel échoue, on nettoie côté client
    } finally {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  // Forcer le mode routeur (NavLink)
  const controlled = false;

  // Un item générique
  // - si onClick fourni -> bouton
  // - sinon -> NavLink (router)
  // - dismiss: ajoute data-bs-dismiss="offcanvas" (utilisé seulement en mobile)
  const Item = ({ id, to, icon, label, badge, end = false, onClick, dismiss = false }) => {
    const base = "d-flex align-items-center gap-2 px-3 py-2 rounded-3";

    if (typeof onClick === "function") {
      return (
        <li>
          <button
            type="button"
            className={`nav-link w-100 text-start ${base}`}
            onClick={onClick}
            {...(dismiss ? { "data-bs-dismiss": "offcanvas" } : {})}
            title={label}
          >
            <i className={`bi ${icon} fs-5`} />
            <span className="label">{label}</span>
            {typeof badge === "number" && (
              <span className="badge ms-auto bg-soft-med text-medical">{badge}</span>
            )}
          </button>
        </li>
      );
    }

    if (controlled) {
      const isActive = activeSection === id;
      return (
        <li>
          <button
            type="button"
            className={`nav-link w-100 text-start ${base} ${isActive ? "active" : ""}`}
            onClick={() => onSectionChange && onSectionChange(id)}
            {...(dismiss ? { "data-bs-dismiss": "offcanvas" } : {})}
            title={label}
          >
            <i className={`bi ${icon} fs-5`} />
            <span className="label">{label}</span>
            {typeof badge === "number" && (
              <span className="badge ms-auto bg-soft-med text-medical">{badge}</span>
            )}
          </button>
        </li>
      );
    }

    // Mode routeur (NavLink)
    return (
      <li>
        <NavLink
          to={to}
          end={end}
          className={({ isActive }) => `nav-link ${base} ${isActive ? "active" : ""}`}
          {...(dismiss ? { "data-bs-dismiss": "offcanvas" } : {})}
          title={label}
        >
            <i className={`bi ${icon} fs-5`} />
            <span className="label">{label}</span>
            {typeof badge === "number" && (
              <span className="badge ms-auto bg-soft-med text-medical">{badge}</span>
            )}
        </NavLink>
      </li>
    );
  };

  return (
    <>
      {/* Sidebar fixe (≥ lg) — pas de dismiss ici */}
      <aside className="sidebar-fixed d-none d-lg-flex flex-column border-end">
        <Brand />
        <nav className="menu mt-2 mb-3">
          <ul className="nav nav-pills flex-column">
            <Item
              id="dashboard"
              to="/MedecinDash"
              icon="bi-speedometer2"
              label="Tableau de bord"
              end
            />

            <li className="mt-2 small text-muted px-3">Rendez-vous</li>
            <Item
              id="rv-auj"
              to="/MedecinDash/rv-auj"
              icon="bi-calendar-check"
              label="Aujourd’hui"
              badge={badgeToday}
            />
            <Item
              id="rv-avenir"
              to="/MedecinDash/rv-avenir"
              icon="bi-calendar-event"
              label="À venir"
              badge={badgeUpcoming}
            />
            <Item
              id="horaires"
              to="/MedecinDash/horaires"
              icon="bi-clock-history"
              label="Mes horaires"
            />

            <li className="mt-2 small text-muted px-3">Patients</li>
            <Item
              id="dossiers"
              to="/MedecinDash/dossiers"
              icon="bi-journal-medical"
              label="Dossiers médicaux"
            />
            <li className="mt-2 small text-muted px-3">Receptionnistes</li>
            <Item
              id="dossiers"
              to="/MedecinDash/mesReceptionnistes"
              icon="bi bi-person-workspace"
              label="Mes Receptionnistes"
            />

            {/* <li className="mt-2 small text-muted px-3">Communication</li>
            <Item
              id="messages"
              to="/MedecinDash/messages"
              icon="bi-chat-dots"
              label="Messages"
            /> */}

            <li className="mt-2 small text-muted px-3">Compte</li>
            <Item
              id="profil"
              to="/MedecinDash/profil"
              icon="bi-person-circle"
              label="Profil"
            />

            <Item
              id="logout"
              icon="bi-box-arrow-right"
              label="Déconnexion"
              onClick={handleLogoutClick}
            />
          </ul>
        </nav>
      </aside>

      {/* Offcanvas mobile (< lg) — dismiss activé */}
      <div
        className="offcanvas offcanvas-start offcanvas-med"
        id="medSidebar"
        tabIndex="-1"
        aria-labelledby="medSidebarLabel"
        data-bs-scroll="true"
        data-bs-backdrop="true"
      >
        <div className="offcanvas-header">
          <div className="d-flex align-items-center gap-2">
            <div className="brand-logo rounded-3 d-inline-flex align-items-center justify-content-center">
              <i className="bi bi-activity" />
            </div>
            <h6 id="medSidebarLabel" className="mb-0">
              Espace Médecin
            </h6>
          </div>
          <button
            className="btn-close"
            type="button"
            data-bs-dismiss="offcanvas"
            aria-label="Fermer"
          />
        </div>

        <div className="offcanvas-body p-0">
          <nav className="menu mt-2 mb-3">
            <ul className="nav nav-pills flex-column">
              <Item
                id="dashboard"
                to="/MedecinDash"
                icon="bi-speedometer2"
                label="Tableau de bord"
                end
                dismiss
              />

              <li className="mt-2 small text-muted px-3">Rendez-vous</li>
              <Item
                id="rv-auj"
                to="/MedecinDash/rv-auj"
                icon="bi-calendar-check"
                label="Aujourd’hui"
                badge={badgeToday}
                dismiss
              />
              <Item
                id="rv-avenir"
                to="/MedecinDash/rv-avenir"
                icon="bi-calendar-event"
                label="À venir"
                badge={badgeUpcoming}
                dismiss
              />
              <Item
                id="horaires"
                to="/MedecinDash/horaires"
                icon="bi-clock-history"
                label="Mes horaires"
                dismiss
              />

              <li className="mt-2 small text-muted px-3">Patients</li>
              <Item
                id="dossiers"
                to="/MedecinDash/dossiers"
                icon="bi-journal-medical"
                label="Dossiers médicaux"
                dismiss
              />

              <li className="mt-2 small text-muted px-3">Receptionnistes</li>
              <Item
                id="dossiers"
                to="/MedecinDash/mesReceptionnistes"
                icon="bi bi-person-workspace"
                label="Mes Receptionnistes"
              />

              <li className="mt-2 small text-muted px-3">Communication</li>
              <Item
                id="messages"
                to="/MedecinDash/messages"
                icon="bi-chat-dots"
                label="Messages"
                dismiss
              />

              <li className="mt-2 small text-muted px-3">Compte</li>
              <Item
                id="profil"
                to="/MedecinDash/profil"
                icon="bi-person-circle"
                label="Profil"
                dismiss
              />

              <Item
                id="logout"
                icon="bi-box-arrow-right"
                label="Déconnexion"
                onClick={handleLogoutClick}
                dismiss
              />
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

function Brand() {
  return (
    <div className="d-flex align-items-center gap-2 brand px-3 pt-3 pb-2">
      <div className="brand-logo rounded-3 d-inline-flex align-items-center justify-content-center">
        <i className="bi bi-activity" />
      </div>
      <div className="brand-text">
        <div className="fw-bold text-medical mb-0">Alo Docteur</div>
        <small className="text-muted">Dashboard Médecin</small>
      </div>
    </div>
  );
}
