"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTH } from "@/constants";
import { formatMonthOfBirth } from "@/lib/format";
import { generateDate, generateYear } from "@/lib/utils";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateBiodata } from "../actions/action";

interface ChangeDateOfBirthProps {
  refetch: () => void;
}

export function ChangeDateOfBirth({ refetch }: ChangeDateOfBirthProps) {
  const [isPending, startTransition] = useTransition();

  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(
    undefined,
  );
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  );

  const dates = generateDate();
  const months = MONTH;
  const years = generateYear();

  const saveDateOfBirth = () => {
    startTransition(async () => {
      const toDate = new Date(
        `${selectedDate} ${selectedMonth} ${selectedYear}`,
      );

      const response = await updateBiodata({
        dateOfBirth: toDate,
      });

      if (response.success) {
        toast.success("Date of birth updated successfully");
        refetch();
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-x-2">
          <Select
            defaultValue={selectedDate}
            onValueChange={(e) => setSelectedDate(e)}
          >
            <SelectTrigger className="w-[100px] bg-white">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {dates.map((item) => (
                <SelectItem key={item} value={item} className="bg-white">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue={selectedMonth}
            onValueChange={(e) => setSelectedMonth(e)}
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {months.map((item) => (
                <SelectItem key={item} value={item} className="bg-white">
                  {formatMonthOfBirth(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue={selectedDate}
            onValueChange={(e) => setSelectedYear(e)}
          >
            <SelectTrigger className="w-[100px] bg-white">
              <SelectValue placeholder="Years" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {years.map((item) => (
                <SelectItem key={item} value={item} className="bg-white">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="w-full mt-5 h-11 bg-black text-white hover:bg-gray-800 font-bold uppercase tracking-widest text-xs rounded-none"
        onClick={saveDateOfBirth}
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
