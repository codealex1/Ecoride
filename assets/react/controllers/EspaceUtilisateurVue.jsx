import React from 'react'
import Header from './Header'
import Footer from './Footer/Footer'
import EspaceUtilisateur from './EspaceUtilisateur/EspaceUtilisateur'
import VoitureGrid from './VoitureGrid/VoitureGrid'
import CovoituragesGrid from './CovoituragesGrid/CovoituragesGrid'
import AjouterTrajet from './AjouterTrajet/AjouterTrajet'


export default function EspaceUtilisateurVue() {
  return (
    <>
     <Header/>
     <EspaceUtilisateur/>
     <VoitureGrid />
     <AjouterTrajet />
     <CovoituragesGrid/>
     <Footer/>
    </>
       
   
    
  )
}

