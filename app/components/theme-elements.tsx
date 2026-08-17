"use client";

import React, { useEffect, useState } from 'react';
import { getCampaignData } from '@/lib/data';

interface ThemeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ThemeCard({ children, className = "", style, ...props }: ThemeCardProps) {
  return (
    <div
      className={`theme-card-interactive relative group ${className}`}
      style={{
        borderRadius: 'var(--radius-container, 1rem)',
        border: 'var(--border-container, none)',
        boxShadow: 'var(--shadow-container, none)',
        clipPath: 'var(--clip-path-container, none)',
        transitionDuration: 'var(--transition-speed, 200ms)',
        backgroundColor: 'var(--surface-container-low)',
        transitionProperty: 'all',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function ThemeDivider({ preset }: { preset: string }) {
  const [activePreset, setActivePreset] = useState(preset || "fantasy-parchment");

  useEffect(() => {
    // If no preset passed, read it from campaign settings
    if (!preset) {
      fetch('/api/campaign')
        .then(res => res.json())
        .then(data => {
          if (data.settings?.themePreset) {
            setActivePreset(data.settings.themePreset);
          }
        })
        .catch(() => {});
    }
  }, [preset]);

  if (activePreset === 'fantasy-parchment' || activePreset === 'fey') {
    return (
      <div className="flex items-center justify-center gap-4 text-primary my-16 opacity-60">
        <div className="h-[1px] w-32 bg-current opacity-30"></div>
        <span className="text-2xl font-serif">❦</span>
        <div className="h-[1px] w-32 bg-current opacity-30"></div>
      </div>
    );
  }

  if (activePreset === 'cyberpunk' || activePreset === 'space-scifi') {
    return (
      <div className="flex justify-between items-center font-mono text-[10px] text-primary my-16 px-4 opacity-75">
        <span>[SYSTEM_LINE_OK]</span>
        <span className="tracking-widest flex-grow mx-8 border-b border-dashed border-current opacity-30"></span>
        <span>[0x7F9B]</span>
      </div>
    );
  }

  if (activePreset === 'horror' || activePreset === 'gritty') {
    return (
      <div className="my-16 px-2">
        <div 
          className="h-3 w-full opacity-90 rounded-sm"
          style={{
            background: 'repeating-linear-gradient(45deg, var(--primary), var(--primary) 10px, var(--surface-dim) 10px, var(--surface-dim) 20px)'
          }}
        />
      </div>
    );
  }

  if (activePreset === 'steampunk') {
    return (
      <div className="flex items-center justify-center gap-2 text-primary my-16 opacity-80">
        <div className="h-1.5 w-1/3 bg-current opacity-40 rounded-full"></div>
        <div className="w-8 h-8 rounded-full border-4 border-current flex items-center justify-center font-mono text-xs font-bold bg-surface">⚙</div>
        <div className="h-1.5 w-1/3 bg-current opacity-40 rounded-full"></div>
      </div>
    );
  }

  // Fallback / standard whitespace gap for minimalist themes
  return <div className="my-16 h-2 bg-transparent" />;
}
