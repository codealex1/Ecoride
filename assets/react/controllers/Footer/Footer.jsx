import React from 'react'
import './Footer.css';

function Footer() {
  return (
    <footer class="footer">
    <div class="footer-content">
        
        <div class="footer-logo">
            <img src="./images/logo.png" alt="Logo de l'entreprise" class="logo"></img>
        </div>

        
        <div class="footer-info">
            <p><strong>Email :</strong> contact@entreprise.com</p>
            <a href="/contact" class="footer-link">Page Contact</a>
        </div>
    </div>

    <div class="footer-bottom">
        <a href="/mentions-legales" class="footer-legal">Mentions légales</a>
    </div>
</footer>
  )
}

export default Footer