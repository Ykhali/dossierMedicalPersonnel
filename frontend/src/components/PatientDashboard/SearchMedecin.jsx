import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";

function SearchMedecin() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Navigation vers la page de résultats avec la query en paramètre
    navigate(`/PatientDash/medecins?query=${encodeURIComponent(query.trim())}`);
  };


  return (
    // <div className="container py-4">
    //   <div
    //     className="mx-auto p-4 bg-white shadow-sm rounded-4"
    //     style={{ maxWidth: 720 }}
    //   >
    //     <h4
    //       className="mb-3 fw-semibold text-center"
    //       style={{ color: "#0096c7" }}
    //     >
    //       <i
    //         className="bi bi-folder2-open me-2"
    //         style={{ color: "#0077b6" }}
    //       ></i>
    //       Chercher un medecin pour prendre rendez-vous
    //     </h4>

    //     <form >
    //       <div className="input-group input-group-lg">
    //         <span className="input-group-text bg-white">
    //           {isLoading ? (
    //             <span
    //               className="spinner-border spinner-border-sm"
    //               role="status"
    //               aria-hidden="true"
    //             ></span>
    //           ) : (
    //             <i className="bi bi-search" style={{ color: "#0077b6" }}></i>
    //           )}
    //         </span>
    //         <input
    //           type="text"
    //           className="form-control"
    //           placeholder="Specialité ou nom-complet"
    //           //value={query}
    //           //onChange={(e) => setQuery(e.target.value)}
    //           autoFocus
    //         />
    //       </div>

    //       <div className="d-flex justify-content-center gap-2 mt-3">
    //         <button
    //           className="btn px-4 rounded-pill  text-white"
    //           style={{ background: "#0096c7" }}
    //         >
    //           Rechercher
    //         </button>
    //         <button
    //           type="button"
    //           className="btn px-4 rounded-pill"
    //           style={{
    //             border: "1px solid #0096c7",
    //             color: "#0096c7",
    //             background: "#e8f6f9",
    //           }}
    //           onClick={() => {
    //             //setQuery("");
    //             setResults([]);
    //             setError(null);
    //           }}
    //           disabled={isLoading}
    //         >
    //           Effacer
    //         </button>
    //       </div>
    //     </form>

    //     {error && <div className="alert alert-danger mt-3">{error}</div>}

    //     {/* Résultats live */}
    //     {query.trim().length >= MIN_CHARS && results.length >= 1 && (
    //       <div className="mt-4">
    //         <div className="small text-muted mb-2">
    //           {results.length} patient(s) trouvé(s)
    //         </div>
    //         <ul className="list-group">
    //           {results.map((p) => (
    //             <li
    //               key={p.id}
    //               className="list-group-item d-flex align-items-center justify-content-between"
    //             >
    //               <div className="d-flex align-items-center gap-3">
    //                 <Avatar p={p} />
    //                 <div className="small">
    //                   <div className="fw-semibold">
    //                     {p.nom} {p.prenom}
    //                   </div>
    //                   <div className="text-muted">
    //                     CIN: {p.cin} · Tél: {p.telephone} · {p.email}
    //                   </div>
    //                 </div>
    //               </div>
    //               <button
    //                 className="btn btn-sm rounded-pill text-white"
    //                 style={{ background: "#0096c7" }}
    //                 onClick={() =>
    //                   navigate(`/MedecinDash/dossierPatient/${p.id}`)
    //                 }
    //               >
    //                 Ouvrir
    //               </button>
    //             </li>
    //           ))}
    //         </ul>
    //       </div>
    //     )}

    //     {/* Aucun résultat (seulement si saisie suffisante, pas en cours de chargement) */}
    //     {query.trim().length >= MIN_CHARS &&
    //       results.length === 0 &&
    //       !isLoading &&
    //       !error && (
    //         <div className="alert alert-warning mt-3">
    //           Aucun patient trouvé.
    //         </div>
    //       )}
    //   </div>
    // </div>
    <div className="container py-4">
      <div
        className="mx-auto p-4 bg-white shadow-sm rounded-4"
        style={{ maxWidth: 720 }}
      >
        <h4
          className="mb-3 fw-semibold text-center"
          style={{ color: "#0096c7" }}
        >
          <i
            className="bi bi-folder2-open me-2"
            style={{ color: "#0077b6" }}
          ></i>
          Chercher un médecin pour prendre rendez-vous
        </h4>

        <form onSubmit={handleSearch}>
          <div className="input-group input-group-lg">
            <input
              type="text"
              className="form-control"
              placeholder="Spécialité ou nom-complet"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button className="btn btn-primary" type="submit">
              Rechercher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchMedecin;
