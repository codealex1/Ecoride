import React from 'react';
import "./intro.css";

function Intro() {
  return (
    
    <div class="containerIntro">
        <div class="left">
            <p><strong>Bienvenue chez EcoRide :</strong></p>
            <p>
            L'avenir du covoiturage écologique en France
            <br />
            Chez EcoRide, nous croyons qu'il est possible de voyager autrement, tout
            en respectant notre planète. <br />
            Notre mission est claire : réduire l'impact environnemental des
            déplacements grâce à une plateforme <br />
            de covoiturage pensée pour les voyageurs soucieux de l'écologie et les
            adeptes de solutions économiques et responsables.
            </p>
        </div>
        <div class="right">
            <p><strong>Une vision écologique et engagée :</strong></p>
            <p>
            EcoRide a été fondée avec l’ambition de transformer nos habitudes de
            mobilité. Nous nous concentrons exclusivement sur les déplacements en
            voiture, en mettant en relation les conducteurs et les passagers pour
            optimiser les trajets, réduire les émissions de CO₂ et contribuer à la
            préservation de notre environnement.
            </p>
        </div>
        <div class="left2">
            <div>
                
                <p> <strong>Pourquoi choisir EcoRide ?</strong> <br />
                Réduction de l'empreinte carbone : En partageant les trajets, vous contribuez à diminuer le nombre de voitures sur les routes.
                Économie partagée : Profitez d'une solution économique en divisant les coûts de déplacement.
                Communauté engagée : Rejoignez une communauté de voyageurs sensibles à l'écologie et désireux d'agir pour un futur plus durable.
                </p>
                
            </div>
            <img src="./images/empreinte-carbone-definition-calcul-et-bilan-1492273.jpg" alt="carbone" />
        </div>
        <div class="center">
            
            <p>
            <strong>Notre plateforme innovante</strong> <br />
            
            Portée par José, notre directeur technique visionnaire, notre application web 
            intuitive facilite la mise en relation entre conducteurs et passagers partageant des itinéraires similaires. 
            Que vous soyez un conducteur souhaitant réduire ses coûts ou un passager cherchant une solution de déplacement écologique, EcoRide est fait pour vous.
            </p>
            
        </div>
        <div class="center">
            
            <p>
            <strong>Notre ambition</strong> <br />
            
            Notre ambition EcoRide aspire à devenir la plateforme de référence en matière de covoiturage écologique en France. 
            Ensemble, nous pouvons transformer la manière dont nous voyageons et participer activement à la transition écologique.
            Rejoignez le mouvement dès aujourd'hui et découvrez une façon de voyager plus verte, plus économique et plus humaine avec EcoRide !
            </p>
            
        </div>
    </div>
    
  );
}

export default Intro;
