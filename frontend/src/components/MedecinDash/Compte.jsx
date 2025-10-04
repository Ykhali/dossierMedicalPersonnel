// import React, { useEffect,useRef, useState } from "react";
// import API_BASE_URL from "../../config/apiConfig";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import { useNavigate } from "react-router-dom";
// import defaultAvatar from "../../assets/Images/defaultAvatar.jpeg";

// function Compte() {
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [src, setSrc] = useState(null); // image preview/src

//   const navigate = useNavigate();

//   // Données venant du backend (/auth/moi) + champs complémentaires côté UI
//   const [me, setMe] = useState({
//     id: null,
//     nom: "",
//     prenom: "",
//     cin: "",
//     email: "",
//     role: "",
//     telephone: "",
//     adresse: "",
//     ville: "",
//     specialite: "",
//     sousSpecialites: "",
//     langues: "",
//     bio: "",
//     prixConsult: "",
//     prixTeleconsult: "",
//     acceptTeleconsult: true,
//     notifEmail: true,
//     notifSms: false,
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
//   });

//   // Uploads (preview uniquement côté front pour l’instant)
//   const [photoFile, setPhotoFile] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);

//   const [logoFile, setLogoFile] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(null);

//   const [signFile, setSignFile] = useState(null);
//   const [signPreview, setSignPreview] = useState(null);

//   const [flash, setFlash] = useState(null);

//   // --- Photo (serveur & état de chargement) ---
//   const [serverPhotoUrl, setServerPhotoUrl] = useState(null); // objectURL de /api/Medecin/myImage
//   const [loadingPhoto, setLoadingPhoto] = useState(false);

//   const token = localStorage.getItem("token");
//   const authHeaders = {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };

