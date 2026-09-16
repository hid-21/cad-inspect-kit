# Cad Inspect

CAD Topology Inspection Web App — Frontend UI Specification

Scope of this document: Frontend UI only. No backend, no CAD parsing, no ML/feature-recognition logic. All data shown in the UI can be mocked/dummy for now. Goal is a clean, minimal, professional "engineering tool" look — not a marketing site, not a flashy landing page. The app opens directly into the working screen (no landing/marketing page).

1. Design Direction

Feel: engineering software / analysis workstation (think CAD tools, not consumer apps)

Visual style: neutral, flat, minimal — light gray/white base, one accent color for selection/highlight states, dark text

Typography: simple sans-serif, clear hierarchy (section labels small/uppercase/muted, values normal weight)

No decorative illustrations, no gradients, no marketing copy, no hero sections

Every button has a clear text label (icon + label, not icon-only, except for common actions like close/reset where an icon alone is standard)

Generous spacing, clear borders/dividers between panels so the layout reads as "tool," not "page"

One consistent accent color used only for: active states, selection highlight, primary action buttons

Light theme by default; a light/dark toggle is optional (only include if simple)

2. Overall Layout

Three-panel workstation layout, always visible (no page reloads to switch view):

┌──────────────────────────────────────────────────────────┐
│                        Top Bar                             │
├───────────────┬──────────────────────────┬────────────────┤
│               │                            │                │
│  Left Sidebar │      Center 3D Viewport    │ Right Inspector│
│               │                            │                │
│               │                            │                │
└───────────────┴──────────────────────────┴────────────────┘


Top Bar: fixed height, full width

Left Sidebar: fixed width (~280px), collapsible

Center Viewport: flexible, takes remaining space

Right Inspector: fixed width (~320px), collapsible

Layout must be responsive down to laptop screen widths; sidebars can collapse to icons on smaller screens

3. Top Bar

Left to right:

App name/logo (simple text or wordmark, no tagline)

"Upload Model" button (primary style, clearly the main action)

Supported formats hint text, small and muted (e.g. "STEP files supported")

Current file name (shows once a file is loaded, else empty/hidden)

Right-aligned: Reset Session button, Theme toggle (optional), Help/About icon button

No search bar, no navigation menu, no account/profile icon needed for this version.

4. Left Sidebar

Stacked sections, each with a small uppercase section header and a subtle divider between sections. All sections should be collapsible (click header to expand/collapse).

4.1 Current Model

File name

Units (e.g. "mm")

Upload date/time (optional)

4.2 Topology Summary

A simple stat block showing counts:

Bodies

Shells

Faces

Edges

Vertices

Display as a clean small table or label/value rows — not cards, not icons, just readable numbers.

4.3 Feature List (placeholder for now)

List of feature types with counts (e.g. "Chamfer — 4", "Fillet — 2")

Each row expandable to show individual instances

Clicking a feature row should visually indicate it would highlight geometry (behavior can be a stub for now)

4.4 Topology Tree (placeholder)

Simple expandable tree: Body → Shells → Faces/Edges/Vertices

Can be a basic nested list component with expand/collapse arrows

Empty state: before a file is uploaded, sidebar sections show a muted placeholder message like "No model loaded" instead of empty tables.

5. Center Viewport

5.1 Empty State (before upload)

Centered upload drop-zone inside the viewport area

Dashed border box

Text: "Drag and drop a STEP file here, or click to upload"

Small supported-formats note underneath

This is the only screen shown before a model exists — do not build a separate landing page

5.2 Loading State

Centered spinner or progress bar

Short status text (e.g. "Processing model…")

5.3 Loaded State

3D canvas fills the panel

Small toolbar overlaid top-left or top-right of the canvas (not a separate bar), containing:

Fit to View

Reset Camera

Wireframe toggle

Edges toggle

Small axis gizmo in a corner (bottom-right or top-right)

Selection highlight rendered directly on the model (color-based, using the single accent color)

A small floating "badge" near the cursor or top of viewport when something is selected, e.g. "Face #32"

"Clear Selection" button visible only when something is selected — place it in the viewport toolbar or as a small floating button

5.4 Error State

If something fails, show a centered message box inside the viewport area with a clear, specific message and a "Try Again" / "Upload New File" button

No vague "something went wrong" — message text should describe what failed (this can be mock text for now)

6. Right Inspector Panel

Tabbed panel. Tabs across the top:

Overview

Geometry

Topology

Feature

Diagnostics

6.1 Empty State

When nothing is selected: centered muted text, e.g. "Click on the model to inspect an element."

6.2 Overview Tab

Simple label/value list:

Selection type (Face / Edge / Vertex / Shell)

Internal ID

Source file name

Model units

6.3 Geometry Tab

Changes based on selection type — build all four variants as static/mock layouts:

If Face selected:

Face ID, Surface type, Area, Perimeter, Normal direction, Adjacent faces (list), Adjacent edges (list)

If Edge selected:

Edge ID, Curve type, Length, Start/End vertices, Adjacent faces (list), Convex/Concave tag

If Vertex selected:

Vertex ID, Coordinates (X/Y/Z), Connected edges count, Connected faces count

If Shell/Body selected:

Shell ID, Open/Closed status, Face/Edge/Vertex counts, Volume, Surface area

Use clean label/value rows (label muted+small on the left or above, value normal weight below/right). Lists (like "Adjacent faces") should be simple chips or a comma-separated readable list, clickable to (eventually) re-select — stub the click for now.

6.4 Topology Tab

Parent/child relationship summary for the current selection (simple indented list)

6.5 Feature Tab

Shows linked feature if the selected entity belongs to one (e.g. "Part of: Chamfer #3")

If none, show muted "No feature associated"

6.6 Diagnostics Tab

Placeholder area for future warnings/errors related to the selection (empty state text is fine for now)

7. Buttons & Interaction Clarity

Primary actions (Upload, Try Again) use the accent color, solid fill

Secondary actions (Reset Camera, Fit View, Clear Selection) use outline/ghost style

Every icon-based control (wireframe toggle, edges toggle, collapse arrows) needs a tooltip on hover with a text label

Toggles should have a clear on/off visual state (not just color — use a filled vs. outline icon or a switch)

Keyboard: Esc clears selection; this should be mentioned as a supported interaction even though wiring it up is a later step

8. States to Design For (all frontend-only, mockable)

No file uploaded (empty viewport + empty sidebar + empty inspector)

File uploading (progress state)

File loaded, nothing selected

File loaded, Face selected

File loaded, Edge selected

File loaded, Vertex selected

File loaded, Shell/Body selected

Upload error

Sidebar/Inspector panels collapsed (narrow screen)

9. Explicitly Out of Scope for This Build

No backend integration — use static/mock/dummy data for all model stats, entity metadata, and feature lists

No real CAD parsing or 3D file processing

No ML-based feature recognition — feature list and tabs are static placeholders

No landing/marketing page — app opens directly to the upload/viewport screen

No authentication, no multi-project management, no export functionality (yet)

10. Summary Instruction (for the app builder)

Build a three-panel engineering tool UI — top bar, left sidebar, center 3D viewport, right tabbed inspector — with a clean, minimal, neutral visual style and one accent color for selection states. Every button must have a visible text label or a tooltip. Use mock data throughout to represent an uploaded STEP file, its topology counts, and example Face/Edge/Vertex/Shell selections, so all UI states listed in Section 8 can be demonstrated without any real backend or 3D processing.


make me proper front end of this web app

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7ff4651c-f178-405f-b876-505b808b3612).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
