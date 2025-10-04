import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config/apiConfig";

function EditMedecin({ medecin, onSave, onCancel, isLoading }) {
  const [nom, setNom] = useState(medecin.nom);
  const [prenom, setPrenom] = useState(medecin.prenom);
  const [email, setEmail] = useState(medecin.email);
  const [telephone, setTelephone] = useState(medecin.telephone || "");
  const [specialite, setSpecialite] = useState(medecin.specialite || "");
  const [sexe, setSexe] = useState(medecin.sexe)
  const [error, setError] = useState(null);

  useEffect(() => {
      setNom(medecin.nom);
      setPrenom(medecin.prenom);
      setEmail(medecin.email);
      setTelephone(medecin.telephone || "");
      setSpecialite(medecin.specialite || "");
      setSexe(medecin.sexe);
    }, [medecin]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/api/admin/medecins/${medecin.id}`,
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
              specialite,
              sexe,
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

        const updatedMedecin = await response.json();
        onSave(updatedMedecin); 
      } catch (error) {
        setError(error.message || "Erreur lors de la mise à jour du medecin");
      }
    };

  return (
    <div className="m-5">
      <form onSubmit={handleSubmit}>
        <h3 className="text-center">
          Modifier le medecin avec l'ID {medecin.id}
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
        <div className="mb-3">
          <label htmlFor="adresse" className="form-label">
            Specialité:
          </label>
          <input
            type="text"
            className="form-control"
            id="specialite"
            value={specialite}
            onChange={(e) => setSpecialite(e.target.value)}
            disabled={isLoading}
          />
          <div className="mb-3">
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
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>
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

export default EditMedecin;
