<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class EspaceUtilisateurController extends AbstractController
{

    #[Route('/credit-user', name: 'credit_user')]
    public function creditUser(EntityManagerInterface $entityManager): Response
    {
        // Récupérez l'utilisateur connecté
        $user = $this->getUser(); // Cette méthode renvoie l'utilisateur connecté

        // Vérifiez si l'utilisateur est connecté et s'il est une instance de User
        if ($user instanceof User) {
            // Si l'utilisateur n'a pas de crédit défini, initialisez-le à 0
            if ($user->getCredit() === null) {
                $user->setCredit(0); // Initialisation du crédit à 0 si non défini
            }

            // Incrémentez le crédit de 1
            $user->setCredit($user->getCredit() + 10);

            // Sauvegarder la mise à jour dans la base de données
            $entityManager->flush();

            // Retourner une réponse confirmant l'action
            return new Response('L utilisateur a été crédité dun crédit.');
        }

        // Si l'utilisateur n'est pas connecté
        return new Response('Aucun utilisateur connecté.');
    }

    #[Route('/EspaceUtilisateur', name: 'app_espace_utilisateur')]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function index(): Response
    {

        $user = $this->getUser();

        return $this->render('espace_utilisateur/index.html.twig', [
            'controller_name' => 'EspaceUtilisateurController',
            'user' => $user,
        ]);
    }
}
