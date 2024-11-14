import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import your Firebase Firestore instance

interface User {
  id: string;
  username: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [topPlayers, setTopPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const leaderboardQuery = query(
          collection(db, 'users'), // Adjust collection name if needed
          orderBy('score', 'desc'),
          limit(50)
        );
        const querySnapshot = await getDocs(leaderboardQuery);
        const players: User[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setTopPlayers(players);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-white">Loading leaderboard...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <div className="w-full max-w-md bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {/* Scrollable Container */}
        <div className="overflow-y-auto max-h-80">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Username</th>
                <th className="py-2 px-4">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {topPlayers.map((player, index) => (
                <tr key={player.id} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                  <td className="py-2 px-4 text-center">{index + 1}</td>
                  <td className="py-2 px-4">{player.username}</td>
                  <td className="py-2 px-4 text-center">{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
