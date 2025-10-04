// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import { Modal, Button } from "react-bootstrap";
// import EditReceptionniste from "../EditReceptionniste/EditReceptionniste";

// function GetAllReceptionnistes() {
//   const [receptionnistes, setReceptionnistes] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingReceptionniste, setEditingReceptionniste] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchReceptionnistes = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const response = await fetch(`${API_BASE_URL}/api/admin/receptionnistes`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(
//             errorData.message || `HTTP error! Status: ${response.status}`
//           );
//         }

//         const data = await response.json();
//         setReceptionnistes(data);
//       } catch (error) {
//         setError(
//           error.message || "Erreur lors de la récupération des receptionnistes"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchReceptionnistes();
//   }, [navigate]);

//   const handleDelete = async (id) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer cette receptionniste ?")) {
//       setIsLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `${API_BASE_URL}/api/admin/receptionnistes/${id}`,
//           {
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             credentials: "include",
//           }
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(
//             errorData.message || `HTTP error! Status: ${response.status}`
//           );
//         }

//         setReceptionnistes(receptionnistes.filter((receptionniste) => receptionniste.id !== id));
//       } catch (error) {
//         setError(error.message || "Erreur lors de la suppression de la receptionniste");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleEdit = (receptionniste) => {
//     setEditingReceptionniste(receptionniste); // Switch to edit mode with the selected patient
//   };

//   const handleSave = (updatedReceptionniste) => {
//     setReceptionnistes(
//       receptionnistes.map((R) => (R.id === updatedReceptionniste.id ? updatedReceptionniste : R))
//     );
//     setEditingReceptionniste(null); // Exit edit mode after saving
//   };

//   const handleCancel = () => {
//     setEditingReceptionniste(null); // Exit edit mode without saving
//   };

//   if (editingReceptionniste) {
//     return (
//       <EditReceptionniste
//         receptionniste={editingReceptionniste}
//         onSave={handleSave}
//         onCancel={handleCancel}
//         isLoading={isLoading}
//       />
//     );
//   }
//   return (
//     <div className="m-5">
//       <h3 className="text-center mb-5">Liste des Receptionnistes</h3>

//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}

//       {isLoading ? (
//         <div className="text-center">Chargement...</div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-bordered custom-border">
//             <thead className="thead-dark">
//               <tr className="text-center">
//                 <th scope="col">#</th>
//                 <th scope="col">Nom</th>
//                 <th scope="col">Prénom</th>
//                 <th scope="col">Email</th>
//                 <th scope="col">Téléphone</th>
//                 <th scope="col">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {receptionnistes.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center">
//                     Aucune Receptionniste trouvé
//                   </td>
//                 </tr>
//               ) : (
//                 receptionnistes.map((receptionniste) => (
//                   <tr key={receptionniste.id}>
//                     <td>{receptionniste.id}</td>
//                     <td>{receptionniste.nom}</td>
//                     <td>{receptionniste.prenom}</td>
//                     <td>{receptionniste.email}</td>
//                     <td>{receptionniste.telephone || "N/A"}</td>
//                     <td>
//                       <div
//                         className="d-flex gap-2 d-md-flex 
//                       justify-content-md-center buttons"
//                       >
//                         <button
//                           className="btn btn-outline-success"
//                           onClick={() => handleEdit(receptionniste)}
//                           disabled={isLoading}
//                         >
//                           modifier
//                         </button>
//                         <button
//                           className="btn btn-outline-danger"
//                           onClick={() => handleDelete(receptionniste.id)}
//                           disabled={isLoading}
//                         >
//                           supprimer
//                         </button>
//                         <button
//                           className="btn btn-outline-info"
//                         >
//                           Affecter
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default GetAllReceptionnistes;


// GetAllReceptionnistes.jsx


// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Modal, Button } from "react-bootstrap";
// import API_BASE_URL from "../../config/apiConfig";
// import EditReceptionniste from "../EditReceptionniste/EditReceptionniste";

// /* ============================================
//    Modal d’affectation : choisir des médecins
//    ============================================ */
// function AffecterRecepToMedsModal({ show, recep, onClose, onSaved }) {
//   const [allMeds, setAllMeds] = useState([]);
//   const [selected, setSelected] = useState(new Set()); // ids sélectionnés
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);

//   const tokenHeader = () => {
//     const t = localStorage.getItem("token");
//     return t ? { Authorization: `Bearer ${t}` } : {};
//   };

