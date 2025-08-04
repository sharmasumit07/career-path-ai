import { Button } from "@/components/ui/button";
import { Rocket, MessageCircle } from "lucide-react";

interface HeroSectionProps {
  onStartAssessment: () => void;
  onOpenChat: () => void;
}

export default function HeroSection({ onStartAssessment, onOpenChat }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dream Career
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized career guidance powered by AI. Explore career paths, discover skills you need, and create your roadmap to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-primary text-white px-8 py-4 text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 shadow-lg"
              onClick={onStartAssessment}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Career Assessment
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary px-8 py-4 text-lg font-semibold hover:bg-primary hover:text-white"
              onClick={onOpenChat}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with AI Guide
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
