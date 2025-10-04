// import React, { useState, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import Logo from "../../assets/Images/Logo.png";
// import AnchorLink from "react-anchor-link-smooth-scroll";
// import "./Navbar.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { jwtDecode } from "jwt-decode";

// function Navbar() {
//   const nav_links = [
//     { label: "Accueil", id: "Accueil" },
//     { label: "A propos", id: "APropos" },
//     { label: "Contact", id: "Contact" },
//   ];

//   const patient_links = [
//     {
//       label: "dashboard",
//       id: "dashboard",
//       path: "/PatientDash",
//     },
//     {
//       label: "RendezVous",
//       id: "rendezVous",
//       subItems: [
//         {
//           label: "Creer un rendezVous",
//           id: "creerRV",
//           path: "/PatientDash/rendezvous",
//         },
//         {
//           label: "Mes RendezVous",
//           id: "AfficherRV",
//           path: "/PatientDash/afficherRendezVous",
//         },
//         {
//           label: "Historique rendez-vous",
//           id: "historiqueRV",
//           path: "/PatientDash/historiqueRendezVous",
//         },
//       ],
//     },
//     {
//       label: "Contact",
//       id: "contactezNous",
//       path: "/PatientDash/Contact",
//     },
//     {
//       label: "Message",
//       id: "message",
//       path: "/PatientDash/Chat",
//     },
//     {
//       label: "Document",
//       id: "document",
//       path: "/PatientDash/documents",
//     },
//   ];

//   const navigate = useNavigate();
//   const [menu, setMenu] = useState("Accueil");
//   const menuRef = useRef();

//   const handleLoginClick = () => {
//     navigate("/login");
//   };

//   const handleLogoutClick = async () => {
//     try {
//       await fetch(`${API_BASE_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch (_) {
//     } finally {
//       localStorage.clear();
//       sessionStorage.clear();
//       navigate("/");
//     }
//   };

//   const handleRegisterClick = () => {
//     navigate("/register");
//   };

//   const token = localStorage.getItem("token");
//   let isAuthenticated = false;
//   let role = null;
//   let userFullName = "";

//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       role = decoded.role;
//       userFullName = decoded.prenom + " " + decoded.nom;
//       console.log("user role:", role);
//       isAuthenticated = true;
//     } catch (error) {
//       console.error("Erreur lors de la récupération du token:", error);
//       isAuthenticated = false;
//     }
//   }

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
//       <div className="container-fluid">
//         {/* Logo */}
//         <div className="nav-logo d-flex align-items-center">
//           <Link
//             to={isAuthenticated && role === "PATIENT" ? "/PatientDash" : "/"}
//           >
//             <img src={Logo} alt="Logo" className="logo" />
//           </Link>
//           {isAuthenticated && role === "PATIENT" && (
//             <Link
//               to="/PatientDash/accueil"
//               className="nav-link ms-3"
//               onClick={() => setMenu("Accueil")}
//             >
//               Accueil
//             </Link>
//           )}
//         </div>

//         {/* Toggler Button for Mobile */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarContent"
//           aria-controls="navbarContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Collapsible Content */}
//         <div className="collapse navbar-collapse" id="navbarContent">
//           {/* Navigation Links */}
//           <ul
//             className="navbar-nav text-center mx-auto mb-2 mb-lg-0"
//             ref={menuRef}
//           >
//             {isAuthenticated && role === "PATIENT"
//               ? patient_links.map((item) => (
//                   <li
//                     key={item.id}
//                     className={`nav-item px-2 py-2 ${
//                       menu === item.label ? "active" : ""
//                     }`}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {item.subItems ? (
//                       // Dropdown
//                       <div className="nav-item dropdown">
//                         <Link
//                           className="nav-link dropdown-toggle"
//                           to="#"
//                           id={`${item.id}Dropdown`}
//                           role="button"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                           onClick={() => setMenu(item.label)}
//                         >
//                           {item.label}
//                         </Link>
//                         <ul
//                           className="dropdown-menu"
//                           aria-labelledby={`${item.id}Dropdown`}
//                         >
//                           {item.subItems.map((subItem) => (
//                             <li key={subItem.id}>
//                               <Link
//                                 className="dropdown-item"
//                                 to={subItem.path}
//                                 onClick={() => setMenu(subItem.label)}
//                               >
//                                 {subItem.label}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ) : (
//                       <Link
//                         className="nav-link"
//                         to={item.path}
//                         onClick={() => setMenu(item.label)}
//                       >
//                         {item.label}
//                       </Link>
//                     )}
//                   </li>
//                 ))
//               : nav_links.map((item) => (
//                   <li
//                     key={item.id}
//                     className={`nav-item px-2 py-2 ${
//                       menu === item.label ? "active" : ""
//                     }`}
//                     style={{ cursor: "pointer" }}
//                     onClick={() => setMenu(item.label)}
//                   >
//                     <AnchorLink
//                       className="nav-link"
//                       href={`#${item.id}`}
//                       offset="100"
//                     >
//                       {item.label}
//                     </AnchorLink>
//                   </li>
//                 ))}
//           </ul>

