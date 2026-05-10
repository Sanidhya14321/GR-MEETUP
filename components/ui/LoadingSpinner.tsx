import type { HTMLAttributes } from 'react';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  colorClassName?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

export function LoadingSpinner({
  size = 'md',
  colorClassName = 'border-primary-500',
  className = '',
  ...props
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-flex items-center justify-center ${className}`.trim()}
      {...props}
    >
      <span className={`animate-spin rounded-full border-neutral-200 border-t-current ${sizeClasses[size]} ${colorClassName}`} />
    </span>
  );
}
