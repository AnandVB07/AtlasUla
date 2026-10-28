# AtlasUla

<p align="center">
  <strong>Plan a trip that feels like yours.</strong><br />
  An AI-assisted travel companion for itineraries, budgets, packing, weather, journals, and trip progress.
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/UI-React_18-149ECA?style=for-the-badge&logo=react&logoColor=white" alt="React 18" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Services-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" /></a>
  <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/AI-Gemini-8E75B2?style=for-the-badge" alt="Google Gemini" /></a>
</p>

<p align="center">
  <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&auto=format&fit=crop&q=85" alt="Paris destination imagery used by AtlasUla's travel demo data" width="92%" />
</p>

---

## Explore

- **Build an itinerary** — shape a multi-day plan around destination, budget, travel group, interests, and travel style.
- **Keep the trip organized** — manage packing lists, daily activities, expenses, and budget allocations.
- **Save travel memories** — keep a trip journal and request AI-generated entry summaries.
- **Discover a destination** — browse demo hotel, restaurant, and weather information.
- **Stay motivated** — track XP, streaks, travel levels, and achievements.
- **Ask the travel assistant** — use Gemini when configured, with a mock-response fallback.

## Architecture

~~~mermaid
flowchart TD
    traveler["Traveler"] --> ui["React and TypeScript frontend"]
    ui --> service["Axios API service"]
    service --> api["Express and TypeScript REST API"]
    api --> files["JSON files for trips, journal, and profile"]
    api --> gemini["Gemini itinerary, chat, and journal summaries"]
    ui --> firebase["Firebase services when configured"]
    service --> local["LocalStorage and mock-data fallback"]
    ai["Client-side Gemini helper when configured"] --> ui
~~~

The project supports a demo-first workflow. When the API is unavailable, the frontend falls back to localStorage and mock data. Gemini and Firebase integrations are optional and require configuration.

## Technology

| Layer | Stack |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS 3 |
| UI and data | React Router, TanStack Query, Axios, Recharts, Framer Motion, Lucide |
| Cloud services | Firebase SDK for configured Auth, Firestore, and Storage services |
| AI | Google Generative AI SDK; mock itinerary/chat fallback |
| Backend | Node.js, Express 4, TypeScript |
| Local persistence | JSON files for API data and browser localStorage fallback |

## Run locally

### Frontend

~~~bash
cd AtlasUla/frontend
npm install
npm run dev
~~~

Vite serves the frontend at http://localhost:5173. The API client defaults to http://localhost:5000/api; you can override it with VITE_API_URL in AtlasUla/frontend/.env.

### Backend

In another terminal:

~~~bash
cd AtlasUla/backend
npm install
npm run dev
~~~

The API listens on port 5000. Its health endpoint is /health.

### Optional integrations

- For frontend Gemini features, configure VITE_GEMINI_API_KEY.
- For Firebase-backed authentication and cloud services, add the VITE_FIREBASE_* values from AtlasUla/.env.example.
- For server-side Gemini routes, configure GEMINI_API_KEY in the backend environment.
- Without these credentials, demo content and local fallbacks remain available.

## Project layout

- AtlasUla/frontend/ — integrated React/Vite client, screens, UI components, API services, and fallback data.
- AtlasUla/backend/ — Express routes, trip/journal/profile controllers, Gemini service, and JSON-file persistence.
- AtlasUla/.env.example — Firebase and AI configuration template.
- AtlasUla/frontend/.env.example — API URL template.

## Data and integrations

Trip, journal, and profile records are written to local JSON files by the development API. Firebase services and Gemini require credentials; the demo fallback is not a production multi-user data service.
