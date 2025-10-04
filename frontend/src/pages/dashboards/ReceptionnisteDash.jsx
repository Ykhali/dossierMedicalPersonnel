import React, { useState } from "react";
import API_BASE_URL from "../../config/apiConfig";
import ReceptionistSidebar from "../../components/Sidebar/ReceptionistSidebar";
import GetRendezVousToday from "../../components/ReceptionnistDash/GetRendezVousToday";
import { Outlet } from "react-router-dom";
import GetRvAvenir from "../../components/ReceptionnistDash/GetRvAvenir";
import PatientList from "../../components/ReceptionnistDash/PatientList";
import Profil from "../../components/ReceptionnistDash/Profil";
import MedecinList from "../../components/ReceptionnistDash/MedecinList";
import Dashboard from "../../components/ReceptionnistDash/Dashboard";
import GetRendezVousAnnuleToday from "../../components/ReceptionnistDash/GetRendezVousAnnuleToday";
import Folders from "../../components/ReceptionnistDash/Folders";

function ReceptionnisteDash() {

  const [activeSection, setActiveSection] = useState("Dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard":
        return <Dashboard/>;
      case "RvJour":
        return <GetRendezVousToday/>;
      case "RvAnnuleDuJour":
        return <GetRendezVousAnnuleToday/>;
      case "RendezVouslist":
        return <GetRvAvenir/>;
      case "PatientList":
        return <PatientList/>;
      case "docs":
        return <Folders/>
      case "MedecinDispo":
        return <MedecinList/>;
      case "profil":
        return <Profil/>;
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
        <ReceptionistSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
      <div className="main-section flex-grow-1 bg-light">
        <div className="content-container p-4">
          {renderSection()}

        </div>
      </div>
    </div>
  );
}

export default ReceptionnisteDash;
