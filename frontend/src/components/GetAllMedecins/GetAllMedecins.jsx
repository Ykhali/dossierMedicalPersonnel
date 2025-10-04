// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import API_BASE_URL from "../../config/apiConfig";
// import EditMedecin from "../EditMedecin/EditMedecin";

// function GetAllMedecins() {
//   const [medecins, setMedecins] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingMedecin, setEditingMedecin] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMedecins = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const response = await fetch(`${API_BASE_URL}/api/admin/medecins`, {
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
//         setMedecins(data);
//       } catch (error) {
//         setError(
//           error.message || "Erreur lors de la récupération des patients"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchMedecins();
//   }, [navigate]);

//   const handleDelete = async (id) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer ce medecin ?")) {
//       setIsLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `${API_BASE_URL}/api/admin/medecins/${id}`,
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

//         setMedecins(
//           medecins.filter((medecin) => medecin.id !== id)
//         );
//       } catch (error) {
//         setError(
//           error.message || "Erreur lors de la suppression du medecin"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleEdit = (medecin) => {
//     setEditingMedecin(medecin); // Switch to edit mode with the selected patient
//   };

//   const handleSave = (updatedMedecin) => {
//     setMedecins(
//       medecins.map((m) => (m.id === updatedMedecin.id ? updatedMedecin : m))
//     );
//     setEditingMedecin(null); // Exit edit mode after saving
//   };

//   const handleCancel = () => {
//     setEditingMedecin(null); // Exit edit mode without saving
//   };

//   if (editingMedecin) {
//     return (
//       <EditMedecin
//         medecin={editingMedecin}
//         onSave={handleSave}
//         onCancel={handleCancel}
//         isLoading={isLoading}
//       />
//     );
//   }
//   return (
//     <div className="m-5">
//       <h3 className="text-center mb-5">Liste des Medecins</h3>

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
//                 <th scope="col">Specialite</th>
//                 <th scope="col">Sexe</th>
//                 <th scope="col">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {medecins.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="text-center">
//                     Aucun medecin trouvé
//                   </td>
//                 </tr>
//               ) : (
//                 medecins.map((medecin) => (
//                   <tr key={medecin.id}>
//                     <td>{medecin.id}</td>
//                     <td>{medecin.nom}</td>
//                     <td>{medecin.prenom}</td>
//                     <td>{medecin.email}</td>
//                     <td>{medecin.telephone || "N/A"}</td>
//                     <td>{medecin.specialite || "N/A"}</td>
//                     <td>{medecin.sexe}</td>
//                     <td>
//                       <div
//                         className="d-flex gap-2 d-md-flex 
//                       justify-content-md-center buttons"
//                       >
//                         <button
//                           className="btn btn-outline-success"
//                           onClick={() => handleEdit(medecin)}
//                           disabled={isLoading}
//                         >
//                           modifier
//                         </button>
//                         <button
//                           className="btn btn-outline-danger"
//                           onClick={() => handleDelete(medecin.id)}
//                           disabled={isLoading}
//                         >
//                           supprimer
//                         </button>
//                         <button
//                           className="btn btn-outline-info"
                          
//                           disabled={isLoading}
//                         >
//                           receptionnistes
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

// export default GetAllMedecins;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from "../../config/apiConfig";
import EditMedecin from "../EditMedecin/EditMedecin";

/* =========================
   Modal : Réceptionnistes d’un médecin
   ========================= */
