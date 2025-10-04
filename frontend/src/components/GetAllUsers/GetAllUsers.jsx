import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";

function GetAllUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //filters
  const [filterRole, setFilterRole] = useState("all");
  const [searchInput, setSearchInput] = useState(""); // ce que l'utilisateur tape
  const [searchTerm, setSearchTerm] = useState(""); // terme appliqué (en cliquant sur Search)

  // Pagination (front)
  const [pageSize, setPageSize] = useState(10); // nb d'éléments par page
  const [page, setPage] = useState(1); // page courante (1-based)

  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }
        const data = await response.json();
        setUsers(data);
        console.log(
          "User IDs:",
          data.map((u) => u.id)
        );
      } catch (error) {
        setError(
          error.message || "Erreur lors de la récupération des Utilisateurs"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [navigate]);

  // Helpers
  const normalize = (v) =>
    (v ?? "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "") // retire les accents
      .trim();

  const matchesSearch = (u) => {
    if (!searchTerm) return true;
    const q = normalize(searchTerm);

    const cin = normalize(u.cin);
    const tel = normalize(u.telephone);
    const email = normalize(u.email);
    const nom = normalize(u.nom);
    const prenom = normalize(u.prenom);
    const fullName = `${nom} ${prenom}`.trim();
    const fullNameInv = `${prenom} ${nom}`.trim(); // au cas où l'utilisateur tape "prenom nom"

    return (
      cin.includes(q) ||
      tel.includes(q) ||
      email.includes(q) ||
      fullName.includes(q) ||
      fullNameInv.includes(q)
    );
  };

  // Filtrage des utilisateurs selon le rôle choisi
  // const filteredUsers =
  //   filterRole === "all"
  //     ? users
  //     : users.filter((u) => u.role && u.role.toLowerCase() === filterRole);
  // Filtrage combiné (rôle + recherche)
  const filteredUsers = useMemo(() => {
    const byRole =
      filterRole === "all"
        ? users
        : users.filter(
            (u) => (u.role ? String(u.role).toLowerCase() : "") === filterRole
          );
    return byRole.filter(matchesSearch);
  }, [users, filterRole, searchTerm]);

  // ➜ Reset à la page 1 quand filtre/recherche/taille changent
  useEffect(() => {
    setPage(1);
  }, [filterRole, searchTerm, pageSize]);

  // Pagination: calculs + découpage
  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = total === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = filteredUsers.slice(startIndex, endIndex);

  const prevDisabled = safePage <= 1;
  const nextDisabled = safePage >= totalPages;

  const goPrev = () => {
    if (!prevDisabled) setPage(safePage - 1);
  };
  const goNext = () => {
    if (!nextDisabled) setPage(safePage + 1);
  };

  // Actions Search
  // const applySearch = () => setSearchTerm(searchInput);
  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };
  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") applySearch();
  // };

  return (
    <div className="m-5">
      <h3 className="text-center mb-5">Liste de tous les utilisateurs</h3>

      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <label className="me-2 fw-bold">Filter by:</label>
          <select
            className="form-select w-auto"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Tous</option>
            <option value="patient">Patient</option>
            <option value="medecin">Médecin</option>
            <option value="receptionniste">Réceptionniste</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold">Search:</label>
          <input
            type="text"
            className="form-control"
            placeholder="CIN, téléphone, email ou nom complet…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ minWidth: 280 }}
          />
          {searchTerm && (
            <button className="btn btn-outline-secondary" onClick={clearSearch}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Sélecteur "Par page" */}
      <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
        <span className="small text-body-secondary">Par page</span>
        <select
          className="form-select form-select-sm w-auto"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[2,5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

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
                <th scope="col">Cin</th>
                <th scope="col">Nom</th>
                <th scope="col">Prénom</th>
                <th scope="col">Email</th>
                <th scope="col">Téléphone</th>
                <th scope="col">Role</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Aucun user trouvé
                  </td>
                </tr>
              ) : (
                pageItems.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.cin}</td>
                    <td>{user.nom}</td>
                    <td>{user.prenom}</td>
                    <td>{user.email}</td>
                    <td>{user.telephone || "N/A"}</td>
                    <td>{user.role || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch gap-2 mb-3 tbl-footer">
        <div className="small text-body-secondary">
          {total === 0
            ? "Affichage 0 sur 0 résultat"
            : `Affichage ${
                startIndex + 1
              }–${endIndex} sur ${total} résultat(s)`}
          {" • "}
          Page {total === 0 ? 0 : page} / {total === 0 ? 0 : totalPages}
        </div>
        <div className="btn-group btn-group-sm">
          <button
            className="btn btn-outline-secondary"
            onClick={goPrev}
            disabled={prevDisabled}
            aria-label="Précédent"
          >
            <i className="bi bi-chevron-left" />
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={goNext}
            disabled={nextDisabled}
            aria-label="Suivant"
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GetAllUsers;

// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";

// function GetAllUsers() {
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Filtres
//   const [filterRole, setFilterRole] = useState("all");
//   const [searchInput, setSearchInput] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const navigate = useNavigate();

//   // Debounce 300ms
//   useEffect(() => {
//     const id = setTimeout(() => setSearchTerm(searchInput), 300);
//     return () => clearTimeout(id);
//   }, [searchInput]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
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
//         setUsers(data);
//       } catch (error) {
//         setError(
//           error.message || "Erreur lors de la récupération des Utilisateurs"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [navigate]);

//   // Helpers
//   const normalize = (v) =>
//     (v ?? "")
//       .toString()
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/\p{Diacritic}/gu, "")
//       .trim();

//   const matchesSearch = (u) => {
//     if (!searchTerm) return true;
//     const q = normalize(searchTerm);

//     const cin = normalize(u.cin);
//     const tel = normalize(u.telephone);
//     const email = normalize(u.email);
//     const nom = normalize(u.nom);
//     const prenom = normalize(u.prenom);
//     const fullName = `${nom} ${prenom}`.trim();
//     const fullNameInv = `${prenom} ${nom}`.trim();

//     return (
//       cin.includes(q) ||
//       tel.includes(q) ||
//       email.includes(q) ||
//       fullName.includes(q) ||
//       fullNameInv.includes(q)
//     );
//   };

//   const roleBadge = (role) => {
//     const r = (role || "").toString().toUpperCase();
//     const map = {
//       ADMIN: "bg-danger-subtle text-danger border-danger",
//       MEDECIN: "bg-primary-subtle text-primary border-primary",
//       PATIENT: "bg-success-subtle text-success border-success",
//       RECEPTIONNISTE: "bg-warning-subtle text-warning border-warning",
//     };
//     const cls = map[r] || "bg-secondary-subtle text-secondary border-secondary";
//     return (
//       <span className={`badge rounded-pill border fw-semibold ${cls}`}>
//         {r || "N/A"}
//       </span>
//     );
//   };

//   // Filtrage combiné (rôle + recherche)
//   const filteredUsers = useMemo(() => {
//     const byRole =
//       filterRole === "all"
//         ? users
//         : users.filter(
//             (u) => (u.role ? String(u.role).toLowerCase() : "") === filterRole
//           );
//     return byRole.filter(matchesSearch);
//   }, [users, filterRole, searchTerm]);

//   const clearSearch = () => {
//     setSearchInput("");
//     setSearchTerm("");
//   };

//   return (
//     <div className="container py-4">
//       <div className="card shadow-sm border-0 admin-card">
//         <div className="card-body">
//           {/* ---- Header dans la card ---- */}
//           <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-3">
//             <div>
//               <h5 className="fw-bold text-dark-emphasis mb-1">
//                 Liste de tous les utilisateurs
//               </h5>
//               <div className="text-body-secondary small">
//                 Total: {users.length} • Filtrés: {filteredUsers.length}
//               </div>
//             </div>
//           </div>

//           {/* ---- Toolbar (Filter + Search) ---- */}
//           <div className="row g-2 align-items-center mb-3">
//             <div className="col-12 col-lg-6 d-flex align-items-center gap-2">
//               <label className="fw-semibold small text-body-secondary">
//                 Filter by
//               </label>
//               <select
//                 className="form-select form-select-sm w-auto"
//                 value={filterRole}
//                 onChange={(e) => setFilterRole(e.target.value)}
//               >
//                 <option value="all">Tous</option>
//                 <option value="patient">Patient</option>
//                 <option value="medecin">Médecin</option>
//                 <option value="receptionniste">Réceptionniste</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             <div className="col-12 col-lg-6">
//               <div className="input-group input-group-sm">
//                 <span className="input-group-text bg-light-subtle border-0">
//                   <i className="bi bi-search"></i>
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="CIN, téléphone, email ou nom complet…"
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                 />
//                 {searchTerm && (
//                   <button
//                     className="btn btn-outline-secondary"
//                     type="button"
//                     onClick={clearSearch}
//                   >
//                     <i className="bi bi-x-circle"></i> Clear
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ---- Table ---- */}
//           <div className="table-responsive admin-table-wrapper">
//             <table className="table table-sm align-middle table-hover admin-table mb-0">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Cin</th>
//                   <th>Nom</th>
//                   <th>Prénom</th>
//                   <th>Email</th>
//                   <th>Téléphone</th>
//                   <th>Role</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {error && (
//                   <tr>
//                     <td colSpan="7">
//                       <div className="alert alert-danger mb-0">{error}</div>
//                     </td>
//                   </tr>
//                 )}

//                 {isLoading ? (
//                   <tr>
//                     <td colSpan="7" className="text-center py-4">
//                       <div
//                         className="spinner-border spinner-border-sm me-2"
//                         role="status"
//                       />
//                       Chargement…
//                     </td>
//                   </tr>
//                 ) : filteredUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="py-4">
//                       <div className="d-flex flex-column align-items-center text-body-secondary">
//                         <i className="bi bi-people fs-1 mb-2"></i>
//                         <div className="fw-semibold">
//                           Aucun utilisateur trouvé
//                         </div>
//                         <div className="small">
//                           Ajuste le filtre ou la recherche.
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredUsers.map((u) => (
//                     <tr key={u.id}>
//                       <td className="text-muted">{u.id}</td>
//                       <td className="fw-semibold">{u.cin}</td>
//                       <td>{u.nom}</td>
//                       <td>{u.prenom}</td>
//                       <td>
//                         <a
//                           href={`mailto:${u.email}`}
//                           className="link-body-emphasis text-decoration-none"
//                         >
//                           {u.email}
//                         </a>
//                       </td>
//                       <td>
//                         {u.telephone ? (
//                           <a
//                             href={`tel:${u.telephone}`}
//                             className="link-body-emphasis text-decoration-none"
//                           >
//                             {u.telephone}
//                           </a>
//                         ) : (
//                           <span className="text-body-secondary">N/A</span>
//                         )}
//                       </td>
//                       <td>{roleBadge(u.role)}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* ---- Footer ---- */}
//           <div className="d-flex justify-content-between align-items-center pt-3">
//             <div className="small text-body-secondary">
//               Affichage {filteredUsers.length} sur {filteredUsers.length}{" "}
//               résultat(s)
//             </div>
//             <div
//               className="btn-group btn-group-sm"
//               role="group"
//               aria-label="Pagination simple"
//             >
//               <button className="btn btn-outline-secondary" disabled>
//                 <i className="bi bi-chevron-left"></i>
//               </button>
//               <button className="btn btn-outline-secondary" disabled>
//                 <i className="bi bi-chevron-right"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GetAllUsers;

// GetAllUsers.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "./GetAllUsers.css";

// const ROLES = ["all", "patient", "medecin", "receptionniste", "admin"];

// function GetAllUsers() {
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Filtres
//   const [filterRole, setFilterRole] = useState("all");
//   const [searchInput, setSearchInput] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const navigate = useNavigate();

//   // Debounce 250ms
//   useEffect(() => {
//     const id = setTimeout(() => setSearchTerm(searchInput), 250);
//     return () => clearTimeout(id);
//   }, [searchInput]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }
//         const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         });
//         if (!res.ok) {
//           const e = await res.json().catch(() => ({}));
//           throw new Error(e.message || `HTTP ${res.status}`);
//         }
//         const data = await res.json();
//         setUsers(data);
//       } catch (e) {
//         setError(e.message || "Erreur lors de la récupération des utilisateurs.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [navigate]);

//   // Helpers
//   const normalize = (v) =>
//     (v ?? "")
//       .toString()
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/\p{Diacritic}/gu, "")
//       .trim();

//   const matchesSearch = (u) => {
//     if (!searchTerm) return true;
//     const q = normalize(searchTerm);
//     const cin = normalize(u.cin);
//     const tel = normalize(u.telephone);
//     const email = normalize(u.email);
//     const nom = normalize(u.nom);
//     const prenom = normalize(u.prenom);
//     const fullName = `${nom} ${prenom}`.trim();
//     const fullNameInv = `${prenom} ${nom}`.trim();
//     return (
//       cin.includes(q) ||
//       tel.includes(q) ||
//       email.includes(q) ||
//       fullName.includes(q) ||
//       fullNameInv.includes(q)
//     );
//   };

//   const roleBadge = (role) => {
//     const r = (role || "").toString().toUpperCase();
//     return <span className={`role-badge role-${r || "NA"}`}>{r || "N/A"}</span>;
//   };

//   // Filtrage combiné
//   const filteredUsers = useMemo(() => {
//     const byRole =
//       filterRole === "all"
//         ? users
//         : users.filter(
//             (u) => (u.role ? String(u.role).toLowerCase() : "") === filterRole
//           );
//     return byRole.filter(matchesSearch);
//   }, [users, filterRole, searchTerm]);

//   const clearSearch = () => {
//     setSearchInput("");
//     setSearchTerm("");
//   };

//   return (
//     <div className="container py-4">
//       <div className="card admin-v2">
//         <div className="card-header d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center gap-2">
//             <span className="hdr-icon">👥</span>
//             <div>
//               <div className="hdr-title">Liste de tous les utilisateurs</div>
//               <div className="hdr-meta">
//                 Total: {users.length} • Filtrés: {filteredUsers.length}
//               </div>
//             </div>
//           </div>

//           <div className="search-ghost">
//             <i className="bi bi-search" />
//             <input
//               type="text"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="CIN, téléphone, email ou nom complet…"
//             />
//             {searchTerm && (
//               <button className="clear" onClick={clearSearch} aria-label="Effacer">
//                 <i className="bi bi-x-lg" />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="card-body">
//           {/* Segmented filter */}
//           <div className="segmented" role="tablist" aria-label="Filtrer par rôle">
//             {ROLES.map((r) => (
//               <button
//                 key={r}
//                 className={`seg-item ${filterRole === r ? "active" : ""}`}
//                 onClick={() => setFilterRole(r)}
//                 role="tab"
//                 aria-selected={filterRole === r}
//               >
//                 {r === "all" ? "Tous" : r.charAt(0).toUpperCase() + r.slice(1)}
//               </button>
//             ))}
//           </div>

//           {/* Feedbacks */}
//           {error && <div className="alert alert-danger mb-3">{error}</div>}
//           {isLoading && (
//             <div className="loading muted mb-2">
//               <span className="spinner-border spinner-border-sm me-2" />
//               Chargement…
//             </div>
//           )}

//           {/* Table */}
//           <div className="table-responsive table-wrap">
//             <table className="table table-modern table-hover align-middle mb-0">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>CIN</th>
//                   <th>Nom</th>
//                   <th>Prénom</th>
//                   <th>Email</th>
//                   <th>Téléphone</th>
//                   <th>Rôle</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {!isLoading && filteredUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="text-center py-4 text-secondary">
//                       Aucun utilisateur trouvé. Ajuste le filtre ou la recherche.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredUsers.map((u) => (
//                     <tr key={u.id}>
//                       <td className="text-muted">{u.id}</td>
//                       <td className="fw-semibold">{u.cin}</td>
//                       <td>{u.nom}</td>
//                       <td>{u.prenom}</td>
//                       <td>
//                         <a className="link-body-emphasis text-decoration-none" href={`mailto:${u.email}`}>
//                           {u.email}
//                         </a>
//                       </td>
//                       <td>
//                         {u.telephone ? (
//                           <a className="link-body-emphasis text-decoration-none" href={`tel:${u.telephone}`}>
//                             {u.telephone}
//                           </a>
//                         ) : (
//                           <span className="text-body-secondary">N/A</span>
//                         )}
//                       </td>
//                       <td>{roleBadge(u.role)}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer simple (placeholder pagination) */}
//           <div className="tbl-footer">
//             <div className="small text-body-secondary">
//               Affichage {filteredUsers.length} sur {filteredUsers.length} résultat(s)
//             </div>
//             <div className="btn-group btn-group-sm">
//               <button className="btn btn-outline-secondary" disabled>
//                 <i className="bi bi-chevron-left" />
//               </button>
//               <button className="btn btn-outline-secondary" disabled>
//                 <i className="bi bi-chevron-right" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GetAllUsers;
