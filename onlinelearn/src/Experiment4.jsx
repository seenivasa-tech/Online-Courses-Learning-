import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

/* COURSE DATA */

export const COURSES = [
  {
    id: "cyber-security",
    title: "Cyber Security",
    category: "Cyber Security",
    description:
      "Learn network security, CIA Triad, ethical hacking and cybersecurity basics.",
    level: "Beginner",
    duration: "6 Weeks",
    instructor: "Arun Kumar",
    materials: [
      "CIA Triad",
      "Network Security",
      "Ethical Hacking",
      "Firewalls",
      "Phishing Awareness",
    ],
  },
  {
    id: "react",
    title: "React Fundamentals",
    category: "Web Development",
    description:
      "Learn React components, props, hooks, routing and web development.",
    level: "Beginner",
    duration: "5 Weeks",
    instructor: "Priya Sharma",
    materials: [
      "Components",
      "Props and State",
      "React Hooks",
      "React Router",
      "API Integration",
    ],
  },
  {
    id: "python",
    title: "Python Programming",
    category: "Programming",
    description:
      "Learn Python programming, variables, loops, functions and coding basics.",
    level: "Beginner",
    duration: "6 Weeks",
    instructor: "Rahul Kumar",
    materials: [
      "Variables",
      "Conditions",
      "Loops",
      "Functions",
      "Lists and Dictionaries",
    ],
  },
];

/* QUIZ QUESTIONS */

const QUIZ_QUESTIONS = [
  {
    question: "What does the CIA Triad stand for?",
    options: [
      "Confidentiality, Integrity, Availability",
      "Control, Internet, Access",
      "Cybersecurity, Identity, Authentication",
    ],
    answer: 0,
  },
  {
    question: "Which tool is commonly used for network scanning?",
    options: ["Nmap", "Photoshop", "MS Word"],
    answer: 0,
  },
  {
    question: "What is the main purpose of a firewall?",
    options: [
      "Edit images",
      "Filter and control network traffic",
      "Create documents",
    ],
    answer: 1,
  },
  {
    question: "Which is a strong password practice?",
    options: [
      "Use 123456",
      "Use your name",
      "Use a unique, complex password",
    ],
    answer: 2,
  },
  {
    question: "What does HTTPS help provide?",
    options: [
      "Encrypted communication",
      "Free internet",
      "Unlimited storage",
    ],
    answer: 0,
  },
  {
    question: "What is phishing?",
    options: [
      "A programming language",
      "A deceptive attempt to steal information",
      "A backup method",
    ],
    answer: 1,
  },
  {
    question: "What does hashing produce?",
    options: [
      "A fixed-length data digest",
      "A website",
      "A firewall rule",
    ],
    answer: 0,
  },
  {
    question: "Which protocol is the secure version of HTTP?",
    options: ["FTP", "SMTP", "HTTPS"],
    answer: 2,
  },
  {
    question: "What does MFA stand for?",
    options: [
      "Main File Access",
      "Multi-Factor Authentication",
      "Multiple Firewall Application",
    ],
    answer: 1,
  },
  {
    question: "What should you do with a suspicious link?",
    options: [
      "Click immediately",
      "Share it with everyone",
      "Avoid clicking and verify it first",
    ],
    answer: 2,
  },
];

/* LOCAL STORAGE HELPER */

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

/* AUTHENTICATION CONTEXT */

export function AppProviders({ children }) {
  const [user, setUser] = useState(() =>
    readStored("learnhubUser", null)
  );

  const [enrolled, setEnrolled] = useState(() =>
    readStored("learnhubEnrolled", [])
  );

  const [completed, setCompleted] = useState(() =>
    readStored("learnhubCompleted", [])
  );

  useEffect(() => {
    localStorage.setItem(
      "learnhubUser",
      JSON.stringify(user)
    );
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      "learnhubEnrolled",
      JSON.stringify(enrolled)
    );
  }, [enrolled]);

  useEffect(() => {
    localStorage.setItem(
      "learnhubCompleted",
      JSON.stringify(completed)
    );
  }, [completed]);

  const login = (email, password) => {
    if (
      !email ||
      !email.includes("@") ||
      !password
    ) {
      return {
        ok: false,
        message: "Enter a valid email and password.",
      };
    }

    const nextUser = {
      email: email,
      username: email.split("@")[0] || "Student",
    };

    setUser(nextUser);

    return {
      ok: true,
      user: nextUser,
    };
  };

  const logout = () => {
    setUser(null);
  };

  const enroll = (courseId) => {
    setEnrolled((old) =>
      old.includes(courseId)
        ? old
        : [...old, courseId]
    );
  };

  const completeLesson = (courseId) => {
    setCompleted((old) =>
      old.includes(courseId)
        ? old
        : [...old, courseId]
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        enrolled,
        enroll,
        completed,
        completeLesson,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AppProviders."
    );
  }

  return context;
}

