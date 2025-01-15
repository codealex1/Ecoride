<?php

namespace App\Controller;

use App\Entity\Voiture;
use App\Repository\MarqueRepository;
use App\Repository\VoitureRepository;
use Doctrine\ORM\EntityManagerInterface;
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
}
