import { Route } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Features",
      links: [
        { label: "Career Assessment", href: "#" },
        { label: "AI Chat Guide", href: "#" },
        { label: "Career Paths", href: "#" },
        { label: "Resources", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "#" },
        { label: "Career Tips", href: "#" },
        { label: "Industry Insights", href: "#" },
        { label: "Success Stories", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Route className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-semibold">CareerGuide AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering careers through intelligent guidance and personalized recommendations.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 CareerGuide AI. All rights reserved. Built with AI-powered career guidance.</p>
        </div>
      </div>
    </footer>
  );
}
