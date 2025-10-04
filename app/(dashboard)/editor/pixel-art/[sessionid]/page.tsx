'use client';

import { useParams } from 'next/navigation';
import { useState, useRef, useEffect, useCallback, SVGProps } from 'react';
import { Pencil, Eraser, Beaker } from 'lucide-react'; // New, better icons

// Inline EyeDropper icon because this lucide-react version doesn't export EyeDropper
const EyeDropper = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 17l-4 4 4-1 1-4z" />
    <path d="M14.7 10.3l-2.4 2.4" />
    <path d="M10.5 3.5l4 4" />
    <path d="M15.8 9.2l1 1" />
  </svg>
);

// Define the grid size
const GRID_WIDTH = 64;
const GRID_HEIGHT = 64;

export default function PixelArtEditorPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the canvas's parent container

  // --- STATE MANAGEMENT ---
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'eyedropper' | 'fill'>('pencil');
  const [color, setColor] = useState('#000000');
  // Store the entire canvas state in a 2D array
  const [pixels, setPixels] = useState<Array<Array<string | null>>>(() => 
    Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null))
  );
  // State for zoom and pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // --- CORE DRAWING FUNCTION ---
  // This function redraws the entire canvas from the `pixels` array.
  // It's called on every change (draw, zoom, pan, resize).
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply pan and zoom transformation
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    const pixelSize = 10; // Base size of a pixel
    // Draw each pixel from the state
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (pixels[y][x]) {
          ctx.fillStyle = pixels[y][x]!;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    ctx.restore();
  }, [pixels, zoom, pan]);

  // --- RESPONSIVE CANVAS LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // ResizeObserver is the modern way to detect element resizing
    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      canvas.width = entry.contentRect.width;
      canvas.height = entry.contentRect.height;
      redrawCanvas();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect(); // Cleanup
  }, [redrawCanvas]);

  // --- EVENT HANDLERS ---
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const pixelSize = 10;
    // Translate screen coordinates to canvas grid coordinates, accounting for pan and zoom
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    return {
      gridX: Math.floor(x / pixelSize),
      gridY: Math.floor(y / pixelSize),
    };
  };

  const floodFill = (x: number, y: number, newColor: string) => {
    const oldColor = pixels[y]?.[x];
    if (oldColor === newColor || oldColor === undefined) return;

    const queue: [number, number][] = [[x, y]];
    const newPixels = pixels.map(row => [...row]);

    while (queue.length > 0) {
      const [px, py] = queue.shift()!;
      if (px < 0 || px >= GRID_WIDTH || py < 0 || py >= GRID_HEIGHT) continue;
      if (newPixels[py][px] === oldColor) {
        newPixels[py][px] = newColor;
        queue.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
      }
    }
    setPixels(newPixels);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1) { // Middle mouse button for panning
      isPanning.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }
    
    const { gridX, gridY } = getMousePos(e);
    if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) return;

    const newPixels = pixels.map(row => [...row]);

    switch (tool) {
      case 'pencil':
        newPixels[gridY][gridX] = color;
        setPixels(newPixels);
        break;
      case 'eraser':
        newPixels[gridY][gridX] = null; // Erasing removes the pixel from state
        setPixels(newPixels);
        break;
      case 'eyedropper':
        setColor(pixels[gridY][gridX] || '#000000');
        setTool('pencil'); // Switch back to pencil after picking a color
        break;
      case 'fill':
        floodFill(gridX, gridY, color);
        break;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      redrawCanvas(); // Redraw on pan
      return;
    }

    if (e.buttons !== 1) return;
    const { gridX, gridY } = getMousePos(e);
    if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) return;

    const newPixels = pixels.map(row => [...row]);
    if (tool === 'pencil' && newPixels[gridY][gridX] !== color) {
      newPixels[gridY][gridX] = color;
      setPixels(newPixels);
    } else if (tool === 'eraser' && newPixels[gridY][gridX] !== null) {
      newPixels[gridY][gridX] = null;
      setPixels(newPixels);
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.001;
    setZoom(Math.max(0.5, Math.min(newZoom, 5))); // Clamp zoom level
    redrawCanvas(); // Redraw on zoom
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Pixel Art Canvas</h1>
        <p className="mt-1 text-slate-600">Session: <span className="font-mono bg-slate-200 p-1 rounded-md text-sm">{sessionId}</span></p>
        
        <div className="mt-4 p-2 border rounded-xl bg-slate-50 flex items-center gap-2 flex-wrap">
          <button onClick={() => setTool('pencil')} title="Pencil" className={`p-2 rounded-md ${tool === 'pencil' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}><Pencil className="w-5 h-5" /></button>
          <button onClick={() => setTool('eraser')} title="Eraser" className={`p-2 rounded-md ${tool === 'eraser' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}><Eraser className="w-5 h-5" /></button>
          <button onClick={() => setTool('fill')} title="Fill" className={`p-2 rounded-md ${tool === 'fill' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}><Beaker className="w-5 h-5" /></button>
          <button onClick={() => setTool('eyedropper')} title="Eyedropper" className={`p-2 rounded-md ${tool === 'eyedropper' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}><EyeDropper className="w-5 h-5" /></button>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-9 p-1 border-none bg-transparent rounded-md cursor-pointer" />
        </div>
      </div>
      
      <div ref={containerRef} className="flex-grow mt-4 border rounded-xl overflow-hidden bg-white cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // Stop panning if mouse leaves canvas
          onWheel={handleWheel}
        />
      </div>
    </div>
  );
}