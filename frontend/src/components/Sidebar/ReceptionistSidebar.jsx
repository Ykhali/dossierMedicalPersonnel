// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./Sidebar-receptionist.css";

// const ReceptionistSidebar = ({ activeSection, onSectionChange }) => {
//   const menuItems = [
//     { label: "Dashboard", id: "Dashboard" },
//     { label: "RendezVous du Jour", id: "RvJour" },
//     { label: "RendezVous", id: "RendezVouslist" },
//     { label: "Patients", id: "PatientList" },
//     { label: "Medecins", id: "MedecinDispo" },
//     { label: "Profil", id: "profil" },
//   ];
//   const navigate = useNavigate();
//   const handleLogoutClick = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <div
//       className="sidebar d-flex flex-column bg-dark text-white p-3 position-fixed h-100"
//       style={{ width: "250px" }}
//     >
//       <div className="sidebar-logo text-center border-bottom pb-3 mb-3">
//         <h4>Admin Dashboard</h4>
//       </div>
//       <ul className="nav flex-column sidebar-nav">
//         {menuItems.map((item) => (
//           <li
//             key={item.id}
//             className={`nav-item px-2 py-2 ${
//               activeSection === item.id ? "bg-secondary rounded" : ""
//             }`}
//             onClick={() => onSectionChange(item.id)}
//             style={{ cursor: "pointer" }}
//           >
//             {item.label}
//           </li>
//         ))}
//       </ul>
//       <a
//         onClick={handleLogoutClick}
//         className="logout-btn btn mt-auto px-2 py-2 text-danger text-decoration-none fw-semibold"
//       >
//         <i className="fas fa-sign-out-alt me-2"></i> Déconnexion
//       </a>
//     </div>
//   );
// };

// export default ReceptionistSidebar;


import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar-receptionist.css";

const ReceptionistSidebar = ({ activeSection, onSectionChange }) => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", id: "Dashboard", icon: "bi-speedometer2" },
    { label: "RendezVous du Jour", id: "RvJour", icon: "bi-calendar-check" },
    {
      label: "RendezVous annulés du Jour",
      id: "RvAnnuleDuJour",
      icon: "bi-calendar-check",
    },
    { label: "RendezVous", id: "RendezVouslist", icon: "bi-calendar-event" },
    { label: "Patients", id: "PatientList", icon: "bi-people" },
    { label: "Docs", id: "docs", icon: "bi-journals" },

    { label: "Médecins", id: "MedecinDispo", icon: "bi-person-badge" },
    { label: "Profil", id: "profil", icon: "bi-person-circle" },
  ];

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className="rcp-sidebar"
      role="navigation"
      aria-label="Menu réceptionniste"
    >
      <div className="rcp-brand">Réceptionniste</div>

      <ul className="rcp-menu">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`rcp-link ${
                activeSection === item.id ? "is-active" : ""
              }`}
              aria-current={activeSection === item.id ? "page" : undefined}
              onClick={() => onSectionChange?.(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSectionChange?.(item.id);
                }
              }}
            >
              <i className={`bi ${item.icon} me-2`} aria-hidden="true"></i>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="rcp-bottom">
        <button
          type="button"
          className="rcp-logout"
          onClick={handleLogoutClick}
        >
          <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>{" "}
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default ReceptionistSidebar;

