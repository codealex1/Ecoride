import { AppBar, Toolbar, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../styles/Header.css"; // Importation du fichier CSS

export default function Header() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false); // État du menu burger

    useEffect(() => {
        setUser(window.currentUser);
    }, []);

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isUser = user?.roles?.includes("ROLE_USER");
    const isConducteur = user?.roles?.includes("ROLE_CONDUCTEUR");
    const isPassage = user?.roles?.includes("ROLE_PASSAGE");
    const isEmploye = user?.roles?.includes("ROLE_EMPLOYE");

    return (
        <AppBar position="static">
            <Toolbar style={{ background: "#538460" }} className="flex justify-between">
                {/* Lien Accueil */}
                <a href="/" className="text-white text-lg font-bold hover:text-gray-200">
                    Accueil
                </a>

                {/* Menu Desktop */}
                <div className="nav-links flex gap-8 text-white font-medium">
                    <a href="/contact" className="hover:text-gray-200">Contact</a>
                    <a href="/covoiturages" className="hover:text-gray-200">Covoiturages</a>
                </div>

                {/* Boutons Desktop */}
                <div className="nav-links flex gap-4">
                    <Button href="/connexion" variant="contained" className="bg-white text-green-700">
                        Connexion
                    </Button>
                    <Button href="/inscription" variant="contained" className="bg-white text-green-700">
                        S'inscrire
                    </Button>
                    {isAdmin && (
                        <Button href="/admin" variant="contained" className="bg-white text-green-700">
                            Espace Admin
                        </Button>
                    )}
                    {(isUser || isConducteur || isPassage) && (
                        <Button href="/EspaceUtilisateur" variant="contained" className="bg-white text-green-700">
                            Espace Utilisateur
                        </Button>
                    )}
                    {(isAdmin || isEmploye) && (
                        <Button href="/employe/avis" variant="contained" className="bg-white text-green-700">
                            Espace Employé
                        </Button>
                    )}
                </div>

                {/* Menu Burger pour Mobile */}
                <div className="burger-menu">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl">
                        ☰
                    </button>
                </div>
            </Toolbar>

            {/* Menu Mobile (affiché quand menuOpen est true) */}
            {menuOpen && (
                <div className="mobile-menu">
                    <a href="/contact" className="text-white text-lg hover:text-gray-200">Contact</a>
                    <a href="/covoiturages" className="text-white text-lg hover:text-gray-200">Covoiturages</a>
                    <Button href="/connexion" variant="contained" className="bg-white text-green-700 w-full">
                        Connexion
                    </Button>
                    <Button href="/inscription" variant="contained" className="bg-white text-green-700 w-full">
                        S'inscrire
                    </Button>
                    {isAdmin && (
                        <Button href="/admin" variant="contained" className="bg-white text-green-700 w-full">
                            Espace Admin
                        </Button>
                    )}
                    {(isUser || isConducteur || isPassage) && (
                        <Button href="/EspaceUtilisateur" variant="contained" className="bg-white text-green-700 w-full">
                            Espace Utilisateur
                        </Button>
                    )}
                    {(isAdmin || isEmploye) && (
                        <Button href="/employe/avis" variant="contained" className="bg-white text-green-700 w-full">
                            Espace Employé
                        </Button>
                    )}
                </div>
            )}
        </AppBar>
    );
}
