# Feriehus AS – Arkitektur og teknisk løsning

## Overordnet arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        NETTLESER                            │
│                                                             │
│  properties.html          property-single.html              │
│  ┌──────────────┐         ┌──────────────────┐             │
│  │ Filter-panel │         │ Eiendoms-detalj  │             │
│  │ #filter-type │         │ Slideshow        │             │
│  │ #filter-pris │         │ Fakta-boks       │             │
│  └──────┬───────┘         └────────┬─────────┘             │
│         │  JavaScript fetch()      │  fetch(?id=3)          │
└─────────┼───────────────────────────┼────────────────────────┘
          │  HTTP GET                 │  HTTP GET
          ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND  (Node.js / Express)              │
│                                                             │
│  GET /api/properties?type=rent&maxPrice=10000               │
│  GET /api/properties/:id                                    │
│                                                             │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────────┐  │
│  │  Router  │──▶│  Controller  │──▶│  db.js (pg Pool)   │  │
│  └──────────┘   └──────────────┘   └─────────┬──────────┘  │
└──────────────────────────────────────────────┼─────────────┘
                                               │  SQL
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE  (PostgreSQL)                    │
│                                                             │
│  ┌──────────────────┐      ┌───────────────────────────┐   │
│  │   properties     │ 1──* │     property_images        │   │
│  │──────────────────│      │───────────────────────────│   │
│  │ id (PK)          │      │ id (PK)                   │   │
│  │ name             │      │ property_id (FK)           │   │
│  │ location         │      │ url                        │   │
│  │ description      │      │ sort_order                 │   │
│  │ price            │      └───────────────────────────┘   │
│  │ type (rent/sale) │                                       │
│  │ area_m2          │                                       │
│  │ beds / baths     │                                       │
│  │ garages          │                                       │
│  │ image_url        │                                       │
│  │ created_at       │                                       │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

## Komponentbeskrivelse

### Frontend – Bootstrap-template (EstateAgency)
- **`Template/properties.html`** – Eiendomslisten. JavaScript henter data fra API
  ved sideload og når brukeren klikker «Søk». Filtrer på type og maksimumspris.
- **`Template/property-single.html`** – Detaljside. Leser `?id=` fra URL og henter
  én eiendom fra API. Bygger Swiper-karusell og fakta-boks dynamisk.
- Ingen server-side rendering – siden er ren statisk HTML + vanillja JS.

### Backend – Node.js / Express
| Fil | Ansvar |
|-----|--------|
| `backend/server.js` | Express-app, ruting, feilhåndtering |
| `backend/db.js` | PostgreSQL connection pool (pg) |
| `backend/schema.sql` | Databaseskjema og eksempeldata |
| `backend/package.json` | Avhengigheter |

**API-endepunkter**

| Metode | URL | Beskrivelse |
|--------|-----|-------------|
| GET | `/api/properties` | Alle eiendommer. Støtter `?type`, `?minPrice`, `?maxPrice` |
| GET | `/api/properties/:id` | Én eiendom inkl. ekstra bilder |

### Database – PostgreSQL
- `properties` – hovedtabell med all informasjon om hver eiendom
- `property_images` – en-til-mange: flere bilder per eiendom (karusell)

## Dataflyten trinn for trinn

```
1. Bruker åpner properties.html i nettleser
2. JavaScript kaller: GET http://localhost:3000/api/properties
3. Express mottar forespørselen
4. db.js kjører SQL: SELECT * FROM properties ORDER BY created_at DESC
5. PostgreSQL returnerer rader som JSON
6. Express sender JSON tilbake til nettleseren
7. JavaScript bygger HTML-kort for hver eiendom og setter inn i #properties-grid
8. AOS-biblioteket animerer kortene inn
```

## Oppsett og kjøring

```bash
# 1. Installer PostgreSQL og lag databasen
createdb feriehus
psql -d feriehus -f backend/schema.sql

# 2. Installer backend-avhengigheter
cd backend
npm install

# 3. Start API-serveren
npm start
# → API kjører på http://localhost:3000

# 4. Åpne Template/properties.html i nettleser
#    (bruk Live Server i VS Code, eller en lokal webserver)
```

## Videre utvidelser (mulige neste steg)

| Funksjonalitet | Teknologi |
|----------------|-----------|
| Booking og kalender | FullCalendar + bookings-tabell i DB |
| Autentisering (admin) | JWT + bcrypt |
| Bildeopplasting | Multer (Node) + S3 / Cloudinary |
| Kart | Leaflet.js + OpenStreetMap (gratis) |
| Søkemotor | PostgreSQL full-text search eller Elasticsearch |
| Hosting | Render.com / Railway (backend) + Netlify / Vercel (frontend) |