//   // Charger /auth/moi
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/auth/moi`, {
//           headers: authHeaders,
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Impossible de charger le compte.");
//         const data = await res.json();

//         if (!mounted) return;

//         setMe((prev) => ({
//           ...prev,
//           id: data.id ?? null,
//           nom: data.nom ?? "",
//           prenom: data.prenom ?? "",
//           cin: data.cin ?? "",
//           email: data.email ?? "",
//           role: data.role ?? "",
//           // les champs ci-dessous n'existent pas dans /auth/moi -> on garde les valeurs par défaut
//         }));
//         setErr(null);
//       } catch (e) {
//         setErr(e.message || "Erreur de chargement.");
//       } finally {
//         mounted = false;
//         setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Gestion previews
//   useEffect(() => {
//     if (!photoFile) return setPhotoPreview(null);
//     const url = URL.createObjectURL(photoFile);
//     setPhotoPreview(url);
//     return () => URL.revokeObjectURL(url);
//   }, [photoFile]);

//   useEffect(() => {
//     if (!logoFile) return setLogoPreview(null);
//     const url = URL.createObjectURL(logoFile);
//     setLogoPreview(url);
//     return () => URL.revokeObjectURL(url);
//   }, [logoFile]);

//   useEffect(() => {
//     if (!signFile) return setSignPreview(null);
//     const url = URL.createObjectURL(signFile);
//     setSignPreview(url);
//     return () => URL.revokeObjectURL(url);
//   }, [signFile]);

//   // Helpers
//   const onChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setMe((m) => ({ ...m, [name]: type === "checkbox" ? checked : value }));
//   };

//   const saveBasics = async () => {
//     try {
//       // TODO: Branche ici ton endpoint PATCH (ex: /api/Medecin/profile)
//       // await fetch(`${API_BASE_URL}/api/Medecin/profile`, { method:'PATCH', headers:authHeaders, body: JSON.stringify({...me}) });

//       setFlash({ type: "success", msg: "Informations enregistrées." });
//       setTimeout(() => setFlash(null), 2500);
//     } catch (e) {
//       setFlash({ type: "danger", msg: "Échec de l’enregistrement." });
//       setTimeout(() => setFlash(null), 3000);
//     }
//   };

//   const saveUploads = async () => {
//     try {
//       // TODO: envoyer FormData vers tes endpoints d’upload (photo, logo, signature)
//       // const fd = new FormData(); fd.append("photo", photoFile) ...
//       setFlash({ type: "success", msg: "Fichiers enregistrés." });
//       setTimeout(() => setFlash(null), 2500);
//     } catch {
//       setFlash({ type: "danger", msg: "Échec de l’upload." });
//       setTimeout(() => setFlash(null), 3000);
//     }
//   };

//   const changePassword = async (e) => {
//     e.preventDefault();
//     const form = new FormData(e.currentTarget);
//     const oldPwd = form.get("oldPwd");
//     const newPwd = form.get("newPwd");
//     const confirm = form.get("confirmPwd");
//     if (!newPwd || newPwd !== confirm) {
//       setFlash({
//         type: "warning",
//         msg: "Les mots de passe ne correspondent pas.",
//       });
//       setTimeout(() => setFlash(null), 3000);
//       return;
//     }
//     try {
//       // TODO: branche ton endpoint (ex: POST /auth/change-password)
//       // await fetch(`${API_BASE_URL}/auth/change-password`, {method:'POST', headers:authHeaders, body: JSON.stringify({oldPassword: oldPwd, newPassword: newPwd})});
//       setFlash({ type: "success", msg: "Mot de passe modifié." });
//       e.currentTarget.reset();
//       setTimeout(() => setFlash(null), 2500);
//     } catch {
//       setFlash({
//         type: "danger",
//         msg: "Échec de la modification du mot de passe.",
//       });
//       setTimeout(() => setFlash(null), 3000);
//     }
//   };

//   // Fetch profile image (Blob -> ObjectURL)
//   useEffect(() => {
//     let objectUrl;
//     const controller = new AbortController();

//     (async () => {
//       try {
//         setLoadingPhoto(true);
//         setErr(null);

//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const res = await fetch(`${API_BASE_URL}/api/Medecin/myImage`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//           signal: controller.signal,
//         });

//         if (res.status === 404 || res.status === 204) {
//           setSrc(defaultAvatar);
//           return;
//         }
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);

//         const blob = await res.blob();
//         objectUrl = URL.createObjectURL(blob);
//         setSrc(objectUrl);
//       } catch (e) {
//         setErr(e.message || "Erreur lors du chargement de l’image");
//         setSrc(defaultAvatar);
//       } finally {
//         setLoadingPhoto(false);
//       }
//     })();

//     return () => {
//       controller.abort();
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     };
//   }, [navigate]);

//   // Upload new photo
//   const handleChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // local preview
//     const localUrl = URL.createObjectURL(file);
//     setSrc(localUrl);

//     try {
//       setUploading(true);
//       setErr(null);

//       const token = localStorage.getItem("token");
//       const fd = new FormData();
//       fd.append("file", file);

//       const res = await fetch(`${API_BASE_URL}/api/Medecin/upload-photo`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` }, // no Content-Type for FormData
//         body: fd,
//       });

//       if (!res.ok) throw new Error(`Upload failed (HTTP ${res.status})`);
//       // Optional: re-fetch image endpoint if backend transforms/stores differently
//     } catch (e) {
//       setErr(e.message || "Erreur d’upload");
//       setSrc(defaultAvatar);
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) return <div className="p-4">Chargement…</div>;
//   if (err) return <div className="alert alert-danger m-4">{err}</div>;

//   return (
//     <div className="container-fluid py-3">
//       {flash && (
//         <div className={`alert alert-${flash.type} mb-3`} role="alert">
//           {flash.msg}
//         </div>
//       )}

