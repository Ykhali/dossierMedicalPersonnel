// import React, { useState } from 'react'
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import './Register.css';

// function Register() {

//     const [nom, setNom] = useState("");
//     const [cin, setCin] = useState("");
//     const [prenom, setPrenom] = useState("");
//     const [email, setEmail] = useState("");
//     const [motdepasse, setMotDePasse] = useState("");
//     const [confirmpwd, setConfirmpwd] = useState("");
//     const [telephone, setTelephone] = useState("");
//     const [adresse, setAdresse] = useState("");


//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     //Image d'identité
//     const [photoPreview, setPhotoPreview] = useState(null); // data URL (Base64)
//     const [photoFile, setPhotoFile] = useState(null);
//     const [photoError, setPhotoError] = useState(null);

//     const handleLoginClick = () => {
//       navigate("/login");
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setIsLoading(true);
//         try {
//           const response = await fetch(`${API_BASE_URL}/auth/register`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               cin,
//               nom,
//               prenom,
//               email,
//               telephone,
//               adresse,
//               motdepasse,
//               confirmpwd,
//               // Champs côté backend
//               photoIdentiteBase64: photoPreview || null, // data URL ou null
//               photoContentType: photoFile ? photoFile.type : null,
//             }),
//             credentials: "include",
//           });
//           if (!response.ok) {
//             const text = await response.text(); // <-- read raw text, not json()
//             console.error("Register failed:", response.status, text);
//             throw new Error(`HTTP ${response.status}: ${text}`);
//           }
          
//         } catch (error) {
//           console.error("Erreur d'inscription :", error.message, error);
//           setError(error.message || "Email ou mot de passe incorrect !");
//         } finally {
//           setIsLoading(false);
//         }
//     }

//   return (
//     <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
//       <div
//         className="card shadow p-4 p-md-5 w-100"
//         style={{ maxWidth: "400px" }}
//       >
//         <form onSubmit={handleSubmit}>
//           <h3 className="text-center mb-4">S'inscrire</h3>

//           {error && (
//             <div className="alert alert-danger" role="alert">
//               {error}
//             </div>
//           )}

//           <div className="mb-3">
//             <label htmlFor="cin" className="form-label">
//               CIN:
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="cin"
//               placeholder="Entrez votre CIN"
//               value={cin}
//               onChange={(e) => setCin(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="nom" className="form-label">
//               Nom:
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="nom"
//               placeholder="Entrez votre Nom"
//               value={nom}
//               onChange={(e) => setNom(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="prenom" className="form-label">
//               Prenom:
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="prenom"
//               placeholder="Entrez votre Prenom"
//               value={prenom}
//               onChange={(e) => setPrenom(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">
//               Adresse e-mail
//             </label>
//             <input
//               type="email"
//               className="form-control"
//               id="email"
//               placeholder="Entrez votre adresse email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="telephone">Telephone</label>
//             <input
//               type="tel"
//               className="form-control"
//               id="telephone"
//               placeholder="entrez votre telephone"
//               value={telephone}
//               onChange={(e) => setTelephone(e.target.value)}
//               disabled={isLoading}
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="adresse" className="form-label">
//               Adresse:
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="adresse"
//               placeholder="Entrez votre Adresse"
//               value={adresse}
//               onChange={(e) => setAdresse(e.target.value)}
//               disabled={isLoading}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="motDePasse" className="form-label">
//               Mot de passe
//             </label>
//             <input
//               type="password"
//               className="form-control"
//               id="motDePasse"
//               placeholder="Entrez votre mot de passe"
//               value={motdepasse}
//               onChange={(e) => setMotDePasse(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="ConfMotDePasse" className="form-label">
//               Confirmer Mot de passe
//             </label>
//             <input
//               type="password"
//               className="form-control"
//               id="ConfMotDePasse"
//               placeholder="Veuillez confirmer votre mot de passe"
//               value={confirmpwd}
//               onChange={(e) => setConfirmpwd(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="d-grid mb-3">
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={isLoading}
//             >
//               {isLoading ? "Registering..." : "Register"}
//             </button>
//           </div>
//           <p className="registerText" onClick={handleLoginClick}>
//             Already Registered, click here to login!
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import "./Register.css";

