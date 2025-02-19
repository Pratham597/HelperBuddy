"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

const timeSlots = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "anytime", label: "Anytime before 6 PM" },
]

export function Timeline({ timeline, onChange }) {
  const [date, setDate] = useState(timeline?.date ? new Date(timeline.date) : null)
  const [timeSlot, setTimeSlot] = useState(timeline?.timeSlot || "")

  const handleDateChange = (newDate) => {
    setDate(newDate)
    onChange({ date: newDate, timeSlot })
  }

  const handleTimeSlotChange = (newTimeSlot) => {
    setTimeSlot(newTimeSlot)
    onChange({ date, timeSlot: newTimeSlot })
  }

  return (
		<div className="flex flex-col space-y-4">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={!date && "text-muted-foreground"}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date ? format(date, "PPP") : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={date}
						onSelect={handleDateChange}
						initialFocus
						disabled={(day) => day < new Date()}
					/>
				</PopoverContent>
			</Popover>

			<Select value={timeSlot} onValueChange={handleTimeSlotChange}>
				<SelectTrigger>
					<SelectValue placeholder="Select a time slot" />
				</SelectTrigger>
				<SelectContent>
					{timeSlots.map((slot) => (
						<SelectItem key={slot.value} value={slot.value}>
							{slot.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
  );
}

