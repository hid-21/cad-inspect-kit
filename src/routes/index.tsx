import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Box,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Crosshair,
  Eye,
  FileBox,
  Focus,
  Layers3,
  Maximize,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TopoInspect — CAD Topology Workstation" },
      { name: "description", content: "Inspect CAD model geometry, topology, features, and diagnostics in a focused engineering workstation." },
      { property: "og:title", content: "TopoInspect — CAD Topology Workstation" },
      { property: "og:description", content: "A focused engineering workstation for inspecting CAD topology." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type AppState = "empty" | "loading" | "loaded" | "error";
type Selection = "face" | "edge" | "vertex" | "body" | null;

const sectionStats: Array<[string, string]> = [
  ["Bodies", "1"], ["Shells", "1"], ["Faces", "48"], ["Edges", "112"], ["Vertices", "64"],
];

const geometry: Record<Exclude<Selection, null>, Array<[string, string]>> = {
  face: [["Face ID", "Face #32"], ["Surface type", "Cylindrical"], ["Area", "284.61 mm²"], ["Perimeter", "76.40 mm"], ["Normal direction", "(0.000, 1.000, 0.000)"], ["Adjacent faces", "#12, #31, #40"], ["Adjacent edges", "#72, #73, #81, #82"]],
  edge: [["Edge ID", "Edge #72"], ["Curve type", "Circular arc"], ["Length", "22.84 mm"], ["Start vertex", "Vertex #18"], ["End vertex", "Vertex #19"], ["Adjacent faces", "#31, #32"], ["Continuity", "Convex"]],
  vertex: [["Vertex ID", "Vertex #18"], ["X", "24.000 mm"], ["Y", "16.500 mm"], ["Z", "8.000 mm"], ["Connected edges", "3"], ["Connected faces", "3"]],
  body: [["Shell ID", "Shell #1"], ["Status", "Closed / manifold"], ["Faces", "48"], ["Edges", "112"], ["Vertices", "64"], ["Volume", "18,420.34 mm³"], ["Surface area", "6,194.82 mm²"]],
};

const selectionName: Record<Exclude<Selection, null>, string> = { face: "Face #32", edge: "Edge #72", vertex: "Vertex #18", body: "Body #1" };
const selectionTypeName: Record<Exclude<Selection, null>, string> = { face: "Face", edge: "Edge", vertex: "Vertex", body: "Shell / Body" };

function Index() {
  const [appState, setAppState] = useState<AppState>("empty");
  const [selection, setSelection] = useState<Selection>(null);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [edges, setEdges] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sections, setSections] = useState<Record<"model" | "summary" | "features" | "tree", boolean>>({ model: true, summary: true, features: true, tree: true });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSelection(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (appState !== "loading") return;
    setProgress(12);
    const timer = window.setInterval(() => setProgress((value) => Math.min(value + 13, 94)), 180);
    const done = window.setTimeout(() => { window.clearInterval(timer); setProgress(100); setAppState("loaded"); }, 1500);
    return () => { window.clearInterval(timer); window.clearTimeout(done); };
  }, [appState]);

  const upload = () => { setSelection(null); setProgress(0); setAppState("loading"); };
  const reset = () => { setAppState("empty"); setSelection(null); setProgress(0); setWireframe(false); setEdges(true); };
  const toggleSection = (key: keyof typeof sections) => setSections((current) => ({ ...current, [key]: !current[key] }));

  return (
    <TooltipProvider delayDuration={350}>
      <main className="flex h-dvh min-h-[620px] flex-col overflow-hidden bg-background text-foreground">
        <header className="flex h-14 shrink-0 items-center border-b border-border bg-panel px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center gap-2.5 pr-2 sm:pr-5">
              <div className="grid size-7 place-items-center border border-primary bg-primary text-primary-foreground"><Layers3 className="size-4" /></div>
              <span className="hidden text-sm font-semibold tracking-normal sm:block">TopoInspect</span>
            </div>
            <input ref={inputRef} type="file" accept=".step,.stp" className="hidden" onChange={upload} />
            <Button size="sm" onClick={() => inputRef.current?.click()}><Upload /> Upload Model</Button>
            <span className="hidden text-xs text-muted-foreground lg:block">STEP / STP</span>
            {appState !== "empty" && <><span className="hidden h-5 w-px bg-border md:block" /><div className="hidden min-w-0 items-center gap-2 text-xs md:flex"><FileBox className="size-4 text-muted-foreground" /><span className="max-w-48 truncate font-medium">bracket_rev04.step</span><span className="rounded-sm border border-success/30 bg-success-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-success">Ready</span></div></>}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> <span className="hidden sm:inline">Reset Session</span></Button>
            <Tooltip><TooltipTrigger asChild><Button aria-label="Open help" variant="ghost" size="icon"><CircleHelp /></Button></TooltipTrigger><TooltipContent>Help and keyboard controls</TooltipContent></Tooltip>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <aside className={cn("relative shrink-0 border-r border-border bg-panel transition-[width] duration-200", leftOpen ? "w-[270px] max-xl:w-[232px]" : "w-11")}>
            <PanelToggle side="left" open={leftOpen} onClick={() => setLeftOpen(!leftOpen)} />
            {!leftOpen ? <CollapsedRail icon={Layers3} label="Model browser" /> : <div className="h-full overflow-y-auto pt-10">
              <PanelSection title="Current model" sectionKey="model" open={sections.model} onToggle={toggleSection}>
                {appState === "empty" ? <EmptyPanel /> : <div className="space-y-2 px-4 pb-4 text-xs"><DataRow label="File" value="bracket_rev04.step" /><DataRow label="Units" value="mm" /><DataRow label="Imported" value="Today, 10:08" /></div>}
              </PanelSection>
              <PanelSection title="Topology summary" sectionKey="summary" open={sections.summary} onToggle={toggleSection}>
                {appState === "empty" ? <EmptyPanel /> : <div className="px-4 pb-4">{sectionStats.map(([label, value]) => <DataRow key={label} label={label} value={value} />)}</div>}
              </PanelSection>
              <PanelSection title="Feature list" sectionKey="features" open={sections.features} onToggle={toggleSection}>
                {appState === "empty" ? <EmptyPanel /> : <div className="pb-3"><FeatureRow name="Chamfer" count={4} active={selection === "face"} onClick={() => setSelection("face")} /><FeatureRow name="Fillet" count={2} active={false} onClick={() => setSelection("edge")} /><FeatureRow name="Through hole" count={3} active={false} onClick={() => setSelection("face")} /></div>}
              </PanelSection>
              <PanelSection title="Topology tree" sectionKey="tree" open={sections.tree} onToggle={toggleSection}>
                {appState === "empty" ? <EmptyPanel /> : <TopologyTree onSelect={setSelection} />}
              </PanelSection>
            </div>}
          </aside>

          <section className="relative min-w-0 flex-1 overflow-hidden bg-viewport" aria-label="3D model viewport">
            <DemoControls appState={appState} selection={selection} setAppState={setAppState} setSelection={setSelection} />
            {appState === "empty" && <EmptyViewport onUpload={() => inputRef.current?.click()} onDrop={(event) => { event.preventDefault(); upload(); }} />}
            {appState === "loading" && <LoadingViewport progress={progress} />}
            {appState === "error" && <ErrorViewport onTry={upload} onNew={() => inputRef.current?.click()} />}
            {appState === "loaded" && <LoadedViewport selection={selection} setSelection={setSelection} wireframe={wireframe} setWireframe={setWireframe} edges={edges} setEdges={setEdges} />}
          </section>

          <aside className={cn("relative shrink-0 border-l border-border bg-panel transition-[width] duration-200", rightOpen ? "w-[320px] max-xl:w-[285px]" : "w-11")}>
            <PanelToggle side="right" open={rightOpen} onClick={() => setRightOpen(!rightOpen)} />
            {!rightOpen ? <CollapsedRail icon={Crosshair} label="Inspector" /> : <Inspector appState={appState} selection={selection} setSelection={setSelection} />}
          </aside>
        </div>
      </main>
    </TooltipProvider>
  );
}

