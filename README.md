# WEI Events App

Mobile app for a student integration week. Students can browse the event calendar, a map of event locations, event details and their profile, and see role-based permissions. It is built with Expo / React Native, with a small Express + SQLite backend.

*Student project (CentraleSupélec, Dec 2024 – Jan 2025), not maintained.*

## Stack
- **App**: Expo SDK 51, React Native 0.74, expo-router, react-native-maps, axios, TypeScript.
- **Backend** (`backend/`): Node.js, Express, Sequelize, SQLite. Models: students, events, favourites, attendance, roles and permissions.

## Getting started
```bash
npm install
# Put your own Google Maps API key in app.json (android.config.googleMaps.apiKey)
npx expo start

# Backend
cd backend && npm install && node server.js    # creates WeildWeeks.db next to database.js
```

## Credits
[TODO: team members]
