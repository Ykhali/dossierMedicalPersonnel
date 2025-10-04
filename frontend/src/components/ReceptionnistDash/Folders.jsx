// src/components/ReceptionFolders.jsx
import { useEffect, useRef, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";

const api = `${API_BASE_URL}/api/reception`;

// export default function Folders() {
//   const [step, setStep] = useState("today"); // today | years | docs
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [todayFolders, setTodayFolders] = useState([]);
//   const [selectedCin, setSelectedCin] = useState(null);
//   const [selectedPatient, setSelectedPatient] = useState("");
//   const [years, setYears] = useState([]);
//   const [yearDocs, setYearDocs] = useState(null);

//   // 1) charger les dossiers du jour
//   useEffect(() => {
//     if (step !== "today") return;
//     setLoading(true);
//     fetch(`${api}/today`)
//       .then((r) => r.json())
//       .then((data) => {
//         setTodayFolders(data);
//         setError("");
//       })
//       .catch((e) => setError("Impossible de charger les dossiers du jour"))
//       .finally(() => setLoading(false));
//   }, [step]);

//   const openCin = (cin, name) => {
//     setSelectedCin(cin);
//     setSelectedPatient(name);
//     setStep("years");
//     setLoading(true);
//     fetch(`${api}/patients/${cin}/years`)
//       .then((r) => r.json())
//       .then((data) => {
//         setYears(data);
//         setError("");
//       })
//       .catch((e) => setError("Impossible de charger les années"))
//       .finally(() => setLoading(false));
//   };

//   const openYear = (year) => {
//     setStep("docs");
//     setLoading(true);
//     fetch(`${api}/patients/${selectedCin}/year/${year}`)
//       .then((r) => r.json())
//       .then((data) => {
//         setYearDocs(data);
//         setError("");
//       })
//       .catch((e) => setError("Impossible de charger les documents"))
//       .finally(() => setLoading(false));
//   };

//   const back = () => {
//     if (step === "docs") setStep("years");
//     else if (step === "years") setStep("today");
//   };

//   return (
//     <div style={{ padding: 16 }}>
//       <h2>Documents du jour (Réception)</h2>

//       {step !== "today" && (
//         <button onClick={back} style={{ marginBottom: 12 }}>
//           ← Retour
//         </button>
//       )}

//       {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
//       {loading && <div>Chargement…</div>}

//       {step === "today" && (
//         <div
//           style={{
//             display: "grid",
//             gap: 12,
//             gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
//           }}
//         >
//           {todayFolders.map((f) => (
//             <button
//               key={f.cin}
//               onClick={() => openCin(f.cin, f.patientNomComplet)}
//               style={cardStyle}
//             >
//               <div style={{ fontSize: 22, marginBottom: 6 }}>📁 {f.cin}</div>
//               <div style={{ color: "#444" }}>{f.patientNomComplet}</div>
//               <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
//                 {f.facturesCount} facture(s) • {f.ordonnancesCount}{" "}
//                 ordonnance(s)
//               </div>
//             </button>
//           ))}
//           {todayFolders.length === 0 && !loading && (
//             <div>Aucun document aujourd’hui.</div>
//           )}
//         </div>
//       )}

//       {step === "years" && (
//         <div>
//           <div style={{ marginBottom: 8, color: "#666" }}>
//             Dossier: <strong>{selectedCin}</strong> — {selectedPatient}
//           </div>
//           <div
//             style={{
//               display: "grid",
//               gap: 12,
//               gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
//             }}
//           >
//             {years.map((y) => (
//               <button key={y} onClick={() => openYear(y)} style={cardStyle}>
//                 <div style={{ fontSize: 22, marginBottom: 6 }}>📁 {y}</div>
//                 <div style={{ color: "#666" }}>Factures & Ordonnances</div>
//               </button>
//             ))}
//             {years.length === 0 && !loading && (
//               <div>Pas d’historique pour ce patient.</div>
//             )}
//           </div>
//         </div>
//       )}

//       {step === "docs" && yearDocs && (
//         <div>
//           <div style={{ marginBottom: 8, color: "#666" }}>
//             {yearDocs.patientNomComplet} — {yearDocs.cin} —{" "}
//             <strong>{yearDocs.year}</strong>
//           </div>

//           <h3>Factures</h3>
//           <ul>
//             {yearDocs.factures.map((d) => (
//               <li key={"F-" + d.id}>
//                 📄 {d.numero || `Facture #${d.id}`} — {d.date} |{" "}
//                 <a href={d.fileUrl} target="_blank" rel="noreferrer">
//                   Ouvrir PDF
//                 </a>
//               </li>
//             ))}
//             {yearDocs.factures.length === 0 && <li>Aucune facture.</li>}
//           </ul>

//           <h3>Ordonnances</h3>
//           <ul>
//             {yearDocs.ordonnances.map((d) => (
//               <li key={"O-" + d.id}>
//                 📄 {d.numero || `Ordonnance #${d.id}`} — {d.date} |{" "}
//                 <a href={d.fileUrl} target="_blank" rel="noreferrer">
//                   Ouvrir PDF
//                 </a>
//               </li>
//             ))}
//             {yearDocs.ordonnances.length === 0 && <li>Aucune ordonnance.</li>}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// const cardStyle = {
//   border: "1px solid #e5e7eb",
//   borderRadius: 10,
//   padding: 12,
//   textAlign: "left",
//   background: "white",
//   cursor: "pointer",
// };


// ================= PDF Modal ===================
// function PdfModal({ pdf, onClose }) {
//   const iframeRef = useRef();

//   if (!pdf) return null;

//   const handlePrint = () => {
//     if (iframeRef.current) {
//       iframeRef.current.contentWindow.focus();
//       iframeRef.current.contentWindow.print();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-white w-3/4 h-4/5 p-4 relative rounded-xl shadow-lg flex flex-col">
//         {/* Bouton fermer */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="font-bold">{pdf.title}</h2>
//           <button
//             onClick={handlePrint}
//             className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             🖨 Imprimer
//           </button>
//         </div>

//         {/* Iframe */}
//         <iframe
//           ref={iframeRef}
//           src={pdf.url}
//           className="w-full flex-1 border"
//           title="PDF Viewer"
//         />
//       </div>
//     </div>
//   );
// }

export default function Folders() {
  const [step, setStep] = useState("today"); // today | years | docs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //
  const [todayFolders, setTodayFolders] = useState([]);
  const [selectedCin, setSelectedCin] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [years, setYears] = useState([]);
  const [yearDocs, setYearDocs] = useState(null);
  //
  const [pdfView, setPdfView] = useState(null);

  // ---- état modale PDF ----
  const [preview, setPreview] = useState({ open: false, url: "", title: "" });
  const iframeRef = useRef(null);

  // charger les dossiers du jour
  useEffect(() => {
    if (step !== "today") return;
    setLoading(true);
    fetch(`${api}/today`)
      .then((r) => r.json())
      .then((data) => {
        setTodayFolders(data);
        setError("");
      })
      .catch(() => setError("Impossible de charger les dossiers du jour"))
      .finally(() => setLoading(false));
  }, [step]);

  const openCin = (cin, name) => {
    setSelectedCin(cin);
    setSelectedPatient(name);
    setStep("years");
    setLoading(true);
    fetch(`${api}/patients/${cin}/years`)
      .then((r) => r.json())
      .then((data) => {
        setYears(data);
        setError("");
      })
      .catch(() => setError("Impossible de charger les années"))
      .finally(() => setLoading(false));
  };

  const openYear = (year) => {
    setStep("docs");
    setLoading(true);
    fetch(`${api}/patients/${selectedCin}/year/${year}`)
      .then((r) => r.json())
      .then((data) => {
        setYearDocs(data);
        setError("");
      })
      .catch(() => setError("Impossible de charger les documents"))
      .finally(() => setLoading(false));
  };

  const back = () => {
    if (step === "docs") setStep("years");
    else if (step === "years") setStep("today");
  };

  // ---------- Aperçu / Impression ----------
  const openPdfModal = (url, title) => {
    setPreview({ open: true, url, title });
  };

  const closePdfModal = () => {
    setPreview({ open: false, url: "", title: "" });
  };

  const printFromModal = () => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } else {
      // secours : nouvelle fenêtre + impression
      const w = window.open(preview.url, "_blank");
      if (w) w.addEventListener("load", () => w.print());
    }
  };

  const printDirect = (url) => {
    // impression directe depuis la liste (ouvre le PDF dans un nouvel onglet et lance l’impression)
    const w = window.open(url, "_blank");
    if (w) w.addEventListener("load", () => w.print());
  };

  const openPdfInPage = (id, type, title) => {
    // type = "facture" ou "prescription"
    const url =
      type === "facture"
        ? `${API_BASE_URL}/api/factures/${id}/pdf`
        : `${API_BASE_URL}/api/ordonnances/${id}/getpdf`;

    setPdfView({ url, title });
  };

  const closePdfView = () => setPdfView(null);

  return (
    <div style={{ padding: 16 }}>
      <h2>Documents</h2>

      {step !== "today" && (
        <button onClick={back} style={{ marginBottom: 12 }}>
          ← Retour
        </button>
      )}

      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {loading && <div>Chargement…</div>}

      {/* {step === "today" && (
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}
        >
          {todayFolders.map((f) => (
            <button
              key={f.cin}
              onClick={() => openCin(f.cin, f.patientNomComplet)}
              style={cardStyle}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>📁 {f.cin}</div>
              <div style={{ color: "#444" }}>{f.patientNomComplet}</div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
                {f.facturesCount} facture(s) • {f.ordonnancesCount}{" "}
                ordonnance(s)
              </div>
            </button>
          ))}
          {todayFolders.length === 0 && !loading && (
            <div>Aucun document aujourd’hui.</div>
          )}
        </div>
      )}

      {step === "years" && (
        <div>
          <div style={{ marginBottom: 8, color: "#666" }}>
            Dossier: <strong>{selectedCin}</strong> — {selectedPatient}
          </div>
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            }}
          >
            {years.map((y) => (
              <button key={y} onClick={() => openYear(y)} style={cardStyle}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>📁 {y}</div>
                <div style={{ color: "#666" }}>Factures & Ordonnances</div>
              </button>
            ))}
            {years.length === 0 && !loading && (
              <div>Pas d’historique pour ce patient.</div>
            )}
          </div>
        </div>
      )}

      {step === "docs" && yearDocs && (
        <div>
          <div style={{ marginBottom: 8, color: "#666" }}>
            {yearDocs.patientNomComplet} — {yearDocs.cin} —{" "}
            <strong>{yearDocs.year}</strong>
          </div>

          <h3>Factures</h3>
          <ul>
            {yearDocs.factures.map((d) => {
              const label = d.numero || `Facture #${d.id}`;
              return (
                <li key={"F-" + d.id}>
                  <i className="bi bi-file-earmark-text" /> {label} — {d.date} |{" "}
                  <button
                    onClick={() => openPdfModal(d.fileUrl, label)}
                    style={linkBtn}
                    title="Aperçu PDF"
                  >
                    Ouvrir PDF
                  </button>{" "}
                  <button
                    onClick={() => printDirect(d.fileUrl)}
                    style={iconBtn}
                    title="Imprimer"
                  >
                    <i className="bi bi-printer" />
                  </button>
                </li>
              );
            })}
            {yearDocs.factures.length === 0 && <li>Aucune facture.</li>}
          </ul>

          <h3>Ordonnances</h3>
          <ul>
            {yearDocs.ordonnances.map((d) => {
              const label = d.numero || `Ordonnance #${d.id}`;
              return (
                <li key={"O-" + d.id}>
                  <i className="bi bi-file-earmark-text" /> {label} — {d.date} |{" "}
                  <button
                    onClick={() => openPdfModal(d.fileUrl, label)}
                    style={linkBtn}
                    title="Aperçu PDF"
                  >
                    Ouvrir PDF
                  </button>{" "}
                  <button
                    onClick={() => printDirect(d.fileUrl)}
                    style={iconBtn}
                    title="Imprimer"
                  >
                    <i className="bi bi-printer" />
                  </button>
                </li>
              );
            })}
            {yearDocs.ordonnances.length === 0 && <li>Aucune ordonnance.</li>}
          </ul>
        </div>
      )} */}
      {/* ---------- SI PDF INLINE ---------- */}
      {pdfView ? (
        <div
          style={{ height: "90vh", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <strong>{pdfView.title}</strong>
            <button onClick={closePdfView}>Fermer</button>
          </div>
          <iframe
            src={pdfView.url}
            title={pdfView.title}
            style={{ flex: 1, width: "100%", border: "none" }}
          />
        </div>
      ) : (
        <>
          {/* ---- Vue normale (dossiers, années, docs) ---- */}
          {step === "today" && (
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              }}
            >
              {todayFolders.map((f) => (
                <button
                  key={f.cin}
                  onClick={() => openCin(f.cin, f.patientNomComplet)}
                  style={cardStyle}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>
                    📁 {f.cin}
                  </div>
                  <div style={{ color: "#444" }}>{f.patientNomComplet}</div>
                  <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
                    {f.facturesCount} facture(s) • {f.ordonnancesCount}{" "}
                    ordonnance(s)
                  </div>
                </button>
              ))}
              {todayFolders.length === 0 && !loading && (
                <div>Aucun document aujourd’hui.</div>
              )}
            </div>
          )}

          {step === "years" && (
            <div>
              <div style={{ marginBottom: 8, color: "#666" }}>
                Dossier: <strong>{selectedCin}</strong> — {selectedPatient}
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                }}
              >
                {years.map((y) => (
                  <button key={y} onClick={() => openYear(y)} style={cardStyle}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>📁 {y}</div>
                    <div style={{ color: "#666" }}>Factures & Ordonnances</div>
                  </button>
                ))}
                {years.length === 0 && !loading && (
                  <div>Pas d’historique pour ce patient.</div>
                )}
              </div>
            </div>
          )}

          {step === "docs" && yearDocs && (
            <div>
              <div style={{ marginBottom: 8, color: "#666" }}>
                {yearDocs.patientNomComplet} — {yearDocs.cin} —{" "}
                <strong>{yearDocs.year}</strong>
              </div>

              <h3>Factures</h3>
              <ul>
                {yearDocs.factures.map((d) => {
                  const label = d.numero || `Facture #${d.id}`;
                  return (
                    <li key={"F-" + d.id}>
                      <i className="bi bi-file-earmark-text" /> {label} —{" "}
                      {d.date} |{" "}
                      <button
                        onClick={() => openPdfInPage(d.id, "facture", label)}
                        style={linkBtn}
                      >
                        Ouvrir PDF
                      </button>
                    </li>
                  );
                })}
                {yearDocs.factures.length === 0 && <li>Aucune facture.</li>}
              </ul>

              <h3>Ordonnances</h3>
              <ul>
                {yearDocs.ordonnances.map((d) => {
                  const label = d.numero || `Ordonnance #${d.id}`;
                  return (
                    <li key={"O-" + d.id}>
                      <i className="bi bi-file-earmark-text" /> {label} —{" "}
                      {d.date} |{" "}
                      <button
                        onClick={() =>
                          openPdfInPage(d.id, "prescription", label)
                        }
                        style={linkBtn}
                      >
                        Ouvrir PDF
                      </button>
                    </li>
                  );
                })}
                {yearDocs.ordonnances.length === 0 && (
                  <li>Aucune ordonnance.</li>
                )}
              </ul>
            </div>
          )}
        </>
      )}

      {/* ------- MODALE PDF ------- */}
      {preview.open && (
        <PdfModal
          url={preview.url}
          title={preview.title}
          onClose={closePdfModal}
          onPrint={printFromModal}
          iframeRef={iframeRef}
        />
      )}
    </div>
  );
}

