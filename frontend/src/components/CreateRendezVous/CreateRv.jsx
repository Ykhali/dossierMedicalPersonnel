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
//   const [patients, setPatient] = useState([]);
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

//   useEffect(() => {
//     const fetchPatients = async () => {
//         try {
//           const token = localStorage.getItem("token");

//           const response = await fetch(
//             `${API_BASE_URL}/api/receptionniste/patients`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               credentials: "include", //for cookies
//             }
//           );
//           if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(
//               errorData.message || `HTTP error! Status: ${response.status}`
//             );
//           }
//           const data = await response.json();
//           console.log("Fetched Patients:", data); // Debug the response
//           setPatient(data);
//         } catch (error) {
//           setError(
//             error.message || "Erreur lors de la récupération des patients"
//           );
//         }
//     };
//     fetchPatients();
//   }, [])

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
//             Patient:
//           </label>
//           <select
//             className="form-select"
//             id="medecinId"
//             name="medecinId"
//             value={formData.medecinId}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Sélectionner un Patient</option>
//             {patients.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.nom} {p.prenom}
//               </option>
//             ))}
//           </select>
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

// CreateRendezVous.jsx
// import React, { useState, useEffect } from "react";
// import API_BASE_URL from "../../config/apiConfig";
// import { Modal, Button } from "react-bootstrap";
// import Select from "react-select";

// export default function CreateRv({
//   show = true,          // si tu veux aussi l'utiliser en page, garde show=true par défaut
//   onClose,              // callback fermer modal
//   onSuccess,            // callback succès (pour rafraîchir la liste)
// }) {

//   // helper pour normaliser (accents, maj/min)
//   const normalize = (s = "") =>
//     s
//       .toString()
//       .normalize("NFD")
//       .replace(/\p{Diacritic}/gu, "")
//       .toLowerCase();

//   // ...dans le composant:
//   const [searchPatient, setSearchPatient] = useState("");

//   const [formData, setFormData] = useState({
//     date: "",
//     heure: "",
//     motif: "",
//     patientId: "",
//     medecinId: "",
//   });
//   const [medecins, setMedecins] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Doctors
//   useEffect(() => {
//     (async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `${API_BASE_URL}/api/receptionniste/medecins`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             credentials: "include",
//           }
//         );
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);
//         setMedecins(await response.json());
//       } catch (e) {
//         setError(e.message || "Erreur lors de la récupération des médecins");
//       }
//     })();
//   }, []);

//   // Patients
//   useEffect(() => {
//     (async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `${API_BASE_URL}/api/receptionniste/patients`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             credentials: "include",
//           }
//         );
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);
//         setPatients(await response.json());
//       } catch (e) {
//         setError(e.message || "Erreur lors de la récupération des patients");
//       }
//     })();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);
//     setSubmitting(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Aucun token. Veuillez vous reconnecter.");

//       // ⚠️ Endpoint à adapter côté backend si besoin.
//       // Si le backend attend le patient depuis le token, tu peux ignorer patientId.
//       const payload = {
//         date: formData.date,
//         heure: formData.heure,
//         motif: formData.motif,
//         medecinId: parseInt(formData.medecinId, 10),
//         patientId: formData.patientId
//           ? parseInt(formData.patientId, 10)
//           : undefined,
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
//         const text = await response.text();
//         throw new Error(
//           `POST /api/Patient/rendezvous -> ${response.status} ${text}`
//         );
//       }

//       setSuccess("Rendez-vous créé avec succès !");
//       onSuccess && onSuccess();
//       onClose && onClose(); // ferme le modal si utilisé en modal

