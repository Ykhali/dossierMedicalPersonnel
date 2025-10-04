// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";

// function GetAllDeletedUsers() {
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDeletedUsers = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const response = await fetch(`${API_BASE_URL}/api/admin/deletedUsers`, {
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
//         console.log(
//           "User IDs:",
//           users.map((u) => u.id)
//         );
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
//     fetchDeletedUsers();
//   }, [navigate]);

//   const handleActivateAccount = async (id) => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `${API_BASE_URL}/api/admin/users/${id}/reactivate`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.message || `HTTP error! Status: ${response.status}`
//         );
//       }
//       await fetchDeletedUsers();
//     } catch (error) {
//       setError(error.message || "Erreur lors de la reactivation du compte");
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="m-5">
//       <h3 className="text-center mb-5">Liste de tous les utilisateurs</h3>

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
//                 <th scope="col">Cin</th>
//                 <th scope="col">Nom</th>
//                 <th scope="col">Prénom</th>
//                 <th scope="col">Email</th>
//                 <th scope="col">Téléphone</th>
//                 <th scope="col">Role</th>
//                 <th scope="col">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center">
//                     Aucun user trouvé
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((user) => (
//                   <tr key={user.id}>
//                     <td>{user.id}</td>
//                     <td>{user.cin}</td>
//                     <td>{user.nom}</td>
//                     <td>{user.prenom}</td>
//                     <td>{user.email}</td>
//                     <td>{user.telephone || "N/A"}</td>
//                     <td>{user.role || "N/A"}</td>
//                     <td>
//                       <div
//                         className="d-flex gap-2 d-md-flex
//                       justify-content-md-center buttons"
//                       >
//                         <button
//                           className="btn btn-outline-success"
//                           onClick={() => handleActivateAccount(user.id)}
//                           disabled={isLoading}
//                         >
//                           réactiver
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

// export default GetAllDeletedUsers;

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";

function GetAllDeletedUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, pageSize]);

  const fetchDeletedUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/deletedUsers`, {
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
      setUsers(data || []);
    } catch (error) {
      setError(
        error.message || "Erreur lors de la récupération des Utilisateurs"
      );
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchDeletedUsers();
  }, [navigate]);

  const clearSearch = () => setSearchInput("");

  // Apply search + pagination (memoized)
  const filteredUsers = useMemo(
    () => users.filter(matchesSearch),
    [users, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filteredUsers.slice(start, start + pageSize);

  const handleActivateAccount = async (id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${id}/reactivate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      // ✅ refresh the list after reactivation
      await fetchDeletedUsers();
    } catch (error) {
      setError(error.message || "Erreur lors de la reactivation du compte");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-5">
      <h3 className="text-center mb-5">Liste de tous les utilisateurs</h3>

      <div className="d-flex align-items-center gap-2 mb-3">
        <label className="fw-bold mb-0">Search:</label>
        <input
          type="text"
          className="form-control border border-dark"
          placeholder="CIN, téléphone, email ou nom complet…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ minWidth: 280, maxWidth: 420 }}
        />
        {searchTerm && (
          <button className="btn btn-outline-secondary" onClick={clearSearch}>
            Clear
          </button>
        )}

        <div className="ms-auto d-flex align-items-center gap-2">
          <span className="text-muted small">
            {filteredUsers.length} résultat(s)
          </span>
          <select
            className="form-select form-select-sm"
            style={{ width: 100 }}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Chargement...</div>
      ) : (
        <>
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
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    {/* you have 8 columns in header → colspan must be 8 */}
                    <td colSpan="8" className="text-center">
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
                      <td>
                        <div className="d-flex gap-2 justify-content-md-center">
                          <button
                            className="btn btn-outline-success"
                            onClick={() => handleActivateAccount(user.id)}
                            disabled={isLoading}
                          >
                            réactiver
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination controls */}
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Page {currentPage} / {totalPages}
            </small>
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Précédent
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GetAllDeletedUsers;
