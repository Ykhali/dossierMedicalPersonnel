// import React, { useState, useEffect } from "react";
// import API_BASE_URL from "../../config/apiConfig";

// function CreateRendezVous() {
//   const [formData, setFormData] = useState({
//     date: "",
//     heure: "",
//     motif: "",
//     medecinId: "",
//   });
//   const [medecins, setMedecins] = useState([]);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Fetch doctors for the dropdown

//   useEffect(() => {
//     const fetchMedecins = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const response = await fetch(`${API_BASE_URL}/api/Medecin`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include", //for cookies
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(
//             errorData.message || `HTTP error! Status: ${response.status}`
//           );
//         }
//         const data = await response.json();
//         console.log("Fetched doctors:", data); // Debug the response
//         setMedecins(data);
//       } catch (error) {
//         setError(
//           error.message || "Erreur lors de la récupération des patients"
//         );
//       }
//     };
//     fetchMedecins();
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);
//     try {
//       const token = localStorage.getItem("token");
    
//       if (!token) {
//         setError("Aucun token trouvé. Veuillez vous reconnecter.");
//         return;
//       }
//       const payload = {
//         date: formData.date,
//         heure: formData.heure,
//         motif: formData.motif,
//         medecinId: parseInt(formData.medecinId, 10),
//       };
//       const response = await fetch(`${API_BASE_URL}/api/Patient/rendezvous`, { 
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//         credentials: "include",
//       });
      

//       if (!response.ok) {
//         //const errorData = await response.json();
//         //throw new Error(
//         //errorData.message || `HTTP error! Status: ${response.status}`
//         //);
//         const text = await response.text();
//         throw new Error(
//           `POST /api/Patient/rendezVous -> ${response.status} ${text}`
//         );
//       }
//       const result = await response.json();
//       console.log("Created rendez-vous:", result);
//       setSuccess("Rendez-vous créé avec succès !");
//       setError(null);
//       setFormData({ date: "", heure: "", motif: "", medecinId: "" });
//     } catch (err) {
//       setError(err.message);
//       setSuccess(null);
//     }
//   };

//   return (
//     <div className="m-5">
//       <h4 className="text-center mt-4">Créer un rendez-vous</h4>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="date" className="form-label">
//             Date:
//           </label>
//           <input
//             type="date"
//             className="form-control"
//             id="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="heure" className="form-label">
//             Heure
//           </label>
//           <input
//             type="time"
//             className="form-control"
//             id="heure"
//             name="heure"
//             value={formData.heure}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="motif" className="form-label">
//             Motif
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="motif"
//             name="motif"
//             value={formData.motif}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="medecinId" className="form-label">
//             Médecin:
//           </label>
//           <select
//             className="form-select"
//             id="medecinId"
//             name="medecinId"
//             value={formData.medecinId}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Sélectionner un médecin</option>
//             {medecins.map((med) => (
//               <option key={med.id} value={med.id}>
//                 {med.nom} {med.prenom} ({med.specialite})
//               </option>
//             ))}
//           </select>
//         </div>
//         <button type="submit" className="btn btn-primary">
//           Créer Rendez-vous
//         </button>
//       </form>
//     </div>
//   );
// }

// export default CreateRendezVous;

import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config/apiConfig";
import { useParams } from "react-router-dom";

