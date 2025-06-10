import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/network'
import type { ChargingSessionPage } from '@/types/charging-session'
import type { EvStations } from '@/types/ev-stations'
import type { Vehicle } from '@/types/vehicle'
import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  Battery,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  History,
  MapPin,
  RefreshCw,
  Wifi,
  WifiOff,
  XCircle,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface IncomingMsg {
  station: EvStations
  pump: number
  vehicle: Vehicle
  chargingRate: number
  sessionId: number
  status: 'charging' | 'completed'
}

export function Monitoring() {
  const [connectionStatus, setConnectionStatus] = useState<
    'Connecting...' | 'Connected' | 'Disconnected' | 'Error'
  >('Connecting...')
  const [sessions, setSessions] = useState<Map<string, IncomingMsg>>(new Map())
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const { data: chargingSessionsData, isPending: isLoadingHistory } = useQuery({
    queryKey: ['charging-sessions', currentPage, pageSize],
    queryFn: async (): Promise<ChargingSessionPage> => {
      const response = await api.get('/charging-sessions', {
        params: {
          isCompleted: true,
          page: currentPage,
          size: pageSize,
        },
      })
      return response.data
    },
    staleTime: 30000, // 30 seconds
  })

  const connectWebSocket = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      return
    }

    setIsConnecting(true)
    setConnectionStatus('Connecting...')

    const newWs = new WebSocket(
      `${import.meta.env.VITE_WEBSOCKET_URL}/ws/charging`
    )

    newWs.onopen = () => {
      setConnectionStatus('Connected')
      setIsConnecting(false)
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

      const key = `${data.station.id}-${data.vehicle.id}-${data.pump}`

      setSessions((prev) => {
        const next = new Map(prev)

        if (data.status === 'completed') {
          next.delete(key)
          console.log(`vehicle ${data.vehicle.plateNumber} is completed`)
        } else {
          next.set(key, data)
        }

        return next
      })
    }

    newWs.onerror = () => {
      setConnectionStatus('Error')
      setIsConnecting(false)
    }

    newWs.onclose = () => {
      setConnectionStatus('Disconnected')
      setIsConnecting(false)
    }

    setWs(newWs)
  }

  const disconnectWebSocket = () => {
    if (ws) {
      ws.close()
      setWs(null)
      setConnectionStatus('Disconnected')
    }
  }

  useEffect(() => {
    connectWebSocket()

    return () => {
      disconnectWebSocket()
    }
  }, [])

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'Connected':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Connected
          </Badge>
        )
      case 'Connecting...':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Connecting...
          </Badge>
        )
      case 'Error':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Error
          </Badge>
        )
      case 'Disconnected':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Disconnected
          </Badge>
        )
      default:
        return null
    }
  }

  const formatChargingRate = (rate: number) => {
    if (rate >= 1000) {
      return `${(rate / 1000).toFixed(1)} kW`
    }
    return `${rate} W`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {getStatusBadge()}
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Button
                onClick={connectWebSocket}
                disabled={connectionStatus === 'Connected' || isConnecting}
                size="small"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Wifi className="w-4 h-4" />
                Connect
              </Button>
              <Button
                onClick={disconnectWebSocket}
                disabled={connectionStatus === 'Disconnected'}
                size="small"
                variant="outline"
                className="flex items-center gap-2"
              >
                <WifiOff className="w-4 h-4" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Sessions
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {sessions.size}
                  </p>
                </div>
                <Car className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Power
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatChargingRate(
                      [...sessions.values()].reduce(
                        (sum, s) => sum + s.chargingRate,
                        0
                      )
                    )}
                  </p>
                </div>
                <Battery className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Connection
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {connectionStatus}
                  </p>
                </div>
                {connectionStatus === 'Connected' ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {sessions.size === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                  <Car className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    No Active Sessions
                  </p>
                  <p className="text-muted-foreground">
                    {connectionStatus === 'Connected'
                      ? 'Waiting for charging sessions to begin...'
                      : 'Connect to start monitoring charging sessions'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...sessions.values()].map((s) => {
              const key = `${s.station.id}-${s.vehicle.id}-${s.pump}`
              return (
                <Card
                  key={key}
                  className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/20"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {s.station.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {s.station.location}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Pump #{s.pump}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/20">
                      <Car className="w-5 h-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {s.vehicle.make} {s.vehicle.model}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {s.vehicle.plateNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50 dark:border-green-800/30">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Charging Rate
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-700 dark:text-green-300">
                          {formatChargingRate(s.chargingRate)}
                        </p>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Battery Capacity
                      </span>
                      <div className="flex items-center gap-1">
                        <Battery className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-foreground">
                          {s.vehicle.batteryCapacity} kWh
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="flex items-center gap-2">
          <History className="w-6 h-6 text-primary" />
          <span className="font-semibold">Charging Session History</span>
        </div>
        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Loading history...
            </span>
          </div>
        ) : chargingSessionsData?.content &&
          chargingSessionsData.content.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Pump</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chargingSessionsData.content.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{session.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {session.vehicle.make} {session.vehicle.model}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {session.vehicle.plateNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{session.station.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.station.location}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">#{session.pumpNumber}</Badge>
                    </TableCell>
                    <TableCell>
                      <time className="text-sm">
                        {new Date(session.startTime).toLocaleString()}
                      </time>
                    </TableCell>
                    <TableCell>
                      {session.isCompleted ? (
                        <Badge
                          variant="success"
                          className="flex items-center gap-1 w-fit"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </Badge>
                      ) : session.isCharging ? (
                        <Badge
                          variant="warning"
                          className="flex items-center gap-1 w-fit"
                        >
                          <Zap className="w-3 h-3" />
                          Charging
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 w-fit"
                        >
                          <AlertCircle className="w-3 h-3" />
                          Reserved
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {chargingSessionsData.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(
                    currentPage * pageSize,
                    chargingSessionsData.totalElements
                  )}{' '}
                  of {chargingSessionsData.totalElements} sessions
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {chargingSessionsData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(chargingSessionsData.totalPages, prev + 1)
                      )
                    }
                    disabled={currentPage >= chargingSessionsData.totalPages}
                    className="flex items-center gap-1"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                <History className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  No History Available
                </p>
                <p className="text-muted-foreground">
                  No completed charging sessions found
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
