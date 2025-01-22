<?php

namespace App\Controller;

use App\Entity\Covoiturages;
use App\Repository\CovoituragesRepository;
use App\Repository\MarqueRepository;
use App\Repository\UserRepository;
use App\Repository\VoitureRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Validator\Constraints\Date;

#[Route('/api/covoiturages', name: 'app_covoiturages_')]
final class CovoituragesController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $manager
      , private CovoituragesRepository $repository
      , private VoitureRepository $voitureRepository
      , private MarqueRepository $marqueRepository
      , private UserRepository $conducteurrepo
      , private SerializerInterface $serializer
      , private UrlGeneratorInterface $urlGenerator
  
      )
      {
      }
    #[Route('/{id}', name: 'show', methods: 'GET')]
    public function show(int $id): JsonResponse
    {
        $covoiturages = $this->repository->findOneBy(['id' => $id]);
        if ($covoiturages) {

           

            $responseData = [
                'trajet' => $covoiturages->getTrajet(),
                'date_depart' => $covoiturages->getDateDepart(),
                'heure_depart' => $covoiturages->getHeureDepart(),
                'lieu_depart' => $covoiturages->getLieuDepart(),
                'date_arrivee' => $covoiturages->getDateArrivee(),
                'heure_arrivee' => $covoiturages->getheureArrivee(),
                'lieu_arrivee' => $covoiturages->getLieuArrivee(),
                'duree' => $covoiturages->getDuree(),
                'nb_place' => $covoiturages->getNbPlace(),
                'prix_personne' => $covoiturages->getPrixPersonne(),
            ];
            return new JsonResponse($responseData, Response::HTTP_OK, []);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }



    #[Route('/{depart}/{arrivee}', name: 'search', methods: 'GET')]
    public function search(string $depart, string $arrivee): JsonResponse
    {
        // Logique pour récupérer les covoiturages en fonction des paramètres
        $covoiturages = $this->repository->findBy([
            'lieu_depart' => $depart,
            'lieu_arrivee' => $arrivee,
            
        ]);
        
        if ($covoiturages) {
            $responseData = [];
            foreach ($covoiturages as $covoiturage) {
                $responseData[] = [
                    'trajet' => $covoiturage->getTrajet(),
                    'date_depart' => $covoiturage->getDateDepart(),
                    'heure_depart' => $covoiturage->getHeureDepart(),
                    'lieu_depart' => $covoiturage->getLieuDepart(),
                    'date_arrivee' => $covoiturage->getDateArrivee(),
                    'heure_arrivee' => $covoiturage->getHeureArrivee(),
                    'lieu_arrivee' => $covoiturage->getLieuArrivee(),
                    'duree' => $covoiturage->getDuree(),
                    'nb_place' => $covoiturage->getNbPlace(),
                    'prix_personne' => $covoiturage->getPrixPersonne(),
                ];
            }
            return new JsonResponse($responseData, Response::HTTP_OK, []);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }

    #[Route('/search/{depart}/{arrivee}/{date}', name: 'covoiturages', methods: 'GET')]
    public function searchCovoiturages(string $depart, string $arrivee, string $date ): JsonResponse
    {
       
        // Logique pour récupérer les covoiturages en fonction des paramètres
        $covoiturages = $this->repository->findBy([
            'lieu_depart' => $depart,
            'lieu_arrivee' => $arrivee,
            'date_depart' => new \DateTime($date), // Conversion de la chaîne de date en objet DateTime
        ]);
        
        if ($covoiturages) {
            $responseData = [];
            foreach ($covoiturages as $covoiturage) {


                $conducteur = $covoiturage->getConducteur(); // Supposons qu'il y ait une relation définie dans l'entité Covoiturage
                $prenomConducteur = $conducteur ? $conducteur->getPseudo() : null; // Récupérer le prénom si le conducteur existe

                $vehicule = $covoiturage->getVoiture();
                $modele = $vehicule ? $vehicule->getModele(): null ;

                $vehicule = $covoiturage->getVoiture();
                $energie = $vehicule ? $vehicule->getEnergie(): null ;
                
                $marque = $vehicule && $vehicule->getMarque() ? $vehicule->getMarque()->getLibelle() : null;

                $responseData[] = [
                    'trajet' => $covoiturage->getTrajet(),
                    'date_depart' => $covoiturage->getDateDepart()->format('Y-m-d'),
                    'heure_depart' => $covoiturage->getHeureDepart(),
                    'lieu_depart' => $covoiturage->getLieuDepart(),
                    'date_arrivee' => $covoiturage->getDateArrivee()->format('Y-m-d'),
                    'heure_arrivee' => $covoiturage->getHeureArrivee(),
                    'lieu_arrivee' => $covoiturage->getLieuArrivee(),
                    'duree' => $covoiturage->getDuree(),
                    'nb_place' => $covoiturage->getNbPlace(),
                    'prix_personne' => $covoiturage->getPrixPersonne(),
                    'conducteur' => $prenomConducteur,
                    'modele'=>$modele,
                    'marque'=>$marque,
                    'energie'=>$energie,                    
                ];
            }
            return new JsonResponse($responseData, Response::HTTP_OK, []);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }

    
}
