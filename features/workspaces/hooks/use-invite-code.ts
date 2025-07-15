import { useParams } from 'next/navigation'

export const useInveiteCode = () => {
  const params = useParams()

  return params.inviteCode as string
}
