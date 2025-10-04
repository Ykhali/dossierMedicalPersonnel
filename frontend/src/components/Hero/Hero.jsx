import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Hero.css";
import { jwtDecode } from "jwt-decode";
import doctorBackground from "../../assets/Images/doctorBackground.jpeg";

function Hero() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let isAuthenticated = false;
  let role = null;
  let userFullName = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      userFullName = decoded.nom + " " + decoded.prenom;
      isAuthenticated = true;
    } catch (err) {
      console.log("Erreur lors de la recuperation du token", err);
      isAuthenticated = false;
    }
  }

  return (
    <div id="Accueil" className="container py-5 mb-5 mt-4 hero">
      <div className="row align-items-center">
        {/* Texte Hero */}

        <div className="col-lg-6 mb-4 mb-lg-0 text-hero">
          {isAuthenticated && role === "PATIENT" ? (
            <h1 className="display-5 fw-bold text-primary text-center text-lg-start">
              Bienvenue <span className="fw-normal fst-italic">Mr. {userFullName}</span> dans votre espace santé personnalisé.
            </h1>
          ) : (
            <h1 className="display-5 fw-bold text-primary text-center text-lg-start">
              Veuillez la bienvenue dans votre espace santé personnalisé.
            </h1>
          )}

          <p className="lead text-muted mt-3 text-center text-lg-start">
            Avec AloDocteur, accédez facilement à vos rendez-vous, documents
            médicaux et échanges avec votre médecin. Une expérience fluide,
            sécurisée et centrée sur votre bien-être, à chaque étape de votre
            parcours de soin.
          </p>
        </div>

        {/* Image Hero */}
        <div className="col-lg-6 text-center hero-img">
          <img
            src={doctorBackground}
            alt="Docteur"
            className="img-fluid rounded shadow"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
