
import { useEffect, useState } from "react";
import axios from "axios";
import { COURSES } from "./Experiment1";

const DB_KEY = "experiment3MockApi";

function readDB() {
  try {
    const saved = JSON.parse(localStorage.getItem(DB_KEY) || "null");
    if (saved && Array.isArray(saved.courses)) return saved;
  } catch (error) {
    console.error("Database read error:", error);
  }

  return {
    courses: COURSES.map((course) => ({ ...course })),
    enrollments: [],
    history: [],
    quizSubmissions: [],
    assignmentSubmissions: [],
  };
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

const mockApi = axios.create({ baseURL: "/mock-api" });

mockApi.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toUpperCase();
  const url = config.url || "";

  console.log(`[API REQUEST] ${method} ${url}`, config.data || "");

  await new Promise((resolve) => setTimeout(resolve, 350));

  const db = readDB();
  const requestMethod = method.toLowerCase();
  const endpoint = url.replace(/^\/+/, "");

  let body = config.data || {};

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  let data;

  if (requestMethod === "get" && endpoint === "courses") {
    data = db.courses;
  } else if (requestMethod === "get" && endpoint === "history") {
    data = [...db.history].reverse();
  } else if (
    requestMethod === "get" &&
    endpoint === "enrollments"
  ) {
    data = db.enrollments;
  } else if (
    requestMethod === "post" &&
    endpoint === "enrollments"
  ) {
    const courseId = Number(body.courseId);

    const existing = db.enrollments.find(
      (item) => item.courseId === courseId
    );

    if (existing) {
      throw new Error("You are already enrolled in this course.");
    }

    const course = db.courses.find(
      (item) => item.id === courseId
    );

    if (!course) {
      throw new Error("Course not found.");
    }

    const enrollment = {
      id: Date.now(),
      courseId,
      courseTitle: course.title,
      progress: 0,
      date: new Date().toLocaleString(),
    };

    db.enrollments.push(enrollment);

    db.history.push({
      id: Date.now() + 1,
      type: "Enrollment",
      message: `Enrolled in ${course.title}`,
      date: new Date().toLocaleString(),
    });

    saveDB(db);
    data = enrollment;
  } else if (
    ["put", "patch"].includes(requestMethod) &&
    endpoint.startsWith("progress/")
  ) {
    const courseId = Number(endpoint.split("/")[1]);

    const enrollment = db.enrollments.find(
      (item) => item.courseId === courseId
    );

    if (!enrollment) {
      throw new Error(
        "Enroll in this course before updating progress."
      );
    }

    enrollment.progress = Math.max(
      0,
      Math.min(100, Number(body.progress) || 0)
    );

    db.history.push({
      id: Date.now(),
      type: "Progress",
      message: `${enrollment.courseTitle}: progress updated to ${enrollment.progress}%`,
      date: new Date().toLocaleString(),
    });

    saveDB(db);
    data = enrollment;
  } else if (
    requestMethod === "post" &&
    endpoint === "quiz"
  ) {
    const score = Number(body.score);

    if (
      !Number.isFinite(score) ||
      score < 0 ||
      score > 10
    ) {
      throw new Error("Quiz score must be between 0 and 10.");
    }

    const submission = {
      id: Date.now(),
      type: "Quiz",
      score,
      total: 10,
      date: new Date().toLocaleString(),
    };

    db.quizSubmissions.push(submission);

    db.history.push({
      id: Date.now() + 1,
      type: "Quiz",
      message: `Quiz submitted: ${score}/10`,
      date: new Date().toLocaleString(),
    });

    saveDB(db);
    data = submission;
  } else if (
    requestMethod === "post" &&
    endpoint === "assignments"
  ) {
    const title = String(body.title || "").trim();

    if (!title) {
      throw new Error("Enter an assignment title.");
    }

    const submission = {
      id: Date.now(),
      type: "Assignment",
      title,
      date: new Date().toLocaleString(),
    };

    db.assignmentSubmissions.push(submission);

    db.history.push({
      id: Date.now() + 1,
      type: "Assignment",
      message: `Assignment submitted: ${title}`,
      date: new Date().toLocaleString(),
    });

    saveDB(db);
    data = submission;
  } else {
    throw new Error(
      `Mock API endpoint not found: ${method} /${endpoint}`
    );
  }

  config.__mockResponseData = data;

  config.adapter = async () => ({
    data: config.__mockResponseData,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  });

  return config;
});

mockApi.interceptors.response.use(
  (response) => {
    console.log("[API RESPONSE]", response.data);
    return response;
  },
  (error) => {
    console.error("[API ERROR]", error.message);
    return Promise.reject(error);
  }
);

