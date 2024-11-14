import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Globe, Beaker, Star, History, Film, Heart, Music, Home, CreditCard, LayoutGrid, User } from 'lucide-react';
import Logo from '../assets/icons/logo_image.png';

const categories = [
  { name: "General Knowledge", icon: <Book color="#4A90E2" />, key: "general_knowledge" },
  { name: "Science & Nature", icon: <Beaker color="#50E3C2" />, key: "science_nature" },
  { name: "History", icon: <History color="#F5A623" />, key: "history" },
  { name: "Geography", icon: <Globe color="#BD10E0" />, key: "geography" },
  { name: "Entertainment", icon: <Film color="#F8E71C" />, key: "entertainment" },
  { name: "Sports", icon: <Heart color="#D0021B" />, key: "sports" },
  { name: "Literature", icon: <Book color="#4A4A4A" />, key: "literature" },
  { name: "Music", icon: <Music color="#417505" />, key: "music" }
];

const TriviaCategory: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryKey: string) => {
    navigate(`/quiz/${categoryKey}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Desktop Header */}
      <header className="hidden sm:flex justify-between items-center px-4 py-3 bg-gray-900 shadow-md">
        <img src={Logo} alt="Logo" className="w-16" />
        <span className="text-xl font-semibold">Trivia Categories</span>
        <div className="flex gap-4">
          {['Dashboard', 'Card', 'Accounts', 'Profile'].map((item, index) => (
            <Link
              key={index}
              to={`/${item.toLowerCase()}`}
              className={`flex items-center gap-1 text-sm font-medium ${index === 0 ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {item === 'Dashboard' && <Home size={18} />}
              {item === 'Card' && <CreditCard size={18} />}
              {item === 'Accounts' && <LayoutGrid size={18} />}
              {item === 'Profile' && <User size={18} />}
              <span>{item}</span>
            </Link>
          ))}
        </div>
      </header>

      {/* Mobile Header */}
      <div className="sm:hidden flex justify-center items-center py-3 bg-gray-900 shadow-md">
        <img src={Logo} alt="Logo" className="w-12" />
      </div>

      <main className="container mx-auto px-3 py-4">
        <h1 className="text-2xl font-semibold text-center mb-6">Choose a Category</h1>
        <div className="grid grid-cols-2 gap-6">
          {categories.map((category) => (
            <div
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg shadow-md cursor-pointer transition-all duration-200 transform hover:scale-105 hover:bg-gray-700"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <span className="text-lg font-medium text-gray-300">{category.name}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 p-3 shadow-lg sm:hidden z-50">
        <div className="max-w-md mx-auto flex justify-between">
          {[
            { icon: <Home size={20} />, label: 'Dashboard', route: '/dashboard' },
            { icon: <CreditCard size={20} />, label: 'Account', route: '/account' },
            { icon: <LayoutGrid size={20} />, label: 'Activities', route: '/activities' },
            { icon: <User size={20} />, label: 'Profile', route: '/profile' },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.route}
              className={`flex flex-col items-center gap-1 ${index === 0 ? 'text-white' : 'text-gray-500 hover:text-white'}`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default TriviaCategory;