//       // reset si tu l'utilises en page
//       setFormData({
//         date: "",
//         heure: "",
//         motif: "",
//         patientId: "",
//         medecinId: "",
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // liste filtrée selon la recherche (email, CIN, tel, nom, prénom)
//   const filteredPatients = patients.filter((p) => {
//     if (!searchPatient) return true;
//     const q = normalize(searchPatient);
//     const nom = normalize(p.nom);
//     const prenom = normalize(p.prenom);
//     const full = normalize(`${p.nom} ${p.prenom}`);
//     const email = normalize(p.email);
//     const cin = normalize(p.cin);
//     const tel = normalize(p.telephone);
//     return (
//       nom.includes(q) ||
//       prenom.includes(q) ||
//       full.includes(q) ||
//       email.includes(q) ||
//       cin.includes(q) ||
//       tel.includes(q)
//     );
//   });

//   const patientOptions = React.useMemo(
//     () =>
//       (Array.isArray(patients) ? patients : []).map((p) => ({
//         value: p.id,
//         label: `${p.nom} ${p.prenom}`, // ce qu'on montre partout
//         // champs cachés utilisés pour la recherche seulement
//         meta: {
//           email: p.email || "",
//           cin: p.cin || "",
//           tel: p.telephone || "",
//         },
//       })),
//     [patients]
//   );

//   const selectedPatient =
//     patientOptions.find(
//       (o) => String(o.value) === String(formData.patientId)
//     ) || null;

//   return (
//     <Modal show={show} onHide={onClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Créer un rendez-vous</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {error && <div className="alert alert-danger">{error}</div>}
//         {success && <div className="alert alert-success">{success}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="date" className="form-label">
//               Date
//             </label>
//             <input
//               type="date"
//               className="form-control"
//               id="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="heure" className="form-label">
//               Heure
//             </label>
//             <input
//               type="time"
//               className="form-control"
//               id="heure"
//               name="heure"
//               value={formData.heure}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="motif" className="form-label">
//               Motif
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="motif"
//               name="motif"
//               value={formData.motif}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* <div className="mb-3">
//             <label htmlFor="patientId" className="form-label">
//               Patient
//             </label>
//             <select
//               className="form-select"
//               id="patientId"
//               name="patientId"
//               value={formData.patientId}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Sélectionner un patient</option>
//               {patients.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.nom} {p.prenom}
//                 </option>
//               ))}
//             </select>
//           </div> */}
//           {/* --- Bloc Patient REPLACED --- */}
//           <div className="mb-3">
//             <label htmlFor="patientId" className="form-label">
//               Patient
//             </label>

