// import React, {useState} from 'react'
// import MedSide from '../../components/Sidebar/MedSide';
// import GetAllRVToday from '../../components/MedecinDash/GetAllRVToday';
// import GetRvAVenir from '../../components/MedecinDash/GetRvAVenir';

// function MedecinDash() {
//   const [activeSection, setActiveSection] = useState("dashboard");

//   // NEW: stocker les compteurs
//   const [countToday, setCountToday] = useState(0);
//   const [countUpcoming, setCountUpcoming] = useState(0);

//   const renderSection = () => {
//     switch (activeSection) {
//       case "dashboard":
//         return "hhhh";
//       case "rv-auj":
//         return <GetAllRVToday onCountChange={setCountToday} />;
//       case "rv-avenir":
//         return <GetRvAVenir onCountChange={setCountUpcoming} />;
//       case "horaires":
//         return "hhhh";
//       case "patients":
//         return "hhhh";
//       case "dossiers":
//         return "hhhh";
//       case "messages":
//         return "hhhh";
//       case "parametres":
//         return "hhhh";
//       case "logout":
//         return <div className="p-4">Déconnexion…</div>;
//       default:
//         return <div className="p-4 text-muted">Bienvenue</div>;
//     }
//   };
//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       {/* Sidebar (contrôlée) */}
//       <MedSide
//         activeSection={activeSection}
//         onSectionChange={setActiveSection}
//         badgeToday={countToday}
//         badgeUpcoming={countUpcoming}
//       />

//       {/* Contenu */}
//       <div className="flex-grow-1 d-flex flex-column">
//         {/* Topbar */}
//         <header className="topbar border-bottom d-flex align-items-center justify-content-between px-3">
//           <div className="d-flex align-items-center gap-2">
//             <button
//               className="btn btn-outline-med btn-sm d-lg-none"
//               type="button"
//               data-bs-toggle="offcanvas"
//               data-bs-target="#medSidebar" /* doit matcher l'id dans MedSide */
//               aria-controls="medSidebar"
//             >
//               <i className="bi bi-list me-1" /> Menu
//             </button>
//             <h5 className="mb-0 fw-semibold text-medical">Espace Médecin</h5>
//           </div>
//           <div className="d-none d-sm-flex align-items-center gap-2">
//             <img
//               src="https://ui-avatars.com/api/?name=Dr+Mehdi"
//               className="rounded-circle avatar"
//               alt="Avatar"
//             />
//             <div className="small">
//               <div className="fw-semibold">Dr. Mehdi</div>
//               <div className="text-muted">Cardiologie</div>
//             </div>
//           </div>
//         </header>

//         <main className="p-3 p-md-4">{renderSection()}</main>
//       </div>
//     </div>
//   );
// }

// export default MedecinDash;

// MedecinDash.jsx




// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import MedSide from "../../components/Sidebar/MedSide";
// import { Outlet, useMatch } from "react-router-dom";
// import GetAllRVToday from "../../components/MedecinDash/GetAllRVToday";
// import GetRvAVenir from "../../components/MedecinDash/GetRvAVenir";
// import API_BASE_URL from "../../config/apiConfig";
// import MesHorairesAbsences from "../../components/MedecinDash/MesHorairesAbsences";
// import SearchPatient from "../../components/MedecinDash/SearchPatient";
// import Compte from "../../components/MedecinDash/Compte";
// import { getToken, isTokenValid, clearAuth } from "../../utils/auth";
// import Dashboard from "../../components/MedecinDash/Dashboard";

// function MedecinDash() {
//   const [activeSection, setActiveSection] = useState("dashboard");
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);
//   const [info, setInfo] = useState(null);
//   const [userFullName, setUserFullName] = useState("");

//   // Badges à afficher dans la sidebar
//   const [countToday, setCountToday] = useState(0);
//   const [countUpcoming, setCountUpcoming] = useState(0);

//   const showDossier = useMatch("/MedecinDash/dossierPatient/:patientId");

//   // --- Helpers partagés (même logique que tes pages) ---
//   const pad = (n) => (n < 10 ? "0" + n : "" + n);
//   const now = () => new Date();

//   // parse "DD/MM/YYYY HH:mm" | "DD-MM-YYYY" (+ rv.heure)
//   const parseRvDateTime = useCallback((rv) => {
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
//   }, []);

//   // Déduplique un array de RDV comme dans tes composants
//   const dedupe = useCallback((data) => {
//     return Array.from(
//       new Map(
//         data.map((rv) => {
//           const key =
//             rv.id ??
//             `${rv.dateRendezVous || rv.date}-${rv.heure}-${
//               rv.patient?.id ?? rv.patientNom ?? rv.patientFullName ?? ""
//             }`;
//           return [key, rv];
//         })
//       ).values()
//     );
//   }, []);

