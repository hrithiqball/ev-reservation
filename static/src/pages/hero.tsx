import { Particles } from '@/components/magicui/particles'
import { RainbowButton } from '@/components/magicui/rainbow-button'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Car,
  CheckCircle,
  Coffee,
  Gauge,
  MapPin,
  Shield,
  Smartphone,
  Users,
  Zap,
} from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export function Hero() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [color, setColor] = useState('#ffffff')

  useEffect(() => {
    setColor(theme === 'dark' ? '#ffffff' : '#000000')
  }, [theme])

  function handleNavigateLogin() {
    navigate('/auth')
  }

  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: 'Smart Reservations',
      description:
        'Reserve charging slots in advance or start charging immediately',
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: 'Station Management',
      description:
        'Comprehensive EV charging station management with multiple pumps',
    },
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: 'Vehicle Profiles',
      description: 'Manage multiple vehicles with different battery capacities',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: 'Real-time Monitoring',
      description: 'Live tracking of charging progress with WebSocket updates',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Multi-user Support',
      description: 'Secure user authentication and session management',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Enterprise Ready',
      description: 'Built with Spring Boot backend and React frontend',
    },
  ]

  const technicalFeatures = [
    'Real-time charging progress via WebSocket',
    'Automated charging session management',
    'Advanced pagination and filtering',
    'RESTful API architecture',
    'Responsive web design',
    'Secure authentication system',
    'Utilizes Java Threads for concurrent processing',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              EV Charging Reservation System
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <RainbowButton onClick={handleNavigateLogin}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </RainbowButton>
          </div>
        </div>
      </nav>

      <div className="relative flex pt-4 w-full flex-col items-center justify-center overflow-hidden rounded-lg">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/8/8c/UiTMlogo.gif"
          alt="uitm logo"
          className="h-12"
        />

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Smart EV Charging
          <span className="text-primary block">Reservation System</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Streamline your electric vehicle charging experience with our
          intelligent reservation platform. Schedule charging sessions, monitor
          progress in real-time, and manage multiple vehicles effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={handleNavigateLogin}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
          >
            Start Charging
            <Zap className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() =>
              document
                .getElementById('features')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Learn More
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-400">Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              Real-time
            </div>
            <div className="text-gray-600 dark:text-gray-400">Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">Multi</div>
            <div className="text-gray-600 dark:text-gray-400">Vehicle</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">Smart</div>
            <div className="text-gray-600 dark:text-gray-400">Scheduling</div>
          </div>
        </div>
        <Particles
          className="absolute inset-0 z-0"
          quantity={100}
          ease={80}
          color={color}
          refresh
        />
      </div>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage EV charging efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-8">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple steps to get your EV charged
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Register</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your account and add your vehicles
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Find Station</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Locate available charging stations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Reserve</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Book your charging slot or start immediately
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gauge className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">4. Monitor</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track charging progress in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Technical Excellence
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Built with modern technologies for reliability and performance
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Advanced Capabilities
                </h3>
                <ul className="space-y-4">
                  {technicalFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                        <Coffee className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="font-semibold">Spring Boot Backend</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Robust Java backend with JPA, WebSocket support, and
                      RESTful APIs
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-semibold">React Frontend</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Modern React with TypeScript, Tailwind CSS, and shadcn/ui
                      components
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Charging?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the future of EV charging management. Simple, smart, and
            efficient.
          </p>
          <Button
            onClick={handleNavigateLogin}
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Zap className="h-6 w-6" />
              <span className="text-lg font-semibold">EV Reserve</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>
                &copy; 2025 UiTM EV Reservation System. Built for the future of
                mobility.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
