<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class EspaceUtilisateurController extends AbstractController
{
    #[Route('/EspaceUtilisateur', name: 'app_espace_utilisateur')]
    public function index(): Response
    {

        $user = $this->getUser();

        return $this->render('espace_utilisateur/index.html.twig', [
            'controller_name' => 'EspaceUtilisateurController',
            'user' => $user,
        ]);
    }
}
