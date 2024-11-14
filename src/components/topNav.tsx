// TopNav.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, CreditCard, LayoutGrid, User } from "lucide-react";
import Logo from "../assets/icons/logo_image.png";

const TopNav: React.FC = () => {
  return (
    <div className="hidden sm:flex justify-between items-center px-4 py-3 bg-gray-900 shadow-md">
      <img src={Logo} alt="RewardIQ Logo" className="w-16" />
      <span className="text-xl font-semibold text-white">Dashboard</span>
      <div className="flex gap-4">
        {['Dashboard', 'History', '', 'UserProfile'].map((item, index) => (
          <Link
            key={index}
            to={`/${item.toLowerCase()}`}
            className={`flex items-center gap-1 text-sm font-medium ${
              index === 0 ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {item === 'Dashboard' && <Home size={18} />}
            {item === 'History' && <CreditCard size={18} />}
            
            {item === 'UserProfile' && <User size={18} />}
            <span>{item}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopNav;
