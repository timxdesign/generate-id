'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  User,
  Paintbrush,
  RotateCcw,
  Plus,
  Trash2,
  Upload,
  Download,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { useCardStore, type CardStore } from '../store/card-store';
import { STYLES, type StyleColors, getStyleById } from '../lib/styles';
import CardRenderer, { CARD_W, CARD_H } from './card-renderer';
import ExportModal from './export-modal';

type Tab = 'style' | 'details' | 'colors';

export default function Editor() {
  const store = useCardStore();
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [showExport, setShowExport] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      const cw = store.orientation === 'landscape' ? CARD_W : CARD_H;
      const ch = store.orientation === 'landscape' ? CARD_H : CARD_W;
      const sx = (width - 40) / cw;
      const sy = (height - 72) / ch;
      setScale(Math.min(sx, sy, 1.15));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [store.orientation]);

  const effectiveStyle = store.previewStyle ?? store.style;
  const effectiveColors = store.previewStyle
    ? getStyleById(store.previewStyle).defaults
    : store.colors;

  const cardProps = {
    style: effectiveStyle,
    orientation: store.orientation,
    colors: effectiveColors,
    fullName: store.fullName,
    title: store.title,
    organization: store.organization,
    idNumber: store.idNumber,
    department: store.department,
    contactEmail: store.contactEmail,
    phone: store.phone,
    photoUrl: store.photoUrl,
    customFields: store.customFields,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-screen overflow-hidden bg-zinc-50/80"
    >
      {/* Header */}
      <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 sm:px-6 border-b border-zinc-200/60 bg-white/80 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="font-semibold text-zinc-900 text-sm tracking-tight">
            GenerateID
          </span>
          <span className="text-zinc-300 text-[10px] hidden sm:inline">
            by{' '}
            <a
              href="https://x.com/timxdesign"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              TimX Design
            </a>
          </span>
        </div>
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-zinc-800 active:scale-[0.97] transition-all"
        >
          <Download size={13} />
          Export
        </button>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Preview area */}
        <div
          ref={previewRef}
          className="flex-1 flex items-center justify-center p-6 relative order-1 lg:order-2 min-h-[280px] lg:min-h-0"
        >
          <div
            className="flex items-center justify-center"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              perspective: 1200,
              width: store.orientation === 'landscape' ? CARD_W : CARD_H,
              height: store.orientation === 'landscape' ? CARD_H : CARD_W,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={store.orientation}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={effectiveStyle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="shadow-2xl rounded-2xl">
                      <CardRenderer {...cardProps} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Orientation toggle */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-white rounded-lg shadow-sm border border-zinc-200/60 p-0.5">
            <button
              onClick={() => store.setOrientation('landscape')}
              className={`p-1.5 rounded-md transition-all ${
                store.orientation === 'landscape'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
              title="Landscape"
            >
              <Monitor size={13} />
            </button>
            <button
              onClick={() => store.setOrientation('portrait')}
              className={`p-1.5 rounded-md transition-all ${
                store.orientation === 'portrait'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
              title="Portrait"
            >
              <Smartphone size={13} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[360px] flex-shrink-0 border-t lg:border-t-0 lg:border-r border-zinc-200/60 bg-white flex flex-col order-2 lg:order-1 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-zinc-100 flex-shrink-0">
            {(
              [
                { id: 'style' as Tab, label: 'Style', Icon: Palette },
                { id: 'details' as Tab, label: 'Details', Icon: User },
                { id: 'colors' as Tab, label: 'Colors', Icon: Paintbrush },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-3 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === id
                    ? 'text-zinc-900 border-b-2 border-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.12 }}
              >
                {activeTab === 'style' && <StyleTab />}
                {activeTab === 'details' && <DetailsTab />}
                {activeTab === 'colors' && <ColorsTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        cardProps={cardProps}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Style Tab                                                          */
/* ------------------------------------------------------------------ */

function StyleTab() {
  const style = useCardStore((s) => s.style);
  const setStyle = useCardStore((s) => s.setStyle);
  const setPreviewStyle = useCardStore((s) => s.setPreviewStyle);

  return (
    <div>
      <p className="text-[11px] text-zinc-400 mb-3">Choose a style</p>
      <div className="space-y-1" onMouseLeave={() => setPreviewStyle(null)}>
        {STYLES.map((s) => {
          const active = style === s.id;
          return (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setStyle(s.id);
                setPreviewStyle(null);
              }}
              onMouseEnter={() => setPreviewStyle(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                active ? 'bg-zinc-900' : 'hover:bg-zinc-50'
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${s.defaults.primary}, ${s.defaults.accent})`,
                }}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-medium leading-tight ${
                    active ? 'text-white' : 'text-zinc-800'
                  }`}
                >
                  {s.name}
                </p>
                <p
                  className={`text-[10px] leading-tight mt-0.5 ${
                    active ? 'text-zinc-400' : 'text-zinc-400'
                  }`}
                >
                  {s.tagline}
                </p>
              </div>
              {active && (
                <motion.div
                  layoutId="style-dot"
                  className="w-1.5 h-1.5 rounded-full bg-white shrink-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Details Tab                                                        */
/* ------------------------------------------------------------------ */

type FieldKey = Parameters<CardStore['setField']>[0];

const FIELDS: { key: FieldKey; label: string; placeholder: string }[] = [
  { key: 'fullName', label: 'Full Name', placeholder: 'Alex Morgan' },
  { key: 'title', label: 'Title / Role', placeholder: 'Creative Director' },
  { key: 'organization', label: 'Organization', placeholder: 'Studio Noir' },
  { key: 'department', label: 'Department', placeholder: 'Design' },
  { key: 'idNumber', label: 'ID Number', placeholder: 'ID-2024-0471' },
  {
    key: 'contactEmail',
    label: 'Email',
    placeholder: 'alex@example.com',
  },
  { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000' },
];

function DetailsTab() {
  const store = useCardStore();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      store.setPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3.5">
      {/* Photo */}
      <div>
        <label className="text-[11px] font-medium text-zinc-500 mb-1.5 block">
          Photo
        </label>
        <label className="flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-zinc-200 hover:border-zinc-300 cursor-pointer transition-colors">
          {store.photoUrl ? (
            <img
              src={store.photoUrl}
              alt="Photo"
              className="w-9 h-9 rounded-lg object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Upload size={14} className="text-zinc-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs text-zinc-700">
              {store.photoUrl ? 'Change photo' : 'Upload photo'}
            </p>
            <p className="text-[10px] text-zinc-400">JPG, PNG up to 5 MB</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
        {store.photoUrl && (
          <button
            onClick={() => store.setPhoto(null)}
            className="mt-1 text-[10px] text-zinc-400 hover:text-red-500 transition-colors"
          >
            Remove photo
          </button>
        )}
      </div>

      {/* Form fields */}
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="text-[11px] font-medium text-zinc-500 mb-1 block">
            {f.label}
          </label>
          <input
            type="text"
            value={store[f.key]}
            onChange={(e) => store.setField(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-300 input-field bg-white"
          />
        </div>
      ))}

      {/* Custom fields */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-medium text-zinc-500">
            Custom Fields
          </label>
          <button
            onClick={store.addCustomField}
            className="text-[10px] text-zinc-400 hover:text-zinc-600 flex items-center gap-0.5 transition-colors"
          >
            <Plus size={11} />
            Add
          </button>
        </div>
        {store.customFields.length > 0 && (
          <div className="space-y-2">
            {store.customFields.map((f) => (
              <div key={f.id} className="flex gap-1.5">
                <input
                  value={f.label}
                  onChange={(e) =>
                    store.updateCustomField(f.id, 'label', e.target.value)
                  }
                  placeholder="Label"
                  className="w-[30%] px-2 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-300 input-field bg-white"
                />
                <input
                  value={f.value}
                  onChange={(e) =>
                    store.updateCustomField(f.id, 'value', e.target.value)
                  }
                  placeholder="Value"
                  className="flex-1 px-2 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-300 input-field bg-white"
                />
                <button
                  onClick={() => store.removeCustomField(f.id)}
                  className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Colors Tab                                                         */
/* ------------------------------------------------------------------ */

const COLOR_FIELDS: { key: keyof StyleColors; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'text', label: 'Text' },
  { key: 'background', label: 'Background' },
];

function ColorsTab() {
  const colors = useCardStore((s) => s.colors);
  const setColor = useCardStore((s) => s.setColor);
  const resetColors = useCardStore((s) => s.resetColors);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-zinc-400">
          Customize your card colors
        </p>
        <button
          onClick={resetColors}
          className="text-[10px] text-zinc-400 hover:text-zinc-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={10} />
          Reset
        </button>
      </div>

      <div className="space-y-2.5">
        {COLOR_FIELDS.map((f) => (
          <div
            key={f.key}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <input
              type="color"
              value={colors[f.key]}
              onChange={(e) => setColor(f.key, e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-700">{f.label}</p>
              <p className="text-[10px] text-zinc-400 font-mono">
                {colors[f.key]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Palette preview */}
      <div className="p-3 rounded-xl border border-zinc-100">
        <p className="text-[10px] text-zinc-400 mb-2">Palette Preview</p>
        <div className="flex gap-1">
          {COLOR_FIELDS.map((f) => (
            <div
              key={f.key}
              className="flex-1 h-7 first:rounded-l-lg last:rounded-r-lg"
              style={{ backgroundColor: colors[f.key] }}
              title={f.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