/* REUSABLE PAGE */

function Page({ children }) {
  return (
    <main
      className="page"
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "28px 20px",
      }}
    >
      {children}
    </main>
  );
}

/* COURSE CARD */


function CourseCard({ course }) {
  const images = {
    "cyber-security":
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80",
    react:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
    python:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
  };

  return (
    <article className="course-card">
      <img
        className="course-image"
        src={images[course.id]}
        alt={`${course.title} course`}
        loading="lazy"
      />

      <div className="course-card-content">
        <span className="course-category">{course.category}</span>
        <h2>{course.title}</h2>
        <p>{course.description}</p>

        <div className="course-meta">
          <span>📘 {course.level}</span>
          <span>⏱️ {course.duration}</span>
        </div>

        <p>👨‍🏫 Instructor: {course.instructor}</p>

        <Link className="btn" to={`/course/${course.id}`}>
          View Course <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}


/* HOME PAGE */


/* HOME PAGE */


export function Home() {
  return (
    <Page>
      <section className="lh-hero">
        <div className="lh-hero-content">
          <div className="lh-badge">
            🎓 YOUR LEARNING JOURNEY STARTS HERE
          </div>

          <h1>
            Learn Today.
            <br />
            <span>Lead Tomorrow.</span>
          </h1>

          <p>
            Upgrade your skills with Cyber Security, React and Python.
            Learn at your own pace and build your future with LearnHub.
          </p>

          <Link to="/courses" className="lh-cta">
            View Courses <span>→</span>
          </Link>

          <div className="lh-benefits">
            <span>✓ Beginner Friendly</span>
            <span>✓ Learn at Your Pace</span>
          </div>
        </div>

        <div className="lh-hero-art">
          <div className="lh-orbit lh-orbit-one"></div>
          <div className="lh-orbit lh-orbit-two"></div>

          <div className="lh-laptop">
            <div className="lh-screen">
              <div className="lh-logo-icon">🎓</div>
              <strong>Learn<span>Hub</span></strong>
              <small>Knowledge. Skills. Future.</small>
              <div className="lh-screen-line"></div>
              <div className="lh-screen-line short"></div>
              <div className="lh-screen-line"></div>
            </div>
            <div className="lh-keyboard"></div>
          </div>

          <div className="lh-course-float lh-cyber">
            <span>🛡️</span>
            <strong>Cyber Security</strong>
          </div>

          <div className="lh-course-float lh-react">
            <span>⚛️</span>
            <strong>React</strong>
          </div>

          <div className="lh-course-float lh-python">
            <span>🐍</span>
            <strong>Python</strong>
          </div>
        </div>
      </section>
    </Page>
  );
}


/* COURSES PAGE */

export function Courses() {
  const [search, setSearch] = useState("");

  const filteredCourses = COURSES.filter((course) =>
    [
      course.title,
      course.category,
      course.description,
      course.instructor,
      course.level,
      course.duration,
      ...course.materials,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <Page>
      <h1>All Courses</h1>

      <p>
        Search by course name, topic, instructor or learning material.
      </p>

      <input
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        placeholder="Search all courses..."
        aria-label="Search courses"
        style={{
          width: "100%",
          maxWidth: 500,
          padding: 12,
          margin: "10px 0 24px",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 18,
        }}
      >
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <p>No courses found. Try another search.</p>
      )}
    </Page>
  );
}

/* COURSE DETAILS */

export function CourseDetail() {
  const { id } = useParams();

  const { user, enroll, enrolled } = useAuth();

  const navigate = useNavigate();

  const course = COURSES.find(
    (item) => item.id === id
  );

  if (!course) {
    return (
      <Page>
        <h1>Course not found</h1>
        <Link to="/courses">Back to Courses</Link>
      </Page>
    );
  }

  function startCourse() {
    if (!user) {
      navigate("/login", {
        state: { from: `/course/${id}` },
      });
      return;
    }

    enroll(course.id);
    navigate("/learning");
  }

  return (
    <Page>
      <h1>{course.title}</h1>

      <p>{course.description}</p>

      <p>
        {course.level} · {course.duration}
      </p>

      <p>Instructor: {course.instructor}</p>

      <h2>Course Materials</h2>

      <ul>
        {course.materials.map((material) => (
          <li key={material}>{material}</li>
        ))}
      </ul>

      <button onClick={startCourse}>
        {enrolled.includes(course.id)
          ? "Continue Learning"
          : "Enroll Now"}
      </button>
    </Page>
  );
}

/* MY LEARNING DASHBOARD */


