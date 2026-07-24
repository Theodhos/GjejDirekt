import React from 'react';
import Link from 'next/link';

export const dynamic = "force-dynamic";

// Define a functional component for the home page
const HomePage: React.FC = () => {
  const categories = [
    {
      title: 'Accommodation',
      description: 'Discover our various accommodation options here!',
      path: 'accommodation',
    },
    {
      title: 'Restaurants',
      description: 'Eat your heart out with our diverse range of restaurants!',
      path: 'restaurants',
    },
    {
      title: 'Attractions',
      description: "Experience the world's greatest attractions right here!",
      path: 'attractions',
    },
    {
      title: 'Events',
      description: 'Find out about our exciting events and activities!',
      path: 'events',
    },
    {
      title: 'Tourist Services',
      description: 'Get everything you need for a perfect trip!',
      path: 'tourist-services',
    },
    {
      title: 'Local Products',
      description: 'Discover and buy our unique local products here!',
      path: 'local-products',
    },
    {
      title: 'Transport UI',
      description: 'Find the best transport options for your trip here!',
      path: 'transport-ui',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Our Website
        </h1>

        <p className="text-gray-600 mb-8">
          This is a sample home page using React and Tailwind CSS.
        </p>

        <div className="grid gap-4">
          {categories.map((category) => (
            <Link
              key={category.path}
              href={`/categories/${category.path}`}
              className="block bg-white rounded-2xl shadow-md p-5 cursor-pointer transition hover:shadow-xl hover:scale-[1.01]"
            >
              <h2 className="text-2xl font-semibold mb-2">
                {category.title}
              </h2>

              <p className="text-gray-600">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export the component as the default export
export default HomePage;