//           {/* User Menu */}
//           {isAuthenticated && role === "PATIENT" ? (
//             <>
//               {/* Desktop (≥ lg) */}
//               <div className="dropdown d-none d-lg-block ms-lg-auto">
//                 <button
//                   className="btn dropdown-toggle"
//                   type="button"
//                   id="userMenuDesktop"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   {userFullName || "Mon compte"}
//                 </button>
//                 <ul
//                   className="dropdown-menu dropdown-menu-end"
//                   aria-labelledby="userMenuDesktop"
//                 >
//                   <li>
//                     <Link className="dropdown-item" to="/PatientDash/Account">
//                       Mon compte
//                     </Link>
//                   </li>
//                   <li>
//                     <hr className="dropdown-divider" />
//                   </li>
//                   <li>
//                     <button
//                       className="dropdown-item text-danger"
//                       onClick={handleLogoutClick}
//                     >
//                       Déconnexion
//                     </button>
//                   </li>
//                 </ul>
//               </div>

//               {/* Mobile (< lg): centered */}
//               <div className="d-lg-none w-100 d-flex justify-content-center my-2">
//                 <div className="dropdown position-relative">
//                   <button
//                     className="btn dropdown-toggle mx-auto"
//                     type="button"
//                     id="userMenuMobile"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                   >
//                     {userFullName || "Mon compte"}
//                   </button>
//                   <ul
//                     className="dropdown-menu text-center start-50 translate-middle-x"
//                     aria-labelledby="userMenuMobile"
//                   >
//                     <li>
//                       <Link className="dropdown-item" to="/PatientDash/Account">
//                         Mon compte
//                       </Link>
//                     </li>
//                     <li>
//                       <hr className="dropdown-divider" />
//                     </li>
//                     <li>
//                       <button
//                         className="dropdown-item text-danger"
//                         onClick={handleLogoutClick}
//                       >
//                         Déconnexion
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="nav-btns d-flex flex-row gap-2 ms-lg-auto">
//               <button
//                 className="btn btn-outline-primary px-4"
//                 onClick={handleLoginClick}
//               >
//                 Login
//               </button>
//               <button
//                 className="btn btn-outline-primary px-4 buttons"
//                 onClick={handleRegisterClick}
//               >
//                 Register
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import AnchorLink from "react-anchor-link-smooth-scroll";
// import Logo from "../../assets/Images/Logo.png";
// import "./Navbar.css";
// import { Dropdown } from "bootstrap";



// import API_BASE_URL from "../../config/apiConfig";
// import {
//   getToken,
//   isTokenValid,
//   getSafeUserFromToken,
//   clearAuth,
// } from "../../utils/auth";

// function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const nav_links = [
//     { label: "Accueil", id: "Accueil" },
//     { label: "A propos", id: "APropos" },
//     { label: "Contact", id: "Contact" },
//   ];

//   const patient_links = [
//     { label: "dashboard", id: "dashboard", path: "/PatientDash" },
//     {
//       label: "RendezVous",
//       id: "rendezVous",
//       subItems: [
//         {
//           label: "Creer un rendezVous",
//           id: "creerRV",
//           path: "/PatientDash/rendezvous",
//         },
//         {
//           label: "Mes RendezVous",
//           id: "AfficherRV",
//           path: "/PatientDash/afficherRendezVous",
//         },
//         {
//           label: "Historique rendez-vous",
//           id: "historiqueRV",
//           path: "/PatientDash/historiqueRendezVous",
//         },
//       ],
//     },
//     { label: "Contact", id: "contactezNous", path: "/PatientDash/Contact" },
//     { label: "Message", id: "message", path: "/PatientDash/Chat" },
//     { label: "Document", id: "document", path: "/PatientDash/MesDocuments" },
//   ];