//   // Calcule un count >= maintenant
//   const countFromList = useCallback(
//     (list) => {
//       const n = now().getTime();
//       return list
//         .map((rv) => parseRvDateTime(rv))
//         .filter((d) => d && d.getTime() >= n).length;
//     },
//     [parseRvDateTime]
//   );

//   // --- Hydratation au montage (pour éviter les badges à 0 au refresh) ---
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };

//     // fetch today
//     const p1 = fetch(`${API_BASE_URL}/api/Medecin/rendezVous/aujourdhui`, {
//       headers,
//     })
//       .then((r) => (r.ok ? r.json() : []))
//       .then((data) => {
//         const unique = dedupe(data);
//         setCountToday(countFromList(unique));
//       })
//       .catch(() => setCountToday(0));

//     // fetch upcoming
//     const p2 = fetch(`${API_BASE_URL}/api/Medecin/rendezVous/avenir`, {
//       headers,
//     })
//       .then((r) => (r.ok ? r.json() : []))
//       .then((data) => {
//         const unique = dedupe(data);
//         setCountUpcoming(countFromList(unique));
//       })
//       .catch(() => setCountUpcoming(0));

//     // pas besoin d'attendre p1/p2 ici — les setState se feront à réception
//   }, [dedupe, countFromList]);

//   // --- Rendu section ---
//   const renderSection = () => {
//     switch (activeSection) {
//       case "dashboard":
//         return <Dashboard />;
//       case "rv-auj":
//         return <GetAllRVToday onCountChange={setCountToday} />;
//       case "rv-avenir":
//         return <GetRvAVenir onCountChange={setCountUpcoming} />;
//       case "horaires":
//         return <MesHorairesAbsences />;
//       case "patients":
//         return "hhhh";
//       case "dossiers":
//         return <SearchPatient />;
//       case "messages":
//         return "hhhh";
//       case "profil":
//         return <Compte />;
//       case "logout":
//         return <div className="p-4">Déconnexion…</div>;
//       default:
//         return <div className="p-4 text-muted">Bienvenue</div>;
//     }
//   };

//   useEffect(() => {
//     const fetchInfo = async () => {
//       const t = getToken();
//       try {
//         if (!t || !isTokenValid(t)) {
//           clearAuth();
//           setUserFullName("");

//           if (location.pathname.startsWith("/MedecinDash")) {
//             navigate("/login", { replace: true });
//           }
//           return;
//         }

//         const res = await fetch(`${API_BASE_URL}/api/Medecin/basic-info`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${t}`,
//           },
//           credentials: "include",
//         });

//         if (!res.ok) {
//           throw new Error(`Erreur HTTP ${res.status}`);
//         }

//         const data = await res.json();
//         setInfo(data);
//         setUserFullName(`${data.prenom ?? ""} ${data.nom ?? ""}`.trim());
//         setError(null);
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           setError(err.message || "Erreur de chargement");
//         }
//       }
//     };
//     fetchInfo();
//   }, []);
//   const avatarUrl = (fullName = "") =>
//     `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || "Dr")}`;

//   return (
//     <div className="d-flex min-vh-100 bg-light overflow-hidden">
//       <MedSide
//         activeSection={activeSection}
//         onSectionChange={setActiveSection}
//         badgeToday={countToday}
//         badgeUpcoming={countUpcoming}
//       />

//       <div className="flex-grow-1 d-flex flex-column">
//         <header className="topbar border-bottom d-flex align-items-center justify-content-between px-3">
//           <div className="d-flex align-items-center gap-2">
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
//           <div className="d-none d-sm-flex align-items-center gap-2">
//             <img
//               src={avatarUrl(userFullName)}
//               className="rounded-circle avatar"
//               alt="Avatar"
//             />
//             <div className="small">
//               <div className="fw-semibold">
//                 {userFullName ? `Dr. ${userFullName}` : "Dr."}
//               </div>
//               <div className="text-muted text-center">
//                 {info?.specialite || "—"}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* <main className="p-3 p-md-4">{renderSection()}</main> */}
//         {/* ✅ Si une route enfant (dossierPatient) est active, on affiche l’enfant, sinon la section du dashboard */}
//         <main className="p-3 p-md-4">
//           {showDossier ? <Outlet /> : renderSection()}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default MedecinDash;


// src/pages/MedecinDash.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import MedSide from "../../components/Sidebar/MedSide";
import API_BASE_URL from "../../config/apiConfig";
import { getToken, isTokenValid, clearAuth } from "../../utils/auth";

