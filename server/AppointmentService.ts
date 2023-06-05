import { PrismaClient } from '@prisma/client'

export async function getAppointments() {
  const client = new PrismaClient();
  const appointments = await client.appointment.findMany()
  return appointments
}
