<?php

namespace App\Controller\Admin;

use App\Entity\Voiture;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;


class VoitureCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Voiture::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('modele', 'Modèle'),
            TextField::new('immatriculation', 'Immatriculation'),
            TextField::new('energie', 'Énergie'),
            TextField::new('couleur', 'Couleur'),
            TextField::new('date_premiere_imma', 'Date Première Immatriculation'),
            AssociationField::new('marque', 'Marque'), 
            AssociationField::new('propriétaire_id', 'Propriétaire'),// Relation Many-to-One avec Marque
        ];
    }
    
}
