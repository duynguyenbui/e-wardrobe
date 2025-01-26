import { ChatForm } from '@/components/Forms/ChatForm'
import { getMeUser } from '@/utilities/getMeUser'
import { redirect } from 'next/navigation'

const Page = async () => {
  const { user } = await getMeUser()

  if (!user) {
    redirect('/login')
  }

  return <ChatForm />
}

export default Page
