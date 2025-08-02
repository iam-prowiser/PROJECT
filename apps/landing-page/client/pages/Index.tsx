import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FadeInWrapper } from "@/hooks/use-fade-in";
import {
  Calendar,
  MessageSquare,
  Bell,
  Users,
  Clock,
  Star,
  ChefHat,
  TrendingUp,
  Shield,
  Smartphone,
  CalendarDays,
  PenTool
} from "lucide-react";

export default function Index() {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleBookSlot = () => {
    setIsStartModalOpen(false);
    navigate("/booking");
  };

  const handleGiveFeedback = () => {
    setIsStartModalOpen(false);
    // Add feedback logic here
    
    window.location.href = "http://localhost:3002";
  };

  const handleSeeMenu = () => {
  setIsStartModalOpen(false);
  
  window.location.href = "http://localhost:3003";
};

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2Fdd7a56e4ef1449dd9a89af40de3dfd16%2F81a78d9015da47f18b9eacfc2cc6d41c)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <FadeInWrapper delay={200}>
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
              🍽️ Smart Food Solutions
            </Badge>
          </FadeInWrapper>
          <FadeInWrapper delay={400}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              BYTEBITE
            </h1>
          </FadeInWrapper>
          <FadeInWrapper delay={600}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
              Smart Mess Manager
            </p>
          </FadeInWrapper>
          <FadeInWrapper delay={800}>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              <span style={{color: "rgb(255, 255, 255)"}}>
                Revolutionizing campus dining with intelligent crowd management,
                real-time feedback, and seamless meal planning for college students.
              </span>
            </p>
          </FadeInWrapper>
          <FadeInWrapper delay={1000}>
            <div className="flex justify-center gap-6">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl"
                onClick={() => setIsStartModalOpen(true)}
              >
                🍽️ Start Smart
              </Button>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl"
                onClick={() => window.location.href = "http://localhost:3001"}
              >
                🍽️ Admin Portal
              </Button>
            </div>
          </FadeInWrapper>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <FadeInWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-richBrown">
                🍛 The Campus Food Crisis
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Every meal time, hungry students face the same delicious dilemmas in campus dining halls.
              </p>
            </div>
          </FadeInWrapper>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeInWrapper delay={200}>
              <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🍝</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-brand-richBrown">Dinner Rush Madness</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Long queues during meal times leave students hungry and frustrated.
                    No system to manage the dining rush efficiently.
                  </p>
                </CardContent>
              </Card>
            </FadeInWrapper>

            <FadeInWrapper delay={400}>
              <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">👨‍🍳</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-brand-richBrown">Taste & Quality Issues</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Inconsistent flavors and food quality with no way to share honest feedback.
                    Chef's can't improve without knowing what students really think.
                  </p>
                </CardContent>
              </Card>
            </FadeInWrapper>

            <FadeInWrapper delay={600}>
              <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">📋</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-brand-richBrown">Menu Mysteries</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    No real-time updates about today's special dishes or what's still available.
                    Students arrive hoping for biryani but find only dal rice left.
                  </p>
                </CardContent>
              </Card>
            </FadeInWrapper>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-richBrown">
                🚀 Fresh Solutions for Hungry Students
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                BYTEBITE serves up campus dining with a side of smart technology and a garnish of great user experience.
              </p>
            </div>
          </FadeInWrapper>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <FadeInWrapper delay={200}>
              <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                    <span className="text-3xl">🕐</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-brand-richBrown">Reserve Your Feast Time</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Book your dinner slot like a restaurant reservation. Skip the queue,
                    grab your favorite dishes, and enjoy meals stress-free.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Real-time slot availability
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Flexible booking & cancellation
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Queue management system
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWrapper>

            <FadeInWrapper delay={400}>
              <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                    <span className="text-3xl">💬</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-brand-richBrown">Secret Food Reviews</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Rate dishes, suggest new recipes, and share honest food reviews
                    anonymously. Help the kitchen team cook up better meals!
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      100% anonymous submissions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Instant feedback to management
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Rating & suggestion system
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWrapper>

            <FadeInWrapper delay={600}>
              <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                    <span className="text-3xl">🔔</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-brand-richBrown">Food Alerts & Updates</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Get notified when your favorite dishes are being served,
                    when special treats are available, or if biryani is on the menu!
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Daily menu notifications
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Special dish alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Personalized preferences
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWrapper>
          </div>

          {/* Additional Features */}
          <FadeInWrapper>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Mobile First</h4>
                <p className="text-sm text-muted-foreground">Optimized for smartphones</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Analytics</h4>
                <p className="text-sm text-muted-foreground">Data-driven insights</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Secure</h4>
                <p className="text-sm text-muted-foreground">Privacy-focused design</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">User-Friendly</h4>
                <p className="text-sm text-muted-foreground">Intuitive interface</p>
              </div>
            </div>
          </FadeInWrapper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <FadeInWrapper>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-richBrown">
              🍽️ Ready to Upgrade Your Food Game?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of hungry students already using BYTEBITE to turn campus dining into a delightful culinary adventure!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-12 py-6 text-lg rounded-xl">
                🍛 Reserve My Next Meal
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 px-12 py-6 text-lg rounded-xl">
                Learn More
              </Button>
            </div>
          </div>
        </FadeInWrapper>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInWrapper>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Team Hack-a-Snack
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Built by passionate students who understand the real challenges of campus dining.
            </p>
          </FadeInWrapper>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FadeInWrapper delay={200} className="flex flex-col">
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">AG</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ashutosh Gautam</h3>
                  <p className="text-sm text-muted-foreground">
                    Full-Stack Developer
                  </p>
                </CardContent>
              </Card>
            </FadeInWrapper>
            <FadeInWrapper delay={400} className="flex flex-col">
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">AA</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Aditya Agrawal</h3>
                  <p className="text-sm text-muted-foreground">
                    UI/UX Designer
                  </p>
                </CardContent>
              </Card>
            </FadeInWrapper>
            <FadeInWrapper delay={600} className="flex flex-col">
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">UA</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Utkarsh Agrawal</h3>
                  <p className="text-sm text-muted-foreground">
                    Frontend Developer
                  </p>
                </CardContent>
              </Card>
            </FadeInWrapper>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <FadeInWrapper>
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">BYTEBITE</h3>
            <p className="text-muted-foreground mb-6">Smart Mess Manager for Modern Campus Life</p>
            <p className="text-sm text-muted-foreground">
              © 2024 Team Hack-a-Snack. Built with ❤️ for college students everywhere.
            </p>
          </div>
        </FadeInWrapper>
      </footer>

      {/* Start Smart Modal */}
      <Dialog open={isStartModalOpen} onOpenChange={setIsStartModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-brand-richBrown">
              🍽️ Get Started with BYTEBITE
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <Button
              onClick={handleBookSlot}
              className="h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-xl flex items-center justify-center gap-3"
            >
              <CalendarDays className="w-6 h-6" />
              📅 Book Your Slot
            </Button>
            <Button
              onClick={handleGiveFeedback}
              variant="outline"
              className="h-16 border-primary/30 text-foreground hover:bg-primary/10 font-semibold text-lg rounded-xl flex items-center justify-center gap-3"
            >
              <PenTool className="w-6 h-6" />
              💬 Give Feedback
            </Button>
            <Button
              onClick={handleSeeMenu}
              variant="outline"
              className="h-16 border-primary/30 text-foreground hover:bg-primary/10 font-semibold text-lg rounded-xl flex items-center justify-center gap-3"
            >
              <ChefHat className="w-6 h-6" />
              👨‍🍳 See Today's Menu
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Choose your action to improve your campus dining experience
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
