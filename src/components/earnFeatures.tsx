import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TriviaIcon from '../assets/icons/trivia.png';
import GameIcon from '../assets/icons/game.webp';

const EarnFeatures: React.FC = () => {
  return (
    <div className="space-y-3 my-4">
      <Link to="/quizscreen" className="block">
        <div className="p-3 bg-gray-800 rounded-lg shadow-md flex justify-between items-center cursor-pointer transition-all duration-200 hover:bg-gray-700">
          <img src={TriviaIcon} alt="Trivia Icon" className="w-8 h-8 rounded-full" />
          <p className="font-medium text-gray-100 text-sm">Answer Trivia Questions</p>
          <ArrowRight size={16} className="text-blue-400" />
        </div>
      </Link>
      <a href="https://www.profitablecpmrate.com/s0gfx7d1?key=0910fe7dbe9de20f8f11e4a5005c6630" className="block">
        <div className="p-3 bg-gray-800 rounded-lg shadow-md flex justify-between items-center cursor-pointer transition-all duration-200 hover:bg-gray-700">
          <img src={GameIcon} alt="Game Icon" className="w-8 h-8 rounded-full" />
          <p className="font-medium text-gray-100 text-sm">Play to Earn Cash</p>
          <ArrowRight size={16} className="text-blue-400" />
        </div>
      </a>
    </div>
  );
};

export default EarnFeatures;
