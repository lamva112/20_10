# Integration Handoff

## Frontend
- Project folder: `.`
- Dev command: `npm run dev`
- Build command: `npm run build`
- Preview route: `/`
- Static asset route: `/assets/*`
- API seam: not applicable (client-only app)
- Mock data: none
- Delete/replace mock files: none

## Backend
- Project folder: none
- Runtime: none
- Health endpoint: `/`
- Port: Vite default 5173

## Routes
- `GET /` -> single-page greeting shell, 200/404
- `GET /assets/*` -> built client assets, 200/404

## Database
- Type: none
- Migration tool: none
- Required env vars: none
- Seed data: none

## Azure services
- Azure Static Web Apps (Essential)
- Local environment: static frontend only

## Verification
- `npm test`
- `npm run build`
- Confirm responsive greeting layout and reduced-motion accessibility behavior in browser
