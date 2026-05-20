import prisma from '@/lib/prisma'

/** Resolve DB user from session (id first, then email). */
export async function resolveUserFromSession(session) {
  if (!session?.user) return null

  const { id, email } = session.user

  if (id) {
    const byId = await prisma.user.findUnique({ where: { id } })
    if (byId) return byId
  }

  if (email) {
    const byEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    if (byEmail) return byEmail
  }

  return null
}
