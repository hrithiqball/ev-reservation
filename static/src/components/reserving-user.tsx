import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useCurrentUser } from '@/hooks/use-current-user'
import { api } from '@/lib/network'
import type { ChargingSession } from '@/types/charging-session'
import type { EvStations } from '@/types/ev-stations'
import type { Vehicle } from '@/types/vehicle'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Battery, Clock, Eye, EyeOff, Loader2, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { SessionCard } from './session-card'
import { Button } from './ui/button'

interface IncomingMsg {
  station: EvStations
  pump: number
  vehicle: Vehicle
  chargingRate: number
  sessionId: number
  status: 'charging' | 'completed'
}

export function ReservingUser() {
  const user = useCurrentUser()
  const queryClient = useQueryClient()

  const [showCompletedSessions, setShowCompletedSessions] = useState(false)
  const [showReservedSessions, setShowReservedSessions] = useState(false)
  const [showCurrentSessions, setShowCurrentSessions] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [currentSessions, setCurrentSessions] = useState<
    Map<string, IncomingMsg>
  >(new Map())

  const { data, isPending, error, isError } = useQuery({
    queryKey: ['reserving-user', user?.id],
    queryFn: async () => {
      const response = await api.get('/charging-sessions', {
        params: { userId: user?.id, size: 100 },
      })

      return response.data
    },
  })

  function handleCompletedSession(data: IncomingMsg) {
    toast.success(
      `🔋 ${data.vehicle.make} ${data.vehicle.model} is fully charged!`,
      {
        description: `Plate: ${data.vehicle.plateNumber} - Station: ${data.station.name}`,
        duration: 5000,
      }
    )
    queryClient.invalidateQueries({ queryKey: ['reserving-user', user?.id] })
  }

  const connectWebSocket = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      return
    }

    const newWs = new WebSocket('ws://localhost:8080/ws/charging')

    newWs.onopen = () => {
      newWs.send('Hello from client!')
    }

    newWs.onmessage = (event) => {
      let data: IncomingMsg
      try {
        data = JSON.parse(event.data) as IncomingMsg
      } catch {
        console.error('Bad JSON from server:', event.data)
        return
      }

      if (data.vehicle.owner?.id !== user?.id) {
        return
      }

      const key = `${data.station.id}-${data.vehicle.id}-${data.pump}`

      setCurrentSessions((prev) => {
        const next = new Map(prev)

        if (data.status === 'completed') {
          next.delete(key)
          handleCompletedSession(data)
        } else {
          next.set(key, data)
        }

        return next
      })
    }

    newWs.onerror = () => {
      console.error('WebSocket error')
    }

    newWs.onclose = () => {
      console.log('WebSocket closed')
    }

    setWs(newWs)
  }

  const disconnectWebSocket = () => {
    if (ws) {
      ws.close()
      setWs(null)
    }
  }

  useEffect(() => {
    connectWebSocket()

    return () => {
      disconnectWebSocket()
    }
  }, [user?.id])

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full space-x-2">
        <Loader2 className="animate-spin" />
      </div>
    )

  if (isError)
    return (
      <div className="text-red-500">
        Error loading vehicles:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )

  const completedSessions = data.content.filter(
    (s: ChargingSession) => s.isCompleted
  )
  const reservedSessions = data.content.filter(
    (s: ChargingSession) => s.isReserved
  )

  const chunkSessions = (
    sessions: ChargingSession[],
    chunkSize: number = 5
  ) => {
    const chunks = []
    for (let i = 0; i < sessions.length; i += chunkSize) {
      chunks.push(sessions.slice(i, i + chunkSize))
    }
    return chunks
  }

  const chunkCurrentSessions = (
    sessions: IncomingMsg[],
    chunkSize: number = 5
  ) => {
    const chunks = []
    for (let i = 0; i < sessions.length; i += chunkSize) {
      chunks.push(sessions.slice(i, i + chunkSize))
    }
    return chunks
  }

  // Convert WebSocket IncomingMsg to ChargingSession format for SessionCard
  const convertToChargingSession = (msg: IncomingMsg): ChargingSession => ({
    id: msg.sessionId,
    user: user!,
    vehicle: msg.vehicle,
    station: msg.station,
    pumpNumber: msg.pump,
    isCompleted: false,
    isReserved: false,
    isCharging: true,
    startTime: new Date().toISOString(), // We don't have start time from WebSocket, use current time
  })

  return (
    <div className="space-y-8 p-4">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Zap className="size-4 text-yellow-600" />
          <h2 className="text-xl font-semibold">Current Sessions</h2>
          <Badge variant="secondary">{currentSessions.size}</Badge>
          <Button
            size="small"
            variant="ghost"
            onClick={() => setShowCurrentSessions(!showCurrentSessions)}
            className="ml-auto"
          >
            {showCurrentSessions ? <EyeOff /> : <Eye />}
            {showCurrentSessions ? 'Hide' : 'Show'}
          </Button>
        </div>
        {showCurrentSessions && (
          <div className="px-8">
            {currentSessions.size > 0 ? (
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {chunkCurrentSessions([...currentSessions.values()]).map(
                    (chunk, chunkIndex) => (
                      <CarouselItem key={chunkIndex}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                          {chunk.map((session) => {
                            const key = `${session.station.id}-${session.vehicle.id}-${session.pump}`
                            return (
                              <SessionCard
                                key={key}
                                session={convertToChargingSession(session)}
                                isCompleted={false}
                                isCharging
                              />
                            )
                          })}
                        </div>
                      </CarouselItem>
                    )
                  )}
                </CarouselContent>
                {chunkCurrentSessions([...currentSessions.values()]).length >
                  1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No current charging sessions
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Battery className="size-4 text-green-600" />
          <h2 className="text-xl font-semibold">Completed Sessions</h2>
          <Badge variant="secondary">{completedSessions.length}</Badge>
        </div>
        <Button
          size="small"
          variant="ghost"
          onClick={() => setShowCompletedSessions(!showCompletedSessions)}
        >
          {showCompletedSessions ? <EyeOff /> : <Eye />}
          {showCompletedSessions ? 'Hide' : 'Show'}
        </Button>
      </div>
      {showCompletedSessions && (
        <div className="px-8">
          {completedSessions.length > 0 ? (
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {chunkSessions(completedSessions).map((chunk, chunkIndex) => (
                  <CarouselItem key={chunkIndex}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {chunk.map((session) => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          isCompleted
                        />
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {chunkSessions(completedSessions).length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <Battery className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No completed sessions yet
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center gap-4 mb-4">
          <Clock className="size-4 text-blue-600" />
          <h2 className="text-xl font-semibold">Reserved Sessions</h2>
          <Badge variant="secondary">{reservedSessions.length}</Badge>
          <Button
            size="small"
            variant="ghost"
            onClick={() => setShowReservedSessions(!showReservedSessions)}
            className="ml-auto"
          >
            {showReservedSessions ? <EyeOff /> : <Eye />}
            {showReservedSessions ? 'Hide' : 'Show'}
          </Button>
        </div>
        {showReservedSessions && (
          <div className="px-8">
            {reservedSessions.length > 0 ? (
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {chunkSessions(reservedSessions).map((chunk, chunkIndex) => (
                    <CarouselItem key={chunkIndex}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {chunk.map((session) => (
                          <SessionCard
                            key={session.id}
                            session={session}
                            isCompleted={false}
                          />
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {chunkSessions(reservedSessions).length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reserved sessions</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
