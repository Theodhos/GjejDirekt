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
import { useLanguage } from '@/context/LanguageContext';

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
const categoryColors: Record<string, { bg: string; icon: string; border: string }> = {
  'akomodim': { bg: 'bg-purple-100 hover:bg-purple-200', icon: 'bg-purple-600', border: 'border-purple-200 hover:border-purple-300' },
  'restorante': { bg: 'bg-pink-100 hover:bg-pink-200', icon: 'bg-pink-600', border: 'border-pink-200 hover:border-pink-300' },
  'atraksione': { bg: 'bg-blue-100 hover:bg-blue-200', icon: 'bg-blue-600', border: 'border-blue-200 hover:border-blue-300' },
  'evente': { bg: 'bg-orange-100 hover:bg-orange-200', icon: 'bg-orange-600', border: 'border-orange-200 hover:border-orange-300' },
  'sherbime-turistike': { bg: 'bg-teal-100 hover:bg-teal-200', icon: 'bg-teal-600', border: 'border-teal-200 hover:border-teal-300' },
  'produkte-lokale': { bg: 'bg-green-100 hover:bg-green-200', icon: 'bg-green-600', border: 'border-green-200 hover:border-green-300' },
  'transport': { bg: 'bg-cyan-100 hover:bg-cyan-200', icon: 'bg-cyan-600', border: 'border-cyan-200 hover:border-cyan-300' }
};

export default function CreateListingPage() {
  const router = useRouter();
  const { language } = useLanguage();

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
            {language === "en" ? "Create a listing" : "Shto një shërbim"}
          </h1>
          <p className="text-lg text-gray-500">
            {language === "en" ? "What type of listing would you like to add?" : "Çfarë lloj shërbimi dëshironi të shtoni?"}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const colors = categoryColors[category.value] || {
              bg: 'bg-gray-50 hover:bg-gray-100', 
              icon: 'bg-gray-600',
              border: 'border-gray-200 hover:border-gray-300'
            };
            const icon = categoryIcons[category.value] || <MapPin className="w-12 h-12" />;

            return (
              <div
                key={category.value}
                onClick={() => handleCategoryClick(category.value)}
                className={`${colors.bg} ${colors.border} border rounded-2xl p-8 cursor-pointer transition-all duration-200 transform hover:scale-[1.03] hover:shadow-xl shadow-sm`}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon Circle */}
                  <div className={`${colors.icon} rounded-full p-4 mb-4 text-white shadow-lg`}>
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
            ← {language === "en" ? "Go back" : "Kthehu prapa"}
          </button>
        </div>
      </div>
    </div>
  );
}
