import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export const QUIZ = [
  {
    q: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Tool Multi Language",
      "Home Text Markup Language",
    ],
    answer: 0,
  },
  {
    q: "Which language is mainly used for React?",
    options: [
      "Python",
      "JavaScript",
      "C++",
      "Java",
    ],
    answer: 1,
  },
  {
    q: "Which one is a frontend library?",
    options: [
      "React",
      "MySQL",
      "MongoDB",
      "Node Database",
    ],
    answer: 0,
  },
  {
    q: "Which language is commonly used for data analysis?",
    options: [
      "Python",
      "HTML",
      "CSS",
      "XML",
    ],
    answer: 0,
  },
  {
    q: "What is CSS used for?",
    options: [
      "Styling web pages",
      "Managing databases",
      "Creating servers",
      "Operating systems",
    ],
    answer: 0,
  },
];

export const COURSES = [
  {
    id: 1,
    title: "React Fundamentals",
    category: "Web",
    level: "Beginner",
    difficulty: "Beginner",
    duration: "4 weeks",
    weeks: 4,
    instructor: "John Smith",
    description:
      "Learn the fundamentals of React and build modern web applications.",
    materials: [
      "Introduction to React",
      "Components",
      "Props",
      "State",
      "React Hooks",
    ],
    progress: 0,
  },
  {
    id: 2,
    title: "Cyber Security Basics",
    category: "Backend",
    level: "Beginner",
    difficulty: "Beginner",
    duration: "6 weeks",
    weeks: 6,
    instructor: "David Kumar",
    description:
      "Learn the basic concepts of cyber security and network protection.",
    materials: [
      "CIA Triad",
      "Authentication",
      "Authorization",
      "Firewalls",
      "Network Security",
    ],
    progress: 0,
  },
  {
    id: 3,
    title: "Python Programming",
    category: "Backend",
    level: "Intermediate",
    difficulty: "Intermediate",
    duration: "5 weeks",
    weeks: 5,
    instructor: "Sarah Lee",
    description:
      "Learn Python programming from basics to intermediate concepts.",
    materials: [
      "Python Basics",
      "Variables",
      "Functions",
      "Lists",
      "Object Oriented Programming",
    ],
    progress: 0,
  },
  {
    id: 4,
    title: "Advanced Web Development",
    category: "Web",
    level: "Intermediate",
    difficulty: "Advanced",
    duration: "8 weeks",
    weeks: 8,
    instructor: "Michael Brown",
    description:
      "Build advanced and responsive web applications using modern technologies.",
    materials: [
      "Advanced React",
      "API Integration",
      "Authentication",
      "State Management",
      "Deployment",
    ],
    progress: 0,
  },
  {
    id: 5,
    title: "Data Science Fundamentals",
    category: "Data",
    level: "Beginner",
    difficulty: "Beginner",
    duration: "4 weeks",
    weeks: 4,
    instructor: "Emily Wilson",
    description:
      "Learn the fundamentals of data science and data analysis.",
    materials: [
      "Introduction to Data Science",
      "NumPy",
      "Pandas",
      "Data Visualization",
      "Basic Analysis",
    ],
    progress: 0,
  },
];

