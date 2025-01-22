import React, { useState } from 'react';
import './Covoiturages.css'


function Covoiturages() {
     const [depart, setDepart] = useState('');
     const [date, setDate] = useState('');
     const [arrivee, setArrivee] = useState('');
     const [results, setResults] = useState([]);
 
     // Fonction pour formater les dates
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
 
     const handleSearch = async () => {
         const url = `https://127.0.0.1:8000/api/covoiturages/search/${depart}/${arrivee}/${date}`;
 
         try {
             const response = await fetch(url);
             if (!response.ok) {
                 throw new Error('Erreur lors de la récupération des données');
             }
             const data = await response.json();
             setResults(data);
         } catch (error) {
             console.error('Erreur:', error);
         }
     };
 
     return (
        
         <div>
          <img className='imgBack' src="./images/carte2.png" alt="carte" />
             <h1 className='h1-search-co '><strong>Trouvez votre itinéraire rapidement !</strong></h1>
             <div className="search-bar-co search-bar">
                 <input
                     type="text"
                     placeholder="Lieu de départ"
                     value={depart}
                     onChange={(e) => setDepart(e.target.value)}
                 />
                 <input
                     type="text"
                     placeholder="Lieu d'arrivée"
                     value={arrivee}
                     onChange={(e) => setArrivee(e.target.value)}
                 />
                 <input
                     type="date"
                     placeholder="Date de départ"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                 />
                 <button onClick={handleSearch}>Rechercher</button>
             </div>
 
            {results.length > 0 && (
        <div>
         
         <div className="results-container">
             {results.map((ride) => (
                 <div className="ride-card" key={ride.id}>
                     <h1><strong>{ride.trajet}</strong></h1>
                     <p>
                         <strong>Conducteur:</strong> {ride.conducteur} 
                     </p>
                     <p>
                         <strong>Départ:</strong> {ride.lieu_depart} le {formatDate(ride.date_depart)} à {ride.heure_depart}
                     </p>
                     <p>
                         <strong>Arrivée:</strong> {ride.lieu_arrivee} le {formatDate(ride.date_arrivee)} à {ride.heure_arrivee}
                     </p>
                     <p>
                         <strong>Durée:</strong> {ride.duree} heures
                     </p>
                     <p>
                         <strong>Places disponibles:</strong> {ride.nb_place}
                     </p>
                     <p>
                         <strong>Prix par personne:</strong> {ride.prix_personne} €
                     </p>
                     <p>
                         <strong>Durée</strong> {ride.duree} heures
                     </p>
                     <p>
                         <strong>Véhicule :</strong> {ride.marque} {ride.modele} 
                     </p>
                     <p>
                        <strong>Écologique :</strong> {ride.energie === 'electrique' ? 'Oui' : 'Non'}
                    </p>
                     <button className="contact-button">Contacter le conducteur</button>
                 </div>
             ))}
         </div>
     </div>
 )}
 
             <div className="image-container">
                 <img src="./images/carte.png" alt="carte" />
             </div>
         </div>
     );
}

export default Covoiturages