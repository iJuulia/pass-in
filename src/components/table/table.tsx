import { ComponentProps } from 'react'

export interface TableProps extends ComponentProps<'table'> {}

export function Table(props: TableProps) {
  return (
    <div className='rounded-lg border border-white/10'>
      <table className='w-full' {...props} />
    </div>
  )
}
