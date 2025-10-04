import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpBusy, setFpBusy] = useState(false);
  const [fpSent, setFpSent] = useState(false);

  const [showDeletedModal, setShowDeletedModal] = useState(false);

  const navigate = useNavigate();

  const ADMIN_EMAIL = "youssef.khalid496@gmail.com"; 

  const togglePasswordVisibility = () => setShowPassword((p) => !p);
  const handleRegisterClick = () => navigate("/register");
  const handleCancelClick = () => navigate("/");


  const contacterAdmin = async () => {
    try {
      const r = await fetch(`${API_BASE_URL}/support/contacter-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message: "Merci de réactiver mon compte.",
        }),
      });
      if (r.ok) {
        alert("Votre demande a été envoyée à l’équipe support.");
        setShowDeletedModal(false);
      } else {
        const txt = await r.text();
        alert("Erreur: " + txt);
      }
    } catch {
      alert("Erreur réseau.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // ⚠️ Si ton backend attend "password" au lieu de "motdepasse",
      // remplace la ligne "body" par JSON.stringify({ email, password: motdepasse })
      //const body = JSON.stringify({ email, motdepasse });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, motdepasse }),
        // Active ceci SEULEMENT si ton backend place le JWT en cookie HttpOnly:
      });

      // Lire le corps (succès ou erreur) UNE SEULE FOIS
      const raw = await response.text();
      let payload = null;
      try {
        payload = raw ? JSON.parse(raw) : null;
      } catch {
        payload = { message: raw };
      }

      // 👇 interception spécifique compte supprimé
      if (response.status === 403 && payload?.code === "ACCOUNT_DELETED") {
        setShowDeletedModal(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        const msg =
          (payload && (payload.message || payload.error)) ||
          (payload && payload.errors && JSON.stringify(payload.errors)) ||
          `HTTP ${response.status}`;
        throw new Error(msg);
      }

      // Succès login
      const data = payload || {};
      const token = data.token || data.accessToken; // supporte les deux schémas
      if (!token) {
        throw new Error("Réponse de login invalide: token manquant");
      }

      localStorage.setItem("token", token);
      if (data.role) localStorage.setItem("role", data.role);

      // Récupérer /auth/moi avec le BON token
      const userResponse = await fetch(`${API_BASE_URL}/auth/moi`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        // credentials: "include", // seulement si ton backend exige des cookies
      });

      const rawUser = await userResponse.text();
      let userData = null;
      try {
        userData = rawUser ? JSON.parse(rawUser) : null;
      } catch {
        userData = null;
      }

      if (!userResponse.ok) {
        const msg =
          (userData && (userData.message || userData.error)) ||
          `HTTP ${userResponse.status}`;
        throw new Error(`Failed to fetch user details: ${msg}`);
      }

      localStorage.setItem("user", JSON.stringify(userData || {}));
      const role = (userData && userData.role) || data.role || "";

      switch (role) {
        case "PATIENT":
          navigate("/PatientDash");
          break;
        case "MEDECIN":
          navigate("/MedecinDash");
          break;
        case "ADMIN":
          navigate("/AdminDash");
          break;
        case "RECEPTIONNISTE":
          navigate("/ReceptionnisteDash");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError(err.message || "Échec de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const openForgot = () => {
    setFpEmail(email); // prefill with login email if any
    setShowForgot(true);
    setFpBusy(false);
    setFpSent(false);
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    setFpBusy(true);
    try {
      await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail.trim() }),
      });
      setFpSent(true); // generic success
    } catch {
      // still show generic success to avoid enumeration
      setFpSent(true);
    } finally {
      setFpBusy(false);
    }
  };

  return (
    <>
      <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div
          className="card shadow p-4 p-md-5 w-100"
          style={{ maxWidth: "400px" }}
        >
          <form onSubmit={handleSubmit}>
            <h3 className="text-center mb-4">Se Connecter</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Adresse e-mail
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Entrez votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="motDePasse" className="form-label">
                Mot de passe
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="motDePasse"
                  placeholder="Entrez votre mot de passe"
                  value={motdepasse}
                  onChange={(e) => setMotdepasse(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer", background: "white" }}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={openForgot}
                disabled={isLoading}
              >
                Mot de passe oublié ?
              </button>
            </div>

            <div className="d-flex mb-3 gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-grow-1"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Login"}
              </button>
              <button
                type="button"
                className="btn btn-secondary flex-grow-1"
                onClick={handleCancelClick}
                disabled={isLoading}
              >
                Annuler
              </button>
            </div>

            <p
              onClick={handleRegisterClick}
              className="registerText"
              role="button"
            >
              Don't have an account? Register here!
            </p>
          </form>
        </div>
      </div>
      {/* ---------- MODAL COMPTE SUPPRIMÉ ---------- */}
      <div
        className={`modal fade ${showDeletedModal ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-hidden={!showDeletedModal}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">Compte désactivé</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowDeletedModal(false)}
              />
            </div>
            <div className="modal-body">
              <p className="mb-2">
                Le compte <strong>{email}</strong> est désactivé.
              </p>
              <p className="mb-0">
                Contactez l'équipe support pour restaurer votre accès.
              </p>
            </div>
            <div className="modal-footer justify-content-center">
              <button className="btn btn-primary " onClick={contacterAdmin}>
                Demander la restauration
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDeletedModal && <div className="modal-backdrop fade show" />}
      {/* ---------- /MODAL ---------- */}

      {/* ---------- MODAL FORGOT PASSWORD ---------- */}
      <div
        className={`modal fade ${showForgot ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-hidden={!showForgot}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">Réinitialiser le mot de passe</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowForgot(false)}
              />
            </div>
            <div className="modal-body">
              {fpSent ? (
                <div className="alert alert-success mb-0">
                  Si un compte existe pour <strong>{fpEmail}</strong>, un lien
                  de réinitialisation a été envoyé. Vérifiez votre boîte mail.
                </div>
              ) : (
                <form onSubmit={submitForgot}>
                  <div className="mb-3">
                    <label className="form-label">Adresse e-mail</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      disabled={fpBusy}
                      placeholder="vous@example.com"
                    />
                  </div>
                  <button className="btn btn-primary w-100" disabled={fpBusy}>
                    {fpBusy ? "Envoi..." : "Envoyer le lien"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {showForgot && <div className="modal-backdrop fade show" />}
      {/* ---------- /MODAL FORGOT PASSWORD ---------- */}
    </>
  );
}

export default Login;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; 
// import API_BASE_URL from "../../config/apiConfig";
// import './Login.css';
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { moduleRunnerTransform } from "vite";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [motdepasse, setMotdepasse] = useState("");
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const togglePasswordVisibility = () => {
//    setShowPassword((prev) => !prev);
//   };


//   const handleRegisterClick = () => {
//     navigate("/register");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           motdepasse,
//         }),
//         credentials: "include",
//       });

//       let payload = null;
//       const text = await res.text();
//       try {
//         payload = text ? JSON.parse(text) : null;
//       } catch {
//         payload = { message: text };
//       }

//       if (!response.ok) {
//         let errorMessage = "Échec de la connexion";
//         try {
//           const errorData = await response.json();
//           errorMessage =
//             errorData.message || errorData.MotDePasse || errorMessage;
//         } catch {
//           // Fallback if response is not JSON
//         }
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();
//       console.log("Login Response:", data); // Debug the response
//       localStorage.setItem("token", data.token); // Adjust to data.token if needed
//       console.log("Stored token:", data.token);

//       // Fetch user details to get the role
//       const token = data.token;
//       console.log("Fetching /auth/moi with token:", data.accessToken);
//       const userResponse = await fetch(`${API_BASE_URL}/auth/moi`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//       });

//       if (!userResponse.ok) {
//         //throw new Error("Impossible de récupérer les détails de l'utilisateur");
//         throw new Error(
//           `Failed to fetch user details: ${userResponse.statusText}`
//         );
//       }

//       const userData = await userResponse.json();
//       //
//       localStorage.setItem("user", JSON.stringify(userData));

//       console.log("User Data:", userData);
//       const role = userData.role; 
//       console.log("User role:", role);

//       // Navigate based on role (only to protected dashboards)
//       switch (role) {
//         case "PATIENT":
//           navigate("/PatientDash");
//           break;
//         case "MEDECIN": // Add other roles as needed
//           navigate("/MedecinDash");
//           break;
//         case "ADMIN":
//           navigate("/AdminDash");
//           break;
//         case "RECEPTIONNISTE":
//           navigate("/ReceptionnisteDash");
//           break;
//         default:
//           // No navigation for undefined or unrecognized roles
//           break;
//       }
//     } catch (error) {
//       console.error("Erreur de connexion :",error);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancelClick = () => {
//     navigate("/");
//   }

//   return (
//     <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
//       <div
//         className="card shadow p-4 p-md-5 w-100"
//         style={{ maxWidth: "400px" }}
//       >
//         <form onSubmit={handleSubmit}>
//           <h3 className="text-center mb-4">Se Connecter</h3>

//           {error && (
//             <div className="alert alert-danger" role="alert">
//               {error}
//             </div>
//           )}

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
//             <label htmlFor="motDePasse" className="form-label">
//               Mot de passe
//             </label>
//             <div className="input-group">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="form-control"
//                 id="motDePasse"
//                 placeholder="Entrez votre mot de passe"
//                 value={motDePasse}
//                 onChange={(e) => setMotDePasse(e.target.value)}
//                 required
//                 disabled={isLoading}
//               />
//               <span
//                 className="input-group-text"
//                 style={{ cursor: "pointer", background: "white" }}
//                 onClick={togglePasswordVisibility}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//           </div>
//           {/* {d-grid mb-3} */}
//           <div className="d-flex mb-3 gap-2">
//             <button
//               type="submit"
//               className="btn btn-primary flex-grow-1"
//               disabled={isLoading}
//             >
//               {isLoading ? "Connexion..." : "Login"}
//             </button>
//             <button
//               className="btn btn-primary  flex-grow-1"
//               onClick={handleCancelClick}
//             >
//               Annuler
//             </button>
//           </div>
//           <p onClick={handleRegisterClick} className="registerText">
//             Don't have an accout register here!
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

