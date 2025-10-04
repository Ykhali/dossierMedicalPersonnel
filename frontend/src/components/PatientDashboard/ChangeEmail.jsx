import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function ChangeEmail({
  show,
  onClose,
  onSubmit, // ({ newEmail })
  isSubmitting = false,
  error = null,
  currentEmail =""
}) {
  const [newEmail, setNewEmail] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!show) {
      setNewEmail("");
      setTouched(false);
    }
  }, [show]);

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v || "");

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setTouched(true);
  //   if (!isValidEmail(newEmail)) return;
  //   onSubmit({ newEmail });
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier que le nouvel email n'est pas identique à l'actuel
    if (newEmail.trim().toLowerCase() === currentEmail.trim().toLowerCase()) {
      alert("Le nouvel e-mail doit être différent de l'e-mail actuel.");
      return;
    }

    try {
      //await onSave(newEmail);
      await onSubmit({ newEmail });
    } catch (err) {
      alert(err.message || "Erreur lors du changement d'e-mail");
    }
  };


  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier l&apos;e-mail</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="newEmail" className="mb-2">
            <Form.Label className="fw-semibold">Nouvel e-mail</Form.Label>
            <div className="text-secondary small mb-2">
              Ex&nbsp;: abc@example.com
            </div>
            <Form.Control
              type="email"
              placeholder="votre.nouvel.email@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              isInvalid={touched && !isValidEmail(newEmail)}
              required
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              Saisis une adresse e-mail valide.
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || !isValidEmail(newEmail)}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
