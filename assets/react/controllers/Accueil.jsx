import React from 'react';
import Header from './Header';
import Footer from './Footer/Footer';
import Intro from './Intro/Intro';
import SearchBar from './SearchBar/SearchBar';

export default function Accueil() {
    return <>
    <Header />
    <Intro />
    <SearchBar/>
    <Footer/>
    
    </>
}