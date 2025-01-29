<?php

namespace App\Controller;


use App\Repository\UserRepository;
use App\Repository\CovoituragesRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


#[Route('/covoiturages', name: 'covoiturages')]
final class VueController extends AbstractController
{
    public function __construct(
       
       private CovoituragesRepository $repository
      ,private UserRepository $UserRepository
      )
      {
      }
    #[Route('/{id}', name: 'show', methods: 'GET')]
    public function show(int $id): JsonResponse
    {

        $user = $this->UserRepository->findOneBy(['id' => $id]);

        $covoiturages = $this->repository->findOneBy(['id' => $id]);

        
       
        if ($covoiturages) {

            $conducteur = $covoiturages->getConducteur(); // Supposons qu'il y ait une relation définie dans l'entité Covoiturage
            $prenomConducteur = $conducteur ? $conducteur->getPseudo() : null; 
    
            $vehicule = $covoiturages->getVoiture();
            $modele = $vehicule ? $vehicule->getModele() : null;

            $energie = $vehicule ? $vehicule->getEnergie() : null;
            $marque = $vehicule && $vehicule->getMarque() ? $vehicule->getMarque()->getLibelle() : null;
            
            // Récupérer les avis du conducteur depuis l'entité User
            $avisConducteur = $conducteur ? $conducteur->getAvis() : [];

            // Préparer un tableau pour stocker les avis et calculer la moyenne des notes
            $avisData = [];
            $totalNotes = 0;
            $noteCount = 0;

            // Récupérer les informations de chaque avis
            foreach ($avisConducteur as $avis) {
                if ($avis->isStatut() === true) {
                $avisData[] = [
                    'commentaire' => $avis->getCommentaire(),
                    'note' => $avis->getNote(),
                ];

                // Ajouter la note à la somme totale pour calculer la moyenne
                if ($avis->getNote()) {
                    $totalNotes += (int) $avis->getNote();
                    $noteCount++;
                }
            }
            }

            // Calculer la moyenne des notes
            $moyenneNote = $noteCount > 0 ? $totalNotes / $noteCount : null;


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
                'is_active' => $covoiturages->IsActive(),
                'preferences'=>$covoiturages->getPreferences(),
                'conducteur' => $prenomConducteur,
                'modele' => $modele,
                'marque' => $marque,
                'energie' => $energie,
                'avis_conducteur' => $avisData,
                'moyenne_note_conducteur' => $moyenneNote,
                
            ];
            return new JsonResponse($responseData, Response::HTTP_OK, []);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }


    #[Route('', name: 'covoiturages')]
    public function index(): Response
    {
        return $this->render('covoiturages/index.html.twig', [
            'controller_name' => 'CovoituragesController',
        ]);
    }
}
