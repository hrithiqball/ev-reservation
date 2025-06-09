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
import {
  createEvStationSchema,
  type CreateEvStationSchema,
} from '@/validations/ev-stations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function EvStationsCreate() {
  const form = useForm<CreateEvStationSchema>({
    resolver: zodResolver(createEvStationSchema),
  })

  const createEvStationMutation = useMutation({
    mutationFn: async (values: CreateEvStationSchema) => {
      await api.post('/stations', { ...values })
    },
    onSuccess: () => toast.success('EV Station created successfully!'),
    onError: (error) => toast.error(`Error creating EV Station: ${error}`),
  })

  function onSubmit(values: CreateEvStationSchema) {
    createEvStationMutation.mutate(values)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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
          <div className="flex justify-end">
            <Button type="submit">Register</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
