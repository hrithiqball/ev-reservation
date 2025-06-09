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
import { api } from '@/lib/network'
import type { Vehicle } from '@/types/vehicle'
import {
  updateVehicleSchema,
  type UpdateVehicleSchema,
} from '@/validations/vehicle'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useCurrentUser } from '@/hooks/use-current-user'

export function VehiclesUpdate() {
  const { id } = useParams()
  const user = useCurrentUser()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['vehicles', id],
    queryFn: async () => {
      const response = await api.get<Vehicle>(`/vehicles/${id}`)
      return response.data
    },
  })

  const updateVehicleMutation = useMutation({
    mutationFn: async (values: UpdateVehicleSchema) => {
      await api.put(`/vehicles/${id}`, {
        ...values,
        batteryCapacity: parseInt(values.batteryCapacity, 10),
        ownerId: user?.id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['vehicles', id] })
      toast.success('Vehicle updated successfully!')
    },
    onError: (error) => {
      toast.error(`Error updating vehicle: ${error}`)
    },
  })

  const deleteVehicleMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/vehicles/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success('Vehicle deleted successfully!')
      navigate('/vehicles')
    },
    onError: (error) => {
      toast.error(`Error deleting vehicle: ${error}`)
    },
  })

  const form = useForm<UpdateVehicleSchema>({
    defaultValues: data
      ? { ...data, batteryCapacity: data.batteryCapacity.toString() }
      : undefined,
    resolver: zodResolver(updateVehicleSchema),
    values: data
      ? { ...data, batteryCapacity: data.batteryCapacity.toString() }
      : undefined,
  })

  function onSubmit(values: UpdateVehicleSchema) {
    updateVehicleMutation.mutate(values)
  }

  function handleDelete() {
    deleteVehicleMutation.mutate()
  }

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full space-x-2">
        <Loader2 className="animate-spin" />
      </div>
    )

  if (isError)
    return (
      <div className="text-red-500">Error loading vehicle: {error.message}</div>
    )

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
          <div className="flex space-x-2 justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" className="text-red-500">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
