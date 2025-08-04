import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, Book, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'course':
      return GraduationCap;
    case 'certification':
      return Award;
    case 'book':
      return Book;
    default:
      return GraduationCap;
  }
};

const getResourceIconColor = (type: string) => {
  switch (type) {
    case 'course':
      return 'text-primary bg-blue-100';
    case 'certification':
      return 'text-green-600 bg-green-100';
    case 'book':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-primary bg-blue-100';
  }
};

const getPriceColor = (price: string) => {
  if (price.toLowerCase().includes('free')) {
    return 'bg-green-100 text-green-600';
  } else if (price.includes('$')) {
    return 'bg-orange-100 text-orange-600';
  }
  return 'bg-blue-100 text-primary';
};

export default function ResourcesSection() {
  const { data: resourcesData, isLoading, error } = useQuery({
    queryKey: ["/api/resources"],
  });

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Failed to load resources. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommended Resources</h2>
          <p className="text-lg text-gray-600">Curated learning materials to accelerate your career growth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              </Card>
            ))
          ) : (
            (resourcesData as any)?.resources?.map((resource: any) => {
              const IconComponent = getResourceIcon(resource.type);
              const iconColor = getResourceIconColor(resource.type);
              const priceColor = getPriceColor(resource.price);

              return (
                <Card key={resource.id} className="p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-500">{resource.provider}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${priceColor} px-2 py-1 text-xs font-medium`}>
                        {resource.price}
                      </Badge>
                      <span className="text-gray-500 text-xs">{resource.duration}</span>
                    </div>
                    <Button 
                      variant="link" 
                      size="sm"
                      className="text-primary font-medium text-sm p-0 h-auto"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      View Course
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
            View All Resources
          </Button>
        </div>
      </div>
    </section>
  );
}
