"use client";

import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format, subDays, startOfYear } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DateRange = {
  from: Date;
  to: Date;
} | null;

type Preset = {
  label: string;
  value: "7d" | "30d" | "90d" | "year" | "all";
  getRange: () => { from: Date; to: Date };
};

const presets: Preset[] = [
  {
    label: "Last 7 Days",
    value: "7d",
    getRange: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 Days",
    value: "30d",
    getRange: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: "Last 90 Days",
    value: "90d",
    getRange: () => ({
      from: subDays(new Date(), 89),
      to: new Date(),
    }),
  },
  {
    label: "This Year",
    value: "year",
    getRange: () => ({
      from: startOfYear(new Date()),
      to: new Date(),
    }),
  },
];

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    null
  );
  const [tempRange, setTempRange] = React.useState<{
    from: Date | undefined;
    to?: Date;
  }>({ from: undefined });

  const handlePresetClick = (preset: Preset) => {
    const range = preset.getRange();
    onDateRangeChange(range);
    setSelectedPreset(preset.value);
    setTempRange({ from: undefined });
    setOpen(false);
  };

  const handleCalendarSelect = (
    selected: { from: Date | undefined; to?: Date } | undefined
  ) => {
    if (!selected) {
      setTempRange({ from: undefined });
      return;
    }

    setTempRange(selected);
    setSelectedPreset(null);

    if (selected.from && selected.to) {
      onDateRangeChange({
        from: selected.from,
        to: selected.to,
      });
      setOpen(false);
    }
  };

  const handleAllTime = () => {
    onDateRangeChange(null);
    setSelectedPreset("all");
    setTempRange({ from: undefined });
    setOpen(false);
  };

  const handleClear = () => {
    onDateRangeChange(null);
    setSelectedPreset(null);
    setTempRange({ from: undefined });
  };

  const getDisplayText = () => {
    if (!dateRange) return null;

    const formatDate = (date: Date) => format(date, "MMM dd, yyyy");
    return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="group flex items-center gap-2 px-3 py-2 bg-white border-2 border-black rounded-lg hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-bold text-sm">
              {dateRange ? getDisplayText() : "Select Date Range"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-3 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white"
          align="start"
        >
          <div className="flex flex-col md:flex-row h-full">
            {/* Presets Sidebar */}
            <div className="flex flex-col border-b-3 md:border-b-0 md:border-r-3 border-black bg-[#FFDA76] min-w-[180px]">
              <div className="p-4 border-b-3 border-black bg-[#FFC043]">
                <h3 className="font-black text-xs tracking-widest uppercase">
                  Quick Select
                </h3>
              </div>
              <div className="p-3 space-y-2 flex-1 overflow-y-auto">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetClick(preset)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border-2 font-bold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                      selectedPreset === preset.value
                        ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]"
                        : "bg-white text-black border-black/10 hover:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
                <div className="h-px bg-black/10 my-2" />
                <button
                  onClick={handleAllTime}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border-2 font-bold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                    selectedPreset === "all" && !dateRange
                      ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]"
                      : "bg-white text-black border-black/10 hover:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Calendar & Actions */}
            <div className="flex flex-col bg-white">
              <div className="p-4 border-b-3 border-black flex items-center justify-between bg-white">
                <h3 className="font-black text-xs tracking-widest uppercase">
                  Custom Range
                </h3>
                {dateRange && (
                  <button
                    onClick={handleClear}
                    className="text-xs font-bold underline hover:text-red-500"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="p-2">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={
                    tempRange.from || tempRange.to
                      ? tempRange
                      : dateRange
                      ? { from: dateRange!.from, to: dateRange!.to }
                      : undefined
                  }
                  onSelect={handleCalendarSelect}
                  numberOfMonths={1}
                  className="font-mono p-3"
                  classNames={{
                    months:
                      "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption:
                      "flex justify-center pt-1 relative items-center mb-2",
                    caption_label: "text-sm font-black uppercase tracking-wide",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-8 w-8 bg-white border-2 border-black rounded-md flex items-center justify-center hover:bg-black hover:text-white transition-colors",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex mb-2",
                    head_cell:
                      "text-black/60 rounded-md w-9 font-black text-[0.7rem] uppercase",
                    row: "flex w-full mt-2 gap-1",
                    cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-bold bg-transparent border-2 border-transparent hover:border-black rounded-lg transition-all text-sm",
                    day_range_end:
                      "day-range-end bg-black text-white border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]",
                    day_selected:
                      "bg-black text-white border-black hover:bg-black/90 hover:text-white focus:bg-black focus:text-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]",
                    day_today: "bg-[#FFDA76] border-black text-black",
                    day_outside:
                      "day-outside text-gray-300 opacity-50 aria-selected:bg-gray-100/50 aria-selected:text-gray-500",
                    day_disabled: "text-gray-300 opacity-50",
                    day_range_middle:
                      "aria-selected:bg-gray-100 aria-selected:text-black !rounded-none !border-y-2 !border-x-0 !border-black/10 !shadow-none",
                    day_hidden: "invisible",
                  }}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
