import React, { useState } from "react";
import API_BASE_URL from "../../config/apiConfig";
import Sidebar from "../../components/Sidebar/SideBar";
import CreatePatient from "../../components/Patients/CreatePatient/CreatePatient";
import CreateMedecin from "../../components/CreateMedecin/CreateMedecin";
import CreateReceptionniste from "../../components/CreateReceptionniste/CreateReceptionniste"
// import CreateReceptionniste from "../../components/CreateReceptionniste/CreateReceptionniste";
import GetAllPatients from "../../components/Patients/GetAllPatients/GetAllPatients";
import GetAllMedecins from "../../components/GetAllMedecins/GetAllMedecins";
import GetAllReceptionnistes from "../../components/GetAllReceptionnistes/GetAllReceptionnistes";
import GetAllUsers from "../../components/GetAllUsers/GetAllUsers";
import "./AdminDash.css"; // Nouveau fichier pour styliser
import GetAllDeletedUsers from "../../components/GetAllUsers/GetAllDeletedUsers";

function AdminDash() {
  const [activeSection, setActiveSection] = useState("create-patient");

  const renderSection = () => {
    switch (activeSection) {
      case "create-patient":
        return <CreatePatient />;
      case "AffPatient":
        return <GetAllPatients />;
      case "create-medecin":
        return <CreateMedecin />;
      case "AffMed":
        return <GetAllMedecins />;
      case "CreerRecep":
        return <CreateReceptionniste />;
      case "AffRecep":
        return <GetAllReceptionnistes />;
      case "AffUsers":
        return <GetAllUsers />;
      case "deletedUsers":
        return <GetAllDeletedUsers/>
      default:
        return (
          <div className="text-muted p-4">
            Bienvenue dans le tableau de bord
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard d-flex">
      <div className="sidebar-section bg-white shadow-sm">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
      <div className="main-section flex-grow-1 bg-light">
        <div className="content-container p-4">{renderSection()}</div>
      </div>
    </div>
  );
}

export default AdminDash;
