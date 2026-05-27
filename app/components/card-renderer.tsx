'use client';

import type { CardStyle, StyleColors } from '../lib/styles';
import type { Orientation, CustomField } from '../store/card-store';

export interface CardRendererProps {
  style: CardStyle;
  orientation: Orientation;
  colors: StyleColors;
  fullName: string;
  title: string;
  organization: string;
  idNumber: string;
  department: string;
  contactEmail: string;
  phone: string;
  photoUrl: string | null;
  customFields: CustomField[];
}

export const CARD_W = 510;
export const CARD_H = 320;

type StyleRenderer = (p: CardRendererProps) => React.ReactNode;

const renderers: Record<CardStyle, StyleRenderer> = {
  fancy: renderFancy,
  executive: renderExecutive,
  minimal: renderMinimal,
  creative: renderCreative,
  government: renderGovernment,
  academic: renderAcademic,
};

export default function CardRenderer(props: CardRendererProps) {
  const { style, orientation } = props;
  const w = orientation === 'landscape' ? CARD_W : CARD_H;
  const h = orientation === 'landscape' ? CARD_H : CARD_W;

  return (
    <div
      className="relative overflow-hidden color-transition"
      style={{ width: w, height: h, borderRadius: 16 }}
    >
      {renderers[style](props)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

function Photo({
  url,
  name,
  accent,
  size,
  shape,
}: {
  url: string | null;
  name: string;
  accent: string;
  size: { w: number; h: number };
  shape: 'rounded' | 'circle' | 'square';
}) {
  const radius =
    shape === 'circle' ? '50%' : shape === 'rounded' ? '10px' : '4px';
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <div
      className="flex-shrink-0 overflow-hidden border-2"
      style={{
        width: size.w,
        height: size.h,
        borderRadius: radius,
        borderColor: `${accent}50`,
      }}
    >
      {url ? (
        <img
          src={url}
          alt="Photo"
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: `${accent}12`, color: `${accent}90` }}
        >
          <span className="text-lg font-light tracking-wide">{initials}</span>
        </div>
      )}
    </div>
  );
}

function InfoLine({
  items,
  color,
  className = '',
}: {
  items: string[];
  color: string;
  className?: string;
}) {
  const visible = items.filter(Boolean);
  if (!visible.length) return null;
  return (
    <p className={`text-[8px] opacity-50 ${className}`} style={{ color }}>
      {visible.join('  ·  ')}
    </p>
  );
}

