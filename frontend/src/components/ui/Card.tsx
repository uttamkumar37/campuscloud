import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '../../lib/cn'

interface CardProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.35)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