//   // (Re)charge la liste des médecins + les affectations existantes
//   useEffect(() => {
//     if (!show || !recep?.id) return;

//     (async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [listRes, assignedRes] = await Promise.all([
//           fetch(`${API_BASE_URL}/api/admin/medecins`, {
//             headers: { "Content-Type": "application/json", ...tokenHeader() },
//             credentials: "include",
//           }),
//           fetch(
//             `${API_BASE_URL}/api/admin/assign/receptionnistes/${recep.id}/medecins`,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 ...tokenHeader(),
//               },
//               credentials: "include",
//             }
//           ),
//         ]);

//         if (listRes.status === 401 || assignedRes.status === 401) {
//           localStorage.clear();
//           window.location.assign("/login");
//           return;
//         }
//         if (!listRes.ok) throw new Error(`HTTP ${listRes.status} (médecins)`);
//         if (!assignedRes.ok)
//           throw new Error(`HTTP ${assignedRes.status} (affectés)`);

//         const listJson = await listRes.json();
//         const list = Array.isArray(listJson)
//           ? listJson
//           : listJson.items ?? [];

//         const assignedJson = await assignedRes.json();
//         const ids = Array.isArray(assignedJson)
//           ? assignedJson
//           : assignedJson.medecinIds ?? [];

//         setAllMeds(list);
//         setSelected(new Set(ids));
//       } catch (e) {
//         setError(e.message || "Erreur lors du chargement");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [show, recep?.id]);

//   // reset local state quand on ferme
//   useEffect(() => {
//     if (!show) {
//       setSearch("");
//       setError(null);
//       setLoading(false);
//       setSaving(false);
//       setAllMeds([]);
//       setSelected(new Set());
//     }
//   }, [show]);

//   const filtered = React.useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return allMeds;
//     return allMeds.filter((m) => {
//       const nom = `${m?.nom ?? ""} ${m?.prenom ?? ""}`.toLowerCase();
//       return (
//         nom.includes(q) ||
//         (m?.email ?? "").toLowerCase().includes(q) ||
//         (m?.telephone ?? "").toLowerCase().includes(q)
//       );
//     });
//   }, [allMeds, search]);

//   const toggle = (id) =>
//     setSelected((s) => {
//       const n = new Set(s);
//       n.has(id) ? n.delete(id) : n.add(id);
//       return n;
//     });

//   const allFilteredIds = filtered.map((m) => m.id);
//   const allFilteredChecked =
//     allFilteredIds.length > 0 &&
//     allFilteredIds.every((id) => selected.has(id));

//   const toggleAllFiltered = () =>
//     setSelected((s) => {
//       const n = new Set(s);
//       if (allFilteredChecked) {
//         allFilteredIds.forEach((id) => n.delete(id));
//       } else {
//         allFilteredIds.forEach((id) => n.add(id));
//       }
//       return n;
//     });