//       {/* Identité */}
//       <div className="card border-0 shadow-sm rounded-4 mb-3">
//         <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
//           <h5 className="m-0">Identité</h5>
//           <span className="text-muted small">ID: {me.id ?? "—"}</span>
//         </div>
//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-12 col-md-3 d-flex flex-column align-items-center">
//               <div
//                 className="rounded-3 border d-flex align-items-center justify-content-center overflow-hidden mb-2"
//                 style={{ width: 120, height: 120 }}
//               >
//                 {loadingPhoto ? (
//                   <img
//                     src={src || defaultAvatar}
//                     alt="Photo"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                     }}
//                   />
//                 ) : (
//                   <i className="bi bi-person-circle fs-1 text-secondary" />
//                 )}
//               </div>
//               <div className="d-flex gap-2">
//                 <label className="btn btn-outline-secondary btn-sm">
//                   <i className="bi bi-upload me-1" />
//                   Photo
//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
//                   />
//                 </label>
//                 {photoFile && (
//                   <button
//                     className="btn btn-outline-danger btn-sm"
//                     onClick={() => setPhotoFile(null)}
//                   >
//                     <i className="bi bi-x-lg" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="col-12 col-md-9">
//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <label className="form-label">Nom</label>
//                   <input
//                     className="form-control"
//                     name="nom"
//                     value={me.nom}
//                     onChange={onChange}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Prénom</label>
//                   <input
//                     className="form-control"
//                     name="prenom"
//                     value={me.prenom}
//                     onChange={onChange}
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">CIN</label>
//                   <input className="form-control" value={me.cin} disabled />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">E-mail</label>
//                   <input className="form-control" value={me.email} disabled />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Téléphone (pro)</label>
//                   <input
//                     className="form-control"
//                     name="telephone"
//                     value={me.telephone}
//                     onChange={onChange}
//                     placeholder="+212..."
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="text-end mt-3">
//             <button className="btn btn-primary" onClick={saveBasics}>
//               <i className="bi bi-check2 me-1" />
//               Enregistrer
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Coordonnées */}
//       <div className="card border-0 shadow-sm rounded-4 mb-3">
//         <div className="card-header bg-white border-0">
//           <h5 className="m-0">Coordonnées & Lieu d’exercice</h5>
//         </div>
//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-8">
//               <label className="form-label">Adresse du cabinet</label>
//               <input
//                 className="form-control"
//                 name="adresse"
//                 value={me.adresse}
//                 onChange={onChange}
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Ville</label>
//               <input
//                 className="form-control"
//                 name="ville"
//                 value={me.ville}
//                 onChange={onChange}
//               />
//             </div>
//           </div>

//           <div className="text-end mt-3">
//             <button className="btn btn-primary" onClick={saveBasics}>
//               Enregistrer
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Profil pro */}
//       <div className="card border-0 shadow-sm rounded-4 mb-3">
//         <div className="card-header bg-white border-0">
//           <h5 className="m-0">Profil professionnel</h5>
//         </div>
//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-4">
//               <label className="form-label">Spécialité</label>
//               <input
//                 className="form-control"
//                 name="specialite"
//                 value={me.specialite}
//                 onChange={onChange}
//                 placeholder="Cardiologie…"
//               />
//             </div>
//             <div className="col-md-8">
//               <label className="form-label">Sous-spécialités</label>
//               <input
//                 className="form-control"
//                 name="sousSpecialites"
//                 value={me.sousSpecialites}
//                 onChange={onChange}
//                 placeholder="Rythmologie, Imagerie…"
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">Langues parlées</label>
//               <input
//                 className="form-control"
//                 name="langues"
//                 value={me.langues}
//                 onChange={onChange}
//                 placeholder="Français, Arabe, Anglais…"
//               />
//             </div>
//             <div className="col-12">
//               <label className="form-label">Bio (courte présentation)</label>
//               <textarea
//                 className="form-control"
//                 name="bio"
//                 rows={3}
//                 value={me.bio}
//                 onChange={onChange}
//               />
//             </div>
//           </div>

//           <hr />