//   const [menu, setMenu] = useState("Accueil");
//   const menuRef = useRef();

//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [role, setRole] = useState(null);
//   const [userFullName, setUserFullName] = useState("");

//   // Vérifie le token au montage et à chaque changement de route
//   useEffect(() => {
//     const t = getToken();
//     if (!t || !isTokenValid(t)) {
//       clearAuth();
//       setIsAuthenticated(false);
//       setRole(null);
//       setUserFullName("");

//       if (location.pathname.startsWith("/PatientDash")) {
//         navigate("/login", { replace: true });
//       }
//       return;
//     }

//     const u = getSafeUserFromToken(t);
//     setRole(u.role);
//     setUserFullName(`${u.prenom} ${u.nom}`.trim());
//     setIsAuthenticated(true);
//   }, [navigate, location.pathname]);

//   const handleLoginClick = () => navigate("/login");
//   const handleRegisterClick = () => navigate("/register");

//   const handleLogoutClick = async () => {
//     try {
//       await fetch(`${API_BASE_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include", // important pour supprimer cookie httpOnly côté serveur
//       });
//     } catch (_) {
//       // même si la requête échoue, on nettoie côté client
//     } finally {
//       clearAuth();
//       // Hard reload pour repartir propre (évite états en mémoire)
//       window.location.assign("/login");
//     }
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
//       <div className="container-fluid">
//         {/* Logo */}
//         <div className="nav-logo d-flex align-items-center">
//           <Link
//             to={isAuthenticated && role === "PATIENT" ? "/PatientDash" : "/"}
//           >
//             <img src={Logo} alt="Logo" className="logo" />
//           </Link>

//           {isAuthenticated && role === "PATIENT" && (
//             <Link
//               to="/PatientDash/accueil"
//               className="nav-link ms-3"
//               onClick={() => setMenu("Accueil")}
//             >
//               Accueil
//             </Link>
//           )}
//         </div>

//         {/* Toggler mobile */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarContent"
//           aria-controls="navbarContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Contenu repliable */}
//         <div className="collapse navbar-collapse" id="navbarContent">
//           {/* Liens */}
//           <ul
//             className="navbar-nav text-center mx-auto mb-2 mb-lg-0"
//             ref={menuRef}
//           >
//             {isAuthenticated && role === "PATIENT"
//               ? patient_links.map((item) => (
//                   <li
//                     key={item.id}
//                     className={`nav-item px-2 py-2 ${
//                       menu === item.label ? "active" : ""
//                     }`}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {item.subItems ? (
//                       <div className="nav-item dropdown">
//                         <Link
//                           className="nav-link dropdown-toggle"
//                           to="#"
//                           id={`${item.id}Dropdown`}
//                           role="button"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                           onClick={() => setMenu(item.label)}
//                         >
//                           {item.label}
//                         </Link>
//                         <ul
//                           className="dropdown-menu"
//                           aria-labelledby={`${item.id}Dropdown`}
//                         >
//                           {item.subItems.map((subItem) => (
//                             <li key={subItem.id}>
//                               <Link
//                                 className="dropdown-item"
//                                 to={subItem.path}
//                                 onClick={() => setMenu(subItem.label)}
//                               >
//                                 {subItem.label}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ) : (
//                       <Link
//                         className="nav-link"
//                         to={item.path}
//                         onClick={() => setMenu(item.label)}
//                       >
//                         {item.label}
//                       </Link>
//                     )}
//                   </li>
//                 ))
//               : nav_links.map((item) => (
//                   <li
//                     key={item.id}
//                     className={`nav-item px-2 py-2 ${
//                       menu === item.label ? "active" : ""
//                     }`}
//                     style={{ cursor: "pointer" }}
//                     onClick={() => setMenu(item.label)}
//                   >
//                     <AnchorLink
//                       className="nav-link"
//                       href={`#${item.id}`}
//                       offset="100"
//                     >
//                       {item.label}
//                     </AnchorLink>
//                   </li>
//                 ))}
//           </ul>

