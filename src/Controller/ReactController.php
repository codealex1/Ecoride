<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ReactController extends AbstractController
{
    #[Route('/', name: 'app_react')]
    public function index(): Response
    {
        $user = $this->getUser();

        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
            'user' => $user,
        ]);
    }
    
}