function CustomFieldsRow({
  fields,
  color,
  className = '',
}: {
  fields: CustomField[];
  color: string;
  className?: string;
}) {
  const visible = fields.filter((f) => f.label && f.value);
  if (!visible.length) return null;
  return (
    <div
      className={`flex gap-3 flex-wrap text-[7px] opacity-40 ${className}`}
      style={{ color }}
    >
      {visible.map((f) => (
        <span key={f.id}>
          {f.label}: {f.value}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FANCY                                                              */
/* ------------------------------------------------------------------ */

function renderFancy(p: CardRendererProps) {
  const {
    colors,
    orientation,
    fullName,
    title,
    organization,
    idNumber,
    department,
    contactEmail,
    phone,
    photoUrl,
    customFields,
  } = p;
  const isL = orientation === 'landscape';

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.background} 40%, ${colors.secondary} 100%)`,
      }}
    >
      {/* Diamond pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${colors.accent} 0, ${colors.accent} 1px, transparent 0, transparent 50%)`,
          backgroundSize: '14px 14px',
        }}
      />

      {/* Inner borders */}
      <div
        className="absolute inset-2 rounded-xl border"
        style={{ borderColor: `${colors.accent}20` }}
      />
      <div
        className="absolute inset-3 rounded-[10px] border"
        style={{ borderColor: `${colors.accent}10` }}
      />

      {/* Corner ornaments */}
      {(['top-2.5 left-2.5 border-t-[1.5px] border-l-[1.5px] rounded-tl',
        'top-2.5 right-2.5 border-t-[1.5px] border-r-[1.5px] rounded-tr',
        'bottom-2.5 left-2.5 border-b-[1.5px] border-l-[1.5px] rounded-bl',
        'bottom-2.5 right-2.5 border-b-[1.5px] border-r-[1.5px] rounded-br',
      ] as const).map((cls, i) => (
        <div key={i} className={`absolute ${cls} w-5 h-5 z-20`} style={{ borderColor: colors.accent }} />
      ))}

      {/* Content */}
      <div
        className={`relative z-10 h-full flex ${
          isL
            ? 'flex-row items-center px-8 gap-6'
            : 'flex-col items-center justify-center px-6 text-center'
        }`}
      >
        <Photo
          url={photoUrl}
          name={fullName}
          accent={colors.accent}
          size={isL ? { w: 90, h: 110 } : { w: 82, h: 100 }}
          shape="rounded"
        />

        <div className={`min-w-0 ${isL ? 'flex-1' : 'mt-3'}`}>
          <p
            className="text-[9px] tracking-[0.25em] uppercase opacity-60"
            style={{ color: colors.accent }}
          >
            {organization || 'Organization'}
          </p>
          <h2
            className="text-[22px] font-bold tracking-wide leading-tight truncate mt-1"
            style={{
              color: colors.text,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {fullName || 'Your Name'}
          </h2>
          <div
            className="h-[1px] w-10 my-1.5"
            style={{
              background: `linear-gradient(90deg, ${colors.accent}, transparent)`,
            }}
          />
          <p className="text-[11px] opacity-80" style={{ color: colors.text }}>
            {title || 'Title'}
          </p>
          {department && (
            <p
              className="text-[10px] opacity-50 mt-0.5"
              style={{ color: colors.text }}
            >
              {department}
            </p>
          )}

          <div className="mt-3">
            <InfoLine
              items={[idNumber, contactEmail, phone]}
              color={colors.text}
            />
            <CustomFieldsRow
              fields={customFields}
              color={colors.text}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-[15%] right-[15%] h-[1.5px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.accent}60, transparent)`,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXECUTIVE                                                          */
/* ------------------------------------------------------------------ */

function renderExecutive(p: CardRendererProps) {
  const {
    colors,
    orientation,
    fullName,
    title,
    organization,
    idNumber,
    department,
    contactEmail,
    phone,
    photoUrl,
    customFields,
  } = p;
  const isL = orientation === 'landscape';

  return (
    <div className="absolute inset-0" style={{ background: colors.background }}>
      {/* Top accent bar */}
      <div
        className="absolute top-0 inset-x-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.primary})`,
        }}
      />

      {/* Subtle diagonal lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, ${colors.text} 0, ${colors.text} 1px, transparent 0, transparent 10px)`,
        }}
      />

      <div
        className={`relative z-10 h-full flex ${
          isL
            ? 'flex-row items-center px-7 gap-6'
            : 'flex-col items-center justify-center px-5 text-center'
        }`}
      >
        <Photo
          url={photoUrl}
          name={fullName}
          accent={colors.accent}
          size={isL ? { w: 82, h: 82 } : { w: 76, h: 76 }}
          shape="circle"
        />

        <div className={`min-w-0 ${isL ? 'flex-1' : 'mt-3'}`}>
          <h2
            className="text-[20px] font-semibold tracking-wide truncate"
            style={{ color: colors.text }}
          >
            {fullName || 'Your Name'}
          </h2>
          <p
            className="text-[11px] mt-0.5"
            style={{ color: colors.accent }}
          >
            {title || 'Title'}
          </p>
          <p
            className="text-[10px] opacity-50 mt-0.5"
            style={{ color: colors.text }}
          >
            {organization || 'Organization'}
            {department ? ` · ${department}` : ''}
          </p>

          <div
            className="w-full h-[1px] my-3 opacity-20"
            style={{ backgroundColor: colors.accent }}
          />

          <div
            className={`flex ${isL ? 'justify-between' : 'justify-center gap-4'} text-[9px] opacity-60`}
            style={{ color: colors.text }}
          >
            {idNumber && (
              <span className="font-mono tracking-wide">{idNumber}</span>
            )}
            <span>
              {[contactEmail, phone].filter(Boolean).join(' · ')}
            </span>
          </div>
          <CustomFieldsRow
            fields={customFields}
            color={colors.text}
            className={`mt-1 ${isL ? '' : 'justify-center'}`}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MINIMAL                                                            */
/* ------------------------------------------------------------------ */

function renderMinimal(p: CardRendererProps) {
  const {
    colors,
    orientation,
    fullName,
    title,
    organization,
    idNumber,
    department,
    contactEmail,
    phone,
    photoUrl,
    customFields,
  } = p;
  const isL = orientation === 'landscape';

  return (
    <div
      className="absolute inset-0 border"
      style={{
        background: colors.background,
        borderColor: `${colors.primary}08`,
        borderRadius: 16,
      }}
    >
      <div
        className={`h-full flex ${
          isL
            ? 'flex-row items-center px-8 gap-7'
            : 'flex-col items-center justify-center px-6 text-center'
        }`}
      >
        <Photo
          url={photoUrl}
          name={fullName}
          accent={colors.accent}
          size={isL ? { w: 68, h: 68 } : { w: 64, h: 64 }}
          shape="circle"
        />

        <div className={`min-w-0 ${isL ? 'flex-1' : 'mt-4'}`}>
          <h2
            className="text-[20px] font-medium tracking-tight truncate"
            style={{ color: colors.text }}
          >
            {fullName || 'Your Name'}
          </h2>
          <p className="text-[11px] mt-1" style={{ color: colors.secondary }}>
            {[title, organization].filter(Boolean).join(' · ') || 'Title · Organization'}
          </p>

          <div
            className={`mt-4 space-y-1 text-[9px] opacity-40`}
            style={{ color: colors.text }}
          >
            {idNumber && <p className="font-mono">{idNumber}</p>}
            <p>
              {[contactEmail, phone, department]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
          <CustomFieldsRow
            fields={customFields}
            color={colors.text}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Bottom accent dot */}
      <div
        className="absolute bottom-4 right-4 w-2 h-2 rounded-full"
        style={{ backgroundColor: colors.accent }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CREATIVE                                                           */
/* ------------------------------------------------------------------ */

function renderCreative(p: CardRendererProps) {
  const {
    colors,
    orientation,
    fullName,
    title,
    organization,
    idNumber,
    department,
    contactEmail,
    phone,
    photoUrl,
    customFields,
  } = p;
  const isL = orientation === 'landscape';

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primary} 100%)`,
      }}
    >
      {/* Geometric blob */}
      <div
        className="absolute opacity-20"
        style={{
          width: isL ? '40%' : '100%',
          height: isL ? '100%' : '35%',
          top: 0,
          right: 0,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius: isL ? '0 16px 16px 80%' : '0 0 50% 50%',
        }}
      />

      {/* Accent ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 100,
          height: 100,
          border: `2px solid ${colors.accent}15`,
          top: isL ? -20 : 'auto',
          right: isL ? '22%' : 'auto',
          bottom: isL ? 'auto' : -15,
          left: isL ? 'auto' : '18%',
        }}
      />

      <div
        className={`relative z-10 h-full flex ${
          isL
            ? 'flex-row items-center px-7 gap-5'
            : 'flex-col items-center justify-center px-5 text-center'
        }`}
      >
        <Photo
          url={photoUrl}
          name={fullName}
          accent={colors.accent}
          size={isL ? { w: 88, h: 108 } : { w: 78, h: 96 }}
          shape="rounded"
        />

        <div className={`min-w-0 ${isL ? 'flex-1' : 'mt-3'}`}>
          <h2
            className="text-[22px] font-black tracking-tight truncate leading-none"
            style={{ color: colors.text }}
          >
            {fullName || 'Your Name'}
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors.accent }}
            />
            <p
              className="text-[11px] font-semibold truncate"
              style={{ color: colors.accent }}
            >
              {title || 'Title'}
            </p>
          </div>
          <p
            className="text-[10px] opacity-60 mt-1"
            style={{ color: colors.text }}
          >
            {organization || 'Organization'}
            {department ? ` / ${department}` : ''}
          </p>

          <div
            className={`mt-3 flex ${isL ? 'gap-2' : 'justify-center gap-2'} flex-wrap text-[8px] opacity-50`}
            style={{ color: colors.text }}
          >
            {idNumber && (
              <span
                className="px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${colors.text}10` }}
              >
                {idNumber}
              </span>
            )}
            {contactEmail && <span className="py-0.5">{contactEmail}</span>}
            {phone && <span className="py-0.5">{phone}</span>}
          </div>
          <CustomFieldsRow
            fields={customFields}
            color={colors.text}
            className={`mt-1 ${isL ? '' : 'justify-center'}`}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GOVERNMENT                                                         */
