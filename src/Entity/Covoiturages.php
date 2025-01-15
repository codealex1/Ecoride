<?php

namespace App\Entity;

use App\Repository\CovoituragesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CovoituragesRepository::class)]
class Covoiturages
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $conducteur = null;

    #[ORM\Column(length: 255)]
    private ?string $trajet = null;

    #[ORM\Column(length: 255)]
    private ?string $duree = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getConducteur(): ?string
    {
        return $this->conducteur;
    }

    public function setConducteur(string $conducteur): static
    {
        $this->conducteur = $conducteur;

        return $this;
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
}