export function Learning() {
  const {
    user,
    enrolled,
    completed,
    completeLesson,
  } = useAuth();

  const myCourses = COURSES.filter((course) =>
    enrolled.includes(course.id)
  );

  const [quizResult, setQuizResult] = useState(() =>
    readStored("learnhubQuizResult", null)
  );

  useEffect(() => {
    const refresh = () => {
      setQuizResult(readStored("learnhubQuizResult", null));
    };

    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <Page>
      <h1>My Learning Dashboard</h1>
      <p>Track your enrolled courses and learning progress.</p>

      {!user && (
        <p>
          Please <Link to="/login">login</Link> to save your progress.
        </p>
      )}

      {user && myCourses.length === 0 && (
        <p>
          You have not enrolled in a course yet.{" "}
          <Link to="/courses">Browse courses</Link>.
        </p>
      )}

      <div className="learning-course-grid">
        {myCourses.map((course) => {
          const isCompleted = completed.includes(course.id);
          const progress = isCompleted ? 100 : 0;

          return (
            <article className="learning-course-card" key={course.id}>
              <div className="learning-course-icon">
                {course.id === "cyber-security"
                  ? "🛡️"
                  : course.id === "react"
                  ? "⚛️"
                  : "🐍"}
              </div>

              <h2>{course.title}</h2>
              <p>{course.description}</p>

              <div className="learning-progress-info">
                <span>Course Progress</span>
                <strong>{progress}%</strong>
              </div>

              <div className="learning-progress-track">
                <div
                  className="learning-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p>
                Status:{" "}
                <span
                  className={
                    isCompleted
                      ? "learning-status-done"
                      : "learning-status-progress"
                  }
                >
                  {isCompleted ? "Completed ✓" : "In Progress"}
                </span>
              </p>

              <button
                className="learning-complete-btn"
                onClick={() => completeLesson(course.id)}
                disabled={isCompleted}
              >
                {isCompleted
                  ? "✓ Course Completed"
                  : "Mark Course Complete"}
              </button>
            </article>
          );
        })}
      </div>

      <section className="learning-quiz-card">
        <h2>📝 Quiz Result</h2>

        {quizResult ? (
          <>
            <p>
              Score: {quizResult.score}/{quizResult.total}
            </p>

            <p>Percentage: {quizResult.percentage}%</p>

            <p>
              Status:{" "}
              {quizResult.passed ? "Passed ✓" : "Not Passed"}
            </p>

            {quizResult.passed ? (
              <Link className="learning-result-link" to="/certificate">
                View Certificate →
              </Link>
            ) : (
              <Link className="learning-result-link" to="/quiz">
                Try Quiz Again →
              </Link>
            )}
          </>
        ) : (
          <p>You have not completed the quiz yet.</p>
        )}

        <Link className="learning-result-link" to="/quiz">
          Take Cyber Security Quiz →
        </Link>
      </section>
    </Page>
  );
}


/* QUIZ PAGE */

export function QuizPage() {
  const { user } = useAuth();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);

  const question = QUIZ_QUESTIONS[questionIndex];

  function submitAnswer() {
    if (selected === null) return;

    const finalScore =
      score + (selected === question.answer ? 1 : 0);

    setScore(finalScore);
    setSelected(null);

    if (
      questionIndex === QUIZ_QUESTIONS.length - 1
    ) {
      const quizResult = {
        score: finalScore,
        total: QUIZ_QUESTIONS.length,
        percentage: Math.round(
          (finalScore / QUIZ_QUESTIONS.length) * 100
        ),
        passed: finalScore >= 7,
        name:
          user?.username ||
          user?.email?.split("@")[0] ||
          "Student",
        date: new Date().toLocaleDateString(),
      };

      localStorage.setItem(
        "learnhubQuizResult",
        JSON.stringify(quizResult)
      );

      setResult(quizResult);
      setFinished(true);
    } else {
      setQuestionIndex((index) => index + 1);
    }
  }

  function restartQuiz() {
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setResult(null);
  }

  if (finished && result) {
    return (
      <Page>
        <h1>Quiz Result</h1>

        <h2>
          Score: {result.score}/{result.total}
        </h2>

        <h3>
          Percentage: {result.percentage}%
        </h3>

        <p>
          {result.passed
            ? "Congratulations! You passed the quiz."
            : "You did not reach 70%. Keep learning and try again."}
        </p>

        {result.passed && (
          <p>
            🎓 Certificate unlocked!{" "}
            <Link to="/certificate">
              View Certificate
            </Link>
          </p>
        )}

        <button onClick={restartQuiz}>
          Try Again
        </button>

        <p>
          <Link to="/learning">
            Go to Dashboard
          </Link>
        </p>
      </Page>
    );
  }

  return (
    <Page>
      <h1>Cyber Security Quiz</h1>

      <p>
        Question {questionIndex + 1} of{" "}
        {QUIZ_QUESTIONS.length}
      </p>

      <progress
        value={questionIndex + 1}
        max={QUIZ_QUESTIONS.length}
        style={{
          width: "100%",
          maxWidth: 500,
        }}
      />

      <h2>{question.question}</h2>

      <div style={{ maxWidth: 650 }}>
        {question.options.map((option, index) => (
          <label
            key={option}
            style={{
              display: "block",
              padding: 12,
              margin: "8px 0",
              border:
                selected === index
                  ? "2px solid #2563eb"
                  : "1px solid #cbd5e1",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name={`question-${questionIndex}`}
              checked={selected === index}
              onChange={() => setSelected(index)}
            />

            {" "}{option}
          </label>
        ))}
      </div>

      <button
        onClick={submitAnswer}
        disabled={selected === null}
      >
        {questionIndex === QUIZ_QUESTIONS.length - 1
          ? "Finish Quiz"
          : "Next Question"}
      </button>
    </Page>
  );
}

/* ASSIGNMENTS */

export function AssignmentsPage() {
  return (
    <Page>
      <h1>Assignments</h1>

      <p>
        Practice what you have learned and track your progress.
      </p>

      <Link to="/quiz">
        Take Cyber Security Quiz
      </Link>
    </Page>
  );
}

/* CERTIFICATE PAGE */

export function CertificatePage() {
  const [result, setResult] = useState(() =>
    readStored("learnhubQuizResult", null)
  );

  useEffect(() => {
    const refresh = () => {
      setResult(
        readStored("learnhubQuizResult", null)
      );
    };

    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
    };
  }, []);

  if (!result || !result.passed) {
    return (
      <Page>
        <h1>My Certificate</h1>

        <p>
          Pass the Cyber Security Quiz with at least
          70% to unlock your certificate.
        </p>

        <Link to="/quiz">Take Quiz</Link>
      </Page>
    );
  }

  return (
    <Page>
      <section
        className="certificate"
        style={{
          maxWidth: 760,
          margin: "20px auto",
          padding: 36,
          textAlign: "center",
          border: "6px double #2563eb",
          borderRadius: 16,
          background: "#eff6ff",
          color: "#172554",
        }}
      >
        <h1>🎓 LearnHub</h1>

        <h2>Certificate of Achievement</h2>

        <p>This certificate is awarded to</p>

        <h1>{result.name}</h1>

        <p>for successfully passing the</p>

        <h2>Cyber Security Quiz</h2>

        <p>
          Score: {result.score}/{result.total} ·{" "}
          {result.percentage}%
        </p>

        <p>Date: {result.date}</p>

        <p>✓ Quiz Passed</p>

        <button onClick={() => window.print()}>
          Print Certificate
        </button>
      </section>
    </Page>
  );
}

/* PROFILE PAGE */

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <Page>
      <h1>Profile</h1>

      {user ? (
        <>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>

          <button onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <p>
          Please <Link to="/login">login</Link> to view your profile.
        </p>
      )}
    </Page>
  );
}

