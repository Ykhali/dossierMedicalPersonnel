// import React from 'react'

// function Profil() {
//   return (
//     <div className=" mt-5">
//       <div className="row justify-content-center">
//         <div className="col-12 col-lg-8">
//           <h1 className="h3 fw-bold mb-4">Mon compte</h1>
//           <div className="text-uppercase text-secondary small fw-bold mb-2">
//             Identité
//           </div>
//           <div className="card border-0 shadow-sm mb-4">
//             <ul className="list-group list-group-flush">
//               {/* Mon profil */}
//               <li className="list-group-item p-0">
//                 <button
//                   type="button"
//                   className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link link-body-emphasis text-decoration-none"
//                   //onClick={handleProfileClick}
//                 >
//                   <div className="d-flex align-items-start gap-3">
//                     <span
//                       className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
//                       style={{ width: 32, height: 32 }}
//                     >
//                       <i className="bi-person-fill text-primary"></i>
//                     </span>
//                     <div>
//                       <div className="fw-semibold">Mon profil</div>
//                       <div className="text-secondary small">hhhh</div>
//                     </div>
//                   </div>
//                   <i className="bi-chevron-right text-secondary"></i>
//                 </button>
//               </li>
//             </ul>
//           </div>
//           <div className="text-uppercase text-secondary small fw-bold mb-2">
//             Connexion
//           </div>
//           <div className="card border-0 shadow-s mb-4">
//             <ul className="list-group list-group-flush">
//               <li className="list-group-item p-0">
//                 <button
//                   type="button"
//                   className="w-100 d-flex align-items-center 
//                   justify-content-between text-start py-3 px-3 btn 
//                   btn-link link-body-emphasis text-decoration-none"
//                   onClick={() => setEditingPhone((v) => !v)}
//                 >
//                   <div className="d-flex align-items-start gap-3">
//                     <span
//                       className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
//                       style={{ width: 32, height: 32 }}
//                     >
//                       <i className="bi-telephone-fill text-primary"></i>
//                     </span>
//                     <div>
//                       <div className="fw-semibold">Téléphone</div>
//                       <div className="text-secondary small">
//                         {serverPhone || "—"}
//                       </div>
//                     </div>
//                   </div>
//                   <i
//                     className={`bi-chevron-${
//                       editingPhone ? "down" : "right"
//                     } text-secondary`}
//                   ></i>
//                 </button>

