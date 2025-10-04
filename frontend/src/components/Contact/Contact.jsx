import React, { useState } from "react";
import contactUs from "../../assets/Images/doctor_pointing.png";
import './Contact.css';

function Contact() {
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form data submitted:", formData);

  //   // TODO: Send data to backend via fetch or axios

  //   alert("Votre message a été envoyé !");
  //   setFormData({
  //     nom: "",
  //     prenom: "",
  //     email: "",
  //     telephone: "",
  //     message: "",
  //   });
  // };

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
    <div id="Contact" className="container py-5 mb-5 mt-4 contact">
      <div className="row align-items-center contact-sec">
        {/* Image Section */}
        <div className="col-lg-6 text-center">
          <img
            src={contactUs}
            alt="Contact"
            className="img-fluid rounded shadow ImageMobile"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>

        {/* Form Section */}
        <div className="col-lg-6 mb-4 mb-lg-0 form-section">
          <h3 className="display-5 fw-bold text-primary text-center text-lg-start">
            Contactez-nous
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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

            <div className="mb-4">
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

            <div className="mb-4">
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
            <div className="mb-4">
              <button type="submit" className="btn btn-primary w-100 py-2">
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
