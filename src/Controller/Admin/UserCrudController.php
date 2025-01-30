<?php

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCrudController extends AbstractCrudController
{
   

    
    public static function getEntityFqcn(): string
    {
        return User::class ;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
        ->setEntityLabelInPlural('Utilisateurs')
        ->setEntityLabelInSingular('Utilisateur')

        ->setPageTitle("index", "EcoRide - Administration des utilisateurs")
        
        ->setPaginatorPageSize(10)
        ->setHelp('index', 'Lors de la création d un utilisateur depuis cette interface , l administrateur doit hasher manuellement le mot de passe ');// Ajoutez votre texte explicatif ici
    }
    public function configureFields(string $pageName): iterable
    {
        
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('email'),
            TextField::new('Nom'),
            TextField::new('Prenom'),
            TextField::new('password') // Utiliser TextField pour le mot de passe
            ->setRequired(true) // Rendre ce champ requis
            ->setHelp('Entrez un mot de passe fort.')
            ->setFormTypeOption('attr', ['type' => 'password']), // Définir le type HTML sur password
            ChoiceField::new('roles')
                ->setChoices([
                    'Utilisateur ' => 'ROLE_USER',
                    'Admin' => 'ROLE_ADMIN',
                    'Conducteur' => 'ROLE_CONDUCTEUR',
                    'Passagé' => 'ROLE_PASSAGE',
                    'Employé' => 'ROLE_EMPLOYE',
                    // Ajoutez d'autres rôles si nécessaire
                ])
                ->allowMultipleChoices() // Permet de sélectionner plusieurs rôles
                ->setRequired(false), // Rendre ce champ non requis si nécessaire
            // Ajoutez d'autres champs si nécessaire
            TextField::new('adresse'),
            TextField::new('date_naissance'),
            TextField::new('pseudo'),
            
        ];
    }
    
}
