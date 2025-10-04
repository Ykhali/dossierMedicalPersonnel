import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import PhoneInput from "react-phone-input-2";

function CreateReceptionniste() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [cin, setCin] = useState("");
  const [email, setEmail] = useState("");
  const [motdepasse, setMotDePasse] = useState("");
  const [confirmpwd, setConfirmpwd] = useState("");
  const [telephone, setTelephone] = useState("");
  const [datedenaissance, setDatedenaissance] = useState("");
  const [sexe, setSexe] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (motdepasse !== confirmpwd) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/receptionnistes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nom,
            prenom,
            cin,
            email,
            telephone,
            motdepasse,
            confirmpwd,
            sexe,
            datedenaissance,
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

      const data = await response.json();
      console.log("Medecin créer avec succes:", data);
      // Clear all form fields after successful creation
      setNom("");
      setPrenom("");
      setEmail("");
      setMotDePasse("");
      setConfirmpwd("");
      setTelephone("");
      setSexe("");
      setDatedenaissance("");
    } catch (error) {
      setError(error.message || "erreur !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-5">
      <form onSubmit={handleSubmit}>
        <h3 className="text-center">Créer une nouvelle receptionniste</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="nom" className="form-label ">
              Nom:
            </label>
            <input
              type="text"
              className="form-control"
              id="nom"
              placeholder="Entrez votre Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="prenom" className="form-label">
              Prenom:
            </label>
            <input
              type="text"
              className="form-control"
              id="prenom"
              placeholder="Entrez votre Prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Adresse e-mail
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Entrez votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cin" className="form-label fw-semibold">
            Cin
          </label>
          <input
            type="text"
            id="cin"
            className="form-control"
            placeholder="Cin"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="telephone" className="form-label fw-semibold">
            Téléphone
          </label>
          <PhoneInput
            country={"ma"}
            value={telephone}
            enableSearch
            onChange={(value) => setTelephone("+" + value)}
            disabled={isLoading}
            inputProps={{
              id: "telephone",
              required: false,
            }}
            inputClass="form-control"
            inputStyle={{ width: "100%" }}
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

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="motDePasse" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              className="form-control"
              id="motDePasse"
              placeholder="Entrez votre mot de passe"
              value={motdepasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="motDePasse" className="form-label">
              Confirmer Mot de passe
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmMotDePasse"
              placeholder="Veuillez confirmer votre mot de passe"
              value={confirmpwd}
              onChange={(e) => setConfirmpwd(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="d-grid mb-3">
          <button
            type="submit"
            className="btn btn-outline-primary btn-lg btn-block"
            disabled={isLoading}
          >
            {isLoading ? "Création..." : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateReceptionniste;
