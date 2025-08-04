import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Route } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Route className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-semibold text-gray-900">CareerGuide AI</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/careers" className="text-gray-600 hover:text-gray-900 transition-colors">
              Explore Careers
            </Link>
            <Link href="/resources" className="text-gray-600 hover:text-gray-900 transition-colors">
              Resources
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Button className="bg-primary text-white hover:bg-blue-700">
              Get Started
            </Button>
          </div>
          
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/careers" className="text-gray-600 hover:text-gray-900">
                Explore Careers
              </Link>
              <Link href="/resources" className="text-gray-600 hover:text-gray-900">
                Resources
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Button className="bg-primary text-white hover:bg-blue-700 w-fit">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
