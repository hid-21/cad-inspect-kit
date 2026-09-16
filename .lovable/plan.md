# CAD Topology Inspector Frontend

## Goal
Build the app’s working screen as a responsive three-panel engineering workstation using mock data only.

## Interface
- Add a fixed top bar with product name, model upload, supported-format hint, current file, reset, and help.
- Add collapsible left and right panels with a flexible central inspection viewport.
- Use a neutral light design system with a restrained cyan-blue accent, compact technical typography, borders, and flat surfaces.
- Collapse side panels to compact icon rails at narrower laptop widths.

## Mock workflow and states
- Start in the empty upload state with drag-and-drop and file picker support.
- Simulate upload progress, successful model loading, and upload failure.
- Provide a compact demo-state selector so every requested state can be reviewed without real CAD processing.
- Support face, edge, vertex, and body/shell selections with distinct mock inspection data.
- Wire Escape and Clear Selection to remove the current selection.

## Workstation details
- Left panel: collapsible Current Model, Topology Summary, Feature List, and Topology Tree sections.
- Center: technical grid viewport, representative mock mechanical geometry, view controls, edge/wireframe switches, selection label, and axis gizmo.
- Right panel: Overview, Geometry, Topology, Feature, and Diagnostics tabs with contextual label/value data.
- Add clear loading and error presentations inside the viewport.

## Validation
- Verify the empty, loading, loaded, selected, error, and collapsed states in the live app.
- Check desktop and laptop-sized layouts for clipping, overlap, and usable controls.
- Add route-specific title and social metadata.

## Technical details
- Keep everything frontend-only in React state; no persistence, API, or CAD parser.
- Use existing interface primitives and Lucide icons.
- Define all visual colors, typography, and shadows as semantic tokens in the global stylesheet.
