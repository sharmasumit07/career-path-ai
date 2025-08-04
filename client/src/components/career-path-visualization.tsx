import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2 } from "lucide-react";

export default function CareerPathVisualization() {
  const samplePath = {
    title: "Software Developer Career Path",
    description: "Based on your interests in technology and programming",
    steps: [
      {
        title: "Learn Programming Fundamentals",
        description: "Master the basics of programming with languages like Python, JavaScript, or Java",
        duration: "3-6 months",
        skills: ["Python", "HTML/CSS", "Git"]
      },
      {
        title: "Build Projects & Portfolio",
        description: "Create real-world projects to showcase your skills and build a strong portfolio",
        duration: "6-12 months",
        skills: ["React/Vue", "Node.js", "Databases"]
      },
      {
        title: "Land Your First Job",
        description: "Apply for junior developer positions and continue learning on the job",
        duration: "Ongoing",
        skills: ["Job Search", "Interviews", "Networking"]
      }
    ]
  };

  const stepColors = [
    "bg-primary text-white",
    "bg-primary text-white",
    "bg-green-600 text-white"
  ];

  const durationColors = [
    "bg-blue-100 text-primary",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Career Journey Visualization</h2>
          <p className="text-lg text-gray-600">See how your career path unfolds step by step</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-0">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{samplePath.title}</h3>
              <p className="text-gray-600">{samplePath.description}</p>
            </div>

            <div className="space-y-8">
              {samplePath.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 ${stepColors[index]} rounded-full flex items-center justify-center font-bold`}>
                      {index + 1}
                    </div>
                    {index < samplePath.steps.length - 1 && (
                      <div className="w-1 h-16 bg-gray-300 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <Card className="p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                        <Badge className={`${durationColors[index]} px-3 py-1 text-sm font-medium`}>
                          {step.duration}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button className="bg-primary text-white hover:bg-blue-700">
                <Wand2 className="w-4 h-4 mr-2" />
                Generate My Custom Path
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