function PdfModal({ url, title, onClose, onPrint, iframeRef }) {
  // Fermer via Echap + clic en arrière-plan
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <div
            style={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onPrint} style={toolbarBtn} title="Imprimer">
              <i className="bi bi-printer" />
            </button>
            <button onClick={onClose} style={toolbarBtn} title="Fermer">
              <i className="bi bi-x-lg" />
            </button>
          </div>
        </div>
        <div style={modalBody}>
          {/* <iframe
            ref={iframeRef}
            id="pdfFrame"
            src={url}
            title="aperçu-pdf"
            style={{ width: "100%", height: "100%", border: "none" }}
          /> */}
          <object data={url} type="application/pdf" width="100%" height="100%">
            <p>
              Votre navigateur ne peut pas afficher le PDF.
              <a href={url} target="_blank" rel="noreferrer">
                Télécharger le PDF
              </a>
            </p>
          </object>
        </div>
      </div>
    </div>
  );
}

// ---- Styles "simples" ----
const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  textAlign: "left",
  background: "white",
  cursor: "pointer",
};

const linkBtn = {
  background: "none",
  border: "none",
  padding: 0,
  color: "#2563eb",
  cursor: "pointer",
  textDecoration: "underline",
};

const iconBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "2px 4px",
  fontSize: 16,
};

const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

// const modalContent = {
//   width: "92vw",
//   height: "90vh",
//   background: "white",
//   borderRadius: 10,
//   boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
//   display: "flex",
//   flexDirection: "column",
//   overflow: "hidden",
// };

const modalContent = {
  width: "92vw",
  maxWidth: 600, // limite pour desktop
  height: "90vh",
  maxHeight: 800,
  background: "white",
  borderRadius: 10,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const modalHeader = {
  padding: "10px 12px",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
};

// const modalBody = {
//   flex: 1,
//   minHeight: 0,
// };

const modalBody = {
  flex: 1,
  minHeight: 300, // assure une taille minimale même petit écran
  overflow: "auto",
};

const toolbarBtn = {
  background: "none",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: "6px 8px",
  cursor: "pointer",
};