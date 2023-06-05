import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function addImageToAppointment(appointmentId: number, imageUrl: string) {
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

export async function getAppointments() {
  const client = new PrismaClient();
  const appointments = await client.appointment.findMany()
  return appointments
}
