


// import React, { useState } from "react";
// import API_BASE_URL from "../../../config/apiConfig";

// export default function SigneVitalForm({
//   patientId,
//   formMode,
//   initialData,
//   onSuccess,
//   onClose,
// }) {
//   const [formData, setFormData] = useState(initialData);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const submit = async () => {
//     const endpoint =
//       formMode === "create" ? "signeVitaux" : `signeVitaux/${formData.id}`;
//     const url = `${API_BASE_URL}/api/Medecin/patients/${patientId}/${endpoint}`;
//     const method = formMode === "create" ? "POST" : "PATCH";

//     const body = {};
//     Object.entries(formData).forEach(([k, v]) => {
//       if (k !== "id" && v !== "" && v !== undefined) body[k] = v;
//     });

//     const res = await fetch(url, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify(body),
//     });

//     if (res.ok) {
//       onSuccess(await res.json());
//     } else {
//       alert(
//         `Erreur lors de la sauvegarde\n${await res.text().catch(() => "")}`
//       );
//     }
//   };

//   return (
//     <form className="vstack gap-3">
//       <div>
//         <label className="form-label">Date de mesure</label>
//         <input
//           type="date"
//           className="form-control"
//           name="dateMesure"
//           value={formData.dateMesure || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Température (°C)</label>
//         <input
//           type="number"
//           className="form-control"
//           name="temperature"
//           value={formData.temperature || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Tension (mmHg)</label>
//         <input
//           type="text"
//           className="form-control"
//           name="tension"
//           value={formData.tension || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Fréquence respiratoire (cpm)</label>
//         <input
//           type="number"
//           className="form-control"
//           name="frequenceRespiratoire"
//           value={formData.frequenceRespiratoire || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Saturation en oxygène (%)</label>
//         <input
//           type="number"
//           className="form-control"
//           name="saturationOxygene"
//           value={formData.saturationOxygene || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Poids (kg)</label>
//         <input
//           type="number"
//           className="form-control"
//           name="poids"
//           value={formData.poids || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Taille (cm)</label>
//         <input
//           type="number"
//           className="form-control"
//           name="taille"
//           value={formData.taille || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Commentaire</label>
//         <textarea
//           className="form-control"
//           name="commentaire"
//           rows={3}
//           value={formData.commentaire || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div className="modal-footer">
//         <button type="button" className="btn btn-secondary" onClick={onClose}>
//           Annuler
//         </button>
//         <button type="button" className="btn btn-primary" onClick={submit}>
//           {formMode === "create" ? "Créer" : "Enregistrer"}
//         </button>
//       </div>
//     </form>
//   );
// }


















import React from "react";

// export default function SigneVitalForm({
//   patientId,
//   formMode,
//   initialData,
//   onSuccess,
//   onClose,
// }) {
//   const [formData, setFormData] = useState(initialData);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const submit = async () => {
//     const endpoint =
//       formMode === "create" ? "signeVitaux" : `signeVitaux/${formData.id}`;
//     const url = `${API_BASE_URL}/api/Medecin/patients/${patientId}/${endpoint}`;
//     const method = formMode === "create" ? "POST" : "PATCH";

//     const body = {};
//     Object.entries(formData).forEach(([k, v]) => {
//       if (k !== "id" && v !== "" && v !== undefined) body[k] = v;
//     });

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(body),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         onSuccess(data);
//       } else {
//         const txt = await res.text().catch(() => "");
//         alert(`Erreur lors de la sauvegarde\n${txt}`);
//       }
//     } catch (err) {
//       alert(`Erreur lors de la sauvegarde\n${err.message}`);
//     }
//   };

//   return (
//     <form className="vstack gap-3">
//       <div>
//         <label className="form-label">Date de mesure</label>
//         <input
//           type="date"
//           className="form-control"
//           name="dateMesure"
//           value={formData.dateMesure || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Température (°C)</label>
//         <input
//           type="number"
//           className="form-control"
//           name="temperature"
//           value={formData.temperature || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Tension (mmHg)</label>
//         <input
//           type="text"
//           className="form-control"
//           name="tension"
//           value={formData.tension || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Fréquence respiratoire (cpm)</label>
//         <input
//           type="number"
//           className="form-control"
//           name="frequenceRespiratoire"
//           value={formData.frequenceRespiratoire || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Saturation en oxygène (%)</label>
//         <input
//           type="number"
//           className="form-control"
//           name="saturationOxygene"
//           value={formData.saturationOxygene || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Poids (kg)</label>
//         <input
//           type="number"
//           className="form-control"
//           name="poids"
//           value={formData.poids || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Taille (cm)</label>
//         <input
//           type="number"
//           className="form-control"
//           name="taille"
//           value={formData.taille || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label className="form-label">Commentaire</label>
//         <textarea
//           className="form-control"
//           name="commentaire"
//           rows={3}
//           value={formData.commentaire || ""}
//           onChange={handleChange}
//         />
//       </div>
//       <div className="modal-footer">
//         <button type="button" className="btn btn-secondary" onClick={onClose}>
//           Annuler
//         </button>
//         <button type="button" className="btn btn-primary" onClick={submit}>
//           {formMode === "create" ? "Créer" : "Enregistrer"}
//         </button>
//       </div>
//     </form>
//   );
// }

export default function SigneVitalForm({
  formData,
  formMode,
  handleFormChange,
  submitForm,
  closeForm,
}) {
  return (
    <form className="vstack gap-3">
      <div>
        <label className="form-label">Date de mesure</label>
        <input
          type="date"
          className="form-control"
          name="dateMesure"
          value={formData.dateMesure || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Température (°C)</label>
        <input
          type="number"
          className="form-control"
          name="temperature"
          value={formData.temperature || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Tension (mmHg)</label>
        <input
          type="text"
          className="form-control"
          name="tension"
          value={formData.tension || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Fréquence respiratoire (cpm)</label>
        <input
          type="number"
          className="form-control"
          name="frequenceRespiratoire"
          value={formData.frequenceRespiratoire || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Saturation en oxygène (%)</label>
        <input
          type="number"
          className="form-control"
          name="saturationOxygene"
          value={formData.saturationOxygene || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Poids (kg)</label>
        <input
          type="number"
          className="form-control"
          name="poids"
          value={formData.poids || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Taille (cm)</label>
        <input
          type="number"
          className="form-control"
          name="taille"
          value={formData.taille || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Commentaire</label>
        <textarea
          className="form-control"
          name="commentaire"
          rows={3}
          value={formData.commentaire || ""}
          onChange={handleFormChange}
        />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={closeForm}>
          Annuler
        </button>
        <button type="button" className="btn btn-primary" onClick={submitForm}>
          {formMode === "create" ? "Créer" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}