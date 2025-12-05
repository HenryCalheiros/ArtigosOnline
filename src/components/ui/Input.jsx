import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
            <input
                className={`w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