export default function Experiment3() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [quizScore, setQuizScore] = useState("8");
  const [assignmentTitle, setAssignmentTitle] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        courseResponse,
        historyResponse,
        enrollmentResponse,
      ] = await Promise.all([
        mockApi.get("/courses"),
        mockApi.get("/history"),
        mockApi.get("/enrollments"),
      ]);

      setCourses(courseResponse.data);
      setHistory(historyResponse.data);
      setEnrollments(enrollmentResponse.data);
    } catch (err) {
      setError(err.message || "Unable to retrieve data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const runAction = async (action, successMessage) => {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      console.log("[ACTION] Started");

      await action();

      setNotice(successMessage);
      await loadData();

      console.log("[ACTION] Completed");
    } catch (err) {
      setError(err.message || "API request failed. Try again.");
      console.error("[ACTION ERROR]", err);
    } finally {
      setBusy(false);
    }
  };

  const enroll = (courseId) => {
    console.log("Enroll button clicked:", courseId);

    return runAction(
      () => mockApi.post("/enrollments", { courseId }),
      "Course enrollment created successfully."
    );
  };

  const updateProgress = (courseId, progress) => {
    console.log("Progress update clicked:", courseId, progress);

    return runAction(
      () =>
        mockApi.patch(`/progress/${courseId}`, {
          progress: Number(progress),
        }),
      "Learning progress updated successfully."
    );
  };

  const submitQuiz = (event) => {
    event.preventDefault();

    const score = Number(quizScore);

    if (
      quizScore.trim() === "" ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > 10
    ) {
      setError("Enter a quiz score between 0 and 10.");
      return;
    }

    console.log("Submit quiz button clicked:", score);

    runAction(
      () => mockApi.post("/quiz", { score, total: 10 }),
      "Quiz score submitted successfully."
    );
  };

  const submitAssignment = (event) => {
    event.preventDefault();

    if (!assignmentTitle.trim()) {
      setError("Please enter an assignment title.");
      return;
    }

    console.log("Submit assignment button clicked");

    runAction(
      () =>
        mockApi.post("/assignments", {
          title: assignmentTitle.trim(),
        }),
      "Assignment submitted successfully."
    );

    setAssignmentTitle("");
  };

  if (loading && courses.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 p-8 text-center">
        <p className="text-lg font-semibold">
          Loading courses and learning history...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Experiment 3: REST API & CRUD
        </h1>

        <p className="mt-2 text-gray-600">
          Mock REST API using Axios · GET, POST, PATCH and error handling
        </p>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <div className="flex items-center justify-between gap-3">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mt-5 rounded-xl bg-green-50 p-4 text-green-700"
          >
            {notice}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => {
              console.log("Refresh GET button clicked");
              loadData();
            }}
            disabled={loading || busy}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh with GET"}
          </button>

          {loading && (
            <span className="text-sm text-gray-500">
              Fetching API data...
            </span>
          )}
        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Courses (GET /courses)
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {courses.map((course) => {
              const enrollment = enrollments.find(
                (item) => item.courseId === course.id
              );

              return (
                <article
                  key={course.id}
                  className="rounded-xl border p-5"
                >
                  <h3 className="font-bold">{course.title}</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {course.instructor} · {course.duration}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    {course.description}
                  </p>

                  {!enrollment ? (
                    <button
                      disabled={busy}
                      onClick={() => enroll(course.id)}
                      className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                      {busy ? "Please wait..." : "POST Enroll"}
                    </button>
                  ) : (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress (PATCH)</span>
                        <span>{enrollment.progress}%</span>
                      </div>

                      <input
                        aria-label={`Progress for ${course.title}`}
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={enrollment.progress}
                        disabled={busy}
                        onChange={(event) =>
                          updateProgress(
                            course.id,
                            event.target.value
                          )
                        }
                        className="mt-2 w-full"
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Submit Quiz (POST /quiz)
            </h2>

            <form
              onSubmit={submitQuiz}
              className="mt-4 flex gap-3"
            >
              <input
                aria-label="Quiz score out of 10"
                type="number"
                min="0"
                max="10"
                step="1"
                required
                value={quizScore}
                onChange={(event) =>
                  setQuizScore(event.target.value)
                }
                className="w-24 rounded-lg border px-3 py-2"
              />

              <button
                disabled={busy}
                type="submit"
                className="rounded-lg bg-purple-600 px-4 py-2 text-white disabled:opacity-50"
              >
                Submit Score
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Submit Assignment (POST /assignments)
            </h2>

            <form
              onSubmit={submitAssignment}
              className="mt-4 flex gap-3"
            >
              <input
                value={assignmentTitle}
                onChange={(event) =>
                  setAssignmentTitle(event.target.value)
                }
                placeholder="Assignment title"
                aria-label="Assignment title"
                required
                className="min-w-0 flex-1 rounded-lg border px-3 py-2"
              />

              <button
                disabled={busy}
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
              >
                Submit
              </button>
            </form>
          </section>
        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Learning History (GET /history)
          </h2>

          {history.length === 0 ? (
            <p className="mt-3 text-gray-500">
              No learning history yet. Enroll in a course or submit data.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg bg-gray-50 p-4"
                >
                  <p className="font-semibold">{item.type}</p>
                  <p className="text-gray-700">{item.message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.date}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-6 text-sm text-gray-500">
          Browser-based mock API for lab demonstration. Data is stored
          in localStorage; no backend server is required.
        </p>
      </div>
    </main>
  );
}
