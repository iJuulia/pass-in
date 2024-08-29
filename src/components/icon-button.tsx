import { ComponentProps } from 'react'

export interface IconButtonProps extends ComponentProps<'button'> {
  transparent?: boolean
}

export function IconButton({ transparent, ...props }: IconButtonProps) {
  return (
    <button
      className={
        transparent
          ? 'rounded-md border border-white/10 p-1.5 hover:bg-white/10'
          : 'rounded-md border border-white/10 bg-white/10 p-1.5 disabled:opacity-50'
      }
      {...props}
    />
  )
}
