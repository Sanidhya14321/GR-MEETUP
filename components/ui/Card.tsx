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
      className={`rounded-3xl border border-neutral-200 bg-white shadow-[0_6px_22px_-14px_rgba(15,23,42,0.28)] transition-all ${hover ? 'hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(47,147,209,0.34)]' : ''} ${clickable ? 'cursor-pointer' : ''} ${className}`.trim()}
      {...props}
    >
      {header ? <div className="border-b border-neutral-200 px-6 py-4">{header}</div> : null}
      <div className={paddingClasses[padding]}>{children}</div>
      {footer ? <div className="border-t border-neutral-200 px-6 py-4">{footer}</div> : null}
    </div>
  );
}
