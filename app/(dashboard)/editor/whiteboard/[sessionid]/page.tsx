'use client';

import { useParams } from 'next/navigation';
import { useState, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import { HandRaisedIcon, StopIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

export default function WhiteboardEditorPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [tool, setTool] = useState<'pen' | 'rectangle' | 'circle'>('pen');
  const [shapes, setShapes] = useState<any[]>([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    if (tool === 'pen') {
      setShapes([...shapes, { tool, points: [pos.x, pos.y] }]);
    } else {
      setShapes([...shapes, { tool, x: pos.x, y: pos.y, width: 0, height: 0 }]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastShape = shapes[shapes.length - 1];

    if (lastShape.tool === 'pen') {
      lastShape.points = lastShape.points.concat([point.x, point.y]);
      shapes.splice(shapes.length - 1, 1, lastShape);
      setShapes(shapes.concat());
    } else { // Rectangle or Circle
      lastShape.width = point.x - lastShape.x;
      lastShape.height = point.y - lastShape.y;
      shapes.splice(shapes.length - 1, 1, lastShape);
      setShapes(shapes.concat());
    }
    // Broadcast shape updates via Supabase Realtime
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Collaborative Whiteboard</h1>
        <p className="mt-1 text-slate-600">Session: <span className="font-mono bg-slate-200 p-1 rounded-md text-sm">{sessionId}</span></p>

        {/* Toolbar */}
        <div className="mt-4 p-2 border rounded-xl bg-slate-50 flex items-center gap-2">
          <button onClick={() => setTool('pen')} className={`p-2 rounded-md ${tool === 'pen' ? 'bg-indigo-100' : 'hover:bg-slate-200'}`}><HandRaisedIcon className="w-5 h-5" /></button>
          <button onClick={() => setTool('rectangle')} className={`p-2 rounded-md ${tool === 'rectangle' ? 'bg-indigo-100' : 'hover:bg-slate-200'}`}><StopIcon className="w-5 h-5" /></button>
          <button onClick={() => setTool('circle')} className={`p-2 rounded-md ${tool === 'circle' ? 'bg-indigo-100' : 'hover:bg-slate-200'}`}><ChatBubbleOvalLeftIcon className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Canvas using Konva */}
      <div className="flex-grow mt-4 border rounded-xl overflow-hidden">
        <Stage
          width={window.innerWidth - 350} // Adjust size as needed
          height={window.innerHeight - 250}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {shapes.map((shape, i) => {
              if (shape.tool === 'rectangle') return <Rect key={i} x={shape.x} y={shape.y} width={shape.width} height={shape.height} stroke="black" strokeWidth={2} />;
              if (shape.tool === 'circle') return <Circle key={i} x={shape.x + shape.width/2} y={shape.y + shape.height/2} radius={Math.max(Math.abs(shape.width), Math.abs(shape.height))/2} stroke="black" strokeWidth={2} />;
              if (shape.tool === 'pen') return <Line key={i} points={shape.points} stroke="black" strokeWidth={2} tension={0.5} lineCap="round" />;
              return null;
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}