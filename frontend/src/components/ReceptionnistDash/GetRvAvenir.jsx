// src/components/GetAllRendezVous/GetRendezVousToday.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import "../../components/GetAllRendezVous/rdv-cards-today.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Dropdown } from "bootstrap"; // utilisé pour piloter l’ouverture/fermeture

import CreateRv from "../CreateRendezVous/CreateRv";

function GetRendezVousToday() {
  const [rendezVous, setRendezVous] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const navigate = useNavigate();

  const mois = [
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

  // ---- helpers date/heure ----
  const parseRvDateTime = (rv) => {
    const raw = String(rv.dateRendezVous || rv.date || "").trim();
    const heureStr = String(rv.heure || "").trim();
    if (!raw) return null;

    const [datePart, timeInline] = raw.split(" ");
    const time = (timeInline || heureStr || "00:00").trim();

    const parts = (datePart || "").split(/[-/]/);
    if (parts.length !== 3) return null;
    let [dd, mm, yyyy] = parts.map((x) => x.trim());

    const day = parseInt(dd, 10);
    const monthIndex = parseInt(mm, 10) - 1;
    const year = parseInt(yyyy, 10);
    if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) return null;

    const [hh = "0", min = "0"] = time.split(":");
    const hour = parseInt(hh, 10) || 0;
    const minute = parseInt(min, 10) || 0;

    const d = new Date(year, monthIndex, day, hour, minute, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  };

  const fmtParts = (rv) => {
    const rawDate = String(rv.dateRendezVous || rv.date || "").trim();
    const heure = String(rv.heure || "").trim();
    if (!rawDate)
      return { month: "--", day: "--", year: "----", time: heure || "--" };

    const [datePart, timeInline] = rawDate.split(" ");
    const [dd, mm, yyyy] = (datePart || "").split(/[-/]/);
    const monthIndex = (parseInt(mm, 10) || 1) - 1;

    return {
      month: mois[monthIndex] || "--",
      day: String(dd || "").padStart(2, "0"),
      year: yyyy || "----",
      time: (timeInline || heure || "--").trim(),
    };
  };

  const statusBadge = (status) => {
    if (!status) return "bg-secondary";
    const s = String(status).toLowerCase();
    if (s.includes("confirm") || s.includes("termin")) return "bg-success";
    if (s.includes("annul") || s.includes("refus")) return "bg-danger";
    if (
      s.includes("attente") ||
      s.includes("pending") ||
      s.includes("en_attente")
    )
      return "bg-warning text-dark";
    if (s.includes("planifi")) return "bg-primary";
    if (s.includes("no_show") || s.includes("non_honor")) return "bg-dark";
    return "bg-secondary";
  };

  const medecinLabel = (rv) =>
    rv.medecinNom ||
    (rv.medecin &&
      `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
    "N/A";
  const patientLabel = (rv) =>
    rv.patientNom ||
    rv.patientFullName ||
    (rv.patient &&
      `${rv.patient.prenom ?? ""} ${rv.patient.nom ?? ""}`.trim()) ||
    "N/A";

  // ---- fetch + filtrage >= now + tri ----
  const fetchRendezVous = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/receptionniste/rendezVous/avenir`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();

      const now = new Date();
      const upcoming = data
        .map((rv) => ({ rv, d: parseRvDateTime(rv) }))
        .filter((x) => x.d && x.d.getTime() >= now.getTime())
        .sort((a, b) => a.d - b.d)
        .map((x) => x.rv);

      setRendezVous(upcoming);
    } catch (e) {
      setError(e.message || "Erreur lors de la récupération des rendez-vous");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRendezVous();
  }, [fetchRendezVous]);

  // ---- Statuts côté réception ----
  const STATUS_OPTIONS = [
    { value: "Planifié", label: "Planifié", badge: "bg-primary text-light" },
    { value: "Annulé", label: "Annulé", badge: "bg-danger" },
    { value: "En_attente", label: "En attente", badge: "bg-warning text-dark" },
    { value: "Non_honoré", label: "Non honoré", badge: "bg-secondary" },
  ];

  // ---- Toggle dropdown (pilotage JS) ----
  const toggleDropdown = (id) => (e) => {
    e.preventDefault();
    const btn = document.getElementById(id);
    if (!btn) return;
    Dropdown.getOrCreateInstance(btn).toggle();
  };

  // ---- Changement de statut + fermeture du menu ----
  const handleChangeStatus = async (id, newStatus, toggleId) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      setUpdatingId(id);
      const res = await fetch(
        `${API_BASE_URL}/api/receptionniste/rendezVous/${id}/changerStatus`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newStatus }),
        }
      );
      if (!res.ok) throw new Error("Échec changement de statut");

      setRendezVous((list) =>
        list.map((rv) => (rv.id === id ? { ...rv, status: newStatus } : rv))
      );
    } catch (e) {
      setError(e.message || "Erreur lors du changement de statut");
    } finally {
      setUpdatingId(null);
      // fermer proprement le dropdown
      const btn = document.getElementById(toggleId);
      if (btn) {
        const dd = Dropdown.getInstance(btn);
        dd && dd.hide();
      }
    }
  };

  return (
    <div className="container py-3">
      <div className="rdv-list border rounded-4 shadow-sm card-rv">
        <div className="rdv-list-header px-3 py-2">
          <h5 className="m-0 fw-semibold text-secondary">
            Les rendez-vous à venir
          </h5>
        </div>

        <div className="p-3">
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          {isLoading ? (
            <div className="text-center py-4">Chargement…</div>
          ) : rendezVous.length === 0 ? (
            <div className="text-center text-muted py-4">
              Aucun rendez-vous aujourd'hui
            </div>
          ) : (
            <div /*className="rdv-scroll"*/>
              <div className="d-flex flex-column gap-3">
                {rendezVous.map((rv, idx) => {
                  const { month, day, year, time } = fmtParts(rv);
                  const toggleId = `statusToggle-rec-${rv.id ?? idx}`;
                  return (
                    <div
                      key={rv.id ?? `${rv.date}-${rv.heure}-${idx}`}
                      className="rdv-card border rounded-3 p-3 d-flex flex-column flex-md-row align-items-stretch"
                    >
                      {/* Date */}
                      <div className="rdv-datebox me-md-3 mb-3 mb-md-0 d-flex flex-column justify-content-center align-items-center">
                        <div className="rdv-month">{month}</div>
                        <div className="rdv-day">
                          {day} <small className="text-muted">{year}</small>
                        </div>
                        <div className="rdv-time">{time}</div>
                      </div>

                      {/* Infos */}
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
                        <div className="text-muted small">
                          <i className="bi bi-person me-1" />
                          <strong>Patient :</strong>{" "}
                          {patientLabel(rv)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
                        <div className="dropdown position-static">
                          <button
                            id={toggleId}
                            className="btn btn-outline-medical btn-sm dropdown-toggle"
                            type="button"
                            aria-expanded="false"
                            onClick={toggleDropdown(toggleId)}
                            disabled={updatingId === rv.id}
                          >
                            {updatingId === rv.id
                              ? "Mise à jour..."
                              : "Modifier statut"}
                          </button>

                          <ul className="dropdown-menu dropdown-menu-end">
                            {STATUS_OPTIONS.map((opt) => {
                              const isCurrent = rv.status === opt.value;
                              return (
                                <li key={opt.value}>
                                  <button
                                    className="dropdown-item d-flex align-items-center gap-2"
                                    onClick={() =>
                                      handleChangeStatus(
                                        rv.id,
                                        opt.value,
                                        toggleId
                                      )
                                    }
                                    disabled={isCurrent || updatingId === rv.id}
                                  >
                                    {isCurrent ? (
                                      <i className="bi bi-check2" />
                                    ) : (
                                      <i className="bi bi-circle" />
                                    )}
                                    <span>{opt.label}</span>
                                    <span
                                      className={`badge ms-auto ${opt.badge}`}
                                    >
                                      {opt.label}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bouton Ajouter */}
        <div className="rdv-list-footer text-center border-top p-3">
          <button
            className="btn btn-outline-secondary fw-semibold"
            onClick={() => setShowCreate(true)}
          >
            <i className="bi bi-plus-circle me-1"></i> Ajouter RendezVous
          </button>
        </div>
      </div>

      {/* Modal création */}
      {showCreate && (
        <CreateRv
          show={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            fetchRendezVous(); // refresh de la liste
          }}
        />
      )}
    </div>
  );
}

export default GetRendezVousToday;
