import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Import your Firebase auth configuration
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Spinner from './spinner'; // Import the Spinner component you created
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/icons/logo_image.png';

const MySwal = withReactContent(Swal);
const googleProvider = new GoogleAuthProvider();

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password, rememberMe } = formData;
      if (rememberMe) {
        await auth.setPersistence(browserLocalPersistence);
      } else {
        await auth.setPersistence(browserSessionPersistence);
      }

      await signInWithEmailAndPassword(auth, email, password);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You have been logged in successfully!',
      });
      navigate('/');
    } catch (error) {
      let errorMessage = 'An error occurred during login.';
      if (error instanceof Error) {
        if (error.message.includes('auth/user-not-found')) {
          errorMessage = 'No user found with this email.';
        } else if (error.message.includes('auth/wrong-password')) {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (error.message.includes('auth/invalid-email')) {
          errorMessage = 'Invalid email format. Please check your email.';
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const { value: email } = await MySwal.fire({
      title: 'Enter your email address',
      input: 'email',
      inputLabel: 'We will send you a link to reset your password',
      inputPlaceholder: 'Enter your email address',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
    });

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Email Sent',
          text: `A password reset link has been sent to ${email}. Please check your inbox.`,
        });
      } catch (error) {
        let errorMessage = 'An error occurred while sending the password reset email.';
        if (error instanceof Error && error.message.includes('auth/user-not-found')) {
          errorMessage = 'No user found with this email address.';
        }
        Swal.fire({
          icon: 'error',
          title: 'Password Reset Failed',
          text: errorMessage,
        });
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Email Required',
        text: 'Please enter your email address to receive a password reset link.',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);

      Swal.fire({
        icon: 'success',
        title: 'Google Sign-In Successful',
        text: 'You have been logged in successfully!',
      });
      navigate('/');
    } catch (error) {
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
        <div className="text-center mb-8">
          <img src={Logo} alt="RewardIQ Logo" style={{ width: '300px' }} />
          <p className="text-white/80 text-sm">Login to Your Account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 text-white bg-white/10 backdrop-blur rounded-lg pl-4 pr-10 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/30 placeholder-white/60"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 text-white bg-white/10 backdrop-blur rounded-lg pl-4 pr-10 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/30 placeholder-white/60"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-white/30 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  Remember me
                </label>
                <button type="button" className="text-white hover:text-white/80" onClick={handleForgotPassword}>
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg font-medium hover:from-blue-800 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                disabled={loading}
              >
                {loading ? <Spinner /> : 'Login'}
              </button>

             

              <div className="text-center text-white text-sm">
                Not a member? <Link to="/signup">Sign Up</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