//           {/* Menu utilisateur */}
//           {isAuthenticated && role === "PATIENT" ? (
//             <>
//               {/* Desktop (≥ lg) */}
//               <div className="dropdown d-none d-lg-block ms-lg-auto">
//                 <button
//                   className="btn dropdown-toggle"
//                   type="button"
//                   id="userMenuDesktop"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   {userFullName || "Mon compte"}
//                 </button>
//                 <ul
//                   className="dropdown-menu dropdown-menu-end"
//                   aria-labelledby="userMenuDesktop"
//                 >
//                   <li>
//                     <Link className="dropdown-item" to="/PatientDash/Account">
//                       Mon compte
//                     </Link>
//                   </li>
//                   <li>
//                     <hr className="dropdown-divider" />
//                   </li>
//                   <li>
//                     <button
//                       className="dropdown-item text-danger"
//                       onClick={handleLogoutClick}
//                     >
//                       Déconnexion
//                     </button>
//                   </li>
//                 </ul>
//               </div>

//               {/* Mobile (< lg) */}
//               <div className="d-lg-none w-100 d-flex justify-content-center my-2">
//                 <div className="dropdown position-relative">
//                   <button
//                     className="btn dropdown-toggle mx-auto"
//                     type="button"
//                     id="userMenuMobile"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                   >
//                     {userFullName || "Mon compte"}
//                   </button>
//                   <ul
//                     className="dropdown-menu text-center start-50 translate-middle-x"
//                     aria-labelledby="userMenuMobile"
//                   >
//                     <li>
//                       <Link className="dropdown-item" to="/PatientDash/Account">
//                         Mon compte
//                       </Link>
//                     </li>
//                     <li>
//                       <hr className="dropdown-divider" />
//                     </li>
//                     <li>
//                       <button
//                         className="dropdown-item text-danger"
//                         onClick={handleLogoutClick}
//                       >
//                         Déconnexion
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="nav-btns d-flex flex-row gap-2 ms-lg-auto">
//               <button
//                 className="btn btn-outline-primary px-4"
//                 onClick={handleLoginClick}
//               >
//                 Login
//               </button>
//               <button
//                 className="btn btn-outline-primary px-4 buttons"
//                 onClick={handleRegisterClick}
//               >
//                 Register
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;






// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import AnchorLink from "react-anchor-link-smooth-scroll";
// import Logo from "../../assets/Images/Logo.png";
// import "./Navbar.css";
// import { Dropdown } from "bootstrap";

// import API_BASE_URL from "../../config/apiConfig";
// import {
//   getToken,
//   isTokenValid,
//   getSafeUserFromToken,
//   clearAuth,
// } from "../../utils/auth";

// function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const nav_links = [
//     { label: "Accueil", id: "Accueil" },
//     { label: "A propos", id: "APropos" },
//     { label: "Contact", id: "Contact" },
//   ];

//   const patient_links = [
//     { label: "dashboard", id: "dashboard", path: "/PatientDash" },
//     {
//       label: "RendezVous",
//       id: "rendezVous",
//       subItems: [
//         {
//           label: "Creer un rendezVous",
//           id: "creerRV",
//           path: "/PatientDash/rendezvous",
//         },
//         {
//           label: "Mes RendezVous",
//           id: "AfficherRV",
//           path: "/PatientDash/afficherRendezVous",
//         },
//         {
//           label: "Historique rendez-vous",
//           id: "historiqueRV",
//           path: "/PatientDash/historiqueRendezVous",
//         },
//       ],
//     },
//     { label: "Contact", id: "contactezNous", path: "/PatientDash/Contact" },
//     { label: "Message", id: "message", path: "/PatientDash/Chat" },
//     { label: "Document", id: "document", path: "/PatientDash/MesDocuments" },
//   ];

//   const [menu, setMenu] = useState("Accueil");
//   const menuRef = useRef();

//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [role, setRole] = useState(null);
//   const [userFullName, setUserFullName] = useState("");

//   // ✅ état pour collapse mobile
//   const [open, setOpen] = useState(false);
//   const toggle = () => setOpen((o) => !o);
//   const close = () => setOpen(false);

//   // --- helpers dropdown (force toggle via API JS) ---
//   const toggleDropdownById = (id) => (e) => {
//     e.preventDefault();
//     const el = document.getElementById(id);
//     if (!el) return;
//     Dropdown.getOrCreateInstance(el).toggle();
//   };

//   // Vérifie le token au montage et à chaque changement de route
//   useEffect(() => {
//     const t = getToken();
//     if (!t || !isTokenValid(t)) {
//       clearAuth();
//       setIsAuthenticated(false);
//       setRole(null);
//       setUserFullName("");

//       if (location.pathname.startsWith("/PatientDash")) {
//         navigate("/login", { replace: true });
//       }
//       return;
//     }

