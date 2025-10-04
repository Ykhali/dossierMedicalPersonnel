import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import "./rdv-cards.css";

function GetRendezVousPasse() {
  const [rendezVous, setRendezVous] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Mois FR abrégés
  const MONTHS_FR = [
    "janv",
    "févr",
    "mars",
    "avr",
    "mai",
    "juin",
    "juil",
    "août",
    "sept",
    "oct",
    "nov",
    "déc",
  ];

  // ---- helpers: construit un Date à partir d'un RV ----
  const parseRvDateTime = (rv) => {
    const raw = String(rv.dateRendezVous || rv.date || "").trim();
    const heureStr = String(rv.heure || "").trim(); // "HH:mm" (optionnel)
    if (!raw) return null;

    // Ex: "15/08/2025 16:30" → séparer proprement
    const [datePart, timeInline] = raw.split(" ");
    const time = timeInline || heureStr || "00:00";

    // Support "DD/MM/YYYY" ou "DD-MM-YYYY"
    const m = (datePart || "").split(/[-/]/);
    if (m.length !== 3) return null;
    let [dd, mm, yyyy] = m.map((x) => x.trim());

    const day = parseInt(dd, 10);
    const monthIndex = (parseInt(mm, 10) || 1) - 1; // 0..11
    const year = parseInt(yyyy, 10);
    if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) return null;

    // Heure
    const [hh = "0", min = "0"] = (time || "").split(":");
    const hour = parseInt(hh, 10) || 0;
    const minute = parseInt(min, 10) || 0;

    const d = new Date(year, monthIndex, day, hour, minute, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  };

  // Comparateur de tri décroissant (du plus récent au plus ancien)
  const byDateDesc = (a, b) => {
    const da = parseRvDateTime(a);
    const db = parseRvDateTime(b);
    if (!da && !db) return 0;
    if (!da) return 1; // sans date → en bas
    if (!db) return -1;
    return db - da; // récent d'abord
  };

  // Formatage pour l'affichage dans la carte
  const fmtParts = (rv) => {
    const rawDate = (rv.dateRendezVous || rv.date || "").trim();
    const heure = (rv.heure || "").trim();

    if (!rawDate) return { month: "--", day: "--", time: heure || "--" };

    const [datePart, timeInline] = rawDate.split(" ");
    const [dd, mm] = (datePart || "").split(/[-/]/); // accepte "/" ou "-"
    const monthIndex = (parseInt(mm, 10) || 1) - 1;
    const month = MONTHS_FR[monthIndex] || "--";
    const day = String(dd || "").padStart(2, "0");
    const time = timeInline || heure || "--";
    return { month, day, time };
  };

  // Couleurs de badge selon le statut
  const statusBadge = (status) => {
    if (!status) return "bg-secondary";
    const s = String(status).toLowerCase();
    if (s.includes("confirm")) return "bg-success";
    if (s.includes("annul") || s.includes("refus")) return "bg-danger";
    if (s.includes("attente") || s.includes("pending"))
      return "bg-warning text-dark";
    return "bg-secondary";
  };

  // Affichage du nom de médecin
  const medecinLabel = (rv) =>
    rv.medecinNom ||
    (rv.medecin &&
      `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
    "N/A";

  // Charger + filtrer (passés) + trier (décroissant) les rendez-vous
  useEffect(() => {
    const fetchRendezVous = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/Patient/rendezvous`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Erreur API");
        const data = await res.json();

        const now = new Date();

        // 👉 garder uniquement les RDV PASSÉS puis trier du plus récent au plus ancien
        const past = data
          .filter((rv) => String(rv.status).toLowerCase() === "terminé")
          .sort(byDateDesc);

        setRendezVous(past);
      } catch (e) {
        setError(e.message || "Erreur lors de la récupération des rendez-vous");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRendezVous();
  }, [navigate]);

  return (
    <div className="container py-3">
      {/* Bloc global : en-tête + liste des cartes */}
      <div className="rdv-list border rounded-4 shadow-sm overflow-hidden card-rv">
        {/* En-tête du bloc */}
        <div className="rdv-list-header px-3 py-2">
          <h5 className="m-0 fw-semibold text-medical">
            Mes Rendez-Vous passés
          </h5>
        </div>

        {/* Contenu */}
        <div className="p-3">
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          {isLoading ? (
            <div className="text-center py-4">Chargement…</div>
          ) : rendezVous.length === 0 ? (
            <div className="text-center text-muted py-4">
              Aucun rendez-vous passé
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {rendezVous.map((rv) => {
                const { month, day, time } = fmtParts(rv);
                return (
                  <div
                    key={rv.id}
                    className="rdv-card border rounded-3 p-3 d-flex flex-column flex-sm-row align-items-stretch"
                  >
                    {/* Bloc date */}
                    <div className="rdv-datebox me-md-3 mb-3 mb-md-0 d-flex flex-column justify-content-center align-items-center mr-3">
                      <div className="rdv-month">{month}</div>
                      <div className="rdv-day">{day}</div>
                      <div className="rdv-time">{time}</div>
                    </div>

                    {/* Infos RDV */}
                    <div className="flex-fill d-flex flex-column justify-content-center">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        <span className="badge bg-medical-soft text-medical fw-medium">
                          Rendez-vous
                        </span>
                        <span className={`badge ${statusBadge(rv.status)}`}>
                          {rv.status || "—"}
                        </span>
                      </div>

                      <div className="fw-semibold">
                        Motif :{" "}
                        <span className="text-body">{rv.motif || "—"}</span>
                      </div>
                      <div className="text-muted">Dr {medecinLabel(rv)}</div>
                    </div>

                    {/* Actions (si tu veux les masquer pour le passé, tu peux) */}
                    {/* <div className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
                      <button className="btn btn-outline-medical btn-sm">
                        Détails
                      </button>
                      <button className="btn btn-outline-danger btn-sm">
                        Supprimer
                      </button>
                    </div> */}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetRendezVousPasse;