function PanelToggle({ side, open, onClick }: { side: "left" | "right"; open: boolean; onClick: () => void }) {
  const Icon = side === "left" ? (open ? PanelLeftClose : PanelLeftOpen) : (open ? PanelRightClose : PanelRightOpen);
  return <Tooltip><TooltipTrigger asChild><Button aria-label={`${open ? "Collapse" : "Expand"} ${side} panel`} variant="ghost" size="icon" className={cn("absolute top-1 z-20 size-8", side === "left" ? "right-1" : "left-1")} onClick={onClick}><Icon /></Button></TooltipTrigger><TooltipContent side={side === "left" ? "right" : "left"}>{open ? "Collapse" : "Expand"} {side} panel</TooltipContent></Tooltip>;
}

function CollapsedRail({ icon: Icon, label }: { icon: typeof Layers3; label: string }) { return <div className="flex h-full flex-col items-center pt-14"><Icon className="size-4 text-muted-foreground" /><span className="mt-3 text-[10px] font-semibold uppercase text-muted-foreground [writing-mode:vertical-rl]">{label}</span></div>; }

function PanelSection({ title, sectionKey, open, onToggle, children }: { title: string; sectionKey: "model" | "summary" | "features" | "tree"; open: boolean; onToggle: (key: "model" | "summary" | "features" | "tree") => void; children: React.ReactNode }) {
  return <section className="border-b border-border"><button className="flex h-10 w-full items-center justify-between px-4 text-left text-[10px] font-semibold uppercase text-muted-foreground hover:bg-muted" onClick={() => onToggle(sectionKey)}><span>{title}</span>{open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}</button>{open && children}</section>;
}

