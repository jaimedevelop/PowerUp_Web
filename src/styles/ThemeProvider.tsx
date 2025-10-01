// src/styles/ThemeProvider.tsx
import React from 'react';
import { themeVars } from './theme';

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  return (
    <div
      style={themeVars as React.CSSProperties}
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
    >
      {children}
    </div>
  );
}