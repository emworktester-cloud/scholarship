import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "./utils"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

export interface FilterOption {
  value: string
  label: string
}

interface FilterComboboxProps {
  options: FilterOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showAllOption?: boolean
  allLabel?: string
}

export function FilterCombobox({
  options,
  value,
  onChange,
  placeholder = "เลือก...",
  className,
  showAllOption = true,
  allLabel = "ทั้งหมด",
}: FilterComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Ensure "all" is treated properly
  const isAll = value === "all" || !value;
  const prefix = placeholder && placeholder !== "เลือก..." ? `${placeholder}: ` : "";
  const selectedLabel = isAll && showAllOption 
    ? `${prefix}${allLabel}` 
    : options.find((opt) => opt.value === value)?.label || placeholder;

  const displayOptions = showAllOption 
    ? [{ value: "all", label: allLabel }, ...options]
    : options

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative flex items-center", className)}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between pr-8 font-normal bg-white",
              isAll && !showAllOption && "text-muted-foreground",
              className
            )}
          >
            <span className="truncate">{selectedLabel}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        {!isAll && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(showAllOption ? "all" : "");
            }}
            className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-gray-100 text-gray-500 z-10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="ค้นหา..." />
          <CommandList>
            <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
            <CommandGroup>
              {displayOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // CommandItem filters based on text string
                  onSelect={() => {
                    onChange(option.value === value ? (showAllOption ? "all" : "") : option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value || (isAll && option.value === "all") ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