function VoirReceptionnistesModal({ medecin, onClose }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]); // liste des réceptionnistes (DTO complets)
  const [error, setError] = useState(null);

  const tokenHeader = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Essai endpoint "full"
        const FULL_URL = `${API_BASE_URL}/api/admin/assign/medecins/${medecin.id}/receptionnistes/full`;
        const fullRes = await fetch(FULL_URL, {
          headers: { "Content-Type": "application/json", ...tokenHeader() },
          credentials: "include",
        });

        if (fullRes.ok) {
          const list = await fullRes.json().catch(() => []);
          if (alive) {
            setItems(Array.isArray(list) ? list : list.items ?? []);
            setLoading(false);
          }
          return;
        }

        // 2) Repli : endpoint IDs
        const IDS_URL = `${API_BASE_URL}/api/admin/assign/medecins/${medecin.id}/receptionnistes`;
        const idsRes = await fetch(IDS_URL, {
          headers: { "Content-Type": "application/json", ...tokenHeader() },
          credentials: "include",
        });

        if (!idsRes.ok) {
          if (idsRes.status === 404 && alive) {
            setItems([]); // pas d’affectations
            setLoading(false);
            return;
          }
          throw new Error(`HTTP ${idsRes.status}`);
        }

        const idsPayload = await idsRes.json().catch(() => []);
        const ids = Array.isArray(idsPayload)
          ? typeof idsPayload[0] === "object"
            ? idsPayload.map((x) => x.id)
            : idsPayload
          : idsPayload.ids ?? [];

        // 3) Charger toutes les réceptionnistes pour filtrer côté front
        const ALL_R_URL = `${API_BASE_URL}/api/admin/receptionnistes`;
        const listRes = await fetch(ALL_R_URL, {
          headers: { "Content-Type": "application/json", ...tokenHeader() },
          credentials: "include",
        });

        if (!listRes.ok)
          throw new Error(`HTTP ${listRes.status} (receptionnistes)`);

        let list = await listRes.json().catch(() => []);
        list = Array.isArray(list) ? list : list.items ?? [];
        const filtered = list.filter((r) => ids.includes(r.id));

        if (alive) setItems(filtered);
      } catch (e) {
        if (alive) setError(e.message || "Erreur de chargement");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [medecin?.id]);

  return (
    <>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Réceptionnistes du Dr {medecin?.prenom} {medecin?.nom}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              {loading ? (
                <div className="text-center p-3">Chargement…</div>
              ) : items.length === 0 ? (
                <div className="text-center text-muted p-3">
                  Aucune réceptionniste affectée à ce médecin.
                </div>
              ) : (
                <div className="list-group">
                  {items.map((r) => (
                    <div key={r.id} className="list-group-item">
                      <div className="fw-semibold">
                        {r.prenom} {r.nom}
                      </div>
                      <div className="small text-muted">
                        {r.email || "—"} · {r.telephone || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}

/* =========================
   Page : GetAllMedecins
   ========================= */
function GetAllMedecins() {
  const [medecins, setMedecins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingMedecin, setEditingMedecin] = useState(null);

  // modal Réceptionnistes
  const [viewFor, setViewFor] = useState(null); // medecin sélectionné

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedecins = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/medecins`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const data = await response.json();
        setMedecins(Array.isArray(data) ? data : data.items ?? []);
      } catch (error) {
        setError(
          error.message || "Erreur lors de la récupération des médecins"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedecins();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce médecin ?")) {
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/admin/medecins/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      setMedecins((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      setError(error.message || "Erreur lors de la suppression du médecin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (medecin) => {
    setEditingMedecin(medecin);
  };

  const handleSave = (updatedMedecin) => {
    setMedecins((prev) =>
      prev.map((m) => (m.id === updatedMedecin.id ? updatedMedecin : m))
    );
    setEditingMedecin(null);
  };

  const handleCancel = () => {
    setEditingMedecin(null);
  };

  if (editingMedecin) {
    return (
      <EditMedecin
        medecin={editingMedecin}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="m-5">
      <h3 className="text-center mb-5">Liste des Médecins</h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

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
                <th scope="col">Spécialité</th>
                <th scope="col">Sexe</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {medecins.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    Aucun médecin trouvé
                  </td>
                </tr>
              ) : (
                medecins.map((medecin) => (
                  <tr key={medecin.id}>
                    <td>{medecin.id}</td>
                    <td>{medecin.nom}</td>
                    <td>{medecin.prenom}</td>
                    <td>{medecin.email}</td>
                    <td>{medecin.telephone || "N/A"}</td>
                    <td>{medecin.specialite || "N/A"}</td>
                    <td>{medecin.sexe}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-md-center buttons">
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleEdit(medecin)}
                          disabled={isLoading}
                        >
                          modifier
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(medecin.id)}
                          disabled={isLoading}
                        >
                          supprimer
                        </button>
                        <button
                          className="btn btn-outline-info"
                          onClick={() => setViewFor(medecin)}
                          disabled={isLoading}
                        >
                          Réceptionnistes
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

      {/* Modal : liste des réceptionnistes du médecin sélectionné */}
      {viewFor && (
        <VoirReceptionnistesModal
          medecin={viewFor}
          onClose={() => setViewFor(null)}
        />
      )}
    </div>
  );
}

export default GetAllMedecins;
