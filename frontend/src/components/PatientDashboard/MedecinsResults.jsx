import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import { BiBorderRadius } from "react-icons/bi";

const avatarCache = new Map();

function MedecinsResults() {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Récupération de la query depuis l'URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  useEffect(() => {
    if (!query) return;

    const fetchMedecins = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expirée. Veuillez vous reconnecter.");
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/Patient/searchMedecin?q=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/Json",
            },
          }
        );
        if (!response.ok) throw new Error("Erreur lors de la recherche");
        const data = await response.json();
        setMedecins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedecins();
  }, [query]);

  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const Avatar = ({ p }) => {
    const [src, setSrc] = useState(null);

    useEffect(() => {
      let alive = true;
      setSrc(null); // reset à chaque nouveau patient

      // garde-fous
      if (!p?.id) return;
      const token = localStorage.getItem("token");
      if (!token) return;

      // URL ABSOLUE de l'endpoint protégé
      const url = `${API_BASE_URL}/api/Patient/${p.id}/getMedecinImage`;

      // cache mémoire (évite de re-télécharger la même image)
      const cached = avatarCache.get(url);
      if (cached) {
        setSrc(cached);
        return;
      }

      (async () => {
        try {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return; // pas d'image -> fallback initiales

          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          avatarCache.set(url, objUrl);
          if (alive) setSrc(objUrl);
        } catch {
          // ignore -> fallback initiales
        }
      })();

      return () => {
        alive = false;
      };
    }, [p?.id]);

    const style = {
      width: 300,
      height: 300,
      objectFit: "cover",
      borderRadius: "12%",
      border: "3px solid #e9ecef",
    };

    if (src) {
      return (
        <img
          src={src}
          alt={`${p?.nom ?? ""} ${p?.prenom ?? ""}`}
          style={style}
          loading="lazy"
          onError={() => setSrc(null)} // si l'image casse -> initiales
        />
      );
    }

    // Fallback initiales
    const initials =
      `${(p?.prenom?.[0] ?? "").toUpperCase()}${(
        p?.nom?.[0] ?? ""
      ).toUpperCase()}` || "?";
    return (
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e8f6f9",
          color: "#0096c7",
          fontWeight: 700,
        }}
        aria-label={`Avatar ${p?.nom ?? ""} ${p?.prenom ?? ""}`}
      >
        {initials}
      </div>
    );
  };

  return (
    <>
      <div className=" py-4">

        <button
          className="btn btn-outline-secondary ml-5"
        >
          <i className="bi bi-chevron-left" /> Retour
        </button>

        <h4
          className="mb-4 fw-semibold text-center mb-5"
          style={{ color: "#0096c7" }}
        >
          Résultats pour « {query} »
        </h4>

        {medecins.length === 0 ? (
          <div className="alert alert-warning text-center">
            Aucun médecin trouvé.
          </div>
        ) : (
          <div className=" d-flex row align-items-center justify-content-center g-4">
            {medecins.map((med) => (
              <div key={med.id} className="mx-auto col-lg-8">
                <div className=" d-flex shadow-sm h-100 mb-4 border rounded-4 bg-white">
                  <div className="p-3">
                    <Avatar p={med} />
                  </div>

                  <div className="card-body d-flex flex-column p-3">
                    <h5
                      className="card-title fw-bold mb-3"
                      style={{ color: "#0077b6" }}
                    >
                      Dr. {med.nom} {med.prenom}
                    </h5>

                    <ul className="list-group list-group-flush shadow-sm rounded-3 mb-3">
                      <li className="list-group-item d-flex align-items-center">
                        <i className="bi bi-telephone text-primary fs-5 me-3"></i>
                        <div>
                          <span className="fw-semibold">Téléphone:</span>{" "}
                          <span className="text-muted">{med.telephone}</span>
                        </div>
                      </li>

                      <li className="list-group-item d-flex align-items-center">
                        <i className="bi bi-geo-alt text-danger fs-5 me-3"></i>
                        <div>
                          <span className="fw-semibold">Adresse:</span>{" "}
                          <span className="text-muted">
                            {med.adresse} / {med.ville}
                          </span>
                        </div>
                      </li>

                      <li className="list-group-item d-flex align-items-center">
                        <i className="bi bi-hospital text-success fs-5 me-3"></i>
                        <div>
                          <span className="fw-semibold">Spécialité:</span>{" "}
                          <span className="text-muted">{med.specialite}</span>
                        </div>
                      </li>

                      <li className="list-group-item d-flex align-items-center">
                        <i className="bi bi-translate text-warning fs-5 me-3"></i>
                        <div>
                          <span className="fw-semibold">Langues parlées:</span>{" "}
                          <span className="text-muted">{med.langues}</span>
                        </div>
                      </li>

                      <li className="list-group-item d-flex align-items-start">
                        <i className="bi bi-info-circle text-secondary fs-5 me-3"></i>
                        <div>
                          <span className="fw-semibold">Bio:</span>
                          <p className="mb-0 text-muted small">{med.bio}</p>
                        </div>
                      </li>
                    </ul>

                    <button
                      className="btn btn-outline-primary mt-auto rounded-pill px-4"
                      onClick={() =>
                        navigate(`/PatientDash/rendezvous/${med.id}`)
                      }
                    >
                      <i className="bi bi-calendar-check me-2"></i>
                      Prendre rendez-vous
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MedecinsResults;
