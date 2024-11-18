import React, { useState, useEffect } from 'react';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2'; // Import SweetAlert
import Spinner from './spinner'; // Import the Spinner component
import TopNav from './topNav';
import BottomNav from './bottomNav';
import SocialBar from './adunits/socialBar';

// Function to generate a random transaction ID
const generateTransactionId = () => {
  return 'TXN' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
};

const Withdraw: React.FC = () => {
  const [withdrawNumber, setWithdrawNumber] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserBalance(user.uid); // Fetch user balance
      } else {
        Swal.fire('Error', 'User not authenticated', 'error');
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserBalance = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setBalance(userData?.score || 0); // Assuming balance is stored in 'score' field
    }
  };

  const handleSubmit = async () => {
    if (!withdrawNumber || !withdrawAmount) {
      setError('Please fill in all fields.');
      return;
    }

    if (withdrawNumber.length !== 10 || isNaN(Number(withdrawNumber))) {
      setError('Please enter a valid 10-digit withdrawal number.');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount < 5000) {
      setError('Minimum withdrawal amount is 5,000.');
      return;
    }

    if (amount > 200000) {
      setError('Maximum withdrawal amount is 200,000.');
      return;
    }

    if (balance === null || balance < amount) {
      setError('Insufficient balance.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      Swal.fire('Error', 'User not found in the system', 'error');
      return;
    }

    const userData = userDoc.data();
    if (userData?.status !== 'verified') {
      Swal.fire('Error', 'You must verify your account before making a withdrawal.', 'error');
      return;
    }

    const fee = amount * 0.05; // 5% fee
    const netAmount = amount - fee; // Amount after deducting the fee

    // Confirm with SweetAlert before proceeding
    const confirmation = await Swal.fire({
      title: 'Confirm Withdrawal',
      html: `Amount entered: UGX ${amount.toLocaleString()}<br>Withdrawal fee: UGX ${fee.toLocaleString()}<br><strong>Net amount: UGX ${netAmount.toLocaleString()}</strong>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Proceed',
      cancelButtonText: 'Cancel',
    });

    if (!confirmation.isConfirmed) return;

    const transactionId = generateTransactionId(); // Generate a unique transaction ID
    const withdrawalData = {
      transactionId,
      withdrawNumber,
      withdrawAmount: netAmount, // Save net amount in the database
      status: 'pending',
      timestamp: serverTimestamp(),
      userId: user.uid,
    };

    setLoading(true);

    try {
      // Create a new withdrawal record in the 'withdrawals' collection
      await addDoc(collection(db, 'withdrawals'), withdrawalData);

      // Update user's balance (score) after withdrawal
      await updateDoc(userDocRef, {
        score: balance - amount, // Deduct the full amount from the user's balance
      });

      // Success message
      Swal.fire('Success', `You will receive UGX ${netAmount.toLocaleString()} after fees.`, 'success');
      setWithdrawNumber('');
      setWithdrawAmount('');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      Swal.fire('Error', 'Failed to process the withdrawal request. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopNav />
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md mx-auto mt-10 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Withdraw Funds</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Enter your withdrawal number and the amount you want to withdraw. The minimum withdrawal amount is 5,000 and the maximum is 200,000.
        </p>

        <div className="mb-4">
          <label htmlFor="withdrawNumber" className="block text-sm font-medium text-gray-300 mb-1">
            Enter Withdrawal Number
          </label>
          <input
            style={{ color: 'black', fontWeight: 'bold' }}
            type="tel"
            id="withdrawNumber"
            value={withdrawNumber}
            onChange={(e) => setWithdrawNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-500"
            placeholder="Withdrawal Number"
            inputMode="numeric"
            maxLength={10}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-300 mb-1">
            Enter Amount to Withdraw
          </label>
          <input
            style={{ color: 'black', fontWeight: 'bold' }}
            type="number"
            id="withdrawAmount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-500"
            placeholder="Amount"
            min={12000}
            max={200000}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-md"
            onClick={() => {
              setWithdrawNumber('');
              setWithdrawAmount('');
              setError('');
            }}
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-600"
            disabled={loading}
          >
            {loading ? <Spinner /> : 'Submit'}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-500 text-xs">
          Your balance: {balance !== null ? `UGX ${balance.toLocaleString()}` : 'Loading...'}
        </p>
      </div>
      <SocialBar />
      <BottomNav />
    </>
  );
};

export default Withdraw;
