import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext'; // Custom hook to get current user info (modify based on your auth setup)
import Spinner from '../components/spinner'; // Optional: Import a spinner for loading state

const ReferredFriends: React.FC = () => {
  const [friends, setFriends] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useAuth(); // Assuming you have a hook to access current user details

  useEffect(() => {
    const fetchReferredFriends = async () => {
      if (!currentUser) return;

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const referredFriends = userData?.referredFriends || [];
          const status = userData?.referredFriends || [];
          setFriends(referredFriends);
        } else {
          setError("User document doesn't exist.");
        }
      } catch (err) {
        console.error("Error fetching referred friends:", err);
        setError("Failed to load referred friends.");
      } finally {
        setLoading(false);
      }
    };

    fetchReferredFriends();
  }, [currentUser]);

  if (loading) return <Spinner />; // Render spinner while loading

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto text-white">
      <h2 className="text-2xl font-semibold text-gray-100 mb-6">Friends You've Referred</h2>

      {error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : friends.length === 0 ? (
        <p className="text-gray-400 text-center">You haven’t referred any friends yet.</p>
      ) : (
        <ul className="space-y-3">
          {friends.map((friend, index) => (
            <li
              key={index}
              className="p-3 bg-gray-700 rounded-lg text-gray-200 shadow-md hover:bg-gray-600 transition duration-200"
            >
              {friend}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReferredFriends;
