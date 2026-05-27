'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { X, Download, Share2, Printer, ArrowLeft } from 'lucide-react';
import CardRenderer, { type CardRendererProps } from './card-renderer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardProps: CardRendererProps;
}

export default function ExportModal({
  isOpen,
  onClose,
  cardProps,
}: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'social' | 'print'>('social');
  const [isExporting, setIsExporting] = useState(false);
  const [needsEmail, setNeedsEmail] = useState(false);
  const [emailStep, setEmailStep] = useState(false);
  const [email, setEmail] = useState('');
  const [pendingExport, setPendingExport] = useState<'social' | 'print' | null>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('generateid-email');
      setNeedsEmail(!stored);
      setEmailStep(false);
      setEmail('');
      setPendingExport(null);
    }
  }, [isOpen]);

  const doExport = useCallback(async (type: 'social' | 'print') => {
    setIsExporting(true);
    try {
      const node = type === 'social' ? socialRef.current : printRef.current;
      if (!node) return;

      const dataUrl = await toPng(node, {
        pixelRatio: type === 'print' ? 4 : 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `generateid-${type}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleExport = useCallback(
    (type: 'social' | 'print') => {
      if (needsEmail) {
        setPendingExport(type);
        setEmailStep(true);
        return;
      }
      doExport(type);
    },
    [needsEmail, doExport],
  );

  const handleEmailSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.includes('@') || !email.includes('.')) return;
      localStorage.setItem('generateid-email', email);
      setNeedsEmail(false);
      setEmailStep(false);
      if (pendingExport) {
        doExport(pendingExport);
        setPendingExport(null);
      }
    },
    [email, pendingExport, doExport],
  );

  const { colors, orientation } = cardProps;
  const cardScale = orientation === 'landscape' ? 1.7 : 2.0;
  const previewCardScale = orientation === 'landscape' ? 0.48 : 0.55;

  return (
    <>
      {/* Hidden export elements */}
      {isOpen && (
        <div
          aria-hidden
          className="fixed z-[-1]"
          style={{ left: -9999, top: 0 }}
        >
          <div
            ref={socialRef}
            style={{
              width: 1080,
              height: 1350,
              position: 'relative',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${colors.background}ee, ${colors.primary}dd, ${colors.secondary}ee)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `
                  radial-gradient(ellipse at 25% 40%, ${colors.accent}18 0%, transparent 55%),
                  radial-gradient(ellipse at 75% 60%, ${colors.secondary}18 0%, transparent 55%),
                  radial-gradient(ellipse at 50% 10%, ${colors.primary}12 0%, transparent 50%)
                `,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${cardScale})`,
                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3))',
              }}
            >
              <CardRenderer {...cardProps} />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 48,
                left: '50%',
                transform: 'translateX(-50%)',
                color: `${colors.text}40`,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.3em',
                fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
              }}
            >
              GENERATEID
            </div>
          </div>

          <div ref={printRef}>
            <CardRenderer {...cardProps} />
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-lg mx-4 mb-4 sm:mb-0 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {emailStep ? (
                  /* ---- Email collection step ---- */
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.18 }}
                    className="p-6"
                  >
                    <button
                      onClick={() => setEmailStep(false)}
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 transition-colors mb-4"
                    >
                      <ArrowLeft size={12} />
                      Back
                    </button>

                    <div className="text-center mb-5">
                      <div className="w-10 h-10 mx-auto mb-3 bg-zinc-900 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">G</span>
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-900">
                        One last thing
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Enter your email to download. We&apos;ll never ask again.
                      </p>
                    </div>

                    <form onSubmit={handleEmailSubmit}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoFocus
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                      <button
                        type="submit"
                        className="w-full mt-3 py-3 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 active:scale-[0.98] transition-all"
                      >
                        Download Now
                      </button>
                    </form>

                    <p className="text-center text-[10px] text-zinc-300 mt-4">
                      No spam. No credit card. Just your card.
                    </p>
                  </motion.div>
                ) : (
                  /* ---- Export preview step ---- */
                  <motion.div
                    key="export"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col max-h-[85vh]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 flex-shrink-0">
                      <h3 className="text-base font-semibold text-zinc-900">
                        Export Your Card
                      </h3>
                      <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                      >
                        <X size={16} className="text-zinc-400" />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-zinc-100 flex-shrink-0">
                      {(
                        [
                          { id: 'social' as const, label: 'Social Media', icon: Share2 },
                          { id: 'print' as const, label: 'Print Ready', icon: Printer },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                            activeTab === tab.id
                              ? 'text-zinc-900 border-b-2 border-zinc-900'
                              : 'text-zinc-400 hover:text-zinc-600'
                          }`}
                        >
                          <tab.icon size={13} />
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Preview */}
                    <div className="flex-1 overflow-auto p-5">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="flex flex-col items-center gap-3"
                        >
                          {activeTab === 'social' ? (
                            <>
                              <p className="text-[11px] text-zinc-400 text-center">
                                Optimized for Instagram, Twitter & LinkedIn
                              </p>
                              <div className="w-full max-w-[280px] aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-zinc-100">
                                <div
                                  className="w-full h-full flex items-center justify-center relative"
                                  style={{
                                    background: `linear-gradient(135deg, ${colors.background}ee, ${colors.primary}dd, ${colors.secondary}ee)`,
                                  }}
                                >
                                  <div
                                    className="absolute inset-0"
                                    style={{
                                      background: `radial-gradient(ellipse at 30% 40%, ${colors.accent}15, transparent 60%)`,
                                    }}
                                  />
                                  <div
                                    className="relative"
                                    style={{
                                      transform: `scale(${previewCardScale})`,
                                    }}
                                  >
                                    <div className="shadow-2xl rounded-2xl">
                                      <CardRenderer {...cardProps} />
                                    </div>
                                  </div>
                                  <span
                                    className="absolute bottom-2.5 text-[7px] tracking-[0.2em] font-medium"
                                    style={{ color: `${colors.text}35` }}
                                  >
                                    GENERATEID
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-[11px] text-zinc-400 text-center">
                                High resolution at 300+ DPI for professional printing
                              </p>
                              <div className="bg-zinc-50 rounded-xl p-5 w-full flex items-center justify-center">
                                <div
                                  style={{
                                    transform: 'scale(0.7)',
                                    transformOrigin: 'center',
                                  }}
                                >
                                  <div className="shadow-lg rounded-2xl">
                                    <CardRenderer {...cardProps} />
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-4 text-[10px] text-zinc-400">
                                <span>
                                  {orientation === 'landscape'
                                    ? '3.375" × 2.125"'
                                    : '2.125" × 3.375"'}
                                </span>
                                <span>300+ DPI</span>
                                <span>PNG</span>
                              </div>
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Download button */}
                    <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/50 flex-shrink-0">
                      <button
                        onClick={() => handleExport(activeTab)}
                        disabled={isExporting}
                        className="w-full py-3 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Download size={15} />
                        {isExporting
                          ? 'Exporting...'
                          : `Download ${activeTab === 'social' ? 'Social Post' : 'Print File'}`}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
