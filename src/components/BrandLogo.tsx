import React, { useState } from 'react';
import { BRAND_CONFIG } from '../config/branding';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'md-plus' | 'lg' | 'xl' | '2xl' | 'hero';
  showText?: boolean;
  lightText?: boolean;
  className?: string;
  imageSrc?: string;
  title?: string;
  subtitle?: string;
}

export default function BrandLogo({
  size = 'md',
  showText = false,
  lightText = false,
  className = '',
  imageSrc,
  title,
  subtitle,
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Dedicated brand logo, isolated from user photo uploads
  const rawImageSrc = imageSrc ?? (BRAND_CONFIG.useCustomLogoImage ? BRAND_CONFIG.logoImagePath : null);
  const activeImageSrc = rawImageSrc
    ? rawImageSrc.startsWith('public/')
      ? '/' + rawImageSrc.slice(7)
      : rawImageSrc
    : null;
  const activeTitle = title ?? BRAND_CONFIG.brandName;
  const activeSubtitle = subtitle ?? BRAND_CONFIG.brandSubtitle;

  const sizeMap = {
    sm: { icon: 32, box: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 48, box: 'w-12 h-12', text: 'text-xl', sub: 'text-[11px]' },
    'md-plus': { icon: 48, box: 'w-12 h-12', text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 72, box: 'w-18 h-18', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 104, box: 'w-26 h-26', text: 'text-3xl', sub: 'text-sm' },
    '2xl': { icon: 150, box: 'w-40 h-40', text: 'text-4xl', sub: 'text-base' },
    hero: { icon: 210, box: 'w-52 h-52 sm:w-60 sm:h-60', text: 'text-5xl', sub: 'text-lg' },
  };

  const { icon, box, text, sub } = sizeMap[size];

  // Helper to render stylized brand name with "LVSkill" in #00306e and "Sync" in #da9719
  const renderBrandText = () => {
    if (activeTitle === 'LVSkillSync') {
      return (
        <span className="inline-flex items-center">
          <span style={{ color: '#00306e' }} className="font-heading font-extrabold tracking-tight">
            LVSkill
          </span>
          <span style={{ color: '#da9719' }} className="font-heading font-extrabold tracking-tight">
            Sync
          </span>
        </span>
      );
    }
    return activeTitle;
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Emblem / Logo Image without enclosing square layout or box background */}
      <div className={`relative ${box} flex-shrink-0 flex items-center justify-center`}>
        {activeImageSrc && !imageError ? (
          <img
            src={activeImageSrc}
            alt={activeTitle}
            className="w-full h-full object-contain drop-shadow-sm select-none"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Clean SVG Vector Emblem without square background frame */
          <svg
            width={icon}
            height={icon}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm select-none"
          >
            {/* Stylized 'LV' connected geometry in Royal Blue */}
            <path
              d="M 28 30 L 28 65 L 48 65"
              stroke="#00306e"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 50 34 L 62 66 L 74 34"
              stroke="#3B82F6"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Opportunity & Skill Spark in Gold */}
            <path
              d="M 72 26 L 74.5 32 L 80 34 L 74.5 36 L 72 42 L 69.5 36 L 64 34 L 69.5 32 Z"
              fill="#da9719"
            />
            
            {/* Skill Sync node in Gold */}
            <circle cx="48" cy="65" r="4.5" fill="#da9719" />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span
              className={`font-heading font-extrabold tracking-tight leading-none ${text}`}
            >
              {renderBrandText()}
            </span>
            {/* Yellow dot removed completely as requested */}
          </div>
          <span
            className={`font-medium tracking-wide uppercase mt-1 ${sub} ${
              lightText ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {activeSubtitle}
          </span>
        </div>
      )}
    </div>
  );
}