//                 {editingPhone && (
//                   <div className="px-3 pb-3">
//                     <div className="d-flex gap-2 align-items-center">
//                       <PhoneInput
//                         placeholder="+2126..."
//                         defaultCountry="MA"
//                         international
//                         className="form-control"
//                         value={phone}
//                         onChange={(v) => setPhone(v || "")}
//                       />
//                       <button className="btn btn-primary" onClick={savePhone}>
//                         Enregistrer
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </li>
//               <li className="list-group-item p-0 border-top">
//                 <div
//                   role="button"
//                   tabIndex={0}
//                   className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 link-body-emphasis text-decoration-none"
//                   onClick={() => setShowEmail(true)} // ouvre le modal "Changer d’e-mail" en cliquant la ligne
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === " ") {
//                       e.preventDefault();
//                       setShowEmail(true);
//                     }
//                   }}
//                 >
//                   <div className="d-flex align-items-start gap-3">
//                     <span
//                       className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
//                       style={{ width: 32, height: 32 }}
//                     >
//                       <i className="bi-envelope-fill text-primary"></i>
//                     </span>
//                     <div>
//                       <div className="fw-semibold">E-mail</div>
//                       <div className="text-secondary small">
//                         {infos?.email || "—"}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="d-flex align-items-center gap-2">
//                     {isEmailVerified ? (
//                       <span className="badge rounded-pill text-bg-success">
//                         Vérifié
//                       </span>
//                     ) : (
//                       <>
//                         <span className="badge rounded-pill text-bg-warning text-dark">
//                           Non vérifié
//                         </span>
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={(e) => {
//                             e.stopPropagation(); // n’ouvre pas le modal de changement
//                             handleVerifyEmail(); // lance la vérification OTP de l’e-mail actuel
//                           }}
//                           title="Vérifier l’e-mail actuel"
//                         >
//                           Vérifier
//                         </button>
//                       </>
//                     )}

//                     <button
//                       type="button"
//                       className="btn btn-sm btn-outline-secondary"
//                       onClick={(e) => {
//                         e.stopPropagation(); // évite le clic de la ligne
//                         setShowEmail(true); // ouvre le modal "Changer d’e-mail"
//                       }}
//                       title="Changer d’e-mail"
//                     >
//                       Changer d’e-mail
//                     </button>

//                     <i className="bi-chevron-right text-secondary"></i>
//                   </div>
//                 </div>
//               </li>

//               {/* Mot de passe */}
//               <li className="list-group-item p-0 border-top">
//                 <button
//                   type="button"
//                   className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link link-body-emphasis text-decoration-none"
//                   onClick={() => setShowPwd(true)} // <<< ouvrir le modal
//                 >
//                   <div className="d-flex align-items-start gap-3">
//                     <span
//                       className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
//                       style={{ width: 32, height: 32 }}
//                     >
//                       <i className="bi-shield-lock text-primary"></i>
//                     </span>
//                     <div>
//                       <div className="fw-semibold">Mot de passe</div>
//                       <div className="text-secondary small">
//                         {maskPwd(infos?.passwordLength)}
//                       </div>
//                     </div>
//                   </div>
//                   <i className="bi-chevron-right text-secondary"></i>
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profil;

import React from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import { Modal, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

/* -------------------------------------------------------
   Petites utilitaires
--------------------------------------------------------*/
const fmt = (v) => (v ?? v === 0 ? String(v) : "—");
const fmtDate = (v) => (v ? new Date(v).toLocaleString() : "—");
const joinLangs = (arr) =>
  Array.isArray(arr) && arr.length ? arr.join(", ") : "—";
const authHeader = () => {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

/* -------------------------------------------------------
   Modal: Vérification e-mail via OTP
--------------------------------------------------------*/
function VerifyEmailModal({ show, onClose, email, onVerified }) {
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [resendIn, setResendIn] = React.useState(0);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  // envoi auto d’un OTP quand le modal s’ouvre
  React.useEffect(() => {
    if (show && email) sendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, email]);

  async function sendOtp() {
    if (!email) return;
    setBusy(true);
    setError(null);
    try {
      await fetch(`${API_BASE_URL}/auth/email-otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ email }),
      });
      setResendIn(60); // cooldown cohérent avec le back
    } catch (_) {
      setResendIn(60);
    } finally {
      setBusy(false);
    }
  }

  async function verify(e) {
    e?.preventDefault?.();
    if (!email || code.length !== 6) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(`${API_BASE_URL}/auth/email-otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ email, code }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      onVerified?.();
      onClose();
    } catch (err) {
      setError(err.message || "Code invalide ou expiré");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      show={show}
      onHide={() => !busy && onClose()}
      centered
      backdrop="static"
      keyboard={!busy}
    >
      <Modal.Header closeButton={!busy}>
        <Modal.Title>Vérification de l’e-mail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">
          Un code à 6 chiffres a été envoyé à <strong>{email}</strong>.
        </p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={verify}>
          <div className="input-group mb-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              className="form-control"
              placeholder="Code à 6 chiffres"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              disabled={busy}
              required
            />
            <button
              className="btn btn-primary"
              disabled={busy || code.length !== 6}
            >
              {busy ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Vérification…
                </>
              ) : (
                "Valider"
              )}
            </button>
          </div>
        </form>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">Le code expire dans ~10 min.</small>
          <button
            className="btn btn-link p-0"
            onClick={sendOtp}
            disabled={busy || resendIn > 0}
          >
            {resendIn > 0 ? `Renvoyer (${resendIn}s)` : "Renvoyer le code"}
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose} disabled={busy}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/* -------------------------------------------------------
   Modal: Changer mot de passe
--------------------------------------------------------*/
function ChangePwdModal({ show, onClose, onSubmit, isSubmitting, error }) {
  const [oldPassword, setOld] = React.useState("");
  const [newPassword, setNew] = React.useState("");
  const [confirmNewPassword, setConfirm] = React.useState("");

  React.useEffect(() => {
    if (show) {
      setOld("");
      setNew("");
      setConfirm("");
    }
  }, [show]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ oldPassword, newPassword, confirmNewPassword });
  };

  return (
    <Modal show={show} onHide={() => !isSubmitting && onClose()} centered>
      <Modal.Header closeButton={!isSubmitting}>
        <Modal.Title>Changer le mot de passe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Ancien mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOld(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nouveau mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNew(e.target.value)}
              required
              disabled={isSubmitting}
              minLength={6}
            />
            <div className="form-text">
              6+ caractères, inclure majuscules, minuscules et chiffres.
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Confirmer le nouveau</label>
            <input
              type="password"
              className="form-control"
              value={confirmNewPassword}
              onChange={(e) => setConfirm(e.target.value)}
              required
              disabled={isSubmitting}
              minLength={6}
            />
          </div>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Enregistrement…
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

/* -------------------------------------------------------
   Modal: Changer e-mail
--------------------------------------------------------*/
function ChangeEmailModal({
  show,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  currentEmail,
}) {
  const [newEmail, setNewEmail] = React.useState("");

  React.useEffect(() => {
    if (show) setNewEmail(currentEmail || "");
  }, [show, currentEmail]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ newEmail });
  };

  return (
    <Modal show={show} onHide={() => !isSubmitting && onClose()} centered>
      <Modal.Header closeButton={!isSubmitting}>
        <Modal.Title>Changer d’e-mail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Nouvel e-mail</label>
            <input
              type="email"
              className="form-control"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Enregistrement…
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

/* -------------------------------------------------------
   Page: Profil (Réceptionniste)
--------------------------------------------------------*/
function Profil() {
  const navigate = useNavigate();

  // données
  const [infos, setInfos] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // phone edit
  const [editingPhone, setEditingPhone] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const [serverPhone, setServerPhone] = React.useState("");

  // e-mail / OTP
  const [showEmail, setShowEmail] = React.useState(false);
  const [savingEmail, setSavingEmail] = React.useState(false);
  const [emailError, setEmailError] = React.useState(null);
  const [showEmailVerify, setShowEmailVerify] = React.useState(false);
  const [emailToVerify, setEmailToVerify] = React.useState("");

  // mot de passe
  const [showPwd, setShowPwd] = React.useState(false);
  const [savingPwd, setSavingPwd] = React.useState(false);
  const [pwdError, setPwdError] = React.useState(null);

  const isEmailVerified = Boolean(infos?.emailVerifiedAt);

  // fetch infos
  React.useEffect(() => {
    const fetchInfos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await fetch(
          `${API_BASE_URL}/api/receptionniste/basic-info`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

        setInfos(data);
        setPhone(data?.telephone || "");
        setServerPhone(data?.telephone || "");
      } catch (err) {
        setError(err.message || "Erreur lors du chargement du profil");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfos();
  }, [navigate]);

  // API calls
  async function apiChangePhone(newPhone) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Session expirée");
    const r = await fetch(`${API_BASE_URL}/api/receptionniste/changePhone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone: newPhone }),
      credentials: "include",
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.message || `HTTP ${r.status}`);
  }

  const savePhone = async () => {
    try {
      await apiChangePhone(phone);
      setServerPhone(phone);
      setEditingPhone(false);
      alert("Numéro mis à jour !");
    } catch (e) {
      alert(e.message);
    }
  };

  const handleChangeEmail = async ({ newEmail }) => {
    try {
      setSavingEmail(true);
      setEmailError(null);
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Session expirée, veuillez vous reconnecter.");

      const res = await fetch(
        `${API_BASE_URL}/api/receptionniste/changerEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newEmail }),
          credentials: "include",
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      // Certains back renvoient de nouveaux tokens
      if (data.accessToken) localStorage.setItem("token", data.accessToken);
      if (data.refreshToken)
        localStorage.setItem("refreshToken", data.refreshToken);

      // MAJ UI
      const updatedEmail = data.user?.email || newEmail;
      setInfos((prev) => ({
        ...prev,
        email: updatedEmail,
        emailVerifiedAt: null,
      }));
      setShowEmail(false);

      // Lancer OTP sur le nouvel e-mail
      setEmailToVerify(updatedEmail);
      setShowEmailVerify(true);

      alert("E-mail mis à jour !");
    } catch (e) {
      setEmailError(e.message);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleVerifyEmail = () => {
    if (!infos?.email) return;
    if (isEmailVerified) {
      alert("Votre e-mail est déjà vérifié.");
      return;
    }
    setEmailToVerify(infos.email);
    setShowEmailVerify(true);
  };

  const maskPwd = (len) => {
    if (len == null) return "—";
    const cap = 12;
    return len <= cap ? "•".repeat(len) : "•".repeat(cap) + "…";
    // ou juste "••••••••" si tu ne connais pas la longueur
  };

  const handleChangePwd = async ({
    oldPassword,
    newPassword,
    confirmNewPassword,
  }) => {
    try {
      setSavingPwd(true);
      setPwdError(null);

      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Session expirée, veuillez vous reconnecter.");

      const res = await fetch(`${API_BASE_URL}/api/receptionniste/changePwd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmNewPassword,
        }),
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      setShowPwd(false);
      alert("Mot de passe mis à jour !");
    } catch (e) {
      setPwdError(e.message);
    } finally {
      setSavingPwd(false);
    }
  };

  /* ---------------- UI ---------------- */
  if (isLoading) {
    return (
      <div className="mt-5 text-center">
        <div className="spinner-border me-2" />
        Chargement du profil…
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <h1 className="h3 fw-bold mb-4">Mon compte</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* ===== Identité (lecture seule) ===== */}
          <div className="text-uppercase text-secondary small fw-bold mb-2">
            Identité
          </div>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="text-secondary small">Nom</div>
                  <div className="fw-semibold">{fmt(infos?.nom)}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-secondary small">Prénom</div>
                  <div className="fw-semibold">{fmt(infos?.prenom)}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-secondary small">Cin</div>
                  <div className="fw-semibold">{fmt(infos?.cin)}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-secondary small">Établissement</div>
                  <div className="fw-semibold">{fmt(infos?.etablissement)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Connexion ===== */}
          <div className="text-uppercase text-secondary small fw-bold mb-2">
            Connexion
          </div>
          <div className="card border-0 shadow-sm mb-4">
            <ul className="list-group list-group-flush">
              {/* Téléphone (éditable) */}
              <li className="list-group-item p-0">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link link-body-emphasis text-decoration-none"
                  onClick={() => setEditingPhone((v) => !v)}
                >
                  <div className="d-flex align-items-start gap-3">
                    <span
                      className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="bi-telephone-fill text-primary"></i>
                    </span>
                    <div>
                      <div className="fw-semibold">Téléphone</div>
                      <div className="text-secondary small">
                        {serverPhone || "—"}
                      </div>
                    </div>
                  </div>
                  <i
                    className={`bi-chevron-${
                      editingPhone ? "down" : "right"
                    } text-secondary`}
                  />
                </button>

                {editingPhone && (
                  <div className="px-3 pb-3">
                    <div className="d-flex gap-2 align-items-center">
                      <PhoneInput
                        placeholder="+2126..."
                        defaultCountry="MA"
                        international
                        className="form-control"
                        value={phone}
                        onChange={(v) => setPhone(v || "")}
                      />
                      <button className="btn btn-primary" onClick={savePhone}>
                        Enregistrer
                      </button>
                    </div>
                  </div>
                )}
              </li>

              {/* E-mail */}
              <li className="list-group-item p-0 border-top">
                <div className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3">
                  <div className="d-flex align-items-start gap-3">
                    <span
                      className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="bi-envelope-fill text-primary"></i>
                    </span>
                    <div>
                      <div className="fw-semibold">E-mail</div>
                      <div className="text-secondary small">
                        {infos?.email || "—"}
                      </div>
                    </div>
                  </div>
                  {/* rien à droite */}
                </div>
              </li>

              {/* Mot de passe */}
              <li className="list-group-item p-0 border-top">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link link-body-emphasis text-decoration-none"
                  onClick={() => setShowPwd(true)}
                >
                  <div className="d-flex align-items-start gap-3">
                    <span
                      className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="bi-shield-lock text-primary"></i>
                    </span>
                    <div>
                      <div className="fw-semibold">Mot de passe</div>
                      <div className="text-secondary small">
                        {maskPwd(infos?.passwordLength)}
                      </div>
                    </div>
                  </div>
                  <i className="bi-chevron-right text-secondary"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePwdModal
        show={showPwd}
        onClose={() => setShowPwd(false)}
        onSubmit={handleChangePwd}
        isSubmitting={savingPwd}
        error={pwdError}
      />
      <ChangeEmailModal
        show={showEmail}
        onClose={() => setShowEmail(false)}
        onSubmit={handleChangeEmail}
        isSubmitting={savingEmail}
        error={emailError}
        currentEmail={infos?.email}
      />
      <VerifyEmailModal
        show={showEmailVerify}
        onClose={() => setShowEmailVerify(false)}
        email={emailToVerify}
        onVerified={() => {
          setInfos((prev) => ({
            ...prev,
            emailVerifiedAt: new Date().toISOString(),
          }));
          // si tu maintiens un "user" en localStorage :
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          user.emailVerifiedAt = new Date().toISOString();
          localStorage.setItem("user", JSON.stringify(user));
          alert("E-mail vérifié ✅");
        }}
      />
    </div>
  );
}

export default Profil;
