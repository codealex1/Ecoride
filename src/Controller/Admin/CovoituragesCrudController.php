<?php

namespace App\Controller\Admin;

use App\Entity\Covoiturages;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;

class CovoituragesCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Covoiturages::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            AssociationField::new('conducteur', 'Conducteur'), // Relation Many-to-One avec Marque
            AssociationField::new('voiture', 'Voiture'), // Relation Many-to-One avec Marque
            TextField::new('trajet', 'Trajet'),
            TextField::new('duree', 'Durée'),
            DateField::new('date_depart', 'Date de départ'),
            DateField::new('date_arrivee', 'Date d\'arrivée'),
            TextField::new('heure_depart', 'Heure de départ'),
            TextField::new('lieu_depart', 'Lieu de départ'),
            TextField::new('heure_arrivee', 'heure d\'arrivée'),
            TextField::new('lieu_arrivee', 'Lieu d\'arrivée'),
            NumberField::new('nb_place', 'Nombre de places'),
            NumberField::new('prix_personne', 'Prix par personne'),
            
        ];
    }
    
}
