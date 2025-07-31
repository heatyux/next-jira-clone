'use client'

import { PopoverClose } from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { CalendarIcon, OctagonMinus } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type DatePickerProps = {
  value: Date | undefined
  onChange: (value: Date | null) => void
  disabled?: boolean
  className?: string
  placeholder?: string
  showReset?: boolean
}

export const DatePicker = ({
  value,
  onChange,
  disabled = false,
  className,
  placeholder = 'Select date',
  showReset = false,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(
            'w-full text-left font-normal px-3',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => onChange(date as Date)}
          autoFocus
        />

        {showReset && value && (
          <PopoverClose asChild>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => onChange(null)}
            >
              <OctagonMinus className="size-4" />
              Reset Filter
            </Button>
          </PopoverClose>
        )}
      </PopoverContent>
    </Popover>
  )
}
