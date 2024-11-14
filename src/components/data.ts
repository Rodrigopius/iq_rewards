// Importing JSON files
import entertainment from '../components/trivia_quetions/entertainment.json';
import foods from '../components/trivia_quetions/foods.json';
import general_Knowledge from '../components/trivia_quetions/general_Knowledge.json';
import geography from '../components/trivia_quetions/geography.json';
import history from '../components/trivia_quetions/history.json';
import literature from '../components/trivia_quetions/literature.json';
import sports from '../components/trivia_quetions/sports.json';
import science from '../components/trivia_quetions/science.json';

// Assuming the structure of the JSON is an array of questions (Question[])
type Question = {
  question: string;
  correctAnswer: string;
  options: string[];
  // Add more properties depending on your data structure
};

// Typing each category as an array of questions
const questionsData: Record<string, Question[]> = {
  general_Knowledge,
  science,
  history,
  geography,
  sports,
  entertainment,
  foods,
  literature,
};

export default questionsData;
