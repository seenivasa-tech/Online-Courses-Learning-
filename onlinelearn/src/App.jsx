import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Experiment1 from "./Experiment1";
import Experiment2 from "./Experiment2";
import Experiment3 from "./Experiment3";

import {
  AppProviders,
  Home,
  Courses,
  CourseDetail,
  Learning,
  QuizPage,
  AssignmentsPage,
  CertificatePage,
  ProfilePage,
  Login,
  LearningPath,
  useAuth,
} from "./Experiment4";


/* =====================================================
   NAVIGATION
===================================================== */

const links = [
  ["/", "Home", true],
  ["/courses", "Courses"],
  ["/learning", "My Learning"],
  ["/quiz", "Quiz & Assignment"],
  ["/learning-path", "Learning Path"],
];


/* =====================================================
   NAV COMPONENT
===================================================== */

function Nav() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4">

        <div className="flex items-center justify-between gap-6">

          {/* =================================================
              LOGO
          ================================================= */}

          <NavLink
            to="/"
            className="text-2xl font-extrabold text-indigo-600 whitespace-nowrap"
          >
            🎓 LearnHub
          </NavLink>


          {/* =================================================
              NAV LINKS
          ================================================= */}

          <nav className="flex items-center gap-5 font-medium">

            {links.map(([to, label, end]) => (

              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition whitespace-nowrap ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:text-indigo-600"
                  }`
                }
              >
                {label}
              </NavLink>

            ))}

          </nav>


          {/* =================================================
              ACCOUNT / LOGIN
          ================================================= */}

          <div className="flex items-center gap-3 whitespace-nowrap">

            {user ? (

              <>
                {/* ACCOUNT */}

                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition font-semibold"
                >
                  👤 {user.username}
                </button>


                {/* LOGOUT */}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-semibold"
                >
                  Logout
                </button>
              </>

            ) : (

              /* LOGIN */

              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
              >
                Login
              </button>

            )}

          </div>

        </div>

      </div>

    </header>
  );
}


/* =====================================================
   FOOTER
===================================================== */

function Footer() {

  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-6">
      © 2026 LearnHub – Online Learning Platform
    </footer>
  );
}


/* =====================================================
   APP
===================================================== */

export default function App() {

  return (

    <BrowserRouter>

      <AppProviders>

        <div className="min-h-screen flex flex-col">

          <Nav />

          <main className="flex-1">

            <Routes>

              {/* HOME */}

              <Route
                path="/"
                element={<Home />}
              />


              {/* EXPERIMENT 1 */}

              <Route
                path="/exp1"
                element={<Experiment1 />}
              />


              {/* EXPERIMENT 2 */}

              <Route
                path="/exp2"
                element={<Experiment2 />}
              />


              {/* EXPERIMENT 3 */}

              <Route
                path="/exp3/*"
                element={<Experiment3 />}
              />


              {/* COURSES */}

              <Route
                path="/courses"
                element={<Courses />}
              />


              {/* COURSE DETAIL */}

              <Route
                path="/course/:id"
                element={<CourseDetail />}
              />


              {/* MY LEARNING */}

              <Route
                path="/learning"
                element={<Learning />}
              />


              {/* QUIZ */}

              <Route
                path="/quiz"
                element={<QuizPage />}
              />


              {/* ASSIGNMENT */}

              <Route
                path="/assignments"
                element={<AssignmentsPage />}
              />


              {/* LEARNING PATH */}

              <Route
                path="/learning-path"
                element={<LearningPath />}
              />

              <Route
                path="/certificate"
                element={<CertificatePage />}
               />


              {/* PROFILE */}

              <Route
                path="/profile"
                element={<ProfilePage />}
              />


              {/* LOGIN */}

              <Route
                path="/login"
                element={<Login />}
              />


              {/* UNKNOWN */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />

            </Routes>

          </main>

          <Footer />

        </div>

      </AppProviders>

    </BrowserRouter>
  );
}