// function Register() {
//   const [nom, setNom] = useState("");
//   const [cin, setCin] = useState("");
//   const [prenom, setPrenom] = useState("");
//   const [email, setEmail] = useState("");
//   const [motdepasse, setMotDePasse] = useState("");
//   const [confirmpwd, setConfirmpwd] = useState("");
//   const [telephone, setTelephone] = useState("");
//   const [adresse, setAdresse] = useState("");

//   // Image d'identité
//   const [photoPreview, setPhotoPreview] = useState(null); // Data URL pour affichage
//   const [photoFile, setPhotoFile] = useState(null);
//   const [photoError, setPhotoError] = useState(null);

//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLoginClick = () => {
//     navigate("/login");
//   };

//   const handlePhotoChange = (e) => {
//     setPhotoError(null);
//     const file = e.target.files?.[0];
//     if (!file) {
//       setPhotoFile(null);
//       setPhotoPreview(null);
//       return;
//     }

//     // Validations côté front (alignées au back)
//     const allowed = ["image/jpeg", "image/png", "image/webp"];
//     if (!allowed.includes(file.type)) {
//       setPhotoError("Formats acceptés : JPEG / PNG / WEBP");
//       setPhotoFile(null);
//       setPhotoPreview(null);
//       return;
//     }
//     const MAX = 2 * 1024 * 1024; // 2 Mo
//     if (file.size > MAX) {
//       setPhotoError("Taille max 2 Mo");
//       setPhotoFile(null);
//       setPhotoPreview(null);
//       return;
//     }

//     setPhotoFile(file);

//     // Aperçu
//     const reader = new FileReader();
//     reader.onload = () => setPhotoPreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (motdepasse !== confirmpwd) {
//       setError("Les mots de passe ne correspondent pas.");
//       return;
//     }
//     if (photoError) {
//       setError(photoError);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // IMPORTANT: multipart => pas de "Content-Type" manuel
//       const formData = new FormData();
//       formData.append("cin", cin);
//       formData.append("nom", nom);
//       formData.append("prenom", prenom);
//       formData.append("email", email);
//       formData.append("telephone", telephone);
//       formData.append("adresse", adresse);
//       formData.append("motdepasse", motdepasse);
//       formData.append("confirmpwd", confirmpwd);

//       if (photoFile) {
//         formData.append("photoIdentite", photoFile); // DOIT correspondre au nom @RequestPart
//       }

//       const response = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         console.error("Register failed:", response.status, text);
//         // Essaye de décoder JSON si renvoyé
//         let msg = text;
//         try {
//           const asJson = JSON.parse(text);
//           msg =
//             asJson?.email ||
//             asJson?.motDePasse ||
//             asJson?.photo ||
//             asJson?.message ||
//             text;
//         } catch (_) {}
//         throw new Error(msg || `HTTP ${response.status}`);
//       }

//       // Succès
//       navigate("/login");
//     } catch (err) {
//       console.error("Erreur d'inscription :", err);
//       setError(
//         err?.message || "Une erreur est survenue lors de l'inscription."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
//       <div
//         className="card shadow p-4 p-md-5 w-100"
//         style={{ maxWidth: "420px" }}
//       >
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <h3 className="text-center mb-4">S'inscrire</h3>

//           {error && (
//             <div className="alert alert-danger" role="alert">
//               {error}
//             </div>
//           )}

//           {/* Photo identité */}
//           <div className="mb-3 text-center">
//             <label className="form-label d-block">
//               Photo d'identité (optionnel)
//             </label>

//             <div className="d-flex flex-column align-items-center">
//               <div
//                 className="rounded-circle overflow-hidden border mb-2"
//                 style={{ width: 120, height: 120, backgroundColor: "#f8f9fa" }}
//               >
//                 {photoPreview ? (
//                   <img
//                     src={photoPreview}
//                     alt="aperçu"
//                     className="w-100 h-100"
//                     style={{ objectFit: "cover" }}
//                   />
//                 ) : (
//                   <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
//                     Aperçu
//                   </div>
//                 )}
//               </div>

