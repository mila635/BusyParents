import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// User management functions
export async function createUser(userData: {
  email: string
  name: string
  image?: string
  provider: string
}) {
  return await prisma.user.upsert({
    where: { email: userData.email },
    update: {
      name: userData.name,
      image: userData.image,
      lastLoginAt: new Date(),
    },
    create: {
      email: userData.email,
      name: userData.name,
      image: userData.image,
      provider: userData.provider,
      lastLoginAt: new Date(),
    },
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      tokens: true,
      settings: true,
    },
  })
}

export async function updateUserTokens(userId: string, tokens: {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  scope: string
}) {
  // First, try to find existing token
  const existingToken = await prisma.userToken.findFirst({
    where: { userId }
  });

  if (existingToken) {
    // Update existing token
    return await prisma.userToken.update({
      where: { id: existingToken.id },
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(tokens.expiresAt * 1000),
        scope: tokens.scope,
        updatedAt: new Date(),
      },
    });
  } else {
    // Create new token
    return await prisma.userToken.create({
      data: {
        userId,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(tokens.expiresAt * 1000),
        scope: tokens.scope,
      },
    });
  }
}

// N8N User Data functions
export async function upsertN8NUserData(data: {
  userId: string;
  name?: string;
  email: string;
  accessToken?: string;
  gmailRefreshToken?: string;
  calendarId?: string;
  phoneNumber?: string;
}) {
  // First try to find existing record by userId and email
  const existingRecord = await prisma.n8NUserData.findFirst({
    where: {
      userId: data.userId,
      email: data.email,
    },
  });

  if (existingRecord) {
    // Update existing record
    return await prisma.n8NUserData.update({
      where: { id: existingRecord.id },
      data: {
        name: data.name,
        accessToken: data.accessToken,
        gmailRefreshToken: data.gmailRefreshToken,
        calendarId: data.calendarId,
        phoneNumber: data.phoneNumber,
        lastSyncedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } else {
    // Create new record
    return await prisma.n8NUserData.create({
      data: {
        userId: data.userId,
        name: data.name,
        email: data.email,
        accessToken: data.accessToken,
        gmailRefreshToken: data.gmailRefreshToken,
        calendarId: data.calendarId,
        phoneNumber: data.phoneNumber,
        lastSyncedAt: new Date(),
      },
    });
  }
}

export async function getN8NUserData(email: string) {
  return await prisma.n8NUserData.findFirst({
    where: { email },
  });
}

export async function getAllN8NUserData() {
  return await prisma.n8NUserData.findMany({
    orderBy: { lastSyncedAt: 'desc' },
  });
}
