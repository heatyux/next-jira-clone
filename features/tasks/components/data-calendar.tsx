import { useState } from 'react'

import {
  addMonths,
  format,
  getDay,
  parse,
  startOfDay,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { enUS } from 'date-fns/locale'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { Button } from '@/components/ui/button'

import type { Task } from '../types'
import './data-calendar.css'
import { EventCard } from './event-card'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfDay,
  startOfWeek,
  getDay,
  locales,
})

interface DataCalendarProps {
  data: Task[]
}

interface CustomToolbarProps {
  date: Date
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void
}

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  return (
    <div className="flex items-center justify-center gap-x-2 w-full mb-4 lg:w-auto lg:justify-start">
      <Button
        title="Previous Month"
        variant="secondary"
        size="icon"
        onClick={() => onNavigate('PREV')}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex items-center justify-center border border-input rounded-md px-3 py-2 h-8 w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm">{format(date, 'MMMM yyyy')}</p>
      </div>

      <Button
        title="Next Month"
        variant="secondary"
        size="icon"
        onClick={() => onNavigate('NEXT')}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}

export const DataCalendar = ({ data }: DataCalendarProps) => {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date(),
  )

  const events = data.map((task) => ({
    id: task.$id,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
  }))

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') setValue(subMonths(value, 1))
    else if (action === 'NEXT') setValue(addMonths(value, 1))
    else if (action === 'TODAY') setValue(new Date())
  }

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={['month']}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, 'EEE', culture) ?? '',
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
        toolbar: () => (
          <CustomToolbar date={value} onNavigate={handleNavigate} />
        ),
      }}
    />
  )
}
