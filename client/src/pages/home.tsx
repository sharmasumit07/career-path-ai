import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import CareerCategories from "@/components/career-categories";
import CareerPathVisualization from "@/components/career-path-visualization";
import ResourcesSection from "@/components/resources-section";
import CareerAssessmentModal from "@/components/career-assessment-modal";
import ChatInterface from "@/components/chat-interface";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const { toast } = useToast();

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/session", {});
      return response.json();
    },
    onSuccess: (data) => {
      setSessionId(data.sessionId);
    },
    onError: () => {
      toast({
        title: "Session Error",
        description: "Failed to initialize session. Please refresh the page.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    createSessionMutation.mutate();
  }, []);

  const handleStartAssessment = () => {
    if (!sessionId) {
      toast({
        title: "Session Not Ready",
        description: "Please wait for the session to initialize.",
        variant: "destructive",
      });
      return;
    }
    setIsAssessmentOpen(true);
  };

  const handleOpenChat = () => {
    if (!sessionId) {
      toast({
        title: "Session Not Ready",
        description: "Please wait for the session to initialize.",
        variant: "destructive",
      });
      return;
    }
    setIsChatOpen(true);
  };

  const handleSelectCategory = (categoryId: string) => {
    toast({
      title: "Category Selected",
      description: `Exploring ${categoryId} careers. Complete the assessment for personalized recommendations.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <HeroSection 
        onStartAssessment={handleStartAssessment}
        onOpenChat={handleOpenChat}
      />
      
      <CareerCategories onSelectCategory={handleSelectCategory} />
      
      {/* AI Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Career Guidance</h2>
            <p className="text-lg text-gray-600">Experience personalized career advice like never before</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Intelligent Career Matching</h3>
                  <p className="text-gray-600">Our AI analyzes your skills, interests, and goals to recommend perfect career matches tailored just for you.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-secondary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Roadmaps</h3>
                  <p className="text-gray-600">Get step-by-step career roadmaps with skills to learn, certifications to earn, and milestones to achieve.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-green-500 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Career Coach</h3>
                  <p className="text-gray-600">Chat with our AI career coach anytime for guidance, advice, and answers to your career questions.</p>
                </div>
              </div>
            </div>

            {/* Chat Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <MessageCircle className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI Career Guide</h4>
                    <p className="text-sm text-green-500 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Online
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 h-64 overflow-y-auto mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-white text-xs" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                    <p className="text-sm text-gray-800">Hi! I'm your AI career guide. What career field interests you most?</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-primary rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                    <p className="text-sm text-white">I'm interested in technology and artificial intelligence</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-white text-xs" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                    <p className="text-sm text-gray-800">Great choice! AI is booming. Are you more interested in machine learning, natural language processing, or computer vision?</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center space-x-3">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled
                  />
                  <Button size="sm" className="bg-primary text-white rounded-full w-10 h-10 p-0">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <CareerPathVisualization />
      <ResourcesSection />
      <Footer />

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Button
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 z-30"
          onClick={handleOpenChat}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Modals */}
      <CareerAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        sessionId={sessionId}
      />

      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        sessionId={sessionId}
      />
    </div>
  );
}
