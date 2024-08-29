import { ComponentProps } from 'react'

export interface TableHeaderProps extends ComponentProps<'th'> {}

export function TableHeader(props: TableHeaderProps) {
  return <th className='px-4 py-3 text-left font-semibold' {...props} />
}
