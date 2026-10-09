import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed top-20 right-8 z-[100] animate-bounce-short">
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/95 border border-indigo-500/40 text-slate-100 shadow-2xl shadow-indigo-950/50 backdrop-blur-md">
        <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
        <span className="text-sm font-medium">{toast}</span>
      </div>
    </div>
  );
};
