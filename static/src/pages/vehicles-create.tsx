import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hooks/use-current-user'
import { api } from '@/lib/network'
import {
  createVehicleSchema,
  type CreateVehicleSchema,
} from '@/validations/vehicle'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

export function VehiclesCreate() {
  const user = useCurrentUser()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const form = useForm<CreateVehicleSchema>({
    resolver: zodResolver(createVehicleSchema),
  })

  const createVehicleMutation = useMutation({
    mutationFn: async (values: CreateVehicleSchema) => {
      await api.post('/vehicles', {
        ...values,
        batteryCapacity: parseInt(values.batteryCapacity, 10),
        owner: user,
      })
    },
    onSuccess: () => {
      toast.success('Vehicle created successfully!')
      queryClient.invalidateQueries({ queryKey: ['vehicles', user?.id] })
      navigate('/vehicles')
    },
    onError: (error) => toast.error(`Error creating vehicle: ${error}`),
  })

  function onSubmit(values: CreateVehicleSchema) {
    createVehicleMutation.mutate(values)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input placeholder="Enter vehicle make" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Enter vehicle model" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plate Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter plate number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="batteryCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Battery Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter battery capacity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Register</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
