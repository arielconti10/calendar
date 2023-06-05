import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// define the schema for the request body
const bodySchema = z.object({
  date: z.string(),
  place: z.string(),
  clientName: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  notes: z.string().optional(),
  estimatedValue: z.number().optional(),
  bodyPart: z.enum(['head', 'neck', 'shoulders', 'back', 'arms', 'hands', 'legs', 'feet']),
})

export async function GET() {
  const client = new PrismaClient()
  const appointments = await client.appointment.findMany()
  return NextResponse.json(appointments)
}

export async function POST(request: NextRequest) {
  const client = new PrismaClient()

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
    // return an error response if the request body doesn't match the schema
    return NextResponse.json('Invalid request body')
  }
}