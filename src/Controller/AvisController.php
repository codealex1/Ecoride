<?php

namespace App\Controller;

use App\Repository\AvisRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/employe', name: 'app_employe')]
#[IsGranted('ROLE_EMPLOYE' )]
final class AvisController extends AbstractController
{
    #[Route('/avis', name: '_avis')]
    public function index(): Response
    {
        $user = $this->getUser();

        return $this->render('avis/index.html.twig', [
            'controller_name' => 'AvisController',
            'user' => $user,
        ]);
    }

    #[Route('/avis/all', name: '_all_avis', methods: ['GET'])]
    public function getAllAvis(AvisRepository $avisRepository): JsonResponse
    {
        // Récupérer tous les avis depuis la base de données
        $allAvis = $avisRepository->findAll();

        // Préparer les données pour la réponse JSON
        $avisData = array_map(function ($avis) {
            return [
                'id' => $avis->getId(),
                'commentaire' => $avis->getCommentaire(),
                'note' => $avis->getNote(),
                'statut' => $avis->isStatut(),
                'covoiturages_id' => $avis->getCovoituragesId() ? [
                        'id' => $avis->getCovoituragesId()->getId(),
                        'trajet' => $avis->getCovoituragesId()->getTrajet(),
                        'participant' => $avis->getCovoituragesId()->getParticipant(),
                    ] : null,
                'user_id' => $avis->getUser() ?[
                    'id'=> $avis->getUser()->getId(),
                    'pseudo'=> $avis->getUser()->getPseudo(),
                    'email' => $avis->getUser()->getUserIdentifier(),
                    
                    ] : null, // Supposons qu'il y a une relation avec l'utilisateur
            ];
        }, $allAvis);

        return new JsonResponse($avisData, Response::HTTP_OK);
    }
    #[Route('/avis/delete/{id}', name: '_delete_avis', methods: ['DELETE'])]
    public function deleteAvis(int $id, AvisRepository $avisRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $avis = $avisRepository->find($id);

        if (!$avis) {
            return new JsonResponse(['error' => 'Avis non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($avis);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Avis supprimé avec succès'], Response::HTTP_OK);
    }

    #[Route('/avis/update/{id}', name: '_update_avis', methods: ['PUT'])]
    public function updateAvis(int $id, Request $request, AvisRepository $avisRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $avis = $avisRepository->find($id);

        if (!$avis) {
            return new JsonResponse(['error' => 'Avis non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        

        if (isset($data['statut'])) {
            $avis->setStatut($data['statut']);
        }

        $entityManager->flush();

        return new JsonResponse(['message' => 'Avis mis à jour avec succès'], Response::HTTP_OK);
    }
}
