# I Built a Production-Ready Flight Tracker in 24 Hours with Next.js and Google Cloud Run

![Cover Image Placeholder: A sleek collage of the Flight Card and the Map on a dark background]

Have you ever looked at a flight tracking app and thought, "I could build this, but better?" Or maybe you just wanted a clean, no-nonsense dashboard to track your family's flights without wading through ads and clunky UIs.

That’s exactly what I did.

Over the last day, I built and deployed a custom **Flight Tracker** app. It's not just a toy project—it’s a live, production-grade application running on **Google Cloud Run**, featuring real-time data, beautiful interactive maps, and a fully functional Airport Dashboard.

Here’s how I built it, the architecture I used, and the surprising challenges I faced along the way.

---

## 🛠️ The Tech Stack

I wanted a stack that was fast to build, easy to scale, and developer-friendly.

*   **Frontend**: [Next.js 14](https://nextjs.org/) (App Router) – For React server components and snappy routing.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) – For rapid, premium-looking UI development.
*   **Data**: [AviationStack API](https://aviationstack.com/) – For real-time flight status, schedules, and airport data.
*   **Maps**: `react-leaflet` – For that essential "plane on a map" visualization.
*   **Deployment**: [Google Cloud Run](https://cloud.google.com/run) – For serverless, containerized hosting that scales to zero.

---

## 🏗️ The Architecture

The app is designed to be stateless and efficient. The Next.js server acts as an orchestrator, fetching data from the external API, normalizing it, and serving it to the client.

```mermaid
graph TD
    User[User / Client] -->|HTTPS| CloudRun[Google Cloud Run]
    CloudRun -->|Next.js App| API_Route[/api/flights]
    API_Route -->|Fetch JSON| AviationStack[AviationStack External API]
    
    subgraph "Internal Processing"
        API_Route -->|Filter & Sort| Logic[Business Logic]
        Logic -->|Map Images| Unsplash[Aircraft Image Mapping]
        Logic -->|Timezone Fix| LocalTime[Wall Clock Time Helper]
    end
    
    Logic -->|Response| ClientUI[React Components]
    ClientUI -->|Render| Map[Leaflet Map]
    ClientUI -->|Render| Card[Flight Card]
```

**Key Decision**: I chose to proxy all API requests through my own Next.js API routes (`/api/flights`, `/api/airports`). This keeps my `AVIATIONSTACK_API_KEY` secure on the server and allows me to transform the messy external data into a clean interface for my frontend.

---

## ✨ Key Features

### 1. The Dynamic Flight Card
This isn't just text on a screen. The background of the card updates dynamically based on the aircraft model.
*   Flying a **Boeing 787**? You see a Dreamliner.
*   **Airbus A380**? You get the Superjumbo.
*   Data missing? We handled that gracefully with a beautiful generic fallback, so the user never sees "null" or broken UI.

![Screenshot Placeholder: The Main Flight Card showing UA871 with a background image]

### 2. Live Airport Dashboard
I wanted to know what's happening at my home airport. The **Airport Dashboard** lets you type in any code (like `JFK` or `LHR`) and instantly see a live Arrivals & Departures board.
*   **Toggle**: Switch between Arrivals/Departures instantly.
*   **Context**: We show both the IATA code AND the full City Name (e.g., "LHR - London Heathrow") so you know exactly where that flight is going.

![Screenshot Placeholder: The Airport Dashboard table with dark mode UI]

### 3. Interactive History
The "Past Flights" and "Upcoming Flights" lists aren't just static rows. Clicking any flight instantly updates the main visualizer, panning the map and updating the details without a page reload.

---

## 🐛 The Challenges (and How I Solved Them)

Building software is never a straight line. Here were the two biggest hurdles:

### Challenge #1: The Timezone Trap 🕒
**The Problem**: The API returned times like `2024-12-30T10:00:00+00:00`. Usually, you'd parse this as UTC. But flight times are tricky—passengers think in "Wall Clock Time" (local time at the airport). Converting everything to the user's browser timezone resulted in flights looking like they left at 3 AM instead of 11 AM.

**The Fix**: I wrote a custom `getLocalTimeParts` helper. Instead of fighting timezone libraries, we treat the API time string as "Face Value" relative to the airport.
```typescript
// The "Wall Clock" Solution
const getLocalTimeParts = (timeStr: string) => {
    // Strip the confusing +00:00 offset provided by the API
    // and treat the time as if it's local to the airport.
    const cleanStr = timeStr.replace(/[Zz]|[+-]\d{2}:?\d{2}$/, '');
    return new Date(cleanStr);
};
```
This ensured that a 10:00 AM flight in Tokyo shows as 10:00 AM, regardless of whether you're viewing it from New York or London.

### Challenge #2: Sparse Data ("Unknown Aircraft") ✈️
**The Problem**: The API often returns `null` for aircraft models on scheduled flights. This resulted in the UI saying "Unknown Aircraft" constantly, which looked broken.

**The Fix**: A UI polish pass. We implemented conditional rendering:
*   **If we have the data**: Show it proudly (e.g., "Boeing 737 MAX 8").
*   **If we don't**: Hide the label entirely.
It’s a subtle change, but it makes the difference between "Prototype" and "Product".

---

## 🚀 Deployment

Deployment was a breeze with **Google Cloud Run**.
1.  **Containerize**: Next.js outputs a standalone Docker container.
2.  **Deploy**: One command:
    ```bash
    gcloud run deploy flight-tracker --source . --allow-unauthenticated
    ```
3.  **Scale**: Cloud Run automatically scales the container down to zero when no one is using it, meaning this side project costs me essentially $0/month to host.

---

## 🌐 Custom Domain Setup (GoDaddy + Cloud Run)

To make it feel like a real product, I couldn't stick with the default `run.app` URL. Here is how I wired up a custom domain:

1.  **Domain Purchase**: I grabbed a catchy `.com` on **GoDaddy**.
2.  **Cloud Run Mapping**:
    -   In the Cloud Run Console, I went to **Manage Custom Domains**.
    -   I selected my service (`flight-tracker`) and the new domain.
    -   Google generated a set of **A** and **AAAA** records for me.
3.  **DNS Configuration**:
    -   Back in GoDaddy's **DNS Management** dashboard, I deleted the default parking records.
    -   I added the 4 'A' records and 4 'AAAA' records provided by Google.
4.  **SSL Magic**: Within 15 minutes, Google automatically provisioned a managed SSL certificate. No `certbot`, no renewals, just instant HTTPS.

---

## 🏁 Conclusion

In just a few hours aka ~12 hours, we went from `npx create-next-app` to a deployed, visually stunning application. We tackled timezone logic, integrated third-party APIs, and polished the UX to feel premium.

**Live Demo**: [Check out the Flight Tracker](https://flight-tracker-16016022795.us-central1.run.app)

*Built with Next.js, Tailwind, and a lot of coffee.*

---

## 🚧 Work in Progress

This project is still an active work in progress! While the core features are stable, you might encounter edge cases with specific airports or airline data.

**Notice any bugs?** Please drop a comment below. I'm actively improving the dashboard and squashing bugs as they appear!
