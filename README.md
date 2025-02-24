# ÉVALUATION EN COURS DE FORMATION
## Graduate Développeur
###### (Android, Angular, Flutter, Front End, Full Stack, IOS, PHP/Symfony)

---

## Énoncé

**Votre examen comporte :**

✔ Cet énoncé qui vous présente le sujet de l’épreuve

✔ Une copie à rendre (Excel ou Word) que vous devez télécharger, remplir informatiquement et déposer dans l’espace de dépôt prévu à cet effet.


**Renommer votre copie à rendre Word ou Excel comme suit :**
TP_DWWM_Juin/Juil/Sept/Oct25_copiearendre_NOM_Prenom

**Objectifs de l’évaluation :**
L’évaluation en cours de formation que vous allez réaliser a pour vocation de figurer dans votre livret d’évaluation. Il sera donc remis à votre jury le jour des épreuves du titre professionnel accompagné de votre évaluation et du sujet initial.
Nous vous demandons de vous mettre en situation d’examen. Prenez le temps de lire le sujet et de manipuler les annexes afin de répondre en situation professionnelle aux questions et problématiques évoquées dans le sujet


### À vous de jouer !

## Informations

**Github** :https://github.com/codealex1/Ecoride.git

**Démonstration** : <span style="color:red">**https://main-bvxea6i-xhpxmjhzaibk2.fr-4.platformsh.site/**</span>

    Adresse email admin      : admin@joseEcoride.com
    Mot de passe admin       : Admin123!

    Adresse email employé      : employe@Ecorideemploye.com
    Mot de passe employé       : Employe123!

    Adresse email utilisateur de test      : exempleUtilisateur1@gmail.com
    Mot de passe        : exemple1

   

## Réflexion et configuration de l'environement de travail 

### Git et Github

Pour commencer, j'ouvre **un nouveau "Repository"** dans mon espace **Github** que je nomme **ECF-GRADUATE_DEV2024**.
Une fois celui-ci configuré, j'**initialise Git** en utilisant les commandes ci-dessous:

```bash
$ git init
$ git add .
$ git commit -m "first commit"
$ git branch -M dev
$ git remote add origin https://github.com/codealex1/Ecoride.git
$ git push -u origin dev
```

### <span style="text-decoration:underline">Déploiement local</span>

commencez par cloner le repository à l'aide de la commande git clone https://github.com/codealex1/Ecoride.git

ouvrez un terminal dans le dossier du projet
Exécutez les commandes npm install et composer install

Créer un fichier .env.local et configurer l'url de votre base de donée et de votre service d'envoie de mail (mailjet utlisé lors du développement)
Exécutez les commandes doctrine:make:migration et migration:migrate
Une fois les dépendances installées , exécuter la commande php -S 127.0.0.1:8000 -t public ou symfony serve pour lancer le projet.

### Guide d'utilisation :

Par défault un visiteur peut rechercher des covoiturages depuis la page d'accueil et covoiturages mais ne peux accèder aux détails et participer. 
Créez-vous un compte et allez dans l'éspace utilisateur pour sélectionné votre rôle (choissisez "les deux" dès le départ pour ne pas avoir à re changer lorsque vous voudrez participer à un covoiturages).
Le rôle passagé vous  permet de participer aux covoiturages tandis que le rôle conducteur vous permet dans ajouter et d'activer ou non le covoiturage afin qu'il soit visible sur la plateforme.
Lorsqu'un utilisateur participe à votre covoiturages vous recevrez un mail , de même lorsque vous annulez un covoiturages les participants sont avertis.
À la fin d'un covoiturage les participants recoivent un mail leur proposant de laisser un avis sur le conducteur. Les avis doivent être validé par un employe depuis son espace afin d'apparaitre dans les détails des prochains covoiturages du conducteur en question.
Vous pouvez visionné tous les instances des entités depuis l'espace administrateur et visualiser les revenues de la plateforme en temps réel.



**Trello** : <span style="color:red">: [https://trello.com/b/Gj4oYQbu/ecf](https://trello.com/b/ZK58zW7X/initialisation-de-react-dans-symfony-gestion-des-erreurs-de-la-74)</span>



### <span style="text-decoration:underline">Configuration de l'environement de travail</span>


- **Serveur:**
    + Apache
    + PHP 8.6
    + MySQL 10.6 / PDO


- **Backend (API)**
    + PHP 8.1
    + MySQL 8.0.32 / PDO
    + Symfony 7


- **Frontend**
    + HTML 5
    + ReactJs
    + Tailwindcss
    + CSS 3
    + Javascript
    + NodeJs
    


## Diagramme des Cas d'utilisations

<br />


<br /><br />![CasUtilisation1](https://github.com/user-attachments/assets/b320b8d4-aa33-4984-8eeb-98b83c09aaa9)

![CasUtilisation2](https://github.com/user-attachments/assets/4ada49fe-5ed5-4f73-a71b-11a2d4e7bab6)

<br /><br />![CasUtilisation3](https://github.com/user-attachments/assets/47b7a4f0-4c32-49bf-9a34-57aab4554bef)


## Modélisation des données

![Modélisation des données](https://github.com/user-attachments/assets/5d0bcce1-f271-4a05-8e51-738e13669fae)



### Lien maquette figma 

https://www.figma.com/design/SBp5kmT7CW95KckwjWMitA/EcoRide?node-id=0-1&p=f&t=CiW7Zuz8xbxugoSy-0




### Code SQL 

création de l'admin : insert into user (nom , prenom , telephone , adresse , date_naissance, pseudo , credit , email , password , roles) values ("ecoride", "jose", 0606060606 , "Paris" , "01/01/1964" ,"JOSEadmin" , 30000 , "admin@joseEcoride.com", "$2y$13$qgq1InV4ux9VuRVSw9lUiOc969VhaOYXXmTeWkbv2NipXS1E3rrGG" , '["ROLE_ADMIN"]');
