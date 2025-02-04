<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250204110337 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE avis (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, covoiturages_id_id INT DEFAULT NULL, commentaire VARCHAR(255) NOT NULL, note VARCHAR(255) NOT NULL, statut TINYINT(1) DEFAULT NULL, INDEX IDX_8F91ABF0A76ED395 (user_id), INDEX IDX_8F91ABF03ADA8 (covoiturages_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE covoiturages (id INT AUTO_INCREMENT NOT NULL, conducteur_id INT DEFAULT NULL, voiture_id INT DEFAULT NULL, trajet VARCHAR(255) NOT NULL, duree VARCHAR(255) NOT NULL, date_depart DATE NOT NULL, heure_depart VARCHAR(255) NOT NULL, lieu_depart VARCHAR(255) NOT NULL, date_arrivee DATE NOT NULL, heure_arrivee VARCHAR(255) NOT NULL, lieu_arrivee VARCHAR(255) NOT NULL, nb_place INT NOT NULL, prix_personne DOUBLE PRECISION NOT NULL, participant JSON DEFAULT NULL, is_active TINYINT(1) DEFAULT NULL, preferences VARCHAR(255) DEFAULT NULL, is_started TINYINT(1) DEFAULT NULL, INDEX IDX_8F423311F16F4AC6 (conducteur_id), INDEX IDX_8F423311181A8BA (voiture_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE marque (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, telephone VARCHAR(255) DEFAULT NULL, adresse VARCHAR(255) NOT NULL, date_naissance VARCHAR(255) NOT NULL, photo LONGBLOB DEFAULT NULL, pseudo VARCHAR(255) NOT NULL, credit INT DEFAULT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE voiture (id INT AUTO_INCREMENT NOT NULL, marque_id INT DEFAULT NULL, propriétaire_id INT DEFAULT NULL, modele VARCHAR(255) NOT NULL, immatriculation VARCHAR(255) NOT NULL, energie VARCHAR(255) NOT NULL, couleur VARCHAR(255) NOT NULL, date_premiere_imma VARCHAR(255) NOT NULL, INDEX IDX_E9E2810F4827B9B2 (marque_id), INDEX IDX_E9E2810FF917CCFC (propriétaire_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE avis ADD CONSTRAINT FK_8F91ABF0A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE avis ADD CONSTRAINT FK_8F91ABF03ADA8 FOREIGN KEY (covoiturages_id_id) REFERENCES covoiturages (id)');
        $this->addSql('ALTER TABLE covoiturages ADD CONSTRAINT FK_8F423311F16F4AC6 FOREIGN KEY (conducteur_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE covoiturages ADD CONSTRAINT FK_8F423311181A8BA FOREIGN KEY (voiture_id) REFERENCES voiture (id)');
        $this->addSql('ALTER TABLE voiture ADD CONSTRAINT FK_E9E2810F4827B9B2 FOREIGN KEY (marque_id) REFERENCES marque (id)');
        $this->addSql('ALTER TABLE voiture ADD CONSTRAINT FK_E9E2810FF917CCFC FOREIGN KEY (propriétaire_id) REFERENCES `user` (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE avis DROP FOREIGN KEY FK_8F91ABF0A76ED395');
        $this->addSql('ALTER TABLE avis DROP FOREIGN KEY FK_8F91ABF03ADA8');
        $this->addSql('ALTER TABLE covoiturages DROP FOREIGN KEY FK_8F423311F16F4AC6');
        $this->addSql('ALTER TABLE covoiturages DROP FOREIGN KEY FK_8F423311181A8BA');
        $this->addSql('ALTER TABLE voiture DROP FOREIGN KEY FK_E9E2810F4827B9B2');
        $this->addSql('ALTER TABLE voiture DROP FOREIGN KEY FK_E9E2810FF917CCFC');
        $this->addSql('DROP TABLE avis');
        $this->addSql('DROP TABLE covoiturages');
        $this->addSql('DROP TABLE marque');
        $this->addSql('DROP TABLE `user`');
        $this->addSql('DROP TABLE voiture');
    }
}
