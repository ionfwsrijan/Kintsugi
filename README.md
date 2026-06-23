# Kintsugi — Community Hero

**Mend what matters.** Kintsugi is a hackathon-built civic AI platform for reporting, verifying, tracking, and resolving hyperlocal community issues such as potholes, water leaks, broken streetlights, unsafe roads, and waste overflow.

The demo focuses on a polished citizen experience, AI-assisted civic workflows, live-map style issue tracking, community verification, impact dashboards, rewards, notifications, and an admin console concept.

## Why this matters

Local civic issues are usually reported through fragmented channels with poor visibility. Kintsugi creates a transparent loop:

`Citizen report → AI triage → community verification → department routing → status tracking → impact measurement`

## Screenshot

<img width="1896" height="897" alt="Screenshot 2026-06-23 162211" src="https://github.com/user-attachments/assets/11018720-54f1-4636-a4f5-208b3dd05ef3" />

## Key features

- Photo/video-first issue reporting flow
- AI-style issue categorization, severity scoring, duplicate detection, and routing UX
- Live neighbourhood map with issue markers and filters
- Community verification and trust/reputation system
- Notifications, profile, rewards, and leaderboard screens
- Impact dashboard with civic KPIs and predictive insights
- Admin console for queue management, SLA tracking, and department assignment
- Responsive black/white UI with blue accents and glassmorphism styling

## Google technologies used / intended

- **Google AI Studio** — required deployment target for the submitted demo
- **Gemini API** — civic copilot, report triage, categorization, summaries, and predictive insights
- **Firebase** — auth, Firestore, storage, realtime civic data, and security rules
- **Cloud Run** — deployment target created by AI Studio publishing
- **Google Maps-style geo intelligence** — location-first reporting and map UX

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Recharts
- Lucide React
- Express backend scaffold
- Firebase client/admin scaffold
- Gemini API server-side integration scaffold

## Run locally

Use `pnpm`, not `npm`.

```powershell
pnpm install
pnpm dev:win
```

Open:

```text
http://localhost:5173
```

For normal Linux/macOS/AI Studio environments:

```bash
pnpm install
pnpm dev
```

## Build

Windows fallback:

```powershell
pnpm build:win
```

Standard build:

```bash
pnpm build
```

## Environment

Copy `.env.example` to `.env` only for local testing. Do not commit `.env`.

```powershell
Copy-Item .env.example .env
```

Gemini keys should remain server-side only. Do not expose them through `VITE_` variables.

## Hackathon submission checklist

- [x] Deploy the app using Google AI Studio Publish
- [x] Submit the public deployed app URL
- [x] Push this repository to GitHub
- [x] Create a public Google Doc with:
  - Problem statement selected
  - Solution overview
  - Key features
  - Technologies used
  - Google technologies utilized
  - Screenshots
  - Deployed app link
  - GitHub repo link
- [x] Test the deployed link in an incognito window
- [x] Make sure the Google Doc is accessible to anyone with the link

## Demo narrative for judges

1. A citizen reports a local issue with media.
2. Kintsugi AI classifies the issue, estimates severity, and checks duplicates.
3. Nearby citizens verify the issue.
4. The issue is routed to the responsible civic authority.
5. Citizens track progress transparently.
6. Impact dashboards show resolution rate, response time, civic hours saved, and predictive risk signals.

## Status

This is a hackathon-ready demo with a polished frontend and backend/Firebase/Gemini scaffolding for extension into a full production civic platform.

