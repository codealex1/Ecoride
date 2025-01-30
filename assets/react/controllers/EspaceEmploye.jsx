import React ,{ useEffect, useState }from 'react';
import Header from './Header';
import Footer from './Footer';
import Avis from './Avis/Avis';


export default function EspaceEmploye() {
  const [user, setUser] = useState(null);
  
      useEffect(() => {
        // Récupérer les données utilisateur injectées par Symfony
        setUser(window.currentUser);
      }, []);
  // Détecter les rôles de l'utilisateur
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isEmploye = user?.roles?.includes('ROLE_EMPLOYE');

  return (
    <>
      <Header />
      {(isAdmin || isEmploye) && <Avis />} <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <Footer />
    </>
  );
}
