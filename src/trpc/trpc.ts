import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { TRPCError, initTRPC } from "@trpc/server"

// Initialization of tRPC backend
const t = initTRPC.create()
const middleware = t.middleware

const isAuth = middleware(async (options) => {
  const { getUser } = getKindeServerSession()
  const user = getUser()

  if(!user || !user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return options.next({
    ctx: {
      userId: user.id,
      user
    }
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth) // when this procedure is called, the user must be authenticated