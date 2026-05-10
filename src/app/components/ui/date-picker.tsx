import * as React from "react"
import { parseISO, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

export interface DatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  defaultValue?: string; // e.g. "2026-02-25"
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, defaultValue, className, placeholder = "DD/MM/YYYY", disabled = false }: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(() => {
    if (!defaultValue) return undefined;
    const parsed = parseISO(defaultValue);
    return isValid(parsed) ? parsed : undefined;
  });

  const isControlled = value !== undefined && onChange !== undefined;
  // Fallback to undefined if the controlled value is an Invalid Date
  const currentDate = isControlled ? (isValid(value) ? value : undefined) : internalDate;

  const handleSelect = (date?: Date) => {
    if (!isControlled) {
      setInternalDate(date);
    }
    if (onChange) {
      onChange(date);
    }
  };

  const formatDateBE = (date: Date) => {
    if (!isValid(date)) return "Invalid Date";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearBE = date.getFullYear() + 543;
    return `${day}/${month}/${yearBE}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-white px-3 shadow-sm",
            !currentDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
          {currentDate ? formatDateBE(currentDate) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
