import React, { useState, useEffect } from "react";

function AjouterTrajet() {
  const [formData, setFormData] = useState({
    trajet: "",
    duree: "",
    date_depart: "",
    heure_depart: "",
    lieu_depart: "",
    date_arrivee: "",
    heure_arrivee: "",
    lieu_arrivee: "",
    date_arrivee:"",
    heure_arrivee:"",
    nb_place: "",
    prix_personne: "",
    voiture_id: "",
  });

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
      return; // Ne pas faire la requête si l'utilisateur n'est pas encore défini
    }

    const fetchVoitures = async () => {
      try {
        const response = await fetch(`https://127.0.0.1:8000/api/voiture/conducteur/${user.id}`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des voitures");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de formulaire côté client
    const requiredFields = [
      "trajet",
      "duree",
      "date_depart",
      "heure_depart",
      "lieu_depart",
      "date_arrivee",
      "heure_arrivee",
      "lieu_arrivee",
      "nb_place",
      "date_arrivee",
      "heure_arrivee",
      "prix_personne",
      "voiture_id",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Le champ ${field} est requis.`);
        return;
      }
    }

    try {
      const response = await fetch("https://127.0.0.1:8000/api/covoiturages/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          conducteur_id: user.id, // Ajouter l'ID utilisateur connecté
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du trajet.");
      }

      alert("Trajet ajouté avec succès !");
      window.location.reload(); 
    } catch (error) {
      setError("Erreur lors de l'ajout du trajet.");
    }
  };

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  if (error) {
    return <p>Erreur: {error}</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 mb-32">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Ajouter un Trajet</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Trajet</label>
            <input
              type="text"
              name="trajet"
              value={formData.trajet}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Durée</label>
            <input
              type="text"
              name="duree"
              value={formData.duree}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date de départ</label>
            <input
              type="date"
              name="date_depart"
              value={formData.date_depart}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Heure de départ</label>
            <input
              type="text"
              name="heure_depart"
              value={formData.heure_depart}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Lieu de départ</label>
            <input
              type="text"
              name="lieu_depart"
              value={formData.lieu_depart}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Lieu d'arrivée</label>
            <input
              type="text"
              name="lieu_arrivee"
              value={formData.lieu_arrivee}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date arrivée</label>
            <input
              type="text"
              name="date_arrivee"
              value={formData.date_arrivee}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Heure arrivée</label>
            <input
              type="text"
              name="heure_arrivee"
              value={formData.heure_arrivee}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre de places</label>
            <input
              type="number"
              name="nb_place"
              value={formData.nb_place}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Prix par personne</label>
            <input
              type="number"
              name="prix_personne"
              value={formData.prix_personne}
              onChange={handleChange}
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Voiture</label>
            <select
              name="voiture_id"
              value={formData.voiture_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Sélectionnez une voiture</option>
              {voitures.map((voiture) => (
                <option key={voiture.id} value={voiture.id}>
                  {voiture.marque} - {voiture.modele} - {voiture.immatriculation}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Ajouter le trajet
          </button>
        </form>
      </div>
    </div>
  );
}

export default AjouterTrajet;
