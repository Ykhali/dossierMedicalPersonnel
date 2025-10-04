// import React, { useState } from "react";
// import contactUs from "../../assets/Images/doctor_pointing.png";
// import "./Contact.css";

// function ContactezNous() {
//   const [formData, setFormData] = useState({
//     nom: "",
//     prenom: "",
//     email: "",
//     telephone: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form data submitted:", formData);

//     // TODO: Send data to backend via fetch or axios

//     alert("Votre message a été envoyé !");
//     setFormData({
//       nom: "",
//       prenom: "",
//       email: "",
//       telephone: "",
//       message: "",
//     });
//   };

//   return (
//     <div id="Contact" className="container py-5 mb-5 mt-4 contact ">
//       <div className="row align-items-center contact-sec">
//         <p>Si vous avez Une question, n'heziter pas à nous contacter</p>
//         {/* Form Section */}
//         <div className="col-lg-6 mb-4 mb-lg-0 form-section">
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label htmlFor="nom" className="form-label">
//                 Nom
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="nom"
//                 name="nom"
//                 value={formData.nom}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="prenom" className="form-label">
//                 Prénom
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="prenom"
//                 name="prenom"
//                 value={formData.prenom}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="email" className="form-label">
//                 Adresse Email
//               </label>
//               <input
//                 type="email"
//                 className="form-control"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="telephone" className="form-label">
//                 Téléphone
//               </label>
//               <input
//                 type="tel"
//                 className="form-control"
//                 id="telephone"
//                 name="telephone"
//                 value={formData.telephone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="message" className="form-label">
//                 Message
//               </label>
//               <textarea
//                 className="form-control"
//                 id="message"
//                 name="message"
//                 rows="4"
//                 value={formData.message}
//                 onChange={handleChange}
//                 required
//               ></textarea>
//             </div>
//             <div className="mb-4">
//               <button
//                 type="submit"
//                 className="btn w-100 py-2"
//                 style={{ backgroundColor: "#90E0EF", border: "1px solid #ccc" }}
//               >
//                 Envoyer
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ContactezNous;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";
import API_BASE_URL from "../../config/apiConfig";

function ContactezNous() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
      const fetchInfos = async () => {
        setIsLoading(true);
        setError(null);
  
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            localStorage.clear();
            navigate("/login");
            return;
          }
          const res = await fetch(`${API_BASE_URL}/api/Patient/basic-info`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });
  
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              errorData.message || `HTTP error! Status: ${res.status}`
            );
          }
  
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            email: data?.email || prev.email,
            nom: data?.nom || prev.nom,
            prenom: data?.prenom || prev.prenom,
            telephone: data?.telephone || prev.telephone,
          }));
        } catch (error) {
          setError(
            error.message || "Erreur lors de la récupération des patients"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchInfos();
    }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Échec envoi");

      alert("Votre message a été envoyé !");
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("Une erreur s'est produite. Réessayez plus tard.");
    }
  };

  

  return (
    <div
      id="Contact"
      className="container-fluid d-flex justify-content-center align-items-center mt-5 contact-page"
    >
      <div className="row w-100 justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className=" p-4">
            <h3 className="text-center mb-4">
              Si vous avez une question, n'hésitez pas à nous contacter
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nom" className="form-label">
                  Nom
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="prenom" className="form-label">
                  Prénom
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Adresse Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="telephone" className="form-label">
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn w-100 py-2"
                style={{ backgroundColor: "#90E0EF", border: "1px solid #ccc" }}
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactezNous;
