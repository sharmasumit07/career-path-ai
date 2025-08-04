import OpenAI from "openai";
import type { AssessmentData, CareerPath, ChatMessage } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder-key",
});

export async function generateCareerRecommendations(assessmentData: AssessmentData): Promise<CareerPath[]> {
  try {
    // Check if API key is available and valid
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-placeholder-key") {
      return generateDemoRecommendations(assessmentData);
    }

    const prompt = `Based on the following career assessment data, provide 3-5 personalized career path recommendations in JSON format.

Assessment Data:
- Current Situation: ${assessmentData.currentSituation}
- Education Level: ${assessmentData.educationLevel}
- Experience: ${assessmentData.experience}
- Interests: ${assessmentData.interests.join(', ')}
- Skills: ${assessmentData.skills?.join(', ') || 'Not specified'}
- Goals: ${assessmentData.goals || 'Not specified'}

For each career path, provide:
1. title: The career/job title
2. description: Brief description of the role
3. steps: Array of 3-4 concrete steps to reach this career, each with:
   - title: Step name
   - description: What to do in this step
   - duration: Realistic timeframe
   - skills: Array of specific skills to develop
4. salaryRange: Expected salary range
5. growthProjection: Job market outlook

Respond with a JSON object containing an array of career paths: { "careerPaths": [...] }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor with deep knowledge of various industries, job markets, and career development paths. Provide practical, actionable advice based on current market trends."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"careerPaths": []}');
    return result.careerPaths || [];
  } catch (error) {
    console.error('Error generating career recommendations:', error);
    // Fallback to demo recommendations if API fails
    return generateDemoRecommendations(assessmentData);
  }
}

function generateDemoRecommendations(assessmentData: AssessmentData): CareerPath[] {
  const baseRecommendations: CareerPath[] = [
    {
      title: "Software Developer",
      description: "Build applications and systems using programming languages like Python, JavaScript, or Java",
      steps: [
        {
          title: "Learn Programming Fundamentals",
          description: "Master basic programming concepts and choose a language",
          duration: "3-6 months",
          skills: ["Python", "JavaScript", "Git", "Problem Solving"]
        },
        {
          title: "Build Portfolio Projects",
          description: "Create real applications to showcase your skills",
          duration: "6-12 months",
          skills: ["Web Development", "Database Design", "API Development"]
        },
        {
          title: "Land Entry-Level Position",
          description: "Apply for junior developer roles and gain experience",
          duration: "Ongoing",
          skills: ["Interview Skills", "Code Reviews", "Team Collaboration"]
        }
      ],
      salaryRange: "$50,000 - $120,000",
      growthProjection: "Excellent - 22% growth expected"
    },
    {
      title: "Data Analyst",
      description: "Analyze data to help businesses make informed decisions",
      steps: [
        {
          title: "Learn Data Analysis Tools",
          description: "Master Excel, SQL, and Python for data manipulation",
          duration: "2-4 months",
          skills: ["Excel", "SQL", "Python", "Statistics"]
        },
        {
          title: "Practice with Real Datasets",
          description: "Work on projects using real business data",
          duration: "4-8 months",
          skills: ["Data Visualization", "Tableau", "PowerBI"]
        },
        {
          title: "Build Professional Network",
          description: "Connect with data professionals and find opportunities",
          duration: "Ongoing",
          skills: ["Communication", "Business Acumen", "Presentation"]
        }
      ],
      salaryRange: "$45,000 - $85,000",
      growthProjection: "Strong - 8% growth expected"
    },
    {
      title: "Digital Marketing Specialist",
      description: "Promote brands and products through digital channels",
      steps: [
        {
          title: "Learn Digital Marketing Basics",
          description: "Understand SEO, social media, and content marketing",
          duration: "2-3 months",
          skills: ["SEO", "Social Media", "Content Creation", "Analytics"]
        },
        {
          title: "Get Certified",
          description: "Earn certifications from Google, Facebook, and HubSpot",
          duration: "3-6 months",
          skills: ["Google Ads", "Facebook Ads", "Email Marketing"]
        },
        {
          title: "Gain Practical Experience",
          description: "Work on campaigns for real businesses or internships",
          duration: "6-12 months",
          skills: ["Campaign Management", "A/B Testing", "ROI Analysis"]
        }
      ],
      salaryRange: "$40,000 - $75,000",
      growthProjection: "Very Strong - 13% growth expected"
    }
  ];

  // Customize based on interests
  if (assessmentData.interests.includes('technology') || assessmentData.interests.includes('problem-solving')) {
    return baseRecommendations.filter(rec => rec.title.includes('Software') || rec.title.includes('Data'));
  }
  
  if (assessmentData.interests.includes('creative-work')) {
    return baseRecommendations.filter(rec => rec.title.includes('Marketing')).concat([{
      title: "UX/UI Designer",
      description: "Design user-friendly interfaces and experiences for digital products",
      steps: [
        {
          title: "Learn Design Fundamentals",
          description: "Master design principles, color theory, and typography",
          duration: "2-4 months",
          skills: ["Design Principles", "Color Theory", "Typography", "Figma"]
        },
        {
          title: "Build Design Portfolio",
          description: "Create case studies showcasing your design process",
          duration: "4-8 months",
          skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing"]
        },
        {
          title: "Network and Apply",
          description: "Connect with design communities and apply for roles",
          duration: "Ongoing",
          skills: ["Portfolio Presentation", "Design Critique", "Client Communication"]
        }
      ],
      salaryRange: "$55,000 - $95,000",  
      growthProjection: "Strong - 9% growth expected"
    }]);
  }

  return baseRecommendations;
}

export async function processChatMessage(message: string, conversationHistory: ChatMessage[], userAssessment?: AssessmentData): Promise<string> {
  try {
    // Check if API key is available and valid
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-placeholder-key") {
      return generateDemoChatResponse(message, userAssessment);
    }

    const systemPrompt = `You are an AI career guidance counselor with expertise in:
- Career development and planning
- Industry insights and job market trends
- Skill development recommendations
- Educational pathways
- Interview preparation
- Resume and portfolio advice
- Salary negotiation
- Work-life balance

${userAssessment ? `
User's background:
- Current Situation: ${userAssessment.currentSituation}
- Education: ${userAssessment.educationLevel}
- Experience: ${userAssessment.experience}
- Interests: ${userAssessment.interests.join(', ')}
` : ''}

Provide helpful, personalized career advice. Be encouraging, practical, and specific. If asked about salary ranges, job market trends, or specific companies, provide realistic and current information.`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      { role: "user" as const, content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't process your request. Please try asking again.";
  } catch (error) {
    console.error('Error processing chat message:', error);
    // Fallback to demo response if API fails
    return generateDemoChatResponse(message, userAssessment);
  }
}

function generateDemoChatResponse(message: string, userAssessment?: AssessmentData): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('money')) {
    return "Salary ranges vary greatly by location, experience, and industry. For tech roles, entry-level positions typically start at $50-70k, while experienced developers can earn $100k+. I recommend checking sites like Glassdoor or PayScale for current market rates in your area.";
  }
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('study')) {
    return "The most in-demand skills right now include programming (Python, JavaScript), data analysis, digital marketing, and cloud computing. I'd recommend starting with one that aligns with your interests and career goals. What field interests you most?";
  }
  
  if (lowerMessage.includes('interview') || lowerMessage.includes('job search') || lowerMessage.includes('apply')) {
    return "Job search success comes down to preparation! Make sure your resume highlights relevant skills, practice common interview questions, and research the company thoroughly. Networking is also crucial - reach out to people in your target industry on LinkedIn.";
  }
  
  if (lowerMessage.includes('career change') || lowerMessage.includes('switch') || lowerMessage.includes('transition')) {
    return "Career changes can be exciting! Start by identifying transferable skills from your current role. Consider taking courses or getting certifications in your target field. Many successful career changers start with side projects or volunteer work to build experience.";
  }
  
  if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('programming')) {
    return "Tech is a fantastic field with great growth prospects! Popular entry points include web development (HTML, CSS, JavaScript), data analysis (Python, SQL), or cloud computing (AWS, Azure). What aspect of technology interests you most?";
  }
  
  if (lowerMessage.includes('remote') || lowerMessage.includes('work from home')) {
    return "Remote work has become much more common! Fields like software development, digital marketing, writing, and customer service offer many remote opportunities. Make sure to highlight your self-discipline and communication skills when applying for remote positions.";
  }
  
  // Default response
  return `That's a great question! While I'm currently running in demo mode (add your OpenAI API key for full AI responses), I can share that career success often comes down to continuous learning, networking, and finding the right fit between your interests and market demand. ${userAssessment ? `Based on your interests in ${userAssessment.interests.join(' and ')}, you might want to explore related career paths.` : 'Consider taking our career assessment to get personalized recommendations!'} What specific aspect of your career would you like to focus on?`;
}

export async function generateCustomCareerPath(interests: string[], currentRole?: string): Promise<CareerPath> {
  try {
    const prompt = `Create a detailed career path for someone interested in: ${interests.join(', ')}
${currentRole ? `Currently working as: ${currentRole}` : ''}

Provide a JSON response with:
{
  "title": "Career path name",
  "description": "Overview of this career direction",
  "steps": [
    {
      "title": "Step name",
      "description": "What to do in this step",
      "duration": "Timeframe",
      "skills": ["skill1", "skill2", "skill3"]
    }
  ],
  "salaryRange": "Expected salary range",
  "growthProjection": "Job market outlook"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a career development expert. Create detailed, actionable career paths with realistic timelines and specific skills."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating custom career path:', error);
    throw new Error("Failed to generate custom career path. Please try again.");
  }
}
