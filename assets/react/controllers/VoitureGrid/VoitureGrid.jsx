import React, { useState, useEffect } from 'react';
import './VoitureGrid.css';


function VoitureGrid() {
  const [voitures, setVoitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer les données utilisateur injectées par Symfony
    setUser(window.currentUser);
  }, []);

  useEffect(() => {
    if (!user || !user.id) {
      // Ne pas faire la requête si l'utilisateur n'est pas encore défini
      return;
    }

    const fetchVoitures = async () => {
      try {
        const response = await fetch(`/api/voiture/conducteur/${user.id}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des voitures');
        }

        const data = await response.json();
        setVoitures(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVoitures();
  }, [user]);

  // Fonction pour supprimer une voiture
  const handleDelete = async (voitureId) => {
    try {
      const response = await fetch(`/api/voiture/${voitureId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la voiture');
      }

      // Mettre à jour la liste des voitures après suppression
      setVoitures(voitures.filter((voiture) => voiture.id !== voitureId));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Chargement des voitures...</p>;
  }

  if (error) {
    return <p>Erreur: {error}</p>;
  }

  return (
    <div className="voiture-grid bottom">
      <h1 class="text-center font-bold text-[34px] ">Vos Voitures</h1>

      {voitures.length === 0 ? (
       <p className="text-center text-xl font-semibold text-gray-700">
       Aucune voiture trouvé.
     </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {voitures.map((voiture) => (
            <div
              key={voiture.id}
              className="card p-6 border rounded shadow-md w-full max-w-xs mx-auto"
            >
              <h3 className="font-bold text-xl mb-2">{voiture.marque}</h3>
              <p className="text-lg mb-2"><strong>Modèle:</strong> {voiture.modele}</p>
              <p className="text-lg mb-2"><strong>Immatriculation:</strong> {voiture.immatriculation}</p>
              <p className="text-lg mb-4"><strong>Couleur:</strong> {voiture.couleur}</p>
              <p className="text-lg mb-4"><strong>Énergie:</strong> {voiture.energie}</p>
              <div className="flex flex-col items-center mt-4">
                <button
                  onClick={() => handleDelete(voiture.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
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

export default VoitureGrid;
