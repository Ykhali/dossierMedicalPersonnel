import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config/apiConfig";

function EditReceptionniste({ receptionniste, onSave, onCancel, isLoading }) {
  const [nom, setNom] = useState(receptionniste.nom);
  const [prenom, setPrenom] = useState(receptionniste.prenom);
  const [email, setEmail] = useState(receptionniste.email);
  const [telephone, setTelephone] = useState(receptionniste.telephone || "");
  const [error, setError] = useState(null);

  useEffect(() => {
    setNom(receptionniste.nom);
    setPrenom(receptionniste.prenom);
    setEmail(receptionniste.email);
    setTelephone(receptionniste.telephone || "");
  }, [receptionniste]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/receptionnistes/${receptionniste.id}`,
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

      const updatedReceptionniste = await response.json();
      onSave(updatedReceptionniste); // Call the parent callback to update the patient list
    } catch (error) {
      setError(error.message || "Erreur lors de la mise à jour de la receptionniste");
    }
  };

  return (
    <div className="m-5">
      <form onSubmit={handleSubmit}>
        <h3 className="text-center">
          Modifier la receptionniste avec l'ID {receptionniste.id}
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

export default EditReceptionniste;
