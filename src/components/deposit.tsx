import React, { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';  // Import SweetAlert
import Mtn from '../assets/images/mtn.png';
import Airtel from '../assets/images/airtel.jpg';
import TopNav from './topNav';
import BottomNav from './bottomNav';

const Deposit: React.FC = () => {
  const [transactionId, setTransactionId] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        Swal.fire('Error', 'User not authenticated', 'error');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!transactionId || !userId) {
      Swal.fire('Error', 'Please enter a valid transaction ID and make sure you are logged in.', 'error');
      return;
    }

    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        deposit: {
          transactionId,
          amount: 10000,
          date: serverTimestamp(),
        },
      });

      // Success message
      Swal.fire('Success', 'Transaction ID submitted successfully', 'success');
      setTransactionId('');  // Clear input field after success
    } catch (error) {
      console.error('Error submitting transaction:', error);
      // Error message
      Swal.fire('Error', 'Failed to submit transaction ID. Please try again.', 'error');
    }
  };

  return (
    <>
      <TopNav />
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md mx-auto mt-10 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Deposit via Mobile Money</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Deposit money to one of our following merchant numbers and use your account name as the reference.
          We will process your transfer immediately, and it should be completed within 30 minutes.
        </p>

        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg w-1/2 mx-1 shadow">
            <img src={Mtn} alt="MTN" className="w-10 h-10 mb-2" />
            <p className="text-xs font-semibold text-gray-300">MTN Merchant Number:</p>
            <p className="text-gray-300 font-medium text-sm">735381</p>
            <p className="text-gray-300 font-medium text-sm">Account Name: DERICK</p>
          </div>
          <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg w-1/2 mx-1 shadow">
            <img src={Airtel} alt="Airtel" className="w-10 h-10 mb-2" />
            <p className="text-xs font-semibold text-gray-300">AIRTEL Merchant Number:</p>
            <p className="text-gray-300 font-medium text-sm">Coming Soon</p>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="transactionId" className="block text-sm font-medium text-gray-300 mb-1">
            Enter Your Transaction ID
          </label>
          <input
            style={{ color: 'black', fontWeight: 'bold' }}
            type="text"
            id="transactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-500"
            placeholder="Transaction ID"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-md"
            onClick={() => setTransactionId('')}
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-600"
          >
            Submit
          </button>
        </div>

        <p className="mt-6 text-center text-gray-500 text-xs">
          You are required to submit your transaction ID as proof of payment. NOTE: If you submit a wrong Transaction ID, your payment will not be approved.
          Approval takes less than 30 minutes.
        </p>
      </div>
      <BottomNav />
    </>
  );
};

export default Deposit;
