import { useCurrentUser } from '@/hooks/use-current-user'

export function Profile() {
  const user = useCurrentUser()

  return <div>{JSON.stringify(user, null, 2)}</div>
}
