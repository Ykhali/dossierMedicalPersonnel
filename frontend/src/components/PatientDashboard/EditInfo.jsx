// // EditInfo.jsx
// import React, { useEffect, useRef, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import Modal from "bootstrap/js/dist/modal";

// /**
//  * Props :
//  *  - show: boolean
//  *  - onClose: () => void
//  *  - onSave: (payload) => Promise<void> | void
//  *  - defaultValues: {
//  *      prenom?, nom?, datedenaissance?, adresse?, email?, cin?, telephone?, sexe?
//  *    }
//  *  - currentEmail: string (pour empêcher de saisir l’email actuel)
//  */
// export default function EditInfo({
//   show,
//   onClose,
//   onSave,
//   defaultValues = {},
//   currentEmail = "",
// }) {
//   const modalRef = useRef(null);
//   const bsModalRef = useRef(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [email, setEmail] = useState(defaultValues.email || "");

//   // Instancie la modal une seule fois
//   useEffect(() => {
//     if (!modalRef.current) return;
//     bsModalRef.current = new Modal(modalRef.current, {
//       backdrop: "static",
//       keyboard: true,
//       focus: true,
//     });
//     return () => {
//       try {
//         bsModalRef.current?.hide();
//         bsModalRef.current?.dispose?.();
//       } catch {}
//       bsModalRef.current = null;
//     };
//   }, []);

//   // Ouvre/ferme en fonction de `show`
//   useEffect(() => {
//     if (!bsModalRef.current) return;
//     if (show) bsModalRef.current.show();
//     else bsModalRef.current.hide();
//   }, [show]);

//   // Suit la valeur par défaut de l’email
//   useEffect(() => {
//     setEmail(defaultValues.email || "");
//   }, [defaultValues.email]);

//   const sameEmail = (a, b) =>
//     (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;

//     if (!form.checkValidity()) {
//       form.reportValidity();
//       return;
//     }

//     if (email && sameEmail(email, currentEmail)) {
//       alert("Le nouvel e-mail doit être différent de l’e-mail actuel.");
//       return;
//     }

//     const data = new FormData(form);
//     const payload = Object.fromEntries(data.entries());

//     payload.email = email || "";
//     payload.prenom = payload.prenom?.trim();
//     payload.nom = payload.nom?.trim();
//     payload.adresse = payload.adresse?.trim();
//     payload.cin = payload.cin?.trim();
//     payload.telephone = payload.telephone?.trim();

//     try {
//       setSubmitting(true);
//       await onSave?.(payload);
//       onClose?.();
//     } catch (err) {
//       alert(err?.message || "Erreur lors de l’enregistrement.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div ref={modalRef} className="modal fade" tabIndex="-1" aria-hidden="true">
//       {/* ⚡ modal-dialog-scrollable permet de scroller uniquement le body */}
//       <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
//         <div className="modal-content shadow-lg border-0 rounded-4">
//           {/* Header fixé */}
//           <div className="modal-header">
//             <h5 className="modal-title fw-bold">Modifier mon profil</h5>
//             <button
//               type="button"
//               className="btn-close"
//               aria-label="Fermer"
//               onClick={onClose}
//               disabled={submitting}
//             />
//           </div>

//           {/* Body scrollable */}
//           <form onSubmit={handleSubmit} noValidate>
//             <div className="modal-body">
//               <p className="text-muted small mb-4">
//                 Ces informations peuvent être partagées avec vos soignants et
//                 utilisées pour vos documents. Tous les champs sont obligatoires,
//                 sauf indication contraire.
//               </p>

//               {/* Sexe */}
//               <div className="mb-3">
//                 <label className="form-label d-block">
//                   Sexe sur la pièce d’identité
//                 </label>
//                 <div className="d-flex gap-3">
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="sexe"
//                       id="sexeF"
//                       value="FEMININ"
//                       defaultChecked={defaultValues.sexe === "FEMININ"}
//                       required
//                     />
//                     <label className="form-check-label" htmlFor="sexeF">
//                       Féminin
//                     </label>
//                   </div>
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="sexe"
//                       id="sexeM"
//                       value="MASCULIN"
//                       defaultChecked={defaultValues.sexe === "MASCULIN"}
//                     />
//                     <label className="form-check-label" htmlFor="sexeM">
//                       Masculin
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Prénom */}
//               <div className="mb-3">
//                 <label className="form-label">Prénom</label>
//                 <input
//                   className="form-control"
//                   name="prenom"
//                   defaultValue={defaultValues.prenom || ""}
//                   required
//                   minLength={2}
//                   maxLength={60}
//                 />
//               </div>

