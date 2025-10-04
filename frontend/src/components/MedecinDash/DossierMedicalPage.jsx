// // pages/medecin/DossierMedicalPage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/apiConfig";
// import DossierMedical from "../../components/DossierMedical"; // ton composant UI
// import DossierPatient from "./DossierPatient";

// export default function DossierMedicalPage() {
//   const { patientId } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let abort = false;
//     (async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(
//           `${API_BASE_URL}/api/Medecin/patients/${patientId}/dossier`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (!res.ok)
//           throw new Error(
//             res.status === 404
//               ? "Dossier introuvable"
//               : "Erreur chargement dossier"
//           );
//         const json = await res.json(); // { patient:{...}, allergies:[], maladies:[], traitements:[], signesVitaux:[], examens:[], documents:[] }
//         if (!abort) setData(json);
//       } catch (e) {
//         if (!abort) setError(e.message);
//       } finally {
//         if (!abort) setIsLoading(false);
//       }
//     })();
//     return () => {
//       abort = true;
//     };
//   }, [patientId]);

//   if (isLoading)
//     return <div className="container py-4">Chargement du dossier…</div>;
//   if (error)
//     return (
//       <div className="container py-4">
//         <div className="alert alert-danger">{error}</div>
//       </div>
//     );

//   return (
//     <div className="container-fluid py-3">
//       <div className="d-flex justify-content-between align-items-center mb-2">
//         <button
//           className="btn btn-sm btn-outline-secondary rounded-pill"
//           onClick={() => navigate(-1)}
//         >
//           <i className="bi bi-arrow-left me-1"></i> Retour
//         </button>
//       </div>
//       <DossierPatient patient={data.patient} {...data} />
//     </div>
//   );
// }

// pages/medecin/DossierMedicalPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import DossierPatient from "./DossierPatient";

export default function DossierMedicalPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (!abort) {
            setError("Session expirée. Veuillez vous reconnecter.");
            setIsLoading(false);
          }
          return;
        }
        const res = await fetch(
          `${API_BASE_URL}/api/Medecin/patients/${patientId}/dossier`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 401)
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        if (!res.ok)
          throw new Error(
            res.status === 404
              ? "Dossier introuvable"
              : "Erreur chargement dossier"
          );

        const json = await res.json();

        const normalized = {
          patient: json.patient ?? json, // si l’API renvoie directement le patient
          allergies: json.allergies ?? [],
          maladies: json.maladies ?? [],
          traitements: json.traitements ?? [],
          signesVitaux: json.signesVitaux ?? [],
          examens: json.examens ?? [],
          documents: json.documents ?? [],
        };

        // Après const normalized = { ... } :
        if (normalized.patient && !normalized.patient.id) {
          normalized.patient.id = Number(patientId); // 👈 fallback
        }

        // ⚠️ Prépare photoUrl si absent (via endpoint image)
        if (
          normalized.patient &&
          !normalized.patient.photoUrl &&
          normalized.patient.id
        ) {
          normalized.patient.photoUrl = `${API_BASE_URL}/api/Medecin/patients/${normalized.patient.id}/image`;
        }

        if (!abort) setData(normalized);
      } catch (e) {
        if (!abort) setError(e.message);
      } finally {
        if (!abort) setIsLoading(false);
      }
    })();
    return () => { abort = true; };
  }, [patientId]);

  if (isLoading) return <div className="container py-4">Chargement du dossier…</div>;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
  if (!data?.patient)
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Aucun patient.</div>
      </div>
    );

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button
          className="btn btn-sm btn-outline-secondary rounded-pill"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-1"></i> Retour
        </button>
      </div>
      <DossierPatient
        patient={data.patient}
        allergies={data.allergies}
        maladies={data.maladies}
        traitements={data.traitements}
        signesVitaux={data.signesVitaux}
        examens={data.examens}
        documents={data.documents}
      />
    </div>
  );
}

