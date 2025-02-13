<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Covoiturages;
use App\Service\MailerService;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\CovoituragesRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;


final class DetailsController extends AbstractController
{
    #[Route('/details/{id}', name: 'app_details')]
    #[IsGranted('ROLE_USER')]
    public function index(int $id, CovoituragesRepository $covoituragesRepository): Response
    {
        // Récupération du covoiturage correspondant à l'ID
        $covoiturage = $covoituragesRepository->find($id);

        // Si le covoiturage n'est pas trouvé, retourner une erreur 404
        if (!$covoiturage) {
            throw $this->createNotFoundException('Covoiturage non trouvé.');
        }

       
        $user = $this->getUser();
        if (!$user || (!in_array('ROLE_PASSAGE', $user->getRoles()) && !in_array('ROLE_CONDUCTEUR', $user->getRoles()))) {
            // Rediriger vers la page "Espace Utilisateur" si l'utilisateur n'a pas les rôles nécessaires
            return $this->redirectToRoute('app_espace_utilisateur'); // Remplacer 'app_espace_utilisateur' par le nom de ta route
        }
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
    public function participate(int $id, EntityManagerInterface $entityManager , MailerService $mailer , UserRepository $userRepository): JsonResponse
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

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $userId]);
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        // Vérifier le crédit de l'utilisateur
        if ($user->getCredit() <= 0) {
            return new JsonResponse(['error' => 'Crédit insuffisant. Vous ne pouvez pas participer à ce covoiturage.'], 400);
        }
       
        
        // Ajouter l'utilisateur au tableau des participants
        $participants[] = $userId;
        $covoiturage->setParticipant($participants);

        $covoiturage->setNbPlace($placesRestantes - 1);
        // Sauvegarder les modifications
        $entityManager->flush();
        $mailer->sendCovoiturageParticipationEmail($covoiturage);
        // Retourner la réponse
        return new JsonResponse([
            'message' => 'Participation enregistrée avec succès',
 
        ]);
    }

    
    #[Route('/covoiturage/{id}/cancel', name: 'covoiturage_cancel', methods: ['POST'])]
    public function cancelParticipation(int $id, EntityManagerInterface $entityManager): JsonResponse
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

        // Vérifier si l'utilisateur est participant
        $participants = $covoiturage->getParticipant() ?? [];
        if (!in_array($userId, $participants)) {
            return new JsonResponse(['error' => 'Utilisateur non inscrit à ce covoiturage'], 400);
        }

        // Supprimer l'utilisateur du tableau des participants
        $participants = array_filter($participants, function ($participant) use ($userId) {
            return $participant !== $userId;
        });
        $covoiturage->setParticipant($participants);

        // Augmenter le nombre de places disponibles
        $covoiturage->setNbPlace($covoiturage->getNbPlace() + 1);

        // Sauvegarder les modifications
        $entityManager->flush();

        // Retourner la réponse
        return new JsonResponse([
            'message' => 'Participation annulée avec succès',
        ]);
    }

    #[Route('/credit/{id}/{covoituragesId}', name: 'credit', methods: ['POST'])]
    public function credit(int $id, int $covoituragesId, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'entité user avec l'ID passé dans la route
        $user = $entityManager->getRepository(User::class)->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'user introuvable'], 404);
        }

        // Récupérer l'entité Covoiturages avec l'ID passé dans la route
        $covoiturage = $entityManager->getRepository(Covoiturages::class)->find($covoituragesId);
        if (!$covoiturage) {
            return new JsonResponse(['error' => 'Covoiturage introuvable'], 404);
        }

        // Récupérer la valeur de prix_personne
        $prixPersonne = $covoiturage->getPrixPersonne();
        if ($prixPersonne === null) {
            return new JsonResponse(['error' => 'Le prix par personne n\'est pas défini'], 400);
        }

        // Crédits de l'utilisateur
        $user->setCredit($user->getCredit() - $prixPersonne);

        // Sauvegarder les changements dans la base de données
        $entityManager->flush();

        // Retourner la réponse
        return new JsonResponse([
            'message' => 'Paiement réussi !',
            'credits' => $user->getCredit() // Afficher les crédits actuels de l'utilisateur
        ]);
    }

    #[Route('/credit/{id}/{covoituragesId}/add', name: 'credit_add', methods: ['POST'])]
    public function creditAdd(int $id, int $covoituragesId, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'entité user avec l'ID passé dans la route
        $user = $entityManager->getRepository(User::class)->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'user introuvable'], 404);
        }

        // Récupérer l'entité Covoiturages avec l'ID passé dans la route
        $covoiturage = $entityManager->getRepository(Covoiturages::class)->find($covoituragesId);
        if (!$covoiturage) {
            return new JsonResponse(['error' => 'Covoiturage introuvable'], 404);
        }

        // Récupérer la valeur de prix_personne
        $prixPersonne = $covoiturage->getPrixPersonne();
        if ($prixPersonne === null) {
            return new JsonResponse(['error' => 'Le prix par personne n\'est pas défini'], 400);
        }

        // Crédits de l'utilisateur
        $user->setCredit($user->getCredit() + $prixPersonne);

        // Sauvegarder les changements dans la base de données
        $entityManager->flush();

        // Retourner la réponse
        return new JsonResponse([
            'message' => 'vous avez bien était rembourser !',
            'credits' => $user->getCredit() // Afficher les crédits actuels de l'utilisateur
        ]);
    }


}
