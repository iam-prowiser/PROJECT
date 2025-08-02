import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FadeInWrapper } from "@/hooks/use-fade-in";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
}

const MEAL_TIMES = {
  breakfast: {
    label: "🥐 Breakfast",
    start: "08:00",
    end: "09:30",
    icon: "🥐"
  },
  lunch: {
    label: "🍛 Lunch", 
    start: "12:30",
    end: "14:20",
    icon: "🍛"
  },
  snacks: {
    label: "🍿 Snacks",
    start: "17:00", 
    end: "18:30",
    icon: "🍿"
  },
  dinner: {
    label: "🍽️ Dinner",
    start: "20:00",
    end: "21:30", 
    icon: "🍽️"
  }
};

function generateTimeSlots(startTime: string, endTime: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const start = new Date(`2024-01-01T${startTime}:00`);
  const end = new Date(`2024-01-01T${endTime}:00`);
  
  while (start < end) {
    const timeString = start.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    slots.push({
      time: timeString,
      available: Math.random() > 0.3, // Random availability for demo
      capacity: 20,
      booked: Math.floor(Math.random() * 15)
    });
    
    start.setMinutes(start.getMinutes() + 15);
  }
  
  return slots;
}

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Get today's date as minimum selectable date
  const today = new Date().toISOString().split('T')[0];

  const handleMealTypeChange = (mealType: string) => {
    setSelectedMealType(mealType);
    setSelectedTimeSlot("");
    
    if (mealType && MEAL_TIMES[mealType as keyof typeof MEAL_TIMES]) {
      const meal = MEAL_TIMES[mealType as keyof typeof MEAL_TIMES];
      const slots = generateTimeSlots(meal.start, meal.end);
      setTimeSlots(slots);
    } else {
      setTimeSlots([]);
    }
  };

  const handleBookSlot = () => {
    if (selectedDate && selectedMealType && selectedTimeSlot) {
      alert(`Slot booked successfully!\nDate: ${selectedDate}\nMeal: ${MEAL_TIMES[selectedMealType as keyof typeof MEAL_TIMES].label}\nTime: ${selectedTimeSlot}`);
    } else {
      alert("Please fill in all required fields!");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <FadeInWrapper>
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-brand-richBrown">Book Your Meal Slot</h1>
                  <p className="text-sm text-muted-foreground">Reserve your dining time and skip the queue</p>
                </div>
              </div>
            </div>
          </FadeInWrapper>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <FadeInWrapper delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Booking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Select Date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Meal Type Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="meal-type">Meal Type</Label>
                    <Select value={selectedMealType} onValueChange={handleMealTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(MEAL_TIMES).map(([key, meal]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span>{meal.icon}</span>
                              <span>{meal.label}</span>
                              <span className="text-xs text-muted-foreground">
                                ({meal.start} - {meal.end})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Time Slot Display */}
                  {selectedTimeSlot && (
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-semibold text-brand-richBrown mb-2">Selected Slot</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Date:</strong> {selectedDate}</p>
                        <p><strong>Meal:</strong> {MEAL_TIMES[selectedMealType as keyof typeof MEAL_TIMES]?.label}</p>
                        <p><strong>Time:</strong> {selectedTimeSlot}</p>
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <Button 
                    onClick={handleBookSlot}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!selectedDate || !selectedMealType || !selectedTimeSlot}
                  >
                    🎯 Confirm Booking
                  </Button>
                </CardContent>
              </Card>
            </FadeInWrapper>
          </div>

          {/* Time Slots Table */}
          <div className="lg:col-span-2">
            <FadeInWrapper delay={400}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Available Time Slots
                    {selectedMealType && (
                      <Badge variant="secondary" className="ml-2">
                        {MEAL_TIMES[selectedMealType as keyof typeof MEAL_TIMES]?.label}
                      </Badge>
                    )}
                  </CardTitle>
                  {!selectedMealType && (
                    <p className="text-sm text-muted-foreground">
                      Please select a meal type to view available time slots
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {timeSlots.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time Slot</TableHead>
                            <TableHead>Availability</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {timeSlots.map((slot, index) => (
                            <TableRow 
                              key={index}
                              className={selectedTimeSlot === slot.time ? "bg-primary/10" : ""}
                            >
                              <TableCell className="font-medium">
                                {slot.time}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={slot.available ? "default" : "destructive"}
                                  className={slot.available ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                                >
                                  {slot.available ? "Available" : "Full"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">
                                    {slot.booked}/{slot.capacity}
                                  </span>
                                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary rounded-full transition-all"
                                      style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                                  disabled={!slot.available || !selectedDate}
                                  onClick={() => setSelectedTimeSlot(slot.time)}
                                >
                                  {selectedTimeSlot === slot.time ? "Selected" : "Select"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select a meal type to view time slots</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeInWrapper>
          </div>
        </div>

        {/* Meal Times Info */}
        <FadeInWrapper delay={600}>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>🕐 Mess Timings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(MEAL_TIMES).map(([key, meal]) => (
                  <div 
                    key={key} 
                    className={`p-4 rounded-lg border ${
                      selectedMealType === key ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{meal.icon}</div>
                      <h4 className="font-semibold text-brand-richBrown">{meal.label}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {meal.start} - {meal.end}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeInWrapper>
      </div>
    </div>
  );
}