function MedecinDash() {
  const navigate = useNavigate();

  // Header (infos médecin)
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [userFullName, setUserFullName] = useState("");

  // Badges à afficher dans la sidebar
  const [countToday, setCountToday] = useState(0);
  const [countUpcoming, setCountUpcoming] = useState(0);

  const now = () => new Date();

  // parse "DD/MM/YYYY HH:mm" ou "YYYY-MM-DD" (+ rv.heure)
  const parseRvDateTime = useCallback((rv) => {
    const raw = String(rv.dateRendezVous || rv.date || "").trim();
    const heureStr = String(rv.heure || "").trim();
    if (!raw) return null;

    // ISO direct
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
      try {
        return new Date(heureStr ? `${raw}T${heureStr}` : raw);
      } catch {
        return null;
      }
    }

    // DD/MM/YYYY ou DD-MM-YYYY
    const [datePart, timeInline] = raw.split(" ");
    const time = (timeInline || heureStr || "00:00").trim();
    const parts = (datePart || "").split(/[-/]/);
    if (parts.length !== 3) return null;

    let [dd, mm, yyyy] = parts.map((x) => x.trim());
    const day = parseInt(dd, 10);
    const monthIndex = parseInt(mm, 10) - 1;
    const year = parseInt(yyyy, 10);

    const [hh = "0", min = "0"] = time.split(":");
    const hour = parseInt(hh, 10) || 0;
    const minute = parseInt(min, 10) || 0;

    const d = new Date(year, monthIndex, day, hour, minute, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }, []);

  // Déduplique un array de RDV
  const dedupe = useCallback((arr) => {
    return Array.from(
      new Map(
        (arr || []).map((rv) => {
          const key =
            rv.id ??
            `${rv.dateRendezVous || rv.date}-${rv.heure}-${
              rv.patient?.id ?? rv.patientNom ?? rv.patientFullName ?? ""
            }`;
          return [key, rv];
        })
      ).values()
    );
  }, []);

  // Calcule un count >= maintenant
  const countFromList = useCallback(
    (list) => {
      const n = now().getTime();
      return list
        .map((rv) => parseRvDateTime(rv))
        .filter((d) => d && d.getTime() >= n).length;
    },
    [parseRvDateTime]
  );

  // Charger badges (aujourd’hui / à venir)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    fetch(`${API_BASE_URL}/api/Medecin/rendezVous/aujourdhui`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const unique = dedupe(data);
        setCountToday(countFromList(unique));
      })
      .catch(() => setCountToday(0));

    fetch(`${API_BASE_URL}/api/Medecin/rendezVous/avenir`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const unique = dedupe(data);
        setCountUpcoming(countFromList(unique));
      })
      .catch(() => setCountUpcoming(0));
  }, [dedupe, countFromList]);

  // Charger infos de base (nom, prénom, spécialité) pour le header
  useEffect(() => {
    const fetchInfo = async () => {
      const t = getToken();
      try {
        if (!t || !isTokenValid(t)) {
          clearAuth();
          setUserFullName("");
          navigate("/login", { replace: true });
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/Medecin/basic-info`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${t}`,
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

        const data = await res.json();
        setInfo(data);
        setUserFullName(`${data.prenom ?? ""} ${data.nom ?? ""}`.trim());
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Erreur de chargement");
        }
      }
    };
    fetchInfo();
  }, [navigate]);

  const avatarUrl = useMemo(
    () => (fullName = "") =>
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName || "Dr"
      )}`,
    []
  );

  return (
    <div className="d-flex min-vh-100 bg-light overflow-hidden">
      {/* Sidebar (même style) */}
      <MedSide badgeToday={countToday} badgeUpcoming={countUpcoming} />

      {/* Colonne principale */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header (même style) */}
        <header className="topbar border-bottom d-flex align-items-center justify-content-between px-3">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-med btn-sm d-lg-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#medSidebar"
              aria-controls="medSidebar"
            >
              <i className="bi bi-list me-1" /> Menu
            </button>
            <h5 className="mb-0 fw-semibold text-medical">Espace Médecin</h5>
          </div>
          <div className="d-none d-sm-flex align-items-center gap-2">
            <img
              src={avatarUrl(userFullName)}
              className="rounded-circle avatar"
              alt="Avatar"
              onError={(e) => (e.currentTarget.src = avatarUrl("Dr"))}
              style={{ width: 36, height: 36, objectFit: "cover" }}
            />
            <div className="small">
              <div className="fw-semibold">
                {userFullName ? `Dr. ${userFullName}` : "Dr."}
              </div>
              <div className="text-muted">{info?.specialite || "—"}</div>
            </div>
          </div>
        </header>

        {/* Zone de contenu : les sous-routes /MedecinDash/... s’affichent ici */}
        <main className="p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MedecinDash;
