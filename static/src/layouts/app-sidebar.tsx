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
import { Car, ChevronUp, Home, HousePlug, User2, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
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
  const { theme } = useTheme()
  const user = useCurrentUser()

  if (user?.isAdmin) {
    items.push({
      title: 'EV Stations',
      url: 'ev-stations',
      icon: HousePlug,
    })
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
          <Zap />
          <span className="text-lg font-semibold">EV Charging</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
