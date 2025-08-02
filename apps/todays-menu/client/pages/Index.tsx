import { useState, useEffect } from "react";
import { Menu } from "@shared/menu";

export default function Index() {
  const [showMenu, setShowMenu] = useState(false);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/menu/latest', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMenu(data);
        setShowMenu(true);
      } else {
        console.error('Failed to fetch menu:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      // Show popup anyway with a placeholder message
      setMenu({
        date: new Date().toISOString().split('T')[0],
        mealType: 'breakfast',
        menu: 'Menu will be available soon!'
      });
      setShowMenu(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://cdn.builder.io/api/v1/assets/8c437862987c43e98b9bc2833794dc4c/screenshot-2025-08-02-125242-8b7568?format=webp&width=800')`
        }}
      >
        <div className="absolute inset-0 bg-warm-100/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Badge */}
            <div className="mb-6">
              <span className="inline-block bg-orange-500/20 text-orange-600 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                Smart Food Solutions
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4 tracking-tight">
              BYTEBITE
            </h1>

            {/* Subtitle */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              Smart Mess Manager
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Revolutionizing campus dining with intelligent crowd management, real-time 
              feedback, and smart meal planning for college students.
            </p>


          </div>
        </div>

        {/* Campus Food Crisis Section */}
        <div className="bg-white/90 backdrop-blur-sm py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🍞</span>
              </div>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              The Campus Food Crisis
            </h3>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Every meal time, hungry students face the same delicious dilemmas in campus dining 
              halls. Long queues, unpredictable menus, and crowded spaces make campus dining a 
              challenge. BYTEBITE solves this with smart technology and real-time insights.
            </p>
          </div>
        </div>
      </div>

      {/* Menu Popup */}
      {showMenu && menu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Today's Menu</h3>
              <p className="text-gray-600 text-sm">
                {new Date(menu.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-600 font-semibold uppercase tracking-wide mb-1">
                  {menu.mealType}
                </div>
                <div className="text-lg text-gray-800 font-medium">
                  {menu.menu}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowMenu(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
