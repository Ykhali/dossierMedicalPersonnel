// src/pages/Patient/MesDocuments.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./documents.css"; // ↩︎ importe le thème médical + layout

export default function Docs() {
  const navigate = useNavigate();

  const tiles = [
    {
      title: "Mes factures",
      icon: "bi-receipt",
      subtitle: "Télécharger/consulter vos factures",
      to: "/PatientDash/documents/factures",
    },
    {
      title: "Mes prescriptions",
      icon: "bi-file-earmark-medical",
      subtitle: "Ordonnances et prescriptions",
      to: "/PatientDash/documents/prescriptions",
    },
  ];

  return (
    <div className="container py-4 theme-medical">
      <div className="docs-wrap mx-auto">
        <h4 className="docs-title fw-semibold">Mes Documents</h4>

        {/* Grille 2 cartes larges et centrées */}
        <div className="docs-grid ">
          {tiles.map((t) => (
            <div key={t.title} className="doc-item ">
              <div
                role="button"
                // className="card h-100 text-center border-0 rounded-4 doc-card"
                className="card h-100 text-center rounded-4 doc-card"
                onClick={() => navigate(t.to)}
                aria-label={t.title}
              >
                <div className="card-body p-4">
                  <div className="doc-icon-wrap">
                    <i className={`bi ${t.icon} doc-icon`} />
                  </div>
                  <h6 className="fw-bold mb-1 text-medical">{t.title}</h6>
                  <p className="text-muted small mb-0">{t.subtitle}</p>
                </div>
                <span className="stretched-link" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
