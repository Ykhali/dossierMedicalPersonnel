import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import "./rdv-cards.css"; // <-- ton CSS

function GetHistoriqueRDV() {
  const [historique, setHistorique] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistorique = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/api/Patient/rendezvous/historique`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${res.status}`
          );
        }

        const data = await res.json();
        setHistorique(data);
      } catch (erreur) {
        setError(
          error.message || "Erreur lors de la récupération de l'historique"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistorique();
  }, [navigate]);

  // Helpers UI
  const badgeClassFor = (s = "") => {
    const v = s.toLowerCase();
    if (v.includes("confirm")) return "bg-success";
    if (v.includes("annul")) return "bg-danger";
    if (v.includes("planif")) return "bg-primary";
    if (v.includes("attente")) return "bg-warning text-dark";
    if (v.includes("term")) return "bg-secondary";
    if (v.includes("honor")) return "bg-dark";
    return "bg-light text-dark";
  };


  return (
    <div className="mt-5">
      <h3 className="text-center mb-5">Mon Historique des rendezVous</h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Chargement...</div>
      ) : historique.length === 0 ? (
        <p className="text-center text-muted">Aucun historique trouvé</p>
      ) : (
        historique.map((h) => {
          const canceled = String(h.status || "")
            .toLowerCase()
            .includes("annul");
          return (
            <div
              key={h.id}
              className="d-flex align-items-center w-75 mx-auto mb-4 p-3 border border-dark"
            >
              {/* 1) DATE tile (fixed width) */}
              <div
                className="d-flex flex-column justify-content-center align-items-center border border-dark p-2 me-3 text-center flex-shrink-0"
                style={{ width: "130px" }}
              >
                <div className="fw-semibold">{h.date || "—"}</div>
                <div className="small text-muted">{h.heure ?? "HH:mm"}</div>
              </div>

              {/* 2) DETAILS (grow to fill) */}
              <div className="flex-grow-1">
                <p className="mb-1">
                  <span className="fw-semibold">Motif:</span>{" "}
                  <span className="text-body-secondary">{h.motif || "—"}</span>
                </p>
                <p className="mb-1 text-muted">
                  Dr. {h?.medecin?.nom || ""} {h?.medecin?.prenom || ""}
                </p>
                <p className="mb-0 text-muted">
                  Créé le: {h.dateCreation || "—"}
                </p>
              </div>

              {/* 3) STATUS (right aligned) */}
              <div className="ms-auto d-flex flex-column align-items-end">
                <span
                  className={`badge rounded-pill ${badgeClassFor(
                    h.status
                  )} px-3 py-2`}
                >
                  {h.status || "—"}
                </span>
                {canceled && h.dateDAnnulation && (
                  <span className="small text-danger mt-2">
                    Annulé le: {h.dateDAnnulation}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}

      
    </div>
  );
}

export default GetHistoriqueRDV;

{
  /* {isLoading ? (
        <div className="text-center">Chargement...</div>
      ) : historique.length === 0 ? (
        <p className="text-center text-muted">Aucun historique trouvé</p>
      ) : (
        historique.map((h) => (
          <div
            key={h.id}
            className="d-flex border border-dark w-75 mx-auto mb-3"
          >
            <div className="border border-dark m-3 p-2 flex-shrink-0">
              <p className="mb-1">{h.date}</p>
              <p className="mb-0">{h.heure ?? "HH:mm"}</p>
            </div>

            <div className="flex-grow-1 my-3">
              <p className="mb-1">Motif: {h.motif}</p>
              <p className="mb-1">
                Dr. {h?.medecin?.nom} {h?.medecin?.prenom}
              </p>
              <p className="mb-0">Créé le: {h.dateCreation}</p>
            </div>

            <div className="p-2 m-3 flex-shrink-0">
              <span className="badge bg-success">{h.status}</span>
            </div>
          </div>
        ))
      )} */
}
