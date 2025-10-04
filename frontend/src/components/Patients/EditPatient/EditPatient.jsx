import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../../config/apiConfig";

function EditPatient({ patient, onSave, onCancel, isLoading }) {
  const [nom, setNom] = useState(patient.nom);
  const [prenom, setPrenom] = useState(patient.prenom);
  const [email, setEmail] = useState(patient.email);
  const [telephone, setTelephone] = useState(patient.telephone || "");
  const [adresse, setAdresse] = useState(patient.adresse || "");
  const [sexe, setSexe] = useState(patient.sexe);
  const [datedenaissance, setDatedenaissance] = useState(patient.datedenaissance );
  const [error, setError] = useState(null);

  useEffect(() => {
    setNom(patient.nom);
    setPrenom(patient.prenom);
    setEmail(patient.email);
    setTelephone(patient.telephone || "");
    setAdresse(patient.adresse || "");
    setSexe(patient.sexe);
    setDatedenaissance(patient.datedenaissance);
  }, [patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/patients/${patient.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nom,
            prenom,
            email,
            telephone,
            adresse,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const updatedPatient = await response.json();
      onSave(updatedPatient); // Call the parent callback to update the patient list
    } catch (error) {
      setError(error.message || "Erreur lors de la mise à jour du patient");
    }
  };

  return (
    <div className="m-5">
      <form onSubmit={handleSubmit}>
        <h3 className="text-center">
          Modifier le patient avec l'ID {patient.id}
        </h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="nom" className="form-label">
            Nom:
          </label>
          <input
            type="text"
            className="form-control"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">
            Prénom:
          </label>
          <input
            type="text"
            className="form-control"
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Adresse e-mail:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="telephone" className="form-label">
            Téléphone:
          </label>
          <input
            type="tel"
            className="form-control"
            id="telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            disabled={isLoading}
          />
        </div>
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
        <div className="mb-3">
          <label htmlFor="adresse" className="form-label">
            Adresse:
          </label>
          <input
            type="text"
            className="form-control"
            id="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="d-grid mb-3">
          <button
            type="submit"
            className="btn btn-outline-primary btn-lg btn-block"
            disabled={isLoading}
          >
            {isLoading ? "Mise à jour..." : "Sauvegarder"}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg btn-block mt-2"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPatient;