//               {/* Nom */}
//               <div className="mb-3">
//                 <label className="form-label">Nom</label>
//                 <input
//                   className="form-control"
//                   name="nom"
//                   defaultValue={defaultValues.nom || ""}
//                   required
//                   minLength={2}
//                   maxLength={60}
//                 />
//               </div>

//               {/* Date de naissance */}
//               <div className="mb-3">
//                 <label className="form-label">Date de naissance</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   name="datedenaissance"
//                   defaultValue={defaultValues.datedenaissance || ""}
//                   required
//                 />
//                 <div className="form-text">
//                   Format : jj/mm/aaaa (affichage selon votre navigateur)
//                 </div>
//               </div>

//               {/* Adresse */}
//               <div className="mb-3">
//                 <label className="form-label">Adresse</label>
//                 <textarea
//                   className="form-control"
//                   name="adresse"
//                   rows={2}
//                   defaultValue={defaultValues.adresse || ""}
//                   maxLength={180}
//                 />
//               </div>

//               {/* CIN + Téléphone */}
//               <div className="row">
//                 <div className="col-12 col-md-6 mb-3">
//                   <label className="form-label">CIN</label>
//                   <input
//                     className="form-control"
//                     name="cin"
//                     defaultValue={defaultValues.cin || ""}
//                     pattern="^[A-Za-z0-9]{4,18}$"
//                     title="4 à 18 caractères alphanumériques"
//                   />
//                 </div>
//                 <div className="col-12 col-md-6 mb-3">
//                   <label className="form-label">Téléphone</label>
//                   <input
//                     className="form-control"
//                     name="telephone"
//                     defaultValue={defaultValues.telephone || ""}
//                     pattern="^\\+?[0-9\\s\\-]{6,20}$"
//                     title="Numéro de téléphone valide"
//                   />
//                 </div>
//               </div>

