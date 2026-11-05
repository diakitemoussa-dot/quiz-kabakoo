# Quiz Purpose & Vision — Kabakoo (version autonome)

Aucun compte Claude n'est nécessaire pour jouer : il suffit du lien.

## Lancer le quiz sur ton ordinateur (test)
1. Installe Node.js (version 18 ou plus) : https://nodejs.org
2. Dans ce dossier : `node server.js`
3. Ouvre http://localhost:3000 (participants) et http://localhost:3000/#animateur (animateurs).
   Pour changer le mot de passe animateur : `HOST_PASSWORD=monmotdepasse node server.js`
   (mot de passe par défaut : kabakoo).

## Pour Lomé, Bamako et Ségou : le mettre en ligne
Un ordinateur seul ne suffit pas : le serveur doit être accessible sur internet.
Héberge ce dossier chez un service qui lance du Node.js (Render, Railway, Fly.io…) :
- commande de démarrage : `node server.js`
- variable d'environnement : `HOST_PASSWORD` = ton mot de passe
- partage ensuite l'adresse obtenue aux participants ; les animateurs ajoutent `#animateur` à la fin.

## Modifier les questions
Edite `questions.json` : `q` = question, `o` = choix, `a` = numéro de la bonne réponse (0 = A, 1 = B…).

## Remarques
- Les scores sont gardés en mémoire : si le serveur redémarre, tout repart de zéro.
- Les bonnes réponses restent sur le serveur jusqu'à la révélation.
- Le chrono et les points sont calculés par le serveur (20 s, 500 à 1000 points).