/* LOGIN PAGE */

export function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from =
    window.history.state?.usr?.from || "/courses";

  function handleSubmit(event) {
    event.preventDefault();

    const response = login(
      email.trim(),
      password
    );

    if (!response.ok) {
      setError(response.message);
      return;
    }

    setError("");

    navigate(from, { replace: true });
  }

  if (user) {
    return (
      <Page>
        <h1>Welcome, {user.username}</h1>
        <Link to="/courses">Browse Courses</Link>
      </Page>
    );
  }

  return (
    <Page>
      <h1>Login to LearnHub</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 12,
          maxWidth: 420,
        }}
      >
        <label>
          Email

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            style={{
              display: "block",
              width: "100%",
              padding: 10,
              marginTop: 4,
            }}
          />
        </label>

        <label>
          Password

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            style={{
              display: "block",
              width: "100%",
              padding: 10,
              marginTop: 4,
            }}
          />
        </label>

        {error && (
          <p role="alert" style={{ color: "crimson" }}>
            {error}
          </p>
        )}

        <button type="submit">
          Login
        </button>
      </form>

      <p>
        Demo login: enter a valid email and any non-empty password.
      </p>
    </Page>
  );
}

/* LEARNING PATH */

export function LearningPath() {
  return (
    <Page>
      <h1>Learning Path</h1>

      <ol>
        <li>Learn the basics</li>
        <li>Study course materials</li>
        <li>Complete assignments</li>
        <li>Take the quiz</li>
        <li>
          Unlock your certificate by scoring at least 70%
        </li>
      </ol>
    </Page>
  );
}