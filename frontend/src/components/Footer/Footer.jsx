import React from "react";
import './Footer.css';
import logo from "../../assets/Images/Logo.png";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  return (
    <div className="footer footer-container bg-light text-dark pt-5 pb-4 mt-5 border-top">
      <div className="col-lg-5 text-center">
        <img src={logo} className="logo mb-3" />
        <p>
          Avec <strong className="text-primary">AloDocteur</strong>, vous avez
          la possibilité d'accéder facilement à vos dossiers médicaux,
          rendez-vous et communications sécurisées avec les soignants. Notre
          plateforme garantit commodité, transparence et soins personnalisés à
          chaque étape.
        </p>
      </div>
      <div className="col-lg-3 text-center mb-4">
        <h3 className="text-primary fw-bold mb-3">Usefull Links</h3>
        <ul className="list-unstyled">
          <li className="text-dark text-decoration-none">A propos</li>
          <li className="text-dark text-decoration-none">Nos services</li>
          <li></li>
        </ul>
      </div>
      <div className="col-lg-4 text-center">
        <h3 className="text-primary fw-bold mb-3">Contactez nous</h3>
        <p>Une question ? N'hésitez pas à nous contacter :</p>
        <ul className="list-unstyled contact_links">
          <li className="mb-2 d-flex align-items-center">
            <FaPhone className="me-2 text-primary" /> +21263666985
          </li>
          <li className="mb-2 d-flex align-items-center">
            <FaEnvelope className="me-2 text-primary" />{" "}
            Youssef.Khalid496@gmail.com
          </li>
          <li className="d-flex align-items-center">
            <FaMapMarkerAlt className="me-2 text-primary" /> 20050 casablanca, Bourgogne, Maroc
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
