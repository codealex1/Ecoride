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
    { id: 1, name: 'Ferrari' },
    { id: 2, name:  'Tesla' },
    { id: 3, name: 'Renault' },
    { id: 4, name: 'Volkswagen' },
    { id: 5, name: 'Mercedes' },
    { id: 6, name: 'BMW' },
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


  const handlePassage = async () => {
    if (!user || !user.id) {
      setMessage("Utilisateur non valide ou ID manquant.");
      return;
    }

    try {
      const response = await fetch(
        `/user/update-role/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: ["ROLE_PASSAGE" , "ROLE_USER"] }),
        }
      );

      if (response.ok) {
        setMessage("Rôle mis à jour avec succès !");
      } else {
        const error = await response.json();
        setMessage(`Erreur : ${error.error}`);
      }
    } catch (err) {
      setMessage("Une erreur est survenue lors de la mise à jour du rôle.");
      console.error(err);
    }
  };
  const handleConduteur = async () => {
    if (!user || !user.id) {
      setMessage("Utilisateur non valide ou ID manquant.");
      return;
    }

    try {
      const response = await fetch(
        `/user/update-role/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: ["ROLE_CONDUCTEUR" , "ROLE_PASSAGE" , "ROLE_USER"] }),
        }
      );

      if (response.ok) {
        setMessage("Rôle mis à jour avec succès !");
      } else {
        const error = await response.json();
        setMessage(`Erreur : ${error.error}`);
      }
    } catch (err) {
      setMessage("Une erreur est survenue lors de la mise à jour du rôle.");
      console.error(err);
    }
  };


  const handleConducteurPassage = async () => {
    if (!user || !user.id) {
      setMessage("Utilisateur non valide ou ID manquant.");
      return;
    }

    try {
      const response = await fetch(
        `/user/update-role/2roles/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: ["ROLE_CONDUCTEUR" , "ROLE_PASSAGE" , "ROLE_USER"] }),
        }
      );

      if (response.ok) {
        setMessage("Rôle mis à jour avec succès !");
      } else {
        const error = await response.json();
        setMessage(`Erreur : ${error.error}`);
      }
    } catch (err) {
      setMessage("Une erreur est survenue lors de la mise à jour du rôle.");
      console.error(err);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Préparer les données à envoyer
    const formData = {
      immatriculation,
      date_premiere_imma,
      modele,
      energie, 
      marque_id: marque,
      couleur,
      nb_place: parseInt(nb_place, 10),
      proprietaire_id: user.id, //  l'ID du propriétaire connecté (à gérer dynamiquement)
    };

    try {
      // Envoi des données au contrôleur via une requête POST
      const response = await fetch('/api/voiture/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.reload();
        const result = await response.json();
        setMessage(`Voiture ajoutée avec succès ! ID: ${result.voiture_id}`);
      } else {
        const error = await response.json();
        setMessage(`Erreur : ${error.error}`);
      }
    } catch (err) {
      setMessage('Une erreur est survenue lors de la soumission du formulaire.');
      console.error(err);
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Appeler handlePassage pour changer le rôle de l'utilisateur
    await handleConduteur();
  
    // Ensuite, appeler handleSubmit pour soumettre les données du formulaire
    await handleSubmit(e);
  };
  const handleFormSubmit2roles = async (e) => {
    e.preventDefault();
  
    // Appeler handlePassage pour changer le rôle de l'utilisateur
    await handleConducteurPassage();
    
    // Ensuite, appeler handleSubmit pour soumettre les données du formulaire
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
          <form onSubmit={handlePassage}>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded ml-32">
              Sélectionnez le rôle
            </button>
          </form>
        </div>
      )}
      {role === 'conducteur/passage' && (
        <div>
          <form onSubmit={handleFormSubmit2roles } className="bg-white p-4 rounded shadow-md">
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
