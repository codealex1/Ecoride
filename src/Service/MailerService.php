<?php

namespace App\Service ;

use App\Entity\Covoiturages;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\NotificationEmail;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class MailerService
{

    public function __construct
    (
        #[Autowire('%admin_email%')]private string $adminEmail
        ,private readonly MailerInterface $mailer,
        private readonly Security $security
        ) 
    { 
    }


    public function sendContactEmail(string $userName, string $userEmail, string $userMessage)
    {
        $email = (new NotificationEmail())
        ->from($this->adminEmail)
        ->to($this->adminEmail)
        ->subject("Nouveau message de contact")
        ->htmlTemplate('email/contact.html.twig')
        ->context([
            'user_name' => $userName,
            'user_email' => $userEmail,
            'user_message' => $userMessage,
        ]);

        $this->mailer->send($email);
    }


    
    public function sendCovoiturageParticipationEmail(Covoiturages $covoiturage)
    {
        // Récupérer l'utilisateur connecté
        $user = $this->security->getUser();
        if (!$user) {
            return; // L'utilisateur n'est pas connecté, ne pas envoyer d'e-mail
        }

        // Récupérer les détails du conducteur
        $conducteur = $covoiturage->getConducteur();
        if (!$conducteur) {
            return; // Pas de conducteur trouvé
        }

        // Créer l'email
        $email = (new NotificationEmail())
            ->from($this->adminEmail)
            ->to($user->getUserIdentifier()) // Envoyer à l'utilisateur connecté
            ->subject("Vous avez rejoint un covoiturage")
            ->htmlTemplate('email/covoiturage_participation.html.twig')
            ->context([
                
                'user_email' => $user->getUserIdentifier(),
                'conducteur_name' => $conducteur->getPseudo(),
                'conducteur_email' => $conducteur->getEmail(),
                'trajet' => $covoiturage->getTrajet(),
                'date_depart' => $covoiturage->getDateDepart()->format('d-m-Y'),
                'heure_depart' => $covoiturage->getHeureDepart(),
                'lieu_depart' => $covoiturage->getLieuDepart(),
                'date_arrivee' => $covoiturage->getDateArrivee()->format('d-m-Y'),
                'heure_arrivee' => $covoiturage->getHeureArrivee(),
                'lieu_arrivee' => $covoiturage->getLieuArrivee(),
            ]);

        $this->mailer->send($email);
    }


    public function sendCovoiturageAnnulationEmail(Covoiturages $covoiturage)
    {
        // Récupérer l'utilisateur connecté (conducteur)
        $conducteur = $covoiturage->getConducteur();
        if (!$conducteur) {
            return; // Pas de conducteur trouvé, ne pas envoyer d'e-mail
        }

        // Vérifier si des participants existent
        $participants = $covoiturage->getParticipant();
        if (empty($participants)) {
            return; // Aucun participant, ne rien faire
        }

        // Créer l'email de notification
        $subject = "Le covoiturage a été annulé";

        // Boucle à travers tous les participants pour envoyer un email
        foreach ($participants as $participantEmail) {
            // Créer l'email pour chaque participant
            $email = (new NotificationEmail())
                ->from($this->adminEmail)
                ->to($participantEmail) // Envoyer à l'email du participant
                ->subject($subject)
                ->htmlTemplate('email/covoiturage_annulation.html.twig')
                ->context([
                    'conducteur_name' => $conducteur->getPseudo(),
                    'conducteur_email' => $conducteur->getEmail(),
                    'trajet' => $covoiturage->getTrajet(),
                    'date_depart' => $covoiturage->getDateDepart()->format('d-m-Y'),
                    'heure_depart' => $covoiturage->getHeureDepart(),
                    'lieu_depart' => $covoiturage->getLieuDepart(),
                    'date_arrivee' => $covoiturage->getDateArrivee()->format('d-m-Y'),
                    'heure_arrivee' => $covoiturage->getHeureArrivee(),
                    'lieu_arrivee' => $covoiturage->getLieuArrivee(),
                ]);

            // Envoyer l'e-mail
            $this->mailer->send($email);
        }
    }


    public function sendCovoiturageDepartEmail(Covoiturages $covoiturage)
    {
        

        // Récupérer les détails du conducteur
        $conducteur = $covoiturage->getConducteur();
        if (!$conducteur) {
            return; // Pas de conducteur trouvé
        }


        // Vérifier si des participants existent
        $participants = $covoiturage->getParticipant();
        if (empty($participants)) {
            return; // Aucun participant, ne rien faire
        }
       // Créer l'email de notification
       $subject = "Le covoiturage a débuté";

       // Boucle à travers tous les participants pour envoyer un email
       foreach ($participants as $participantEmail) {
           // Créer l'email pour chaque participant
           $email = (new NotificationEmail())
               ->from($this->adminEmail)
               ->to($participantEmail) // Envoyer à l'email du participant
               ->subject($subject)
               ->htmlTemplate('email/covoiturage_depart.html.twig')
               ->context([
                    'email_participant'=>$participantEmail, 
                   'conducteur_name' => $conducteur->getPseudo(),
                   'conducteur_email' => $conducteur->getEmail(),
                   'trajet' => $covoiturage->getTrajet(),
                   'date_depart' => $covoiturage->getDateDepart()->format('d-m-Y'),
                   'heure_depart' => $covoiturage->getHeureDepart(),
                   'lieu_depart' => $covoiturage->getLieuDepart(),
                   'date_arrivee' => $covoiturage->getDateArrivee()->format('d-m-Y'),
                   'heure_arrivee' => $covoiturage->getHeureArrivee(),
                   'lieu_arrivee' => $covoiturage->getLieuArrivee(),
               ]);

           // Envoyer l'e-mail
           $this->mailer->send($email);
       }
    }

    public function sendCovoiturageFinEmail(Covoiturages $covoiturage)
    {
        

        // Récupérer les détails du conducteur
        $conducteur = $covoiturage->getConducteur();
        if (!$conducteur) {
            return; // Pas de conducteur trouvé
        }


        // Vérifier si des participants existent
        $participants = $covoiturage->getParticipant();
        if (empty($participants)) {
            return; // Aucun participant, ne rien faire
        }
       // Créer l'email de notification
       $subject = "Le covoiturage est terminé";

       // Boucle à travers tous les participants pour envoyer un email
       foreach ($participants as $participantEmail) {
           // Créer l'email pour chaque participant
           $email = (new NotificationEmail())
               ->from($this->adminEmail)
               ->to($participantEmail) // Envoyer à l'email du participant
               ->subject($subject)
               ->htmlTemplate('email/covoiturage_fin.html.twig')
               ->context([
                    'email_participant'=>$participantEmail, 
                   'conducteur_name' => $conducteur->getPseudo(),
                   'conducteur_email' => $conducteur->getEmail(),
                   'trajet' => $covoiturage->getTrajet(),
                   'date_depart' => $covoiturage->getDateDepart()->format('d-m-Y'),
                   'heure_depart' => $covoiturage->getHeureDepart(),
                   'lieu_depart' => $covoiturage->getLieuDepart(),
                   'date_arrivee' => $covoiturage->getDateArrivee()->format('d-m-Y'),
                   'heure_arrivee' => $covoiturage->getHeureArrivee(),
                   'lieu_arrivee' => $covoiturage->getLieuArrivee(),
               ]);

           // Envoyer l'e-mail
           $this->mailer->send($email);
       }
    }
}