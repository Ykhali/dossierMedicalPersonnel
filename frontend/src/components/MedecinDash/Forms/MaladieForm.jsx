import React from "react";

export default function MaladieForm({
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
        <label className="form-label">Code</label>
        <input
          type="text"
          className="form-control"
          name="code"
          value={formData.code || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Système de code</label>
        <input
          type="text"
          className="form-control"
          name="systemeCode"
          value={formData.systemeCode || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Statut</label>
        <input
          type="text"
          className="form-control"
          name="statut"
          value={formData.statut || ""}
          onChange={handleFormChange}
        />
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
      <div>
        <label className="form-label">Date de fin</label>
        <input
          type="date"
          className="form-control"
          name="dateFin"
          value={formData.dateFin || ""}
          onChange={handleFormChange}
        />
      </div>
      <div>
        <label className="form-label">Notes</label>
        <textarea
          className="form-control"
          name="notes"
          rows={3}
          value={formData.notes || ""}
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
