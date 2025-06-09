import type { ChargingSession } from '@/types/charging-session'
import { Car, Clock, Fuel, Zap } from 'lucide-react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type SessionCardProps = {
  session: ChargingSession
  isCompleted: boolean
  isCharging?: boolean
}

export function SessionCard({
  session,
  isCompleted,
  isCharging = false,
}: SessionCardProps) {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card className="h-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {session.station.name}
          </CardTitle>
          <Badge
            variant={
              isCharging ? 'success' : isCompleted ? 'primary' : 'warning'
            }
            className="text-xs"
          >
            {isCharging && (
              <>
                <Zap className="size-4 text-green-500 dark:text-green-400" />
                Charging
              </>
            )}
            {!isCharging && (isCompleted ? 'Completed' : 'Reserved')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Car className="size-4" />
          <span>
            {session.vehicle.make} {session.vehicle.model}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Fuel className="size-4" />
          <span>Pump #{session.pumpNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-4" />
          <span>{formatDateTime(session.startTime)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
