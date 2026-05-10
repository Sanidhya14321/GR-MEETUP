import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  header,
  footer,
  padding = 'md',
  hover = false,
  onClick,
  className = '',
  children,
  ...props
}: CardProps) {
  const clickable = Boolean(onClick);

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      className={`rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all ${hover ? 'hover:-translate-y-0.5 hover:shadow-md' : ''} ${clickable ? 'cursor-pointer' : ''} ${className}`.trim()}
      {...props}
    >
      {header ? <div className="border-b border-neutral-200 px-6 py-4">{header}</div> : null}
      <div className={paddingClasses[padding]}>{children}</div>
      {footer ? <div className="border-t border-neutral-200 px-6 py-4">{footer}</div> : null}
    </div>
  );
}
