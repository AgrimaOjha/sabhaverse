const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

console.log("🧠 Connected to database:", process.env.DATABASE_URL);

module.exports = prisma;