//               <input
//                 type="file"
//                 accept="image/jpeg,image/png,image/webp"
//                 className="form-control"
//                 onChange={handlePhotoChange}
//                 disabled={isLoading}
//               />
//               {photoError && (
//                 <div className="form-text text-danger">{photoError}</div>
//               )}
//               {photoFile && (
//                 <div className="form-text">
//                   {photoFile.name} — {(photoFile.size / 1024).toFixed(0)} Ko
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="cin" className="form-label">
//               CIN
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="cin"
//               placeholder="Entrez votre CIN"
//               value={cin}
//               onChange={(e) => setCin(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="nom" className="form-label">
//               Nom
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="nom"
//               placeholder="Entrez votre Nom"
//               value={nom}
//               onChange={(e) => setNom(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="prenom" className="form-label">
//               Prénom
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="prenom"
//               placeholder="Entrez votre Prénom"
//               value={prenom}
//               onChange={(e) => setPrenom(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">
//               Adresse e‑mail
//             </label>
//             <input
//               type="email"
//               className="form-control"
//               id="email"
//               placeholder="Entrez votre adresse e‑mail"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="telephone" className="form-label">
//               Téléphone
//             </label>
//             <input
//               type="tel"
//               className="form-control"
//               id="telephone"
//               placeholder="Entrez votre téléphone"
//               value={telephone}
//               onChange={(e) => setTelephone(e.target.value)}
//               disabled={isLoading}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="adresse" className="form-label">
//               Adresse
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="adresse"
//               placeholder="Entrez votre adresse"
//               value={adresse}
//               onChange={(e) => setAdresse(e.target.value)}
//               disabled={isLoading}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="motDePasse" className="form-label">
//               Mot de passe
//             </label>
//             <input
//               type="password"
//               className="form-control"
//               id="motDePasse"
//               placeholder="Entrez votre mot de passe"
//               value={motdepasse}
//               onChange={(e) => setMotDePasse(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="ConfMotDePasse" className="form-label">
//               Confirmer mot de passe
//             </label>
//             <input
//               type="password"
//               className="form-control"
//               id="ConfMotDePasse"
//               placeholder="Veuillez confirmer votre mot de passe"
//               value={confirmpwd}
//               onChange={(e) => setConfirmpwd(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="d-grid mb-3">
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={isLoading}
//             >
//               {isLoading ? "Enregistrement..." : "S'inscrire"}
//             </button>
//           </div>

//           <p
//             className="registerText text-center mb-0"
//             onClick={handleLoginClick}
//             role="button"
//           >
//             Déjà inscrit ? Cliquez ici pour vous connecter
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;*

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import "./Register.css";

