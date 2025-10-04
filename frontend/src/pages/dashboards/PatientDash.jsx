import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Dashboard from "../../components/PatientDashboard/Dashboard";

function PatientDash() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isBaseRoute = location.pathname === "/PatientDash";

  return (
    // Layout pleine hauteur + colonne
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* Zone contenu qui prend tout l’espace disponible */}
      <main className="flex-grow-1">
        {isBaseRoute ? <Dashboard /> : <Outlet />}
      </main>

      <Footer />
    </div>
  );
}

export default PatientDash;