/* ------------------------------------------------------------------ */

function renderGovernment(p: CardRendererProps) {
  const {
    colors,
    orientation,
    fullName,
    title,
    organization,
    idNumber,
    department,
    contactEmail,
    phone,
    photoUrl,
    customFields,
  } = p;
  const isL = orientation === 'landscape';

  return (
    <div className="absolute inset-0" style={{ background: colors.background }}>
      {/* Header bar */}
      <div
        className="absolute top-0 inset-x-0"
        style={{
          height: isL ? 52 : 58,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius: '16px 16px 0 0',
        }}
      >
        <div className="h-full flex items-center px-5 gap-3">
          <div
            className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0"
            style={{ borderColor: `${colors.text}50` }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
          </div>
          <p
            className="text-[10px] font-bold tracking-wider uppercase truncate"
            style={{ color: colors.text }}
          >
            {organization || 'Organization Name'}
          </p>
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div
        className="absolute bottom-0 inset-x-0 h-1.5"
        style={{
          backgroundColor: colors.accent,
          borderRadius: '0 0 16px 16px',
        }}
      />

      {/* Content */}
      <div
        className={`relative z-10 h-full flex ${
          isL
            ? 'flex-row items-end px-5 pb-5 gap-4'
            : 'flex-col items-center px-5 text-center'
        }`}
        style={{ paddingTop: isL ? 60 : 66 }}
      >
        <Photo
          url={photoUrl}
          name={fullName}
          accent={colors.primary}
          size={isL ? { w: 78, h: 96 } : { w: 70, h: 88 }}
          shape="square"
        />

        <div className={`min-w-0 ${isL ? 'flex-1 pb-0.5' : 'mt-2'}`}>
          <h2
            className="text-[17px] font-bold tracking-wide truncate"
            style={{ color: colors.primary }}
          >
            {fullName || 'Your Name'}
          </h2>
          <p
            className="text-[10px] font-semibold opacity-70 mt-0.5"
            style={{ color: colors.primary }}
          >
            {title || 'Title'}
            {department ? ` · ${department}` : ''}
          </p>

          <div
            className={`mt-2 grid ${isL ? 'grid-cols-2' : 'grid-cols-1'} gap-x-4 gap-y-1.5 text-[8px]`}
            style={{ color: colors.primary }}
          >
            {idNumber && (
              <div>
                <span className="opacity-35 text-[7px] uppercase tracking-wider block">
                  ID Number
                </span>
                <p className="font-mono font-semibold">{idNumber}</p>
              </div>
            )}
            {contactEmail && (
              <div>
                <span className="opacity-35 text-[7px] uppercase tracking-wider block">
                  Email
                </span>
                <p>{contactEmail}</p>
              </div>
            )}
            {phone && (
              <div>
                <span className="opacity-35 text-[7px] uppercase tracking-wider block">
                  Phone
                </span>
                <p>{phone}</p>
              </div>
            )}
          </div>
          <CustomFieldsRow
            fields={customFields}
            color={colors.primary}
            className={`mt-1 ${isL ? '' : 'justify-center'}`}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ACADEMIC                                                           */
/* ------------------------------------------------------------------ */

function renderAcademic(p: CardRendererProps) {
  const {
    colors,
    orientation,
    fullName,
    title,
    organization,
    idNumber,
    department,
    contactEmail,
    phone,
    photoUrl,
    customFields,
  } = p;
  const isL = orientation === 'landscape';

  return (
    <div className="absolute inset-0" style={{ background: colors.background }}>
      {/* Header strip */}
      <div
        className="absolute top-0 inset-x-0"
        style={{
          height: isL ? 42 : 48,
          backgroundColor: colors.primary,
          borderRadius: '16px 16px 0 0',
        }}
      >
        <div className="h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: colors.accent }}
            >
              <span
                className="text-[8px] font-bold"
                style={{ color: colors.primary }}
              >
                {(organization || 'U').charAt(0)}
              </span>
            </div>
            <p
              className="text-[9px] font-semibold tracking-wider uppercase truncate"
              style={{ color: `${colors.background}cc` }}
            >
              {organization || 'University Name'}
            </p>
          </div>
          <p
            className="text-[8px] opacity-60 flex-shrink-0"
            style={{ color: colors.background }}
          >
            {new Date().getFullYear()}&ndash;{new Date().getFullYear() + 1}
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 h-full flex ${
          isL
            ? 'flex-row items-center px-5 gap-5'
            : 'flex-col items-center justify-center px-5 text-center'
        }`}
        style={{ paddingTop: isL ? 50 : 56 }}
      >
        <Photo
          url={photoUrl}
          name={fullName}
          accent={colors.secondary}
          size={isL ? { w: 76, h: 94 } : { w: 70, h: 86 }}
          shape="rounded"
        />

        <div className={`min-w-0 ${isL ? 'flex-1' : 'mt-3'}`}>
          <h2
            className="text-[18px] font-bold tracking-wide truncate"
            style={{ color: colors.text }}
          >
            {fullName || 'Your Name'}
          </h2>
          <div
            className={`flex items-center gap-1.5 mt-1 ${isL ? '' : 'justify-center'}`}
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors.accent }}
            />
            <p className="text-[10px] font-medium" style={{ color: colors.secondary }}>
              {title || 'Student / Faculty'}
            </p>
          </div>
          {department && (
            <p
              className="text-[9px] opacity-50 mt-0.5"
              style={{ color: colors.text }}
            >
              {department}
            </p>
          )}

          <div
            className="w-full h-[1px] my-2 opacity-10"
            style={{ backgroundColor: colors.text }}
          />

          <div
            className={`flex ${isL ? 'gap-4' : 'justify-center gap-4'} text-[9px] opacity-55`}
            style={{ color: colors.text }}
          >
            {idNumber && <span className="font-mono">{idNumber}</span>}
            {contactEmail && <span>{contactEmail}</span>}
          </div>
          {phone && (
            <p
              className={`text-[9px] opacity-45 mt-0.5 ${isL ? '' : 'text-center'}`}
              style={{ color: colors.text }}
            >
              {phone}
            </p>
          )}
          <CustomFieldsRow
            fields={customFields}
            color={colors.text}
            className={`mt-1 ${isL ? '' : 'justify-center'}`}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 inset-x-0 h-1"
        style={{
          backgroundColor: colors.accent,
          borderRadius: '0 0 16px 16px',
        }}
      />
    </div>
  );
}
