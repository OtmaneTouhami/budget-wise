import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useGetAllCountries } from "@/api/generated/hooks/countries/countries";
import type { CountryDto } from "@/api/generated/hooks/openAPIDefinition.schemas";

interface CountryPhoneInputProps {
  countryId: number | undefined;
  onCountryChange: (id: number | undefined) => void;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  disabled?: boolean;
}

export function CountryPhoneInput({ 
    countryId, 
    onCountryChange, 
    phoneNumber, 
    onPhoneNumberChange,
    disabled = false
}: CountryPhoneInputProps) {
  const [open, setOpen] = React.useState(false);
  const { data: countries, isLoading } = useGetAllCountries();

  const selectedCountry = countries?.find((country) => country.id === countryId);

  return (
    <div className="flex w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[130px] justify-between rounded-r-none"
            disabled={isLoading || disabled}
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={selectedCountry.flagUrl}
                  alt=""
                  className="h-4 w-6 flex-shrink-0 object-contain"
                />
                <span className="truncate text-sm">
                    +{selectedCountry.callingCode}
                </span>
              </div>
            ) : (
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries?.map((country: CountryDto) => (
                  <CommandItem
                    key={country.id}
                    value={`${country.name} (+${country.callingCode})`}
                    onSelect={() => {
                      onCountryChange(country.id);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        countryId === country.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <img src={country.flagUrl} alt="" className="h-4 w-6 object-contain" />
                    <span className="flex-1">{country.name}</span>
                    <span className="text-muted-foreground text-sm">
                      +{country.callingCode}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        type="tel"
        placeholder="Phone number"
        className="rounded-l-none"
        value={phoneNumber}
        onChange={(e) => onPhoneNumberChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}