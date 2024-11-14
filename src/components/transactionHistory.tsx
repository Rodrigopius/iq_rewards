import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { format } from "date-fns";
import { getAuth } from "firebase/auth";
import TopNav from "./topNav";
import BottomNav from "./bottomNav";
import SocialBar from "./adunits/socialBar";
interface Transaction {
  id: string;
  withdrawAmount: number;
  status: string; // pending, completed, failed
  timestamp: Date;
  transactionId: string;
  withdrawNumber: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading
  const [error, setError] = useState<string | null>(null); // Error state

  // Log the user ID on authentication change
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        console.log(`User ID set to: ${user.uid}`);
      } else {
        setError("User not authenticated.");
        console.error("No user authenticated.");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      setLoading(true);  // Start loading
      try {
        const transactionsRef = collection(db, "withdrawals");

        // Log the query to verify the correct collection and userId
        const q = query(transactionsRef, where("userId", "==", userId));
        console.log(`Querying with userId: ${userId}`);

        // Fetching the documents
        const snapshot = await getDocs(q);
        console.log(`Found ${snapshot.size} transactions`);

        if (snapshot.empty) {
          setError("No transactions found for this user.");
          return;
        }

        // Map the documents to the Transaction type
        const fetchedTransactions = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(`Fetched transaction ID: ${doc.id}, Data: `, data);

          try {
            // Attempt to access and convert the timestamp
            const timestamp = data.timestamp ? data.timestamp.toDate() : null;
            if (!timestamp) {
              console.error(`Invalid timestamp for transaction ${doc.id}`);
              return null; // Skip this entry if timestamp is invalid
            }
            return {
              id: doc.id,
              withdrawAmount: data.withdrawAmount,
              status: data.status,
              timestamp, // Timestamp converted to Date
              transactionId: data.transactionId,
              withdrawNumber: data.withdrawNumber, // Withdraw number field
            };
          } catch (err) {
            console.error(`Error processing transaction ${doc.id}:`, err);
            return null;
          }
        });

        // Filter out null entries and set the valid transactions
        setTransactions(fetchedTransactions.filter((transaction): transaction is Transaction => transaction !== null));
      } catch (err: unknown) {
        // Type assertion to tell TypeScript that the error is of type 'Error'
        const errorMessage = (err instanceof Error) ? err.message : "Unknown error occurred";
        console.error("Error fetching transactions:", errorMessage);
        setError(`Failed to fetch transactions: ${errorMessage}`);
      } finally {
        setLoading(false);  // End loading
      }
    };

    fetchTransactions();
  }, [userId]);

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Transaction History</h2>

        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          {loading ? (
            <p className="text-center text-gray-400">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-gray-700 p-2 text-sm sm:text-base">Transaction ID</th>
                    <th className="border-b border-gray-700 p-2 text-sm sm:text-base">Withdraw Number</th>
                    <th className="border-b border-gray-700 p-2 text-sm sm:text-base">Date</th>
                    <th className="border-b border-gray-700 p-2 text-sm sm:text-base">Amount (UGX)</th>
                    <th className="border-b border-gray-700 p-2 text-sm sm:text-base">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-gray-400">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-700">
                        <td className="p-2 text-xs sm:text-base">{transaction.transactionId}</td>
                        <td className="p-2 text-xs sm:text-base">{transaction.withdrawNumber}</td>
                        <td className="p-2 text-xs sm:text-base">
                          {format(transaction.timestamp, "yyyy-MM-dd HH:mm")}
                        </td>
                        <td className="p-2 text-xs sm:text-base">{transaction.withdrawAmount.toLocaleString()}</td>
                        <td
                          className={`p-2 font-semibold text-xs sm:text-base ${
                            transaction.status === "completed"
                              ? "text-green-500"
                              : transaction.status === "pending"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <SocialBar/>
      <BottomNav />
    </>
  );
};

export default TransactionHistory;
