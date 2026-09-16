import React from 'react';

const Input = React.forwardRef(function Input(
  {
    label,
    error,
    required = false,
    className = '',
    icon: Icon,
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5 font-inter">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-4 py-2.5 bg-white dark:bg-slate-900/60 border rounded-xl font-inter text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition duration-200 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 dark:border-slate-800 focus:border-red-500 focus:ring-red-500/20'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1 animate-fadeIn">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
});

export default Input;