function EmptyPanel() { return <p className="px-4 pb-4 text-xs text-muted-foreground">No model loaded</p>; }
function DataRow({ label, value }: { label: string; value: string }) { return <div className="flex min-h-7 items-center justify-between gap-3 border-b border-border/70 py-1.5 last:border-0"><span className="text-xs text-muted-foreground">{label}</span><span className="truncate text-right text-xs font-medium tabular-nums">{value}</span></div>; }
function FeatureRow({ name, count, active, onClick }: { name: string; count: number; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={cn("flex w-full items-center gap-2 px-4 py-2 text-xs hover:bg-muted", active && "border-l-2 border-primary bg-selected text-primary")}><ChevronRight className="size-3.5" /><span>{name}</span><span className="ml-auto tabular-nums text-muted-foreground">{count}</span></button>; }

function TopologyTree({ onSelect }: { onSelect: (value: Selection) => void }) {
  return <div className="pb-4 text-xs"><button onClick={() => onSelect("body")} className="flex w-full items-center gap-1.5 px-4 py-1.5 hover:bg-muted"><ChevronDown className="size-3.5" /><Box className="size-3.5 text-primary" />Body #1</button><button onClick={() => onSelect("body")} className="flex w-full items-center gap-1.5 py-1.5 pl-9 pr-3 hover:bg-muted"><ChevronDown className="size-3.5" />Shell #1</button>{[["Faces", "48", "face"], ["Edges", "112", "edge"], ["Vertices", "64", "vertex"]].map(([name, count, type]) => <button key={name} onClick={() => onSelect(type as Selection)} className="flex w-full items-center gap-1.5 py-1.5 pl-14 pr-4 hover:bg-muted"><ChevronRight className="size-3.5 text-muted-foreground" /><span>{name}</span><span className="ml-auto text-muted-foreground">{count}</span></button>)}</div>;
}

function DemoControls({ appState, selection, setAppState, setSelection }: { appState: AppState; selection: Selection; setAppState: (value: AppState) => void; setSelection: (value: Selection) => void }) {
  const value = appState === "loaded" ? selection ?? "loaded" : appState;
  return <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 border border-border bg-panel/95 p-1 shadow-sm backdrop-blur"><span className="hidden px-2 text-[9px] font-bold uppercase text-muted-foreground lg:block">Demo state</span>{["empty", "loading", "loaded", "face", "edge", "vertex", "body", "error"].map((item) => <button key={item} onClick={() => { if (["face", "edge", "vertex", "body"].includes(item)) { setAppState("loaded"); setSelection(item as Selection); } else { setAppState(item as AppState); setSelection(null); } }} className={cn("px-2 py-1 text-[10px] capitalize text-muted-foreground hover:bg-muted", value === item && "bg-primary text-primary-foreground hover:bg-primary")}>{item}</button>)}</div>;
}

function EmptyViewport({ onUpload, onDrop }: { onUpload: () => void; onDrop: (event: DragEvent) => void }) { return <div className="grid h-full place-items-center p-8"><button onClick={onUpload} onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className="group flex w-full max-w-[480px] flex-col items-center border border-dashed border-strong bg-panel/70 px-10 py-14 text-center hover:border-primary hover:bg-selected"><div className="mb-5 grid size-12 place-items-center border border-border bg-background text-muted-foreground group-hover:text-primary"><Upload className="size-5" /></div><span className="text-sm font-medium">Drag and drop a STEP file here, or click to upload</span><span className="mt-2 text-xs text-muted-foreground">Supported formats: .STEP, .STP · Maximum 250 MB</span></button></div>; }
function LoadingViewport({ progress }: { progress: number }) { return <div className="grid h-full place-items-center"><div className="w-72 text-center"><div className="mx-auto mb-5 size-8 animate-spin rounded-full border-2 border-border border-t-primary" /><p className="text-sm font-medium">Processing model…</p><p className="mt-1 text-xs text-muted-foreground">Reading topology and surface data</p><div className="mt-5 h-1 w-full overflow-hidden bg-muted"><div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-right text-[10px] tabular-nums text-muted-foreground">{progress}%</p></div></div>; }
function ErrorViewport({ onTry, onNew }: { onTry: () => void; onNew: () => void }) { return <div className="grid h-full place-items-center p-8"><div className="max-w-md border border-destructive/30 bg-panel p-7 text-center shadow-sm"><AlertTriangle className="mx-auto size-7 text-destructive" /><h2 className="mt-4 text-sm font-semibold">The STEP file could not be processed</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">The file contains an incomplete B-Rep shell near Face #17. Check the source model or upload a different revision.</p><div className="mt-5 flex justify-center gap-2"><Button size="sm" onClick={onTry}><RotateCcw /> Try Again</Button><Button size="sm" variant="outline" onClick={onNew}><Upload /> Upload New File</Button></div></div></div>; }

function LoadedViewport({ selection, setSelection, wireframe, setWireframe, edges, setEdges }: { selection: Selection; setSelection: (value: Selection) => void; wireframe: boolean; setWireframe: (value: boolean) => void; edges: boolean; setEdges: (value: boolean) => void }) {
  return <div className="viewport-grid relative h-full w-full overflow-hidden">
    <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-1 border border-border bg-panel/95 p-1 shadow-sm"><Button variant="ghost" size="sm"><Maximize /> Fit to View</Button><Button variant="ghost" size="sm"><Focus /> Reset Camera</Button><div className="mx-1 h-5 w-px bg-border" /><label className="flex h-8 items-center gap-2 px-2 text-xs"><Switch checked={wireframe} onCheckedChange={setWireframe} /> Wireframe</label><label className="flex h-8 items-center gap-2 px-2 text-xs"><Switch checked={edges} onCheckedChange={setEdges} /> Edges</label>{selection && <><div className="mx-1 h-5 w-px bg-border" /><Button variant="ghost" size="sm" onClick={() => setSelection(null)}><X /> Clear Selection</Button></>}</div>
    {selection && <div className="absolute left-1/2 top-20 z-20 -translate-x-1/2 border border-primary bg-selected px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">{selectionName[selection]}</div>}
    <div className="absolute inset-0 flex items-center justify-center px-12 pb-16 pt-20"><ModelGraphic selection={selection} wireframe={wireframe} edges={edges} onSelect={setSelection} /></div>
    <div className="absolute bottom-5 right-5 z-20 size-20 text-[9px] font-semibold"><div className="absolute bottom-3 left-1/2 h-10 w-px -translate-x-1/2 bg-axis-y" /><span className="absolute left-[42px] top-0 text-axis-y">Y</span><div className="absolute bottom-3 left-1/2 h-px w-10 bg-axis-x" /><span className="absolute right-0 top-[35px] text-axis-x">X</span><div className="absolute bottom-3 right-1/2 h-px w-8 origin-right -rotate-45 bg-axis-z" /><span className="absolute left-0 top-[46px] text-axis-z">Z</span><div className="absolute bottom-2 left-1/2 size-2 -translate-x-1/2 rounded-full bg-foreground" /></div>
    <div className="absolute bottom-4 left-4 text-[10px] text-muted-foreground">Perspective · millimeters</div>
  </div>;
}

function ModelGraphic({ selection, wireframe, edges, onSelect }: { selection: Selection; wireframe: boolean; edges: boolean; onSelect: (value: Selection) => void }) {
  return <svg viewBox="0 0 700 500" className="h-full max-h-[620px] w-full max-w-[850px] drop-shadow-xl" role="img" aria-label="Mock three dimensional mounting bracket model">
    <g className={cn("model-shape", wireframe && "wireframe", !edges && "no-edges")}>
      <path onClick={() => onSelect("body")} className={cn("model-side", selection === "body" && "selected-part")} d="M162 333 350 425 562 306 376 216Z" />
      <path className="model-front" d="M162 333V373L350 466V425Z" /><path className="model-side-dark" d="M350 425V466L562 347V306Z" />
      <path onClick={() => onSelect("face")} className={cn("model-face", selection === "face" && "selected-part")} d="M236 304 353 363 482 290 365 234Z" />
      <path className="model-raised" d="M236 304V243L365 171 482 228V290L353 363Z" />
      <path className="model-face" d="M236 243 365 312 482 246 365 181Z" />
      <ellipse onClick={() => onSelect("edge")} className={cn("model-hole", selection === "edge" && "selected-stroke")} cx="365" cy="245" rx="46" ry="25" />
      <ellipse className="model-hole-inner" cx="365" cy="245" rx="26" ry="14" />
      <path className="model-support" d="M248 300 248 203 307 170 307 268Z" /><path className="model-support-light" d="M248 203 264 212 323 179 307 170Z" />
      <path className="model-support" d="M423 321 423 220 465 244 465 298Z" />
      <circle onClick={() => onSelect("vertex")} className={cn("model-vertex", selection === "vertex" && "selected-vertex")} cx="162" cy="333" r="7" />
      <path className="construction" d="M104 418H616M116 441H604M210 116V430M521 139V389" />
    </g>
  </svg>;
}

function Inspector({ appState, selection, setSelection }: { appState: AppState; selection: Selection; setSelection: (value: Selection) => void }) {
  if (appState !== "loaded" || !selection) return <div className="flex h-full flex-col pt-10"><div className="border-b border-border px-4 pb-3 text-[10px] font-semibold uppercase text-muted-foreground">Inspector</div><div className="grid flex-1 place-items-center px-8 text-center"><div><Crosshair className="mx-auto mb-3 size-5 text-muted-foreground" /><p className="text-xs leading-5 text-muted-foreground">Click on the model to inspect an element.</p></div></div></div>;
  const title = selectionName[selection];
  return <div className="flex h-full flex-col pt-10"><div className="flex items-center gap-2 border-b border-border px-4 pb-3"><div><p className="text-[10px] font-semibold uppercase text-muted-foreground">Current selection</p><p className="mt-1 text-sm font-semibold">{title}</p></div><Button className="ml-auto" variant="ghost" size="icon" aria-label="Clear selection" onClick={() => setSelection(null)}><X /></Button></div><Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col"><TabsList className="h-auto w-full justify-start gap-0 overflow-x-auto rounded-none border-b border-border bg-transparent p-0"><Tab value="overview" label="Overview" /><Tab value="geometry" label="Geometry" /><Tab value="topology" label="Topology" /><Tab value="feature" label="Feature" /><Tab value="diagnostics" label="Diagnostics" /></TabsList><div className="min-h-0 flex-1 overflow-y-auto p-4"><TabsContent value="overview" className="m-0"><InspectorRows rows={[["Selection type", selectionTypeName[selection]], ["Internal ID", title], ["Source file", "bracket_rev04.step"], ["Model units", "Millimeters (mm)"]]} /></TabsContent><TabsContent value="geometry" className="m-0"><InspectorRows rows={geometry[selection]} clickable /></TabsContent><TabsContent value="topology" className="m-0"><p className="section-label">Relationships</p><div className="mt-3 border-l border-border pl-3 text-xs leading-7"><button className="block text-primary hover:underline">Body #1</button><button className="ml-3 block text-primary hover:underline">Shell #1</button><span className="ml-6 block font-medium">{title}</span><button className="ml-9 block text-primary hover:underline">Adjacent entities (3)</button></div></TabsContent><TabsContent value="feature" className="m-0">{selection === "face" || selection === "edge" ? <><p className="section-label">Linked feature</p><button className="mt-3 flex w-full items-center justify-between border border-border p-3 text-xs hover:border-primary hover:bg-selected"><span>Part of: <strong>Chamfer #3</strong></span><ChevronRight className="size-4" /></button></> : <p className="py-8 text-center text-xs text-muted-foreground">No feature associated</p>}</TabsContent><TabsContent value="diagnostics" className="m-0"><div className="py-8 text-center"><Eye className="mx-auto mb-3 size-5 text-success" /><p className="text-xs font-medium">No issues detected</p><p className="mt-1 text-xs text-muted-foreground">This entity passed all topology checks.</p></div></TabsContent></div></Tabs><div className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground">Press <kbd className="border border-border bg-muted px-1">Esc</kbd> to clear selection</div></div>;
}

function Tab({ value, label }: { value: string; label: string }) { return <TabsTrigger value={value} title={label} className="h-9 rounded-none border-b-2 border-transparent px-2 text-[10px] data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">{label}</TabsTrigger>; }
function InspectorRows({ rows, clickable = false }: { rows: Array<[string, string]>; clickable?: boolean }) { return <div><p className="section-label">Properties</p><dl className="mt-3">{rows.map(([label, value]) => <div key={label} className="border-b border-border py-2.5 last:border-0"><dt className="text-[10px] text-muted-foreground">{label}</dt><dd className={cn("mt-1 text-xs font-medium tabular-nums", clickable && (label.includes("Adjacent") || label.includes("vertex")) && "cursor-pointer text-primary hover:underline")}>{value}</dd></div>)}</dl></div>; }