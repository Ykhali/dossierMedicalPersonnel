import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import API_BASE_URL from "../../config/apiConfig";

/* ========= helper email ========= */
const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v || "");

/* ========= Modal : Créer une réceptionniste ========= */
function CreateReceptionnisteModal({ show, onClose, onCreated }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    cin: "",
    email: "",
    telephone: "",
    motdepasse: "",
    confirmpwd: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // reset quand on ouvre/ferme
  useEffect(() => {
    if (show) {
      setForm({
        nom: "",
        prenom: "",
        cin: "",
        email: "",
        telephone: "",
        motdepasse: "",
        confirmpwd: "",
      });
      setSaving(false);
      setError(null);
    }
  }, [show]);

  const tokenHeader = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  const validate = () => {
    if (!form.nom.trim()) return "Le nom est requis.";
    if (!form.prenom.trim()) return "Le prénom est requis.";
    if (!form.email.trim()) return "L'e-mail est requis.";
    // Validation e-mail simple
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "E-mail invalide.";
    if (!form.motdepasse) return "Le mot de passe est requis.";
    if (form.motdepasse.length < 6)
      return "Le mot de passe doit contenir au moins 6 caractères.";
    if (form.motdepasse !== form.confirmpwd)
      return "Les mots de passe ne correspondent pas.";
    return null;
  };

  const save = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      // Adapte l’URL ici si ton endpoint est côté médecin
      // const CREATE_URL = `${API_BASE_URL}/api/medecin/receptionnistes`;
      const CREATE_URL = `${API_BASE_URL}/api/Medecin/receptionnistes`;

      const res = await fetch(CREATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...tokenHeader(),
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // backend peut renvoyer des erreurs champ-par-champ
        const msg =
          data?.message ||
          data?.error ||
          Object.values(data || {})?.[0] ||
          `HTTP ${res.status}`;
        throw new Error(msg);
      }

      onCreated?.(data); // ajoute à la liste
      onClose?.(); // ferme le modal
    } catch (e) {
      setError(e.message || "Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        onClick={() => !saving && onClose?.()}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nouvelle réceptionniste</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => !saving && onClose?.()}
              />
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.nom}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nom: e.target.value }))
                    }
                    disabled={saving}
                    placeholder="nom"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Prénom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.prenom}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, prenom: e.target.value }))
                    }
                    disabled={saving}
                    placeholder="prenom"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Cin</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.cin}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cin: e.target.value }))
                    }
                    disabled={saving}
                    placeholder="cin"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    disabled={saving}
                    placeholder="abc@example.com"
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Téléphone (optionnel)</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={form.telephone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, telephone: e.target.value }))
                    }
                    disabled={saving}
                    placeholder="+2126..."
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.motdepasse}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, motdepasse: e.target.value }))
                    }
                    disabled={saving}
                    placeholder="••••••••"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.confirmpwd}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, confirmpwd: e.target.value }))
                    }
                    disabled={saving}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Annuler
              </button>
              <button
                className="btn btn-primary"
                onClick={save}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Création…
                  </>
                ) : (
                  "Créer"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Backdrop */}
      <div className="modal-backdrop show" />
    </>
  );
}

/* ========= Modal : Éditer une réceptionniste ========= */
// function EditReceptionnisteModal({ show, receptionniste, onClose, onSaved }) {
//   const [form, setForm] = useState({
//     nom: "",
//     prenom: "",
//     cin: "",
//     email: "",
//     telephone: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   });
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);

//   // pré-remplir quand on ouvre
//   useEffect(() => {
//     if (show && receptionniste) {
//       setForm({
//         nom: receptionniste.nom || "",
//         prenom: receptionniste.prenom || "",
//         cin: receptionniste.cin || "",
//         email: receptionniste.email || "",
//         telephone: receptionniste.telephone || "",
//         newPassword: "",
//         confirmNewPassword: "",
//       });
//       setSaving(false);
//       setError(null);
//     }
//   }, [show, receptionniste]);

//   const validate = () => {
//     if (!form.nom.trim()) return "Le nom est requis.";
//     if (!form.prenom.trim()) return "Le prénom est requis.";
//     if (!form.email.trim()) return "L'e-mail est requis.";
//     if (!isEmail(form.email)) return "E-mail invalide.";

//     // mot de passe optionnel : si rempli, on contrôle
//     if (form.newPassword || form.confirmNewPassword) {
//       if (form.newPassword.length < 6)
//         return "Le nouveau mot de passe doit contenir au moins 6 caractères.";
//       if (form.newPassword !== form.confirmNewPassword)
//         return "La confirmation du mot de passe ne correspond pas.";
//     }
//     return null;
//   };

