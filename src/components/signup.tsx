import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../assets/icons/logo_image.png';

// Spinner component
const Spinner: React.FC = () => {
  return <div className="loader" style={loaderStyle} />;
};

const loaderStyle: React.CSSProperties = {
  width: '50px',
  aspectRatio: '1',
  borderRadius: '50%',
  background: '#514b82',
  WebkitMask:
    'repeating-conic-gradient(#0000 0deg, #000 1deg 70deg, #0000 71deg 90deg), radial-gradient(farthest-side, #0000 calc(100% - 8px - 1px), #000 calc(100% - 8px))',
  WebkitMaskComposite: 'destination-in',
  maskComposite: 'intersect',
  animation: 'rotate 1s infinite linear',
};

const styles = `
  @keyframes rotate {
    to { transform: rotate(0.5turn); }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

interface FormData {
  username: string;
  email: string;
  password: string;
  verifyPwd: string;
  rememberMe: boolean;
  referrerId: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    verifyPwd: '',
    rememberMe: false,
    referrerId: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const referrerId = queryParams.get('ref') || '';
    setFormData((prev) => ({ ...prev, referrerId }));
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Reusable function to initialize a new user
  const initializeNewUser = async (userId: string, username: string, email: string, referrerId: string | null) => {
    await setDoc(doc(db, 'users', userId), {
      username,
      email,
      createdAt: new Date(),
      score: 1000, // Welcome bonus
      referredBy: referrerId || null,
      status: 'unverified',
    });

    if (referrerId) {
      const referrerDoc = doc(db, 'users', referrerId);
      await setDoc(
        referrerDoc,
        {
          referredFriends: arrayUnion(username),
        },
        { merge: true }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, username, verifyPwd, referrerId } = formData;

    if (password !== verifyPwd) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'The passwords you entered do not match. Please try again.',
      });
      return;
    }

    setLoading(true);

    try {
      const userDoc = await getDoc(doc(db, 'users', username));
      if (userDoc.exists()) {
        Swal.fire({
          icon: 'error',
          title: 'Username Taken',
          text: 'The username you entered is already taken. Please choose a different username.',
        });
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await initializeNewUser(user.uid, username, email, referrerId);

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Congratulations!! Your account has been created successfully! You received a 1,000 UGX welcome bonus.',
      });

      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error && error.message.includes('auth/email-already-in-use')) {
        errorMessage = 'The email address is already in use by another account.';
      }
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await initializeNewUser(user.uid, user.displayName || 'NewUser', user.email || '', formData.referrerId);
      }

      Swal.fire({
        icon: 'success',
        title: 'Google Sign-In Successful',
        text: 'You have been signed in successfully!',
      });
      navigate('/');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-In Failed',
        text: 'An error occurred during Google Sign-In. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600">
      <div className="w-full max-w-md p-6">
        <img src={Logo} alt="RewardIQ Logo" className="h-20 object-contain" style={{ width: '300px' }} />
        <div className="text-center mb-8">
          <p className="text-white/80 text-sm">Create An Account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full h-12 text-white bg-white/10 backdrop-blur rounded-lg pl-4 pr-10 
                             border border-white/20 focus:border-white focus:ring-2 focus:ring-white/30 
                             placeholder-white/60"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 text-white bg-white/10 backdrop-blur rounded-lg pl-4 pr-10 
                             border border-white/20 focus:border-white focus:ring-2 focus:ring-white/30 
                             placeholder-white/60"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 text-white bg-white/10 backdrop-blur rounded-lg pl-4 pr-10 
                             border border-white/20 focus:border-white focus:ring-2 focus:ring-white/30 
                             placeholder-white/60"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="verifyPwd"
                  value={formData.verifyPwd}
                  onChange={handleChange}
                  className="w-full h-12 text-white bg-white/10 backdrop-blur rounded-lg pl-4 pr-10 
                             border border-white/20 focus:border-white focus:ring-2 focus:ring-white/30 
                             placeholder-white/60"
                  placeholder="Verify Password"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="referrerId"
                  value={formData.referrerId}
                  readOnly
                  className="w-full h-12 text-gray-400 bg-white/10 backdrop-blur rounded-lg pl-4 pr-10 
                             border border-white/20 placeholder-white/60"
                  placeholder="Referrer ID"
                />
              </div>
              <button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg font-medium">
                {loading ? <Spinner /> : 'Sign Up'}
              </button>

              
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-white/60">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-medium">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
