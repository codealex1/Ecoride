import React, { useState , useEffect} from 'react';
import './EspaceUtilisateur.css';

function EspaceUtilisateur() {

  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0); // État pour les crédits
  
  useEffect(() => {
    // Récupérer les données utilisateur injectées par Symfony
    const currentUser = window.currentUser ? window.currentUser : null;
    setUser(currentUser);

    // Si l'utilisateur est connecté, récupérer ses crédits
    if (currentUser && currentUser.credit !== undefined) {
      setCredits(currentUser.credit);
    }
  }, []);

  const Marque = [
    { id: 1, name: 'Renault' },
    { id: 2, name:  'Ferrari' },
    { id: 3, name: 'Tesla' },
    { id: 4, name: 'Peugeot' },
    { id: 5, name: 'Volkswagen' },
    { id: 6, name: 'Citroën' },
    { id: 7, name: 'Mercedes' },
    { id: 8, name: 'BMW' },
    { id: 9, name: 'Audi' },
    { id: 10, name: 'Toyota' },
    // Ajoutez d'autres marques ici
  ];


  const [immatriculation, setImmatriculation] = useState('');
  const [date_premiere_imma, setDatePremiereImma] = useState('');
  const [modele, setModele] = useState('');
  const [marque, setMarque] = useState('');
  const [nb_place, setNbPlace] = useState('');
  const [couleur, setCouleur] = useState('');
  const [role, setRole] = useState(null);
  const [energie , setEnergie] = useState('');
  const [message, setMessage] = useState('');

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };


  const handleFetch = async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (err) {
      setMessage(`Erreur : ${err.message}`);
      console.error(err);
    }
  };

    

  const handleRoleUpdate = async (newRoles) => {
    if (!user || !user.id) {
      setMessage("Utilisateur non valide ou ID manquant.");
      return;
    }
  
    const currentRoles = user.roles || []; // Récupérer les rôles existants
    const updatedRoles = Array.from(new Set([...currentRoles, ...newRoles])); // Ajouter les nouveaux rôles sans doublons
  
    const url = `/user/update-role/${user.id}`;
    const body = { role: updatedRoles };
    const result = await handleFetch(url, 'POST', body);
  
    if (result) {
      setMessage("Rôle mis à jour avec succès !");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      immatriculation,
      date_premiere_imma,
      modele,
      energie,
      marque_id: marque,
      couleur,
      nb_place: parseInt(nb_place, 10),
      proprietaire_id: user.id,
    };

    const result = await handleFetch('/api/voiture/add', 'POST', formData);
    if (result) {
      setMessage(`Voiture ajoutée avec succès ! ID: ${result.voiture_id}`);
      window.location.reload();
    }
  };

  const handleFormPassage = async (e) => {
    e.preventDefault();
    await handleRoleUpdate(role === 'conducteur' ? ["ROLE_CONDUCTEUR", "ROLE_USER"] : ["ROLE_PASSAGE", "ROLE_USER"]);
    
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleRoleUpdate(role === 'conducteur' ? ["ROLE_CONDUCTEUR", "ROLE_USER"] : ["ROLE_PASSAGE", "ROLE_USER"]);
    await handleSubmit(e);
  };
  const handleFormSubmit2roles = async (e) => {
    e.preventDefault();
    await handleRoleUpdate(role === 'conducteur/passage' ? ["ROLE_CONDUCTEUR", "ROLE_USER" , "ROLE_PASSAGE"] : ["ROLE_PASSAGE", "ROLE_USER"]);
    await handleSubmit(e);
  };

  


  const handleAddCredit = async () => {
    try {
      // Appel à la route Symfony pour ajouter un crédit
      const response = await fetch("/credit-user", {
        method: "GET", // Ou POST selon votre configuration Symfony
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          
          // Mettre à jour les crédits dans l'état local
          setCredits((prevCredits) => prevCredits + 1);
          setMessage("Crédit ajouté avec succès !");
          window.location(reload);
        } else {
          setMessage("Erreur lors de l'ajout du crédit.");
        }
      } else {
        setMessage("Erreur de communication avec le serveur.");
      }
    } catch (error) {
     
      console.error(error);
    }
  };


  return (
    
    <div className="max-w-md mx-auto p-4 bottom">
       <div className="max-w-md mx-auto p-4">
      {/* Section pour afficher les crédits */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Espace Utilisateur</h1>
        <div className="text-right">
          <p className="text-lg font-semibold">Crédits :</p>
          <p className="text-2xl font-bold text-green-500">{credits}</p>
        </div>
      </div>

      {/* Bouton "Ajouter Crédit" */}
      <div className="text-center mb-6">
        <button
          onClick={handleAddCredit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Ajouter Crédit
        </button>
      </div>

      {/* Affichage du message */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
      <h1 className="text-2xl font-bold mb-4 ml-24">Choisissez votre rôle</h1>
      <div className="flex justify-around mb-4">
        <button
          onClick={() => handleRoleChange('conducteur')}
          className={`px-4 py-2 rounded ${role === 'conducteur' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Conducteur
        </button>
        <button
          onClick={() => handleRoleChange('passager')}
          className={`px-4 py-2 rounded ${role === 'passager' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Passager
        </button>
        <button
          onClick={() => handleRoleChange('conducteur/passage')}
          className={`px-4 py-2 rounded ${role === 'conducteur/passage' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Les deux ?
        </button>
      </div>
      {role === 'passager' && (
        <div>
          <form onSubmit={handleFormPassage} className="bg-white p-4 rounded shadow-md">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded ml-32">
              Sélectionnez le rôle
            </button>
          </form>
        </div>
      )}
      {role === 'conducteur/passage' && (
        <div>
          <form onSubmit={handleFormSubmit2roles} className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informations du véhicule</h2>
          <div className="mb-4">
            <label className="block mb-1">Plaque d’immatriculation</label>
            <input
              type="text"
              placeholder="0000-00"
              value={immatriculation}
              onChange={(e) => setImmatriculation(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Date de première immatriculation</label>
            <input
              type="date"
              value={date_premiere_imma}
              onChange={(e) => setDatePremiereImma(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Modèle du véhicule</label>
            <textarea
              value={modele}
              onChange={(e) => setModele(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Marque du véhicule</label>
            <select
              value={marque}
              onChange={(e) => setMarque(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            >
              <option value="">Sélectionner une marque</option>
              {Marque.map((marques) => (
                <option key={marques.id} value={marques.id}>
                  {marques.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Couleur du Véhicule</label>
            <input
              type="text"
              value={couleur}
              onChange={(e) => setCouleur(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Nombre de places disponibles</label>
            <input
              type="text"
              value={nb_place}
              onChange={(e) => setNbPlace(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Énergie</label>
            <input
              type="text"
              value={energie}
              onChange={(e) => setEnergie(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded ml-32">
            Sélectionnez les deux roles
          </button>
        </form>
        </div>
      )}
      {role === 'conducteur' && (
        <form onSubmit={handleFormSubmit } className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informations du véhicule</h2>
          <div className="mb-4">
            <label className="block mb-1">Plaque d’immatriculation</label>
            <input
              type="text"
              placeholder="0000-00"
              value={immatriculation}
              onChange={(e) => setImmatriculation(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Date de première immatriculation</label>
            <input
              type="date"
              value={date_premiere_imma}
              onChange={(e) => setDatePremiereImma(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Modèle du véhicule</label>
            <textarea
              value={modele}
              onChange={(e) => setModele(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Marque du véhicule</label>
            <select
              value={marque}
              onChange={(e) => setMarque(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            >
              <option value="">Sélectionner une marque</option>
              {Marque.map((marques) => (
                <option key={marques.id} value={marques.id}>
                  {marques.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Couleur du Véhicule</label>
            <input
              type="text"
              value={couleur}
              onChange={(e) => setCouleur(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Nombre de places disponibles</label>
            <input
              type="text"
              value={nb_place}
              onChange={(e) => setNbPlace(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Énergie</label>
            <input
              type="text"
              value={energie}
              onChange={(e) => setEnergie(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded ml-32">
            Soumettre
          </button>
        </form>
      )}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default EspaceUtilisateur;
