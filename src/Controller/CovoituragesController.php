<?php

namespace App\Controller;

use App\Entity\Covoiturages;
use App\Service\MailerService;
use App\Repository\UserRepository;
use App\Repository\MarqueRepository;
use App\Repository\VoitureRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\CovoituragesRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints\Date;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/covoiturages', name: 'app_covoiturages_')]
final class CovoituragesController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $manager
      , private CovoituragesRepository $repository
      , private VoitureRepository $voitureRepository
      , private MarqueRepository $marqueRepository
      , private UserRepository $userRepository
      , private SerializerInterface $serializer
      , private UrlGeneratorInterface $urlGenerator
  
      )
      {
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
    public function searchCovoiturages(string $depart, string $arrivee, string $date): JsonResponse
    {
        // Logique pour récupérer les covoiturages en fonction des paramètres, avec un filtre sur 'IsActive'
        $covoiturages = $this->repository->findBy([
            'lieu_depart' => $depart,
            'lieu_arrivee' => $arrivee,
            'date_depart' => new \DateTime($date), // Conversion de la chaîne de date en objet DateTime
            'IsActive' => true // Filtrer uniquement les covoiturages actifs
        ]);

        if ($covoiturages) {
            $responseData = [];
            foreach ($covoiturages as $covoiturage) {
                $conducteur = $covoiturage->getConducteur(); // Supposons qu'il y ait une relation définie dans l'entité Covoiturage
                $prenomConducteur = $conducteur ? $conducteur->getPseudo() : null; // Récupérer le prénom si le conducteur existe

                $vehicule = $covoiturage->getVoiture();
                $modele = $vehicule ? $vehicule->getModele() : null;

                $energie = $vehicule ? $vehicule->getEnergie() : null;
                $marque = $vehicule && $vehicule->getMarque() ? $vehicule->getMarque()->getLibelle() : null;

                $responseData[] = [
                    'id'=>$covoiturage->getId(),
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
                    'modele' => $modele,
                    'marque' => $marque,
                    'energie' => $energie,
                ];
            }
            return new JsonResponse($responseData, Response::HTTP_OK, []);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }


    
    #[Route('/add', name: 'add', methods: ['POST'])]
    public function add(Request $request, UserRepository $userRepository, VoitureRepository $voitureRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Validation des champs requis
        $requiredFields = ['trajet', 'duree', 'date_depart', 'heure_depart', 'lieu_depart', 'date_arrivee', 'heure_arrivee', 'lieu_arrivee', 'nb_place', 'prix_personne', 'conducteur_id', 'voiture_id'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                return new JsonResponse(['error' => "Le champ $field est requis"], JsonResponse::HTTP_BAD_REQUEST);
            }
        }

        // Création d'une nouvelle instance de Covoiturages
        $covoiturage = new Covoiturages();
        $covoiturage->setTrajet($data['trajet']);
        $covoiturage->setDuree($data['duree']);
        $covoiturage->setDateDepart(new \DateTime($data['date_depart']));
        $covoiturage->setHeureDepart($data['heure_depart']);
        $covoiturage->setLieuDepart($data['lieu_depart']);
        $covoiturage->setDateArrivee(new \DateTime($data['date_arrivee']));
        $covoiturage->setHeureArrivee($data['heure_arrivee']);
        $covoiturage->setLieuArrivee($data['lieu_arrivee']);
        $covoiturage->setNbPlace((int)$data['nb_place']);
        $covoiturage->setPrixPersonne((float)$data['prix_personne']);
        $covoiturage->setPreferences((float)$data['preferences']);

        // Récupérer le conducteur
        $conducteur = $userRepository->find($data['conducteur_id']);
        if (!$conducteur) {
            return new JsonResponse(['error' => 'Conducteur non trouvé'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $covoiturage->setConducteur($conducteur);

        // Récupérer la voiture
        $voiture = $voitureRepository->find($data['voiture_id']);
        if (!$voiture) {
            return new JsonResponse(['error' => 'Voiture non trouvée'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $covoiturage->setVoiture($voiture);

        // Sauvegarder dans la base de données
        $this->manager->persist($covoiturage);
        $this->manager->flush();

        return new JsonResponse(['message' => 'Covoiturage ajouté avec succès', 'id' => $covoiturage->getId()], JsonResponse::HTTP_CREATED);
    }
    

    
        
    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id , MailerService $mailer): JsonResponse
    {
        // Rechercher le covoiturage à supprimer
        $covoiturage = $this->repository->find($id);
        $mailer->sendCovoiturageAnnulationEmail($covoiturage);
        // Vérifier si le covoiturage existe
        if (!$covoiturage) {
            return new JsonResponse(['error' => 'Covoiturage non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Supprimer les avis associés avant de supprimer le covoiturage
        foreach ($covoiturage->getAvis() as $avis) {
            $this->manager->remove($avis); // Supprimer chaque avis
        }

        try {
            // Supprimer le covoiturage
            $this->manager->remove($covoiturage);
            $this->manager->flush();

            return new JsonResponse(['message' => 'Covoiturage supprimé avec succès'], Response::HTTP_OK);
        } catch (\Exception $e) {
            // En cas d'erreur lors de la suppression
            return new JsonResponse(['error' => 'Erreur lors de la suppression du covoiturage'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    #[Route('/{id}/activate', name: 'activate_covoiturage', methods: ['POST'])]
    public function activateCovoiturage(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupération du covoiturage
        $covoiturage = $entityManager->getRepository(Covoiturages::class)->find($id);

        if (!$covoiturage) {
            return new JsonResponse(['error' => 'Covoiturage not found'], 404);
        }

        // Récupération de l'utilisateur (conducteur) du covoiturage
        $conducteur = $covoiturage->getConducteur();
        
        // Vérifier si l'utilisateur existe et possède des crédit
        if (!$conducteur || $conducteur->getCredit() === null || $conducteur->getCredit() < 2) {
            return new JsonResponse(['error' => 'Not enough credits or user not found'], 400);
        }

        // Retirer 2 crédits à l'utilisateur
        $currentCredits = $conducteur->getCredit();
        $conducteur->setCredit($currentCredits - 2);

        // Mettre à jour le covoiturage pour le rendre actif
        $covoiturage->setIsActive(true);

        // Enregistrer les modification dans la base de données
        $entityManager->flush();

        // Retourner la réponse avec les crédit restants
        return new JsonResponse([
            'success' => 'Covoiturage activated successfully',
            'remaining_credits' => $conducteur->getCredit(),
            'is_active' => $covoiturage->IsActive()
        ]);
    }


    #[Route('/{id}/deactivate', name: 'deactivate_covoiturage', methods: ['POST'])]
    public function deactivateCovoiturage(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer le covoiturage
        $covoiturage = $entityManager->getRepository(Covoiturages::class)->find($id);

        if (!$covoiturage) {
            return new JsonResponse(['error' => 'Covoiturage not found'], 404);
        }

        // Récupérer le conducteur de ce covoiturage
        $conducteur = $covoiturage->getConducteur();
        
        // Vérifier si l'utilisateur existe
        if (!$conducteur) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        // Récupérer les crédits de l'utilisateur et ajouter 2 crédits
        $currentCredits = $conducteur->getCredit();
        $conducteur->setCredit($currentCredits + 2);

        // Désactiver le covoiturage
        $covoiturage->setIsActive(false);

        // Sauvegarder les changements dans la base de données
        $entityManager->flush();

        // Retourner la réponse avec les crédits restants
        return new JsonResponse([
            'success' => 'Covoiturage deactivated successfully',
            'remaining_credits' => $conducteur->getCredit(),
            'is_active' => $covoiturage->IsActive()
        ]);
    }



    #[Route('/participations', name: 'participations', methods: 'GET')]
    public function participations(Security $security): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }
    
        // Récupérer l'email (ou tout autre identifiant) de l'utilisateur
        $userEmail = $user->getUserIdentifier();
    
        // Récupérer tous les covoiturages
        $covoiturages = $this->repository->findAll();
    
        // Filtrer les covoiturages auxquels l'utilisateur participe
        $filteredCovoiturages = array_filter($covoiturages, function ($covoiturage) use ($userEmail) {
            $participants = $covoiturage->getParticipant() ?? [];
            return in_array($userEmail, $participants);
        });
    
        // Ajouter des données supplémentaires aux objets de covoiturages
        $responseData = [];
        foreach ($filteredCovoiturages as $covoiturage) {
            $conducteur = $covoiturage->getConducteur();
            $prenomConducteur = $conducteur ? $conducteur->getPseudo() : null;
    
            $vehicule = $covoiturage->getVoiture();
            $modele = $vehicule ? $vehicule->getModele() : null;
            $energie = $vehicule ? $vehicule->getEnergie() : null;
            $marque = $vehicule && $vehicule->getMarque() ? $vehicule->getMarque()->getLibelle() : null;
    
            $responseData[] = [
                'id' => $covoiturage->getId(),
                'trajet' => $covoiturage->getTrajet(),
                'date_depart' => $covoiturage->getDateDepart()?->format('Y-m-d'),
                'heure_depart' => $covoiturage->getHeureDepart(),
                'lieu_depart' => $covoiturage->getLieuDepart(),
                'date_arrivee' => $covoiturage->getDateArrivee()?->format('Y-m-d'),
                'heure_arrivee' => $covoiturage->getHeureArrivee(),
                'lieu_arrivee' => $covoiturage->getLieuArrivee(),
                'duree' => $covoiturage->getDuree(),
                'nb_place' => $covoiturage->getNbPlace(),
                'prix_personne' => $covoiturage->getPrixPersonne(),
                'is_active' => $covoiturage->isActive(),
                'preference' => $covoiturage->getPreferences(),
                'participant' => $covoiturage->getParticipant(),
                'conducteur' => $prenomConducteur,
                'modele' => $modele,
                'marque' => $marque,
                'energie' => $energie,
            ];
        }
    
        // Retourner les données en JSON
        return new JsonResponse($responseData, Response::HTTP_OK);
    }

    #[Route('/{id}/start', name: 'start', methods: 'POST')]
    public function startAction($id, EntityManagerInterface $em  , MailerService $mailer)
    {

        // Récupérer le covoiturage par ID
        $covoiturage = $em->getRepository(Covoiturages::class)->find($id);

        if (!$covoiturage) {
            return new JsonResponse(['error' => 'Covoiturage non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Vérifier si le covoiturage est déjà démarré
        if ($covoiturage->IsStarted()) {
            return new JsonResponse(['error' => 'Le covoiturage a déjà démarré'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $mailer->sendCovoiturageDepartEmail($covoiturage);
        // Démarrer le covoiturage (mettre à jour le champ isStarted)
        $covoiturage->setIsStarted(true);
        $em->flush();

        return new JsonResponse(['success' => 'Covoiturage démarré avec succès']);
    }

    
    #[Route('/{id}/finish', name: 'finish', methods: 'POST')]
    public function finishAction($id, EntityManagerInterface $em  , MailerService $mailer)
    {
        // Récupérer le covoiturage par ID
        $covoiturage = $em->getRepository(Covoiturages::class)->find($id);

        if (!$covoiturage) {
            return new JsonResponse(['error' => 'Covoiturage non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Vérifier si le covoiturage a déjà été terminé
        if ($covoiturage->IsStarted() === null) {
            return new JsonResponse(['error' => 'Le covoiturage est déjà terminé'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $mailer->sendCovoiturageFinEmail($covoiturage);

        // Supprimer le covoiturage de la base de données
        $em->remove($covoiturage);
        $em->flush();

        return new JsonResponse(['success' => 'Covoiturage terminé et supprimé avec succès']);
    }
    
}
