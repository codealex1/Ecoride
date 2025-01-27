<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Marque;
use App\Entity\Voiture;
use App\Repository\CovoituragesRepository;
use App\Repository\MarqueRepository;
use App\Repository\UserRepository;
use App\Repository\VoitureRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/voiture', name: 'app_voiture_')]
final class VoitureController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $manager
      , private VoitureRepository $repository
      , private MarqueRepository $marquerepo
      , private CovoituragesRepository $covoituragesRepository
      , private UserRepository $userRepository
      , private SerializerInterface $serializer
      , private UrlGeneratorInterface $urlGenerator
  
      )
      {
      }
    #[Route('/{id}', name: 'show', methods: 'GET')]
    public function show(int $id): JsonResponse
    {
        $voiture = $this->repository->findOneBy(['id' => $id]);
        if ($voiture) {

            $marque = $voiture->getMarque();
            $marqueData = $marque ? [
                'marque' => $marque->getLibelle(), // Adaptez selon les champs de l'entité Marque
            ] : null;

            $responseData = [
                'modele' => $voiture->getModele(),
                'immatriculation' => $voiture->getImmatriculation(),
                'couleur' => $voiture->getCouleur(),
                'marque' => $marqueData,
            ];
            return new JsonResponse($responseData, Response::HTTP_OK, []);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }

    #[Route('/add', name: 'add_voiture', methods: ['POST'])]
    public function addVoiture(Request $request, EntityManagerInterface $entityManager): Response
    {
        
        // Récupération des données envoyées
        $data = json_decode($request->getContent(), true);

        // Vérifier si les champs nécessaires sont fournis
        if (empty($data['modele']) || empty($data['immatriculation']) || empty($data['energie']) ||
            empty($data['marque_id']) || empty($data['proprietaire_id'])) {
            return $this->json([
                'error' => 'Tous les champs obligatoires doivent être fournis.',
                'required_fields' => ['modele', 'immatriculation', 'energie'],
            ], Response::HTTP_BAD_REQUEST);
        }

        // Créer une nouvelle entité Voiture
        $voiture = new Voiture();
        $voiture->setModele($data['modele'])
                ->setImmatriculation($data['immatriculation'])
                ->setEnergie($data['energie'])
                ->setCouleur($data['couleur'] ?? '') // Optionnel
                ->setDatePremiereImma($data['date_premiere_imma'] ?? ''); // Optionnel

        // Récupérer l'entité Marque (relation Many-to-One)
        $marque = $entityManager->getRepository(Marque::class)->find($data['marque_id']);
        if (!$marque) {
            return $this->json([
                'error' => 'La marque spécifiée est introuvable.',
            ], Response::HTTP_BAD_REQUEST);
        }
        $voiture->setMarque($marque);
        
                // Récupérer l'entité User (relation Many-to-One)
        $proprietaire = $entityManager->getRepository(User::class)->find($data['proprietaire_id']);
        if (!$proprietaire) {
            return $this->json([
                'error' => 'Le propriétaire spécifié est introuvable.',
            ], Response::HTTP_BAD_REQUEST);
        }
        $voiture->setPropriétaire($proprietaire);
        


        // Persister et enregistrer dans la base de données
        $entityManager->persist($voiture);
        $entityManager->flush();

        
        // Retourner une réponse JSON avec succès
        return $this->json([
            'message' => 'Voiture ajoutée avec succès.',
            'voiture_id' => $voiture->getId(),
            
        ], Response::HTTP_CREATED);
    }

    #[Route('/conducteur/{id}', name: 'user_cars', methods: 'GET')]
    public function getUserCars(int $id): JsonResponse
    {
        $user = $this->userRepository->findOneBy(['id' =>$id]);
       
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer toutes les voitures de cet utilisateur
        $voitures = $this->repository->findBy(['Propriétaire' => $user]);

        $voituresData = [];
        foreach ($voitures as $voiture) {
            $marque = $voiture->getMarque();
            $marqueData = $marque ? $marque->getLibelle() : null;

            $voituresData[] = [
                'id' => $voiture->getId(),
                'modele' => $voiture->getModele(),
                'immatriculation' => $voiture->getImmatriculation(),
                'couleur' => $voiture->getCouleur(),
                'energie' => $voiture->getEnergie(),
                'marque' => $marqueData,
            ];
        }

        return new JsonResponse($voituresData, Response::HTTP_OK);
    }
    
    #[Route('/{id}', name: 'delete', methods: 'DELETE')]
    public function delete(int $id): JsonResponse
    {
        // Récupérer la voiture par son ID
        $voiture = $this->repository->find($id);

        if (!$voiture) {
            return new JsonResponse(['error' => 'Voiture non trouvée'], Response::HTTP_NOT_FOUND);
        }

        // Supprimer la voiture de la base de données
        $this->manager->remove($voiture);
        $this->manager->flush();

        // Retourner une réponse JSON avec succès
        return new JsonResponse(['message' => 'Voiture supprimée avec succès'], Response::HTTP_OK);
    }

    #[Route('/driver/{id}', name: 'user_covoiturages', methods: 'GET')]
    public function getUserCovoiturages(int $id): JsonResponse
    {
        // Récupérer l'utilisateur par son ID
        $user = $this->userRepository->findOneBy(['id' => $id]);
    
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }
    
       
    
        // Récupérer tous les covoiturages
        $allCovoiturages = $this->covoituragesRepository->findAll();
    
       
    
       
    
        // Préparer les données à retourner
        $covoituragesData = [];
        foreach ($allCovoiturages as $covoiturage) {
            $covoituragesData[] = [
                'id' => $covoiturage->getId(),
                'trajet' => $covoiturage->getTrajet(),
                'duree' => $covoiturage->getDuree(),
                'date_depart' => $covoiturage->getDateDepart()?->format('Y-m-d'),
                'heure_depart' => $covoiturage->getHeureDepart(),
                'lieu_depart' => $covoiturage->getLieuDepart(),
                'date_arrivee' => $covoiturage->getDateArrivee()?->format('Y-m-d'),
                'heure_arrivee' => $covoiturage->getHeureArrivee(),
                'lieu_arrivee' => $covoiturage->getLieuArrivee(),
                'nb_place' => $covoiturage->getNbPlace(),
                'prix_personne' => $covoiturage->getPrixPersonne(),
                'is_active' => $covoiturage->IsActive(),
            ];
        }
    
        return new JsonResponse($covoituragesData, Response::HTTP_OK);
    }
    
    
}
