<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use App\Security\LoginAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    )
    {
        
    }



    #[Route('/inscription', name: 'app_register' )]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, Security $security, EntityManagerInterface $entityManager): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var string $plainPassword */
            $plainPassword = $form->get('plainPassword')->getData();

            // encode the plain password
            $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));

            $user->setCredit(30);
            
            $user->setRoles(["ROLE_USER"]);
            $entityManager->persist($user);
            $entityManager->flush();

            // do anything else you need here, like send an email

            return new RedirectResponse($this->generateUrl('app_login'));
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form,
        ]);

        
    }
    #[Route('/user/update-role/{id}', name: 'update_user_role_1', methods: ['POST'])]
    
    public function updateRole(Request $request, UserRepository $userRepository, User $user): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérifiez si le rôle est valide
        $newRoles = $data['role'] ?? null;
        
        if ($newRoles && is_array($newRoles) && 
            in_array('ROLE_USER', $newRoles) && 
            in_array('ROLE_PASSAGE', $newRoles)) {

            // Ajoute les rôles ROLE_CONDUCTEUR et ROLE_PASSAGE à l'utilisateur
            $user->setRoles([ 'ROLE_PASSAGE' , "ROLE_USER"]);
            
            $this->entityManager->flush(); // Sauvegarde les modifications

            return new JsonResponse(['message' => 'Roles updated successfully']);
        }

        return new JsonResponse(['error' => 'Invalid role or missing role'], Response::HTTP_BAD_REQUEST);
    }

    #[Route('/user/update-role/2roles/{id}', name: 'update_user_role', methods: ['POST'])]
    public function updateRoleAll(Request $request, UserRepository $userRepository, User $user): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérifiez si le rôle est valide
        $newRoles = $data['role'] ?? null;
        
        if ($newRoles && is_array($newRoles) && 
            in_array('ROLE_CONDUCTEUR', $newRoles) && 
            in_array('ROLE_PASSAGE', $newRoles)) {

            // Ajoute les rôles ROLE_CONDUCTEUR et ROLE_PASSAGE à l'utilisateur
            $user->setRoles(['ROLE_CONDUCTEUR', 'ROLE_PASSAGE' , "ROLE_USER"]);
            
            $this->entityManager->flush(); // Sauvegarde les modifications

            return new JsonResponse(['message' => 'Roles updated successfully']);
        }

        return new JsonResponse(['error' => 'Invalid roles or missing roles'], Response::HTTP_BAD_REQUEST);
    }

}
