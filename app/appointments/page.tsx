import Link from "next/link"
import { Appointment } from "@prisma/client"
import { Plus, Slash } from 'lucide-react'

import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Caladea } from "next/font/google"
import Calendar from "@/components/calendar"


async function getAppointments() {
  const appointments = await fetch("http://localhost:3000/api/appointments", {
    cache: "no-cache",
  })
  return appointments.json()
}

export default async function Appointments() {
  const appointments = await getAppointments()
  const date = new Date().toISOString();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-1 justify-between">
        <h1>My Appointments</h1>
        <Link href="/appointments/create" className={buttonVariants({ variant: "default" })}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />
      <div className="w-full">
        <Calendar events={appointments} />
        {/* {appointments.map((appointment: Appointment) => (
          <Card key={appointment.id}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                <h2 className="text-lg font-semibold">{appointment.clientName} at {appointment.place}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Body part: {appointment.bodyPart}
              </p>
              <p className="text-sm text-muted-foreground">
                Date: {appointment.date.toLocaleString("pt-BR")}
              </p>
              <p className="text-sm text-muted-foreground">
                Notes: {appointment.notes}
              </p>
            </CardContent>
            <CardFooter className="spacing-y-1 gap-4">
              <Button variant="default">View details</Button>
              <Button variant="destructive">
                <Slash className="mr-2 h-4 w-4" />Cancel
              </Button>
            </CardFooter>
          </Card>
        ))} */}
      </div>
    </section >
  )
}