//     const u = getSafeUserFromToken(t);
//     setRole(u.role);
//     setUserFullName(`${u.prenom} ${u.nom}`.trim());
//     setIsAuthenticated(true);
//   }, [navigate, location.pathname]);

//   // Fermer la navbar quand on change de route
//   useEffect(() => {
//     close();
//   }, [location.pathname]);

//   const handleLoginClick = () => navigate("/login");
//   const handleRegisterClick = () => navigate("/register");

//   const handleLogoutClick = async () => {
//     try {
//       await fetch(`${API_BASE_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include", 
//       });
//     } catch {
//       // ignore
//     } finally {
//       clearAuth();
//       window.location.assign("/login"); // reset propre
//     }
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
//       <div className="container-fluid">
//         {/* Logo */}
//         <div className="nav-logo d-flex align-items-center">
//           <Link
//             to={isAuthenticated && role === "PATIENT" ? "/PatientDash" : "/"}
//           >
//             <img src={Logo} alt="Logo" className="logo" />
//           </Link>

//           {isAuthenticated && role === "PATIENT" && (
//             <Link
//               to="/PatientDash/accueil"
//               className="nav-link ms-3"
//               onClick={() => {
//                 setMenu("Accueil");;
//                 close()
//               }}
//             >
//               Accueil
//             </Link>
//           )}
//         </div>

//         {/* Toggler mobile */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarContent"
//           aria-controls="navbarContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Contenu repliable */}
//         <div className="collapse navbar-collapse" id="navbarContent">
//           {/* Liens */}
//           <ul
//             className="navbar-nav text-center mx-auto mb-2 mb-lg-0"
//             ref={menuRef}
//           >
//             {isAuthenticated && role === "PATIENT"
//               ? patient_links.map((item) => (
//                   <li
//                     key={item.id}
//                     className={`nav-item px-2 py-2 ${
//                       menu === item.label ? "active" : ""
//                     }`}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {item.subItems ? (
//                       <div className="nav-item dropdown">
//                         <a
//                           href="#"
//                           className="nav-link dropdown-toggle"
//                           id={`${item.id}Dropdown`}
//                           role="button"
//                           aria-expanded="false"
//                           onClick={(e) => {
//                             setMenu(item.label);
//                             toggleDropdownById(`${item.id}Dropdown`)(e);
//                           }}
//                         >
//                           {item.label}
//                         </a>
//                         <ul
//                           className="dropdown-menu"
//                           aria-labelledby={`${item.id}Dropdown`}
//                         >
//                           {item.subItems.map((subItem) => (
//                             <li key={subItem.id}>
//                               <Link
//                                 className="dropdown-item"
//                                 to={subItem.path}
//                                 onClick={() => setMenu(subItem.label)}
//                               >
//                                 {subItem.label}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ) : (
//                       <Link
//                         className="nav-link"
//                         to={item.path}
//                         onClick={() => setMenu(item.label)}
//                       >
//                         {item.label}
//                       </Link>
//                     )}
//                   </li>
//                 ))
//               : nav_links.map((item) => (
//                   <li
//                     key={item.id}
//                     className={`nav-item px-2 py-2 ${
//                       menu === item.label ? "active" : ""
//                     }`}
//                     style={{ cursor: "pointer" }}
//                     onClick={() => setMenu(item.label)}
//                   >
//                     <AnchorLink
//                       className="nav-link"
//                       href={`#${item.id}`}
//                       offset="100"
//                     >
//                       {item.label}
//                     </AnchorLink>
//                   </li>
//                 ))}
//           </ul>

//           {/* Menu utilisateur */}
//           {isAuthenticated && role === "PATIENT" ? (
//             <>
//               {/* Desktop (≥ lg) */}
//               <ul className="navbar-nav ms-lg-auto d-none d-lg-flex">
//                 <li className="nav-item dropdown">
//                   <a
//                     href="#"
//                     className="nav-link dropdown-toggle"
//                     id="userMenuDesktop"
//                     role="button"
//                     aria-expanded="false"
//                     onClick={toggleDropdownById("userMenuDesktop")}
//                   >
//                     {userFullName || "Mon compte"}
//                   </a>
//                   <ul
//                     className="dropdown-menu dropdown-menu-end"
//                     aria-labelledby="userMenuDesktop"
//                   >
//                     <li>
//                       <Link className="dropdown-item" to="/PatientDash/Account">
//                         Mon compte
//                       </Link>
//                     </li>
//                     <li>
//                       <hr className="dropdown-divider" />
//                     </li>
//                     <li>
//                       <button
//                         className="dropdown-item text-danger"
//                         onClick={handleLogoutClick}
//                       >
//                         Déconnexion
//                       </button>
//                     </li>
//                   </ul>
//                 </li>
//               </ul>

