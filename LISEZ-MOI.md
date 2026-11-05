# Quiz Purpose & Vision — Kabakoo

Site statique sur GitHub Pages : https://diakitemoussa-dot.github.io/quiz-kabakoo/

- Participants : ouvrir le lien.
- Animateurs : ouvrir le lien + `#animateur` (UN seul onglet animateur à la fois). Mot de passe par défaut : `kabakoo`.
  Cet onglet fait office de serveur (scores, chrono) : il doit rester ouvert pendant toute la session.
  Les participants se connectent à lui en direct (PeerJS / WebRTC), sans serveur.
- Changer le mot de passe : remplacer la constante `PH` dans `index.html` par le SHA-256 du nouveau mot de passe.
- Questions : éditer `questions.json` (`q` question, `o` choix, `a` numéro de la bonne réponse, 0 = A).

## Ancienne version avec serveur Node (optionnelle)
`node server.js` + dossier `public/` (Render, Railway…). Plus utilisée pour GitHub Pages.
