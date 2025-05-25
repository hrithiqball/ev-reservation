import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
]

export function Dashboard() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-1 flex-col space-y-4 justify-center items-center">
      <Card>
        <CardContent className="flex justify-center items-center flex-col space-y-4">
          <span className="text-gray-600 dark:text-white font-semibold">
            Choose EV Station you would like to reserve
          </span>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                size="lg"
                aria-expanded={open}
                className="w-full justify-between bg-sky-500 hover:bg-sky-800 dark:bg-sky-700 dark:hover:bg-sky-950 hover:text-white text-white font-semibold"
              >
                {value
                  ? frameworks.find((framework) => framework.value === value)
                      ?.label
                  : 'Select EV station...'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : currentValue)
                          setOpen(false)
                        }}
                      >
                        {framework.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            value === framework.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
    </div>
  )
}
