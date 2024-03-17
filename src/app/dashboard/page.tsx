import { redirect } from "next/navigation"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

const Page = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if(!user || !user.id) {
    redirect('/auth-callback?origin=dashboard')
  }

  return (
    <div>{user.email}</div>
  )
}

export default Page