//               {/* Mobile (< lg) */}
//               <ul className="navbar-nav d-lg-none w-100 justify-content-center my-2">
//                 <li className="nav-item dropdown">
//                   <a
//                     href="#"
//                     className="nav-link dropdown-toggle text-center"
//                     id="userMenuMobile"
//                     role="button"
//                     aria-expanded="false"
//                     onClick={toggleDropdownById("userMenuMobile")}
//                   >
//                     {userFullName || "Mon compte"}
//                   </a>
//                   <ul
//                     className="dropdown-menu dropdown-menu-end text-center"
//                     aria-labelledby="userMenuMobile"
//                   >
//                     <li>
//                       <Link className="dropdown-item" to="/PatientDash/Account">
//                         Mon compte
//                       </Link>
//                     </li>
//                     <li>
//                       <hr className="dropdown-divider" />
//                     </li>
//                     <li>
//                       <button
//                         className="dropdown-item text-danger"
//                         onClick={handleLogoutClick}
//                       >
//                         Déconnexion
//                       </button>
//                     </li>
//                   </ul>
//                 </li>
//               </ul>
//             </>
//           ) : (
//             <div className="nav-btns d-flex flex-row gap-2 ms-lg-auto">
//               <button
//                 className="btn btn-outline-primary px-4"
//                 onClick={handleLoginClick}
//               >
//                 Login
//               </button>
//               <button
//                 className="btn btn-outline-primary px-4 buttons"
//                 onClick={handleRegisterClick}
//               >
//                 Register
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;



import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AnchorLink from "react-anchor-link-smooth-scroll";
import Logo from "../../assets/Images/Logo.png";
import "./Navbar.css";
import { Dropdown } from "bootstrap";

