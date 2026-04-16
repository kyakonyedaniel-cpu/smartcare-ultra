import React, { createContext, useContext } from 'react';
import { useThemeStore } from '@/store';
import { cn } from '@/lib/utils';

const ThemeContext = createContext({});

export function useTheme() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  return {
    isDark,
    theme,
    // Base classes
    bg: isDark ? 'bg-slate-950' : 'bg-gray-50',
    text: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-slate-400' : 'text-gray-500',
    border: isDark ? 'border-slate-800' : 'border-gray-200',
    // Card classes
    card: cn(
      'rounded-2xl shadow-sm',
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
    ),
    // Input classes
    input: cn(
      'focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
      isDark 
        ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
    ),
    // Table classes
    tableHead: isDark ? 'bg-slate-900' : 'bg-gray-50',
    tableRow: isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50',
    tableCell: isDark ? 'text-slate-300' : 'text-gray-600',
    // Button classes
    btnPrimary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25',
    btnSecondary: cn(
      'border transition-colors',
      isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
    ),
    // Badge colors that work in both modes
    getBadge: (status) => {
      const colors = {
        active: isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700',
        inactive: isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-700',
        pending: isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
        completed: isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700',
        failed: isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700',
        paid: isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700',
        overdue: isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700',
      };
      return colors[status] || (isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-700');
    },
  };
}

export function ThemeProvider({ children }) {
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}