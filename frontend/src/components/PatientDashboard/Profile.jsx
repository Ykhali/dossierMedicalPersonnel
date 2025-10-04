// import React, { useEffect, useRef, useState } from "react";
// import API_BASE_URL from "../../config/apiConfig";
// import { useNavigate } from "react-router-dom";
// import defaultAvatar from '../../assets/Images/defaultAvatar.jpeg';
// // Bootstrap CSS
// import "bootstrap/dist/css/bootstrap.min.css";
// // Bootstrap Icons (pour les flèches, icônes profil, email, téléphone, etc.)
// import "bootstrap-icons/font/bootstrap-icons.css";
// // (Optionnel) Bootstrap JS si tu utilises Dropdowns, Modals, etc.
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

// function Profile() {
//   const [photoUrl, setPhotoUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [infos, setInfos] = useState([])
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [src, setSrc] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const fileRef = useRef(null);
//   const handleMonCompteClick = () => navigate("/PatientDash/Account");

//   useEffect(() => {
//     let url; // pour révoquer l’ObjectURL
//     const controller = new AbortController();

//     (async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const res = await fetch(`${API_BASE_URL}/api/Patient/myImage`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}` // important
//           },
//           signal: controller.signal,
//         });

//         if (res.status === 404) {
//           setSrc(defaultAvatar);
//           return;
//         }
//         if (!res.ok) throw new Error(`HTTP_${res.status}`);

//         const blob = await res.blob();
//         url = URL.createObjectURL(blob);
//         setSrc(url);
//       } catch (e) {
//         setErr(e.message);
//         setSrc(defaultAvatar); // fallback
//       }
//     })();

//     return () => {
//       controller.abort();
//       if (url) URL.revokeObjectURL(url);
//     };
//   }, [navigate]);

//   useEffect(() => {
//     const fetchInfos = async () => {
//         setIsLoading(true);
//         setError(null);
//         try{
//             const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }
//         const res = await fetch(`${API_BASE_URL}/api/Patient/infos`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         });
//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(
//             errorData.message || `HTTP error! Status: ${res.status}`
//           );
//         }

//         const data = await res.json();
//         setInfos(data);

//         } catch(error){
//             setError(
//               error.message || "Erreur lors de la récupération des patients"
//             );
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     fetchInfos();
//   }, [navigate])

//   const handlePick = () => fileRef.current?.click();
//   const handleChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // instant preview
//     const localUrl = URL.createObjectURL(file);
//     setSrc(localUrl);

//     // upload
//     try {
//       setUploading(true);
//       setError(null);
//       const token = localStorage.getItem("token");
//       const fd = new FormData();
//       fd.append("file", file);

//       const res = await fetch(`${API_BASE_URL}/api/Patient/upload-photo`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` }, // ne PAS mettre Content-Type avec FormData
//         body: fd,
//       });

//       if (!res.ok) throw new Error(`Upload failed (HTTP ${res.status})`);
//       // Option: re-fetch /myImage si ton backend renvoie un chemin différent
//     } catch (e) {
//       setError(e.message || "Erreur d’upload");
//       setSrc(defaultAvatar);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="containe mt-5">
//       <div className="row justify-content-center">
//         <div className="col-10 col-lg-8">
//           <button
//             className="btn text-dark d-flex align-items-center text-decoration-none border border-dark"
//             onClick={handleMonCompteClick}
//           >
//             <i className="bi bi-chevron-left me-2"></i> Mon compte
//           </button>
//           <h1 className="h3 fw-bold mb-4">Mon Profil</h1>
//           <div className="d-flex gap-4">
//             <div className="col-lg-6">
//               <div
//                 className="position-relative d-inline-block"
//                 style={{ width: "70%", height: "100%" }}
//               >
//                 <img
//                   src={src || defaultAvatar}
//                   alt="Photo de profil"
//                   className="rounded-circle border border-dark"
//                   style={{ width: 300, height: 300, objectFit: "cover" }}
//                   title={
//                     error
//                       ? "Image par défaut (erreur de chargement)"
//                       : "Photo de profil"
//                   }
//                 />

