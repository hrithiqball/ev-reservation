import { useEffect, useState } from 'react'
import { api } from '@/lib/network'
import type { User } from '@/types/user'

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    api
      .get('/users/me', { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
  }, [])

  return user
}
