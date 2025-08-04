import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { AssessmentData } from "@shared/schema";

interface CareerAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

const interests = [
  { id: "problem-solving", label: "Problem Solving" },
  { id: "creative-work", label: "Creative Work" },
  { id: "helping-others", label: "Helping Others" },
  { id: "data-analysis", label: "Data Analysis" },
  { id: "leadership", label: "Leadership" },
  { id: "technology", label: "Technology" }
];

export default function CareerAssessmentModal({ isOpen, onClose, sessionId }: CareerAssessmentModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState<Partial<AssessmentData>>({
    interests: []
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitAssessmentMutation = useMutation({
    mutationFn: async (data: AssessmentData) => {
      const response = await apiRequest("POST", "/api/assessment", {
        sessionId,
        assessmentData: data
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Assessment Complete!",
        description: data.recommendations?.length ? "Your personalized career recommendations are ready." : "Demo recommendations generated. Add OpenAI API key for personalized AI recommendations.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations", sessionId] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Assessment Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!assessmentData.currentSituation || !assessmentData.educationLevel || 
        !assessmentData.experience || !assessmentData.interests?.length) {
      toast({
        title: "Incomplete Assessment",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    submitAssessmentMutation.mutate(assessmentData as AssessmentData);
  };

  const handleInterestChange = (interestId: string, checked: boolean) => {
    const currentInterests = assessmentData.interests || [];
    if (checked) {
      setAssessmentData({
        ...assessmentData,
        interests: [...currentInterests, interestId]
      });
    } else {
      setAssessmentData({
        ...assessmentData,
        interests: currentInterests.filter(id => id !== interestId)
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Career Assessment</DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tell us about yourself</h3>
              <p className="text-gray-600">This helps us provide better career recommendations</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your current situation?
                </label>
                <Select onValueChange={(value) => setAssessmentData({ ...assessmentData, currentSituation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current situation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="recent-graduate">Recent Graduate</SelectItem>
                    <SelectItem value="career-changer">Career Changer</SelectItem>
                    <SelectItem value="professional">Professional Looking to Advance</SelectItem>
                    <SelectItem value="returning">Returning to Workforce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your education level?
                </label>
                <Select onValueChange={(value) => setAssessmentData({ ...assessmentData, educationLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD or Higher</SelectItem>
                    <SelectItem value="self-taught">Self-taught/Bootcamp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of work experience?
                </label>
                <Select onValueChange={(value) => setAssessmentData({ ...assessmentData, experience: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No experience</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!assessmentData.currentSituation || !assessmentData.educationLevel || !assessmentData.experience}>
                Next Step
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What interests you most?</h3>
              <p className="text-gray-600">Select all that apply - this helps us understand your preferences</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {interests.map((interest) => (
                <label 
                  key={interest.id}
                  className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    className="mr-3"
                    checked={assessmentData.interests?.includes(interest.id)}
                    onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                  />
                  <span className="text-gray-700">{interest.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Previous
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!assessmentData.interests?.length || submitAssessmentMutation.isPending}
              >
                {submitAssessmentMutation.isPending ? (
                  "Generating..."
                ) : (
                  <>
                    Generate Recommendations
                    <Wand2 className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
