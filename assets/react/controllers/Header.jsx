import { AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material";
import React, { useEffect, useState } from "react";

export default function Header() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setUser(window.currentUser);
    }, []);

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isUser = user?.roles?.includes("ROLE_USER");
    const isConducteur = user?.roles?.includes("ROLE_CONDUCTEUR");
    const isPassage = user?.roles?.includes("ROLE_PASSAGE");
    const isEmploye = user?.roles?.includes("ROLE_EMPLOYE");

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <AppBar position="static" className="bg-green-700">
            <Toolbar className="flex justify-between">
                {/* Section gauche : Accueil */}
                <a href="/" className="text-white text-lg font-bold hover:text-gray-200">
                    Accueil
                </a>

                {/* Affichage desktop : liens visibles */}
                <div className="hidden md:flex gap-6">
                    <a href="/contact" className="text-white hover:text-gray-200">Contact</a>
                    <a href="/covoiturages" className="text-white hover:text-gray-200">Covoiturages</a>
                </div>

                {/* Section droite : Boutons */}
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

                {/* Menu burger pour mobile */}
                <div className="md:hidden">
                    <IconButton onClick={toggleMenu} className="text-white">
                        <MenuIcon />
                    </IconButton>
                </div>

                {/* Drawer (menu latéral) pour mobile */}
                <Drawer anchor="right" open={menuOpen} onClose={toggleMenu}>
                    <List className="w-64">
                        <ListItem button onClick={toggleMenu} component="a" href="/contact">
                            <ListItemText primary="Contact" />
                        </ListItem>
                        <ListItem button onClick={toggleMenu} component="a" href="/covoiturages">
                            <ListItemText primary="Covoiturages" />
                        </ListItem>
                        <ListItem button onClick={toggleMenu} component="a" href="/connexion">
                            <ListItemText primary="Connexion" />
                        </ListItem>
                        <ListItem button onClick={toggleMenu} component="a" href="/inscription">
                            <ListItemText primary="S'inscrire" />
                        </ListItem>
                        {isAdmin && (
                            <ListItem button onClick={toggleMenu} component="a" href="/admin">
                                <ListItemText primary="Espace Admin" />
                            </ListItem>
                        )}
                        {(isUser || isConducteur || isPassage) && (
                            <ListItem button onClick={toggleMenu} component="a" href="/EspaceUtilisateur">
                                <ListItemText primary="Espace Utilisateur" />
                            </ListItem>
                        )}
                        {(isAdmin || isEmploye) && (
                            <ListItem button onClick={toggleMenu} component="a" href="/employe/avis">
                                <ListItemText primary="Espace Employé" />
                            </ListItem>
                        )}
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}