//               {/* E-mail */}
//               <div className="mb-1">
//                 <label className="form-label">E-mail</label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   name="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="ex: nom@example.com"
//                   required
//                 />
//                 {email && sameEmail(email, currentEmail) && (
//                   <div className="text-danger small mt-1">
//                     Le nouvel e-mail doit être différent de l’e-mail actuel.
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Footer fixé */}
//             <div >
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary"
//                 onClick={onClose}
//                 disabled={submitting}
//               >
//                 Annuler
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={
//                   submitting || (email && sameEmail(email, currentEmail))
//                 }
//               >
//                 {submitting ? "Enregistrement..." : "Enregistrer"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// EditInfo.jsx
// import React, { useEffect, useRef, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import Modal from "bootstrap/js/dist/modal";

/**
 * Props :
 *  - show: boolean
 *  - onClose: () => void
 *  - onSave: (payload) => Promise<void> | void
 *  - defaultValues: {
 *      prenom?, nom?, datedenaissance?, adresse?, email?, cin?, telephone?, sexe?
 *    }
 *  - currentEmail: string (pour empêcher de saisir l’email actuel)
 */
// export default function EditInfo({
//   show,
//   onClose,
//   onSave,
//   defaultValues = {},
//   currentEmail = "",
// }) {
//   const modalRef = useRef(null);
//   const bsModalRef = useRef(null);
//   const [submitting, setSubmitting] = useState(false);
//   //const [email, setEmail] = useState(defaultValues.email || "");
//   const [email, setEmail] = useState(""); 

//   // Instancier la modal une seule fois
//   useEffect(() => {
//     if (!modalRef.current) return;
//     bsModalRef.current = new Modal(modalRef.current, {
//       backdrop: "static",
//       keyboard: true,
//       focus: true,
//     });
//     return () => {
//       try {
//         bsModalRef.current?.hide();
//         bsModalRef.current?.dispose?.();
//       } catch {}
//       bsModalRef.current = null;
//     };
//   }, []);

//   // Ouvrir/fermer selon `show`
//   useEffect(() => {
//     if (!bsModalRef.current) return;
//     if (show) bsModalRef.current.show();
//     else bsModalRef.current.hide();
//   }, [show]);

//   // Suivre la valeur par défaut de l’email
//   // useEffect(() => {
//   //   setEmail(defaultValues.email || "");
//   // }, [defaultValues.email]);

//   const sameEmail = (a, b) =>
//     (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;

//     if (!form.checkValidity()) {
//       form.reportValidity();
//       return;
//     }

//     // if (email && sameEmail(email, currentEmail)) {
//     //   alert("Le nouvel e-mail doit être différent de l’e-mail actuel.");
//     //   return;
//     // }

//     const data = new FormData(form);
//     const payload = Object.fromEntries(data.entries());

//     payload.prenom = payload.prenom?.trim();
//     payload.nom = payload.nom?.trim();
//     payload.adresse = payload.adresse?.trim();
//     payload.cin = payload.cin?.trim();
//     payload.telephone = payload.telephone?.trim();

//     try {
//       setSubmitting(true);
//       await onSave?.(payload);
//       onClose?.();
//     } catch (err) {
//       alert(err?.message || "Erreur lors de l’enregistrement.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div
//       ref={modalRef}
//       className="modal fade"
//       tabIndex={-1}
//       aria-hidden="true"
//       role="dialog"
//     >
//       <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down">
//         {/* Scroll sur toute la modal (header + body + boutons) */}
//         <div
//           className="modal-content shadow-lg border-0 rounded-4"
//           style={{ maxHeight: "90vh", overflowY: "auto" }}
//         >
//           {/* Header (défile aussi) */}
//           <div className="modal-header">
//             <h5 className="modal-title fw-bold">Modifier mon profil</h5>
//             <button
//               type="button"
//               className="btn-close"
//               aria-label="Fermer"
//               onClick={onClose}
//               disabled={submitting}
//             />
//           </div>

//           <form onSubmit={handleSubmit} noValidate>
//             {/* Body scrollable */}
//             <div className="modal-body">
//               {/* <p className="text-muted small mb-4">
//                 Ces informations peuvent être partagées avec vos soignants et
//                 utilisées pour vos documents. Tous les champs sont obligatoires,
//                 sauf indication contraire.
//               </p> */}

//               {/* Sexe */}
//               <div className="mb-3">
//                 <label className="form-label d-block">
//                   Sexe sur la pièce d’identité
//                 </label>
//                 <div className="d-flex gap-3">
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="sexe"
//                       id="sexeF"
//                       value="FEMININ"
//                       defaultChecked={defaultValues.sexe === "FEMININ"}
//                       required
//                     />
//                     <label className="form-check-label" htmlFor="sexeF">
//                       Féminin
//                     </label>
//                   </div>
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="sexe"
//                       id="sexeM"
//                       value="MASCULIN"
//                       defaultChecked={defaultValues.sexe === "MASCULIN"}
//                     />
//                     <label className="form-check-label" htmlFor="sexeM">
//                       Masculin
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Prénom */}
//               <div className="mb-3">
//                 <label className="form-label">Prénom</label>
//                 <input
//                   className="form-control"
//                   name="prenom"
//                   defaultValue={defaultValues.prenom || ""}
//                   required
//                   minLength={2}
//                   maxLength={60}
//                 />
//               </div>

//               {/* Nom */}
//               <div className="mb-3">
//                 <label className="form-label">Nom</label>
//                 <input
//                   className="form-control"
//                   name="nom"
//                   defaultValue={defaultValues.nom || ""}
//                   required
//                   minLength={2}
//                   maxLength={60}
//                 />
//               </div>

//               {/* Date de naissance */}
//               <div className="mb-3">
//                 <label className="form-label">Date de naissance</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   name="datedenaissance"
//                   defaultValue={defaultValues.datedenaissance || ""}
//                   required
//                 />
//                 <div className="form-text">Format : jj/mm/aaaa</div>
//               </div>

