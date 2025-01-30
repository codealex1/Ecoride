<?php

namespace App\Controller;
use App\Entity\User;
use App\Entity\Avis;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\CovoituragesRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class CommentaireController extends AbstractController
{
    #[Route('/commentaire/{id}', name: 'app_commentaire')]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function index(int $id , CovoituragesRepository $covoituragesRepository): Response
    {

        $user = $this->getUser();
         // Récupération du covoiturage correspondant à l'ID
         $covoiturage = $covoituragesRepository->find($id);

         // Si le covoiturage n'est pas trouvé, retourner une erreur 404
         if (!$covoiturage) {
             throw $this->createNotFoundException('Covoiturage non trouvé.');
         }

        return $this->render('commentaire/index.html.twig', [
            'covoiturage' => $covoiturage,
            'user'=>$user,
            'covoiturage_id' => $id,
        ]);
    }

    #[Route('/commentaire/ajouter/{id}', name: 'app_commentaire_ajouter', methods: ['POST'])]
    public function ajouterAvis(
        int $id, 
        Request $request, 
        EntityManagerInterface $entityManager, 
        CovoituragesRepository $covoituragesRepository
    ): JsonResponse {
        $user = $this->getUser();

    // Vérifier si l'utilisateur est connecté
    if (!$user) {
        return new JsonResponse(['error' => 'Utilisateur non authentifié'], 403);
    }

    // Récupérer le covoiturage correspondant à l'ID dans l'URL
    $covoiturage = $covoituragesRepository->find($id);
    if (!$covoiturage) {
        return new JsonResponse(['error' => 'Covoiturage non trouvé'], 404);
    }

    // Récupérer les données envoyées en JSON
    $data = json_decode($request->getContent(), true);

    // Vérifier si les champs nécessaires sont présents
    if (!isset($data['commentaire'], $data['note'])) {
        return new JsonResponse(['error' => 'Données incomplètes'], 400);
    }

    // Création de l'objet Avis
    $avis = new Avis();
    $avis->setCommentaire($data['commentaire']);
    $avis->setNote($data['note']);
    $avis->setStatut(true); // Statut par défaut actif
    $avis->setUser($covoiturage->getConducteur()); 
    $avis->setCovoituragesId($covoiturage); // Associer le covoiturage

    // Enregistrement en base de données
    $entityManager->persist($avis);
    $entityManager->flush();

    return new JsonResponse(['success' => 'Avis ajouté avec succès'], 201);
}

}
