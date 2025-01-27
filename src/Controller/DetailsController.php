<?php

namespace App\Controller;

use App\Entity\Covoiturages;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\CovoituragesRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



final class DetailsController extends AbstractController
{
    #[Route('/details/{id}', name: 'app_details')]
    public function index(int $id, CovoituragesRepository $covoituragesRepository): Response
    {
        // Récupération du covoiturage correspondant à l'ID
        $covoiturage = $covoituragesRepository->find($id);

        // Si le covoiturage n'est pas trouvé, retourner une erreur 404
        if (!$covoiturage) {
            throw $this->createNotFoundException('Covoiturage non trouvé.');
        }
        $user = $this->getUser();
        // Passer les données du covoiturage à la vue
        return $this->render('details/index.html.twig', [
            'covoiturage' => $covoiturage,
            'user'=>$user,
            'covoiturage_id' => $id,
        ]);
    }

   
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    #[Route('/covoiturage/{id}/participate', name: 'covoiturage_participate', methods: ['POST'])]
    public function participate(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
        }

        $userId = $user->getUserIdentifier(); // Obtenir l'ID de l'utilisateur connecté

        // Récupérer le covoiturage depuis la base de données
        $covoiturage = $entityManager->getRepository(Covoiturages::class)->find($id);
        if (!$covoiturage) {
            return new JsonResponse(['error' => 'Covoiturage introuvable'], 404);
        }

        // Vérifier si l'utilisateur est déjà participant
        $participants = $covoiturage->getParticipant() ?? [];
        if (in_array($userId, $participants)) {
            return new JsonResponse(['error' => 'Utilisateur déjà inscrit'], 400);
        }

        // Vérifier le nombre de places restantes
        $placesRestantes = $covoiturage->getNbPlace() - count($participants);
        if ($placesRestantes <= 0) {
            return new JsonResponse(['error' => 'Aucune place disponible'], 400);
        }

        // Ajouter l'utilisateur au tableau des participants
        $participants[] = $userId;
        $covoiturage->setParticipant($participants);

        $covoiturage->setNbPlace($placesRestantes - 1);
        // Sauvegarder les modifications
        $entityManager->flush();

        // Retourner la réponse
        return new JsonResponse([
            'message' => 'Participation enregistrée avec succès',
            
        ]);
    }
}
