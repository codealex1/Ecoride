import { AppBar, Toolbar, Button } from "@mui/material";
import React, { useEffect, useState } from "react";

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
        <AppBar position="static" className="bg-green-700">
            <Toolbar className="flex justify-between items-center">
                
                {/* Lien Accueil */}
                <a href="/" className="text-white text-lg font-bold hover:text-gray-200">
                    Accueil
                </a>

                {/* Menu Burger pour Mobile */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl">
                        ☰
                    </button>
                </div>

                {/* Menu Desktop (visible sur les écrans md et plus) */}
                <div className="hidden md:flex gap-6">
                    <a href="/contact" className="text-white hover:text-gray-200">Contact</a>
                    <a href="/covoiturages" className="text-white hover:text-gray-200">Covoiturages</a>
                </div>

                {/* Boutons Desktop (visible sur md et plus) */}
                <div className="hidden md:flex gap-4">
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
            </Toolbar>

            {/* Menu Mobile (s'affiche lorsque menuOpen est true) */}
            {menuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-green-700 flex flex-col items-center p-4 gap-4 transition-all">
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
