import { LoginForm } from '@/components/login-form'
import { RegisterForm } from '@/components/register-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Car } from 'lucide-react'
import { Link } from 'react-router'

export function Auth() {
  return (
    <Card className="min-w-md">
      <CardHeader>
        <CardTitle>
          <Link className="flex items-center gap-2" to="/">
            <Car />
            <span>EV Charging Reservation System</span>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
