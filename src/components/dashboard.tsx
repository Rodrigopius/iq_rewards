import React, { useState, useEffect } from 'react';
import Logo from '../assets/icons/logo_image.png';
import {
  ArrowRight,
  Home,
  CreditCard,
  LayoutGrid,
  Plus,
  ArrowUp,
  Share2,
  User,
  Info,
} from 'lucide-react';
import TriviaIcon from '../assets/icons/trivia.png';
import GameIcon from '../assets/icons/game.webp';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import ReferredFriends from './friendsComponent';
import Leaderboard from './Leaderboard';
import EarnFeatures from './earnFeatures';
import UserProfile from './userProfile';
import TopNav from './topNav';
import BottomNav from './bottomNav';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { listenForReferralVerification } from '../referralListner';
import SocialBar from './adunits/socialBar'
import BannerAd from './adunits/bannerAd';
const DashboardUI = () => {
  const [selectedTab, setSelectedTab] = useState('Earn');
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [referralBalance, setReferralBalance] = useState<number>(0);
  const [status, setStatus] = useState<'verified' | 'unverified'>('unverified'); // Default to 'unverified'

  // Calculate the total balance
  const totalBalance = (balance || 0) + referralBalance;

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username || '');
          setBalance(userData.score || 0);
          setReferralBalance(userData.referralBalance || 0);

          // Trigger the referral verification listener
          listenForReferralVerification(user.uid, setReferralBalance);

          setStatus(userData.status || 'unverified'); // Set status from Firestore
        }
      }
    };
    fetchUserData();
  }, []);

  const handleInfoClick = () => {
    if (status === 'unverified') {
      Swal.fire({
        title: 'Account Verification',
        text: 'You need to verify your account with a fee of UGX 10,000 in order to withdraw your earnings.',
        icon: 'info',
        confirmButtonText: 'Okay',
      });
    }
  };

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        
        {/* Header Navigation */}
        <TopNav />
      
        <SocialBar/>
        <SocialBar/>
        {/* Mobile Header */}
        <div className="sm:hidden flex justify-center items-center py-3 bg-gray-900 shadow-md">
          <img src={Logo} alt="RewardIQ Logo" className="w-12"  />
        </div>

        {/* User Info and Balance */}
        <div className="container mx-auto px-3 py-4">
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <User className="w-8 h-8 rounded-full bg-gray-700 border border-purple-500 shadow-lg"></User>
                <span className="font-semibold text-sm sm:text-lg text-gray-200 truncate">{username}</span>
              </div>

              {/* USER STATUS ICON */}
              <div className="flex items-center ml-2">
                <span className={`text-sm ${status === 'verified' ? 'text-green-500' : 'text-gray-400'}`}>
                  {status === 'verified' ? 'Verified' : 'Unverified'}
                </span>
                {status === 'unverified' && (
                  <Info
                    className="w-5 h-5 text-yellow-400 cursor-pointer ml-2"
                    onClick={handleInfoClick}
                  />
                )}
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${status === 'verified' ? 'bg-green-500' : 'bg-gray-800'}`}>
                <div className={`w-2 h-2 rounded-full ${status === 'verified' ? 'bg-green-700' : 'bg-red-500'} animate-pulse`}></div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="mb-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Total Balance</p>
              <div className="relative p-6 bg-gradient-to-r from-purple-800 to-blue-900 rounded-xl shadow-2xl transform hover:scale-105 transition-all">
                <h1 className="text-4xl font-extrabold bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                  UGX {totalBalance.toLocaleString()}
                </h1>
              </div>
              <p className="text-gray-400 text-xs mb-1 mt-6">Referral Commission</p>
              <div className="relative p-6 bg-gradient-to-r from-pink-800 to-yellow-900 rounded-xl shadow-2xl transform hover:scale-105 transition-all">
                <p className="text-3xl font-bold bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400">
                  UGX {referralBalance.toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-6">
                {[ 
                  { icon: <Plus size={16} />, label: 'Deposit', route: '/deposit', color: 'bg-green-500' },
                  { icon: <ArrowUp size={16} />, label: 'Withdraw Commission', route: '/comisionWithdraw', color: 'bg-yellow-500' },
                  { icon: <ArrowUp size={16} />, label: 'Withdraw Earnings', route: '/withdraw', color: 'bg-blue-500' },
                  { icon: <Share2 size={16} />, label: 'Invite Friends', route: '/referal', color: 'bg-pink-500' },
                ].map((action, index) => (
                  <Link
                    key={index}
                    to={action.route}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 shadow-md transform hover:scale-105 transition-transform"
                  >
                    <span className={`p-2 rounded-full ${action.color} text-white shadow-md`}>{action.icon}</span>
                    <span className="text-xs text-gray-300">{action.label}</span>
                  </Link>
                ))}
              </div>
              <BannerAd/>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 text-xs bg-white/10 backdrop-blur-lg p-3 rounded-lg shadow-md">
              {['Earn', 'Tasks', 'Leaderboard', 'Friend'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    selectedTab === tab
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Conditional Content Based on Selected Tab */}
            <div className="my-4">
              {selectedTab === 'Friend' && <ReferredFriends />}
              {selectedTab === 'Leaderboard' && <Leaderboard />}
              {selectedTab === 'Earn' && <EarnFeatures />}
            </div>
          </div>
        </div>
        <SocialBar/>
        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </>
  );
};

export default DashboardUI;
