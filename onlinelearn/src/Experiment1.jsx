import { Link } from "react-router-dom";

export const COURSES = [
  {
    id: 1,
    title: "Cyber Security",
    category: "Security",
    level: "Beginner",
    instructor: "John Smith",
    duration: "4 Weeks",
    weeks: 4,
    description: "Learn the fundamentals of cyber security, threats and protection techniques.",
    materials: [
      "Introduction to Cyber Security",
      "CIA Triad",
      "Authentication & Authorization",
      "Network Security",
    ],
  },
  {
    id: 2,
    title: "React Fundamentals",
    category: "Web",
    level: "Beginner",
    instructor: "David Kumar",
    duration: "5 Weeks",
    weeks: 5,
    description: "Learn React components, props, state, hooks and routing.",
    materials: [
      "React Components",
      "Props and State",
      "React Hooks",
      "React Router",
    ],
  },
  {
    id: 3,
    title: "Python Programming",
    category: "Backend",
    level: "Intermediate",
    instructor: "Priya Sharma",
    duration: "6 Weeks",
    weeks: 6,
    description: "Learn Python programming from basics to advanced concepts.",
    materials: [
      "Python Basics",
      "Functions",
      "Lists and Dictionaries",
      "Object Oriented Programming",
    ],
  },
];

export const QUIZ = [
  {
    q: "What does CIA stand for in Cyber Security?",
    options: [
      "Confidentiality, Integrity, Availability",
      "Computer, Internet, Access",
      "Control, Information, Authentication",
    ],
    answer: 0,
  },
  {
    q: "Which language is used to build React applications?",
    options: [
      "JavaScript",
      "SQL",
      "C",
    ],
    answer: 0,
  },
  {
    q: "Which keyword is used to define a function in Python?",
    options: [
      "function",
      "def",
      "func",
    ],
    answer: 1,
  },
];

export function Home() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white min-h-screen">

      <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">

        <span className="inline-block bg-white/15 border border-white/30 text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-full">
          Online Learning Platform
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold mt-7 leading-tight">
          Learn new skills
          <br />
          <span className="text-yellow-200">
            anytime, anywhere
          </span>
        </h1>

        <p className="mt-6 text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto">
          Expert-led courses, quizzes, assignments and certificates —
          all in one place.
        </p>

        <div className="mt-10">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition"
          >
            Browse Courses →
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 max-w-xl mx-auto border-t border-white/20 pt-8">

          <div>
            <p className="text-3xl font-bold">
              {COURSES.length}+
            </p>
            <p className="text-sm text-indigo-100">
              Courses
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold">
              100%
            </p>
            <p className="text-sm text-indigo-100">
              Online
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold">
              🎓
            </p>
            <p className="text-sm text-indigo-100">
              Certified
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}


export function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        const apiCourses = data.slice(0, 3).map((item, index) => ({
          ...COURSES[index],
          id: item.id,
          title: COURSES[index].title,
          description: item.body,
        }));

        setCourses(apiCourses);
      } catch (err) {
        setError("Unable to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || course.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 p-10 text-center">
        <h2 className="text-xl font-bold">Loading courses...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen p-10 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Explore Our Courses
          </h1>
          <p className="text-gray-600 mt-3">
            Choose a course and start learning today.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 border rounded-lg px-4 py-3"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-4 py-3"
          >
            <option value="All">All Categories</option>
            <option value="Security">Security</option>
            <option value="Web">Web</option>
            <option value="Backend">Backend</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-4">
                {course.category === "Security"
                  ? "🔐"
                  : course.category === "Web"
                  ? "⚛️"
                  : "🐍"}
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {course.title}
              </h2>

              <p className="text-gray-600 text-sm mt-3">
                {course.description}
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
                  {course.category}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  {course.level}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                ⏱ {course.duration}
              </p>

              <Link
                to={`/exp3/course/${course.id}`}
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold mt-4"
              >
                View Course
              </Link>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No courses found.
          </p>
        )}
      </div>
    </section>
  );
}

export default function Experiment1() {
  return <Home />;
}