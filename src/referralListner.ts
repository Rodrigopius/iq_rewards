import { getFirestore, collection, query, where, onSnapshot, updateDoc, doc, getDoc, DocumentData } from 'firebase/firestore';

export const listenForReferralVerification = (
    referrerId: string,
    setReferralBalance: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const db = getFirestore();
  
    // Query for friends who have been referred by the referrer
    const friendsQuery = query(collection(db, 'users'), where('referredBy', '==', referrerId));
  
    console.log(`Listening for friends referred by referrer: ${referrerId}`);
  
    return onSnapshot(friendsQuery, async (querySnapshot) => {
      querySnapshot.forEach(async (docSnapshot) => {
        const friendData = docSnapshot.data() as DocumentData;
  
        // Log friend data to check if it's retrieved correctly
        console.log('Friend Data:', friendData);
  
        // Check if the friend's status is verified and reward has not been credited yet
        if (friendData.status === 'verified' && !friendData.rewardCredited) {
          console.log(`Friend ${docSnapshot.id} is verified and reward has not been credited. Crediting referrer ${referrerId}.`);
  
          // Retrieve the referrer document
          const referrerDocRef = doc(db, 'users', referrerId);
          const referrerDocSnap = await getDoc(referrerDocRef);
  
          if (referrerDocSnap.exists()) {
            const referrerData = referrerDocSnap.data();
            const newReferralBalance = referrerData?.referralBalance ? referrerData.referralBalance + 4000 : 4000;
  
            console.log(`Updated referral balance: ${newReferralBalance}`);
  
            // Update the referral balance in the referrer's Firestore document
            await updateDoc(referrerDocRef, {
              referralBalance: newReferralBalance,
            });
  
            // Update the state for referral balance if needed
            setReferralBalance(newReferralBalance);
  
            // Mark the reward as credited in the friend's document to prevent duplicate rewards
            const friendDocRef = doc(db, 'users', docSnapshot.id);
            await updateDoc(friendDocRef, {
              rewardCredited: true,
            });
          } else {
            console.error(`Referrer document does not exist: ${referrerId}`);
          }
        } else if (friendData.rewardCredited) {
          console.log(`Friend ${docSnapshot.id} has already credited the reward to referrer.`);
        } else {
          console.log(`Friend ${docSnapshot.id} is not verified yet.`);
        }
      });
    });
  };
  