export default function Experiment1({ startView = "home" }) {
  const [view, setView] = useState(startView);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const searchMatch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(search.toLowerCase());

      const categoryMatch =
        category === "All" || course.category === category;

      const levelMatch =
        level === "All" || course.level === level;

      const difficultyMatch =
        difficulty === "All" || course.difficulty === difficulty;

      return (
        searchMatch &&
        categoryMatch &&
        levelMatch &&
        difficultyMatch
      );
    });
  }, [search, category, level, difficulty]);

  const categories = [
    "All",
    ...new Set(COURSES.map((course) => course.category)),
  ];

  const levels = [
    "All",
    ...new Set(COURSES.map((course) => course.level)),
  ];

  const difficulties = [
    "All",
    ...new Set(COURSES.map((course) => course.difficulty)),
  ];

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-indigo-600 text-white px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
              🎓 E-Learning
            </Link>

            <button
              onClick={() => setSelectedCourse(null)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg"
            >
              ← Back to Courses
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <span className="text-indigo-600 font-semibold">
              {selectedCourse.category}
            </span>

            <h1 className="text-4xl font-bold mt-3">
              {selectedCourse.title}
            </h1>

            <p className="text-gray-600 mt-3">
              Instructor: {selectedCourse.instructor}
            </p>

            <p className="text-gray-600 mt-4">
              {selectedCourse.description}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-indigo-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">
                  Difficulty
                </p>
                <p className="font-bold mt-1">
                  {selectedCourse.difficulty}
                </p>
              </div>

              <div className="bg-purple-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">
                  Duration
                </p>
                <p className="font-bold mt-1">
                  {selectedCourse.duration}
                </p>
              </div>

              <div className="bg-pink-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">
                  Progress
                </p>
                <p className="font-bold mt-1">
                  {selectedCourse.progress}%
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold mt-8">
              Course Materials
            </h2>

            <ul className="list-disc ml-6 mt-3 space-y-2">
              {selectedCourse.materials.map((material) => (
                <li key={material}>{material}</li>
              ))}
            </ul>

            <button
              onClick={() =>
                alert("Course enrolled successfully!")
              }
              className="mt-8 bg-indigo-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-indigo-700"
            >
              Enroll Now
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-indigo-600 text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            🎓 E-Learning
          </Link>

          <nav className="flex gap-5 text-sm">
            <Link
              to="/"
              className="hover:text-yellow-200"
            >
              Home
            </Link>

            <button
              onClick={() => setView("courses")}
              className="hover:text-yellow-200"
            >
              Courses
            </button>

            <button
              onClick={() => setView("dashboard")}
              className="hover:text-yellow-200"
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* Home */}
      {view === "home" && (
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
          <div className="max-w-5xl mx-auto px-6 py-28 text-center">

            <span className="inline-block bg-white/15 border border-white/30 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase">
              Online Learning Platform
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold mt-7">
              Learn new skills
              <br />
              <span className="text-yellow-200">
                anytime, anywhere
              </span>
            </h1>

            <p className="mt-6 text-lg text-indigo-100 max-w-2xl mx-auto">
              Expert-led courses, quizzes, assignments and certificates —
              all in one place.
            </p>

            <button
              onClick={() => setView("courses")}
              className="mt-10 bg-white text-indigo-700 px-8 py-4 rounded-full font-bold shadow-lg hover:-translate-y-1 transition"
            >
              Browse Courses →
            </button>

            <div className="mt-16 grid grid-cols-3 max-w-xl mx-auto border-t border-white/20 pt-8">

              <div>
                <p className="text-3xl font-bold">
                  {COURSES.length}+
                </p>
                <p className="text-sm">Courses</p>
              </div>

              <div>
                <p className="text-3xl font-bold">
                  100%
                </p>
                <p className="text-sm">Online</p>
              </div>

              <div>
                <p className="text-3xl font-bold">
                  🎓
                </p>
                <p className="text-sm">Certified</p>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Courses */}
      {view === "courses" && (
        <main className="max-w-6xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Explore Courses
              </h1>

              <p className="text-gray-500 mt-1">
                Choose a course and start learning.
              </p>
            </div>

            <button
              onClick={() => setView("home")}
              className="text-indigo-600 font-semibold"
            >
              ← Back Home
            </button>
          </div>

          {/* Search + Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 grid md:grid-cols-4 gap-4">

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-xl px-4 py-3"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="border rounded-xl px-4 py-3"
            >
              {levels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border rounded-xl px-4 py-3"
            >
              {difficulties.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

          </div>

          {/* Course Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden"
              >

                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-5xl">
                    📚
                  </span>
                </div>

                <div className="p-6">

                  <span className="text-xs font-semibold text-indigo-600">
                    {course.category}
                  </span>

                  <h2 className="text-xl font-bold mt-2">
                    {course.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    By {course.instructor}
                  </p>

                  <div className="flex justify-between text-sm text-gray-500 mt-5">
                    <span>
                      {course.level}
                    </span>

                    <span>
                      {course.duration}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full mt-5 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700"
                  >
                    View Course
                  </button>

                </div>
              </div>
            ))}

          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No courses found.
            </div>
          )}

        </main>
      )}

      {/* Dashboard */}
      {view === "dashboard" && (
        <main className="max-w-6xl mx-auto px-6 py-12">

          <h1 className="text-3xl font-bold">
            Learning Dashboard
          </h1>

          <div className="grid md:grid-cols-3 gap-6 mt-8">

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <p className="text-gray-500">
                Enrolled Courses
              </p>

              <p className="text-3xl font-bold mt-2">
                0
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <p className="text-gray-500">
                Completed
              </p>

              <p className="text-3xl font-bold mt-2">
                0
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <p className="text-gray-500">
                Certificates
              </p>

              <p className="text-3xl font-bold mt-2">
                0
              </p>
            </div>

          </div>

          <button
            onClick={() => setView("courses")}
            className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            Browse Courses
          </button>

        </main>
      )}

      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        © 2026 E-Learning Platform
      </footer>

    </div>
  );
}