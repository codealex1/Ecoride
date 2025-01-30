import React, { useEffect, useState } from "react";

function CovoituragesGrid() {
  const [covoiturages, setCovoiturages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    setUser(window.currentUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchCovoiturages = async () => {
      try {
        const response = await fetch(
          `/api/voiture/driver/${user.id}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des covoiturages");
        }
        const data = await response.json();
        setCovoiturages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCovoiturages();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce covoiturage ?")) {
      try {
        const response = await fetch(
          `/api/covoiturages/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression du covoiturage");
        }

        setCovoiturages((prev) =>
          prev.filter((covoiturage) => covoiturage.id !== id)
        );
        alert("Covoiturage supprimé avec succès.");
      } catch (err) {
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  const handleActivate = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/covoiturages/${id}/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'activation du covoiturage.");
      }

      const data = await response.json();
      if (data.success) {
        alert("Covoiturage activé avec succès !");
        // Recharger les covoiturages après activation
        setCovoiturages((prev) =>
          prev.map((covoiturage) =>
            covoiturage.id === id ? { ...covoiturage, isActive: true } : covoiturage
          )
        );
        window.location.reload();
      } else {
        alert(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivate = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/covoiturages/${id}/deactivate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la désactivation du covoiturage.");
      }

      const data = await response.json();
      if (data.success) {
        alert("Covoiturage désactivé avec succès !");
        
        // Recharger les covoiturages après désactivation
        setCovoiturages((prev) =>
          prev.map((covoiturage) =>
            covoiturage.id === id ? { ...covoiturage, isActive: false } : covoiturage
          )
        );
        window.location.reload();
      } else {
        alert(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleStart = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/covoiturages/${id}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du démarrage du covoiturage.");
      }

      const data = await response.json();
      if (data.success) {
        alert("Covoiturage démarré avec succès !");
        setCovoiturages((prev) =>
          prev.map((covoiturage) =>
            covoiturage.id === id ? { ...covoiturage, isStarted: true } : covoiturage
          )
        );
        window.location.reload();
      } else {
        alert(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  // Fonction pour terminer un covoiturage
  const handleFinish = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/covoiturages/${id}/finish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la terminaison du covoiturage.");
      }

      const data = await response.json();
      if (data.success) {
        alert("Covoiturage terminé avec succès !");
        setCovoiturages((prev) =>
          prev.map((covoiturage) =>
            covoiturage.id === id ? { ...covoiturage, isFinished: true } : covoiturage
          )
        );
        window.location.reload();
      } else {
        alert(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="covoiturages-grid mb-32">
      <h1 className="text-center font-bold text-[34px]">Vos Covoiturages</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-center text-xl font-semibold text-red-500">{error}</p>
      ) : covoiturages.length === 0 ? (
        <p className="text-center text-xl font-semibold text-gray-700">
          Aucun covoiturage trouvé.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {covoiturages.map((covoiturage) => {
            // Stockage de l'état isActive dans une variable
            

            return (
              <div
                key={covoiturage.id}
                className="card p-6 border rounded-lg shadow-lg bg-white max-w-lg mx-auto"
              >
                <h3 className="font-bold text-2xl text-gray-800 mb-2">
                  {covoiturage.trajet}
                </h3>
                <p className="text-lg text-gray-700 mb-1">
                  <strong>Durée :</strong> {covoiturage.duree}
                </p>
                <p className="text-lg text-gray-700 mb-1">
                  <strong>Départ :</strong> {covoiturage.date_depart} à{" "}
                  {covoiturage.heure_depart} ({covoiturage.lieu_depart})
                </p>
                <p className="text-lg text-gray-700 mb-1">
                  <strong>Arrivée :</strong> {covoiturage.date_arrivee} à{" "}
                  {covoiturage.heure_arrivee} ({covoiturage.lieu_arrivee})
                </p>
                <p className="text-lg text-gray-700 mb-1">
                  <strong>Places disponibles :</strong> {covoiturage.nb_place}
                </p>
                <p className="text-lg text-gray-700 mb-1">
                  <strong>Prix par personne :</strong>{" "}
                  {covoiturage.prix_personne} €
                </p>
                <p className="text-lg text-gray-700 mb-1">
                  <strong>Préférences :</strong>{" "}
                  {covoiturage.preferences} 
                </p>
                <p className="text-lg text-gray-700 mb-1">
                  
                  <strong>Activé :</strong> {covoiturage.is_active  ? "Oui" : "Non"} {/* Affichage du booléen */}
                </p>
                <p className="text-lg text-gray-700 mb-1">
                  <strong>Démarrer :</strong> {covoiturage.is_started === null 
                    ? "Non" 
                    : covoiturage.is_started  
                    ? "Oui" 
                    : "Terminé"}
                </p>
                <p className="text-lg text-gray-700 mb-1">
                  <strong>Participants :</strong>
                  {covoiturage.participant && covoiturage.participant.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {covoiturage.participant.map((participant, index) => (
                        <li key={index}>{participant}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun participant pour ce covoiturage.</p>
                  )}
                </p>
                
                <div className="flex justify-between mt-4">
                  <div className="flex gap-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                    onClick={() => handleDelete(covoiturage.id)}
                  >
                    Supprimer
                  </button>

                  {/* Condition sur l'état de isActive */}
                  {covoiturage.is_active ? (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                      onClick={() => handleDesactivate(covoiturage.id)}
                    >
                      Désactiver Covoiturage
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                      onClick={() => handleActivate(covoiturage.id)}
                    >
                      Activer Covoiturage
                    </button>
                  )}
                  
                 {/* Bouton Démarrer */}
                  {covoiturage.is_active && !covoiturage.is_started && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                      onClick={() => handleStart(covoiturage.id)}
                    >
                      Démarrer
                    </button>
                  )}

                  {/* Bouton Terminer */}
                  {covoiturage.is_active && covoiturage.is_started && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                      onClick={() => handleFinish(covoiturage.id)}
                    >
                      Terminer
                    </button>
                  )}
                  </div>
              </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CovoituragesGrid;