import API_BASE_URL from "../../config/apiConfig";
import {
  getToken,
  isTokenValid,
  getSafeUserFromToken,
  clearAuth,
} from "../../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const nav_links = [
    { label: "Accueil", id: "Accueil" },
    { label: "A propos", id: "APropos" },
    { label: "Contact", id: "Contact" },
  ];

  const patient_links = [
    { label: "dashboard", id: "dashboard", path: "/PatientDash" },
    {
      label: "RendezVous",
      id: "rendezVous",
      subItems: [
        {
          label: "Creer un rendezVous",
          id: "creerRV",
          path: "/PatientDash/rendezvous",
        },
        {
          label: "Mes RendezVous",
          id: "AfficherRV",
          path: "/PatientDash/afficherRendezVous",
        },
        {
          label: "Historique rendez-vous",
          id: "historiqueRV",
          path: "/PatientDash/historiqueRendezVous",
        },
      ],
    },
    { label: "Contact", id: "contactezNous", path: "/PatientDash/Contact" },
    // { label: "Message", id: "message", path: "/PatientDash/Chat" },
    // { label: "Document", id: "document", path: "/PatientDash/MesDocuments" },
  ];

  const [menu, setMenu] = useState("Accueil");
  const menuRef = useRef();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [userFullName, setUserFullName] = useState("");

  // état pour collapse mobile
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);
  const closeSmooth = (delay = 420) => {
    // laisse l’œil percevoir le clic avant de lancer la fermeture
    window.requestAnimationFrame(() => {
      setTimeout(() => setOpen(false), delay);
    });
  };

  // Dropdown helper
  const toggleDropdownById = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    Dropdown.getOrCreateInstance(el).toggle();
  };

  // Vérifie le token au montage et à chaque changement de route
  useEffect(() => {
    const t = getToken();
    if (!t || !isTokenValid(t)) {
      clearAuth();
      setIsAuthenticated(false);
      setRole(null);
      setUserFullName("");

      if (location.pathname.startsWith("/PatientDash")) {
        navigate("/login", { replace: true });
      }
      return;
    }

    const u = getSafeUserFromToken(t);
    setRole(u.role);
    setUserFullName(`${u.prenom} ${u.nom}`.trim());
    setIsAuthenticated(true);
  }, [navigate, location.pathname]);

  // Fermer (sans délai) quand la route change
  useEffect(() => {
    close();
  }, [location.pathname]);

  const handleLoginClick = () => {
    navigate("/login");
    closeSmooth();
  };

  const handleRegisterClick = () => {
    navigate("/register");
    closeSmooth();
  };

  const handleLogoutClick = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    } finally {
      clearAuth();
      window.location.assign("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-navbar ">
      <div className="container-fluid">
        {/* Logo */}
        <div className="nav-logo d-flex align-items-center">
          <Link
            to={isAuthenticated && role === "PATIENT" ? "/PatientDash" : "/"}
          >
            <img src={Logo} alt="Logo" className="logo" />
          </Link>

          {isAuthenticated && role === "PATIENT" && (
            <Link
              to="/PatientDash/accueil"
              className="nav-link ms-3"
              onClick={() => {
                setMenu("Accueil");
                closeSmooth();
              }}
            >
              Accueil
            </Link>
          )}
        </div>

        {/* Toggler mobile (contrôlé en state) */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarContent"
          aria-expanded={open ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={toggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenu repliable */}
        <div
          className={`collapse navbar-collapse ${open ? "show" : ""}`}
          id="navbarContent"
        >
          {/* Liens */}
          <ul
            className="navbar-nav center-page text-center mx-auto mb-2 mb-lg-0 "
            ref={menuRef}
          >
            {isAuthenticated && role === "PATIENT"
              ? patient_links.map((item) => (
                  <li
                    key={item.id}
                    className={`nav-item px-2 py-2 ${
                      menu === item.label ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    {item.subItems ? (
                      <div className="nav-item dropdown">
                        <a
                          href="#"
                          className="nav-link dropdown-toggle"
                          id={`${item.id}Dropdown`}
                          role="button"
                          aria-expanded="false"
                          onClick={(e) => {
                            setMenu(item.label);
                            toggleDropdownById(`${item.id}Dropdown`)(e);
                          }}
                        >
                          {item.label}
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={`${item.id}Dropdown`}
                        >
                          {item.subItems.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                className="dropdown-item"
                                to={subItem.path}
                                onClick={() => {
                                  setMenu(subItem.label);
                                  closeSmooth();
                                }}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <Link
                        className="nav-link"
                        to={item.path}
                        onClick={() => {
                          setMenu(item.label);
                          closeSmooth();
                        }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))
              : nav_links.map((item) => (
                  <li
                    key={item.id}
                    className={`nav-item px-2 py-2 ${
                      menu === item.label ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setMenu(item.label)}
                  >
                    <AnchorLink
                      className="nav-link"
                      href={`#${item.id}`}
                      offset="100"
                      onClick={() => closeSmooth()}
                    >
                      {item.label}
                    </AnchorLink>
                  </li>
                ))}
          </ul>

          {/* Menu utilisateur */}
          {isAuthenticated && role === "PATIENT" ? (
            <>
              {/* Desktop (≥ lg) */}
              <ul className="navbar-nav ms-lg-auto d-none d-lg-flex">
                <li className="nav-item dropdown">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    id="userMenuDesktop"
                    role="button"
                    aria-expanded="false"
                    onClick={toggleDropdownById("userMenuDesktop")}
                  >
                    {userFullName || "Mon compte"}
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userMenuDesktop"
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/PatientDash/Account"
                        onClick={() => closeSmooth()}
                      >
                        Mon compte
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogoutClick}
                      >
                        Déconnexion
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>

              {/* Mobile (< lg) — bouton utilisateur avec NOM */}
              <ul className="navbar-nav d-lg-none w-100 justify-content-center my-2">
                <li className="nav-item dropdown w-100 text-center">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    id="userMenuMobile"
                    role="button"
                    aria-expanded="false"
                    onClick={toggleDropdownById("userMenuMobile")}
                  >
                    {userFullName || "Mon compte"}
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end text-center"
                    aria-labelledby="userMenuMobile"
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/PatientDash/Account"
                        onClick={() => closeSmooth()}
                      >
                        Mon compte
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogoutClick}
                      >
                        Déconnexion
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </>
          ) : (
            <div className="nav-btns d-flex flex-row gap-2 ms-lg-auto">
              <button
                className="btn btn-outline-primary px-4"
                onClick={handleLoginClick}
              >
                Login
              </button>
              <button
                className="btn btn-outline-primary px-4 buttons"
                onClick={handleRegisterClick}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


