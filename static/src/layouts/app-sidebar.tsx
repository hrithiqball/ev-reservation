import { ModeToggle } from '@/components/mode-toggle'
import { useTheme } from '@/components/theme-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { api } from '@/lib/network'
import { cn } from '@/lib/utils'
import {
  Car,
  ChevronUp,
  Home,
  HousePlug,
  MonitorDot,
  User2,
  Zap,
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router'
import { toast } from 'sonner'

const items = [
  {
    title: 'Dashboard',
    url: 'dashboard',
    icon: Home,
  },
  {
    title: 'Vehicles',
    url: 'vehicles',
    icon: Car,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()
  const user = useCurrentUser()

  // Function to check if a path is active
  const isActivePath = (url: string) => {
    return location.pathname.includes(url)
  }

  async function handleLogout() {
    const res = await api.post('/auth/logout')
    if (res.status === 200) {
      toast.success('Logout successful!')
      navigate('/')
    } else {
      toast.error('Logout failed. Please try again.')
      console.error('Logout error:', res.data)
    }
  }

  function navigateProfile() {
    if (!user) {
      toast.error('You must be logged in to view your profile.')
      return
    }

    navigate(`/profile`)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Zap className="text-primary dark:text-sky-300" />
          <span className="text-lg text-primary dark:text-sky-300 font-semibold">
            EV Charging
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn({
                      'bg-sky-200/50 dark:bg-sky-950/50': isActivePath(
                        item.url
                      ),
                    })}
                  >
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user?.isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn({
                      'bg-sky-200/50 dark:bg-sky-950/50':
                        isActivePath('ev-stations'),
                    })}
                  >
                    <Link to="ev-stations">
                      <HousePlug className="size-4" />
                      <span>EV Stations</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-4">
            <ModeToggle />
            <span className="text-sm">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onSelect={navigateProfile}>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
