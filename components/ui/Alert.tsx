import type { HTMLAttributes, ReactNode } from 'react';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: ReactNode;
}

export function Alert({ title, icon, className = '', children, ...props }: AlertProps) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 ${className}`.trim()} {...props}>
      <div className="flex gap-3">
        {icon ? <span className="mt-0.5 text-neutral-500">{icon}</span> : null}
        <div className="space-y-1">
          {title ? <p className="font-medium text-neutral-900">{title}</p> : null}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