//               {/* Adresse */}
//               <div className="mb-3">
//                 <label className="form-label">Adresse</label>
//                 <textarea
//                   className="form-control"
//                   name="adresse"
//                   rows={2}
//                   defaultValue={defaultValues.adresse || ""}
//                   maxLength={180}
//                 />
//               </div>

//               {/* CIN + Téléphone */}
//               <div className="row">
//                 <div className="col-12 col-md-6 mb-3">
//                   <label className="form-label">CIN</label>
//                   <input
//                     className="form-control"
//                     name="cin"
//                     defaultValue={defaultValues.cin || ""}
//                     pattern="^[A-Za-z0-9]{4,18}$"
//                     title="4 à 18 caractères alphanumériques"
//                   />
//                 </div>
//                 <div className="col-12 col-md-6 mb-3">
//                   <label className="form-label">Téléphone</label>
//                   <input
//                     className="form-control"
//                     name="telephone"
//                     defaultValue={defaultValues.telephone || ""}
//                     pattern="^\\+?[0-9\\s\\-]{6,20}$"
//                     title="Numéro de téléphone valide"
//                   />
//                 </div>
//               </div>

//               {/* E-mail */}
//               {/* <div className="mb-1">
//                 <label className="form-label">E-mail</label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   name="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="ex: nom@example.com"
//                   required
//                 />
//                 {email && sameEmail(email, currentEmail) && (
//                   <div className="text-danger small mt-1">
//                     Le nouvel e-mail doit être différent de l’e-mail actuel.
//                   </div>
//                 )}
//               </div> */}

