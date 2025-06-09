import { ReserveCard } from '@/components/reserve-card'
import { ReservingUser } from '@/components/reserving-user'

export function Dashboard() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="container flex flex-col flex-1 mx-auto space-y-6">
        <div className="flex flex-1 flex-col space-y-4 justify-center items-center">
          <ReserveCard />
        </div>
        <ReservingUser />
      </div>
    </div>
  )
}
