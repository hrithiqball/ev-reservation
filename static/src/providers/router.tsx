import { AuthLayout } from '@/layouts/auth-layout'
import { MainLayout } from '@/layouts/main-layout'
import { Auth } from '@/pages/auth'
import { Dashboard } from '@/pages/dashboard'
import { EvStations } from '@/pages/ev-stations'
import { EvStationsCreate } from '@/pages/ev-stations-create'
import { EvStationsUpdate } from '@/pages/ev-stations-update'
import { Hero } from '@/pages/hero'
import { Monitoring } from '@/pages/monitoring'
import { Profile } from '@/pages/profile'
import { Vehicles } from '@/pages/vehicles'
import { VehiclesCreate } from '@/pages/vehicles-create'
import { VehiclesUpdate } from '@/pages/vehicles-update'
import { createBrowserRouter } from 'react-router'

const router = createBrowserRouter([
  { path: '/', Component: Hero },
  {
    path: 'auth',
    Component: AuthLayout,
    children: [{ index: true, Component: Auth }],
  },
  {
    Component: MainLayout,
    children: [
      { path: 'dashboard', Component: Dashboard },
      {
        path: 'vehicles',
        children: [
          { index: true, Component: Vehicles },
          { path: 'create', Component: VehiclesCreate },
          { path: 'update/:id', Component: VehiclesUpdate },
        ],
      },
      {
        path: 'ev-stations',
        children: [
          { index: true, Component: EvStations },
          { path: 'create', Component: EvStationsCreate },
          { path: 'update/:id', Component: EvStationsUpdate },
        ],
      },
      { path: 'profile', Component: Profile },
      { path: 'monitoring', Component: Monitoring },
      { path: '*', Component: Dashboard },
    ],
  },
])

export { router }
