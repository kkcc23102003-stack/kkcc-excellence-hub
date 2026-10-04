/**
 * Handwritten / pasted note editor — the "notes app" feel inside the admin panel.
 *
 * The admin can:
 *   - write with a finger / stylus / mouse (pen, highlighter, eraser),
 *   - paste a screenshot or an image copied from any notes app (Ctrl+V),
 *   - pick a photo from the device and draw on top of it,
 *   - undo, clear, change colour and thickness,
 *   - save the page as a PNG and drop it straight into the study note.
 *
 * The drawing is a real `<canvas>`: pointer events cover touch, pen and mouse,
 * so it behaves the same on a phone, a tablet and a laptop.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Eraser,
  Highlighter,
  ImagePlus,
  Loader2,
  Pen,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Tool = "pen" | "highlighter" | "eraser";

const COLORS = ["#0f172a", "#1d4ed8", "#b91c1c", "#047857", "#7c3aed", "#c2410c"];
const CANVAS_WIDTH = 1240;
const CANVAS_HEIGHT = 1754; // A4 proportions at ~150 DPI.

export type NotesCanvasEditorProps = {
  /** Saves the PNG and inserts it into the note text. */
  onInsert: (image: { dataUrl: string; caption: string }) => Promise<void> | void;
  onClose: () => void;
};

export function NotesCanvasEditor({ onInsert, onClose }: NotesCanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]!);
  const [size, setSize] = useState(4);
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const undoStack = useRef<string[]>([]);

  const context = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    return ctx;
  }, []);

  const snapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (undoStack.current.length > 12) undoStack.current.shift();
    undoStack.current.push(canvas.toDataURL("image/png"));
  }, []);

  // White page with a faint margin line, like ruled paper.
  const paintBackground = useCallback(() => {
    const ctx = context();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#fde68a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 140);
    ctx.lineTo(canvas.width, 140);
    ctx.stroke();
  }, [context]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    paintBackground();
  }, [paintBackground]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = context();
    if (!ctx) return;
    event.preventDefault();
    snapshot();
    drawing.current = true;
    lastPoint.current = pointFromEvent(event);
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = color;
    ctx.globalAlpha = tool === "highlighter" ? 0.32 : 1;
    ctx.lineWidth = tool === "highlighter" ? size * 3.4 : tool === "eraser" ? size * 6 : size * 1.6;
    ctx.beginPath();
    const point = lastPoint.current;
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x + 0.1, point.y + 0.1);
    ctx.stroke();
    setHasInk(true);
  };

  const moveStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = context();
    if (!ctx) return;
    event.preventDefault();
    const point = pointFromEvent(event);
    const previous = lastPoint.current ?? point;
    ctx.beginPath();
    ctx.moveTo(previous.x, previous.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint.current = point;
  };

  const endStroke = () => {
    drawing.current = false;
    lastPoint.current = null;
    const ctx = context();
    if (ctx) {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }
  };

  const drawImageOntoCanvas = useCallback(
    (source: HTMLImageElement | ImageBitmap, width: number, height: number) => {
      const ctx = context();
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;
      snapshot();
      const scale = Math.min(canvas.width / width, canvas.height / height, 1.6);
      const drawWidth = width * scale;
      const drawHeight = height * scale;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.drawImage(
        source as CanvasImageSource,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
      setHasInk(true);
    },
    [context, snapshot],
  );

  // Paste from any notes app: Ctrl/Cmd+V puts the copied page on the canvas.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items ?? [];
      for (const item of items) {
        if (!item.type.startsWith("image/")) continue;
        const file = item.getAsFile();
        if (!file) continue;
        event.preventDefault();
        void loadFile(file);
        return;
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Sirf image paste ya upload kar sakte hain");
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Image load failed"));
        image.src = url;
      });
      drawImageOntoCanvas(image, image.naturalWidth, image.naturalHeight);
      toast.success("Image canvas par lag gayi — uske upar likh sakte hain");
    } catch {
      toast.error("Ye image load nahi ho payi");
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = context();
    if (!canvas || !ctx) return;
    const previous = undoStack.current.pop();
    if (!previous) {
      paintBackground();
      setHasInk(false);
      return;
    }
    const image = new Image();
    image.onload = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = previous;
  };

  const clearAll = () => {
    snapshot();
    paintBackground();
    setHasInk(false);
  };

  const save = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasInk) {
      toast.info("Pehle kuch likhein ya photo lagayein");
      return;
    }
    setSaving(true);
    try {
      // JPEG keeps a full page small enough for a fast mobile download.
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      await onInsert({ dataUrl, caption: caption.trim() || "Handwritten note" });
      toast.success("Note me add ho gaya");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save nahi ho paya");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden rounded-none border-0 bg-background shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-3xl sm:border"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-black">Handwritten / photo note</h2>
            <p className="text-[11px] text-muted-foreground">
              Finger, stylus ya mouse se likhein · Ctrl+V se screenshot paste karein
            </p>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-2">
          {(
            [
              { id: "pen", label: "Pen", icon: Pen },
              { id: "highlighter", label: "Marker", icon: Highlighter },
              { id: "eraser", label: "Eraser", icon: Eraser },
            ] as const
          ).map((entry) => (
            <Button
              key={entry.id}
              size="sm"
              variant={tool === entry.id ? "default" : "outline"}
              className="h-8 rounded-full px-3 text-xs"
              onClick={() => setTool(entry.id)}
            >
              <entry.icon className="mr-1 h-3.5 w-3.5" />
              {entry.label}
            </Button>
          ))}
          <div className="mx-1 h-6 w-px bg-border" />
          {COLORS.map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`Colour ${value}`}
              onClick={() => {
                setColor(value);
                setTool(tool === "eraser" ? "pen" : tool);
              }}
              className={`h-6 w-6 rounded-full border-2 ${color === value ? "border-foreground" : "border-transparent"}`}
              style={{ backgroundColor: value }}
            />
          ))}
          <div className="mx-1 h-6 w-px bg-border" />
          <label className="flex items-center gap-1 text-[11px] font-semibold">
            Size
            <input
              type="range"
              min={1}
              max={12}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="w-20"
            />
          </label>
          <div className="mx-1 h-6 w-px bg-border" />
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-full px-3 text-xs"
            onClick={undo}
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Undo
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-full px-3 text-xs"
            onClick={clearAll}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-full px-3 text-xs"
            onClick={() => fileRef.current?.click()}
          >
            <ImagePlus className="mr-1 h-3.5 w-3.5" />
            Photo
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void loadFile(file);
              event.target.value = "";
            }}
          />
        </div>

        <div className="flex-1 overflow-auto bg-muted/30 p-3">
          <canvas
            ref={canvasRef}
            onPointerDown={startStroke}
            onPointerMove={moveStroke}
            onPointerUp={endStroke}
            onPointerLeave={endStroke}
            onPointerCancel={endStroke}
            className="mx-auto block w-full max-w-[720px] touch-none rounded-xl border bg-white shadow-sm"
            style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
          />
        </div>

        <div className="shrink-0 space-y-2 border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div>
            <Label className="text-xs">Caption (student ko dikhega)</Label>
            <Input
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="e.g. Human lungs — labelled diagram (handwritten)"
              className="mt-1"
            />
          </div>
          <Button
            className="w-full rounded-full font-bold"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save page into notes
          </Button>
        </div>
      </div>
    </div>
  );
}
