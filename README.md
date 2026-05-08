# Bakery Singapore Loyalty Dashboard

Internal loyalty dashboard for Boomerangme — displays client info, card details, and stamp card data for Bakery Singapore.

## Setup

1. Clone repo and install
   ```bash
   git clone <repo-url>
   cd bakery-loyalty-dashboard
   npm install
   ```

2. Configure environment
   ```bash
   cp .env.example .env
   # Edit .env and add your Boomerangme API key
   ```

3. Run locally
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

## Features

- **Overview** — KPI stats, global search, stamp card snapshot, recent lookups
- **Clients** — Paginated/searchable client list, click to view profile
- **Client Detail** — Identity, linked cards, operations timeline
- **Cards** — Paginated/searchable card list with stamp progress bars
- **Card Detail** — Stamp visualization, cardholder info, operations log
- **Phone Lookup** — Three modes: card check, card info, customer info

## API

- Base URL: `https://api.digitalwallet.cards`
- Auth: `X-Api-Key` header
- Rate limit: 10 req/s — dashboard uses token-bucket rate limiting + exponential backoff

## Design

Warm artisan bakery palette — cream, flour white, toasted oat, baked brown, wheat gold.  
Stack: React + TypeScript + Vite + Tailwind CSS v4.

## Security

Never commit `.env`. The API key should move to a backend proxy for production.

## Primary Card

Card template: `965363` (Stamp card — Bakery Singapore)
