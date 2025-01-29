import React ,{ useEffect, useState }from 'react';
import Header from './Header';
import Footer from './Footer';
import EspaceUtilisateur from './EspaceUtilisateur/EspaceUtilisateur';
import VoitureGrid from './VoitureGrid/VoitureGrid';
import CovoituragesGrid from './CovoituragesGrid/CovoituragesGrid';
import AjouterTrajet from './AjouterTrajet/AjouterTrajet';
import MesVoyages from './MesVoyages/MesVoyages';

export default function EspaceUtilisateurVue() {
  const [user, setUser] = useState(null);
  
      useEffect(() => {
        // Récupérer les données utilisateur injectées par Symfony
        setUser(window.currentUser);
      }, []);
  // Détecter les rôles de l'utilisateur
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isPassage = user?.roles?.includes('ROLE_PASSAGE');
  const isConducteur = user?.roles?.includes('ROLE_CONDUCTEUR');

  return (
    <>
      <Header />
      <EspaceUtilisateur />
      {(isAdmin || isPassage || isConducteur ) && <VoitureGrid />}

      {(isAdmin || isPassage) && <MesVoyages />}
      
      
      {(isAdmin || isConducteur) && <CovoituragesGrid />}
      {(isAdmin || isConducteur) && <AjouterTrajet />}
      <Footer />
    </>
  );
}
