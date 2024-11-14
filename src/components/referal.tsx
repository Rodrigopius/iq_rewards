import React, { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';
import { auth } from '../firebaseConfig';

const ReferralComponent = () => {
  const [copied, setCopied] = useState(false);

  // Generate the referral link based on the current user
  const userId = auth.currentUser?.uid;
  const referralLink = `${window.location.origin}/signup?ref=${userId}`;

  // Copy referral link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy referral link:", error);
    }
  };

  // Share referral link using the Web Share API (if supported)
  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join RewardIQ',
        text: 'Sign up using my referral link and start earning rewards!',
        url: referralLink,
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      alert('Sharing not supported on this browser. Please copy the link instead.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 to-blue-600 text-white px-4">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Refer & Earn</h1>
        <p className="text-gray-300 mb-6">
          Share your unique referral link with friends, and earn rewards when they join!
        </p>

        {/* Referral Link Display */}
        <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden shadow-md mb-4">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 p-2 bg-gray-800 text-gray-300 text-center truncate focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="bg-gray-700 p-2 hover:bg-gray-600 transition-all"
          >
            {copied ? (
              <span className="text-green-400 font-semibold text-sm">Copied!</span>
            ) : (
              <Copy size={20} className="text-gray-300" />
            )}
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={shareReferralLink}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all"
        >
          <Share2 size={20} />
          Share Link
        </button>

        {/* Additional Info */}
        <p className="text-xs text-gray-400 mt-4">
          Note: Rewards are added to your account when your friends sign up using your link.
        </p>
      </div>
    </div>
  );
};

export default ReferralComponent;
