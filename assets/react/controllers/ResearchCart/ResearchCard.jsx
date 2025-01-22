// RideCard.js
import React from 'react';
import './ResearchCard.css'; // Importer le fichier CSS pour le style

function ResearchCard({ ride }) {
    return (
        <div className="ride-card">
            <h3>{ride.trajet}</h3>
            <p><strong>Départ:</strong> {ride.lieu_depart} à {ride.date_depart} {ride.heure_depart}</p>
            <p><strong>Arrivée:</strong> {ride.lieu_arrivee} à {ride.date_arrivee} {ride.heure_arrivee}</p>
            <p><strong>Durée:</strong> {ride.duree} heures</p>
            <p><strong>Places disponibles:</strong> {ride.nb_place}</p>
            <p><strong>Prix par personne:</strong> {ride.prix_personne} €</p>
            <button className="contact-button">Contacter le conducteur</button>
        </div>
    );
}

export default ResearchCard;