//             <Select
//               inputId="patientId"
//               classNamePrefix="select"
//               placeholder="Sélectionner un patient"
//               isClearable
//               isSearchable
//               options={(Array.isArray(patients) ? patients : []).map((p) => ({
//                 value: p.id,
//                 label: `${p.nom} ${p.prenom}`, // ✅ affichage principal
//                 meta: {
//                   email: p.email || "",
//                   cin: p.cin || "",
//                   tel: p.telephone || "",
//                 },
//               }))}
//               value={
//                 (Array.isArray(patients) ? patients : [])
//                   .map((p) => ({
//                     value: p.id,
//                     label: `${p.nom} ${p.prenom}`,
//                     meta: {
//                       email: p.email || "",
//                       cin: p.cin || "",
//                       tel: p.telephone || "",
//                     },
//                   }))
//                   .find(
//                     (opt) => String(opt.value) === String(formData.patientId)
//                   ) || null
//               }
//               onChange={(opt) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   patientId: opt?.value ?? "",
//                 }))
//               }
//               filterOption={(option, rawInput) => {
//                 const q = normalize(rawInput || "");
//                 const { label, meta } = option.data;
//                 return (
//                   normalize(label).includes(q) ||
//                   normalize(meta.email).includes(q) ||
//                   normalize(meta.cin).includes(q) ||
//                   normalize(meta.tel).includes(q)
//                 );
//               }}
//               formatOptionLabel={(option, { context }) => {
//                 if (context === "value") {
//                   // ✅ Ce qui s'affiche dans le champ sélectionné
//                   return option.label;
//                 }
//                 // ✅ Ce qui s'affiche dans la liste déroulante
//                 return (
//                   <div>
//                     <div>{option.label}</div>
//                     {(option.meta.cin ||
//                       option.meta.tel ||
//                       option.meta.email) && (
//                       <small className="text-muted">
//                         {option.meta.cin ? `CIN: ${option.meta.cin}` : ""}
//                         {option.meta.cin &&
//                         (option.meta.tel || option.meta.email)
//                           ? " • "
//                           : ""}
//                         {option.meta.tel || ""}
//                         {option.meta.tel && option.meta.email ? " • " : ""}
//                         {option.meta.email || ""}
//                       </small>
//                     )}
//                   </div>
//                 );
//               }}
//               styles={{
//                 control: (base) => ({ ...base, minHeight: 38 }),
//                 valueContainer: (base) => ({ ...base, paddingBlock: 2 }),
//                 menu: (base) => ({ ...base, zIndex: 9999 }),
//               }}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="medecinId" className="form-label">
//               Médecin
//             </label>
//             <select
//               className="form-select"
//               id="medecinId"
//               name="medecinId"
//               value={formData.medecinId}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Sélectionner un médecin</option>
//               {medecins.map((m) => (
//                 <option key={m.id} value={m.id}>
//                   {m.nom} {m.prenom} ({m.specialite})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="d-flex justify-content-end gap-2">
//             <Button variant="secondary" onClick={onClose} disabled={submitting}>
//               Annuler
//             </Button>
//             <Button variant="primary" type="submit" disabled={submitting}>
//               {submitting ? "Création…" : "Créer rendez-vous"}
//             </Button>
//           </div>
//         </form>
//       </Modal.Body>
//     </Modal>
//   );
// }

import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config/apiConfig";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";

