import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function addImageToAppointment(appointmentId: number, imageUrl: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { images: true },
  });

  if (!appointment) {
    throw new Error(`Appointment with ID ${appointmentId} not found`);
  }

  const image = await prisma.image.create({
    data: {
      url: imageUrl,
      appointment: { connect: { id: appointmentId } },
    },
  });

  return image;
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { appointmentId, url } = body;

  return addImageToAppointment(appointmentId, url)
    .then((image) => {
      return NextResponse.json(image);
    })
    .catch((error) => {
      console.log(error);
      return NextResponse.error();
    });
}