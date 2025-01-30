import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar() {
    const [depart, setDepart] = useState('');
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
        const url = `/api/covoiturages/${depart}/${arrivee}`;

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
            <h1 className='h1-search'><strong>Trouvez votre itinéraire rapidement !</strong></h1>
            <div className="search-bar">
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
                <button onClick={handleSearch}>Rechercher</button>
            </div>

           {results.length > 0 && (
    <div>
        
        <div className="results-container">
            {results.map((ride) => (
                <div className="ride-card" key={ride.id}>
                    <h1><strong>{ride.trajet}</strong></h1>
                    <p>
                        <strong>Départ:</strong> {ride.lieu_depart} le {formatDate(ride.date_depart?.date)} à {ride.heure_depart}
                    </p>
                    <p>
                        <strong>Arrivée:</strong> {ride.lieu_arrivee} le {formatDate(ride.date_arrivee?.date)} à {ride.heure_arrivee}
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
                    <button className="contact-button" ><a href={`/covoiturages`}>En savoir plus</a> </button>
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

export default SearchBar;
