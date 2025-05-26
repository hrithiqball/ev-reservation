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
import type { EvStations } from '@/types/ev-stations'
import {
  updateEvStationSchema,
  type UpdateEvStationSchema,
} from '@/validations/ev-stations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
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

export function EvStationsUpdate() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['ev-stations', id],
    queryFn: async () => {
      const response = await api.get<EvStations>(`/stations/${id}`)
      console.log('Response data:', response.data)
      return response.data
    },
  })

  const updateEvStationMutation = useMutation({
    mutationFn: async (values: UpdateEvStationSchema) => {
      await api.put(`/stations/${id}`, {
        ...values,
        numberOfPumps: parseInt(values.numberOfPumps, 10),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ev-stations'] })
      queryClient.invalidateQueries({ queryKey: ['ev-stations', id] })
      toast.success('EV Station updated successfully!')
    },
    onError: (error) => {
      toast.error(`Error updating EV Station: ${error}`)
    },
  })

  const deleteEvStationMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/stations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ev-stations'] })
      toast.success('EV Station deleted successfully!')
    },
    onError: (error) => {
      toast.error(`Error deleting EV Station: ${error}`)
    },
  })

  const form = useForm<UpdateEvStationSchema>({
    defaultValues: { ...data, numberOfPumps: data?.numberOfPumps.toString() },
    resolver: zodResolver(updateEvStationSchema),
  })

  function onSubmit(values: UpdateEvStationSchema) {
    updateEvStationMutation.mutate(values)
  }

  function handleDelete() {
    deleteEvStationMutation.mutate()
  }

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full space-x-2">
        <Loader2 className="animate-spin" />
      </div>
    )

  if (isError)
    return (
      <div className="text-red-500">
        Error loading EV stations: {error.message}
      </div>
    )

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter station name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter station location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfPumps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Pumps</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of pumps"
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
  )
}
