import { Badge } from '@/components/ui/badge'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Mail } from 'lucide-react'

export function Profile() {
  const user = useCurrentUser()

  return (
    <div className="container mx-auto p-6 space-y-6 flex flex-col items-center">
      <div className="size-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
        {user?.name?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="flex flex-col items-center">
        {user?.isAdmin && (
          <Badge variant="outline" className="mb-2">
            Admin
          </Badge>
        )}
        <span className="font-semibold">{user?.name}</span>
        <div className="flex items-center space-x-2">
          <Mail className="size-4" />
          <span className="text-muted-foreground text-sm">{user?.email}</span>
        </div>
      </div>
    </div>
  )
}
