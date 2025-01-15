import { AppBar, Badge, Grid, IconButton, Toolbar, Button } from "@mui/material";
import React from "react";


export default function Header() {

    // const showHome = () => {
    //     visit('/');
    // }

   

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
                            <Button
                                href="/connexion"
                                variant="outlined text-white"
                                className="text-white border-white hover:bg-white hover:text-[#538460]"
                            >
                                Connexion
                            </Button>
                            <Button
                                href="/inscription"
                                variant="contained"
                                
                            >
                                S'inscrire
                            </Button>
                        </div>
                    </Grid>
                    
                    


                </Grid>
            </Toolbar>
        </AppBar>
    )
}