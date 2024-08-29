import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface AttendeesTypes {
  id: string
  checkedInAt: string
  createdAt: string | null
  email: string
  name: string
}

export function AttendeeList() {
  const [searchInput, setSearchInput] = useState(() => {
    const url = new URL(window.location.toString())
    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }
    return ''
  })
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())
    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }
    return 1
  })
  const [totalAttendees, setTotalAttendees] = useState(0)
  const [attendees, setAttendees] = useState<AttendeesTypes[]>([])

  const totalPages = Math.ceil(totalAttendees / 10)

  useEffect(() => {
    const url = new URL(
      'http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees',
    )
    url.searchParams.set('pageIndex', String(page - 1))
    if (searchInput.length > 0) {
      url.searchParams.set('query', searchInput)
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAttendees(data.attendees), setTotalAttendees(data.total)
      })
  }, [page, searchInput])

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())
    url.searchParams.set('search', search)
    window.history.pushState({}, '', url)
    setSearchInput(search)
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
    window.history.pushState({}, '', url)
    setPage(page)
  }

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

  function handleGoToFirstPage() {
    setCurrentPage(1)
  }
  function handleGoToPreviousPage() {
    setCurrentPage(page - 1)
  }
  function handleGoToNextPage() {
    setCurrentPage(page + 1)
  }
  function handleGoToLastPage() {
    setCurrentPage(totalPages)
  }

  return (
    <>
      <header className='flex items-center gap-3'>
        <h1 className='text-2xl font-bold'>Participantes</h1>
        <div className='flex w-72 items-center gap-2 rounded-lg border border-white/10 px-2 py-1.5'>
          <Search className='size-4 text-emerald-300' />
          <input
            onChange={onSearchInputChange}
            placeholder='Buscar participante...'
            className='h-auto flex-1 border-0 bg-transparent p-0 text-sm leading-[0] outline-none focus:ring-0'
            value={searchInput}
          />
        </div>
      </header>

      <Table>
        <thead>
          <TableRow>
            <TableHeader style={{ width: 48 }}>
              <input type='checkbox' />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <TableRow key={attendee.id} className='hover:bg-white/5'>
                <TableCell>
                  <input type='checkbox' />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell className='flex flex-col gap-1'>
                  <span className='font-semibold text-white'>
                    {attendee.name}
                  </span>
                  <span>{attendee.email.toLocaleLowerCase()}</span>
                </TableCell>
                <TableCell>
                  {dayjs().locale('pt-br').to(attendee.createdAt)}
                </TableCell>
                <TableCell>
                  {attendee.checkedInAt === null ? (
                    <span className='text-zinc-400'>Não fez check-in</span>
                  ) : (
                    dayjs().locale('pt-br').to(attendee.checkedInAt)
                  )}
                </TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando {attendees.length} de {totalAttendees} itens
            </TableCell>
            <TableCell className='space-x-8 text-right' colSpan={3}>
              <span>
                Página {page} de {totalPages}
              </span>
              <div className='inline space-x-1.5'>
                <IconButton onClick={handleGoToFirstPage} disabled={page === 1}>
                  <ChevronsLeft size={16} />
                </IconButton>
                <IconButton
                  onClick={handleGoToPreviousPage}
                  disabled={page === 1}>
                  <ChevronLeft size={16} />
                </IconButton>
                <IconButton
                  onClick={handleGoToNextPage}
                  disabled={page === totalPages}>
                  <ChevronRight size={16} />
                </IconButton>
                <IconButton
                  onClick={handleGoToLastPage}
                  disabled={page === totalPages}>
                  <ChevronsRight size={16} />
                </IconButton>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </>
  )
}