//               {/* Boutons qui défilent avec le contenu */}
//               <div className="mt-4 d-flex justify-content-end gap-2">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary"
//                   onClick={onClose}
//                   disabled={submitting}
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={
//                     submitting 
//                   }
//                 >
//                   {submitting ? "Enregistrement..." : "Enregistrer"}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Modal from "bootstrap/js/dist/modal";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function EditInfo({
  show,
  onClose,
  onSave,
  defaultValues = {},
  currentEmail = "",
}) {
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const [phone, setPhone] = useState(defaultValues.telephone || "");

  const [sexe, setSexe] = useState(""); // contrôlé

  // Email désactivé dans ce formulaire (tu peux le réactiver si besoin)
  const [email, setEmail] = useState("");

  // Instancier la modal une seule fois
  useEffect(() => {
    if (!modalRef.current) return;
    bsModalRef.current = new Modal(modalRef.current, {
      backdrop: "static",
      keyboard: true,
      focus: true,
    });
    return () => {
      try {
        bsModalRef.current?.hide();
        bsModalRef.current?.dispose?.();
      } catch {}
      bsModalRef.current = null;
    };
  }, []);

  // Ouvrir/fermer selon `show`
  useEffect(() => {
    if (!bsModalRef.current) return;
    if (show) bsModalRef.current.show();
    else bsModalRef.current.hide();
  }, [show]);

  // Keep phone in sync if defaultValues change (optional)
  useEffect(() => {
    setPhone(defaultValues.telephone || "");
  }, [defaultValues.telephone]);

  const sameEmail = (a, b) =>
    (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    // Nettoyage basique
    payload.prenom = payload.prenom?.trim();
    payload.nom = payload.nom?.trim();
    payload.adresse = payload.adresse?.trim();
    payload.cin = payload.cin?.trim();
    payload.telephone = (payload.telephone || "").trim();

    try {
      setSubmitting(true);
      await onSave?.(payload);
      onClose?.();
    } catch (err) {
      alert(err?.message || "Erreur lors de l’enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };
  // helper pour normaliser ce qui vient du back
  const normalizeSex = (s = "") => {
    const v = s.toString().trim().toUpperCase();
    if (["FEMININ", "FEMME", "F"].includes(v)) return "FEMININ";
    if (["MASCULIN", "HOMME", "M"].includes(v)) return "MASCULIN";
    return ""; // inconnu / non renseigné
  };

  // quand la modale s'ouvre OU quand defaultValues.sexe change, on (ré)hydrate le state
  useEffect(() => {
    if (show) setSexe(normalizeSex(defaultValues.sexe));
  }, [show, defaultValues.sexe]);

  return (
    <div
      ref={modalRef}
      className="modal fade"
      tabIndex={-1}
      aria-hidden="true"
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down">
        {/* Scroll sur toute la modal (header + body + boutons) */}
        <div
          className="modal-content shadow-lg border-0 rounded-4"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          {/* Header (défile aussi) */}
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Modifier mes Informations Personnelles</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Fermer"
              onClick={onClose}
              disabled={submitting}
            />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Body scrollable */}
            <div className="modal-body">
              {/* Sexe */}
              {/* <div className="mb-3">
                <label className="form-label d-block">
                  Sexe sur la pièce d’identité
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sexe"
                      id="sexeF"
                      value="FEMININ"
                      defaultValue={defaultValues.sexe || ""}
                      defaultChecked={
                        defaultValues.sexe === "FEMININ" ||
                        defaultValues.sexe === "FEMME"
                      }
                      required
                    />
                    <label className="form-check-label" htmlFor="sexeF">
                      Féminin
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sexe"
                      id="sexeM"
                      value="MASCULIN"
                      defaultValue={defaultValues.sexe || ""}
                      defaultChecked={
                        defaultValues.sexe === "MASCULIN" ||
                        defaultValues.sexe === "HOMME"
                      }
                    />
                    <label className="form-check-label" htmlFor="sexeM">
                      Masculin
                    </label>
                  </div>
                </div>
              </div> */}
              <div className="mb-3">
                <label className="form-label d-block">
                  Sexe sur la pièce d’identité
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sexe"
                      id="sexeF"
                      value="FEMININ"
                      checked={sexe === "FEMININ"}
                      onChange={() => setSexe("FEMININ")}
                      required
                    />
                    <label className="form-check-label" htmlFor="sexeF">
                      Féminin
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sexe"
                      id="sexeM"
                      value="MASCULIN"
                      checked={sexe === "MASCULIN"}
                      onChange={() => setSexe("MASCULIN")}
                    />
                    <label className="form-check-label" htmlFor="sexeM">
                      Masculin
                    </label>
                  </div>
                </div>
              </div>

              {/* Prénom */}
              <div className="mb-3">
                <label className="form-label">Prénom</label>
                <input
                  className="form-control"
                  name="prenom"
                  defaultValue={defaultValues.prenom || ""}
                  required
                  minLength={2}
                  maxLength={60}
                />
              </div>

              {/* Nom */}
              <div className="mb-3">
                <label className="form-label">Nom</label>
                <input
                  className="form-control"
                  name="nom"
                  defaultValue={defaultValues.nom || ""}
                  required
                  minLength={2}
                  maxLength={60}
                />
              </div>

              {/* Date de naissance */}
              <div className="mb-3">
                <label className="form-label">Date de naissance</label>
                <input
                  type="date"
                  className="form-control"
                  name="datedenaissance" // sera mappé -> dateNaissance côté parent
                  defaultValue={defaultValues.datedenaissance || ""}
                  required
                />
                <div className="form-text">Format : jj/mm/aaaa</div>
              </div>

              {/* Adresse */}
              <div className="mb-3">
                <label className="form-label">Adresse</label>
                <textarea
                  className="form-control"
                  name="adresse"
                  rows={2}
                  defaultValue={defaultValues.adresse || ""}
                  maxLength={180}
                />
              </div>

              {/* CIN + Téléphone */}
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">CIN</label>
                  <input
                    className="form-control"
                    name="cin"
                    defaultValue={defaultValues.cin || ""}
                    pattern="^[A-Za-z0-9]{4,18}$"
                    title="4 à 18 caractères alphanumériques"
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Téléphone</label>
                  <PhoneInput
                    placeholder="+212...."
                    defaultCountry="MA"
                    international
                    value={phone}
                    onChange={setPhone}
                    // style tweak: the inner input uses .PhoneInputInput class
                  />
                  {/* <input
                    className="form-control"
                    name="telephone"
                    defaultValue={defaultValues.telephone || ""}
                    pattern="^\\+?[0-9\\s\\-]{6,20}$"
                    title="Numéro de téléphone valide"
                  /> */}
                </div>
              </div>

              {/* Boutons */}
              <div className="mt-4 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
