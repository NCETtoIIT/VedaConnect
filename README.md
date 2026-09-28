# VedaConnect AIIA CTMS

**Real-time, cloud-based, GCP-compliant Clinical Trial Management System for Ayurveda research.**
Built for Smart India Hackathon 2026 · Problem Statement **SIH26046** · Team VedaConnect.

---

## 🚀 Live Demo

> **Deploy to Vercel:** Push to GitHub → Import on [vercel.com](https://vercel.com) → Live in 60 seconds.
> Live URL placeholder: `https://vedaconnect-ctms.vercel.app`

---

## 🎯 What it demonstrates

| Feature | Detail |
|---|---|
| **Portfolio Dashboard** | 6 KPI cards · Risk bar chart · Enrolment S-curve · Studies table |
| **29 Participating Centres** | Site cards with search/filter · Progress bars · SDV overdue flags |
| **10-Stage Trial Lifecycle** | 7 Hard Gate locks · Tooltips · Group colour-coding |
| **Live 24H SAE Countdown** | SVG ring clock · URGENT pulse at <6h · Per-second tick |
| **MedDRA Coding Gate** | AE coding modal · localStorage-persisted · Publish gate unlocks on code |
| **Alerts Center** | Ethics / CTRI / Monitoring / Safety · Mark-as-read · Filter chips |
| **1-Click Role Switcher** | 8 roles · RBAC-enforced nav hide/show |
| **CDISC Export (demo)** | Progress bar → Define-XML text file download (client-side Blob) |

---

## 🛠 Tech Stack

- **Vite + React 18 + TypeScript** — frontend toolchain
- **Tailwind CSS v3** — utility-first styling with custom VedaConnect tokens
- **React Router v6** — SPA routing (with `vercel.json` rewrites for refresh)
- **Recharts** — Risk bar chart + Enrolment S-curve
- **Lucide React** — icons throughout
- **localStorage** — persists role choice, read alerts, MedDRA codes

---

## 🏃 Run locally

```bash
cd vedaconnect-ctms
npm install
npm run dev       # http://localhost:5173
npm run build     # Production build → dist/
```

---

## 🔒 Data & Privacy

All participant data is **100% synthetic** — IDs formatted as `SYN-P00XXX`.
No real patient names, phone numbers, or addresses anywhere.
Footer on every page: *"Synthetic de-identified data — DPDP Act 2023 compliant prototype."*

---

## 📁 Project structure

```
src/
├── data/          # JSON mock data (studies, sites, alerts, safety, lifecycle, roles)
├── lib/           # Types, localStorage store, SAE clock, format helpers
├── components/    # KpiCard, RiskBadge, StatusPill, DataTable, SaeClock, StageTimeline…
└── pages/         # Dashboard, Sites, StudyDetail, Safety, Alerts
```

---

*Document prepared for Team VedaConnect · SIH 2026 · SIH26046 · All clinical data is synthetic and de-identified, in line with the DPDP Act 2023.*
