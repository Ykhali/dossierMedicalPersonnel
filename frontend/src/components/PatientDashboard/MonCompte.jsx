import React, { useEffect, useRef, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";
// Bootstrap Icons (pour les flèches, icônes profil, email, téléphone, etc.)
import "bootstrap-icons/font/bootstrap-icons.css";

import { Modal, Button } from "react-bootstrap";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import ChangerPwd from "./ChangerPwd";
import ChangeEmail from "./ChangeEmail";


import {
  getToken,
  isTokenValid,
  getSafeUserFromToken,
  clearAuth,
} from "../../utils/auth";


function ConfirmDeleteModal({
  show,
  onClose,
  onConfirm,
  loading = false,
  error = null,
}) {
  return (
    <Modal
      show={show}
      onHide={onClose} // clic dehors & Échap ferment
      centered
      backdrop="static" // <- si tu veux empêcher le clic dehors, mets "static"
      keyboard={!loading} // Échap actif si pas en loading
    >
      <Modal.Header closeButton>
        <Modal.Title>Supprimer mon compte</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Êtes-vous sûr de vouloir <strong>supprimer votre compte</strong> ?
          
        </p>
        {error && <div className="alert alert-danger mb-0 mt-3">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Suppression…
            </>
          ) : (
            "Oui, supprimer"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function VerifyEmailModal({ show, onClose, email, onVerified }) {
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [resendIn, setResendIn] = React.useState(0);

  // countdown
  React.useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  // envoie auto d’un OTP quand le modal s’ouvre
  React.useEffect(() => {
    if (show && email) sendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, email]);

  const authHeader = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

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
      setResendIn(60); // doit correspondre à ton cooldown serveur
    } catch (_) {
      // on garde une réponse générique
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
      onVerified?.(); // laisse le parent mettre à jour l’UI
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




function MonCompte() {
  const [infos, setInfos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // OTP e-mail (modal)
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState("");
  const isEmailVerified = Boolean(infos?.emailVerifiedAt);


  //phone edit and Otp
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState(infos?.telephone || "");
  const [serverPhone, setServerPhone] = useState(infos?.telephone || "");

  // état pour le modal "Changer mot de passe"
  const [showPwd, setShowPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdError, setPwdError] = useState(null);

  //email
  const [showEmail, setShowEmail] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailError, setEmailError] = useState(null);

  // Suppression de compte
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchInfos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/Patient/basic-info`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${res.status}`
          );
        }

        const data = await res.json();
        setInfos(data);
        setPhone(data?.telephone || "");
        setServerPhone(data?.telephone || "");
      } catch (error) {
        setError(
          error.message || "Erreur lors de la récupération des patients"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfos();
  }, [navigate]);

  const fullName = (i) => [i?.nom, i?.prenom].filter(Boolean).join(" ") || "_";

  const maskPwd = (len) => {
    if (len == null) return "—";
    const cap = 12; // ne pas afficher 60 bullets
    return len <= cap ? "•".repeat(len) : "•".repeat(cap) + "…";
  };

  const handleProfileClick = () => navigate("/PatientDash/Account/information");

  // >>> appel API pour changer le mot de passe
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

      const payload = {
        oldPassword,
        newPassword,
        confirmNewPassword,
      };
      console.log("payload envoyé:", payload);

      const res = await fetch(`${API_BASE_URL}/api/Patient/changerMotDePasse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `HTTP ${res.status}`);
      }

      // succès : on ferme le modal
      setShowPwd(false);
    } catch (e) {
      setPwdError(e.message);
    } finally {
      setSavingPwd(false);
    }
  };

  async function apiChangePhone(newPhone) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Session expirée");
    }

    const r = await fetch(`${API_BASE_URL}/api/Patient/changerTelephone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // << OBLIGATOIRE
      },
      body: JSON.stringify({ phone: newPhone }),
    });

    if (r.status === 401) {
      // debug utile
      console.warn("401 changerTelephone: token manquant/invalid");
    }
    if (!r.ok) {
      const e = await r.json().catch(() => ({ message: "" }));
      throw new Error(e.message || `HTTP ${r.status}`);
    }
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

      const res = await fetch(`${API_BASE_URL}/api/Patient/changerEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `HTTP ${res.status}`);
      }

      // succès
      /*setShowEmail(false);
      setInfos((prev) => ({ ...prev, email: newEmail }));
      alert("E-mail mis à jour !");*/

      // succès
      const data = await res.json();

      // 1) save new tokens
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // 2) update infos state
      setShowEmail(false);
      setInfos((prev) => ({ ...prev, email: data.user?.email || newEmail }));

      // 3) optionally update a cached "user" object if you keep one
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.email = data.user?.email || newEmail;
      localStorage.setItem("user", JSON.stringify(user));

      // 3.1) lancer la vérification du NOUVEL e-mail automatiquement
      const target = data.user?.email || newEmail;
      setEmailToVerify(target);
      setShowEmailVerify(true); // le modal enverra l’OTP automatiquement

      // 4) feedback
      alert("E-mail mis à jour, session réactualisée !");
      
    } catch (e) {
      setEmailError(e.message);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // important pour supprimer cookie httpOnly côté serveur
      });
    } catch (_) {
      // même si la requête échoue, on nettoie côté client
    } finally {
      clearAuth();
      // Hard reload pour repartir propre (évite états en mémoire)
      window.location.assign("/login");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);

      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Session expirée, veuillez vous reconnecter.");

      // ← adapte l’endpoint/méthode à ton back :
      // si tu as @PutMapping("/delete-account") :
      const res = await fetch(`${API_BASE_URL}/api/Patient/delete-account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      // succès → on ferme le modal, on purge l’auth et on redirige
      setShowDelete(false);
      clearAuth();
      window.location.assign("/login");
    } catch (e) {
      setDeleteError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleVerifyEmail = () => {
    if (!infos?.email) return;
    if (isEmailVerified) {
      alert("Votre e-mail est déjà vérifié.");
      return;
    }
    setEmailToVerify(infos.email); // e-mail actuel
    setShowEmailVerify(true); // ouvre le modal + envoie OTP (auto)
  };


  return (
    <div className="containe mt-5">
      <div className="row justify-content-center">
        {/* largeur lisible */}
        <div className="col-12 col-lg-8">
          {/* Titre */}
          <h1 className="h3 fw-bold mb-4">Mon compte</h1>

          {/* ===== Identité ===== */}
          <div className="text-uppercase text-secondary small fw-bold mb-2">
            Identité
          </div>
          <div className="card border-0 shadow-sm mb-4">
            <ul className="list-group list-group-flush">
              {/* Mon profil */}
              <li className="list-group-item p-0">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link link-body-emphasis text-decoration-none"
                  onClick={handleProfileClick}
                >
                  <div className="d-flex align-items-start gap-3">
                    <span
                      className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="bi-person-fill text-primary"></i>
                    </span>
                    <div>
                      <div className="fw-semibold">Mon profil</div>
                      <div className="text-secondary small">
                        {infos ? fullName(infos) : "—"}
                      </div>
                    </div>
                  </div>
                  <i className="bi-chevron-right text-secondary"></i>
                </button>
              </li>
            </ul>
          </div>

          {/* ===== Connexion ===== */}
          <div className="text-uppercase text-secondary small fw-bold mb-2">
            Connexion
          </div>
          <div className="card border-0 shadow-s mb-4">
            <ul className="list-group list-group-flush">
              {/* Téléphone */}
              {/* <li className="list-group-item p-0">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center
                   justify-content-between text-start py-3
                    px-3 btn btn-link link-body-emphasis text-decoration-none"
                  onClick={() => navigate("/securite/telephone")}
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
                        {infos?.telephone || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge rounded-pill text-bg-success">
                      Vérifié
                    </span>
                    <i className="bi-chevron-right text-secondary"></i>
                  </div>
                </button>
              </li> */}
              <li className="list-group-item p-0">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center 
                  justify-content-between text-start py-3 px-3 btn 
                  btn-link link-body-emphasis text-decoration-none"
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
                  ></i>
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

              {/* E‑mail */}
              {/* <li className="list-group-item p-0 border-top">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link link-body-emphasis text-decoration-none"
                  onClick={() => navigate("/securite/email")}
                >
                  <div className="d-flex align-items-start gap-3">
                    <span
                      className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="bi-envelope-fill text-primary"></i>
                    </span>
                    <div>
                      <div className="fw-semibold">E‑mail</div>
                      <div className="text-secondary small">
                        {infos?.email || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge rounded-pill text-bg-success">
                      Vérifié
                    </span>
                    <i className="bi-chevron-right text-secondary"></i>
                  </div>
                </button>
              </li> */}
              {/* <li className="list-group-item p-0 border-top">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link link-body-emphasis text-decoration-none"
                  onClick={() => setShowEmail(true)} // <<< ouvre le modal
                >
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
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="badge rounded-pill text-bg-success"
                      //onClick={handleVerifyEmail}
                    >
                      Vérifié
                    </span>
                    <i className="bi-chevron-right text-secondary"></i>
                  </div>
                </button>
              </li> */}
              <li className="list-group-item p-0 border-top">
                <div
                  role="button"
                  tabIndex={0}
                  className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 link-body-emphasis text-decoration-none"
                  onClick={() => setShowEmail(true)} // ouvre le modal "Changer d’e-mail" en cliquant la ligne
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setShowEmail(true);
                    }
                  }}
                >
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

                  <div className="d-flex align-items-center gap-2">
                    {isEmailVerified ? (
                      <span className="badge rounded-pill text-bg-success">
                        Vérifié
                      </span>
                    ) : (
                      <>
                        <span className="badge rounded-pill text-bg-warning text-dark">
                          Non vérifié
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation(); // n’ouvre pas le modal de changement
                            handleVerifyEmail(); // lance la vérification OTP de l’e-mail actuel
                          }}
                          title="Vérifier l’e-mail actuel"
                        >
                          Vérifier
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={(e) => {
                        e.stopPropagation(); // évite le clic de la ligne
                        setShowEmail(true); // ouvre le modal "Changer d’e-mail"
                      }}
                      title="Changer d’e-mail"
                    >
                      Changer d’e-mail
                    </button>

                    <i className="bi-chevron-right text-secondary"></i>
                  </div>
                </div>
              </li>

              {/* Mot de passe */}
              <li className="list-group-item p-0 border-top">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link link-body-emphasis text-decoration-none"
                  onClick={() => setShowPwd(true)} // <<< ouvrir le modal
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

          <div className="text-uppercase text-secondary small fw-bold mb-2">
            Confidentialité
          </div>
          <div className="card border-0 shadow-sm mb-4">
            <ul className="list-group list-group-flush">
              {/* Mon profil */}
              {/* <li className="list-group-item p-0">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link link-body-emphasis text-decoration-none"
                  onClick={handleProfileClick}
                >
                  <div className="d-flex align-items-start gap-3">
                    <span
                      className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="bi-trash-fill text-danger"></i>
                    </span>
                    <div>
                      <div className="fw-semibold">Supprimer Mon Compte</div>
                    </div>
                  </div>
                  <i className="bi-chevron-right text-secondary"></i>
                </button>
              </li> */}
              <li className="list-group-item p-0">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link link-body-emphasis text-decoration-none"
                  onClick={() => setShowDelete(true)} // <<< ICI
                >
                  <div className="d-flex align-items-start gap-3">
                    <span
                      className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="bi-trash-fill text-danger"></i>
                    </span>
                    <div>
                      <div className="fw-semibold">Supprimer Mon Compte</div>
                    </div>
                  </div>
                  <i className="bi-chevron-right text-secondary"></i>
                </button>
              </li>
            </ul>
          </div>

          {/* Bloc Déconnexion */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="border-top border-bottom">
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-100 d-flex align-items-center justify-content-between text-start py-3 px-3 btn btn-link text-decoration-none"
              >
                <div className="d-flex align-items-start gap-3">
                  <span
                    className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                    style={{ width: 32, height: 32 }}
                  >
                    <i className="bi-box-arrow-right text-danger"></i>
                  </span>
                  <div className="fw-semibold text-danger">Déconnexion</div>
                </div>
                <i className="bi-chevron-right text-secondary"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* >>> Le modal est monté ici, contrôlé par MonCompte */}
      <ChangerPwd
        show={showPwd}
        onClose={() => setShowPwd(false)}
        onSubmit={handleChangePwd}
        isSubmitting={savingPwd}
        error={pwdError}
      />
      <ChangeEmail
        show={showEmail}
        onClose={() => setShowEmail(false)}
        onSubmit={handleChangeEmail}
        isSubmitting={savingEmail}
        error={emailError}
        currentEmail={infos?.email}
      />
      <ConfirmDeleteModal
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        error={deleteError}
      />
      <VerifyEmailModal
        show={showEmailVerify}
        onClose={() => setShowEmailVerify(false)}
        email={emailToVerify}
        onVerified={() => {
          // maj de l’état local
          setInfos((prev) => ({
            ...prev,
            emailVerifiedAt: new Date().toISOString(),
          }));
          // si tu gardes un user en cache
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          user.emailVerifiedAt = new Date().toISOString();
          localStorage.setItem("user", JSON.stringify(user));
          alert("E-mail vérifié ✅");
        }}
      />
    </div>
  );
}
export default MonCompte;

