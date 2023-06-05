import { Separator } from "@/components/ui/separator"
import { CreateForm } from "./create-form"

export default function CreateAppointmentPage() {
  return (
    <div className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1>Create Appointment</h1>
      <Separator />
      <CreateForm />
    </div>
  )
}