import { AnalogyQuestion } from '../types';

// Mock data for development - in production, this would load from actual JSONL files
const mockQuestions: AnalogyQuestion[] = [
  {
    original_pair: ["לדובב", "לדבר"] as [string, string],
    option_1: ["ללמוד", "לדעת"] as [string, string],
    option_2: ["להבטיח", "לקיים"] as [string, string],
    option_3: ["לנקום", "לפגוע"] as [string, string],
    option_4: ["להאיץ", "להזדרז"] as [string, string],
    correct_answer: 4 as 1 | 2 | 3 | 4,
    difficulty: 1 as 1 | 2 | 3 | 4 | 5 | 6,
    explanation: "",
    chat_example: [],
    item_id: "2013_apr_sec1_q1"
  },
  {
    original_pair: ["זֵר", "שָזַר"] as [string, string],
    option_1: ["עֵרמה", "גיבב"] as [string, string],
    option_2: ["צמר", "גזז"] as [string, string],
    option_3: ["כיכר", "ּפַָרס"] as [string, string],
    option_4: ["מסמר", "מִסמר"] as [string, string],
    correct_answer: 1 as 1 | 2 | 3 | 4,
    difficulty: 2 as 1 | 2 | 3 | 4 | 5 | 6,
    explanation: "",
    chat_example: [],
    item_id: "2013_apr_sec1_q2"
  },
  {
    original_pair: ["אכיפת החוק", "עבריינות"] as [string, string],
    option_1: ["זינוק", "ריצה"] as [string, string],
    option_2: ["אטימה", "חדירה"] as [string, string],
    option_3: ["התמכרות", "תלות"] as [string, string],
    option_4: ["שתלטנות", "צייתנות"] as [string, string],
    correct_answer: 2 as 1 | 2 | 3 | 4,
    difficulty: 3 as 1 | 2 | 3 | 4 | 5 | 6,
    explanation: "",
    chat_example: [],
    item_id: "2013_apr_sec1_q3"
  },
  {
    original_pair: ["משוער", "ודאי"] as [string, string],
    option_1: ["מחַפה", "חשוף"] as [string, string],
    option_2: ["חלקי", "ממצה"] as [string, string],
    option_3: ["מנותץ", "שביר"] as [string, string],
    option_4: ["מבואר", "ברור"] as [string, string],
    correct_answer: 2 as 1 | 2 | 3 | 4,
    difficulty: 4 as 1 | 2 | 3 | 4 | 5 | 6,
    explanation: "",
    chat_example: [],
    item_id: "2013_apr_sec1_q4"
  },
  {
    original_pair: ["גינה", "אחו"] as [string, string],
    option_1: ["ברכת שחייה", "אגם"] as [string, string],
    option_2: ["מדרגות נעות", "מעלית"] as [string, string],
    option_3: ["מׂשואה", "לפיד"] as [string, string],
    option_4: ["מעדר", "דחפור"] as [string, string],
    correct_answer: 1 as 1 | 2 | 3 | 4,
    difficulty: 5 as 1 | 2 | 3 | 4 | 5 | 6,
    explanation: "",
    chat_example: [],
    item_id: "2013_apr_sec1_q5"
  },
  {
    original_pair: ["לא שזפתו עין", "ראה"] as [string, string],
    option_1: ["דרך הישר", "חָטא"] as [string, string],
    option_2: ["בית מרפא", "חלה"] as [string, string],
    option_3: ["שדה בור", "חרש"] as [string, string],
    option_4: ["עיר רפאים", "נטש"] as [string, string],
    correct_answer: 3 as 1 | 2 | 3 | 4,
    difficulty: 6 as 1 | 2 | 3 | 4 | 5 | 6,
    explanation: "",
    chat_example: [],
    item_id: "2013_apr_sec1_q6"
  }
];

