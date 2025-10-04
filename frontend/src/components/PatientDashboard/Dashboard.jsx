import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import "./Dashboard.css";

function Dashboard() {
  const [rendezVous, setRendezVous] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // --- Helpers date ---
  const parseRvDateTime = (rv) => {
    const raw = String(rv.dateRendezVous || rv.date || "").trim();
    const heureStr = String(rv.heure || "").trim(); // "HH:mm" éventuel
    if (!raw) return null;

    // Support "DD/MM/YYYY" ou "DD-MM-YYYY" (et "DD/MM/YYYY HH:mm")
    const [datePart, timeInline] = raw.split(" ");
    const time = timeInline || heureStr || "00:00";
    const parts = (datePart || "").split(/[-/]/);
    if (parts.length !== 3) return null;

    const [dd, mm, yyyy] = parts.map((x) => x.trim());
    const day = parseInt(dd, 10);
    const monthIndex = (parseInt(mm, 10) || 1) - 1;
    const year = parseInt(yyyy, 10);
    if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) return null;

    const [hh = "0", min = "0"] = time.split(":");
    const hour = parseInt(hh, 10) || 0;
    const minute = parseInt(min, 10) || 0;

    const d = new Date(year, monthIndex, day, hour, minute, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  };

  const medecinLabel = (rv) =>
    rv.medecinNom ||
    (rv.medecin &&
      `${rv.medecin?.prenom ?? ""} ${rv.medecin?.nom ?? ""}`.trim()) ||
    "N/A";

  //pour normaliser accents / casse
  const norm = (s = "") =>
    s
      .toString()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();


  // --- Effet: fetch RDV ---
  useEffect(() => {
    const fetchRDV = async () => {
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

        setRendezVous(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Erreur lors de la récupération des rendez‑vous");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRDV();
  }, [navigate]);

  // --- Séparations, comptages & prochain RDV ---
  const { upcomingSorted, pastSorted, nbrUpcoming, nbrAnnules, prochain } =
    useMemo(() => {
      const now = new Date();

      const withDate = rendezVous
        .map((rv) => ({ rv, d: parseRvDateTime(rv) }))
        .filter((x) => !!x.d);

      const upcoming = withDate
        .filter(({ d }) => d.getTime() >= now.getTime())
        .sort((a, b) => a.d - b.d);

      //rendez-vous avec status terminé
      const past = withDate
        .filter(
          ({ d, rv }) =>
            d.getTime() < now.getTime() &&
            String(rv.status || "").toLowerCase() === "terminé"
        )
        .sort((a, b) => b.d - a.d);

      const upcomingPlanned = withDate
        .filter(
          ({ d, rv }) =>
            d.getTime() > now.getTime() && norm(rv.status) === "planifie"
        )
        .sort((a, b) => a.d - b.d);

      // "Annulé" / "Refusé" → adapte au besoin côté backend (status)
      const nbrAnnules = rendezVous.reduce((acc, rv) => {
        const s = String(rv.status || "").toLowerCase();
        return acc + (s.includes("annulé") || s.includes("refus") ? 1 : 0);
      }, 0);

      // 2) Premier FUTUR avec status "Planifié"
      const prochain =
        upcoming.find(({ rv }) => norm(rv.status) === "planifie") || null;

      return {
        upcomingSorted: upcoming.map((x) => x.rv),
        pastSorted: past.map((x) => x.rv),
        nbrUpcoming: upcomingPlanned.length,
        nbrAnnules,
        prochain,
      };
    }, [rendezVous]);

  // --- Formatage prochain RDV pour le bandeau ---
  const prochainTxt = useMemo(() => {
    if (!prochain) return null;
    const d = parseRvDateTime(prochain.rv);
    if (!d) return null;

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    return {
      date: `${dd}/${mm}/${yyyy}`,
      heure: `${hh}:${min}`,
      medecin: medecinLabel(prochain.rv),
    };
  }, [prochain]);

  // --- Cards dynamiques ---
  const cards = [
    {
      title: "Mes Rendez-Vous",
      color: "primary",
      value: String(nbrUpcoming),
      text: nbrUpcoming > 0 ? "à venir" : "Aucun rendez-vous",
      icon: "bi-journal-medical",
      filter: "PatientDash/afficherRendezVous",
      buttonLabel: "Voir les RDV à venir",
    },
    {
      title: "Mes Rendez-Vous Passé",
      color: "primary",
      value: String(pastSorted.length),
      text:
        pastSorted.length > 0
          ? "rendez-vous passés"
          : "Aucun rendez-vous passé",
      icon: "bi-journal-medical",
      filter: "PatientDash/rendezVousPassé",
      buttonLabel: "Voir les RDV Passé",
    },
    {
      title: "Historique RDV",
      color: "primary",
      value: "",
      icon: "bi-clock-history",
      filter: "PatientDash/historiqueRendezVous",
      buttonLabel: "Voir l'historique",
    },
    {
      title: "RDV Annulés",
      color: "danger",
      value: String(nbrAnnules),
      text: "annulés",
      icon: "bi-x-circle",
      filter: "PatientDash/Rendez-VousAnnulé",
      buttonLabel: "Voir les annulés",
    },
    // {
    //   title: "Mes Documents",
    //   color: "primary",
    //   icon: "bi-folder2-open",
    //   filter: "PatientDash/MesDocuments",
    //   buttonLabel: "Voir Documents",
    // },
  ];

  const goToRdv = (filter) => {
    // envoie vers la page RDV avec un query param
    navigate(`/${filter}`);
  };

  return (
    <div className="dashboard-wrapper py-3 dash-sectio">
      {/* <div className="alert alert-info py-2 px-3 d-flex align-items-center mb-3 shadow-sm">
        <i className="bi bi-calendar2-check me-2"></i>
        <span className="small flex-grow-1">
          {isLoading ? (
            <>Chargement du prochain RDV…</>
          ) : prochainTxt ? (
            <>
              Prochain RDV : <strong>{prochainTxt.date}</strong> avec{" "}
              <strong>Dr {prochainTxt.medecin}</strong> à{" "}
              <strong>{prochainTxt.heure}</strong>
            </>
          ) : (
            <>Aucun rendez‑vous à venir</>
          )}
        </span>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => goToRdv("upcoming")}
        >
          Voir
        </button>
      </div> */}
      <div className="d-flex justify-content-center align-items-center ">
        <div className="alert alert-info d-flex align-items-center shadow-sm px-4 py-3 rounded w-75 text-center">
          <i className="bi bi-calendar2-check text-primary"></i>
          <span className="small flex-grow-1">
            {isLoading ? (
              <>Chargement du prochain RDV…</>
            ) : prochain ? (
              <>
                {/* formate à partir de prochain.rv */}
                {(() => {
                  const d = parseRvDateTime(prochain.rv);
                  if (!d) return <>Aucun rendez-vous planifié</>;
                  const dd = String(d.getDate()).padStart(2, "0");
                  const mm = String(d.getMonth() + 1).padStart(2, "0");
                  const yyyy = d.getFullYear();
                  const hh = String(d.getHours()).padStart(2, "0");
                  const min = String(d.getMinutes()).padStart(2, "0");
                  return (
                    <>
                      Prochain RDV : <strong>{`${dd}/${mm}/${yyyy}`}</strong>{" "}
                      avec <strong>Dr {medecinLabel(prochain.rv)}</strong> à{" "}
                      <strong>{`${hh}:${min}`}</strong>
                    </>
                  );
                })()}
              </>
            ) : (
              <>Aucun rendez-vous planifié</>
            )}
          </span>

        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2 px-3 mb-3">{error}</div>
      )}

      <div className="row g-3 mx-3 justify-content-center">
        {cards.map((c, i) => (
          <div key={i} className="col-sm-3 col-md-6">
            <div className="card h-100 border-0 shadow-sm compact-card">
              <div className="card-body p-3 text-center d-flex flex-column">
                <i className={`bi ${c.icon} text-${c.color} fs-4 mb-1`}></i>
                <h6 className={`fw-bold text-${c.color} mb-1`}>{c.title}</h6>
                {c.value !== "" && (
                  <div className={`fw-bold text-${c.color}`}>{c.value}</div>
                )}
                <p className="small text-muted mb-2">{c.text}</p>
                {"filter" in c && (
                  <button
                    className={`btn btn-sm btn-outline-${c.color} mt-auto`}
                    onClick={() => goToRdv(c.filter)}
                  >
                    {c.buttonLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
