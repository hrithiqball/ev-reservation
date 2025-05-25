import { AuthLayout } from '@/layouts/auth-layout'
import { MainLayout } from '@/layouts/main-layout'
import { Auth } from '@/pages/auth'
import { Dashboard } from '@/pages/dashboard'
import { EvStations } from '@/pages/ev-stations'
import { Hero } from '@/pages/hero'
import { Profile } from '@/pages/profile'
import { Vehicle } from '@/pages/vehicle'
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
      { path: 'vehicles', Component: Vehicle },
      { path: 'ev-stations', Component: EvStations },
      { path: 'profile', Component: Profile },
      { path: '*', Component: Dashboard },
    ],
  },
])

export { router }
