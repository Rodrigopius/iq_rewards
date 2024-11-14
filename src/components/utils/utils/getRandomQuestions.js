import questionsData from '../../data'; // Updated import statement

export const getRandomQuestions = async (category) => {
  const categoryQuestions = questionsData[category]; // Access the questions for the category
  const shuffledQuestions = categoryQuestions.sort(() => 0.5 - Math.random());
  return shuffledQuestions.slice(0, 5); // Return 5 random questions
};
