import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

export function Hero() {
  const navigate = useNavigate()

  function handleNavigateLogin() {
    navigate('/auth')
  }

  return (
    <div className="">
      Hero <Button onClick={handleNavigateLogin}>Login</Button>
    </div>
  )
}
