import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { Routes, Route, useNavigate } from 'react-router-dom'; // No need for BrowserRouter here, just useNavigate
import { auth } from './firebaseConfig'; // Import auth from Firebase
import { onAuthStateChanged, User } from 'firebase/auth';
import Signup from './components/signup';
import Login from './components/login';
import Main from './components/Main';
import ToggleTheme from './components/ui/ToggleTheme';
import QuizProvider from './context/QuizProvider';
import ProtectedRoute from './privateRoutes'; // Import ProtectedRoute
import { GlobalStyles } from './styles/Global';
import { themes } from './styles/Theme';
import DashboardUI from './components/dashboard';
import ReferralComponent from './components/referal';
import TriviaCategory from './components/triviaCategory';
import QuizScreen from './components/quizScreen'; // Import the QuizScreen component
import UserProfile from './components/userProfile';
import Transaction from './components/transactionHistory';
import Deposit from './components/deposit';
import Withdraw from './components/withdraw';
import ComisionWithdraw from './components/comisionWithdraw'
function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });
  
  const navigate = useNavigate(); // Initialize the navigate function
  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setCurrentTheme(checked ? 'dark' : 'light');
    localStorage.setItem('theme', checked ? 'dark' : 'light');
  };

  const theme = currentTheme === 'light' ? themes.light : themes.dark;

  // Set up the authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user); // User logged in, set user state
        if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
          navigate('/'); // Redirect to home if the user is logged in but on login/signup page
        }
      } else {
        setCurrentUser(null); // User not logged in
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          navigate('/login'); // Redirect to login page if the user is not logged in and tries to access protected pages
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [navigate]);

  const ConditionalToggleTheme = () => {
    const location = window.location.pathname;
    return location !== '/signup' && location !== '/login' && location !== '/dashboard' ? (
      <ToggleTheme
        onChange={toggleTheme}
        currentTheme={currentTheme}
        checked={currentTheme === 'dark'}
        id="toggleTheme"
        value="theme"
      />
    ) : null;
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <QuizProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Protect the Main route with ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            {/*<Route path="/" element={<Main />} />*/}
            <Route path="/" element={<DashboardUI />} />
            <Route path="/referal" element={<ReferralComponent />} />
            <Route path="/triviaCategory" element={<TriviaCategory />} />
            <Route path="/quizscreen" element={<QuizScreen />} />
            <Route path="/userProfile"  element={<UserProfile/>}/>
            <Route path="/dashboard"  element={<DashboardUI/>}/>
            <Route path="/History"  element={<Transaction/>}/>
            <Route path="/deposit"  element={<Deposit/>}/>
            <Route path="/withdraw"  element={<Withdraw/>}/>
            <Route path="/comisionWithdraw"  element={<ComisionWithdraw/>}/>

          </Route>
        </Routes>
      </QuizProvider>
    </ThemeProvider>
  );
}

export default App;
