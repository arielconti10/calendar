'use client'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import React, { useMemo } from 'react'
import { Prisma } from '@prisma/client';
import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'
import {
  Calendar as BigCalendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from 'react-big-calendar'

import * as dates from '@/utils/dates'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


const mLocalizer = momentLocalizer(moment)

const ColoredDateCellWrapper = ({ children }: { children: React.ReactNode }) =>
  React.cloneElement(React.Children.only(children) as React.ReactElement, {
    style: {
      backgroundColor: 'lightblue',
    },
  })

type Appointment = Prisma.AppointmentGetPayload<{
  include: {
    images: true
  }
}>;

interface CalendarProps {
  events: Appointment[]
  localizer?: DateLocalizer
}

export default function Calendar({ events }: CalendarProps) {
  const localizer = mLocalizer
  const [showDialog, setShowDialog] = React.useState(false)
  const [selectedEvent, setSelectedEvent] = React.useState<Appointment | null>(null)

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

  return (
    <div>
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
      </div>

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

              {selectedEvent.images && selectedEvent.images.length > 0 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  {selectedEvent.images.map((image) => (
                    <Link href={image.url} target='_blank' >
                      <Image alt="" src={image.url} key={image.id} width="200" height="100" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* <DialogFooter>
             <Button type="submit">Save changes</Button>
           </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div >
  )
}