function CreateRendezVous() {
  const [formData, setFormData] = useState({
    date: "",
    heure: "",
    motif: "",
    medecinId: "",
  });
  const {medId} = useParams();
  const [medecins, setMedecins] = useState([]);
  const [freeSlots, setFreeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 1) Fetch doctors
  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${API_BASE_URL}/api/Medecin`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`GET /api/Medecin -> ${resp.status} ${text}`);
        }
        const data = await resp.json();
        setMedecins(data || []);
      } catch (e) {
        setError(e.message || "Erreur lors de la récupération des médecins");
      }
    };
    fetchMedecins();
  }, []);

  // 2) Fetch availability whenever medecin + date change
  useEffect(() => {
    const fetchAvailability = async () => {
      setFreeSlots([]);
      setLoadingSlots(false);
      setFormData((prev) => ({ ...prev, heure: "" }));

      if (!medId || !formData.date) return;

      try {
        setLoadingSlots(true);
        const token = localStorage.getItem("token");
        // If you mounted the method in PatientController, use /api/Patient/availability
        // Otherwise, if you created a shared controller, use /api/availability
        const url = `${API_BASE_URL}/api/Patient/availability?medecinId=${medId}&date=${formData.date}&slot=60`;

        const resp = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`GET /availability -> ${resp.status} ${text}`);
        }
        const data = await resp.json();
        setFreeSlots(Array.isArray(data?.freeSlots) ? data.freeSlots : []);
      } catch (e) {
        setError(e.message || "Erreur lors du chargement des créneaux");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.medecinId, formData.date]);

  // 3) Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    setSuccess(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4) Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Aucun token trouvé. Veuillez vous reconnecter.");
        return;
      }
      if (!formData.heure) {
        setError("Veuillez choisir un créneau disponible.");
        return;
      }

      const payload = {
        date: formData.date,
        heure: formData.heure, // must match one of freeSlots
        motif: formData.motif,
        medecinId: medId,
        //medecinId: parseInt(formData.medecinId, 10),
      };

      const resp = await fetch(`${API_BASE_URL}/api/Patient/rendezvous`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(
          `POST /api/Patient/rendezVous -> ${resp.status} ${text}`
        );
      }

      await resp.json();
      setSuccess("Rendez-vous créé avec succès !");
      setFormData({ date: "", heure: "", motif: "", medecinId: "" });
      setFreeSlots([]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="m-5">
      <h4 className="text-center mt-4">Créer un rendez-vous</h4>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Médecin */}
        {/* <div className="mb-3">
          <label htmlFor="medecinId" className="form-label">
            Médecin
          </label>
          <select
            className="form-select"
            id="medecinId"
            name="medecinId"
            value={formData.medecinId}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un médecin</option>
            {medecins.map((med) => (
              <option key={med.id} value={med.id}>
                {med.nom} {med.prenom} ({med.specialite})
              </option>
            ))}
          </select>
        </div> */}
        <div className="mb-3">
          <label className="form-label">Médecin</label>
          <input
            type="text"
            className="form-control"
            value={
              medecins.find((m) => m.id === parseInt(medId))
                ? `${medecins.find((m) => m.id === parseInt(medId)).nom} ${
                    medecins.find((m) => m.id === parseInt(medId)).prenom
                  }`
                : `Médecin #${medId}`
            }
            disabled
          />
        </div>

        {/* Date */}
        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]} // aujourd'hui = min
          />
        </div>

        {/* Heure => select basé sur freeSlots */}
        <div className="mb-3">
          <label htmlFor="heure" className="form-label">
            Heure
          </label>
          <select
            className="form-select"
            id="heure"
            name="heure"
            value={formData.heure}
            onChange={handleChange}
            disabled={
              !medId ||
              !formData.date ||
              loadingSlots ||
              freeSlots.length === 0
            }
            required
          >
            <option value="">
              {loadingSlots
                ? "Chargement des créneaux…"
                : freeSlots.length === 0
                ? "Aucun créneau disponible"
                : "Sélectionner un créneau"}
            </option>
            {freeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {/* Optionnel: bouton pour recharger les slots */}
          {/* <button type="button" className="btn btn-outline-secondary mt-2" onClick={() => {
            // force a re-fetch by toggling date value or calling fetchAvailability directly if you extract it
          }}>Rafraîchir les créneaux</button> */}
        </div>

        {/* Motif */}
        <div className="mb-3">
          <label htmlFor="motif" className="form-label">
            Motif
          </label>
          <input
            type="text"
            className="form-control"
            id="motif"
            name="motif"
            value={formData.motif}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!formData.heure || loadingSlots}
        >
          Créer Rendez-vous
        </button>
      </form>
    </div>
  );
}

export default CreateRendezVous;