//   const save = async () => {
//     if (!recep?.id) return;
//     setSaving(true);
//     setError(null);
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/api/admin/assign/receptionnistes/${recep.id}/medecins:set`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json", ...tokenHeader() },
//           credentials: "include",
//           body: JSON.stringify({ ids: Array.from(selected) }),
//         }
//       );
//       if (res.status === 401) {
//         localStorage.clear();
//         window.location.assign("/login");
//         return;
//       }
//       if (!res.ok) {
//         const e = await res.json().catch(() => ({}));
//         throw new Error(e.message || `HTTP ${res.status}`);
//       }
//       onSaved?.(); // recharger la liste parent si besoin
//       onClose();
//     } catch (e) {
//       setError(e.message || "Erreur lors de l’enregistrement");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <Modal
//       show={show}
//       onHide={() => !saving && onClose()}
//       size="lg"
//       centered
//       backdrop="static"
//       keyboard={!saving}
//     >
//       <Modal.Header closeButton={!saving}>
//         <Modal.Title>
//           Affecter la réceptionniste{" "}
//           {recep ? `${recep.prenom} ${recep.nom}` : ""}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {error && <div className="alert alert-danger">{error}</div>}

//         <div className="d-flex align-items-center gap-2 mb-3">
//           <input
//             className="form-control"
//             placeholder="Rechercher un médecin (nom, email, téléphone)…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             disabled={loading || saving}
//           />
//           <button
//             className={`btn ${
//               allFilteredChecked ? "btn-outline-secondary" : "btn-outline-primary"
//             }`}
//             onClick={toggleAllFiltered}
//             disabled={loading || filtered.length === 0}
//           >
//             {allFilteredChecked ? "Tout décocher (filtre)" : "Tout cocher (filtre)"}
//           </button>
//         </div>

//         {loading ? (
//           <div className="text-center py-4">
//             <span className="spinner-border" /> Chargement…
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center text-muted py-4">Aucun médecin trouvé.</div>
//         ) : (
//           <div className="table-responsive" style={{ maxHeight: 420, overflowY: "auto" }}>
//             <table className="table table-hover align-middle">
//               <thead className="table-light">
//                 <tr>
//                   <th style={{ width: 56 }} className="text-center">✔</th>
//                   <th>Nom</th>
//                   <th>Email</th>
//                   <th>Téléphone</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((m) => {
//                   const checked = selected.has(m.id);
//                   return (
//                     <tr key={m.id}>
//                       <td className="text-center">
//                         <input
//                           type="checkbox"
//                           className="form-check-input"
//                           checked={checked}
//                           onChange={() => toggle(m.id)}
//                           disabled={saving}
//                         />
//                       </td>
//                       <td>{`${m?.nom ?? ""} ${m?.prenom ?? ""}`}</td>
//                       <td>{m?.email || "—"}</td>
//                       <td>{m?.telephone || "—"}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="small text-muted mt-2">
//           Sélectionnés : <strong>{selected.size}</strong>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
//           Annuler
//         </Button>
//         <Button variant="primary" onClick={save} disabled={saving}>
//           {saving ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2" />
//               Enregistrement…
//             </>
//           ) : (
//             "Enregistrer"
//           )}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// /* ============================================
//    Page GetAllReceptionnistes avec bouton Affecter
//    ============================================ */
// function GetAllReceptionnistes() {
//   const [receptionnistes, setReceptionnistes] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingReceptionniste, setEditingReceptionniste] = useState(null);
//   const [affectRecep, setAffectRecep] = useState(null); // réceptionniste sélectionnée pour affectation

//   const navigate = useNavigate();

//   const loadReceptionnistes = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/api/admin/receptionnistes`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `HTTP error! Status: ${response.status}`
//         );
//       }

//       const data = await response.json();
//       setReceptionnistes(Array.isArray(data) ? data : data.items ?? []);
//     } catch (e) {
//       setError(e.message || "Erreur lors de la récupération des réceptionnistes");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     loadReceptionnistes();
//   }, [loadReceptionnistes]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette réceptionniste ?")) return;
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `${API_BASE_URL}/api/admin/receptionnistes/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `HTTP error! Status: ${response.status}`
//         );
//       }

//       setReceptionnistes((prev) => prev.filter((r) => r.id !== id));
//     } catch (e) {
//       setError(e.message || "Erreur lors de la suppression");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEdit = (receptionniste) => setEditingReceptionniste(receptionniste);

//   const handleSave = (updatedReceptionniste) => {
//     setReceptionnistes((prev) =>
//       prev.map((r) => (r.id === updatedReceptionniste.id ? updatedReceptionniste : r))
//     );
//     setEditingReceptionniste(null);
//   };

//   const handleCancel = () => setEditingReceptionniste(null);

//   if (editingReceptionniste) {
//     return (
//       <EditReceptionniste
//         receptionniste={editingReceptionniste}
//         onSave={handleSave}
//         onCancel={handleCancel}
//         isLoading={isLoading}
//       />
//     );
//   }

//   return (
//     <div className="m-5">
//       <h3 className="text-center mb-5">Liste des Réceptionnistes</h3>

//       {error && <div className="alert alert-danger">{error}</div>}

//       {isLoading ? (
//         <div className="text-center">Chargement...</div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-bordered custom-border">
//             <thead className="thead-dark">
//               <tr className="text-center">
//                 <th scope="col">#</th>
//                 <th scope="col">Nom</th>
//                 <th scope="col">Prénom</th>
//                 <th scope="col">Email</th>
//                 <th scope="col">Téléphone</th>
//                 <th scope="col">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {receptionnistes.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="text-center">
//                     Aucune réceptionniste trouvée
//                   </td>
//                 </tr>
//               ) : (
//                 receptionnistes.map((r) => (
//                   <tr key={r.id}>
//                     <td>{r.id}</td>
//                     <td>{r.nom}</td>
//                     <td>{r.prenom}</td>
//                     <td>{r.email}</td>
//                     <td>{r.telephone || "N/A"}</td>
//                     <td>
//                       <div className="d-flex gap-2 justify-content-md-center">
//                         <button
//                           className="btn btn-outline-success"
//                           onClick={() => handleEdit(r)}
//                           disabled={isLoading}
//                         >
//                           modifier
//                         </button>
//                         <button
//                           className="btn btn-outline-danger"
//                           onClick={() => handleDelete(r.id)}
//                           disabled={isLoading}
//                         >
//                           supprimer
//                         </button>
//                         <button
//                           className="btn btn-outline-info"
//                           onClick={() => setAffectRecep(r)}
//                           disabled={isLoading}
//                         >
//                           Affecter
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal d’affectation */}
//       <AffecterRecepToMedsModal
//         show={!!affectRecep}
//         recep={affectRecep}
//         onClose={() => setAffectRecep(null)}
//         onSaved={loadReceptionnistes}
//       />
//     </div>
//   );
// }

// export default GetAllReceptionnistes;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import EditReceptionniste from "../EditReceptionniste/EditReceptionniste";

/* =========================
   Modal d’affectation
   ========================= */
function AffecterRecepToMedsModal({ recep, onClose, onSaved }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [allMeds, setAllMeds] = useState([]); // [{id, nom, prenom, email, telephone}, ...]
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(new Set()); // Set d’ids sélectionnés

  // Helpers
  const tokenHeader = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  // Filtre côté UI
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allMeds;
    return allMeds.filter((m) => {
      const nom = `${m?.nom ?? ""} ${m?.prenom ?? ""}`.toLowerCase();
      return (
        nom.includes(q) ||
        (m?.email ?? "").toLowerCase().includes(q) ||
        (m?.telephone ?? "").toLowerCase().includes(q)
      );
    });
  }, [allMeds, query]);

  const allFilteredChecked =
    filtered.length > 0 && filtered.every((m) => selected.has(m.id));

  // Chargement liste médecins + affectations existantes (404 toléré)
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // 👉 adapte ces URLs à ton back si nécessaire
        const LIST_URL = `${API_BASE_URL}/api/admin/medecins`;
        const ASSIGNED_URL = `${API_BASE_URL}/api/admin/assign/receptionnistes/${recep.id}/medecins`;

        const [listRes, assignedRes] = await Promise.all([
          fetch(LIST_URL, {
            headers: { "Content-Type": "application/json", ...tokenHeader() },
            credentials: "include",
          }),
          fetch(ASSIGNED_URL, {
            headers: { "Content-Type": "application/json", ...tokenHeader() },
            credentials: "include",
          }),
        ]);

        if (!listRes.ok) {
          // ex: 401, 403, 500…
          throw new Error(`HTTP ${listRes.status} (médecins)`);
        }

        // Liste médecins
        let list = await listRes.json().catch(() => []);
        list = Array.isArray(list) ? list : list.items ?? [];
        if (alive) setAllMeds(list);

        // Affectations existantes
        let ids = [];
        if (assignedRes.ok) {
          const a = await assignedRes.json().catch(() => []);
          if (Array.isArray(a)) {
            ids = typeof a[0] === "object" ? a.map((x) => x.id) : a;
          } else {
            ids = a.medecinIds ?? a.ids ?? [];
          }
        } else if (assignedRes.status !== 404) {
          // 404 => aucune affectation pour l’instant → c’est OK
          throw new Error(`HTTP ${assignedRes.status} (affectés)`);
        }
        if (alive) setSelected(new Set(ids));
      } catch (e) {
        if (alive) setError(e.message || "Erreur de chargement");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recep?.id]);

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      const ids = filtered.map((m) => m.id);
      const allChecked = ids.every((id) => next.has(id));
      if (allChecked) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const SAVE_URL = `${API_BASE_URL}/api/admin/assign/receptionnistes/${recep.id}/medecins/set`;
      const body = { ids: Array.from(selected) };

      const res = await fetch(SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader() },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `HTTP ${res.status}`);
      }

      onSaved?.(Array.from(selected)); // callback parent si besoin
      onClose();
    } catch (e) {
      setError(e.message || "Erreur lors de l’enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        onClick={() => !saving && onClose()}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Affecter la réceptionniste {recep?.prenom} {recep?.nom}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => !saving && onClose()}
              />
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger"> {error} </div>}

              {/* Barre de recherche + tout cocher (filtre) */}
              <div className="d-flex gap-2 align-items-center mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un médecin (nom, email, téléphone)…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="btn btn-outline-primary"
                  onClick={toggleAllFiltered}
                  disabled={loading || filtered.length === 0}
                >
                  {allFilteredChecked
                    ? "Tout décocher (filtre)"
                    : "Tout cocher (filtre)"}
                </button>
              </div>

              {/* Liste des médecins */}
              <div
                style={{
                  maxHeight: 360,
                  overflow: "auto",
                  border: "1px solid #eee",
                  borderRadius: 6,
                }}
              >
                {loading ? (
                  <div className="p-3 text-center">Chargement…</div>
                ) : filtered.length === 0 ? (
                  <div className="p-3 text-center text-muted">
                    Aucun médecin trouvé.
                  </div>
                ) : (
                  <ul className="list-group list-group-flush">
                    {filtered.map((m) => {
                      const checked = selected.has(m.id);
                      return (
                        <li
                          key={m.id}
                          className="list-group-item d-flex align-items-center"
                        >
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`med-${m.id}`}
                              checked={checked}
                              onChange={() => toggleOne(m.id)}
                              disabled={saving}
                            />
                          </div>
                          <label
                            htmlFor={`med-${m.id}`}
                            className="ms-2 mb-0 d-flex flex-column"
                            style={{ cursor: "pointer" }}
                          >
                            <span className="fw-semibold">
                              {m.prenom} {m.nom}
                            </span>
                            <small className="text-muted">
                              {m.email || "—"} · {m.telephone || "—"}
                            </small>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="mt-3">
                <small className="text-muted">
                  Sélectionnés : <strong>{selected.size}</strong>
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Annuler
              </button>
              <button
                className="btn btn-primary"
                onClick={save}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Enregistrement…
                  </>
                ) : (
                  "Enregistrer"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* backdrop */}
      <div className="modal-backdrop show" />
    </>
  );
}

/* =========================
   Page : GetAllReceptionnistes
   ========================= */
function GetAllReceptionnistes() {
  const [receptionnistes, setReceptionnistes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingReceptionniste, setEditingReceptionniste] = useState(null);

  // modal Affecter
  const [assignFor, setAssignFor] = useState(null); // {id, nom, prenom, ...} ou null

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceptionnistes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/admin/receptionnistes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const data = await response.json();
        setReceptionnistes(Array.isArray(data) ? data : data.items ?? []);
      } catch (e) {
        setError(
          e.message || "Erreur lors de la récupération des réceptionnistes"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchReceptionnistes();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette réceptionniste ?"
      )
    )
      return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/receptionnistes/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }
      setReceptionnistes((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e.message || "Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (receptionniste) =>
    setEditingReceptionniste(receptionniste);

  const handleSave = (updated) => {
    setReceptionnistes((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    setEditingReceptionniste(null);
  };

  const handleCancel = () => setEditingReceptionniste(null);

  if (editingReceptionniste) {
    return (
      <EditReceptionniste
        receptionniste={editingReceptionniste}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="m-5">
      <h3 className="text-center mb-5">Liste des Réceptionnistes</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="text-center">Chargement...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered custom-border">
            <thead className="thead-dark">
              <tr className="text-center">
                <th scope="col">#</th>
                <th scope="col">Nom</th>
                <th scope="col">Prénom</th>
                <th scope="col">Email</th>
                <th scope="col">Téléphone</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {receptionnistes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Aucune réceptionniste trouvée
                  </td>
                </tr>
              ) : (
                receptionnistes.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.nom}</td>
                    <td>{r.prenom}</td>
                    <td>{r.email}</td>
                    <td>{r.telephone || "N/A"}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-md-center buttons">
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleEdit(r)}
                          disabled={isLoading}
                        >
                          modifier
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(r.id)}
                          disabled={isLoading}
                        >
                          supprimer
                        </button>
                        <button
                          className="btn btn-outline-info"
                          onClick={() => setAssignFor(r)}
                          disabled={isLoading}
                        >
                          Affecter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal d’affectation */}
      {assignFor && (
        <AffecterRecepToMedsModal
          recep={assignFor}
          onClose={() => setAssignFor(null)}
          onSaved={() => {
            // Optionnel : feedback ou refetch
            // alert("Affectations enregistrées ✅");
            setAssignFor(null);
          }}
        />
      )}
    </div>
  );
}

export default GetAllReceptionnistes;
