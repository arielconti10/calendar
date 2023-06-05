'use client'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Calendar as BigCalendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from 'react-big-calendar'
import * as dates from '@/utils/dates'
import { Appointment } from '@prisma/client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const mLocalizer = momentLocalizer(moment)

const ColoredDateCellWrapper = ({ children }: { children: React.ReactNode }) =>
  React.cloneElement(React.Children.only(children) as React.ReactElement, {
    style: {
      backgroundColor: 'lightblue',
    },
  })

interface BasicProps {
  events: Appointment[]
  localizer?: DateLocalizer
  showDemoLink?: boolean
}

export default function Basic({
  events,
  localizer = mLocalizer,
  ...props
}: BasicProps) {
  const [showDialog, setShowDialog] = React.useState(false)
  const [selectedEvent, setSelectedEvent] = React.useState<Appointment | null>(null)

  const { defaultDate, max, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
        event: () => (
          <div className="flex flex-col">
            <div className="text-sm font-bold">Client Name</div>
            <div className="text-sm">Client Email</div>
          </div>
        ),
      },
      defaultDate: new Date(),
      max: dates.add(dates.endOf(new Date(), 'day'), -1, 'hours'),
      views: Object.keys(Views).map((k) => Views[k as keyof typeof Views]),
    }),
    []
  )

  const parsedEvents = events.map((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);

    return {
      ...event,
      title: event.clientName,
      start,
      end
    };
  });

  return (
    <div className="h-[600px] w-full">
      <BigCalendar
        components={{
          timeSlotWrapper: ({ children }: any) => (
            <ColoredDateCellWrapper>{children}</ColoredDateCellWrapper>
          ),
        }}
        defaultDate={defaultDate}
        onSelectEvent={(event) => {
          setShowDialog(true)
          setSelectedEvent(event)
        }}
        events={parsedEvents}
        localizer={localizer}
        max={max}
        showMultiDayTimes
        step={60}
        views={views}
      />

      <Dialog modal={true} open={showDialog} onOpenChange={() => setShowDialog(!showDialog)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>View Details</DialogTitle>
            <DialogDescription>
              Check here the details of your appointment
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={selectedEvent.clientName} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Date
                </Label>
                <Input id="date" value={new Date(selectedEvent.date).toLocaleString('pt-BR')} disabled className="col-span-3" />

              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Start time
                </Label>
                <Input id="start" value={new Date(selectedEvent.start).toLocaleString('pt-BR')} disabled className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  End time
                </Label>
                <Input id="end" value={new Date(selectedEvent.end).toLocaleString('pt-BR')} disabled className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Value
                </Label>
                <Input id="estimatedValue" type="number" value={selectedEvent.estimatedValue!!} disabled className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  )
}
Basic.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  showDemoLink: PropTypes.bool,
}