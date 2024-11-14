import React, { useEffect, useState } from 'react';
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext'; // assuming you have an AuthContext to get current user
import Swal from 'sweetalert2';

const TasksScreen: React.FC = () => {
  const { currentUser } = useAuth(); // get the current user
  const db = getFirestore();
  const [tasks, setTasks] = useState<{ id: string; title: string; link: string; completed: boolean }[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const fetchTasks = async () => {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userTasks = docSnap.data().tasks || [];
      setTasks(userTasks);
    } else {
      console.error('No user data found');
    }
  };

  const handleTaskCompletion = async (taskId: string) => {
    if (!currentUser) {
      console.error('User is not authenticated');
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    const docSnap = await getDoc(userRef); // Fetch the user document here

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Fake screenshot submission
      Swal.fire({
        title: 'Upload proof screenshot',
        text: "Once you submit, it can't be undone!",
        input: 'file',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Submit Proof',
        footer: '<p style="color: red;">Warning: False submissions may lead to a ban and loss of account funds.</p>',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Update the score and task status in Firestore
          await updateDoc(userRef, {
            tasks: arrayUnion({ ...task, completed: true }), // mark task as completed
            score: (userData.score || 0) + 100, // add 100 points to score
          });

          // Remove old uncompleted task entry
          await updateDoc(userRef, {
            tasks: arrayRemove(task),
          });

          // Fetch updated tasks
          fetchTasks();
          Swal.fire('Proof submitted!', 'Your task has been marked as completed and 100 points added.', 'success');
        }
      });
    } else {
      console.error('User data not found');
    }
  };

  if (!currentUser) {
    return <p className="text-white text-center">Please log in to view tasks.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-semibold mb-4">Earn Points by Completing Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{task.title}</h3>
              <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                Go to task
              </a>
              <p className="text-sm mt-1">Complete this task to earn 100 points.</p>
            </div>
            <div>
              {task.completed ? (
                <p className="text-green-400 font-semibold">Completed</p>
              ) : (
                <button
                  onClick={() => handleTaskCompletion(task.id)}
                  className="bg-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-500"
                >
                  Submit Proof
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksScreen;
