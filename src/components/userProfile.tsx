import React, { useState, useEffect } from "react";
import { LogOut, Mail, Key, User } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import Swal from "sweetalert2";
import TopNav from "./topNav";
import BottomNav from "./bottomNav";

const UserProfile: React.FC = () => {
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username || user.displayName || "User");
          setBalance(userData.score || 0);
        }
        setProfilePic(user.photoURL);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleEditUsername = async () => {
    const { value: newUsername } = await Swal.fire({
      title: "Edit Username",
      input: "text",
      inputLabel: "Enter your new username",
      inputValue: username,
      showCancelButton: true,
      confirmButtonText: "Update",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter a valid username!";
        }
      },
    });

    if (newUsername) {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          await updateDoc(userDoc, { username: newUsername });
          setUsername(newUsername);
          Swal.fire("Updated!", "Your username has been updated.", "success");
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update username. Please try again.", "error");
      }
    }
  };

  const handleEditPassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Change Password",
      html:
        '<input id="old-password" type="password" class="swal2-input" placeholder="Old Password">' +
        '<input id="new-password" type="password" class="swal2-input" placeholder="New Password">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update Password",
      preConfirm: () => {
        const oldPassword = (Swal.getPopup()!.querySelector("#old-password") as HTMLInputElement).value;
        const newPassword = (Swal.getPopup()!.querySelector("#new-password") as HTMLInputElement).value;
        if (!oldPassword || !newPassword) {
          Swal.showValidationMessage("Both fields are required");
        }
        return { oldPassword, newPassword };
      },
    });

    if (formValues) {
      try {
        const user = auth.currentUser;
        if (user?.email) {
          const credential = EmailAuthProvider.credential(user.email, formValues.oldPassword);
          await reauthenticateWithCredential(user, credential); // Verify old password

          // Update to new password if old password is correct
          await updatePassword(user, formValues.newPassword);
          Swal.fire("Updated!", "Your password has been updated.", "success");
        }
      } catch (error) {
        Swal.fire("Error", "Incorrect old password or failed to update. Please try again.", "error");
      }
    }
  };

  return (
    <>
      <TopNav />
      <div className="bg-black p-4 min-h-screen flex flex-col items-center sm:justify-center">
        <div className="block sm:hidden w-full max-w-md mb-4">
          <h1 className="text-xl font-bold text-white text-center">User Profile</h1>
        </div>

        <div className="bg-gray-900 w-full max-w-md rounded-lg shadow-lg p-6 text-white sm:mt-0 sm:max-w-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-gray-700"
                />
              ) : (
                <User className="w-16 h-16 text-gray-500 rounded-full border-2 border-gray-700" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{username}</h2>
              <p className="text-sm text-gray-400">Balance: UGX {balance?.toLocaleString() || "0"}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleEditUsername}
              className="flex items-center justify-center w-full bg-blue-600 text-white rounded-md py-2 font-semibold"
            >
              <Mail size={16} className="mr-2" /> Edit Username
            </button>
            <button
              onClick={handleEditPassword}
              className="flex items-center justify-center w-full bg-green-600 text-white rounded-md py-2 font-semibold"
            >
              <Key size={16} className="mr-2" /> Reset Password
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full bg-red-600 text-white rounded-md py-2 font-semibold"
          >
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
        <BottomNav />
      </div>
    </>
  );
};

export default UserProfile;
