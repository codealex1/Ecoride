import React, { useState, useEffect } from 'react';

function Detail() {
  const [covoiturage, setCovoiturage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const covoiturageId = window.covoiturageId;
  const [user, setUser] = useState(null);

   useEffect(() => {
      setUser(window.currentUser);
    }, []);


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
};


  useEffect(() => {
    if (!covoiturageId) return;

    const fetchCovoiturageDetails = async () => {
      try {
        const response = await fetch(
          `https://127.0.0.1:8000/covoiturages/${covoiturageId}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du covoiturage.");
        }
        const data = await response.json();
        setCovoiturage(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCovoiturageDetails();
  }, [covoiturageId]);

  const participate = async () => {
    try {
      const response = await fetch(
        `https://127.0.0.1:8000/covoiturage/${covoiturageId}/participate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies pour les sessions (si applicable)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur inconnue');
      }
      const creditResponse = await fetch(
        `https://127.0.0.1:8000/credit/${user.id}/${covoiturageId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies pour les sessions (si applicable)
        }
      );

      if (!creditResponse.ok) {
        const creditErrorData = await creditResponse.json();
        throw new Error(creditErrorData.error || 'Erreur lors de l\'ajout de crédits');
      }
      const data = await response.json();
      window.location.reload(); 
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="covoiturage-detail mb-48 mt-32">
      {covoiturage ? (
        <div className="card p-6 border rounded-lg shadow-lg bg-white max-w-lg mx-auto">
          <h3 className="font-bold text-2xl text-gray-800 mb-2">{covoiturage.trajet}</h3>
          <p className="text-lg text-gray-700 mb-1">
            <strong>Conducteur :</strong> {covoiturage.conducteur}
          </p>
          <p className="text-lg text-gray-700 mb-1">
            <strong>Durée :</strong> {covoiturage.duree}
          </p>
          <p className="text-lg text-gray-700 mb-1">
            <strong>Départ :</strong>{formatDate(covoiturage.date_depart.date)}à {covoiturage.heure_depart} ({covoiturage.lieu_depart})
          </p>
          <p className="text-lg text-gray-700 mb-1">
            <strong>Arrivée :</strong> {formatDate(covoiturage.date_arrivee.date)} à {covoiturage.heure_arrivee} ({covoiturage.lieu_arrivee})
          </p>
          <p className="text-lg text-gray-700 mb-1">
            <strong>Places disponibles :</strong> {covoiturage.nb_place}
          </p>
          <p className="text-lg text-gray-700 mb-1">
            <strong>Prix par personne :</strong> {covoiturage.prix_personne} €
          </p>
          <p className="text-lg text-gray-700 mb-1">
            <strong>Marque et modèle du véhicule:</strong> {covoiturage.marque} {covoiturage.modele}
          </p>
          <p className="text-lg text-gray-700 mb-1">
            <strong>Énergie:</strong> {covoiturage.energie}
          </p>
          <p className="text-lg text-gray-700 mb-1">
            <strong>Préférences du conducteur:</strong> {covoiturage.preferences}
          </p>
          {
            covoiturage.avis_conducteur && covoiturage.avis_conducteur.length > 0 ? (
              <p className="text-lg text-gray-700 mb-1">
                <strong>Avis:</strong> {covoiturage.avis_conducteur.map((avis, index) => avis.commentaire).join(', ')}
              </p>
            ) : (
              <p>Pas de commentaires disponibles</p>
            )
          }
         <p className="text-lg text-gray-700 mb-1">
              <strong>Note:</strong> {covoiturage.moyenne_note_conducteur}
            </p>
          <div className="mt-4">
            <button
              onClick={participate}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 w-full"
            >
              Participer
            </button>
            {message && <p className="text-green-500 mt-2">{message} <br /> Rendez-vous sur votre espace pour en savoir plus </p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      ) : (
        <p>Chargement des détails du covoiturage...</p>
      )}
    </div>
  );
}

export default Detail;