export const loadQuestionsFromFiles = async (): Promise<AnalogyQuestion[]> => {
  try {
    console.log('Loading questions from JSONL files...');
    
    // List of all JSONL files to load
    const jsonlFiles = [
      '2013_apr_questions_completed.jsonl',
      '2013_dec_questions_completed.jsonl',
      '2013_feb_questions_completed.jsonl',
      '2013_jul_questions_completed.jsonl',
      '2013_sep_questions_completed.jsonl',
      '2014_apr_questions_completed.jsonl',
      '2014_dec_questions_completed.jsonl',
      '2014_feb_questions_completed.jsonl',
      '2014_jul_questions_completed.jsonl',
      '2014_oct_questions_completed.jsonl',
      '2015_apr_questions_completed.jsonl',
      '2015_dec_questions_completed.jsonl',
      '2015_feb_questions_completed.jsonl',
      '2015_jul_questions_completed.jsonl',
      '2015_sep_questions_completed.jsonl',
      '2016_apr_questions_completed.jsonl',
      '2016_dec_questions_completed.jsonl',
      '2016_feb_questions_completed.jsonl',
      '2016_jul_questions_completed.jsonl',
      '2016_sep_questions_completed.jsonl',
      '2017_apr_questions_completed.jsonl',
      '2017_dec_questions_completed.jsonl',
      '2017_feb_questions_completed.jsonl',
      '2017_jul_questions_completed.jsonl',
      '2017_sep_questions_completed.jsonl',
      '2018_spring_questions_completed.jsonl',
      '2018_summer_questions_completed.jsonl',
      '2018_winter_questions_completed.jsonl',
      '2019_autumn_questions_completed.jsonl',
      '2019_spring_questions_completed.jsonl',
      '2019_summer_questions_completed.jsonl',
      '2019_winter_questions_completed.jsonl',
      '2020_autumn_questions_completed.jsonl',
      '2020_spring_questions_completed.jsonl',
      '2020_summer_questions_completed.jsonl',
      '2020_winter_questions_completed.jsonl',
      '2021_autumn_questions_completed.jsonl',
      '2021_spring_questions_completed.jsonl',
      '2021_summer_questions_completed.jsonl',
      '2021_winter_questions_completed.jsonl',
      '2022_autumn_questions_completed.jsonl',
      '2022_spring_questions_completed.jsonl',
      '2022_summer_questions_completed.jsonl',
      '2022_winter_questions_completed.jsonl',
      '2023_autumn_questions_completed.jsonl',
      '2023_spring_questions_completed.jsonl',
      '2023_summer_questions_completed.jsonl',
      '2023_winter_questions_completed.jsonl',
      '2024_autumn_questions_completed.jsonl',
      '2024_spring_questions_completed.jsonl',
      '2024_summer_questions_completed.jsonl',
      '2024_winter_questions_completed.jsonl',
      '2025_spring_questions_completed.jsonl',
      '2025_summer_questions_completed.jsonl'
    ];

    const allQuestions: AnalogyQuestion[] = [];

    // Load each JSONL file
    for (const filename of jsonlFiles) {
      try {
        const response = await fetch(`/analogies_completed_items/${filename}`);
        if (!response.ok) {
          console.warn(`Could not load ${filename}: ${response.statusText}`);
          continue;
        }
        
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const question = JSON.parse(line) as AnalogyQuestion;
              // Validate the question structure
              if (question.original_pair && question.option_1 && question.option_2 && 
                  question.option_3 && question.option_4 && question.correct_answer && 
                  question.difficulty && question.item_id) {
                allQuestions.push(question);
              } else {
                console.warn(`Invalid question structure in ${filename}:`, question);
              }
            } catch (parseError) {
              console.warn(`Error parsing line in ${filename}:`, parseError);
            }
          }
        }
        
        console.log(`Loaded ${lines.length} questions from ${filename}`);
      } catch (fileError) {
        console.warn(`Error loading ${filename}:`, fileError);
      }
    }

    console.log(`Total questions loaded: ${allQuestions.length}`);
    console.log('Questions by difficulty:', allQuestions.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number }));
    
    // If no questions were loaded, fallback to mock data
    if (allQuestions.length === 0) {
      console.warn('No questions loaded from files, using mock data');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockQuestions);
        }, 500);
      });
    }
    
    // Simulate loading delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(allQuestions);
      }, 500);
    });
  } catch (error) {
    console.error('Error loading questions:', error);
    // Fallback to mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockQuestions);
      }, 500);
    });
  }
};

export const preprocessQuestionsByDifficulty = (questions: AnalogyQuestion[]) => {
  const questionsByDifficulty: { [key: number]: AnalogyQuestion[] } = {};
  
  // Initialize difficulty levels
  for (let i = 1; i <= 6; i++) {
    questionsByDifficulty[i] = [];
  }
  
  // Group questions by difficulty
  questions.forEach(question => {
    questionsByDifficulty[question.difficulty].push(question);
  });
  
  // Shuffle questions within each difficulty level
  Object.keys(questionsByDifficulty).forEach(difficulty => {
    const level = parseInt(difficulty);
    questionsByDifficulty[level] = shuffleArray(questionsByDifficulty[level]);
  });
  
  return questionsByDifficulty;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomQuestion = (questionsByDifficulty: { [key: number]: AnalogyQuestion[] }, difficulty: number): AnalogyQuestion | null => {
  const questions = questionsByDifficulty[difficulty];
  if (!questions || questions.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};
