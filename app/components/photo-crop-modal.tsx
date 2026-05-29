'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Check, X } from 'lucide-react';
import type { PhotoCrop } from '../store/card-store';

interface PhotoCropModalProps {
  photoUrl: string;
  initialCrop: PhotoCrop;
  onDone: (crop: PhotoCrop) => void;
  onCancel: () => void;
}

export default function PhotoCropModal({
  photoUrl,
  initialCrop,
  onDone,
  onCancel,
}: PhotoCropModalProps) {
  const [zoom, setZoom] = useState(initialCrop.zoom);
  const [cropX, setCropX] = useState(initialCrop.x);
  const [cropY, setCropY] = useState(initialCrop.y);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.35 / zoom;
      setCropX((prev) => Math.max(0, Math.min(100, prev - dx * sensitivity)));
      setCropY((prev) => Math.max(0, Math.min(100, prev - dy * sensitivity)));
    },
    [zoom],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">
              Adjust Photo
            </h3>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <X size={16} className="text-zinc-400" />
            </button>
          </div>

          <div className="p-5 flex flex-col items-center gap-4">
            <div
              className="w-48 h-48 rounded-2xl overflow-hidden bg-zinc-100 cursor-grab active:cursor-grabbing select-none touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <img
                src={photoUrl}
                alt="Crop preview"
                className="w-full h-full pointer-events-none"
                draggable={false}
                style={{
                  objectFit: 'cover',
                  objectPosition: `${cropX}% ${cropY}%`,
                  transform: `scale(${zoom})`,
                }}
              />
            </div>

            <p className="text-[10px] text-zinc-400">
              Drag to reposition
            </p>

            <div className="w-full flex items-center gap-3 px-2">
              <ZoomOut size={14} className="text-zinc-400 flex-shrink-0" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-zinc-900 h-1.5"
              />
              <ZoomIn size={14} className="text-zinc-400 flex-shrink-0" />
            </div>
          </div>

          <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/50">
            <button
              onClick={() => onDone({ zoom, x: cropX, y: cropY })}
              className="w-full py-3 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Check size={15} />
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