function Register() {
  const [nom, setNom] = useState("");
  const [cin, setCin] = useState("");
  const [sexe, setSexe] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motdepasse, setMotDePasse] = useState("");
  const [confirmpwd, setConfirmpwd] = useState("");
  const [telephone, setTelephone] = useState("");
  const [datedenaissance, setDatedenaissance] = useState("");
  const [adresse, setAdresse] = useState("");

  // Image d'identité
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState(null);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");

  const handlePhotoChange = (e) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setPhotoError("Formats acceptés : JPEG / PNG / WEBP");
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    const MAX = 2 * 1024 * 1024; // 2 Mo
    if (file.size > MAX) {
      setPhotoError("Taille max 2 Mo");
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (motdepasse !== confirmpwd) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (photoError) {
      setError(photoError);
      return;
    }

    setIsLoading(true);
    try {
      // IMPORTANT: multipart => ne PAS fixer manuellement Content-Type
      const formData = new FormData();
      formData.append("cin", cin);
      formData.append("nom", nom);
      formData.append("prenom", prenom);
      formData.append("email", email);
      formData.append("telephone", telephone);
      formData.append("datedenaissance", datedenaissance);
      formData.append("sexe", sexe)
      formData.append("adresse", adresse);
      formData.append("motdepasse", motdepasse);
      formData.append("confirmpwd", confirmpwd);
      

      if (photoFile) {
        // 👇 le nom DOIT être "image" pour binder MultipartFile image
        formData.append("image", photoFile);
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        body: formData,
        // credentials: "include", pour cookies
      });

      if (!response.ok) {
        const text = await response.text();
        let msg = text;
        try {
          const asJson = JSON.parse(text);
          msg =
            asJson?.email ||
            asJson?.MotDePasse ||
            asJson?.image ||
            asJson?.message ||
            text;
        } catch (_) {}
        throw new Error(msg || `HTTP ${response.status}`);
      }

      navigate("/login");
    } catch (err) {
      console.error("Erreur d'inscription :", err);
      setError(
        err?.message || "Une erreur est survenue lors de l'inscription."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div
        className="card shadow p-4 p-md-5 w-100 mt-5 mb-5"
        style={{ maxWidth: "70%" }}
      >
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h3 className="text-center mb-4">S'inscrire</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Photo identité */}

          <div className="mb-3 text-center">
            <label className="form-label d-block">
              Photo d'identité (optionnel)
            </label>

            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle overflow-hidden border mb-2"
                style={{ width: 120, height: 120, backgroundColor: "#f8f9fa" }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="aperçu"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                    Aperçu
                  </div>
                )}
              </div>

              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                className="form-control"
                onChange={handlePhotoChange}
                disabled={isLoading}
              />
              {photoError && (
                <div className="form-text text-danger">{photoError}</div>
              )}
              {photoFile && (
                <div className="form-text">
                  {photoFile.name} — {(photoFile.size / 1024).toFixed(0)} Ko
                </div>
              )}
            </div>
          </div>

          {/* <div className="mb-3">
            <label htmlFor="cin" className="form-label">
              CIN
            </label>
            <input
              type="text"
              className="form-control"
              id="cin"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
              required
              disabled={isLoading}
            />
          </div> */}
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="datedenaissance" className="form-label">
                Date de Naissance
              </label>
              <input
                type="date"
                id="datedenaissance"
                className="form-control"
                value={datedenaissance}
                onChange={(e) => setDatedenaissance(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="sexe" className="form-label">
                Sexe:
              </label>
              <select
                name="sexe"
                id="sexe"
                className="form-control"
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
              >
                <option value="">Sélectionner le sexe</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="nom" className="form-label ">
                Nom <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="nom"
                placeholder="Entrez votre Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="prenom" className="form-label">
                Prenom <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="prenom"
                placeholder="Entrez votre Prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="cin" className="form-label">
                CIN
              </label>
              <input
                type="text"
                className="form-control"
                id="cin"
                placeholder="Veuillez entrer votre CIN"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="telephone" className="form-label">
                Téléphone
              </label>
              <input
                type="tel"
                className="form-control"
                id="telephone"
                placeholder="Veuillez entrer votre numero de telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* <div className="mb-3">
            <label htmlFor="email" className="form-label">
              e-mail
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Veuillez ecrire votre adresse e-mail"
              required
              disabled={isLoading}
            />
          </div> */}

          {/* <div className="mb-3">
            <label htmlFor="telephone" className="form-label">
              Téléphone
            </label>
            <input
              type="tel"
              className="form-control"
              id="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              disabled={isLoading}
            />
          </div> */}

          {/* <div className="mb-3">
            <label htmlFor="adresse" className="form-label">
              Adresse
            </label>
            <input
              type="text"
              className="form-control"
              id="adresse"
              placeholder="Veuillez entrer votre adresse postale"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              disabled={isLoading}
            />
          </div> */}

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="email" className="form-label">
                e-mail
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Veuillez entrer votre adresse e-mail"
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="adresse" className="form-label">
                Adresse
              </label>
              <input
                type="text"
                className="form-control"
                id="adresse"
                placeholder="Veuillez entrer votre adresse postale"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="motDePasse" className="form-label ">
                Mot de passe <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                className="form-control"
                id="motDePasse"
                placeholder="Entrez votre mot de passe"
                value={motdepasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="ConfMotDePasse" className="form-label">
                Confirmer mot de passe <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                className="form-control"
                id="ConfMotDePasse"
                placeholder="Confirmer votre mot de passe"
                value={confirmpwd}
                onChange={(e) => setConfirmpwd(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Enregistrement..." : "S'inscrire"}
            </button>
          </div>

          <p
            className="registerText text-center mb-0"
            onClick={handleLoginClick}
            role="button"
          >
            Déjà inscrit ? Cliquez ici pour vous connecter
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;

