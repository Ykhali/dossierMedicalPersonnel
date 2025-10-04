import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";

const avatarCache = new Map();

const MIN_CHARS = 1;
const DEBOUNCE_MS = 350;

export default function SearchPatient() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const controllerRef = useRef(null);

  // ---- Recherche automatique (debounced) ----
  useEffect(() => {
    const q = query.trim();

    // reset si trop court
    if (q.length < MIN_CHARS) {
      setResults([]);
      setError(null);
      controllerRef.current?.abort();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expirée. Veuillez vous reconnecter.");
      setResults([]);
      return;
    }

    // annule la requête précédente
    controllerRef.current?.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;

    setIsLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/Medecin/patients/search?q=${encodeURIComponent(q)}`,
          { headers: { Authorization: `Bearer ${token}` }, signal: ctrl.signal }
        );
        if (res.status === 401) throw new Error("Session expirée. Veuillez vous reconnecter.");
        if (!res.ok) throw new Error("Recherche indisponible");
        const data = await res.json();
        setResults(data);
        setError(null);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    // cleanup
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [query]);

  
  const handleSearch = (e) => {
    e.preventDefault();
    
  };


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
    const url = `${API_BASE_URL}/api/Medecin/patients/${p.id}/image`;

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
    width: 48,
    height: 48,
    objectFit: "cover",
    borderRadius: "50%",
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
    <div className="container py-4">
      <div className="mx-auto p-4 bg-white shadow-sm rounded-4" style={{ maxWidth: 720 }}>
        <h4 className="mb-3 fw-semibold text-center" style={{ color: "#0096c7" }}>
          <i className="bi bi-folder2-open me-2" style={{ color: "#0077b6" }}></i>
          Dossiers médicaux
        </h4>

        <form onSubmit={handleSearch}>
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-white">
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-search" style={{ color: "#0077b6" }}></i>
              )}
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nom, CIN, Téléphone ou Email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="d-flex gap-2 mt-3">
            <button className="btn px-4 rounded-pill text-white" style={{ background: "#0096c7" }}>
              Rechercher
            </button>
            <button
              type="button"
              className="btn px-4 rounded-pill"
              style={{ border: "1px solid #0096c7", color: "#0096c7", background: "#e8f6f9" }}
              onClick={() => { setQuery(""); setResults([]); setError(null); }}
              disabled={isLoading}
            >
              Effacer
            </button>
          </div>
        </form>

        <small className="text-muted mt-3 d-block">
          Astuce : un <span className="fw-semibold">CIN</span> ou <span className="fw-semibold">n° de téléphone</span> complet donne un match direct.
        </small>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {/* Résultats live */}
        {query.trim().length >= MIN_CHARS && results.length >= 1 && (
          <div className="mt-4">
            <div className="small text-muted mb-2">{results.length} patient(s) trouvé(s)</div>
            <ul className="list-group">
              {results.map((p) => (
                <li key={p.id} className="list-group-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <Avatar p={p} />
                    <div className="small">
                      <div className="fw-semibold">{p.nom} {p.prenom}</div>
                      <div className="text-muted">CIN: {p.cin} · Tél: {p.telephone} · {p.email}</div>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm rounded-pill text-white"
                    style={{ background: "#0096c7" }}
                    onClick={() => navigate(`/MedecinDash/dossierPatient/${p.id}`)}
                  >
                    Ouvrir
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Aucun résultat (seulement si saisie suffisante, pas en cours de chargement) */}
        {query.trim().length >= MIN_CHARS && results.length === 0 && !isLoading && !error && (
          <div className="alert alert-warning mt-3">Aucun patient trouvé.</div>
        )}
      </div>
    </div>
  );
}
