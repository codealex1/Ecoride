import React, { useEffect, useState } from 'react';

function MesVoyages() {
  const [covoiturages, setCovoiturages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const covoiturageId = window.covoiturageId;

  useEffect(() => {
    setUser(window.currentUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchMesVoyages = async () => {
      try {
        const response = await fetch(
          'https://127.0.0.1:8000/api/covoiturages/participations'
        );
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des covoiturages');
        }
        const data = await response.json();
        setCovoiturages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMesVoyages();
  }, [user]);

  const handleCancelParticipation = async (id) => {
    try {
      const response = await fetch(
        `https://127.0.0.1:8000/covoiturage/${id}/cancel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Ajoutez ici le token d'authentification si nécessaire
          },
        }
      );
      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la participation');
      }
      const creditResponseAdd = await fetch(
        `https://127.0.0.1:8000/credit/${user.id}/${covoiturageId}/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies pour les sessions (si applicable)
        }
      );

      if (!creditResponseAdd.ok) {
        const creditErrorData = await creditResponseAdd.json();
        throw new Error(creditErrorData.error || 'Erreur lors de l\'ajout de crédits');
      }
      console.log("Vous avez bien était remboursé ")
      // Mettre à jour la liste des covoiturages après l'annulation
      setCovoiturages((prevCovoiturages) =>
        prevCovoiturages.filter((covoiturage) => covoiturage.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="covoiturages-grid mb-32">
      <h1 className="text-center font-bold text-[34px]">Vos Voyages</h1>
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
          {covoiturages.map((covoiturage) => (
            <div
              key={covoiturage.id}
              className="card p-6 border rounded-lg shadow-lg bg-white max-w-lg mx-auto"
            >
              <h3 className="font-bold text-2xl text-gray-800 mb-2">
                {covoiturage.trajet}
              </h3>
              <p className="text-lg text-gray-700 mb-1">
                <strong>Conducteur:</strong> {covoiturage.conducteur}
              </p>
              <p className="text-lg text-gray-700 mb-1">
                <strong>Durée :</strong> {covoiturage.duree}
              </p>
              <p className="text-lg text-gray-700 mb-1">
                <strong>Départ :</strong> {covoiturage.date_depart} à{' '}
                {covoiturage.heure_depart} ({covoiturage.lieu_depart})
              </p>
              <p className="text-lg text-gray-700 mb-1">
                <strong>Arrivée :</strong> {covoiturage.date_arrivee} à{' '}
                {covoiturage.heure_arrivee} ({covoiturage.lieu_arrivee})
              </p>
              <p className="text-lg text-gray-700 mb-1">
                <strong>Places disponibles :</strong> {covoiturage.nb_place}
              </p>
              <p className="text-lg text-gray-700 mb-1">
                <strong>Prix par personne :</strong> {covoiturage.prix_personne} €
              </p>
              <p className="text-lg text-gray-700 mb-1">
                <strong>Préférences du conducteur :</strong> {covoiturage.preference}
              </p>
              <p className="text-lg text-gray-700 mb-1">
                <strong>Marque et modéle <br /> de la voiture:</strong> {covoiturage.marque} {covoiturage.modele}
              </p>
              <p className="text-lg text-gray-700 mb-1">
                <strong>Carburant:</strong> {covoiturage.energie}
              </p>
              <button
                onClick={() => handleCancelParticipation(covoiturage.id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Ne plus Participer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MesVoyages;
