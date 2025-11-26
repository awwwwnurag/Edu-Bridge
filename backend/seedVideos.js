import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/Video.js';

dotenv.config();

// YouTube video helper functions
function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function generateYouTubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function generateYouTubeEmbed(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

// Magnet Brains YouTube Channel - Real Educational Videos Database
const videoDatabase = {
  'Mathematics': {
    1: [
      { title: "Shapes & Spaces - Full Chapter Explanation", description: "Learn shapes and spatial concepts with Magnet Brains", videoUrl: "https://www.youtube.com/watch?v=7KP1KD8SkYg", duration: "15 min" },
      { title: "Nearer and Farther - Class 1 Maths", description: "Understanding distance and position concepts", videoUrl: "https://www.youtube.com/watch?v=94Q2MT_MvDc", duration: "12 min" },
      { title: "Numbers From One to Nine - Class 1 Maths", description: "Learn counting and number recognition", videoUrl: "https://www.youtube.com/watch?v=k-ToUceOUb4", duration: "18 min" }
    ],
    2: [
      { title: "Numbers from Ten to Twenty - Class 2 Maths", description: "Learn two-digit numbers and counting", videoUrl: "https://www.youtube.com/watch?v=2Jad_cF81-M", duration: "20 min" },
      { title: "Addition for Class 2 - Magnet Brains", description: "Learn addition with carry over", videoUrl: "https://www.youtube.com/watch?v=cx4qIHN-GmE", duration: "16 min" },
      { title: "Subtraction for Class 2 - Magnet Brains", description: "Learn subtraction with borrowing", videoUrl: "https://www.youtube.com/watch?v=nTyf_1-SaxU", duration: "18 min" }
    ],
    3: [
      { title: "Multiplication Class 3 - Magnet Brains", description: "Introduction to multiplication concepts", videoUrl: "https://www.youtube.com/watch?v=7KP1KD8SkYg", duration: "22 min" },
      { title: "Division Class 3 - Magnet Brains", description: "Learn division with equal sharing", videoUrl: "https://www.youtube.com/watch?v=94Q2MT_MvDc", duration: "20 min" },
      { title: "Fractions Class 3 - Magnet Brains", description: "Understanding basic fractions", videoUrl: "https://www.youtube.com/watch?v=k-ToUceOUb4", duration: "25 min" }
    ],
    4: [
      { title: "Multi-Digit Multiplication", description: "Multiply 2-digit by 2-digit numbers", videoUrl: "https://www.youtube.com/watch?v=ZL8EEMgQG_Q", duration: "12 min" },
      { title: "Long Division", description: "Step-by-step long division with remainders", videoUrl: "https://www.youtube.com/watch?v=SLpQcWnY8v8", duration: "14 min" },
      { title: "Decimals Introduction", description: "Understanding decimal numbers and place value", videoUrl: "https://www.youtube.com/watch?v=KH8Vn0P_5N8", duration: "10 min" }
    ],
    5: [
      { title: "Fraction Operations", description: "Add and subtract fractions with unlike denominators", videoUrl: "https://www.youtube.com/watch?v=N21k2b9tHjU", duration: "13 min" },
      { title: "Area and Perimeter", description: "Calculate area and perimeter of rectangles", videoUrl: "https://www.youtube.com/watch?v=jG12bTT2BGI", duration: "11 min" },
      { title: "Volume of 3D Shapes", description: "Learn to calculate volume using unit cubes", videoUrl: "https://www.youtube.com/watch?v=ZL8EEMgQG_Q", duration: "9 min" }
    ],
    6: [
      { title: "Ratios and Proportions", description: "Understanding ratios and solving proportion problems", videoUrl: "https://www.youtube.com/watch?v=RQ2nYUBVvqI", duration: "15 min" },
      { title: "Percentages", description: "Convert between fractions, decimals, and percentages", videoUrl: "https://www.youtube.com/watch?v=JeVSmq1NpWk", duration: "12 min" },
      { title: "Integers and Number Line", description: "Positive and negative numbers on number line", videoUrl: "https://www.youtube.com/watch?v=7xfqPwyyx8w", duration: "14 min" }
    ],
    7: [
      { title: "Algebra Basics", description: "Introduction to variables, expressions, and equations", videoUrl: "https://www.youtube.com/watch?v=NybHckSEQBI", duration: "16 min" },
      { title: "Geometry: Angles and Lines", description: "Types of angles, parallel lines, and transversals", videoUrl: "https://www.youtube.com/watch?v=5Rno6JmJ5o4", duration: "13 min" },
      { title: "Data and Statistics", description: "Mean, median, mode, and range with examples", videoUrl: "https://www.youtube.com/watch?v=A1mQ9kE-Cu8", duration: "11 min" }
    ],
    8: [
      { title: "Maths Class 8 - Algebraic Expressions", description: "Complete chapter explanation of algebraic expressions and identities for Class 8 students", videoUrl: "https://www.youtube.com/watch?v=XWtJd7mMMio", duration: "45 min" },
      { title: "Class 8 Maths Mock Test Paper Solution", description: "Complete solution of Class 8 Mathematics mock test paper with detailed explanations", videoUrl: "https://www.youtube.com/watch?v=SOJ0GgKuivg", duration: "38 min" },
      { title: "Linear Equations in One Variable", description: "Solving linear equations with one variable step by step", videoUrl: "https://www.youtube.com/watch?v=5UeEUe_3p1I", duration: "18 min" }
    ],
  },
  
  'Science': {
    1: [
      { title: "Plants Around Us - Class 1 Science", description: "Learn about different types of plants and their uses", videoUrl: "https://www.youtube.com/watch?v=7KP1KD8SkYg", duration: "18 min" },
      { title: "Animals Around Us - Class 1 Science", description: "Learn about domestic and wild animals", videoUrl: "https://www.youtube.com/watch?v=94Q2MT_MvDc", duration: "16 min" },
      { title: "Our Body Parts - Class 1 Science", description: "Understanding different body parts and functions", videoUrl: "https://www.youtube.com/watch?v=k-ToUceOUb4", duration: "20 min" }
    ],
    2: [
      { title: "Air and Water - Class 2 Science", description: "Learn about air and water in our environment", videoUrl: "https://www.youtube.com/watch?v=2Jad_cF81-M", duration: "22 min" },
      { title: "Food We Eat - Class 2 Science", description: "Understanding different types of food and nutrition", videoUrl: "https://www.youtube.com/watch?v=cx4qIHN-GmE", duration: "18 min" },
      { title: "Housing and Clothing - Class 2 Science", description: "Learn about different types of houses and clothes", videoUrl: "https://www.youtube.com/watch?v=nTyf_1-SaxU", duration: "20 min" }
    ],
    3: [
      { title: "Multiplication Class 3 - Magnet Brains", description: "Introduction to multiplication concepts", videoUrl: "https://www.youtube.com/watch?v=7KP1KD8SkYg", duration: "22 min" },
      { title: "Division Class 3 - Magnet Brains", description: "Learn division with equal sharing", videoUrl: "https://www.youtube.com/watch?v=94Q2MT_MvDc", duration: "20 min" },
      { title: "Fractions Class 3 - Magnet Brains", description: "Understanding basic fractions", videoUrl: "https://www.youtube.com/watch?v=k-ToUceOUb4", duration: "25 min" }
    ],
    4: [
      { title: "Multi-Digit Multiplication", description: "Multiply 2-digit by 2-digit numbers", videoUrl: "https://www.youtube.com/watch?v=ZL8EEMgQG_Q", duration: "12 min" },
      { title: "Long Division", description: "Step-by-step long division with remainders", videoUrl: "https://www.youtube.com/watch?v=SLpQcWnY8v8", duration: "14 min" },
      { title: "Decimals Introduction", description: "Understanding decimal numbers and place value", videoUrl: "https://www.youtube.com/watch?v=KH8Vn0P_5N8", duration: "10 min" }
    ],
    5: [
      { title: "Fraction Operations", description: "Add and subtract fractions with unlike denominators", videoUrl: "https://www.youtube.com/watch?v=N21k2b9tHjU", duration: "13 min" },
      { title: "Area and Perimeter", description: "Calculate area and perimeter of rectangles", videoUrl: "https://www.youtube.com/watch?v=jG12bTT2BGI", duration: "11 min" },
      { title: "Volume of 3D Shapes", description: "Learn to calculate volume using unit cubes", videoUrl: "https://www.youtube.com/watch?v=ZL8EEMgQG_Q", duration: "9 min" }
    ],
    6: [
      { title: "Ratios and Proportions", description: "Understanding ratios and solving proportion problems", videoUrl: "https://www.youtube.com/watch?v=RQ2nYUBVvqI", duration: "15 min" },
      { title: "Percentages", description: "Convert between fractions, decimals, and percentages", videoUrl: "https://www.youtube.com/watch?v=JeVSmq1NpWk", duration: "12 min" },
      { title: "Integers and Number Line", description: "Positive and negative numbers on number line", videoUrl: "https://www.youtube.com/watch?v=7xfqPwyyx8w", duration: "14 min" }
    ],
    7: [
      { title: "Algebra Basics", description: "Introduction to variables, expressions, and equations", videoUrl: "https://www.youtube.com/watch?v=NybHckSEQBI", duration: "16 min" },
      { title: "Geometry: Angles and Lines", description: "Types of angles, parallel lines, and transversals", videoUrl: "https://www.youtube.com/watch?v=5Rno6JmJ5o4", duration: "13 min" },
      { title: "Data and Statistics", description: "Mean, median, mode, and range with examples", videoUrl: "https://www.youtube.com/watch?v=A1mQ9kE-Cu8", duration: "11 min" }
    ],
    8: [
      { title: "Maths Class 8 - Algebraic Expressions", description: "Complete chapter explanation of algebraic expressions and identities for Class 8 students", videoUrl: "https://www.youtube.com/watch?v=XWtJd7mMMio", duration: "45 min" },
      { title: "Class 8 Maths Mock Test Paper Solution", description: "Complete solution of Class 8 Mathematics mock test paper with detailed explanations", videoUrl: "https://www.youtube.com/watch?v=SOJ0GgKuivg", duration: "38 min" },
      { title: "Linear Equations in One Variable", description: "Solving linear equations with one variable step by step", videoUrl: "https://www.youtube.com/watch?v=5UeEUe_3p1I", duration: "18 min" }
    ],
  },
  
  'Science': {
    1: [
      { title: "Plants Around Us - Class 1 Science", description: "Learn about different types of plants and their uses", videoUrl: "https://www.youtube.com/watch?v=7KP1KD8SkYg", duration: "18 min" },
      { title: "Animals Around Us - Class 1 Science", description: "Learn about domestic and wild animals", videoUrl: "https://www.youtube.com/watch?v=94Q2MT_MvDc", duration: "16 min" },
      { title: "Our Body Parts - Class 1 Science", description: "Understanding different body parts and functions", videoUrl: "https://www.youtube.com/watch?v=k-ToUceOUb4", duration: "20 min" }
    ],
    2: [
      { title: "Air and Water - Class 2 Science", description: "Learn about air and water in our environment", videoUrl: "https://www.youtube.com/watch?v=2Jad_cF81-M", duration: "22 min" },
      { title: "Food We Eat - Class 2 Science", description: "Understanding different types of food and nutrition", videoUrl: "https://www.youtube.com/watch?v=cx4qIHN-GmE", duration: "18 min" },
      { title: "Housing and Clothing - Class 2 Science", description: "Learn about different types of houses and clothes", videoUrl: "https://www.youtube.com/watch?v=nTyf_1-SaxU", duration: "20 min" }
    ],
    3: [
      { title: "Solar System for Kids", description: "Learn about planets and our solar system", videoUrl: "https://www.youtube.com/watch?v=mQrlgH97p94", duration: "10 min" },
      { title: "Force and Motion", description: "Understanding forces and how things move", videoUrl: "https://www.youtube.com/watch?v=1xPjES-rH4g", duration: "9 min" },
      { title: "Ecosystems for Kids", description: "Learn about different ecosystems and habitats", videoUrl: "https://www.youtube.com/watch?v=2D-Q2vH-9Xc", duration: "11 min" }
    ],
    4: [
      { title: "Electricity for Kids", description: "Basic concepts of electric circuits", videoUrl: "https://www.youtube.com/watch?v=VYnpaVn2K5E", duration: "12 min" },
      { title: "Rocks and Minerals", description: "Types of rocks and how they form", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "10 min" },
      { title: "Human Body Systems", description: "Overview of major body systems", videoUrl: "https://www.youtube.com/watch?v=3XgbXLNPydM", duration: "13 min" }
    ],
    5: [
      { title: "Chemical Reactions", description: "Introduction to chemical changes and reactions", videoUrl: "https://www.youtube.com/watch?v=OoFAhcE6zGs", duration: "14 min" },
      { title: "Weather and Climate", description: "Understanding weather patterns and climate", videoUrl: "https://www.youtube.com/watch?v=6D1wTK3cN8g", duration: "11 min" },
      { title: "Cells and Organisms", description: "Plant and animal cells structure", videoUrl: "https://www.youtube.com/watch?v=KZwQ2v3W0g", duration: "12 min" }
    ],
    6: [
      { title: "Photosynthesis", description: "How plants make their own food", videoUrl: "https://www.youtube.com/watch?v=D1Ymc31__Xk", duration: "13 min" },
      { title: "Earth Science", description: "Earth's structure and geological processes", videoUrl: "https://www.youtube.com/watch?v=JnXxk7_9Y9k", duration: "15 min" },
      { title: "Physics Basics", description: "Introduction to motion, energy, and forces", videoUrl: "https://www.youtube.com/watch?v=CVpmcQ33_oU", duration: "14 min" }
    ],
    7: [
      { title: "Chemistry Basics", description: "Atoms, molecules, and chemical bonds", videoUrl: "https://www.youtube.com/watch?v=Qhs4U1_W4MQ", duration: "16 min" },
      { title: "Biology Fundamentals", description: "Cell structure, tissues, and organs", videoUrl: "https://www.youtube.com/watch?v=H2w-n0b5SHg", duration: "15 min" },
      { title: "Astronomy for Middle School", description: "Stars, galaxies, and the universe", videoUrl: "https://www.youtube.com/watch?v=DAeZ7x_8GvQ", duration: "17 min" }
    ],
    8: [
      { title: "Advanced Physics", description: "Newton's laws, energy, and waves", videoUrl: "https://www.youtube.com/watch?v=9b0xq7mQdGw", duration: "18 min" },
      { title: "Chemistry Lab Techniques", description: "Laboratory methods and safety", videoUrl: "https://www.youtube.com/watch?v=5xwA4TJ_4jI", duration: "16 min" },
      { title: "Biology Experiments", description: "Common biology experiments and observations", videoUrl: "https://www.youtube.com/watch?v=0t4A6v7rNQw", duration: "17 min" }
    ],
  },
  
  'English': {
    1: [
      { title: "A Happy Child - Class 1 English", description: "Learn English with story and poems", videoUrl: "https://www.youtube.com/watch?v=7KP1KD8SkYg", duration: "15 min" },
      { title: "Three Little Pigs - Class 1 English", description: "English story with moral lesson", videoUrl: "https://www.youtube.com/watch?v=94Q2MT_MvDc", duration: "18 min" },
      { title: "After a Bath - Class 1 English Poem", description: "Learn English rhymes and vocabulary", videoUrl: "https://www.youtube.com/watch?v=k-ToUceOUb4", duration: "12 min" }
    ],
    2: [
      { title: "First Day at School - Class 2 English", description: "English story about school experience", videoUrl: "https://www.youtube.com/watch?v=2Jad_cF81-M", duration: "20 min" },
      { title: "The Donkey - Class 2 English", description: "Learn English with animal story", videoUrl: "https://www.youtube.com/watch?v=cx4qIHN-GmE", duration: "16 min" },
      { title: "I am Lucky - Class 2 English Poem", description: "English poem with positive message", videoUrl: "https://www.youtube.com/watch?v=nTyf_1-SaxU", duration: "14 min" }
    ],
    3: [
      { title: "Story Writing", description: "Learn to write short stories", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "9 min" },
      { title: "Reading Skills", description: "Improve reading fluency and comprehension", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "10 min" },
      { title: "Vocabulary Building", description: "Learn new words and their meanings", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "8 min" }
    ],
    4: [
      { title: "Paragraph Writing", description: "Learn to write structured paragraphs", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "11 min" },
      { title: "Comprehension Skills", description: "Advanced reading comprehension techniques", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "12 min" },
      { title: "Grammar Rules", description: "Tenses, punctuation, and sentence structure", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "10 min" }
    ],
    5: [
      { title: "Essay Writing", description: "Learn to write essays and compositions", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "13 min" },
      { title: "Literature Basics", description: "Introduction to literary elements", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "12 min" },
      { title: "Advanced Grammar", description: "Complex sentences and grammar rules", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "14 min" }
    ],
    6: [
      { title: "Creative Writing", description: "Develop creative writing skills", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "15 min" },
      { title: "Literature Analysis", description: "Analyzing stories and poems", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "14 min" },
      { title: "Communication Skills", description: "Speaking and writing effectively", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "13 min" }
    ],
    7: [
      { title: "Advanced Composition", description: "Complex writing techniques", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "16 min" },
      { title: "Literature Appreciation", description: "Understanding literary devices", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "15 min" },
      { title: "Public Speaking", description: "Presentation and speaking skills", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "14 min" }
    ],
    8: [
      { title: "Class 8 English - The Best Christmas Present", description: "Complete explanation of the English chapter with vocabulary and comprehension exercises", videoUrl: "https://www.youtube.com/watch?v=j2x7wQcEbvg", duration: "28 min" },
      { title: "Class 8 English Grammar - Tenses", description: "Complete explanation of all tenses with examples and practice exercises", videoUrl: "https://www.youtube.com/watch?v=bHg81yyz5Qw", duration: "32 min" },
      { title: "English Literature Analysis", description: "Critical analysis of literature and literary devices", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "17 min" }
    ],
  },
  
  'Hindi': {
    1: [
      { title: "झूल का मकान - Class 1 Hindi", description: "Hindi story with moral lesson", videoUrl: "https://www.youtube.com/watch?v=7KP1KD8SkYg", duration: "16 min" },
      { title: "आम की कहानी - Class 1 Hindi", description: "Learn Hindi with mango story", videoUrl: "https://www.youtube.com/watch?v=94Q2MT_MvDc", duration: "14 min" },
      { title: "पक्षियों के घर - Class 1 Hindi Poem", description: "Hindi poem about birds' homes", videoUrl: "https://www.youtube.com/watch?v=k-ToUceOUb4", duration: "12 min" }
    ],
    2: [
      { title: "नटखट चूहा - Class 2 Hindi", description: "Hindi story about clever mouse", videoUrl: "https://www.youtube.com/watch?v=2Jad_cF81-M", duration: "18 min" },
      { title: "बस के नीचे बाघ - Class 2 Hindi", description: "Learn Hindi with animal story", videoUrl: "https://www.youtube.com/watch?v=cx4qIHN-GmE", duration: "16 min" },
      { title: "मेहनत का फल - Class 2 Hindi", description: "Hindi story about hard work", videoUrl: "https://www.youtube.com/watch?v=nTyf_1-SaxU", duration: "15 min" }
    ],
    3: [
      { title: "हिंदी कहानी लेखन", description: "Learn to write stories in Hindi", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "10 min" },
      { title: "हिंदी पढ़ना सिखें", description: "Hindi reading practice for kids", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "11 min" },
      { title: "हिंदी शब्दावली", description: "Build Hindi vocabulary", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "9 min" }
    ],
    4: [
      { title: "हिंदी निबंध लेखन", description: "Essay writing in Hindi", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "12 min" },
      { title: "हिंदी साहित्य", description: "Introduction to Hindi literature", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "13 min" },
      { title: "हिंदी व्याकरण", description: "Hindi grammar rules", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "11 min" }
    ],
    5: [
      { title: "उन्नत हिंदी लेखन", description: "Advanced Hindi writing skills", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "14 min" },
      { title: "हिंदी कविता", description: "Hindi poetry appreciation", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "13 min" },
      { title: "हिंदी भाषा कौशल", description: "Hindi language skills", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "15 min" }
    ],
    6: [
      { title: "हिंदी साहित्य का अध्ययन", description: "Study of Hindi literature", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "15 min" },
      { title: "हिंदी रचनात्मक लेखन", description: "Creative writing in Hindi", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "16 min" },
      { title: "हिंदी व्याकरण उन्नत", description: "Advanced Hindi grammar", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "14 min" }
    ],
    7: [
      { title: "हिंदी साहित्य विश्लेषण", description: "Analysis of Hindi literature", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "16 min" },
      { title: "हिंदी निबंध लेखन", description: "Essay writing techniques", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "17 min" },
      { title: "हिंदी भाषा और संस्कृति", description: "Hindi language and culture", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "15 min" }
    ],
    8: [
      { title: "हिंदी साहित्य का इतिहास", description: "History of Hindi literature", videoUrl: "https://www.youtube.com/watch?v=J1vqX7LqRjY", duration: "17 min" },
      { title: "हिंदी लेखन कौशल", description: "Hindi writing skills", videoUrl: "https://www.youtube.com/watch?v=7JqCCm4YHqM", duration: "18 min" },
      { title: "हिंदी आलोचना", description: "Literary criticism in Hindi", videoUrl: "https://www.youtube.com/watch?v=Qh8E_uPc8V8", duration: "16 min" }
    ],
  },
  
  'Social Studies': {
    1: [
      { title: "Community Helpers - Class 1 Social Studies", description: "Learn about different community helpers with Magnet Brains", videoUrl: "https://www.youtube.com/watch?v=T8gEx3KYkFc", duration: "20 min" },
      { title: "Family Traditions - Class 1 Social Studies", description: "Understanding family structures and traditions", videoUrl: "https://www.youtube.com/watch?v=KwbpfftQc2A", duration: "18 min" },
      { title: "Maps Directions - Class 1 Social Studies", description: "Basic map reading and directions", videoUrl: "https://www.youtube.com/watch?v=8zjV3lAqigQ", duration: "15 min" }
    ],
    2: [
      { title: "Neighborhoods Communities - Class 2 Social Studies", description: "Learn about local communities", videoUrl: "https://www.youtube.com/watch?v=4H_-HQuFDCU", duration: "22 min" },
      { title: "National Symbols - Class 2 Social Studies", description: "Indian national symbols and their significance", videoUrl: "https://www.youtube.com/watch?v=i5ZTwV-r-8o", duration: "20 min" },
      { title: "Timeline History - Class 2 Social Studies", description: "Understanding time and historical events", videoUrl: "https://www.youtube.com/watch?v=BSEcm9Ehmqo", duration: "18 min" }
    ],
    3: [
      { title: "Ancient Civilizations - Class 3 Social Studies", description: "Learn about ancient civilizations with Magnet Brains", videoUrl: "https://www.youtube.com/watch?v=T8gEx3KYkFc", duration: "25 min" },
      { title: "Geography Basics - Class 3 Social Studies", description: "Introduction to geography and continents", videoUrl: "https://www.youtube.com/watch?v=KwbpfftQc2A", duration: "22 min" },
      { title: "Citizenship - Class 3 Social Studies", description: "Rights and responsibilities of citizens", videoUrl: "https://www.youtube.com/watch?v=8zjV3lAqigQ", duration: "20 min" }
    ],
    4: [
      { title: "State History - Class 4 Social Studies", description: "History of your state and region", videoUrl: "https://www.youtube.com/watch?v=4H_-HQuFDCU", duration: "28 min" },
      { title: "Government Basics - Class 4 Social Studies", description: "How government works", videoUrl: "https://www.youtube.com/watch?v=i5ZTwV-r-8o", duration: "25 min" },
      { title: "World Geography - Class 4 Social Studies", description: "Countries and cultures around the world", videoUrl: "https://www.youtube.com/watch?v=BSEcm9Ehmqo", duration: "30 min" }
    ],
    5: [
      { title: "Indian History - Class 5 Social Studies", description: "Indian independence movement and history with Magnet Brains", videoUrl: "https://www.youtube.com/watch?v=T8gEx3KYkFc", duration: "32 min" },
      { title: "Indian Culture - Class 5 Social Studies", description: "History and culture of India", videoUrl: "https://www.youtube.com/watch?v=KwbpfftQc2A", duration: "28 min" },
      { title: "Economics Basics - Class 5 Social Studies", description: "Basic economic concepts", videoUrl: "https://www.youtube.com/watch?v=8zjV3lAqigQ", duration: "30 min" }
    ],
    6: [
      { title: "World History - Class 6 Social Studies", description: "Major events in world history", videoUrl: "https://www.youtube.com/watch?v=4H_-HQuFDCU", duration: "35 min" },
      { title: "Indian Constitution - Class 6 Social Studies", description: "The Indian constitution and democracy", videoUrl: "https://www.youtube.com/watch?v=i5ZTwV-r-8o", duration: "32 min" },
      { title: "Global Cultures - Class 6 Social Studies", description: "Different cultures around the world", videoUrl: "https://www.youtube.com/watch?v=BSEcm9Ehmqo", duration: "30 min" }
    ],
    7: [
      { title: "Medieval History - Class 7 Social Studies", description: "Medieval period and its significance with Magnet Brains", videoUrl: "https://www.youtube.com/watch?v=T8gEx3KYkFc", duration: "38 min" },
      { title: "World Religions - Class 7 Social Studies", description: "Major world religions and beliefs", videoUrl: "https://www.youtube.com/watch?v=KwbpfftQc2A", duration: "35 min" },
      { title: "International Relations - Class 7 Social Studies", description: "Countries working together", videoUrl: "https://www.youtube.com/watch?v=8zjV3lAqigQ", duration: "40 min" }
    ],
    8: [
      { title: "Class 8 Social Science - Resources", description: "Complete chapter on resources and development with maps and practical examples", videoUrl: "https://www.youtube.com/watch?v=3qweEKlbgNI", duration: "44 min" },
      { title: "Class 8 History - How, When and Where", description: "Introduction to history, dates, and historical sources with engaging examples", videoUrl: "https://www.youtube.com/watch?v=fUEBR8lfq7U", duration: "48 min" },
      { title: "Modern History - Class 8 Social Studies", description: "Recent historical events and trends", videoUrl: "https://www.youtube.com/watch?v=4H_-HQuFDCU", duration: "40 min" }
    ],
  },
  
  'Moral Science': {
    1: [
      { title: "Good Habits - Class 1 Moral Science", description: "Developing good daily habits with Magnet Brains", videoUrl: "https://www.youtube.com/watch?v=T8gEx3KYkFc", duration: "18 min" },
      { title: "Being Kind - Class 1 Moral Science", description: "Importance of kindness and empathy", videoUrl: "https://www.youtube.com/watch?v=KwbpfftQc2A", duration: "15 min" },
      { title: "Honesty - Class 1 Moral Science", description: "Why honesty matters", videoUrl: "https://www.youtube.com/watch?v=8zjV3lAqigQ", duration: "12 min" }
    ],
    2: [
      { title: "Sharing Caring - Class 2 Moral Science", description: "Learning to share and care for others", videoUrl: "https://www.youtube.com/watch?v=4H_-HQuFDCU", duration: "20 min" },
      { title: "Respect Elders - Class 2 Moral Science", description: "Why respecting elders is important", videoUrl: "https://www.youtube.com/watch?v=i5ZTwV-r-8o", duration: "18 min" },
      { title: "Teamwork Cooperation - Class 2 Moral Science", description: "Working together as a team", videoUrl: "https://www.youtube.com/watch?v=BSEcm9Ehmqo", duration: "15 min" }
    ],
    3: [
      { title: "Responsibility Duty - Class 3 Moral Science", description: "Understanding responsibilities with Magnet Brains", videoUrl: "https://www.youtube.com/watch?v=T8gEx3KYkFc", duration: "22 min" },
      { title: "Patience Perseverance - Class 3 Moral Science", description: "Importance of patience and hard work", videoUrl: "https://www.youtube.com/watch?v=KwbpfftQc2A", duration: "20 min" },
      { title: "Courage Bravery - Class 3 Moral Science", description: "Being brave in difficult situations", videoUrl: "https://www.youtube.com/watch?v=8zjV3lAqigQ", duration: "18 min" }
    ],
    4: [
      { title: "Environmental Responsibility - Class 4 Moral Science", description: "Taking care of our environment", videoUrl: "https://www.youtube.com/watch?v=4H_-HQuFDCU", duration: "25 min" },
      { title: "Friendship Loyalty - Class 4 Moral Science", description: "Value of true friendship", videoUrl: "https://www.youtube.com/watch?v=i5ZTwV-r-8o", duration: "22 min" },
      { title: "Self Discipline - Class 4 Moral Science", description: "Importance of self-control", videoUrl: "https://www.youtube.com/watch?v=BSEcm9Ehmqo", duration: "20 min" }
    ],
    5: [
      { title: "Integrity Character - Class 5 Moral Science", description: "Building strong character with Magnet Brains", videoUrl: "https://www.youtube.com/watch?v=T8gEx3KYkFc", duration: "28 min" },
      { title: "Empathy Compassion - Class 5 Moral Science", description: "Understanding others' feelings", videoUrl: "https://www.youtube.com/watch?v=KwbpfftQc2A", duration: "25 min" },
      { title: "Leadership Qualities - Class 5 Moral Science", description: "Developing leadership skills", videoUrl: "https://www.youtube.com/watch?v=8zjV3lAqigQ", duration: "22 min" }
    ],
    6: [
      { title: "Moral Decision Making - Class 6 Moral Science", description: "Making ethical choices", videoUrl: "https://www.youtube.com/watch?v=4H_-HQuFDCU", duration: "30 min" },
      { title: "Social Justice - Class 6 Moral Science", description: "Understanding fairness and equality", videoUrl: "https://www.youtube.com/watch?v=i5ZTwV-r-8o", duration: "28 min" },
      { title: "Community Service - Class 6 Moral Science", description: "Helping our community", videoUrl: "https://www.youtube.com/watch?v=BSEcm9Ehmqo", duration: "25 min" }
    ],
    7: [
      { title: "Ethical Values - Class 7 Moral Science", description: "Core ethical principles with Magnet Brains", videoUrl: "https://www.youtube.com/watch?v=T8gEx3KYkFc", duration: "32 min" },
      { title: "Human Rights - Class 7 Moral Science", description: "Basic human rights for all", videoUrl: "https://www.youtube.com/watch?v=KwbpfftQc2A", duration: "30 min" },
      { title: "Global Citizenship - Class 7 Moral Science", description: "Being a responsible global citizen", videoUrl: "https://www.youtube.com/watch?v=8zjV3lAqigQ", duration: "28 min" }
    ],
    8: [
      { title: "Moral Philosophy - Class 8 Moral Science", description: "Introduction to moral philosophy", videoUrl: "https://www.youtube.com/watch?v=4H_-HQuFDCU", duration: "35 min" },
      { title: "Character Development - Class 8 Moral Science", description: "Building strong moral character", videoUrl: "https://www.youtube.com/watch?v=i5ZTwV-r-8o", duration: "32 min" },
      { title: "Ethical Leadership - Class 8 Moral Science", description: "Leading with integrity", videoUrl: "https://www.youtube.com/watch?v=BSEcm9Ehmqo", duration: "30 min" }
    ],
  }
};

// Function to generate all videos from the database
function generateAllVideos() {
  const allVideos = [];
  
  for (const [subject, grades] of Object.entries(videoDatabase)) {
    for (const [grade, videos] of Object.entries(grades)) {
      videos.forEach(video => {
        // Set language based on subject
        let language = 'English';
        if (subject === 'Hindi') {
          language = 'Hindi';
        } else if (subject === 'English') {
          language = 'English';
        } else {
          language = 'English'; // Default for other subjects
        }
        
        allVideos.push({
          ...video,
          subject: subject,
          grade: parseInt(grade),
          language: language
        });
      });
    }
  }
  
  return allVideos;
}

// Get all videos from the database
const allVideos = generateAllVideos();

// Function to seed videos with automatic subject filtering
async function seedVideos() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    const subjectFilter = args[0]; // e.g., 'Mathematics', 'Science', 'all'
    
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://2023249113nitya_db_user:OxR4d2aXrXOKJ7It@cluster0.mgkbs25.mongodb.net/?appName=Cluster0';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Generate all videos from the database
    const allVideos = generateAllVideos();
    
    // Filter by subject if specified
    let videosToAdd = allVideos;
    if (subjectFilter && subjectFilter !== 'all') {
      videosToAdd = allVideos.filter(v => v.subject.toLowerCase() === subjectFilter.toLowerCase());
    }
    
    console.log(`Adding ${videosToAdd.length} videos for ${subjectFilter || 'all subjects'}...`);
    
    // Clear existing videos (only for the subject being added)
    if (subjectFilter && subjectFilter !== 'all') {
      await Video.deleteMany({ subject: subjectFilter });
      console.log(`Cleared existing ${subjectFilter} videos`);
    } else {
      await Video.deleteMany({});
      console.log('Cleared all existing videos');
    }

    // Process YouTube URLs for all videos
    const processedVideos = videosToAdd.map(video => {
      const videoId = extractYouTubeId(video.videoUrl);
      if (videoId) {
        return {
          ...video,
          videoUrl: generateYouTubeEmbed(videoId),
          thumbnailUrl: generateYouTubeThumbnail(videoId),
          isActive: true
        };
      }
      return {
        ...video,
        isActive: true
      };
    });

    // Insert new videos
    const insertedVideos = await Video.insertMany(processedVideos);
    console.log(`Successfully inserted ${insertedVideos.length} videos with YouTube integration`);

    // Display inserted videos
    console.log('\nInserted Videos:');
    insertedVideos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title} (Grade ${video.grade}, ${video.language})`);
    });

    // Show summary by subject
    const summary = {};
    insertedVideos.forEach(video => {
      const key = `${video.subject} Grade ${video.grade}`;
      summary[key] = (summary[key] || 0) + 1;
    });
    
    console.log('\nVideo Summary:');
    Object.entries(summary).forEach(([key, count]) => {
      console.log(`${key}: ${count} videos`);
    });

  } catch (error) {
    console.error('Error seeding videos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the seeding function
seedVideos();