//           <div className="row g-3">
//             <div className="col-md-4">
//               <label className="form-label">
//                 Prix consultation (présentiel)
//               </label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="prixConsult"
//                 value={me.prixConsult}
//                 onChange={onChange}
//                 placeholder="ex: 300"
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Prix téléconsultation</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="prixTeleconsult"
//                 value={me.prixTeleconsult}
//                 onChange={onChange}
//                 placeholder="ex: 250"
//               />
//             </div>
//             <div className="col-md-4 d-flex align-items-end">
//               <div className="form-check">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="acceptTele"
//                   name="acceptTeleconsult"
//                   checked={me.acceptTeleconsult}
//                   onChange={onChange}
//                 />
//                 <label className="form-check-label" htmlFor="acceptTele">
//                   Propose la téléconsultation
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="text-end mt-3">
//             <button className="btn btn-primary" onClick={saveBasics}>
//               Enregistrer
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* En-têtes & fichiers (logo/signature) */}
//       <div className="card border-0 shadow-sm rounded-4 mb-3">
//         <div className="card-header bg-white border-0">
//           <h5 className="m-0">En-têtes & Fichiers</h5>
//         </div>
//         <div className="card-body">
//           <div className="row g-4">
//             <div className="col-md-4">
//               <label className="form-label">Logo (facture/ordonnance)</label>
//               <div className="border rounded-3 p-3 d-flex flex-column align-items-center">
//                 <div
//                   className="mb-2"
//                   style={{
//                     width: 180,
//                     height: 100,
//                     border: "1px dashed #ced4da",
//                   }}
//                 >
//                   {logoPreview ? (
//                     <img
//                       src={logoPreview}
//                       alt="Logo"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "contain",
//                       }}
//                     />
//                   ) : (
//                     <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
//                       Aperçu
//                     </div>
//                   )}
//                 </div>
//                 <label className="btn btn-outline-secondary btn-sm">
//                   <i className="bi bi-upload me-1" />
//                   Choisir
//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="col-md-4">
//               <label className="form-label">Signature / Cachet</label>
//               <div className="border rounded-3 p-3 d-flex flex-column align-items-center">
//                 <div
//                   className="mb-2"
//                   style={{
//                     width: 180,
//                     height: 100,
//                     border: "1px dashed #ced4da",
//                   }}
//                 >
//                   {signPreview ? (
//                     <img
//                       src={signPreview}
//                       alt="Signature"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "contain",
//                       }}
//                     />
//                   ) : (
//                     <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
//                       Aperçu
//                     </div>
//                   )}
//                 </div>
//                 <label className="btn btn-outline-secondary btn-sm">
//                   <i className="bi bi-upload me-1" />
//                   Choisir
//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     onChange={(e) => setSignFile(e.target.files?.[0] || null)}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="col-md-4 d-flex align-items-end">
//               <button className="btn btn-outline-primary" onClick={saveUploads}>
//                 <i className="bi bi-save me-1" />
//                 Enregistrer les fichiers
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Notifications */}
//       <div className="card border-0 shadow-sm rounded-4 mb-3">
//         <div className="card-header bg-white border-0">
//           <h5 className="m-0">Notifications & Préférences</h5>
//         </div>
//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-4">
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="notifEmail"
//                   name="notifEmail"
//                   checked={me.notifEmail}
//                   onChange={onChange}
//                 />
//                 <label className="form-check-label" htmlFor="notifEmail">
//                   Notifications par e-mail
//                 </label>
//               </div>
//             </div>
//             <div className="col-md-4">
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="notifSms"
//                   name="notifSms"
//                   checked={me.notifSms}
//                   onChange={onChange}
//                 />
//                 <label className="form-check-label" htmlFor="notifSms">
//                   Notifications par SMS
//                 </label>
//               </div>
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Fuseau horaire</label>
//               <input
//                 className="form-control"
//                 name="timezone"
//                 value={me.timezone}
//                 onChange={onChange}
//               />
//             </div>
//           </div>

//           <div className="text-end mt-3">
//             <button className="btn btn-primary" onClick={saveBasics}>
//               Enregistrer
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Sécurité */}
//       <div className="card border-0 shadow-sm rounded-4">
//         <div className="card-header bg-white border-0">
//           <h5 className="m-0">Sécurité</h5>
//         </div>
//         <div className="card-body">
//           <form className="row g-3" onSubmit={changePassword}>
//             <div className="col-md-4">
//               <label className="form-label">Mot de passe actuel</label>
//               <input type="password" name="oldPwd" className="form-control" />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Nouveau mot de passe</label>
//               <input type="password" name="newPwd" className="form-control" />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Confirmer</label>
//               <input
//                 type="password"
//                 name="confirmPwd"
//                 className="form-control"
//               />
//             </div>
//             <div className="col-12 text-end">
//               <button className="btn btn-outline-primary" type="submit">
//                 <i className="bi bi-shield-lock me-1" />
//                 Changer le mot de passe
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Compte;
import React, { useEffect, useRef, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getToken, isTokenValid, clearAuth } from "../../utils/auth";


// ✅ same fallback you used in Profile.jsx
import defaultAvatar from "../../assets/Images/defaultAvatar.jpeg";

async function safeParse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}


