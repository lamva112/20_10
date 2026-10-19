# Project Plan

**Status**: In Progress
**Created**: 2026-10-11
**Mode**: NEW

---

## 1. Project Overview

**Goal**: Build a one-page, client-only interactive 3D greeting for Ánh using a Three.js scene with a personalized message and clear interaction controls. Keep the greeting content, scene construction, controls, and accessibility behavior independently testable.

**App Type**: Static frontend

**API Login**: No

**Mode**: NEW

**Deployment Plan**: No deployment plan found

---

## 2. Frontend — Interactive Greeting

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Framework** | Vite + TypeScript + Three.js (vanilla) |
| **Package Manager** | npm |
| **Test Runner** | Vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

---

## 3. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| Azure Static Web Apps | Host and serve the static greeting site | — | No Azure service required for local development | Essential |

---

## 4. Prerequisites

Tool inventory was checked for this plan. Any `❓` entry is unconfirmed in the current environment and should be verified before proceeding.

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | frontend | ✅ | 20.19.4 |
| npm | frontend | ✅ | 10.8.2 |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Chrome | frontend | ✅ | 154.0.8037.99 |

---

## 5. Design System & UI

**Component Library**: Pico.css + native form controls
**Style Direction**: A quiet, luminous keepsake with an interactive Three.js scene as the visual focus, framed by restrained coral and botanical-green accents. Keep the greeting legible above the scene, use compact controls, and respect reduced-motion preferences.
**Typography**: Georgia / Charter for the greeting; system-ui for controls and supporting text

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#B94455` | Coral greeting accents, primary scene action, and focus states |
| `accent` | `#177B72` | Botanical highlights and secondary controls |
| `surface` | `#F3F8F5` | Main page and overlay surfaces |
| `text` | `#182621` | Greeting and primary interface text |
| `muted` | `#65756D` | Supporting copy and control labels |
| `border` | `#D3E1DA` | Control outlines and content dividers |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Greeting | `/` | Present Ánh's personalized greeting alongside a draggable, touch-friendly 3D keepsake scene. | `hero + main + actions + footer` |

### Sample Content

Greeting — scene and message:
| Element | Content | Presentation |
|---------|---------|--------------|
| Recipient | Ánh | Personalized greeting |
| Greeting line | A little universe, made just for you. | Main message |
| 3D scene | Floating glass petals around a warm point of light | Interactive scene |
| Primary action | Explore the scene | Scene interaction |
| Reduced-motion fallback | A still composition with the greeting fully visible | Accessible fallback |

Greeting — interface states:
- Loading: a subdued skeleton occupies the scene while Three.js initializes.
- Empty: if the optional dedication is unset, retain the scene and show “A little space, just for you.”
- Error: if WebGL cannot start, keep the greeting visible and offer “Try the scene again.”

---

## 6. Project Structure

```text
project-root/
├── .azure/
│   └── project-plan.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.ts
    ├── content/
    │   └── greeting.ts
    ├── scene/
    │   ├── greetingScene.ts
    │   └── interaction.ts
    ├── ui/
    │   └── greetingOverlay.ts
    ├── styles/
    │   └── app.css
    └── tests/
        ├── greeting.test.ts
        └── interaction.test.ts
```

---

## 7. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/` | Serve the greeting single-page app | — | HTML shell and client bundle | 200, 404 |
| 2 | GET | `/assets/*` | Serve built JavaScript, CSS, and static assets | — | Static asset | 200, 404 |

---

## 8. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, provisioning, and health verification