export default function CreateRv({ show = true, onClose, onSuccess }) {
  // helper pour normaliser (accents, maj/min)
  const normalize = (s = "") =>
    s
      .toString()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const [formData, setFormData] = useState({
    date: "",
    heure: "",
    motif: "",
    patientId: "",
    medecinId: "",
  });
  const [medecins, setMedecins] = useState([]);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [freeSlots, setFreeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Doctors
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/api/receptionniste/mes-medecins`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setMedecins(await response.json());
      } catch (e) {
        setError(e.message || "Erreur lors de la récupération des médecins");
      }
    })();
  }, []);

  // Patients
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/api/receptionniste/patients`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setPatients(await response.json());
      } catch (e) {
        setError(e.message || "Erreur lors de la récupération des patients");
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Aucun token. Veuillez vous reconnecter.");

      const payload = {
        date: formData.date,
        heure: formData.heure,
        motif: formData.motif,
        medecinId: formData.medecinId
          ? parseInt(formData.medecinId, 10)
          : undefined,
        patientId: formData.patientId
          ? parseInt(formData.patientId, 10)
          : undefined,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/receptionniste/rendezVous`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `POST /api/Patient/rendezvous -> ${response.status} ${text}`
        );
      }

      setSuccess("Rendez-vous créé avec succès !");
      onSuccess && onSuccess();
      onClose && onClose();

      setFormData({
        date: "",
        heure: "",
        motif: "",
        patientId: "",
        medecinId: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Options Patient (affichage = Nom Prénom, recherche = label + meta cachés)
  const patientOptions = React.useMemo(
    () =>
      (Array.isArray(patients) ? patients : []).map((p) => ({
        value: p.id,
        label: `${p.nom} ${p.prenom}`,
        meta: {
          email: p.email || "",
          cin: p.cin || "",
          tel: p.telephone || "",
        },
      })),
    [patients]
  );

  const selectedPatient =
    patientOptions.find(
      (o) => String(o.value) === String(formData.patientId)
    ) || null;

  const medecinOptions = React.useMemo(
    () =>
      (Array.isArray(medecins) ? medecins : []).map((m) => ({
        value: m.id,
        label: `${m.nom} ${m.prenom}`, // ✅ affiché partout
        meta: {
          specialite: m.specialite || "",
          email: m.email || "",
          tel: m.telephone || "",
        },
      })),
    [medecins]
  );

  const selectedMedecin =
    medecinOptions.find(
      (o) => String(o.value) === String(formData.medecinId)
    ) || null;

  useEffect(() => {
    const fetchAvailability = async () => {
      setFreeSlots([]);
      setLoadingSlots(false);
      setFormData((prev) => ({ ...prev, heure: "" }));

      if (!formData.medecinId || !formData.date) return;

      try {
        setLoadingSlots(true);
        const token = localStorage.getItem("token");
        // If you mounted the method in PatientController, use /api/Patient/availability
        // Otherwise, if you created a shared controller, use /api/availability
        const url = `${API_BASE_URL}/api/receptionniste/availability?medecinId=${formData.medecinId}&date=${formData.date}&slot=60`;

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

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Créer un rendez-vous</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
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
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="mb-3">
            {/* <label htmlFor="heure" className="form-label">
              Heure
            </label>
            <input
              type="time"
              className="form-control"
              id="heure"
              name="heure"
              value={formData.heure}
              onChange={handleChange}
              required
            /> */}
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
                !formData.medecinId ||
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

          <div className="mb-3">
            <label htmlFor="medecinId" className="form-label">
              Médecin
            </label>
            <Select
              inputId="medecinId"
              classNamePrefix="select"
              placeholder="Sélectionner un médecin"
              isClearable
              isSearchable
              options={medecinOptions}
              value={selectedMedecin}
              onChange={(opt) =>
                setFormData((prev) => ({
                  ...prev,
                  medecinId: opt?.value ?? "",
                }))
              }
              // 🔎 Recherche multi-champs: nom/prénom + spécialité + email + téléphone
              filterOption={(option, rawInput) => {
                const q = normalize(rawInput || "");
                const { label, meta } = option.data;
                return (
                  normalize(label).includes(q) ||
                  normalize(meta.specialite).includes(q) ||
                  normalize(meta.email).includes(q) ||
                  normalize(meta.tel).includes(q)
                );
              }}
              // 🎨 Affichage: uniquement “Nom Prénom” (dans le champ et le menu)
              // (si tu veux voir la spécialité dans le menu, dé-commente la version “menu riche” ci-dessous)
              formatOptionLabel={(option) => option.label}
              // (optionnel) styles compacts
              styles={{
                control: (base) => ({ ...base, minHeight: 38 }),
                valueContainer: (base) => ({ ...base, paddingBlock: 2 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          {/* Patient (react-select) */}
          <div className="mb-3">
            <label htmlFor="patientId" className="form-label">
              Patient
            </label>
            <Select
              inputId="patientId"
              classNamePrefix="select"
              placeholder="Sélectionner un patient"
              isClearable
              isSearchable
              options={patientOptions}
              value={selectedPatient}
              onChange={(opt) =>
                setFormData((prev) => ({
                  ...prev,
                  patientId: opt?.value ?? "",
                }))
              }
              // Recherche multi-champs: label + email + CIN + téléphone
              filterOption={(option, rawInput) => {
                const q = normalize(rawInput || "");
                const { label, meta } = option.data;
                return (
                  normalize(label).includes(q) ||
                  normalize(meta.email).includes(q) ||
                  normalize(meta.cin).includes(q) ||
                  normalize(meta.tel).includes(q)
                );
              }}
              // Affichage: seulement "Nom Prénom" (champ et menu)
              formatOptionLabel={(option) => option.label}
              styles={{
                control: (base) => ({ ...base, minHeight: 38 }),
                valueContainer: (base) => ({ ...base, paddingBlock: 2 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

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
              {medecins.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nom} {m.prenom} ({m.specialite})
                </option>
              ))}
            </select>
          </div> */}

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Création…" : "Créer rendez-vous"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