function Compte() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // -------- Base infos (auth/moi) ----------
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdError, setPwdError] = useState(null);

  const [me, setMe] = useState({
    id: null,
    nom: "",
    prenom: "",
    cin: "",
    email: "",
    role: "",
    telephone: "",
    adresse: "",
    ville: "",
    specialite: "",
    sousSpecialites: "",
    langues: "",
    bio: "",
    prixConsult: "",
    prixTeleconsult: "",
    acceptTeleconsult: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  });

  // -------- Photo (Profile-like flow) ----------
  const [src, setSrc] = useState(null); // current <img src>
  const [srcLogo, setSrcLogo] = useState(null);
  const [srcSignature, setSrcSignature] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [loadingSignature, setLoadingSignature] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fileRef = useRef(null);
  const handlePick = () => fileRef.current?.click();

  const logoInputRef = useRef(null);
  const handlePickLogo = () => logoInputRef.current?.click();

  const signatureInputRef = useRef(null);
  const handlePickSignature = () => signatureInputRef.current?.click();

  // -------- Other uploads (optional placeholders) ----------
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [signFile, setSignFile] = useState(null);
  const [signPreview, setSignPreview] = useState(null);

  const [flash, setFlash] = useState(null);

  const token = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Fetch /auth/moi
  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     try {
  //       if (!token) {
  //         navigate("/login");
  //         return;
  //       }
  //       const res = await fetch(`${API_BASE_URL}/auth/moi`, {
  //         headers: authHeaders,
  //         credentials: "include",
  //       });
  //       if (!res.ok) throw new Error("Impossible de charger le compte.");
  //       const data = await res.json();
  //       if (!mounted) return;

  //       setMe((prev) => ({
  //         ...prev,
  //         id: data.id ?? null,
  //         nom: data.nom ?? "",
  //         telephone: data.telephone ?? "",
  //         prenom: data.prenom ?? "",
  //         cin: data.cin ?? "",
  //         email: data.email ?? "",
  //         role: data.role ?? "",
  //       }));
  //       setErr(null);
  //     } catch (e) {
  //       setErr(e.message || "Erreur de chargement.");
  //     } finally {
  //       mounted = false;
  //       setLoading(false);
  //     }
  //   })();
  //   return () => {
  //     mounted = false;
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  //Fetch medecin infos
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/Medecin/perso-info`, {
          headers: authHeaders,
          credentials: "include",
        });
        if (!res.ok)
          throw new Error("Impossible de charger les infos médecin.");
        const data = await res.json();
        if (!mounted) return;

        setMe((prev) => ({
          ...prev,
          id: data.id ?? prev.id ?? null,
          nom: data.nom ?? "",
          prenom: data.prenom ?? "",
          cin: data.cin ?? "",
          email: data.email ?? "",
          telephone: data.telephone ?? "",
          adresse: data.adresse ?? "",
          ville: data.ville ?? "",
          specialite: data.specialite ?? "",
          sousSpecialites: data.sousSpecialites ?? "",
          langues: data.langues ?? "",
          bio: data.bio ?? "",
          prixConsult: data.prixConsult ?? "",
          prixTeleconsult: data.prixTeleconsult ?? "",
          acceptTeleconsult:
            data.acceptTeleconsult ?? prev.acceptTeleconsult ?? true,
          datedenaissance: data.datedenaissance ?? "",
          sexe: data.sexe ?? "",
        }));
        setErr(null);
      } catch (e) {
        setErr(e.message || "Erreur de chargement.");
      } finally {
        mounted = false;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch Médecin image
  useEffect(() => {
    let objectUrl;
    const controller = new AbortController();

    (async () => {
      try {
        setLoadingPhoto(true);
        setError(null);

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/Medecin/myImage`, {
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
  }, [API_BASE_URL, navigate, token]);

  // Fetch Médecin Logo
  useEffect(() => {
    let objectUrl;
    const controller = new AbortController();

    (async () => {
      try {
        setLoadingLogo(true);
        setError(null);

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/Medecin/myLogo`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (res.status === 404 || res.status === 204) {
          setSrcLogo(null);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setSrcLogo(objectUrl);
      } catch (e) {
        setError(e.message || "Erreur lors du chargement de l’image");
        setSrcLogo(null);
      } finally {
        setLoadingLogo(false);
      }
    })();

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [API_BASE_URL, navigate, token]);

  // Fetch Médecin Signature
  useEffect(() => {
    let objectUrl;
    const controller = new AbortController();

    (async () => {
      try {
        setLoadingSignature(true);
        setError(null);

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/Medecin/mySignature`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (res.status === 404 || res.status === 204) {
          setSrcSignature(null);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setSrcSignature(objectUrl);
      } catch (e) {
        setError(e.message || "Erreur lors du chargement de l’image");
        setSrcSignature(null);
      } finally {
        setLoadingSignature(false);
      }
    })();

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [API_BASE_URL, navigate, token]);

  // Upload new Médecin photo (keeps local preview like your Profile.jsx)
  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setSrc(localUrl);

    try {
      setUploading(true);
      setError(null);

      if (!token) throw new Error("Session expirée");

      const fd = new FormData();
      fd.append("file", file); // must be "file"

      const res = await fetch(`${API_BASE_URL}/api/Medecin/upload-photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // no Content-Type for FormData
        body: fd,
      });

      if (!res.ok) throw new Error(`Upload failed (HTTP ${res.status})`);
      setFlash({ type: "success", msg: "Photo mise à jour." });
      setTimeout(() => setFlash(null), 2000);
    } catch (e2) {
      setError(e2.message || "Erreur d’upload");
      setSrc(defaultAvatar);
    } finally {
      setUploading(false);
    }
  };
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setSrcLogo(localUrl);

    try {
      setUploadingLogo(true);
      setError(null);

      if (!token) throw new Error("Session expirée");

      const fd = new FormData();
      fd.append("file", file); // must be "file"

      const res = await fetch(`${API_BASE_URL}/api/Medecin/upload-logo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // no Content-Type for FormData
        body: fd,
      });

      if (!res.ok) throw new Error(`Upload failed (HTTP ${res.status})`);
      setFlash({ type: "success", msg: "Logo mise à jour." });
      setTimeout(() => setFlash(null), 2000);
    } catch (e2) {
      setError(e2.message || "Erreur d’upload");
      setSrcLogo(null);
    } finally {
      setUploadingLogo(false);
    }
  };
  const handleSignatureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setSrcSignature(localUrl);

    try {
      setUploadingSignature(true);
      setError(null);

      if (!token) throw new Error("Session expirée");

      const fd = new FormData();
      fd.append("file", file); // must be "file"

      const res = await fetch(`${API_BASE_URL}/api/Medecin/upload-signature`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // no Content-Type for FormData
        body: fd,
      });

      if (!res.ok) throw new Error(`Upload failed (HTTP ${res.status})`);
      setFlash({ type: "success", msg: "Logo mise à jour." });
      setTimeout(() => setFlash(null), 2000);
    } catch (e2) {
      setError(e2.message || "Erreur d’upload");
      setSrcSignature(null);
    } finally {
      setUploadingSignature(false);
    }
  };

  // Optional previews for logo/signature
  useEffect(() => {
    if (!logoFile) return setLogoPreview(null);
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  useEffect(() => {
    if (!signFile) return setSignPreview(null);
    const url = URL.createObjectURL(signFile);
    setSignPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [signFile]);

  const handleModify = async (e) => {
    e.preventDefault();
    setErr(null);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Aucun token trouvé. Veuillez vous reconnecter.");
        return;
      }

      const payload = {
        cin: me.cin,
        nom: me.nom,
        prenom: me.prenom,
        telephone: me.telephone,
        email: me.email,
        datedenaissance: me.datedenaissance,
        adresse: me.adresse,
        ville: me.ville,
        specialite: me.specialite,
        sousSpecialites: me.sousSpecialites,
        langues: me.langues,
        bio: me.bio,
        prixConsult: me.prixConsult,
        prixTeleconsult: me.prixTeleconsult,
        sexe: me.sexe,
        acceptTeleconsult: me.acceptTeleconsult,
      };

      const res = await fetch(`${API_BASE_URL}/api/Medecin/update-infos`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        setError(`Erreur: ${res.status} - ${errMsg}`);
        return;
      }

      const data = await res.json();
      setSuccess("Informations mises à jour avec succès !");
      console.log("Medecin mis à jour:", data);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la mise à jour.");
    }
  };

  const handleChangePwd = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validations front (alignées au backend: 6+)
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Aucun token trouvé. Veuillez vous reconnecter.");
      return;
    }

    // parseur sûr texte/JSON/204
    const safeParse = async (res) => {
      const text = await res.text();
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    };

    try {
      setSavingPwd(true);

      // ⚠️ adapte la casse selon ton @RequestMapping de classe
      const url = `${API_BASE_URL}/api/Medecin/changerMotDePasse`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
      });

      // 401 -> ton backend l'utilise pour "ancien mot de passe incorrect"
      if (res.status === 401) {
        const body = await safeParse(res); // String: "Ancien mot de passe incorrect."
        setError(
          typeof body === "string" ? body : "Ancien mot de passe incorrect."
        );
        return;
      }

      if (!res.ok) {
        const body = await safeParse(res); // 400 -> message String (règles)
        const msg = typeof body === "string" ? body : body?.message ?? "";
        setError(`Erreur ${res.status} : ${msg || "Échec de la requête"}`);
        return;
      }

      // 204 No Content -> succès
      await safeParse(res);
      setSuccess("Mot de passe modifié avec succès !");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setSavingPwd(false);
    }
  };

  // Form helpers
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMe((m) => ({ ...m, [name]: type === "checkbox" ? checked : value }));
  };

  // const saveBasics = async () => {
  //   try {
  //     // 👉 Branche ici ton PATCH profil si besoin
  //     // await fetch(`${API_BASE_URL}/api/Medecin/profile`, { method:'PATCH', headers: authHeaders, body: JSON.stringify({...me}) });
  //     setFlash({ type: "success", msg: "Informations enregistrées." });
  //     setTimeout(() => setFlash(null), 2000);
  //   } catch {
  //     setFlash({ type: "danger", msg: "Échec de l’enregistrement." });
  //     setTimeout(() => setFlash(null), 3000);
  //   }
  // };

  if (loading) return <div className="p-4">Chargement…</div>;
  if (err) return <div className="alert alert-danger m-4">{err}</div>;

  return (
    <div className="container-fluid py-3">
      {flash && (
        <div className={`alert alert-${flash.type} mb-3`} role="alert">
          {flash.msg}
        </div>
      )}
      {error && (
        <div
          className="alert alert-warning d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle me-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Identité (photo + champs) */}
      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
          <h5 className="m-0">Identité</h5>
        </div>

        <div className="card-body">
          <div className="row g-3">
            {/* LEFT: Photo (Profile-like UI) */}
            <div className="col-12 col-md-3 d-flex justify-content-center">
              <div className="position-relative">
                {loadingPhoto ? (
                  <div
                    className="bg-light rounded-circle"
                    style={{ width: 160, height: 160 }}
                  />
                ) : (
                  <img
                    src={src || defaultAvatar}
                    alt="Photo de profil"
                    className="rounded-circle border"
                    style={{ width: 160, height: 160, objectFit: "cover" }}
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
                  <i className="bi bi-camera" />
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

            {/* RIGHT: Champs */}
            <div className="col-12 col-md-9">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nom</label>
                  <input
                    className="form-control"
                    name="nom"
                    value={me.nom}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Prénom</label>
                  <input
                    className="form-control"
                    name="prenom"
                    value={me.prenom}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">CIN</label>
                  <input
                    className="form-control"
                    name="cin"
                    value={me.cin}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">E-mail</label>
                  <input
                    className="form-control"
                    name="email"
                    value={me.email}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Téléphone (pro)</label>
                  <input
                    className="form-control"
                    name="telephone"
                    value={me.telephone}
                    onChange={onChange}
                    placeholder="+212..."
                  />
                </div>
              </div>

              <div className="text-end mt-3">
                <button className="btn btn-primary" onClick={handleModify}>
                  <i className="bi bi-check2 me-1" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coordonnées */}
      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-header bg-white border-0">
          <h5 className="m-0">Coordonnées & Lieu d’exercice</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Adresse du cabinet</label>
              <input
                className="form-control"
                name="adresse"
                value={me.adresse}
                onChange={onChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Ville</label>
              <input
                className="form-control"
                name="ville"
                value={me.ville}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="text-end mt-3">
            <button className="btn btn-primary" onClick={handleModify}>
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      {/* Profil professionnel */}
      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-header bg-white border-0">
          <h5 className="m-0">Profil professionnel</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Spécialité</label>
              <input
                className="form-control"
                name="specialite"
                value={me.specialite}
                onChange={onChange}
                placeholder="Cardiologie…"
              />
            </div>
            <div className="col-md-8">
              <label className="form-label">Sous-spécialités</label>
              <input
                className="form-control"
                name="sousSpecialites"
                value={me.sousSpecialites}
                onChange={onChange}
                placeholder="Rythmologie, Imagerie…"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Langues parlées</label>
              <input
                className="form-control"
                name="langues"
                value={me.langues}
                onChange={onChange}
                placeholder="Français, Arabe, Anglais…"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Bio (courte présentation)</label>
              <textarea
                className="form-control"
                name="bio"
                rows={3}
                value={me.bio}
                onChange={onChange}
              />
            </div>
          </div>

          <hr />

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">
                Prix consultation (présentiel)
              </label>
              <input
                type="number"
                className="form-control"
                name="prixConsult"
                value={me.prixConsult}
                onChange={onChange}
                placeholder="ex: 300"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Prix téléconsultation</label>
              <input
                type="number"
                className="form-control"
                name="prixTeleconsult"
                value={me.prixTeleconsult}
                onChange={onChange}
                placeholder="ex: 250"
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="acceptTele"
                  name="acceptTeleconsult"
                  checked={me.acceptTeleconsult}
                  onChange={onChange}
                />
                <label className="form-check-label" htmlFor="acceptTele">
                  Propose la téléconsultation
                </label>
              </div>
            </div>
          </div>

          <div className="text-end mt-3">
            <button className="btn btn-primary" onClick={handleModify}>
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      {/* En-têtes & fichiers (logo/signature) - optionnel */}
      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-header bg-white border-0">
          <h5 className="m-0">En-têtes & Fichiers</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <label className="form-label">Logo</label>
              <div className="border rounded-3 p-3 d-flex flex-column align-items-center">
                <div
                  className="mb-2"
                  style={{
                    width: 180,
                    height: 100,
                    border: "1px dashed #ced4da",
                  }}
                >
                  {srcLogo ? (
                    <img
                      src={srcLogo}
                      alt="Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) => (e.currentTarget.src = "")}
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                      Aperçu
                    </div>
                  )}
                </div>
                {/* <label className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-upload me-1" />
                  Choisir
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  />
                </label> */}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  onClick={handlePickLogo}
                  disabled={uploadingLogo}
                  title="Téléverser un logo"
                >
                  <i className="bi bi-upload" />
                  {uploadingLogo ? "Envoi..." : "Choisir"}
                </button>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoUpload}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Signature / Cachet</label>
              <div className="border rounded-3 p-3 d-flex flex-column align-items-center">
                <div
                  className="mb-2"
                  style={{
                    width: 180,
                    height: 100,
                    border: "1px dashed #ced4da",
                  }}
                >
                  {srcSignature ? (
                    <img
                      src={srcSignature}
                      alt="Signature"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                      Aperçu
                    </div>
                  )}
                </div>
                {/* <label className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-upload me-1" />
                  Choisir
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setSignFile(e.target.files?.[0] || null)}
                  />
                </label> */}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  onClick={handlePickSignature}
                  disabled={uploadingSignature}
                  title="Téléverser un logo"
                >
                  <i className="bi bi-upload" />
                  {uploadingSignature ? "Envoi..." : "Choisir"}
                </button>

                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleSignatureUpload}
                />
              </div>
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-outline-primary"
                onClick={() =>
                  setFlash({
                    type: "info",
                    msg: "Branche tes endpoints logo/signature si besoin.",
                  })
                }
              >
                <i className="bi bi-save me-1" />
                Enregistrer les fichiers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0">
          <h5 className="m-0">Sécurité</h5>
        </div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleChangePwd} noValidate>
            <div className="col-md-4">
              <label className="form-label">Mot de passe actuel</label>
              <input
                type="password"
                name="oldPwd"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Nouveau mot de passe</label>
              <input
                type="password"
                name="newPwd"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Confirmer</label>
              <input
                type="password"
                name="confirmPwd"
                className="form-control"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-12 text-end">
              <button className="btn btn-outline-primary" type="submit">
                <i className="bi bi-shield-lock me-1" />
                Changer le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Compte;
