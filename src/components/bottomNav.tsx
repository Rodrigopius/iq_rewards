// BottomNav.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, CreditCard, LayoutGrid, User } from "lucide-react";

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-3 shadow-lg sm:hidden z-50">
      <div className="max-w-md mx-auto flex justify-between">
        {[
          { icon: <Home size={20} />, label: "Dashboard", route: "/dashboard" },
          { icon: <CreditCard size={20} />, label: "Transactions", route: "/history" },
          { icon: <LayoutGrid size={20} />, label: "Games", route: "/quizscreen" },
          { icon: <User size={20} />, label: "Profile", route: "/UserProfile" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.route}
            className={`flex flex-col items-center gap-1 ${
              index === 0 ? "text-white" : "text-gray-500 hover:text-white transition-colors"
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
