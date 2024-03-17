import { PrismaClient } from '@prisma/client'

declare global {
  var cachedPrisma: PrismaClient
}

let prisma: PrismaClient

if(process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if(!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }

  prisma = global.cachedPrisma
}

export const db = prisma

// A single ton pattern is used to ensure that the PrismaClient is only instantiated once in the application. 
// This is important because PrismaClient is designed to be used as a singleton.
