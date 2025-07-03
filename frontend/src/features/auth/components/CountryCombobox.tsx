import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useGetAllCountries } from "@/api/generated/hooks/countries/countries"

interface CountryComboboxProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function CountryCombobox({ value, onChange }: CountryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const { data: countries, isLoading } = useGetAllCountries();

  const selectedCountry = countries?.find(country => country.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
                <img src={selectedCountry.flagUrl} alt="" className="h-4 w-6 object-contain" />
                <span>{selectedCountry.name}</span>
            </div>
          ) : (
            "Select country..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries?.map((country) => (
                <CommandItem
                  key={country.id}
                  value={country.name}
                  onSelect={() => {
                    onChange(country.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <img src={country.flagUrl} alt="" className="h-4 w-6 object-contain" />
                  <span>{country.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}