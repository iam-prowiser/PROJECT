import { useState } from "react";
import { Calendar, Clock, ChefHat, Coffee, Utensils, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

export default function Index() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("");

  const messTimings = [
    { type: "Breakfast", time: "06:00 - 09:30", icon: Coffee, color: "text-orange-600" },
    { type: "Lunch", time: "12:30 - 14:00", icon: Utensils, color: "text-red-600" },
    { type: "Snacks", time: "17:00 - 18:30", icon: Cookie, color: "text-pink-600" },
    { type: "Dinner", time: "20:00 - 21:30", icon: ChefHat, color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-mess-gray-light">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-mess-orange" />
            <h1 className="text-xl font-semibold text-gray-800">MessBook</h1>
          </div>
          <Link to="/admin/login">
            <Button variant="outline" size="sm">
              Admin Login
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
            ← Back to Home
          </Button>
        </div>

        {/* Main Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Your Meal Slot</h2>
          <p className="text-gray-600">Reserve your dining time and skip the queue</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-mess-orange rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Booking Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Type
                  </label>
                  <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="snacks">Snacks</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full bg-mess-orange hover:bg-mess-orange-dark text-white"
                  disabled={!selectedDate || !selectedMealType}
                >
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Time Slots */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Available Time Slots</h3>
              </div>

              <div className="text-center text-gray-500 py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a meal type to view time slots</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mess Timings */}
        <Card className="bg-white mt-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">i</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Mess Timings</h3>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {messTimings.map((meal, index) => {
                const IconComponent = meal.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`mb-2 ${meal.color}`}>
                      <IconComponent className="h-8 w-8 mx-auto" />
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1">{meal.type}</h4>
                    <p className="text-sm text-gray-600">{meal.time}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
