import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Utensils, Clock, Calendar as CalendarIcon, Star, CheckCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { FeedbackResponse } from "@shared/api";

type MealType = "breakfast" | "lunch" | "snacks" | "dinner";
type Rating = 1 | 2 | 3 | 4 | 5;

interface FeedbackData {
  date: Date | undefined;
  mealType: MealType | "";
  rating: Rating | "";
  feedback: string;
}

const mealTypes = [
  { value: "breakfast", label: "Breakfast", icon: "🌅", time: "7:00 AM - 10:00 AM" },
  { value: "lunch", label: "Lunch", icon: "☀️", time: "12:00 PM - 3:00 PM" },
  { value: "snacks", label: "Snacks", icon: "🍪", time: "4:00 PM - 6:00 PM" },
  { value: "dinner", label: "Dinner", icon: "🌙", time: "7:00 PM - 10:00 PM" },
];

export default function Index() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedMeal, setSelectedMeal] = useState<MealType | "">("");
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    date: undefined,
    mealType: "",
    rating: "",
    feedback: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const handleMealSelect = (mealType: MealType) => {
    setSelectedMeal(mealType);
    setFeedbackData(prev => ({ ...prev, mealType }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setFeedbackData(prev => ({ ...prev, date }));
  };

  const handleRatingSelect = (rating: Rating) => {
    setFeedbackData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackData.date || !feedbackData.mealType || !feedbackData.rating) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      const result: FeedbackResponse = await response.json();

      if (response.ok && result.success) {
        // Reset form
        setFeedbackData({
          date: undefined,
          mealType: "",
          rating: "",
          feedback: "",
        });
        setSelectedDate(undefined);
        setSelectedMeal("");
        setSubmitCount(prev => prev + 1);

        toast({
          title: "Feedback Submitted! 🎉",
          description: "Thank you! Your anonymous feedback helps us improve our service.",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: result.message || "There was an error submitting your feedback. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = feedbackData.date && feedbackData.mealType && feedbackData.rating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Mess Feedback</h1>
              <p className="text-sm text-gray-600">Share your dining experience with us</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Counter */}
        {submitCount > 0 && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  {submitCount === 1
                    ? "Thank you! Your feedback has been submitted successfully."
                    : `Great! You've submitted ${submitCount} feedback responses today.`}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Date and Meal Selection */}
          <div className="space-y-6">
            {/* Date Selection */}
            <Card className="border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-orange-500" />
                  Select Date
                </CardTitle>
                <CardDescription>Choose the date you want to provide feedback for</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Meal Type Selection */}
            <Card className="border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Select Meal Type
                </CardTitle>
                <CardDescription>Choose which meal you want to provide feedback for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {mealTypes.map((meal) => (
                    <button
                      key={meal.value}
                      onClick={() => handleMealSelect(meal.value as MealType)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:bg-orange-50",
                        selectedMeal === meal.value
                          ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                          : "border-gray-200 hover:border-orange-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{meal.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{meal.label}</div>
                          <div className="text-sm text-gray-500">{meal.time}</div>
                        </div>
                      </div>
                      {selectedMeal === meal.value && (
                        <Badge className="bg-orange-500 hover:bg-orange-600">Selected</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Form */}
          <div className="space-y-6">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-orange-500" />
                  Feedback Form
                </CardTitle>
                <CardDescription>
                  {selectedDate && selectedMeal
                    ? `Providing feedback for ${mealTypes.find(m => m.value === selectedMeal)?.label} on ${format(selectedDate, "MMM dd, yyyy")}`
                    : "Please select a date and meal type to continue"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">


                  {/* Rating */}
                  <div className="space-y-3">
                    <Label>Overall Rating *</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingSelect(rating as Rating)}
                          className={cn(
                            "p-2 rounded-lg border-2 transition-all hover:bg-yellow-50",
                            feedbackData.rating === rating
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-gray-200 hover:border-yellow-300"
                          )}
                        >
                          <Star
                            className={cn(
                              "h-6 w-6",
                              feedbackData.rating && feedbackData.rating >= rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Additional Comments</Label>
                    <Textarea
                      id="feedback"
                      value={feedbackData.feedback}
                      onChange={(e) => setFeedbackData(prev => ({ ...prev, feedback: e.target.value }))}
                      placeholder="Share your detailed feedback about the food quality, service, hygiene, etc."
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full h-12 text-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