//   const save = async () => {
//     const v = validate();
//     if (v) return setError(v);

//     setSaving(true);
//     setError(null);
//     try {
//       const id = receptionniste.id;
//       const UPDATE_URL = `${API_BASE_URL}/api/Medecin/receptionnistes/${id}`;

//       // on n’envoie pas les champs vides
//       const payload = {
//         nom: form.nom,
//         prenom: form.prenom,
//         cin: form.cin,
//         email: form.email,
//         telephone: form.telephone,
//       };
//       if (form.newPassword) {
//         payload.newPassword = form.newPassword; // adapte au nom attendu par ton DTO backend
//       }

//       const res = await fetch(UPDATE_URL, {
//         method: "PUT", // ou "PATCH" si ton endpoint est en PATCH
//         headers: { "Content-Type": "application/json", ...tokenHeader() },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         const msg =
//           data?.message ||
//           data?.error ||
//           Object.values(data || {})?.[0] ||
//           `HTTP ${res.status}`;
//         throw new Error(msg);
//       }

//       onSaved?.(data); // renvoyer l’objet modifié
//       onClose?.();
//     } catch (e) {
//       setError(e.message || "Erreur lors de la mise à jour");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <>
//       <div
//         className="modal d-block"
//         tabIndex="-1"
//         role="dialog"
//         onClick={() => !saving && onClose?.()}
//       >
//         <div
//           className="modal-dialog modal-dialog-centered"
//           role="document"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title">
//                 Modifier la réceptionniste
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={() => !saving && onClose?.()}
//               />
//             </div>

//             <div className="modal-body">
//               {error && <div className="alert alert-danger">{error}</div>}
//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <label className="form-label">Nom</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={form.nom}
//                     onChange={(e) =>
//                       setForm((f) => ({ ...f, nom: e.target.value }))
//                     }
//                     disabled={saving}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Prénom</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={form.prenom}
//                     onChange={(e) =>
//                       setForm((f) => ({ ...f, prenom: e.target.value }))
//                     }
//                     disabled={saving}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label">CIN</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={form.cin}
//                     onChange={(e) =>
//                       setForm((f) => ({ ...f, cin: e.target.value }))
//                     }
//                     disabled={saving}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label">E-mail</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     value={form.email}
//                     onChange={(e) =>
//                       setForm((f) => ({ ...f, email: e.target.value }))
//                     }
//                     disabled={saving}
//                   />
//                 </div>

//                 <div className="col-md-12">
//                   <label className="form-label">Téléphone</label>
//                   <input
//                     type="tel"
//                     className="form-control"
//                     value={form.telephone}
//                     onChange={(e) =>
//                       setForm((f) => ({ ...f, telephone: e.target.value }))
//                     }
//                     disabled={saving}
//                   />
//                 </div>

