import React from "react";

export default function AllergieForm({
  formData,
  formMode,
  handleFormChange,
  submitForm,
  closeForm,
}) {
  return (
    <form className="vstack gap-3">
      <div>
        <label className="form-label">Libellé</label>
        <input
          type="text"
          className="form-control"
          name="label"
          value={formData.label || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Réaction</label>
        <input
          type="text"
          className="form-control"
          name="reaction"
          value={formData.reaction || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Gravité</label>
        <input
          type="text"
          className="form-control"
          name="gravite"
          value={formData.gravite || ""}
          onChange={handleFormChange}
        />
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="allergie-active"
          name="active"
          checked={!!formData.active}
          onChange={handleFormChange}
        />
        <label className="form-check-label" htmlFor="allergie-active">
          Active
        </label>
      </div>
      <div>
        <label className="form-label">Date de début</label>
        <input
          type="date"
          className="form-control"
          name="dateDebut"
          value={formData.dateDebut || ""}
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
