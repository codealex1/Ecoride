import { AppBar,  Grid, Toolbar, Button } from "@mui/material";
import React , { useEffect, useState } from "react";


export default function Header() {

    const [user, setUser] = useState(null);

    useEffect(() => {
      // Récupérer les données utilisateur injectées par Symfony
      setUser(window.currentUser);
    }, []);
  
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isUser = user?.roles?.includes('ROLE_USER');
    const isConducteur = user?.roles.includes('ROLE_CONDUCTEUR')
    const isPassage= user?.roles.includes('ROLE_PASSAGE')
    const isEmploye= user?.roles.includes('ROLE_EMPLOYE')

    return (
        <AppBar position="static">
            <Toolbar style={{ background: '#538460' }}>
                <Grid container justifyContent="space-between" alignItems="center" style={{ width:'100%' }} >
                    
                    <Grid item>
                        <nav className="flex gap-8 text-white font-medium">
                            <a href="/" className="hover:text-gray-200">Accueil</a>
                            <a href="/contact" className="hover:text-gray-200">Contact</a>
                            <a href="/covoiturages" className="hover:text-gray-200">Covoiturages</a>

                        </nav>
                    </Grid>

                    {/* Section droite : Boutons Connexion et S'inscrire */}
                    <Grid item>
                        <div className="flex gap-4">
                            {/* Boutons pour la connexion et l'inscription */}
                            <Button
                            href="/connexion"
                            variant="contained"
                            className="text-white border-white hover:bg-white hover:text-[#538460]"
                            >
                            Connexion
                            </Button>
                            <Button href="/inscription" variant="contained">
                            S'inscrire
                            </Button>

                            {/* Bouton Espace Admin visible uniquement pour les admins */}
                            {isAdmin && (
                            <Button
                                href="/admin"
                                variant="contained"
                                className="text-white border-white hover:bg-white hover:text-[#538460]"
                            >
                                Espace Admin
                            </Button>
                            )}

                            {/* Bouton Espace Utilisateur visible uniquement pour les utilisateurs */}
                            {(isUser || isConducteur || isPassage) && (
                            <Button
                                href="/EspaceUtilisateur"
                                variant="contained"
                                className="text-white border-white hover:bg-white hover:text-[#538460]"
                            >
                                Espace Utilisateur
                            </Button>
                            )}
                            {(isAdmin || isEmploye) && (
                            <Button
                                href="/employe/avis"
                                variant="contained"
                                className="text-white border-white hover:bg-white hover:text-[#538460]"
                            >
                                Espace Employé
                            </Button>
                            )}
                        </div>
                    </Grid>
                    
                    


                </Grid>
            </Toolbar>
        </AppBar>
    )
}