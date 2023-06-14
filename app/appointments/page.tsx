import Link from "next/link"
import { Plus } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import Calendar from "@/components/calendar"
import { getBaseUrl } from "@/lib/getBaseUrl"

async function getAppointments() {
  const baseUrl = getBaseUrl();
  const appointments = await fetch(`${baseUrl}/api/appointments`, {
    cache: "no-cache",
  })
  return appointments.json()
}

export default async function Page() {
  const appointments = await getAppointments()

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
      </div>
    </section >
  )
}