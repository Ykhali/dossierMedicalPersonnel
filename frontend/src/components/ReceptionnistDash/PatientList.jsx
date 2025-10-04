// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";

// function PatientList() {
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           localStorage.clear();
//           navigate("/login");
//           return;
//         }

//         const response = await fetch(
//           `${API_BASE_URL}/api/receptionniste/listPatients`,
//           {
//             method: "GET",
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
//         const data = await response.json();
//         setUsers(data);
//         console.log(
//           "User IDs:",
//           data.map((u) => u.id)
//         );

//       } catch (e) {
//         setError(
//           error.message || "Erreur lors de la récupération des Utilisateurs"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//       fetchUsers();
//     };
//   }, [navigate]);

//   return (
//     <div>
//       <div className="text-center mb-5">
//         <h2 className="display-6 fw-bold text-info">
//           <i className="fas fa-hospital-user me-2"></i>
//           Liste des Patients
//         </h2>
//       </div>

//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}

//       <div className="row justify-content-center mb-5">
//         <div className="col-md-6">
//           <div className="input-group">
//             <span className="input-group-text bg-white border-end-0">
//               <i className="fas fa-search"></i>
//             </span>
//             <input
//               type="text"
//               id="searchInput"
//               className="form-control border-start-0"
//               placeholder="Rechercher par nom, CIN ou email..."
//               aria-label="Search patients"
//             />
//           </div>
//         </div>
//       </div>
//       {/* <div className="card" style={{ width: "250px" }}>
//         <div className="p-3">
//           <img
//             className="card-img-top rounded"
//             src="https://placehold.co/250x200/png"
//             alt=""
//           />
//         </div>
//         <div className="card-header bg-primary text-white text-center">
//           Youssef Khalid
//         </div>
//         <ul className="list-group list-group-flush">
//           <li className="list-group-item">
//             <strong>CIN:</strong> BKELL
//           </li>
//           <li className="list-group-item">
//             <strong>Téléphone:</strong> 06....
//           </li>
//           <li className="list-group-item">
//             <strong>Email:</strong> lajll@hjk
//           </li>
//         </ul>
//         <div></div>
//       </div> */}
//       {isLoading ? (
//         <div className="text-center">Chargement...</div>
//       ): (
//         <div className="table-responsive">
//         <table
//           className="table table-hover table-bordered align-middle"
//           role="grid"
//           aria-label="Patient list"
//         >
//           <thead className="table-primary">
//             <tr>
//               <th scope="col" className="text-center">
//                 <i className="bi bi-person"></i> <i className="bi bi-image"></i>
//               </th>
//               <th scope="col">Nom complet</th>
//               <th scope="col">CIN </th>
//               <th scope="col">Téléphone </th>
//               <th scope="col">Email </th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length === 0? (
//                 <tr>
//                   <td colSpan="5" className="text-center">
//                     Aucun patient trouvé
//                   </td>
//                 </tr>
//             ):(
//                 users.map((user) => (
//                     <tr key={users.id}>
//                         <td>{}</td>
//                         <td>{user.nom} {" "} {user.prenom}</td>
//                         <td>{user.cin}</td>
//                         <td>{user.telephone}</td>
//                         <td>{user.email}</td>
//                     </tr>
//                 ))
//             )}
//           </tbody>
//         </table>
//       </div>
//       )}
      
//     </div>
//   );
// }

// export default PatientList;
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";

// put this near the top of your file
const avatarCache = new Map();

// function Avatar({ patient }) {
//   const [src, setSrc] = React.useState(null);

//   React.useEffect(() => {
//     let alive = true;
//     const token = localStorage.getItem("token");
//     if (!patient?.id || !token) return;

//     const url = `${API_BASE_URL}/api/receptionniste/patients/${patient.id}/image`;
//     const cached = avatarCache.get(url);
//     if (cached) { setSrc(cached); return; }

//     const controller = new AbortController();

//     (async () => {
//       try {
//         const res = await fetch(url, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//           credentials: "include",
//           signal: controller.signal,
//         });
//         if (!res.ok) return; // no image -> fallback to initials
//         const blob = await res.blob();
//         const objUrl = URL.createObjectURL(blob);
//         avatarCache.set(url, objUrl);
//         if (alive) setSrc(objUrl);
//       } catch {
//         /* ignore; fallback to initials */
//       }
//     })();

//     return () => { alive = false; controller.abort(); };
//   }, [patient?.id]);

