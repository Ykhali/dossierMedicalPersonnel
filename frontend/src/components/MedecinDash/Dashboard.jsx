// src/pages/MedecinDashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig"; // <— adapte le chemin
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Helpers auth — adapte si tu as déjà ces utilitaires
const getToken = () => localStorage.getItem("token");
const isTokenValid = (t) => !!t; // remplace par ta vraie validation si besoin

const avatarUrl = (fullName = "Dr") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName
  )}&background=0D8ABC&color=fff`;

// Parse "DD/MM/YYYY" + "HH:mm" OR ISO strings; renvoie Date ou null
const parseDate = (dateStr, timeStr) => {
  if (!dateStr) return null;

  // ISO direct
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    try {
      return new Date(timeStr ? `${dateStr}T${timeStr}` : dateStr);
    } catch {
      return null;
    }
  }

  // DD/MM/YYYY
  const m = String(dateStr).match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
  if (!m) return null;
  const [_, dd, mm, yyyy] = m;
  const [hh = "00", min = "00"] = (timeStr || "00:00").split(":");
  const d = new Date(
    parseInt(yyyy, 10),
    parseInt(mm, 10) - 1,
    parseInt(dd, 10),
    parseInt(hh, 10),
    parseInt(min, 10)
  );
  return isNaN(d.getTime()) ? null : d;
};

const DashboardCard = ({ icon, label, value, loading }) => (
  <div className="col-12 col-sm-6 col-lg-6">
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{
            width: 46,
            height: 46,
            background: "#e8f5ff",
            border: "1px solid #d7ecff",
          }}
        >
          <i className={`bi ${icon} fs-5 text-primary`} />
        </div>
        <div className="flex-grow-1">
          <div className="text-muted small">{label}</div>
          <div className="fs-4 fw-semibold">
            {loading ? (
              <span
                className="placeholder col-6 d-inline-block"
                style={{ height: 22, borderRadius: 8 }}
              />
            ) : (
              value
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();

  // Header doctor info
  const [doc, setDoc] = useState({ nom: "", prenom: "", specialite: "" });
  const [fullName, setFullName] = useState("");
  const [loadingHeader, setLoadingHeader] = useState(true);

  // KPIs
  const [countToday, setCountToday] = useState(0);
  const [countUpcoming, setCountUpcoming] = useState(0);
  const [patientsCount, setPatientsCount] = useState(null);
  const [unreadCount, setUnreadCount] = useState(null);
  const [loadingKpis, setLoadingKpis] = useState(true);

  // Next appointments combined
  const [nextAppointments, setNextAppointments] = useState([]);
  const [loadingNext, setLoadingNext] = useState(true);

  const token = getToken();

  // 1) Fetch basic header info
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        if (!token || !isTokenValid(token)) {
          navigate("/login", { replace: true });
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/Medecin/basic-info`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDoc({
          nom: data.nom ?? "",
          prenom: data.prenom ?? "",
          specialite: data.specialite ?? "",
        });
        setFullName(`${data.prenom ?? ""} ${data.nom ?? ""}`.trim());
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoadingHeader(false);
      }
    })();

    return () => controller.abort();
  }, [token, navigate]);

  // 2) Fetch KPIs + Next Appointments
  const dedupe = useCallback((arr) => {
    return Array.from(
      new Map(
        arr.map((rv) => {
          const key =
            rv.id ??
            `${rv.dateRendezVous || rv.date}-${rv.heure || ""}-${
              rv.patient?.id ?? rv.patientNom ?? rv.patientFullName ?? ""
            }`;
          return [key, rv];
        })
      ).values()
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const headers = { Authorization: `Bearer ${token}` };

    (async () => {
      try {
        if (!token || !isTokenValid(token)) return;

        // RDV auj/avenir (pour KPIs + liste)
        const [rToday, rUpcoming] = await Promise.all([
          fetch(`${API_BASE_URL}/api/Medecin/rendezVous/aujourdhui`, {
            headers,
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/Medecin/rendezVous/avenir`, {
            headers,
            signal: controller.signal,
          }),
        ]);

        const todayList = rToday.ok ? await rToday.json() : [];
        const upcomingList = rUpcoming.ok ? await rUpcoming.json() : [];

        const uniqToday = dedupe(todayList);
        const uniqUpcoming = dedupe(upcomingList);

        setCountToday(uniqToday.length);
        setCountUpcoming(uniqUpcoming.length);

        // Fusionne et prends les 3 plus proches
        const merged = [...uniqToday, ...uniqUpcoming]
          .map((rv) => {
            const date = parseDate(rv.dateRendezVous || rv.date, rv.heure);
            return { ...rv, _dt: date };
          })
          .filter((rv) => rv._dt)
          .sort((a, b) => a._dt - b._dt)
          .slice(0, 3);

        setNextAppointments(merged);

        // autres KPIs (si tu as les endpoints, décommente)
        // const rPatients = await fetch(`${API_BASE_URL}/api/Medecin/patients/count`, { headers, signal: controller.signal });
        // const rUnread = await fetch(`${API_BASE_URL}/api/messages/unread/count`, { headers, signal: controller.signal });
        // setPatientsCount(rPatients.ok ? await rPatients.json() : null);
        // setUnreadCount(rUnread.ok ? await rUnread.json() : null);
        setPatientsCount(null);
        setUnreadCount(null);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoadingKpis(false);
        setLoadingNext(false);
      }
    })();

    return () => controller.abort();
  }, [token, dedupe]);

  const headerRight = useMemo(
    () => (
      <div className="d-none d-sm-flex align-items-center gap-2">
        <img
          src={avatarUrl(fullName || "Dr")}
          className="rounded-circle"
          alt="Avatar"
          style={{ width: 36, height: 36 }}
          onError={(e) => (e.currentTarget.src = avatarUrl("Dr"))}
        />
        <div className="small">
          <div className="fw-semibold">
            {loadingHeader ? (
              <span
                className="placeholder col-6 d-inline-block"
                style={{ height: 16, borderRadius: 6 }}
              />
            ) : fullName ? (
              `Dr. ${fullName}`
            ) : (
              "Dr."
            )}
          </div>
          <div className="text-muted">
            {loadingHeader ? (
              <span
                className="placeholder col-8 d-inline-block"
                style={{ height: 14, borderRadius: 6 }}
              />
            ) : (
              doc.specialite || "—"
            )}
          </div>
        </div>
      </div>
    ),
    [fullName, doc.specialite, loadingHeader]
  );

  return (
    <div className="container-fluid py-3">
      

      {/* KPI Cards */}
      <div className="row g-3 mb-3">
        {/* <DashboardCard
          icon="bi-people"
          label="Patients suivis"
          value={patientsCount ?? "—"}
          loading={loadingKpis}
        /> */}
        <DashboardCard
          icon="bi-calendar2-check"
          label="RDV aujourd'hui"
          value={countToday}
          loading={loadingKpis}
        />
        <DashboardCard
          icon="bi-calendar-week"
          label="RDV à venir"
          value={countUpcoming}
          loading={loadingKpis}
        />
        {/* <DashboardCard
          icon="bi-chat-dots"
          label="Messages non lus"
          value={unreadCount ?? "—"}
          loading={loadingKpis}
        /> */}
      </div>

      <div className="row g-3">
        {/* Next Appointments */}
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h6 className="m-0">Prochains rendez-vous</h6>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate("/MedecinDash/rv-avenir")}
              >
                Voir tout
              </button>
            </div>
            <div className="card-body">
              {loadingNext ? (
                <>
                  <div className="placeholder-glow mb-2">
                    <span className="placeholder col-12" />
                  </div>
                  <div className="placeholder-glow mb-2">
                    <span className="placeholder col-10" />
                  </div>
                  <div className="placeholder-glow">
                    <span className="placeholder col-8" />
                  </div>
                </>
              ) : nextAppointments.length === 0 ? (
                <div className="text-muted">Aucun rendez-vous à venir.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {nextAppointments.map((rv, idx) => (
                    <li key={idx} className="list-group-item px-0">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                            style={{ width: 36, height: 36 }}
                          >
                            <i className="bi bi-person text-secondary" />
                          </div>
                          <div>
                            <div className="fw-semibold">
                              {rv.patient?.fullName ||
                                rv.patientFullName ||
                                rv.patientNom ||
                                "Patient"}
                            </div>
                            <div className="text-muted small">
                              {rv.motif || rv.objet || "Consultation"}
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="badge bg-primary-subtle text-primary border border-primary-subtle">
                            {(rv.dateRendezVous || rv.date) ?? ""}{" "}
                            {rv.heure ?? ""}
                          </div>
                          {rv.isTeleconsult || rv.teleconsultation ? (
                            <div className="small text-success mt-1">
                              <i className="bi bi-camera-video me-1" />
                              Téléconsultation
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Notifications + Actions */}
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm rounded-4 mb-3">
            <div className="card-header bg-white border-0">
              <h6 className="m-0">Notifications récentes</h6>
            </div>
            <div className="card-body">
              {/* branche ici tes vraies notifs */}
              <div className="d-flex align-items-start gap-2 mb-2">
                <i className="bi bi-bell text-primary mt-1" />
                <div>
                  <div className="fw-semibold">Aucune notification</div>
                  <div className="text-muted small">
                    Tout est calme pour l’instant.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0">
              <h6 className="m-0">Actions rapides</h6>
            </div>
            <div className="card-body d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/MedecinDash/rv-auj")}
              >
                <i className="bi bi-calendar2-check me-1" /> Rendez-vous
                d’aujourd’hui
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/MedecinDash/rv-avenir")}
              >
                <i className="bi bi-calendar-week me-1" /> À venir
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/MedecinDash/dossiers")}
              >
                <i className="bi bi-folder2-open me-1" /> Dossiers
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/MedecinDash/profil")}
              >
                <i className="bi bi-person-gear me-1" /> Profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
