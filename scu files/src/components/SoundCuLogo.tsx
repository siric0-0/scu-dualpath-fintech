import React from 'react';

interface SoundCuLogoProps {
  className?: string;
  withTagline?: boolean;
  light?: boolean;
}

export const SoundCuLogo: React.FC<SoundCuLogoProps> = ({
  className = '',
  withTagline = false,
  light = false,
}) => {
  const textColor = light ? 'text-white' : 'text-[#002D72]';
  const tagColor = light ? 'text-slate-300' : 'text-[#0082CA]';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`text-xl sm:text-2xl font-bold font-serif lowercase tracking-tight ${textColor}`}>
          sound credit union
        </span>

        {/* The 4 iconic Sound CU Wave Pebbles / Droplets */}
        <svg
          viewBox="0 0 48 24"
          className="w-8 h-5 shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Wave droplet 1 (deep blue) */}
          <path
            d="M8 14 C14 10, 18 13, 22 17 C16 19, 11 18, 8 14 Z"
            fill="#002D72"
          />
          {/* Wave droplet 2 (royal blue) */}
          <path
            d="M18 9 C24 5, 29 8, 33 13 C26 15, 21 14, 18 9 Z"
            fill="#005A9C"
          />
          {/* Wave droplet 3 (ocean blue) */}
          <path
            d="M28 5 C34 2, 39 5, 43 9 C37 11, 32 10, 28 5 Z"
            fill="#0082CA"
          />
          {/* Wave droplet 4 (light sky/cyan accent) */}
          <path
            d="M38 2 C42 0.5, 45 2.5, 47 5 C43 6.5, 40 5.5, 38 2 Z"
            fill="#48C2E8"
          />
        </svg>
      </div>

      {withTagline && (
        <span className={`text-[11px] font-sans font-medium tracking-normal ${tagColor} -mt-0.5`}>
          Standing with you through all waves of life.
        </span>
      )}
    </div>
  );
};