// MonCompte.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";

// export default function MonCompte() {
//   const [photoUrl, setPhotoUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let objectUrl;
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
//           headers: { Authorization: `Bearer ${token}` },
//           signal: controller.signal,
//         });

//         if (res.status === 401 || res.status === 403) {
//           localStorage.removeItem("token");
//           navigate("/login");
//           return;
//         }
//         if (res.status === 404) {
//           setPhotoUrl(null);      // pas de photo enregistrée
//           setErr(null);
//           return;
//         }
//         if (!res.ok) {
//           throw new Error(`HTTP ${res.status}`);
//         }

//         const blob = await res.blob();
//         objectUrl = URL.createObjectURL(blob);
//         setPhotoUrl(objectUrl);
//         setErr(null);
//       } catch (e) {
//         if (e.name !== "AbortError") {
//           console.error(e);
//           setErr("Impossible de charger la photo.");
//           setPhotoUrl(null);
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => {
//       controller.abort();
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     };
//   }, [navigate]);

//   return (
//     <div>
//       <h6 className="text-center mt-5">Mon Compte</h6>

//       <div>
//         <h6 className="m-5">Identité</h6>
//         <h6>Mon Profil</h6>

//         {loading ? (
//           <div
//             className="bg-light"
//             style={{ width: 80, height: 80 }}
//           />
//         ) : photoUrl ? (
//           <img
//             src={photoUrl}
//             alt="Photo profil"
//             className=""
//             width={80}
//             height={80}
//           />
//         ) : (
//           <div
//             className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
//             style={{ width: 80, height: 80 }}
//           >
//             <span>?</span>
//           </div>
//         )}

//         {err && <div className="text-danger small mt-2">{err}</div>}
//       </div>

//       <div>
//         <h6 className="m-5">Connexion</h6>
//         <h6 className="m-5">Téléphone</h6>
//         <h6 className="m-5">E-mail</h6>
//       </div>
//     </div>
//   );
// }
