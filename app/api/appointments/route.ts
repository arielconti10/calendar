import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const client = new PrismaClient()
// define the schema for the request body
const bodySchema = z.object({
  date: z.string(),
  place: z.string(),
  clientName: z.string(),
  start: z.string(),
  end: z.string(),
  style: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  notes: z.string().optional(),
  estimatedValue: z.string(),
  bodyPart: z.enum(['head', 'neck', 'shoulders', 'back', 'arms', 'hands', 'legs', 'feet']),
})

export const GET = async () => {
  // get all appointments from the database, including the images
  const appointments = await client.appointment.findMany({
    include: { images: true },
  })

  return NextResponse.json(appointments)
}

export const POST = async (request: NextRequest) => {


  // get the request body
  const body = await request.json()

  try {
    // validate the request body with the prisma schema using zod
    const validatedBody = bodySchema.parse(body)

    // create the appointment
    const appointment = await client.appointment.create({
      data: {
        date: validatedBody.date,
        place: validatedBody.place,
        start: validatedBody.start,
        end: validatedBody.end,
        style: validatedBody.style,
        clientName: validatedBody.clientName,
        status: validatedBody.status,
        notes: validatedBody.notes,
        estimatedValue: validatedBody.estimatedValue,
        bodyPart: validatedBody.bodyPart,
      },
    })

    // return the appointment
    return NextResponse.json(appointment)
  } catch (error) {
    console.log(error)
    // return an error response if the request body doesn't match the schema
    return NextResponse.json('Invalid request body')
  }
}