//   // image available
//   if (src) {
//     return (
//       <img
//         src={src}
//         alt={`${patient?.nom ?? ""} ${patient?.prenom ?? ""}`}
//         className="rounded-circle"
//         width={48}
//         height={48}
//         loading="lazy"
//         onError={() => setSrc(null)}
//       />
//     );
//   }

//   // simple text fallback (no styling)
//   const initials =
//     `${(patient?.prenom?.[0] ?? "").toUpperCase()}${(patient?.nom?.[0] ?? "").toUpperCase()}` || "?";
//   return <span aria-label={`Avatar ${patient?.nom ?? ""} ${patient?.prenom ?? ""}`}>{initials}</span>;
// }

// function Avatar({ patient }) {
//   const [src, setSrc] = React.useState(null);
//   const [open, setOpen] = React.useState(false);

//   React.useEffect(() => {
//     let alive = true;
//     const token = localStorage.getItem("token");
//     if (!patient?.id || !token) return;

//     const url = `${API_BASE_URL}/api/receptionniste/patients/${patient.id}/image`;
//     const cached = avatarCache.get(url);
//     if (cached) {
//       setSrc(cached);
//       return;
//     }

//     const controller = new AbortController();

//     (async () => {
//       try {
//         const res = await fetch(url, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//           credentials: "include",
//           signal: controller.signal,
//         });
//         if (!res.ok) return; // pas d'image -> fallback initiales
//         const blob = await res.blob();
//         const objUrl = URL.createObjectURL(blob);
//         avatarCache.set(url, objUrl);
//         if (alive) setSrc(objUrl);
//       } catch {
//         /* ignore; fallback initiales */
//       }
//     })();

//     return () => {
//       alive = false;
//       controller.abort();
//     };
//   }, [patient?.id]);

//   // image trouvée → affichage + clic pour agrandir
//   if (src) {
//     return (
//       <>
//         <img
//           src={src}
//           alt={`${patient?.nom ?? ""} ${patient?.prenom ?? ""}`}
//           className="rounded-circle"
//           width={48}
//           height={48}
//           loading="lazy"
//           onError={() => setSrc(null)}
//           onClick={() => setOpen(true)}
//           role="button"
//           title="Agrandir"
//         />

//         {open && (
//           <>
//             <div
//               className="modal d-block"
//               tabIndex="-1"
//               role="dialog"
//               onClick={() => setOpen(false)} // clic sur le fond ferme
//             >
//               <div
//                 className="modal-dialog modal-dialog-centered modal-lg"
//                 role="document"
//                 onClick={(e) => e.stopPropagation()} // empêcher la fermeture en cliquant sur l’image
//               >
//                 <div className="modal-content">
//                   <div className="modal-header">
//                     <h6 className="modal-title">
//                       Photo — {patient?.prenom} {patient?.nom}
//                     </h6>
//                     <button
//                       type="button"
//                       className="btn-close"
//                       onClick={() => setOpen(false)}
//                     />
//                   </div>
//                   <div className="modal-body">
//                     <img src={src} alt="" className="img-fluid w-100" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-backdrop show" />
//           </>
//         )}
//       </>
//     );
//   }

