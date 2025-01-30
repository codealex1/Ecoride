import React, { useState } from "react";

function Commentaire() {
  const [commentaire, setCommentaire] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const covoiturageId = window.covoiturageId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/commentaire/ajouter/${covoiturageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentaire, note }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Votre avis a été envoyé avec succès !");
      setCommentaire("");
      setNote("");
    } else {
      setMessage(data.error || "Une erreur s'est produite.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Laissez un avis</h1>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Commentaire</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg h-24 focus:ring focus:ring-blue-300"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Note (sur 5)</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          >
            <option value="">Sélectionnez une note</option>
            <option value="1">1 - Mauvais</option>
            <option value="2">2 - Moyen</option>
            <option value="3">3 - Bien</option>
            <option value="4">4 - Très bien</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Envoyer l'avis
        </button>
      </form>
    </div>
  );
}

export default Commentaire;
