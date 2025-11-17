const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prisma = require('../src/utils/prisma');

(async () => {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  try {
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
  } catch (err) {
    console.error('Prisma test error name:', err.name);
    console.error('Prisma test error message:', err.message);
    console.error('Prisma test error stack:', err.stack);
  } finally {
    await prisma.$disconnect();
  }
})();