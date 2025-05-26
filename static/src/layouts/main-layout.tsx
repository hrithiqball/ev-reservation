import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Link, Outlet, useLocation } from 'react-router'
import { AppSidebar } from './app-sidebar'

export function MainLayout() {
  const user = useCurrentUser()
  const location = useLocation()
  const path = location.pathname

  const isOnDashboard = path === '/dashboard'
  const isOnVehicles = path.startsWith('/vehicles')
  const isOnEvStations = path.startsWith('/ev-stations')
  const isOnProfile = path.startsWith('/profile')
  const isCreate = path.includes('create')
  const isUpdate = path.includes('update')

  const currentLabel = isOnVehicles
    ? 'Vehicles'
    : isOnEvStations
      ? 'EV Stations'
      : isOnProfile
        ? 'Profile'
        : ''

  const subLabel = isCreate ? 'Create' : isUpdate ? 'Update' : ''

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col p-4 w-full space-y-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {!isOnDashboard && currentLabel && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary focus:outline-none">
                        {currentLabel}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {user?.isAdmin ? (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to="/ev-stations">EV Stations</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/vehicles">Vehicles</Link>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem asChild>
                            <Link to="/vehicles">Vehicles</Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link to="/profile">Profile</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbItem>
                </>
              )}

              {subLabel && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={path}>{subLabel}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Outlet />
      </div>
    </SidebarProvider>
  )
}
