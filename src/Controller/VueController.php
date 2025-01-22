<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class VueController extends AbstractController
{
    #[Route('/covoiturages', name: 'covoiturages')]
    public function index(): Response
    {
        return $this->render('covoiturages/index.html.twig', [
            'controller_name' => 'CovoituragesController',
        ]);
    }
}
