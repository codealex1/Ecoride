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




**Trello** : <span style="color:red">: [https://trello.com/b/Gj4oYQbu/ecf](https://trello.com/b/ZK58zW7X/initialisation-de-react-dans-symfony-gestion-des-erreurs-de-la-74)</span>



### <span style="text-decoration:underline">Configuration de l'environement de travail</span>


- **Serveur:**
    + Apache
    + PHP 8.1
    + MySQL 8.1 / PDO


- **Backend (API)**
    + PHP 8.1
    + MySQL 8.0 / PDO
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
![CasUtilisation1](https://github.com/user-attachments/assets/812b0d99-9fb0-4c33-8c5c-f5b6d08e7400)
![CasUtilisation2](https://github.com/user-attachments/assets/073adf55-3d29-46a5-9511-8ca46a093430)
![CasUtilisation3](https://github.com/user-attachments/assets/450822d6-ef44-4157-81fb-c46fa8c4b065)


<br /><br />

<br /><br />

## Modélisation des données

![Modélisation des données](https://github.com/user-attachments/assets/5d0bcce1-f271-4a05-8e51-738e13669fae)



### Lien maquette figma 

https://www.figma.com/design/SBp5kmT7CW95KckwjWMitA/EcoRide?node-id=0-1&p=f&t=CiW7Zuz8xbxugoSy-0




insert into user (nom , prenom , telephone , adresse , date_naissance , pseudo , credit , email , password , roles) values ("alex", "brunet" , 07827398797 , "bordeaux" , "07/05/2005", "alex" , 30000, "alexandrebrunet4600@gmail.com" , "$2y$13$GB3.UtORHwKPU0ba2keEvOD5OaRnpFete4LKt5hiGSctEVfsieC/2",'[ "ROLE_ADMIN"]');