//                 {/* Top-left Modifier button */}
//                 <button
//                   type="button"
//                   onClick={handlePick}
//                   className="btn btn-sm btn-secondary text-light fw-bold position-absolute top-0 start-0 m-2 d-flex align-items-center gap-1 shadow"
//                   disabled={uploading}
//                   title="Modifier la photo"
//                 >
//                   <i className="bi bi-pencil-square" />
//                   {uploading ? "Envoi..." : "Modifier"}
//                 </button>

//                 {/* Hidden file input */}
//                 <input
//                   ref={fileRef}
//                   type="file"
//                   accept="image/*"
//                   className="d-none"
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div className="col-lg-6">
//               {/* tes autres infos ici */}
//               <h5 className="mb-2">Informations</h5>
//               <div>
//                 <div>Nom: {infos.nom}</div>
//                 <div>Prenom: {infos.prenom}</div>
//                 <div>CIN: {infos.cin}</div>
//                 <div>E-mail: {infos.email}</div>
//                 <div>Adresse: {infos.adresse}</div>
//                 <div>Date De Naissance: {infos?.datedenaissance}</div>
//                 <div>Telephone: {infos.nom}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;
import React, { useEffect, useRef, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/Images/defaultAvatar.jpeg";
import "bootstrap-icons/font/bootstrap-icons.css";
import EditInfo from "./EditInfo";

function Profile() {
  const [src, setSrc] = useState(null); // image preview/src
  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [infosLoading, setInfosLoading] = useState(true);
  const [infos, setInfos] = useState({});
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [showEdit, setShowEdit] = useState(false);

  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleMonCompteClick = () => navigate("/PatientDash/Account");
  const handlePick = () => fileRef.current?.click();

  // Helpers
  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return d;
    }
  };
  // --- Helpers âge ---
  const parseDobToDate = (input) => {
    if (!input) return null;
    if (input instanceof Date) return input;

    if (typeof input === "string") {
      // 1) Essai natif (gère "1999-08-26", "1999-08-26T00:00:00Z", etc.)
      const iso = new Date(input);
      if (!isNaN(iso.getTime())) return iso;

      // 2) dd/MM/yyyy ou dd-MM-yyyy
      const m = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
      if (m) {
        const dd = parseInt(m[1], 10);
        const mm = parseInt(m[2], 10) - 1; // 0-based
        let yyyy = parseInt(m[3], 10);
        if (yyyy < 100) yyyy += 1900; // safety
        const d = new Date(yyyy, mm, dd);
        if (!isNaN(d.getTime())) return d;
      }
    }
    return null;
  };

  const calcAgeFromDob = (dob) => {
    const d = parseDobToDate(dob);
    if (!d) return null;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const monthDiff = today.getMonth() - d.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  // Fetch profile image (Blob -> ObjectURL)
  useEffect(() => {
    let objectUrl;
    const controller = new AbortController();

    (async () => {
      try {
        setLoadingPhoto(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/Patient/myImage`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (res.status === 404 || res.status === 204) {
          setSrc(defaultAvatar);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      } catch (e) {
        setError(e.message || "Erreur lors du chargement de l’image");
        setSrc(defaultAvatar);
      } finally {
        setLoadingPhoto(false);
      }
    })();

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [navigate]);

  // Fetch profile infos
  useEffect(() => {
    (async () => {
      try {
        setInfosLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/Patient/infos`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          let msg = `HTTP ${res.status}`;
          try {
            const errData = await res.json();
            msg = errData.message || msg;
          } catch {}
          throw new Error(msg);
        }

        const data = await res.json();
        setInfos(data || {});
      } catch (e) {
        setError(
          e.message || "Erreur lors de la récupération des informations"
        );
      } finally {
        setInfosLoading(false);
      }
    })();
  }, [navigate]);

  // Upload new photo
  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview
    const localUrl = URL.createObjectURL(file);
    setSrc(localUrl);

    try {
      setUploading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${API_BASE_URL}/api/Patient/upload-photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // no Content-Type for FormData
        body: fd,
      });

      if (!res.ok) throw new Error(`Upload failed (HTTP ${res.status})`);
      // Optional: re-fetch image endpoint if backend transforms/stores differently
    } catch (e) {
      setError(e.message || "Erreur d’upload");
      setSrc(defaultAvatar);
    } finally {
      setUploading(false);
    }
  };

  const age = calcAgeFromDob(infos?.datedenaissance);

  return (
    <div className="containe mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <button
            className="btn text-dark d-inline-flex align-items-center border border-dark mb-3"
            onClick={handleMonCompteClick}
          >
            <i className="bi bi-chevron-left me-2"></i> Mon compte
          </button>

          <h1 className="h4 fw-bold mb-4">Mon Profil</h1>

          {error && (
            <div
              className="alert alert-warning d-flex align-items-center"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="  ">
            <div className="row g-0 align-items-stretch">
              {/* LEFT: Photo */}
              <div className="col-12 col-lg-6 p-4 d-flex justify-content-center">
                <div className="position-relative">
                  {loadingPhoto ? (
                    <div
                      className="bg-light rounded-circle"
                      style={{ width: 300, height: 300 }}
                    />
                  ) : (
                    <img
                      src={src || defaultAvatar}
                      alt="Photo de profil"
                      className="rounded-circle border"
                      style={{ width: 300, height: 300, objectFit: "cover" }}
                      title="Photo de profil"
                      onError={(e) => (e.currentTarget.src = defaultAvatar)}
                    />
                  )}

                  <button
                    type="button"
                    onClick={handlePick}
                    className="btn btn-sm btn-secondary text-light fw-bold position-absolute top-0 start-0 m-2 d-flex align-items-center gap-1 shadow"
                    disabled={uploading || loadingPhoto}
                    title="Modifier la photo"
                  >
                    <i className="bi bi-camera"></i>
                    {uploading ? "Envoi..." : "Modifier"}
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* RIGHT: Infos */}
              <div className="col-12 col-lg-6 p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">
                      {infos?.nom && infos?.prenom
                        ? `${infos.prenom} ${infos.nom} (${age} ans)`
                        : infos?.fullName || "—"}
                    </h5>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-info text-dark fw-bold btn-sm"
                    onClick={() => setShowEdit(true)}
                  >
                    <i className="bi bi-pencil-square me-1 text-primary"></i>{" "}
                    Modifier
                  </button>
                </div>

                {infosLoading ? (
                  <>
                    <div className="placeholder-glow mb-2">
                      <span className="placeholder col-8"></span>
                    </div>
                    <div className="placeholder-glow mb-2">
                      <span className="placeholder col-6"></span>
                    </div>
                    <div className="placeholder-glow mb-2">
                      <span className="placeholder col-7"></span>
                    </div>
                    <div className="placeholder-glow">
                      <span className="placeholder col-5"></span>
                    </div>
                  </>
                ) : (
                  // <div className="row">
                  //   <div className="col-12 col-lg-6">
                  //     <div className="list-group list-group-flush">
                  //       <div className="list-group-item px-0 d-flex align-items-center">
                  //         <i className="bi bi-cake2 me-2 text-primary"></i>
                  //         <div>
                  //           <div className="small text-muted">
                  //             Date de naissance
                  //           </div>
                  //           <div className="fw-medium">
                  //             {fmtDate(infos?.datedenaissance)}
                  //           </div>
                  //         </div>
                  //       </div>
                  //       <div className="list-group-item px-0 d-flex align-items-center">
                  //         <i className="bi bi-geo-alt me-2 text-primary"></i>
                  //         <div>
                  //           <div className="small text-muted">Adresse</div>
                  //           <div className="fw-medium">
                  //             {infos?.adresse || "—"}
                  //           </div>
                  //         </div>
                  //       </div>

                  //       <div className="list-group-item px-0 d-flex align-items-center">
                  //         <i className="bi bi-envelope me-2 text-primary"></i>
                  //         <div>
                  //           <div className="small text-muted">E‑mail</div>
                  //           <div className="fw-medium">
                  //             {infos?.email || "—"}
                  //           </div>
                  //         </div>
                  //       </div>
                  //       <div className="d-flex">
                  //         <div className="list-group-item px-0 d-flex align-items-center">
                  //           <i className="bi bi-person-vcard me-2 text-primary"></i>
                  //           <div>
                  //             <div className="small text-muted">CIN</div>
                  //             <div className="fw-medium">
                  //               {infos?.cin || "—"}
                  //             </div>
                  //           </div>
                  //         </div>
                  //         <div className="list-group-item px-0 d-flex align-items-center">
                  //           <i className="bi bi-telephone me-2 text-primary"></i>
                  //           <div>
                  //             <div className="small text-muted">Téléphone</div>
                  //             <div className="fw-medium">
                  //               {infos?.telephone || "—"}
                  //             </div>
                  //           </div>
                  //         </div>
                  //       </div>
                  //     </div>
                  //   </div>

                  //   {/* <div className="col-12 col-lg-6">
                  //     <div className="list-group list-group-flush">
                  //       <div className="list-group-item px-0 d-flex align-items-center">
                  //         <i className="bi bi-geo-alt me-2 text-primary"></i>
                  //         <div>
                  //           <div className="small text-muted">Adresse</div>
                  //           <div className="fw-medium">
                  //             {infos?.adresse || "—"}
                  //           </div>
                  //         </div>
                  //       </div>
                  //       <div className="list-group-item px-0 d-flex align-items-center">
                  //         <i className="bi bi-cake2 me-2 text-primary"></i>
                  //         <div>
                  //           <div className="small text-muted">
                  //             Date de naissance
                  //           </div>
                  //           <div className="fw-medium">
                  //             {fmtDate(infos?.datedenaissance)}
                  //           </div>
                  //         </div>
                  //       </div>
                  //     </div>
                  //   </div> */}
                  // </div>
                  // <div className="row">
                  //   <div className="col-12 col-lg-6">
                  //     <div className="list-group list-group-flush">
                  //       {/* Date de naissance */}
                  //       <div className="list-group-item px-0 py-3 d-flex align-items-center">
                  //         <i className="bi bi-cake2 me-3 text-primary fs-5 flex-shrink-0"></i>
                  //         <div className="flex-grow-1">
                  //           <div className="small text-muted">
                  //             Date de naissance
                  //           </div>
                  //           <div className="fw-semibold">
                  //             {fmtDate(infos?.datedenaissance)}
                  //             {age != null && (
                  //               <span className="text-secondary">
                  //                 {" "}
                  //                 ({age} ans)
                  //               </span>
                  //             )}
                  //           </div>
                  //         </div>
                  //       </div>

                  //       {/* Adresse */}
                  //       <div className="list-group-item px-0 py-3 d-flex align-items-center">
                  //         <i className="bi bi-geo-alt me-3 text-danger fs-5 flex-shrink-0"></i>
                  //         <div className="flex-grow-1">
                  //           <div className="small text-muted">Adresse</div>
                  //           <div className="fw-semibold">
                  //             {infos?.adresse || "—"}
                  //           </div>
                  //         </div>
                  //       </div>

                  //       {/* Email */}
                  //       <div className="list-group-item px-0 py-3 d-flex align-items-center">
                  //         <i className="bi bi-envelope me-3 text-success fs-5 flex-shrink-0"></i>
                  //         <div className="flex-grow-1">
                  //           <div className="small text-muted">E-mail</div>
                  //           <div className="fw-semibold">
                  //             {infos?.email || "—"}
                  //           </div>
                  //         </div>
                  //       </div>

                  //       {/* CIN & Téléphone sur une même ligne */}
                  //       <div className="d-flex w-100">
                  //         <div className="list-group-item px-0 py-3 d-flex align-items-center flex-fill me-2">
                  //           <i className="bi bi-person-vcard me-2 text-info fs-5 flex-shrink-0"></i>
                  //           <div>
                  //             <div className="small text-muted">CIN</div>
                  //             <div className="fw-semibold">
                  //               {infos?.cin || "—"}
                  //             </div>
                  //           </div>
                  //         </div>
                  //         <div className="list-group-item px-0 py-3 d-flex align-items-center flex-fill ms-2">
                  //           <i className="bi bi-telephone me-2 text-warning fs-5 flex-shrink-0"></i>
                  //           <div>
                  //             <div className="small text-muted">Téléphone</div>
                  //             <div className="fw-semibold">
                  //               {infos?.telephone || "—"}
                  //             </div>
                  //           </div>
                  //         </div>
                  //       </div>
                  //     </div>
                  //   </div>
                  // </div>
                  <div className="list-group list-group-flush">
                    <div className="list-group-item px-0 py-3">
                      <div className="row">
                        <div className="col-4 d-flex align-items-center text-muted small">
                          <i className="bi bi-cake2 text-primary fs-5 me-2"></i>
                          Date de naissance
                        </div>
                        <div className="col-8 fw-semibold">
                          {fmtDate(infos?.datedenaissance)}{" "}
                        </div>
                      </div>
                    </div>

                    <div className="list-group-item px-0 py-3">
                      <div className="row">
                        <div className="col-4 d-flex align-items-center text-muted small">
                          <i className="bi bi-geo-alt text-danger fs-5 me-2"></i>
                          Adresse
                        </div>
                        <div className="col-8 fw-semibold">
                          {infos?.adresse || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="list-group-item px-0 py-3">
                      <div className="row">
                        <div className="col-4 d-flex align-items-center text-muted small">
                          <i className="bi bi-envelope text-success fs-5 me-2"></i>
                          E-mail
                        </div>
                        <div className="col-8 fw-semibold">
                          {infos?.email || "—"}
                        </div>
                      </div>
                    </div>

                    {/* <div className="list-group-item px-0 py-3">
                      <div className="row">
                        <div className="col-4 d-flex align-items-center text-muted small">
                          <i className="bi bi-person-vcard text-info fs-5 me-2"></i>
                          CIN
                        </div>
                        <div className="col-8 fw-semibold">
                          {infos?.cin || "—"}
                        </div>
                      </div>
                    </div> */}

                    {/* <div className="list-group-item px-0 py-3">
                      <div className="row">
                        <div className="col-4 d-flex align-items-center text-muted small">
                          <i className="bi bi-telephone text-warning fs-5 me-2"></i>
                          Téléphone
                        </div>
                        <div className="col-8 fw-semibold">
                          {infos?.telephone || "—"}
                        </div>
                      </div>
                    </div> */}
                    <div className="list-group-item px-0 py-3 d-flex">
                      {/* CIN */}
                      <div className="d-flex align-items-center me-5 flex-fill">
                        <i className="bi bi-person-vcard text-info fs-5 me-2 flex-shrink-0"></i>
                        <div>
                          <div className="small text-muted">CIN</div>
                          <div className="fw-semibold">{infos?.cin || "—"}</div>
                        </div>
                      </div>

                      {/* Téléphone */}
                      <div className="d-flex align-items-center flex-fill">
                        <i className="bi bi-telephone text-warning fs-5 me-2 flex-shrink-0"></i>
                        <div>
                          <div className="small text-muted">Téléphone</div>
                          <div className="fw-semibold">
                            {infos?.telephone || "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <EditInfo
        show={showEdit}
        onClose={() => setShowEdit(false)}
        currentEmail={infos?.email}
        defaultValues={infos}
        onSave={async (payload) => {
          // Appelle ton endpoint d’update ici,
          // puis mets à jour ton état local si nécessaire
          // await fetch(...);
        }}
      /> */}
      <EditInfo
        show={showEdit}
        onClose={() => setShowEdit(false)}
        currentEmail={infos?.email}
        defaultValues={infos}
        onSave={async (payload) => {
          try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Session expirée");

            // Adapter les clés + normaliser avant envoi PATCH
            const mapped = {
              nom: payload.nom?.trim(),
              prenom: payload.prenom?.trim(),
              adresse: payload.adresse?.trim(),
              telephone: payload.telephone?.replace(/\s+/g, ""),
              cin: payload.cin?.trim(),
              dateNaissance: payload.datedenaissance, // mapping input -> back
              // UI (FEMININ/MASCULIN) -> Back (FEMME/HOMME)
              sexe: payload.sexe?.trim()
            };

            // Supprimer les champs vides pour un vrai PATCH partiel
            Object.keys(mapped).forEach((k) => {
              if (mapped[k] == null || mapped[k] === "") delete mapped[k];
            });

            const res = await fetch(
              `${API_BASE_URL}/api/Patient/update-info-perso`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(mapped),
              }
            );

            if (!res.ok) {
              const e = await res.json().catch(() => ({}));
              throw new Error(e.message || `HTTP ${res.status}`);
            }

            const updated = await res.json();
            setInfos(updated); // Refresh UI avec la version DB
          } catch (e) {
            alert(e.message || "Erreur lors de l’enregistrement.");
            throw e; 
          }
        }}
      />
      ;
    </div>
  );
}

export default Profile;
