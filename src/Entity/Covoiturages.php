<?php

namespace App\Entity;

use App\Repository\CovoituragesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CovoituragesRepository::class)]
class Covoiturages
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    

    #[ORM\Column(length: 255)]
    private ?string $trajet = null;

    #[ORM\Column(length: 255)]
    private ?string $duree = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date_depart = null;

    #[ORM\Column(length: 255)]
    private ?string $heure_depart = null;

    #[ORM\Column(length: 255)]
    private ?string $lieu_depart = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date_arrivee = null;

    #[ORM\Column(length: 255)]
    private ?string $heure_arrivee = null;

    #[ORM\Column(length: 255)]
    private ?string $lieu_arrivee = null;

    #[ORM\Column]
    private ?int $nb_place = null;

    #[ORM\Column]
    private ?float $prix_personne = null;

    #[ORM\ManyToOne(inversedBy: 'covoiturages')]
    private ?User $conducteur = null;

    #[ORM\ManyToOne(inversedBy: 'covoiturages')]
    private ?Voiture $voiture = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $participant = null;

    #[ORM\Column(nullable: true)]
    private ?bool $IsActive = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $preferences = null;

    /**
     * @var Collection<int, Avis>
     */
    #[ORM\OneToMany(targetEntity: Avis::class, mappedBy: 'covoiturages_id', cascade: ['remove'])]
    private Collection $avis;

    #[ORM\Column(nullable: true)]
    private ?bool $IsStarted = null;

    public function __construct()
    {
        $this->avis = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    

    public function getTrajet(): ?string
    {
        return $this->trajet;
    }

    public function setTrajet(string $trajet): static
    {
        $this->trajet = $trajet;

        return $this;
    }

    public function getDuree(): ?string
    {
        return $this->duree;
    }

    public function setDuree(string $duree): static
    {
        $this->duree = $duree;

        return $this;
    }

    public function getDateDepart(): ?\DateTimeInterface
    {
        return $this->date_depart;
    }

    public function setDateDepart(\DateTimeInterface $date_depart): static
    {
        $this->date_depart = $date_depart;

        return $this;
    }

    public function getHeureDepart(): ?string
    {
        return $this->heure_depart;
    }

    public function setHeureDepart(string $heure_depart): static
    {
        $this->heure_depart = $heure_depart;

        return $this;
    }

    public function getLieuDepart(): ?string
    {
        return $this->lieu_depart;
    }

    public function setLieuDepart(string $lieu_depart): static
    {
        $this->lieu_depart = $lieu_depart;

        return $this;
    }

    public function getDateArrivee(): ?\DateTimeInterface
    {
        return $this->date_arrivee;
    }

    public function setDateArrivee(\DateTimeInterface $date_arrivee): static
    {
        $this->date_arrivee = $date_arrivee;

        return $this;
    }

    public function getHeureArrivee(): ?string
    {
        return $this->heure_arrivee;
    }

    public function setHeureArrivee(string $heure_arrivee): static
    {
        $this->heure_arrivee = $heure_arrivee;

        return $this;
    }

    public function getLieuArrivee(): ?string
    {
        return $this->lieu_arrivee;
    }

    public function setLieuArrivee(string $lieu_arrivee): static
    {
        $this->lieu_arrivee = $lieu_arrivee;

        return $this;
    }

    public function getNbPlace(): ?int
    {
        return $this->nb_place;
    }

    public function setNbPlace(int $nb_place): static
    {
        $this->nb_place = $nb_place;

        return $this;
    }

    public function getPrixPersonne(): ?float
    {
        return $this->prix_personne;
    }

    public function setPrixPersonne(float $prix_personne): static
    {
        $this->prix_personne = $prix_personne;

        return $this;
    }

    public function getConducteur(): ?User
    {
        return $this->conducteur;
    }

    public function setConducteur(?User $conducteur): static
    {
        $this->conducteur = $conducteur;

        return $this;
    }

    public function getVoiture(): ?Voiture
    {
        return $this->voiture;
    }

    public function setVoiture(?Voiture $voiture): static
    {
        $this->voiture = $voiture;

        return $this;
    }

    public function getParticipant(): ?array
    {
        return $this->participant;
    }

    public function setParticipant(?array $participant): static
    {
        $this->participant = $participant;

        return $this;
    }
   
    public function addParticipant(int $userId): bool
    {
        // Initialiser le tableau de participants s'il est vide
        if ($this->participant === null) {
            $this->participant = [];
        }

        // Vérifier si l'utilisateur est déjà inscrit
        if (in_array($userId, $this->participant)) {
            return false; // L'utilisateur est déjà inscrit
        }

        // Vérifier si des places sont disponibles
        if (count($this->participant) >= $this->nb_place) {
            return false; // Plus de places disponibles
        }

        // Ajouter l'utilisateur au tableau de participants
        $this->participant[] = $userId;

        return true; // Inscription réussie
    }

    public function isActive(): ?bool
    {
        return $this->IsActive;
    }

    public function setIsActive(?bool $IsActive): static
    {
        $this->IsActive = $IsActive;

        return $this;
    }

    public function getPreferences(): ?string
    {
        return $this->preferences;
    }

    public function setPreferences(?string $preferences): static
    {
        $this->preferences = $preferences;

        return $this;
    }

    /**
     * @return Collection<int, Avis>
     */
    public function getAvis(): Collection
    {
        return $this->avis;
    }

    public function addAvi(Avis $avi): static
    {
        if (!$this->avis->contains($avi)) {
            $this->avis->add($avi);
            $avi->setCovoituragesId($this);
        }

        return $this;
    }

    public function removeAvi(Avis $avi): static
    {
        if ($this->avis->removeElement($avi)) {
            // set the owning side to null (unless already changed)
            if ($avi->getCovoituragesId() === $this) {
                $avi->setCovoituragesId(null);
            }
        }

        return $this;
    }

    public function isStarted(): ?bool
    {
        return $this->IsStarted;
    }

    public function setIsStarted(?bool $IsStarted): static
    {
        $this->IsStarted = $IsStarted;

        return $this;
    }
}
