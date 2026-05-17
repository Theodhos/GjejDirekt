"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/constants';
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  Home, 
  Car,
  UtensilsCrossed,
  Compass
} from 'lucide-react';

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  'akomodim': <Home className="w-12 h-12" />,
  'restorante': <UtensilsCrossed className="w-12 h-12" />,
  'atraksione': <Compass className="w-12 h-12" />,
  'evente': <Calendar className="w-12 h-12" />,
  'sherbime-turistike': <Briefcase className="w-12 h-12" />,
  'produkte-lokale': <MapPin className="w-12 h-12" />,
  'transport': <Car className="w-12 h-12" />
};

// Color mapping for category cards
const categoryColors: Record<string, { bg: string; icon: string }> = {
  'akomodim': { bg: 'bg-purple-50 hover:bg-purple-100', icon: 'bg-purple-500' },
  'restorante': { bg: 'bg-pink-50 hover:bg-pink-100', icon: 'bg-pink-500' },
  'atraksione': { bg: 'bg-blue-50 hover:bg-blue-100', icon: 'bg-blue-400' },
  'evente': { bg: 'bg-orange-50 hover:bg-orange-100', icon: 'bg-orange-500' },
  'sherbime-turistike': { bg: 'bg-teal-50 hover:bg-teal-100', icon: 'bg-teal-500' },
  'produkte-lokale': { bg: 'bg-green-50 hover:bg-green-100', icon: 'bg-green-500' },
  'transport': { bg: 'bg-cyan-50 hover:bg-cyan-100', icon: 'bg-cyan-500' }
};

export default function CreateListingPage() {
  const router = useRouter();

  const handleCategoryClick = (categoryValue: string) => {
    // Navigate to /listings/add with the selected category as a query parameter
    router.push(`/listings/add?category=${categoryValue}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Create a listing
          </h1>
          <p className="text-lg text-gray-500">
            What type of listing would you like to add?
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const colors = categoryColors[category.value] || { 
              bg: 'bg-gray-50 hover:bg-gray-100', 
              icon: 'bg-gray-500' 
            };
            const icon = categoryIcons[category.value] || <MapPin className="w-12 h-12" />;

            return (
              <div
                key={category.value}
                onClick={() => handleCategoryClick(category.value)}
                className={`${colors.bg} rounded-2xl p-8 cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon Circle */}
                  <div className={`${colors.icon} rounded-full p-4 mb-4 text-white`}>
                    {icon}
                  </div>
                  
                  {/* Category Label */}
                  <h3 className="text-xl font-semibold text-gray-800">
                    {category.label}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional: Back button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  );
}
