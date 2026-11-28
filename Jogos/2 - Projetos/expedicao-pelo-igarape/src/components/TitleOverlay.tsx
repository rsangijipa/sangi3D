import React from 'react';

interface TitleOverlayProps {
  onStart: () => void;
  detectedQuality: string;
}

export const TitleOverlay: React.FC<TitleOverlayProps> = ({ onStart }) => {
  return (
    <div
      className="fixed inset-0 z-30 flex flex-col justify-between p-6 sm:p-10 pointer-events-none"
      style={{
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
      }}
    >
      {/* Subtle top-left negative-space vignette gradient for crisp typography over canopy */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 68% 58% at 22% 24%, rgba(7, 14, 9, 0.72) 0%, rgba(7, 14, 9, 0.28) 55%, rgba(7, 14, 9, 0.08) 100%)',
        }}
      />

      {/* Bespoke Inline SVG Title Lockup & Primary CTA anchored in upper-left calm region */}
      <div className="max-w-lg mt-2 sm:mt-6 pointer-events-auto">
        <svg
          viewBox="0 0 460 132"
          className="w-full max-w-[430px] h-auto drop-shadow-[0_6px_20px_rgba(0,0,0,0.65)]"
          role="img"
          aria-label="Expedição pelo Igarapé"
        >
          <defs>
            <linearGradient id="leafGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9be15d" />
              <stop offset="100%" stopColor="#2e8b44" />
            </linearGradient>
          </defs>
          {/* Crest Leaf & River Ripple Emblem */}
          <g transform="translate(8, 16)">
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="#101a12"
              fillOpacity="0.88"
              stroke="#68c979"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
            <path
              d="M17 38 C17 20, 32 14, 44 15 C43 29, 34 42, 17 38 Z"
              fill="url(#leafGold)"
            />
            <path
              d="M16 40 C24 32, 32 25, 41 18"
              stroke="#0f1c11"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M14 47 Q30 43 46 47"
              stroke="#d9e8c8"
              strokeOpacity="0.7"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Wordmark */}
          <text
            x="80"
            y="48"
            fill="#f4f6ee"
            fontSize="36"
            fontWeight="700"
            letterSpacing="-0.6"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Expedição
          </text>
          <text
            x="80"
            y="84"
            fill="#cde5b6"
            fontSize="27"
            fontWeight="600"
            letterSpacing="0.4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            pelo Igarapé
          </text>
          <line
            x1="80"
            y1="98"
            x2="318"
            y2="98"
            stroke="#7ec984"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
          <text
            x="80"
            y="118"
            fill="#d9e3d2"
            fillOpacity="0.88"
            fontSize="12.5"
            letterSpacing="1.8"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            NAVEGAÇÃO · FAUNA · DIÁRIO NATURALISTA
          </text>
        </svg>

        <div className="mt-6 flex flex-wrap items-center gap-3 pl-2">
          <button
            type="button"
            data-start="true"
            onClick={(e) => {
              e.currentTarget.blur();
              onStart();
            }}
            className="min-h-[48px] px-7 py-3 rounded-xl bg-[#2a7a3e] hover:bg-[#338f4a] active:bg-[#236633] text-[#f6faf4] font-semibold text-base tracking-wide border border-[#77d98b]/70 shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-colors cursor-pointer"
          >
            Iniciar Expedição
          </button>
        </div>
      </div>

      {/* Single flat, borderless inline control-hint line */}
      <div className="w-full flex justify-center pointer-events-none">
        <p className="text-xs sm:text-sm text-[#e4ecdc]/85 tracking-wide text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          WASD Remar · Arrastar Olhar · Tab Observar · Espaço Fotografar · E Atracar · Esc Pausa
        </p>
      </div>
    </div>
  );
};
