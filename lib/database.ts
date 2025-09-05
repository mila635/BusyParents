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
  return await prisma.userToken.upsert({
    where: { userId },
    update: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(tokens.expiresAt * 1000),
      scope: tokens.scope,
      updatedAt: new Date(),
    },
    create: {
      userId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(tokens.expiresAt * 1000),
      scope: tokens.scope,
    },
  })
}
