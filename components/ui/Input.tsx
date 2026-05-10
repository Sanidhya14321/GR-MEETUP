import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showCharCount?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  showCharCount,
  className = '',
  id,
  maxLength,
  value,
  ...props
}: InputProps) {
  const inputId = id || props.name;
  const helperId = inputId ? `${inputId}-help` : undefined;
  const errorId = inputId ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-900">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leftIcon ? <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">{leftIcon}</span> : null}
        <input
          id={inputId}
          value={value}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'border-error-500' : 'border-neutral-200'} ${className}`.trim()}
          {...props}
        />
        {rightIcon ? <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">{rightIcon}</span> : null}
      </div>
      {(helperText || error || showCharCount) && (
        <div className="flex items-center justify-between gap-4 text-sm">
          <div className="space-y-1">
            {helperText ? <p id={helperId} className="text-neutral-500">{helperText}</p> : null}
            {error ? <p id={errorId} className="text-error-600">{error}</p> : null}
          </div>
          {showCharCount && maxLength ? (
            <p className="text-neutral-400">
              {charCount}/{maxLength}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
