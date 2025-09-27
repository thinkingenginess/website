"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft, ChevronRight, Clock, VideoIcon, Globe } from "lucide-react"
import { toast } from "sonner"
import { useMobile } from "../hooks/use-mobile"

// Generate available time slots (9 AM to 4 PM, 30-minute intervals)
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 9; hour <= 16; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 16 && minute > 0) break // Stop at 4:00 PM
      
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const time12 = `${hour12}:${minute.toString().padStart(2, '0')}${ampm}`
      
      slots.push({
        value: time24,
        label: time12
      })
    }
  }
  return slots
}

const timeSlots = generateTimeSlots()

// Get calendar for current month
const generateCalendar = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    days.push(date)
  }
  
  return days
}

// Get today's date
const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const formSchema = z.object({
  clubName: z.string().min(2, "Club name must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["coach", "player", "owner"], {
    required_error: "Please select your role",
  }),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  state: z.string().min(2, "Please enter your state"),
  city: z.string().min(2, "Please enter your city"),
  interestedProduct: z.enum(["preview", "postmatch"], {
    required_error: "Please select a product",
  }),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
})

export function ContactForm() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: info, 2: scheduling
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [calendarMonth, setCalendarMonth] = useState(currentMonth)
  const [calendarYear, setCalendarYear] = useState(currentYear)
  const [showMobileTimePicker, setShowMobileTimePicker] = useState(false)
  const isMobile = useMobile()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clubName: "",
      name: "",
      role: undefined,
      email: "",
      phone: "",
      state: "",
      city: "",
      interestedProduct: undefined,
      preferredDate: "",
      preferredTime: "",
    },
  })

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  
  const calendar = generateCalendar(calendarYear, calendarMonth)

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (calendarMonth === 0) {
        setCalendarMonth(11)
        setCalendarYear(calendarYear - 1)
      } else {
        setCalendarMonth(calendarMonth - 1)
      }
    } else {
      if (calendarMonth === 11) {
        setCalendarMonth(0)
        setCalendarYear(calendarYear + 1)
      } else {
        setCalendarMonth(calendarMonth + 1)
      }
    }
  }

  const handleDateSelect = (date: Date) => {
    if (date < today && date.toDateString() !== today.toDateString()) return
    setSelectedDate(date)
    form.setValue('preferredDate', date.toISOString().split('T')[0])
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    form.setValue('preferredTime', time)
    if (isMobile) {
      setShowMobileTimePicker(false)
    }
  }

  const getWeekDates = () => {
    if (!selectedDate) return []
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())
    
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const formatDateRange = () => {
    const weekDates = getWeekDates()
    if (weekDates.length === 0) return ""
    
    const startDate = weekDates[0]
    const endDate = weekDates[6]
    
    return `${monthNames[startDate.getMonth()].slice(0, 3)} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      toast.success('Form submitted successfully! We will contact you soon.')
      setOpen(false)
      setCurrentStep(1)
      setSelectedDate(null)
      setSelectedTime("")
      form.reset()
    } catch (error) {
      toast.error('Failed to submit form. Please try again.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    // Validate step 1 fields
    const step1Fields = ['clubName', 'name', 'role', 'email', 'phone', 'state', 'city', 'interestedProduct']
    const values = form.getValues()
    let hasErrors = false

    step1Fields.forEach(field => {
      if (!values[field as keyof typeof values]) {
        form.setError(field as keyof typeof values, { message: 'This field is required' })
        hasErrors = true
      }
    })

    if (!hasErrors) {
      setCurrentStep(2)
    }
  }

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(1)
      setSelectedDate(null)
      setSelectedTime("")
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white hover:bg-gray-100 text-black text-sm px-5 py-1.5 rounded-full font-medium">
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 p-0 bg-black text-white border-none rounded-none overflow-hidden">
        {currentStep === 1 ? (
          // Step 1: Contact Information
                     <div className="p-6 overflow-y-auto h-screen flex flex-col">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-white text-xl">Contact Information</DialogTitle>
              <DialogDescription className="text-gray-400">
                Tell us about yourself and your club.
              </DialogDescription>
            </DialogHeader>
                         <Form {...form}>
               <div className="space-y-4 flex-1">
                <FormField
                  control={form.control}
                  name="clubName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Club Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your club name" 
                          {...field}
                          className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          {...field}
                          className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-white">Role</FormLabel>
                      <FormControl>
                                                 <RadioGroup
                           onValueChange={field.onChange}
                           defaultValue={field.value}
                           className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0"
                         >
                           <FormItem className="flex items-center space-x-2">
                             <FormControl>
                               <RadioGroupItem value="coach" className="border-gray-600 text-white" />
                             </FormControl>
                             <FormLabel className="font-normal text-white">Coach</FormLabel>
                           </FormItem>
                           <FormItem className="flex items-center space-x-2">
                             <FormControl>
                               <RadioGroupItem value="player" className="border-gray-600 text-white" />
                             </FormControl>
                             <FormLabel className="font-normal text-white">Player</FormLabel>
                           </FormItem>
                           <FormItem className="flex items-center space-x-2">
                             <FormControl>
                               <RadioGroupItem value="owner" className="border-gray-600 text-white" />
                             </FormControl>
                             <FormLabel className="font-normal text-white">Owner</FormLabel>
                           </FormItem>
                         </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            type="email" 
                            {...field}
                            className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your phone number" 
                            type="tel" 
                            {...field}
                            className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">State</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your state" 
                            {...field}
                            className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">City</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your city" 
                            {...field}
                            className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="interestedProduct"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-white">Interested Product</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="preview" className="border-gray-600 text-white" />
                            </FormControl>
                            <FormLabel className="font-normal text-white">
                              PreView - Semi Automatic VAR
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="postmatch" className="border-gray-600 text-white" />
                            </FormControl>
                            <FormLabel className="font-normal text-white">
                              PostMatch - Performance Analytics Platform
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
                             <div className="flex flex-col-reverse md:flex-row justify-end gap-2 md:space-x-4 pt-6 mt-auto">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setOpen(false)}
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleNext}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Next: Schedule Meeting
                </Button>
              </div>
            </Form>
          </div>
                 ) : (
           // Step 2: Calendar Scheduling Interface
           <div className="h-screen flex flex-col">
             {isMobile ? (
               // Mobile: Simple date/time selection
               <div className="flex-1 p-4 flex flex-col">
                 <div className="mb-6">
                   <h2 className="text-xl font-semibold text-white mb-2">Schedule Meeting</h2>
                   <p className="text-gray-400 text-sm">Select your preferred date and time</p>
                 </div>

                 <div className="space-y-4 flex-1">
                   {/* Date Selection */}
                   <div>
                     <label className="block text-white text-sm font-medium mb-2">Date</label>
                     <input
                       type="date"
                       value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                       onChange={(e) => {
                         const date = new Date(e.target.value)
                         handleDateSelect(date)
                       }}
                       min={today.toISOString().split('T')[0]}
                       className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                     />
                   </div>

                   {/* Time Selection */}
                   <div>
                     <label className="block text-white text-sm font-medium mb-2">Time</label>
                     <button
                       onClick={() => setShowMobileTimePicker(true)}
                       disabled={!selectedDate}
                       className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-left text-white disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {selectedTime ? timeSlots.find(slot => slot.value === selectedTime)?.label : 'Select time'}
                     </button>
                   </div>

                   {selectedDate && selectedTime && (
                     <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                       <h3 className="text-white font-medium mb-1">Meeting Details</h3>
                       <p className="text-gray-400 text-sm">
                         {selectedDate.toLocaleDateString('en-US', { 
                           weekday: 'long', 
                           year: 'numeric', 
                           month: 'long', 
                           day: 'numeric' 
                         })} at {timeSlots.find(slot => slot.value === selectedTime)?.label}
                       </p>
                       <p className="text-gray-400 text-sm mt-1">30 minutes via Google Meet</p>
                     </div>
                   )}
                 </div>

                 {/* Mobile Buttons */}
                 <div className="flex-shrink-0 space-y-3 pt-4">
                   <Button 
                     onClick={() => form.handleSubmit(onSubmit)()}
                     disabled={!selectedDate || !selectedTime || isSubmitting}
                     className="w-full bg-white text-black hover:bg-gray-200 py-3"
                   >
                     {isSubmitting ? (
                       <>
                         <span className="animate-spin mr-2">⏳</span>
                         Scheduling...
                       </>
                     ) : (
                       'Schedule Meeting'
                     )}
                   </Button>
                   <div className="flex space-x-3">
                     <Button 
                       variant="outline" 
                       onClick={() => setCurrentStep(1)}
                       className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                     >
                       Back
                     </Button>
                     <Button 
                       variant="outline" 
                       onClick={() => setOpen(false)}
                       className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                     >
                       Cancel
                     </Button>
                   </div>
                 </div>

                 {/* Mobile Time Picker Dialog */}
                 <Dialog open={showMobileTimePicker} onOpenChange={(open) => setShowMobileTimePicker(!!open)}>
                   <DialogContent className="w-[90vw] max-h-[70vh] bg-black border-gray-800">
                     <DialogHeader>
                       <DialogTitle className="text-white">Select Time</DialogTitle>
                       <DialogDescription className="text-gray-400">
                         Choose your preferred meeting time
                       </DialogDescription>
                     </DialogHeader>
                     <div className="max-h-[50vh] overflow-y-auto">
                       <div className="grid grid-cols-2 gap-2 p-2">
                         {timeSlots.map((slot) => {
                           const isPast = selectedDate ? selectedDate < today && selectedDate.toDateString() !== today.toDateString() : false
                           const isSelected = selectedTime === slot.value
                           
                           return (
                             <button
                               key={slot.value}
                               onClick={() => handleTimeSelect(slot.value)}
                               disabled={isPast}
                               className={`
                                 w-full py-3 px-3 text-sm rounded-lg border transition-colors font-medium
                                 ${isPast 
                                   ? 'border-gray-700 text-gray-600 cursor-not-allowed' 
                                   : isSelected
                                     ? 'border-white bg-white text-black'
                                     : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                                 }
                               `}
                             >
                               {slot.label}
                             </button>
                           )
                         })}
                       </div>
                     </div>
                   </DialogContent>
                 </Dialog>
               </div>
             ) : (
               // Desktop: Calendar interface
               <div className="flex-1 flex overflow-hidden">
                 {/* Left Sidebar - Calendar */}
                 <div className="w-80 border-r border-gray-800 p-6">
                   <div className="mb-6">
                     <div className="flex items-center space-x-2 mb-2">
                       <Clock className="w-4 h-4 text-gray-400" />
                       <span className="text-sm text-gray-400">30m</span>
                     </div>
                     <h3 className="text-lg font-semibold text-white">30 Min Meeting</h3>
                     <div className="flex items-center space-x-2 mt-2">
                       <VideoIcon className="w-4 h-4 text-gray-400" />
                       <span className="text-sm text-gray-400">Google Meet</span>
                     </div>
                     <div className="flex items-center space-x-2 mt-1">
                       <Globe className="w-4 h-4 text-gray-400" />
                       <span className="text-sm text-gray-400">Asia/Kolkata</span>
                     </div>
                   </div>

                   {/* Calendar */}
                   <div className="mb-4">
                     <div className="flex items-center justify-between mb-4">
                       <h4 className="text-lg font-medium text-white">
                         {monthNames[calendarMonth]} {calendarYear}
                       </h4>
                       <div className="flex space-x-1">
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => navigateMonth('prev')}
                           className="text-gray-400 hover:text-white"
                         >
                           <ChevronLeft className="w-4 h-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => navigateMonth('next')}
                           className="text-gray-400 hover:text-white"
                         >
                           <ChevronRight className="w-4 h-4" />
                         </Button>
                       </div>
                     </div>

                     <div className="grid grid-cols-7 gap-1 mb-2">
                       {weekDays.map(day => (
                         <div key={day} className="text-xs text-gray-400 text-center py-2 font-medium">
                           {day[0]}
                         </div>
                       ))}
                     </div>

                     <div className="grid grid-cols-7 gap-1">
                       {calendar.map((date, index) => {
                         const isCurrentMonth = date.getMonth() === calendarMonth
                         const isToday = date.toDateString() === today.toDateString()
                         const isPast = date < today && !isToday
                         const isSelected = selectedDate?.toDateString() === date.toDateString()

                         return (
                           <button
                             key={index}
                             onClick={() => handleDateSelect(date)}
                             disabled={isPast || !isCurrentMonth}
                             className={`
                               w-8 h-8 text-sm rounded transition-colors
                               ${!isCurrentMonth ? 'text-gray-600' : ''}
                               ${isPast ? 'text-gray-600 cursor-not-allowed' : ''}
                               ${isToday && !isSelected ? 'bg-white text-black' : ''}
                               ${isSelected ? 'bg-gray-700 text-white' : ''}
                               ${!isPast && !isSelected && !isToday && isCurrentMonth ? 'text-white hover:bg-gray-800' : ''}
                             `}
                           >
                             {date.getDate()}
                           </button>
                         )
                       })}
                     </div>
                   </div>
                 </div>

                 {/* Right Time Slots */}
                 <div className="flex-1 flex flex-col overflow-hidden">
                   {selectedDate ? (
                     <>
                       {/* Header - Fixed */}
                       <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-800">
                         <h3 className="text-lg font-medium text-white">
                           {formatDateRange()}
                         </h3>
                         <div className="flex items-center space-x-4">
                           <label className="flex items-center space-x-2 text-sm text-gray-400">
                             <input type="checkbox" className="rounded" />
                             <span>Overlay my calendar</span>
                           </label>
                           <div className="flex items-center space-x-1 text-sm text-gray-400">
                             <span>12h</span>
                             <span>24h</span>
                           </div>
                         </div>
                       </div>

                       {/* Scrollable Time Slots */}
                       <div className="flex-1 overflow-y-auto p-6">
                         <div className="grid grid-cols-7 gap-4">
                           {getWeekDates().map((date, dayIndex) => {
                             const isPast = date < today && date.toDateString() !== today.toDateString()
                             const dayName = weekDays[dayIndex]
                             const dayNumber = date.getDate()

                             return (
                               <div key={dayIndex} className="space-y-2">
                                 <div className="text-center sticky top-0 bg-black pb-2">
                                   <div className="text-xs text-gray-400 mb-1">{dayName} {dayNumber}</div>
                                 </div>
                                 
                                 <div className="space-y-2">
                                   {timeSlots.map((slot) => {
                                     const isSelected = selectedTime === slot.value && 
                                                      selectedDate.toDateString() === date.toDateString()
                                     
                                     return (
                                       <button
                                         key={slot.value}
                                         onClick={() => handleTimeSelect(slot.value)}
                                         disabled={isPast}
                                         className={`
                                           w-full py-2 px-3 text-xs rounded-lg border transition-colors
                                           ${isPast 
                                             ? 'border-gray-700 text-gray-600 cursor-not-allowed' 
                                             : isSelected
                                               ? 'border-white bg-white text-black'
                                               : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                                           }
                                         `}
                                       >
                                         {slot.label}
                                       </button>
                                     )
                                   })}
                                 </div>
                               </div>
                             )
                           })}
                         </div>
                       </div>

                       {/* Fixed Footer with Buttons */}
                       <div className="flex justify-between items-center p-6 pt-4 border-t border-gray-800 bg-black">
                         <Button 
                           variant="outline" 
                           onClick={() => setCurrentStep(1)}
                           className="border-gray-600 text-white hover:bg-gray-800"
                         >
                           Back
                         </Button>
                         
                         <div className="flex space-x-4">
                           <Button 
                             variant="outline" 
                             onClick={() => setOpen(false)}
                             className="border-gray-600 text-white hover:bg-gray-800"
                           >
                             Cancel
                           </Button>
                           <Button 
                             onClick={() => form.handleSubmit(onSubmit)()}
                             disabled={!selectedDate || !selectedTime || isSubmitting}
                             className="bg-white text-black hover:bg-gray-200"
                           >
                             {isSubmitting ? (
                               <>
                                 <span className="animate-spin mr-2">⏳</span>
                                 Scheduling...
                               </>
                             ) : (
                               'Schedule Meeting'
                             )}
                           </Button>
                         </div>
                       </div>
                     </>
                   ) : (
                     <div className="flex items-center justify-center h-full">
                       <div className="text-center text-gray-400">
                         <p>Please select a date to view available time slots</p>
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             )}
           </div>
         )}
       </DialogContent>
     </Dialog>
   )
 }