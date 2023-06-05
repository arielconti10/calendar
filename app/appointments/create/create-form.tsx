"use client"
import { useState } from "react"
import { DANGEROUS__uploadFiles } from "uploadthing/client";

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"

import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUploadThing } from "@/utils/useUploadThing"
import { UploadDropzone } from "@/components/upload"

const appointmentFormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  clientName: z.string({
    required_error: "A client name is required.",
  }),
  place: z.string({
    required_error: "A place is required.",
  }),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  notes: z.string({
    required_error: "Add your notes about the project.",
  }),
  start: z.string({
    required_error: "Add the start time of the project.",
  }),
  end: z.string({
    required_error: "Add the end time of the project.",
  }),
  style: z.string({
    required_error: "Add the style of the project.",
  }),
  estimatedValue: z.string({
    required_error: "Add the estimated value of the project.",
  }),
  bodyPart: z.enum(['head', 'neck', 'shoulders', 'back', 'arms', 'hands', 'legs', 'feet'], {
    required_error: "Select where the tattoo will be made.",
  }),
  image: z.string().optional(),
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AppointmentFormValues> = {
  status: 'pending',
}

export function CreateForm() {
  const { startUpload, isUploading } =
    useUploadThing<string>({
      endpoint: "imageUploader", // replace this with an actual endpoint name
      onClientUploadComplete: () => { alert("uploaded successfully!"); },
      onUploadError: () => { alert("error occurred while uploading"); },
    });

  const [files, setFiles] = useState<File[]>([]);


  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues,
  })

  const handleFilesChanged = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  async function onSubmit(data: AppointmentFormValues) {
    let today = new Date();

    const appointmentDate = new Date(data.date);

    let [startHour, startMinutes] = data.start.split(":");
    let [endHour, endMinutes] = data.end.split(":");

    let start = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), parseInt(startHour), parseInt(startMinutes));
    let end = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), parseInt(endHour), parseInt(endMinutes));

    data.start = start.toISOString();
    data.end = end.toISOString();

    const response = await fetch("/api/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newAppointment = await response.json();

    if (newAppointment) {
      if (files.length > 0) {
        const urls = await startUpload(files);

        urls && urls.map((url) => {
          fetch("/api/appointments/images", {
            method: "POST",
            body: JSON.stringify({ image: url, appointmentId: newAppointment.id }),
          });
        });

        toast({
          title: "Appointment created.",
          description: "Your appointment has been created.",
        });

        form.reset();

        window.location.href = "/";
      }
    }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Studio</FormLabel>
                <FormControl>
                  <Input placeholder="Studio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bodyPart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body part</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the part of the body" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="head">Head</SelectItem>
                      <SelectItem value="neck">Neck</SelectItem>
                      <SelectItem value="chest">Chest</SelectItem>
                      <SelectItem value="shoulders">Shoulders</SelectItem>
                      <SelectItem value="back">Back</SelectItem>
                      <SelectItem value="arms">Arms</SelectItem>
                      <SelectItem value="hands">Hands</SelectItem>
                      <SelectItem value="legs">Legs</SelectItem>
                      <SelectItem value="feet">Feet</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated value</FormLabel>
                <FormControl>
                  <Input placeholder="Estimated value" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style</FormLabel>
                <FormControl>
                  <Input placeholder="Style" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Select the date of the tattoo</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>

            )}
          />

          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start time</FormLabel>
                <FormControl>
                  <Input placeholder="Start time" {...field} type="time" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End time</FormLabel>
                <FormControl>
                  <Input placeholder="End time" {...field} type="time" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Upload a reference image</FormLabel>
            <FormControl>
              <UploadDropzone onFilesChanged={handleFilesChanged} />

            </FormControl>
          </FormItem>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => <Input placeholder="status" {...field} type="hidden" value="pending" />}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add any additional notes about the appointment." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        <Button variant="default" type="submit">Create appointment</Button>
      </form>
    </Form>
  )
}