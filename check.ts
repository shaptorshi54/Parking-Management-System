import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.bookings.findMany({
    include: {
      slots: true,
      vehicle: true
    }
  });
  
  console.log("ALL BOOKINGS IN DATABASE:");
  console.log(JSON.stringify(bookings, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
