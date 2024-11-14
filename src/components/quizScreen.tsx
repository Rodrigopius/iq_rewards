import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import Spinner from './spinner';
import TopNav from './topNav';
import BottomNav from './bottomNav';
import PopUnder from './adunits/popunder';
import SocialBar from './adunits/socialBar';
import NativeBanner from './adunits/nativBanner';
import BannerAd from './adunits/bannerAd';
interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers: string[];
}

const QuizScreen: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showAd, setShowAd] = useState(false); // State to control ad visibility

  const { currentUser } = useAuth();

  // Fetch current user's score from Firestore
  useEffect(() => {
    const fetchUserScore = async () => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setTotalScore(data.score || 0);
        }
      }
    };
    fetchUserScore();
  }, [currentUser]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          'https://opentdb.com/api.php?amount=5&category=22&difficulty=medium&type=multiple'
        );
        const data = await res.json();
        const formattedQuestions = data.results.map((question: any) => ({
          ...question,
          answers: shuffle([...question.incorrect_answers, question.correct_answer]),
        }));
        setQuestions(formattedQuestions);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer === 0) {
      handleTimeOut();
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const shuffle = (array: string[]) => array.sort(() => Math.random() - 0.5);

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (userAnswer === questions[currentQuestionIndex].correct_answer) {
      setScore((prev) => prev + 10);
      setCorrectAnswers((prev) => prev + 1);
      Swal.fire('Correct!', 'You got it right!', 'success');
    } else {
      Swal.fire('Incorrect!', 'Better luck next time.', 'error');
    }

    setUserAnswer(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setGameOver(true);
      setShowAd(true); // Show ad at the end of the quiz round
    }
  };

  const handleTimeOut = () => {
    Swal.fire("Time's up!", "Your time is up! The quiz is over.", 'error');
    setGameOver(true);
    setShowAd(true); // Show ad at the end of the quiz round
  };

  const handlePlayAgain = () => {
    setScore(0);
    setCorrectAnswers(0);
    setCurrentQuestionIndex(0);
    setTimer(60);
    setGameOver(false);
    setUserAnswer(null);
    setQuizStarted(false);
    setShowAd(false); // Hide ad when starting a new round
  };

  useEffect(() => {
    if (gameOver && currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      updateDoc(userDocRef, {
        score: increment(score),
      }).then(() => {
        setTotalScore((prev) => prev + score);
      });
    }
  }, [gameOver, currentUser, score]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Loading Trivia</h1>
        <Spinner />
      </div>
    </div>
  );

  const currentQuestion = questions[currentQuestionIndex];

  if (gameOver) {
    return (
      <>
        <TopNav />
        <BannerAd/>
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
          <div className="w-full max-w-md p-6 bg-indigo-800 rounded-lg shadow-2xl text-white">
            <h1 className="text-3xl font-bold text-center mb-4">Game Over!</h1>
            <p className="text-lg text-center mb-6">
              You answered <span className="font-bold text-indigo-300">{correctAnswers}</span> out of{' '}
              <span className="font-bold text-indigo-300">{questions.length}</span> questions correctly.
            </p>
            <p className="text-lg text-center mb-6">
              Your final score is: <span className="font-bold text-indigo-300">{score}</span> / {questions.length}
            </p>
            <p className="text-lg text-center mb-6">
              Total Score: <span className="font-bold text-indigo-300">{totalScore}</span>
            </p>
            <button onClick={handlePlayAgain} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md">
              Play Again
            </button>
          </div>
         
        </div>
        {showAd && <PopUnder />} {/* Conditionally render the ad */}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-700 text-white">
      <div className="w-full max-w-md p-6 bg-indigo-800 rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Trivia Quiz</h2>
        <SocialBar/>
        {!quizStarted && (
          <>
            <p className="text-lg mb-6 text-center text-indigo-300">
              Answer trivia questions correctly and earn points. Good luck!
            </p>
            <button onClick={() => setQuizStarted(true)} className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-md">
              Start Quiz
            </button>
          </>
        )}

        {quizStarted && (
          <div>
            <p className="text-lg mb-4 text-indigo-300">{currentQuestion.question}</p>
            <div className="mb-4 flex justify-between">
              <p>Time Remaining: <span className="font-bold text-indigo-200">{timer}s</span></p>
              <p>Score: <span className="font-bold text-indigo-200">{score}</span></p>
            </div>
            <div className="grid gap-3">
              {currentQuestion.answers.map((answer) => (
                <button
                  key={answer}
                  onClick={() => handleAnswer(answer)}
                  className={`py-2 px-4 rounded-md ${userAnswer === answer ? 'bg-indigo-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                  disabled={!!userAnswer}
                >
                  {answer}
                </button>
              ))}
              <SocialBar/>
            </div>
            {userAnswer && (
              <button onClick={handleNextQuestion} className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md">
                Next Question
              </button>
            )}
          </div>
        )}
      </div>
      <NativeBanner/>
      <SocialBar/>
      <BottomNav />
      
    </div>
  );
};

export default QuizScreen;
