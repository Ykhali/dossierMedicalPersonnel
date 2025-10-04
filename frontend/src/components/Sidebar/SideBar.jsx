// import React from "react";
// import "./Sidebar.css";

// const Sidebar = ({ activeSection, onSectionChange }) => {
//   const menuItems = [
//     { label: "Créer Patient", id: "create-patient" },
//     { label: "Afficher Patients", id: "AffPatient" },
//     { label: "Créer Medecin", id: "CreerMed" },
//     { label: "Afficher Medecins", id: "AffMed" },
//     { label: "Créer Receptionniste", id: "CreerRecep" },
//     { label: "Afficher Receptionnistes", id: "AffRecep" },
//   ];

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
//         href="/login"
//         className="logout-btn mt-auto px-2 py-2 text-danger text-decoration-none fw-semibold"
//       >
//         <i className="fas fa-sign-out-alt me-2"></i> Logout
//       </a>
//     </div>
//   );
// };

// export default Sidebar;
import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./Sidebar.css";

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { label: "Créer Patient", id: "create-patient" },
    { label: "Afficher Patients", id: "AffPatient" },
    { label: "Créer Médecin", id: "create-medecin" },
    { label: "Afficher Médecins", id: "AffMed" },
    { label: "Créer Réceptionniste", id: "CreerRecep" },
    { label: "Afficher Réceptionnistes", id: "AffRecep" },
    { label: "Afficher Tous les Utilisateurs", id: "AffUsers" },
    { label: "Afficher Tous les Utilisateurs Supprimés", id: "deletedUsers" },
  ];
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  return (
    <div
      className="sidebar d-flex flex-column bg-dark text-white p-3 position-fixed h-100"
      style={{ width: "250px" }}
    >
      <div className="sidebar-logo text-center border-bottom pb-3 mb-3">
        <h4>Admin Dashboard</h4>
      </div>
      <ul className="nav flex-column sidebar-nav">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`nav-item px-2 py-2 ${
              activeSection === item.id ? "bg-secondary rounded" : ""
            }`}
            onClick={() => onSectionChange(item.id)}
            style={{ cursor: "pointer" }}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <a
        onClick={handleLogoutClick}
        className="logout-btn mt-auto px-2 py-2 text-danger text-decoration-none fw-semibold"
        style={{ cursor: "pointer" }}
      >
        <i className="fas fa-sign-out-alt me-2"></i> Déconnexion
      </a>
    </div>
  );
};

export default Sidebar;