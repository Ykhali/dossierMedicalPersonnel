import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";


function GetRendezVousAnnuleToday() {
    const [rendezVous, setRendezVous] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const medecinLabel = (rv) =>
      rv.medecinNom ||
      (rv.medecin &&
        `${rv.medecin.prenom ?? ""} ${rv.medecin.nom ?? ""}`.trim()) ||
      "N/A";
    const patientLabel = (rv) =>
      rv.patientNom ||
      rv.patientFullName ||
      (rv.patient &&
        `${rv.patient.prenom ?? ""} ${rv.patient.nom ?? ""}`.trim()) ||
      "N/A";

    //pour afficher les rendez-vous annulés du jour
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${API_BASE_URL}/api/receptionniste/rendezVous/aujourdhui/annules`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) throw new Error("Erreur lors du chargement");

          const data = await response.json();
          setRendezVous(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    if (loading) return <p className="text-center mt-4">Chargement...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;
  return (
    <div className=" mt-4">
      <h3 className="mb-4 text-danger">
        <i className="bi bi-x-circle"></i> Rendez-vous annulés aujourd'hui
      </h3>

      {rendezVous.length === 0 ? (
        <div className="alert alert-light text-center border">
          Aucun rendez-vous annulé aujourd'hui.
        </div>
      ) : (
        <div className="row g-3">
          {rendezVous.map((rdv) => (
            <div key={rdv.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm border-danger h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    {patientLabel(rdv)}
                  </h5>
                  <p className="card-text mb-1">
                    <strong>Médecin :</strong> {medecinLabel(rdv)}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Date :</strong> {rdv.date}
                  </p>
                  <p className="card-text mb-2">
                    <strong>Heure :</strong> {rdv.heure}
                  </p>
                  <span className="badge bg-danger">
                    {rdv.status || "ANNULÉ"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GetRendezVousAnnuleToday;
