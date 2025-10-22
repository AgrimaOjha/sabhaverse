const { PrismaClient } = require('@prisma/client');

// Mock Prisma client for development without database
const prisma = {
  user: {
    findUnique: () => Promise.resolve(null),
    create: (data) => Promise.resolve({ id: '1', ...data.data }),
    update: () => Promise.resolve({})
  },
  post: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({})
  },
  comment: {
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({})
  },
  debate: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    count: () => Promise.resolve(0)
  },
  debateReply: {
    create: () => Promise.resolve({}),
    deleteMany: () => Promise.resolve({})
  }
};

module.exports = prisma;