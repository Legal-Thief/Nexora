import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ChartCard({ title, subtitle, loading, children, className = '' }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex-1 w-full h-full min-h-[250px] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

