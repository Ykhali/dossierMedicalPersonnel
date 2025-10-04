import React, { useEffect, useMemo, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";
import "bootstrap-icons/font/bootstrap-icons.css";

// ➜ Ajoute ces constantes/helpers en haut du fichier (après tes imports)
const DAY_LABEL = { 1:"Lundi", 2:"Mardi", 3:"Mercredi", 4:"Jeudi", 5:"Vendredi", 6:"Samedi", 7:"Dimanche" };
const DOW_MAP   = { MONDAY:1, TUESDAY:2, WEDNESDAY:3, THURSDAY:4, FRIDAY:5, SATURDAY:6, SUNDAY:7 };

const toMin = (hhmm) => {
  if (!hhmm) return null;
  const [h,m="0"] = String(hhmm).split(":");
  const H = parseInt(h,10), M = parseInt(m,10)||0;
  return isNaN(H) ? null : H*60+M;
};
const toHHMM = (min) => {
  const h = Math.floor(min/60), m = min%60;
  const pad = (n)=> (n<10? "0"+n : ""+n);
  return `${pad(h)}:${pad(m)}`;
};
// fusionne  [start,end] qui se chevauchent
const mergeRanges = (items, getStart, getEnd) => {
  const arr = items
    .map(x => ({ s: toMin(getStart(x)), e: toMin(getEnd(x)) }))
    .filter(x => x.s!=null && x.e!=null && x.e>x.s)
    .sort((a,b)=>a.s-b.s);
  const out=[];
  for (const r of arr) {
    if (!out.length || r.s>out[out.length-1].e) out.push({...r});
    else out[out.length-1].e = Math.max(out[out.length-1].e, r.e);
  }
  return out.map(x => ({ start: toHHMM(x.s), end: toHHMM(x.e) }));
};

const DAYS = [
  { value: "MONDAY", label: "Lundi" },
  { value: "TUESDAY", label: "Mardi" },
  { value: "WEDNESDAY", label: "Mercredi" },
  { value: "THURSDAY", label: "Jeudi" },
  { value: "FRIDAY", label: "Vendredi" },
  { value: "SATURDAY", label: "Samedi" },
  { value: "SUNDAY", label: "Dimanche" },
];

const pad = (n) => (n < 10 ? "0" + n : "" + n);
const fmtTime = (t = "") => t; // backend renvoie "HH:mm" déjà propre
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export default function MesHorairesAbsences() {
  const [horaires, setHoraires] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // Forms
  const [hType, setHType] = useState("hebdo"); // 'hebdo' | 'date'
  const [hDay, setHDay] = useState("MONDAY");
  const [hDate, setHDate] = useState(""); // YYYY-MM-DD
  const [hStart, setHStart] = useState("09:00");
  const [hEnd, setHEnd] = useState("12:00");

  const [aDate, setADate] = useState(""); // YYYY-MM-DD
  const [aAllDay, setAAllDay] = useState(true);
  const [aStart, setAStart] = useState("09:00");
  const [aEnd, setAEnd] = useState("12:00");

  const token = localStorage.getItem("token");
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchAll = async () => {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const [rh, ra] = await Promise.all([
        fetch(`${API_BASE_URL}/api/Medecin/horaires`, { headers }),
        fetch(`${API_BASE_URL}/api/Medecin/absences`, { headers }),
      ]);
      const [hor, abs] = await Promise.all([
        rh.ok ? rh.json() : Promise.reject("Err horaires"),
        ra.ok ? ra.json() : Promise.reject("Err absences"),
      ]);
      setHoraires(hor || []);
      setAbsences(abs || []);
    } catch (e) {
      setErr("Erreur de chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll(); /* au montage */
  }, []); // eslint-disable-line

  // Groupes horaires
  const hebdo = horaires.filter((h) => !!h.dayOfWeek);
  const spec = horaires.filter((h) => !!h.dateSpecific);

  const labelDay = (v) => DAYS.find((d) => d.value === v)?.label || v;

  // Actions
  const addHoraire = async (e) => {
    e.preventDefault();
    if (!token) return;

    const body =
      hType === "hebdo"
        ? { dayOfWeek: hDay, start: hStart, end: hEnd }
        : { dateSpecific: hDate, start: hStart, end: hEnd };

    try {
      const res = await fetch(`${API_BASE_URL}/api/Medecin/horaires`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      await fetchAll();
      // reset minimal
      if (hType === "date") setHDate("");
    } catch {
      alert("Erreur lors de la création de l’horaire.");
    }
  };

  const deleteHoraire = async (id) => {
    if (!token) return;
    if (!window.confirm("Supprimer cet horaire ?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/Medecin/horaires/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok && res.status !== 204) throw new Error();
      setHoraires((list) => list.filter((h) => h.id !== id));
    } catch {
      alert("Erreur lors de la suppression de l’horaire.");
    }
  };

  const addAbsence = async (e) => {
    e.preventDefault();
    if (!token) return;

    const body = aAllDay
      ? { date: aDate }
      : { date: aDate, start: aStart, end: aEnd };

    try {
      const res = await fetch(`${API_BASE_URL}/api/Medecin/absences`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      await fetchAll();
      setADate("");
    } catch {
      alert("Erreur lors de la création de l’absence.");
    }
  };

  const deleteAbsence = async (id) => {
    if (!token) return;
    if (!window.confirm("Supprimer cette absence ?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/Medecin/absences/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok && res.status !== 204) throw new Error();
      setAbsences((list) => list.filter((a) => a.id !== id));
    } catch {
      alert("Erreur lors de la suppression de l’absence.");
    }
  };

  return (
    <div className="container py-3">
      <div className="row g-4">
        {/* HORAIRES */}
        <div className="col-12 col-lg-7">
          <div className="border rounded-4 shadow-sm">
            <div className="px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
              <h5 className="m-0 fw-semibold text-secondary">
                Mes horaires de travail
              </h5>
            </div>

            <div className="p-3">
              {loading && <div className="text-muted">Chargement…</div>}
              {err && <div className="alert alert-danger">{err}</div>}

              <div className="row g-3">
                {/* Hebdo */}
                <div className="col-12 col-md-6">
                  <h6 className="text-medical">Récurrents (hebdo)</h6>
                  {hebdo.length === 0 ? (
                    <div className="text-muted small">
                      Aucun horaire hebdomadaire.
                    </div>
                  ) : (
                    <ul className="list-group">
                      {hebdo
                        .sort((a, b) =>
                          a.heureDebut.localeCompare(b.heureDebut)
                        )
                        .map((h) => (
                          <li
                            key={h.id}
                            className="list-group-item d-flex align-items-center justify-content-between"
                          >
                            <div>
                              <div className="fw-semibold">
                                {labelDay(h.dayOfWeek)}
                              </div>
                              <div className="small text-muted">
                                {fmtTime(h.heureDebut)} — {fmtTime(h.heureFin)}
                              </div>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteHoraire(h.id)}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                {/* Spécifiques */}
                <div className="col-12 col-md-6">
                  <h6 className="text-medical">Spécifiques (par date)</h6>
                  {spec.length === 0 ? (
                    <div className="text-muted small">
                      Aucune règle spécifique.
                    </div>
                  ) : (
                    <ul className="list-group">
                      {spec
                        .sort((a, b) =>
                          String(a.dateSpecific).localeCompare(
                            String(b.dateSpecific)
                          )
                        )
                        .map((h) => (
                          <li
                            key={h.id}
                            className="list-group-item d-flex align-items-center justify-content-between"
                          >
                            <div>
                              <div className="fw-semibold">
                                {fmtDate(h.dateSpecific)}
                              </div>
                              <div className="small text-muted">
                                {fmtTime(h.heureDebut)} — {fmtTime(h.heureFin)}
                              </div>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteHoraire(h.id)}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Form créer horaire */}
              <hr className="my-4" />
              <form onSubmit={addHoraire} className="row g-3">
                <div className="col-12 col-md-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={hType}
                    onChange={(e) => setHType(e.target.value)}
                  >
                    <option value="hebdo">Hebdomadaire</option>
                    <option value="date">Spécifique (date)</option>
                  </select>
                </div>

                {hType === "hebdo" ? (
                  <div className="col-12 col-md-3">
                    <label className="form-label">Jour</label>
                    <select
                      className="form-select"
                      value={hDay}
                      onChange={(e) => setHDay(e.target.value)}
                    >
                      {DAYS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="col-12 col-md-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={hDate}
                      onChange={(e) => setHDate(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="col-6 col-md-3">
                  <label className="form-label">Début</label>
                  <input
                    type="time"
                    className="form-control"
                    value={hStart}
                    onChange={(e) => setHStart(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label">Fin</label>
                  <input
                    type="time"
                    className="form-control"
                    value={hEnd}
                    onChange={(e) => setHEnd(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <button className="btn btn-medical">Ajouter l’horaire</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ABSENCES */}
        <div className="col-12 col-lg-5">
          <div className="border rounded-4 shadow-sm h-100">
            <div className="px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
              <h5 className="m-0 fw-semibold text-secondary">Mes absences</h5>
            </div>

            <div className="p-3">
              {loading && <div className="text-muted">Chargement…</div>}

              {absences.length === 0 ? (
                <div className="text-muted small">Aucune absence déclarée.</div>
              ) : (
                <ul className="list-group">
                  {absences
                    .sort((a, b) =>
                      String(a.date).localeCompare(String(b.date))
                    )
                    .map((a) => (
                      <li
                        key={a.id}
                        className="list-group-item d-flex align-items-center justify-content-between"
                      >
                        <div>
                          <div className="fw-semibold">{fmtDate(a.date)}</div>
                          <div className="small text-muted">
                            {a.startTime || a.endTime
                              ? `${fmtTime(a.startTime || "00:00")} — ${fmtTime(
                                  a.endTime || "23:59"
                                )}`
                              : "Journée entière"}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteAbsence(a.id)}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </li>
                    ))}
                </ul>
              )}

              {/* Form créer absence */}
              <hr className="my-4" />
              <form onSubmit={addAbsence} className="row g-3">
                <div className="col-12">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={aDate}
                    onChange={(e) => setADate(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      id="allDay"
                      className="form-check-input"
                      type="checkbox"
                      checked={aAllDay}
                      onChange={(e) => setAAllDay(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="allDay">
                      Journée entière
                    </label>
                  </div>
                </div>

                {!aAllDay && (
                  <>
                    <div className="col-6">
                      <label className="form-label">Début</label>
                      <input
                        type="time"
                        className="form-control"
                        value={aStart}
                        onChange={(e) => setAStart(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Fin</label>
                      <input
                        type="time"
                        className="form-control"
                        value={aEnd}
                        onChange={(e) => setAEnd(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="col-12">
                  <button className="btn btn-outline-medical">
                    Ajouter une absence
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




// import React, { useEffect, useMemo, useState } from "react";
// import API_BASE_URL from "../../config/apiConfig";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "bootstrap-icons/font/bootstrap-icons.css";

// const DAYS = [
//   { value: "MONDAY", label: "Lundi" },
//   { value: "TUESDAY", label: "Mardi" },
//   { value: "WEDNESDAY", label: "Mercredi" },
//   { value: "THURSDAY", label: "Jeudi" },
//   { value: "FRIDAY", label: "Vendredi" },
//   { value: "SATURDAY", label: "Samedi" },
//   { value: "SUNDAY", label: "Dimanche" },
// ];

// // ➜ labels/jours pour l'affichage 1..7
// const DAY_LABEL = {
//   1: "Lundi",
//   2: "Mardi",
//   3: "Mercredi",
//   4: "Jeudi",
//   5: "Vendredi",
//   6: "Samedi",
//   7: "Dimanche",
// };
// // ➜ map des valeurs texte venant du back vers 1..7
// const DOW_MAP = {
//   MONDAY: 1,
//   TUESDAY: 2,
//   WEDNESDAY: 3,
//   THURSDAY: 4,
//   FRIDAY: 5,
//   SATURDAY: 6,
//   SUNDAY: 7,
// };

// const pad = (n) => (n < 10 ? "0" + n : "" + n);
// const fmtTime = (t = "") => t; // backend renvoie "HH:mm" déjà propre
// const fmtDate = (iso) => {
//   if (!iso) return "—";
//   const d = new Date(iso + "T00:00:00");
//   if (isNaN(d.getTime())) return iso;
//   return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
// };

// // Helpers pour fusionner des créneaux
// const toMin = (hhmm) => {
//   if (!hhmm) return null;
//   const [h, m = "0"] = String(hhmm).split(":");
//   const H = parseInt(h, 10);
//   const M = parseInt(m, 10) || 0;
//   return isNaN(H) ? null : H * 60 + M;
// };
// const toHHMM = (minutes) => {
//   const H = Math.floor(minutes / 60);
//   const M = minutes % 60;
//   return `${pad(H)}:${pad(M)}`;
// };
// // Fusionne les créneaux qui se chevauchent/se touchent
// const mergeRanges = (items, getStart, getEnd) => {
//   const arr = items
//     .map((x) => ({ s: toMin(getStart(x)), e: toMin(getEnd(x)) }))
//     .filter((x) => x.s != null && x.e != null && x.e > x.s)
//     .sort((a, b) => a.s - b.s);

//   const out = [];
//   for (const r of arr) {
//     if (!out.length || r.s > out[out.length - 1].e) out.push({ ...r });
//     else out[out.length - 1].e = Math.max(out[out.length - 1].e, r.e);
//   }
//   return out.map((x) => ({ start: toHHMM(x.s), end: toHHMM(x.e) }));
// };

// export default function MesHorairesAbsences() {
//   const [horaires, setHoraires] = useState([]);
//   const [absences, setAbsences] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState(null);

//   // Forms
//   const [hType, setHType] = useState("hebdo"); // 'hebdo' | 'date'
//   const [hDay, setHDay] = useState("MONDAY");
//   const [hDate, setHDate] = useState(""); // YYYY-MM-DD
//   const [hStart, setHStart] = useState("09:00");
//   const [hEnd, setHEnd] = useState("12:00");

//   const [aDate, setADate] = useState(""); // YYYY-MM-DD
//   const [aAllDay, setAAllDay] = useState(true);
//   const [aStart, setAStart] = useState("09:00");
//   const [aEnd, setAEnd] = useState("12:00");

//   const token = localStorage.getItem("token");
//   const headers = useMemo(
//     () => ({
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     }),
//     [token]
//   );

//   const fetchAll = async () => {
//     if (!token) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const [rh, ra] = await Promise.all([
//         fetch(`${API_BASE_URL}/api/Medecin/horaires`, { headers }),
//         fetch(`${API_BASE_URL}/api/Medecin/absences`, { headers }),
//       ]);
//       const [hor, abs] = await Promise.all([
//         rh.ok ? rh.json() : Promise.reject("Err horaires"),
//         ra.ok ? ra.json() : Promise.reject("Err absences"),
//       ]);
//       setHoraires(hor || []);
//       setAbsences(abs || []);
//     } catch (e) {
//       setErr("Erreur de chargement des données");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAll(); /* au montage */
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Groupes horaires (tes deux lignes d'origine)
//   const hebdo = horaires.filter((h) => !!h.dayOfWeek);
//   const spec = horaires.filter((h) => !!h.dateSpecific);

//   // === Données calculées nécessaires à TON rendu ===

//   // 1) Hebdo: groupé par jour (1..7) + fusion créneaux
//   const weeklyByDay = useMemo(() => {
//     const by = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
//     hebdo.forEach((h) => {
//       const d = DOW_MAP[h.dayOfWeek]; // "MONDAY" -> 1
//       if (d) by[d].push(h);
//     });
//     const getStart = (h) => h.heureDebut || h.start || h.startTime;
//     const getEnd = (h) => h.heureFin || h.end || h.endTime;
//     const out = {};
//     for (let d = 1; d <= 7; d++) out[d] = mergeRanges(by[d], getStart, getEnd);
//     return out;
//   }, [hebdo]);

//   // 2) Exceptions (dates spécifiques) triées
//   const specificList = useMemo(() => {
//     const getStart = (h) => h.heureDebut || h.start || h.startTime;
//     const getEnd = (h) => h.heureFin || h.end || h.endTime;
//     return spec
//       .map((h) => ({
//         date: h.dateSpecific,
//         start: getStart(h),
//         end: getEnd(h),
//       }))
//       .filter((x) => x.date && x.start && x.end)
//       .sort((a, b) => String(a.date).localeCompare(String(b.date)));
//   }, [spec]);

//   // 3) Absences lisibles
//   const absencesList = useMemo(() => {
//     const s = (a) => a.startTime || a.debut || a.start || null;
//     const e = (a) => a.endTime || a.fin || a.end || null;
//     return (absences || [])
//       .map((a) => ({
//         start: s(a) ?? "00:00",
//         end: e(a) ?? "23:59",
//         motif: a.motif || a.reason || "",
//       }))
//       .sort((a, b) => (a.start + a.end).localeCompare(b.start + b.end));
//   }, [absences]);

//   // Actions d'ajout/suppression (tes handlers)
//   const addHoraire = async (e) => {
//     e.preventDefault();
//     if (!token) return;

//     const body =
//       hType === "hebdo"
//         ? { dayOfWeek: hDay, start: hStart, end: hEnd }
//         : { dateSpecific: hDate, start: hStart, end: hEnd };

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/Medecin/horaires`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });
//       if (!res.ok) throw new Error();
//       await fetchAll();
//       if (hType === "date") setHDate("");
//     } catch {
//       alert("Erreur lors de la création de l’horaire.");
//     }
//   };

//   const deleteHoraire = async (id) => {
//     if (!token) return;
//     if (!window.confirm("Supprimer cet horaire ?")) return;
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/Medecin/horaires/${id}`, {
//         method: "DELETE",
//         headers,
//       });
//       if (!res.ok && res.status !== 204) throw new Error();
//       setHoraires((list) => list.filter((h) => h.id !== id));
//     } catch {
//       alert("Erreur lors de la suppression de l’horaire.");
//     }
//   };

//   const addAbsence = async (e) => {
//     e.preventDefault();
//     if (!token) return;

//     const body = aAllDay
//       ? { date: aDate }
//       : { date: aDate, start: aStart, end: aEnd };

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/Medecin/absences`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });
//       if (!res.ok) throw new Error();
//       await fetchAll();
//       setADate("");
//     } catch {
//       alert("Erreur lors de la création de l’absence.");
//     }
//   };

//   const deleteAbsence = async (id) => {
//     if (!token) return;
//     if (!window.confirm("Supprimer cette absence ?")) return;
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/Medecin/absences/${id}`, {
//         method: "DELETE",
//         headers,
//       });
//       if (!res.ok && res.status !== 204) throw new Error();
//       setAbsences((list) => list.filter((a) => a.id !== id));
//     } catch {
//       alert("Erreur lors de la suppression de l’absence.");
//     }
//   };

//   // === Rendu : on garde TON UI actuel ===
//   return (
//     <div className="container-fluid g-3">
//       {/* HORAIRES HEBDO */}
//       <div className="card border-0 shadow-sm rounded-4 mb-3">
//         <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
//           <h6 className="m-0">Horaires hebdomadaires</h6>
//           {/* <button className="btn btn-add"><i className="bi bi-plus-lg"></i></button> */}
//         </div>

//         <div className="card-body">
//           {loading && <div className="text-muted small mb-2">Chargement…</div>}
//           {err && <div className="alert alert-danger py-2">{err}</div>}

//           <div className="row g-3">
//             {Array.from({ length: 7 }, (_, i) => i + 1).map((d) => {
//               const ranges = weeklyByDay[d];
//               return (
//                 <div key={d} className="col-12 col-sm-6 col-lg-4">
//                   <div className="p-3 border rounded-3 h-100">
//                     <div className="fw-semibold mb-2">{DAY_LABEL[d]}</div>
//                     {ranges && ranges.length ? (
//                       <div className="d-flex flex-wrap gap-2">
//                         {ranges.map((r, idx) => (
//                           <span
//                             key={idx}
//                             className="badge bg-light text-dark border"
//                             style={{ fontWeight: 600 }}
//                           >
//                             {r.start} – {r.end}
//                           </span>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-muted small">— fermé —</div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* DATES SPÉCIFIQUES */}
//       <div className="card border-0 shadow-sm rounded-4 mb-3">
//         <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
//           <h6 className="m-0">Exceptions (dates spécifiques)</h6>
//         </div>
//         <div className="card-body">
//           {specificList.length ? (
//             <ul className="list-group list-group-flush">
//               {specificList.map((e, i) => (
//                 <li
//                   key={i}
//                   className="list-group-item px-0 d-flex justify-content-between"
//                 >
//                   <span className="small">
//                     {e.date /* ou fmtDate(e.date) */}
//                   </span>
//                   <span className="small fw-semibold">
//                     {fmtTime(e.start)} – {fmtTime(e.end)}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="text-muted small">
//               Aucune exception enregistrée.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ABSENCES (facultatif) */}
//       <div className="card border-0 shadow-sm rounded-4">
//         <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
//           <h6 className="m-0">Absences</h6>
//         </div>
//         <div className="card-body">
//           {absencesList.length ? (
//             <ul className="list-group list-group-flush">
//               {absencesList.map((a, i) => (
//                 <li
//                   key={i}
//                   className="list-group-item px-0 d-flex justify-content-between align-items-center"
//                 >
//                   <div className="small">
//                     {fmtDate(a.date)}
//                     {/* si tu ajoutes la date dans l'API */}
//                     {a.start || a.end ? (
//                       <>
//                         {a.date ? " — " : ""}
//                         {fmtTime(a.start)} → {fmtTime(a.end)}
//                       </>
//                     ) : null}
//                   </div>
//                   {a.motif ? (
//                     <span className="badge bg-outline text-muted border">
//                       {a.motif}
//                     </span>
//                   ) : null}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="text-muted small">Aucune absence.</div>
//           )}
//         </div>
//       </div>

//       {/* ➜ Formulaires (si tu veux les réafficher plus tard, tu les as déjà dans ton code commenté) */}
//     </div>
//   );
// }
