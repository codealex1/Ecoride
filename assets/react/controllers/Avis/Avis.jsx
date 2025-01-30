import React, { useState, useEffect } from "react";

function Avis() {
  const [avis, setAvis] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filtered, setFiltered] = useState(false); // État pour activer/désactiver le filtre

  useEffect(() => {
    fetchAvis();
  }, []);

  const fetchAvis = async () => {
    try {
      const response = await fetch("/employe/avis/all");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des avis");
      }
      const data = await response.json();
      setAvis(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`/employe/avis/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: true }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'activation de l'avis");
      }

      const data = await response.json();
      setMessage(data.message);
      fetchAvis();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/employe/avis/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'avis");
      }

      const data = await response.json();
      setMessage(data.message);
      fetchAvis();
    } catch (err) {
      setError(err.message);
    }
  };

  // Fonction pour basculer le filtre
  const toggleFilter = () => {
    setFiltered((prev) => !prev);
  };

  // Regrouper les avis en fonction de la note
  const avisBienPasses = avis.filter((item) => parseInt(item.note) > 3);
  const avisMalPasses = avis.filter((item) => parseInt(item.note) <= 3);

  return (
    <div className="avis-container p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des Avis</h1>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <button
        onClick={toggleFilter}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        {filtered ? "Afficher tous les avis" : "Filtrer les avis"}
      </button>

      {filtered ? (
        <div>
          {/* Section des avis bien passés */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Ce sont bien passés</h2>
            {avisBienPasses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {avisBienPasses.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg shadow-lg bg-white"
                  >
                    <p>
                      <strong>Commentaire:</strong> {item.commentaire}
                    </p>
                    <p>
                      <strong>Note:</strong> {item.note}
                    </p>
                    <p>
                      <strong>Statut:</strong>{" "}
                      {item.statut ? "Actif" : "Inactif"}
                    </p>
                    <p>
                      <strong>Conducteur:</strong>{" "}
                      {item.user_id.pseudo}, {item.user_id.email}
                    </p>
                    <p>
                      <strong>Trajet:</strong>{" "}
                      {item.covoiturages_id
                        ? item.covoiturages_id.trajet
                        : "Non défini"}
                    </p>
                    <p>
                    <strong>Participants:</strong>{" "}
                      {item.covoiturages_id && item.covoiturages_id.participant.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {item.covoiturages_id.participant.map((participant, index) => (
                            <li key={index}>{participant}</li>
                          ))}
                        </ul>
                      ) : (
                        "Aucun participant"
                      )}
                    </p>
                   
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => handleActivate(item.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                      >
                        Activer
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucun avis bien passé</p>
            )}
          </div>

          {/* Section des avis mal passés */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Ce sont mal passés</h2>
            {avisMalPasses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {avisMalPasses.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg shadow-lg bg-white"
                  >
                    <p>
                      <strong>Commentaire:</strong> {item.commentaire}
                    </p>
                    <p>
                      <strong>Note:</strong> {item.note}
                    </p>
                    <p>
                      <strong>Statut:</strong>{" "}
                      {item.statut ? "Actif" : "Inactif"}
                    </p>
                    <p>
                      <strong>Conducteur:</strong>{" "}
                      {item.user_id.pseudo}, {item.user_id.email}
                    </p>
                    <p>
                      <strong>Trajet:</strong>{" "}
                      {item.covoiturages_id
                        ? item.covoiturages_id.trajet
                        : "Non défini"}
                    </p>
                    <p>
                    <strong>Participants:</strong>{" "}
                      {item.covoiturages_id && item.covoiturages_id.participant.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {item.covoiturages_id.participant.map((participant, index) => (
                            <li key={index}>{participant}</li>
                          ))}
                        </ul>
                      ) : (
                        "Aucun participant"
                      )}
                    </p>
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => handleActivate(item.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                      >
                        Activer
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucun avis mal passé</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {avis.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg shadow-lg bg-white"
            >
              <p>
                <strong>Commentaire:</strong> {item.commentaire}
              </p>
              <p>
                <strong>Note:</strong> {item.note}
              </p>
              <p>
                <strong>Statut:</strong> {item.statut ? "Actif" : "Inactif"}
              </p>
              <p>
                <strong>Conducteur:</strong>{" "}
                {item.user_id.pseudo}, {item.user_id.email}
              </p>
              <p>
                <strong>Trajet:</strong>{" "}
                {item.covoiturages_id
                  ? item.covoiturages_id.trajet
                  : "Non défini"}
              </p>
              <p>
                    <strong>Participants:</strong>{" "}
                      {item.covoiturages_id && item.covoiturages_id.participant.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {item.covoiturages_id.participant.map((participant, index) => (
                            <li key={index}>{participant}</li>
                          ))}
                        </ul>
                      ) : (
                        "Aucun participant"
                      )}
                    </p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleActivate(item.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                >
                  Activer
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Avis;
