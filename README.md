# Bad2gether

Application mobile React Native (Expo) + Supabase orientée production pour gamifier la progression badminton.

## Démarrage

1. Copier `.env.example` vers `.env`.
2. Installer les dépendances : `npm install`.
3. Lancer l'app : `npm run start`.

## Architecture

- `app/src` : couche mobile (navigation, écrans, état Zustand, services Supabase).
- `supabase/migrations` : schéma PostgreSQL, index et policies RLS.
- `supabase/functions/validate_session` : logique serveur de validation des séances + calcul XP.

## Sécurité

- Calcul XP et anti-triche strictement côté serveur via Edge Function.
- RLS activé sur toutes les tables métier.
- Les clients n'insèrent pas directement de XP.
