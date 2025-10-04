import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/apiConfig";
import "./GetAllPatients.css";
import EditPatient from "../EditPatient/EditPatient";

function GetAllPatients() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/patients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const data = await response.json();
        setPatients(data);
      } catch (error) {
        setError(
          error.message || "Erreur lors de la récupération des patients"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/api/admin/patients/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        setPatients(patients.filter((patient) => patient.id !== id));
      } catch (error) {
        setError(error.message || "Erreur lors de la suppression du patient");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient); // Switch to edit mode with the selected patient
  };

  const handleSave = (updatedPatient) => {
    setPatients(
      patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setEditingPatient(null); // Exit edit mode after saving
  };

  const handleCancel = () => {
    setEditingPatient(null); // Exit edit mode without saving
  };

  if (editingPatient) {
    return (
      <EditPatient
        patient={editingPatient}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    );
  }
  return (
    <div className="m-5">
      <h3 className="text-center mb-5">Liste des Patients</h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Chargement...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered custom-border">
            <thead className="thead-dark">
              <tr className="text-center">
                <th scope="col">#</th>
                <th scope="col">Nom</th>
                <th scope="col">Prénom</th>
                <th scope="col">Email</th>
                <th scope="col">Téléphone</th>
                <th scope="col">Adresse</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Aucun patient trouvé
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.nom}</td>
                    <td>{patient.prenom}</td>
                    <td>{patient.email}</td>
                    <td>{patient.telephone || "N/A"}</td>
                    <td>{patient.adresse || "N/A"}</td>
                    <td>
                      <div
                        className="d-flex gap-2 d-md-flex 
                      justify-content-md-center buttons"
                      >
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleEdit(patient)}
                          disabled={isLoading}
                        >
                          modifier
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(patient.id)}
                          disabled={isLoading}
                        >
                          supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GetAllPatients;