//   // fallback initiales (pas cliquable)
//   const initials =
//     `${(patient?.prenom?.[0] ?? "").toUpperCase()}${(
//       patient?.nom?.[0] ?? ""
//     ).toUpperCase()}` || "?";
//   return (
//     <span aria-label={`Avatar ${patient?.nom ?? ""} ${patient?.prenom ?? ""}`}>
//       {initials}
//     </span>
//   );
// }
function AvatarWithPreview({ patient }) {
  const [src, setSrc] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    const token = localStorage.getItem("token");
    if (!patient?.id || !token) return;

    const url = `${API_BASE_URL}/api/receptionniste/patients/${patient.id}/image`;
    const cached = avatarCache.get(url);
    if (cached) {
      setSrc(cached);
      return;
    }

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) return; // pas d'image -> fallback initiales
        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        avatarCache.set(url, objUrl);
        if (alive) setSrc(objUrl);
      } catch {}
    })();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [patient?.id]);

  // avatar image (cliquable) ou initiales (non cliquables)
  const initials =
    `${(patient?.prenom?.[0] ?? "").toUpperCase()}${(
      patient?.nom?.[0] ?? ""
    ).toUpperCase()}` || "?";

  return (
    <>
      {src ? (
        <img
          src={src}
          alt={`${patient?.nom ?? ""} ${patient?.prenom ?? ""}`}
          className="rounded-circle"
          width={48}
          height={48}
          loading="lazy"
          onError={() => setSrc(null)}
          onClick={() => setOpen(true)}
          role="button"
          title="Agrandir"
        />
      ) : (
        <span
          aria-label={`Avatar ${patient?.nom ?? ""} ${patient?.prenom ?? ""}`}
        >
          {initials}
        </span>
      )}

      {/* Modal Bootstrap “d-block” sans JS supplémentaire */}
      {/* {open && src && (
        <>
          <div
            className="modal d-block"
            tabIndex="-1"
            role="dialog"
            onClick={() => setOpen(false)} // clic sur le fond ferme
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
              onClick={(e) => e.stopPropagation()} // empêcher la fermeture en cliquant sur l'image
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title">Photo du patient</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <div className="modal-body">
                  <img src={src} alt="" className="img-fluid w-100" />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )} */}
      {open && src && (
        <>
          <div
            className="modal d-block photo-modal"
            tabIndex="-1"
            role="dialog"
            onClick={() => setOpen(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-sm"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title">Photo du patient</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <div className="modal-body">
                  <img src={src} alt="" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </>
  );
}


function PatientList() {
  const [users, setUsers] = useState([]);
  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5; // ← exactement 5 patients par page
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let aborted = false;

    async function fetchUsers() {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          localStorage.clear();
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/receptionniste/listPatients`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.clear();
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const data = await response.json();
        if (!aborted) {
          // Accepte soit un tableau direct, soit { items: [...] }
          const items = Array.isArray(data) ? data : data.items ?? [];
          setUsers(items);
          console.log(
            "User IDs:",
            items.map((u) => u.id)
          );
        }
      } catch (e) {
        if (!aborted) {
          setError(
            e.message || "Erreur lors de la récupération des utilisateurs"
          );
        }
      } finally {
        if (!aborted) setIsLoading(false);
      }
    }

    fetchUsers();
    return () => {
      aborted = true;
    };
  }, [navigate]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const nom = `${u?.nom ?? ""} ${u?.prenom ?? ""}`.toLowerCase();
      return (
        nom.includes(q) ||
        (u?.cin ?? "").toLowerCase().includes(q) ||
        (u?.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  // ➜ Reset à la page 1 quand filtre/recherche/taille changent
  useEffect(() => {
    setPage(1);
  }, [users, search]);

  // Pagination
  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageItems = filteredUsers.slice(start, end);
  const prevDisabled = safePage <= 1;
  const nextDisabled = safePage >= totalPages;

  const goPrev = () => !prevDisabled && setPage(safePage - 1);
  const goNext = () => !nextDisabled && setPage(safePage + 1);

  return (
    <div className=" py-3">
      <div className="text-center mb-5">
        <h2 className="display-6 fw-bold text-info">
          <i className="fas fa-hospital-user me-2"></i>
          Liste des Patients
        </h2>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row justify-content-center mb-5">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              id="searchInput"
              className="form-control border-start-0"
              placeholder="Rechercher par nom, CIN ou email..."
              aria-label="Search patients"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Chargement…</div>
      ) : (
        <div className="table-responsive">
          <table
            className="table table-hover table-bordered align-middle"
            role="grid"
            aria-label="Patient list"
          >
            <thead className="table-primary">
              <tr>
                <th scope="col" className="text-center" style={{ width: 150 }}>
                  <i className="bi bi-person"></i>{" "}
                  <i className="bi bi-image"></i>
                </th>
                <th scope="col">Nom complet</th>
                <th scope="col">CIN</th>
                <th scope="col">Téléphone</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Aucun patient trouvé
                  </td>
                </tr>
              ) : (
                pageItems.map((user) => (
                  <tr key={user.id}>
                    <td className="text-center">
                      <AvatarWithPreview patient={user} />
                    </td>
                    <td>{`${user?.nom ?? ""} ${user?.prenom ?? ""}`}</td>
                    <td>{user?.cin || "—"}</td>
                    <td>{user?.telephone || "—"}</td>
                    <td>{user?.email || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-2 mt-2">
        <div className="btn-group btn-group-sm">
          <button
            className="btn btn-outline-secondary"
            onClick={goPrev}
            disabled={prevDisabled}
            aria-label="Précédent"
          >
            <i className="bi bi-chevron-left" /> Préc
          </button>
          <span className="btn btn-outline-secondary disabled">
            Page {safePage} / {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary"
            onClick={goNext}
            disabled={nextDisabled}
            aria-label="Suivant"
          >
            Suiv <i className="bi bi-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientList;