//                 <div className="col-12">
//                   <hr className="my-2" />
//                   <div className="form-text">
//                     Laissez les champs mot de passe vides si vous ne souhaitez
//                     pas le changer.
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label">Nouveau mot de passe</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     value={form.newPassword}
//                     onChange={(e) =>
//                       setForm((f) => ({ ...f, newPassword: e.target.value }))
//                     }
//                     disabled={saving}
//                     placeholder="••••••••"
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label">
//                     Confirmer le nouveau mot de passe
//                   </label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     value={form.confirmNewPassword}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         confirmNewPassword: e.target.value,
//                       }))
//                     }
//                     disabled={saving}
//                     placeholder="••••••••"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="modal-footer">
//               <button
//                 className="btn btn-outline-secondary"
//                 onClick={onClose}
//                 disabled={saving}
//               >
//                 Annuler
//               </button>
//               <button className="btn btn-primary" onClick={save} disabled={saving}>
//                 {saving ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Sauvegarde…
//                   </>
//                 ) : (
//                   "Enregistrer"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="modal-backdrop show" />
//     </>
//   );
// }
function EditReceptionnisteModal({ show, receptionniste, onClose, onSaved }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    cin: "",
    email: "",
    telephone: "",
    // bloc mot de passe
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [savingInfos, setSavingInfos] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [errorInfos, setErrorInfos] = useState(null);
  const [errorPwd, setErrorPwd] = useState(null);
  const [okPwd, setOkPwd] = useState(false);

  const tokenHeader = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  // pré-remplir quand on ouvre
  useEffect(() => {
    if (show && receptionniste) {
      setForm((f) => ({
        ...f,
        nom: receptionniste.nom || "",
        prenom: receptionniste.prenom || "",
        cin: receptionniste.cin || "",
        email: receptionniste.email || "",
        telephone: receptionniste.telephone || "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
      setSavingInfos(false);
      setSavingPwd(false);
      setErrorInfos(null);
      setErrorPwd(null);
      setOkPwd(false);
    }
  }, [show, receptionniste]);

  /* ========== Valids ========== */
  const validateInfos = () => {
    if (!form.nom.trim()) return "Le nom est requis.";
    if (!form.prenom.trim()) return "Le prénom est requis.";
    if (!form.email.trim()) return "L'e-mail est requis.";
    if (!isEmail(form.email)) return "E-mail invalide.";
    return null;
  };

  const validatePwd = () => {
    if (!form.oldPassword) return "Ancien mot de passe requis.";
    if (!form.newPassword || !form.confirmNewPassword)
      return "Nouveau mot de passe + confirmation requis.";
    if (form.newPassword.length < 6)
      return "Le nouveau mot de passe doit contenir au moins 6 caractères.";
    if (form.newPassword !== form.confirmNewPassword)
      return "La confirmation ne correspond pas.";
    return null;
  };

  /* ========== PATCH infos ========= */
  const saveInfos = async () => {
    const v = validateInfos();
    if (v) {
      setErrorInfos(v);
      return;
    }
    setSavingInfos(true);
    setErrorInfos(null);
    try {
      const id = receptionniste.id;
      const UPDATE_URL = `${API_BASE_URL}/api/Medecin/receptionnistes/${id}`;
      const payload = {
        nom: form.nom,
        prenom: form.prenom,
        cin: form.cin,
        email: form.email,
        telephone: form.telephone,
      };

      const res = await fetch(UPDATE_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...tokenHeader() },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          Object.values(data || {})?.[0] ||
          `HTTP ${res.status}`;
        throw new Error(msg);
      }

      onSaved?.(data);
      // onClose?.(); // si tu veux fermer le modal après, décommente
    } catch (e) {
      setErrorInfos(
        e.message || "Erreur lors de la mise à jour des informations."
      );
    } finally {
      setSavingInfos(false);
    }
  };

  /* ========== POST changer mot de passe ========= */
  const savePassword = async () => {
    const v = validatePwd();
    if (v) {
      setErrorPwd(v);
      return;
    }
    setSavingPwd(true);
    setErrorPwd(null);
    setOkPwd(false);
    try {
      const id = receptionniste.id;
      const URL = `${API_BASE_URL}/api/Medecin/receptionnistes/${id}/changerMotDePasse`;

      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader() },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
          confirmNewPassword: form.confirmNewPassword,
        }),
      });

      if (!res.ok) {
        // endpoint renvoie 204 en succès; en erreur, on peut tenter json
        const data = await res.json().catch(() => ({}));
        const msg =
          data?.message ||
          data?.error ||
          Object.values(data || {})?.[0] ||
          `HTTP ${res.status}`;
        throw new Error(msg);
      }

      // succès (204 no content) => on vide juste les champs et affiche un ok
      setForm((f) => ({
        ...f,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
      setOkPwd(true);
    } catch (e) {
      setErrorPwd(e.message || "Erreur lors du changement de mot de passe.");
    } finally {
      setSavingPwd(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        onClick={() => !savingInfos && !savingPwd && onClose?.()}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modifier la réceptionniste</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => !savingInfos && !savingPwd && onClose?.()}
              />
            </div>

            <div className="modal-body">
              {/* ===== Bloc infos ===== */}
              <h6 className="mb-3">Informations</h6>
              {errorInfos && (
                <div className="alert alert-danger py-2">{errorInfos}</div>
              )}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.nom}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nom: e.target.value }))
                    }
                    disabled={savingInfos || savingPwd}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Prénom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.prenom}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, prenom: e.target.value }))
                    }
                    disabled={savingInfos || savingPwd}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">CIN</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.cin}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cin: e.target.value }))
                    }
                    disabled={savingInfos || savingPwd}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    disabled={savingInfos || savingPwd}
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={form.telephone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, telephone: e.target.value }))
                    }
                    disabled={savingInfos || savingPwd}
                  />
                </div>

                <div className="col-12 d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={saveInfos}
                    disabled={savingInfos || savingPwd}
                  >
                    {savingInfos ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Enregistrement…
                      </>
                    ) : (
                      "Enregistrer les infos"
                    )}
                  </button>
                </div>
              </div>

              <hr className="my-3" />

              {/* ===== Bloc mot de passe ===== */}
              <h6 className="mb-3">Changer le mot de passe</h6>
              {errorPwd && (
                <div className="alert alert-danger py-2">{errorPwd}</div>
              )}
              {okPwd && (
                <div className="alert alert-success py-2">
                  Mot de passe changé avec succès.
                </div>
              )}
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Ancien mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.oldPassword}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, oldPassword: e.target.value }))
                    }
                    disabled={savingInfos || savingPwd}
                    placeholder="••••••••"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, newPassword: e.target.value }))
                    }
                    disabled={savingInfos || savingPwd}
                    placeholder="••••••••"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Confirmer</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.confirmNewPassword}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        confirmNewPassword: e.target.value,
                      }))
                    }
                    disabled={savingInfos || savingPwd}
                    placeholder="••••••••"
                  />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={savePassword}
                    disabled={savingInfos || savingPwd}
                  >
                    {savingPwd ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Changement…
                      </>
                    ) : (
                      "Changer le mot de passe"
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={savingInfos || savingPwd}
              >
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

function MesReceptionniste() {
  const [receps, setReceps] = useState([]); // [{id, nom, prenom, email, telephone}, ...]
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);

  const navigate = useNavigate();

  const tokenHeader = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  useEffect(() => {
    let alive = true;
    const fetchReceps = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Endpoint principal côté médecin (à exposer côté backend)
        // GET /api/medecin/receptionnistes -> retourne la liste des réceptionnistes du médecin connecté
        const res = await fetch(`${API_BASE_URL}/api/Medecin/receptionnistes`, {
          method: "GET",
          headers: { "Content-Type": "application/json", ...tokenHeader() },
          credentials: "include",
        });

        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.message || `HTTP ${res.status}`);
        }

        const data = await res.json().catch(() => []);
        if (alive) {
          setReceps(Array.isArray(data) ? data : data.items ?? []);
        }
      } catch (e) {
        if (alive) {
          setError(
            e.message ||
              "Impossible de charger vos réceptionnistes. Assurez-vous que l’endpoint /api/medecin/receptionnistes existe et est autorisé."
          );
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    };

    fetchReceps();
    return () => {
      alive = false;
    };
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtre côté UI
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return receps;
    return receps.filter((r) => {
      const nom = `${r?.nom ?? ""} ${r?.prenom ?? ""}`.toLowerCase();
      return (
        nom.includes(q) ||
        (r?.email ?? "").toLowerCase().includes(q) ||
        (r?.telephone ?? "").toLowerCase().includes(q)
      );
    });
  }, [receps, query]);

  return (
    <div className=" py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h2 className="h4 mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-journal-medical" />
          Mes Réceptionnistes
          {receps?.length > 0 && (
            <span className="badge text-bg-primary">{receps.length}</span>
          )}
        </h2>

        <button
          type="button"
          className="btn btn-outline-primary d-flex align-items-center justify-content-center rounded-circle p-2"
          style={{ width: 40, height: 40 }}
          title="Ajouter une receptionniste"
          onClick={() => setShowAdd(true)}
        >
          <i className="bi bi-plus-lg"></i>
        </button>

        <div className="input-group" style={{ maxWidth: 420 }}>
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search" />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Rechercher par nom, e-mail ou téléphone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="text-center py-5">Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted py-5">
          Aucune réceptionniste trouvée.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: 48 }}></th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Actiion</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="text-center">
                    <i className="bi bi-journal-medical" />
                  </td>
                  <td>{r.nom}</td>
                  <td>{r.prenom}</td>
                  <td>{r.email || "—"}</td>
                  <td>{r.telephone || "—"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center rounded-circle p-2"
                      style={{ width: 40, height: 40 }}
                      title="Modifier"
                      onClick={() => {
                        setCurrentEdit(r);
                        setShowEdit(true);
                      }}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateReceptionnisteModal
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={(created) => {
          if (created && created.id) {
            setReceps((prev) => [created, ...prev]);
          } else {
            fetchReceps();
          }
          setShowAdd(false);
        }}
      />

      <EditReceptionnisteModal
        show={showEdit}
        receptionniste={currentEdit}
        onClose={() => setShowEdit(false)}
        onSaved={(updated) => {
          // mise à jour optimiste de la ligne
          setReceps((prev) =>
            prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x))
          );
          setShowEdit(false);
        }}
      />
    </div>
  );
}

export default MesReceptionniste;
