<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Entity\Marque;
use App\Entity\Voiture;
use App\Entity\Covoiturages;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\CovoituragesRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;

class AdminController extends AbstractDashboardController
{
    #[Route('/admin', name: 'admin')]
    public function index(): Response
    {
        

        // Option 1. You can make your dashboard redirect to some common page of your backend
        //
        // $adminUrlGenerator = $this->container->get(AdminUrlGenerator::class);
        // return $this->redirect($adminUrlGenerator->setController(OneOfYourCrudController::class)->generateUrl());

        // Option 2. You can make your dashboard redirect to different pages depending on the user
        //
        // if ('jane' === $this->getUser()->getUsername()) {
        //     return $this->redirect('...');
        // }

        // Option 3. You can render some custom template to display a proper dashboard with widgets, etc.
        // (tip: it's easier if your template extends from @EasyAdmin/page/content.html.twig)
        //
        return $this->render('admin/index.html.twig');
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('ECFecoride');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkToCrud('Utilisateur', 'fas fa-list', User::class);
        yield MenuItem::linkToCrud('Covoiturages', 'fas fa-list', Covoiturages::class);
        yield MenuItem::linkToCrud('Voitures', 'fas fa-list', Voiture::class);
        yield MenuItem::linkToCrud('Marques', 'fas fa-list', Marque::class);
    }
    
    #[Route('/admin/covoiturages/stats', name: 'admin_covoiturages_stats')]
    public function stats(CovoituragesRepository $covoiturageRepository ,EntityManagerInterface $entityManager): JsonResponse
    {
        $conn = $entityManager->getConnection();

    // Nombre de covoiturages par jour
        $sqlCovoiturages = "
            SELECT DATE(c.date_depart) as date, COUNT(*) as count
            FROM covoiturages c
            WHERE c.is_active = 1
            GROUP BY DATE(c.date_depart)
            ORDER BY DATE(c.date_depart) ASC";
        
        $stmtCovoiturages = $conn->prepare($sqlCovoiturages);
        $resultCovoiturages = $stmtCovoiturages->executeQuery()->fetchAllAssociative();

        // Revenus de la plateforme par jour
        $sqlRevenues = "
            SELECT 
                DATE(c.date_depart) as date, 
                SUM(c.prix_personne * JSON_LENGTH(c.participant) + c.prix_personne) as revenue
            FROM 
                covoiturages c
            WHERE 
                c.is_active = 1
            GROUP BY 
                DATE(c.date_depart)
            ORDER BY 
                DATE(c.date_depart) ASC";
        
        $stmtRevenues = $conn->prepare($sqlRevenues);
        $resultRevenues = $stmtRevenues->executeQuery()->fetchAllAssociative();

    return new JsonResponse([
        'covoiturages' => $resultCovoiturages,
        'revenues' => $resultRevenues,
    ]);
    }
}
