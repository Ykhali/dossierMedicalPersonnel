import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./pages/Login/Login";
import Home from "./pages/Home";
import AdminDash from "./pages/dashboards/AdminDash";
import MedecinDash from "./pages/dashboards/MedecinDash";
import PatientDash from "./pages/dashboards/PatientDash";
import ReceptionnisteDash from "./pages/dashboards/ReceptionnisteDash";

import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register/Register";
import CreateRendezVous from "./components/CreateRendezVous/CreateRendezVous";
import GetAllRendezVous from "./components/GetAllRendezVous/GetAllRendezVous";
import MonCompte from "./components/PatientDashboard/MonCompte";
import GetRendezVousPasse from "./components/GetAllRendezVous/GetRendezVousPasse";
import GetHistoriqueRDV from "./components/GetAllRendezVous/GetHistoriqueRDV";
import Contact from "./components/Contact/Contact";
import ContactezNous from "./components/Contact/ContactezNous";
import Hero from "./components/Hero/Hero";
import Profile from "./components/PatientDashboard/Profile";
import ChangerPwd from "./components/PatientDashboard/ChangerPwd";
import CreateRv from "./components/CreateRendezVous/CreateRv";
import EditInfo from "./components/PatientDashboard/EditInfo";
import GetAllRendezVousAnnule from "./components/GetAllRendezVous/GetAllRendezVousAnnule";
import Docs from "./components/PatientDashboard/Docs";
import DossierMedicalPage from "./components/MedecinDash/DossierMedicalPage";

import ResetPassword from "./pages/ResetPassword/ResetPassword";

//med
import Dashboard from "./components/MedecinDash/Dashboard";
import GetAllRVToday from "./components/MedecinDash/GetAllRVToday";
import GetRvAVenir from "./components/MedecinDash/GetRvAVenir";
import MesHorairesAbsences from "./components/MedecinDash/MesHorairesAbsences";
import SearchPatient from "./components/MedecinDash/SearchPatient";
import Compte from "./components/MedecinDash/Compte";
import Message from "./components/MedecinDash/Message";
import MesReceptionniste from "./components/MedecinDash/MesReceptionniste";
import SearchMedecin from "./components/PatientDashboard/SearchMedecin";
import MedecinsResults from "./components/PatientDashboard/MedecinsResults";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} /> {/* Public route */}
        {/* <Route path="/home" element={<Home />} /> */}
        <Route
          path="/PatientDash"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientDash />
            </ProtectedRoute>
          }
        >
          {/* <Route path="rendezvous" element={<CreateRendezVous />} /> */}
          <Route path="rendezvous" element={<SearchMedecin />} />
          <Route path="rendezvous/:medId" element={<CreateRendezVous/>}/>
          <Route path="afficherRendezVous" element={<GetAllRendezVous />} />
          <Route path="rendezVousPassé" element={<GetRendezVousPasse />} />
          <Route
            path="Rendez-VousAnnulé"
            element={<GetAllRendezVousAnnule />}
          />
          <Route path="medecins" element={<MedecinsResults/>}/>
          <Route path="historiqueRendezVous" element={<GetHistoriqueRDV />} />
          <Route path="Account" element={<MonCompte />} />
          <Route path="Account/information" element={<Profile />} />
          <Route path="Account/information/edit" element={<EditInfo />} />
          <Route path="Contact" element={<ContactezNous />} />
          <Route path="accueil" element={<Hero />} />
          <Route path="Account/EditPwd" element={<ChangerPwd />} />
          <Route path="MesDocuments" element={<Docs />} />
        </Route>
        <Route
          path="/AdminDash"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDash />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/MedecinDash"
          element={
            <ProtectedRoute allowedRoles={["MEDECIN"]}>
              <MedecinDash />
            </ProtectedRoute>
          }
        >
          <Route
            path="dossierPatient/:patientId"
            element={<DossierMedicalPage />}
          />
        </Route> */}
        {/* Médecin */}
        <Route
          path="/MedecinDash"
          element={
            <ProtectedRoute allowedRoles={["MEDECIN"]}>
              <MedecinDash />
            </ProtectedRoute>
          }
        >
          {/* Accueil tableau de bord */}
          <Route index element={<Dashboard />} />

          {/* Rendez-vous */}
          <Route path="mesReceptionnistes" element={<MesReceptionniste />} />
          <Route path="rv-auj" element={<GetAllRVToday />} />
          <Route path="rv-avenir" element={<GetRvAVenir />} />
          <Route path="horaires" element={<MesHorairesAbsences />} />

          {/* Patients */}
          <Route path="dossiers" element={<SearchPatient />} />
          <Route
            path="dossierPatient/:patientId"
            element={<DossierMedicalPage />}
          />

          {/* Communication */}
          <Route path="messages" element={<Message />} />

          {/* Compte */}
          <Route path="profil" element={<Compte />} />
        </Route>
        <Route
          path="/ReceptionnisteDash"
          element={
            <ProtectedRoute allowedRoles={["RECEPTIONNISTE"]}>
              <ReceptionnisteDash />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
