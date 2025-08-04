import { Card } from "@/components/ui/card";
import { 
  Code, 
  Heart, 
  TrendingUp, 
  Palette, 
  GraduationCap, 
  Microscope,
  ArrowRight 
} from "lucide-react";

interface CareerCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
}

const categories: CareerCategory[] = [
  {
    id: "technology",
    title: "Technology",
    description: "Software development, AI, cybersecurity, data science",
    icon: Code,
    iconColor: "text-primary",
    iconBg: "bg-blue-100"
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description: "Medicine, nursing, therapy, medical research",
    icon: Heart,
    iconColor: "text-green-600",
    iconBg: "bg-green-100"
  },
  {
    id: "business",
    title: "Business",
    description: "Marketing, finance, consulting, entrepreneurship",
    icon: TrendingUp,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100"
  },
  {
    id: "creative",
    title: "Creative Arts",
    description: "Design, writing, music, film, digital art",
    icon: Palette,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100"
  },
  {
    id: "education",
    title: "Education",
    description: "Teaching, training, curriculum development",
    icon: GraduationCap,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-100"
  },
  {
    id: "science",
    title: "Science & Research",
    description: "Research, laboratory work, environmental science",
    icon: Microscope,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-100"
  }
];

interface CareerCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
}

export default function CareerCategories({ onSelectCategory }: CareerCategoriesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Career Categories</h2>
          <p className="text-lg text-gray-600">Find your passion across different industries and fields</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-gray-50 border-0"
                onClick={() => onSelectCategory(category.id)}
              >
                <div className={`w-12 h-12 ${category.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className={`${category.iconColor} w-6 h-6`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center text-primary font-medium">
                  <span>Explore paths</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
