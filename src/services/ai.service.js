const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

/**
 * Helper — POST to backend and return parsed JSON.
 * Throws an Error with a user-friendly message on failure.
 */
async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }

  return data;
}

/**
 * Send a message to the AI project assistant.
 * @param {string} prompt
 * @param {object} [context] - optional project context (tasks, sprint, members)
 * @returns {Promise<{ reply: string }>}
 */
export async function chatWithAI(prompt, context = null) {
  return post("/api/ai/chat", { prompt, context });
}

/**
 * Submit code for AI review.
 * @param {string} code
 * @param {string} [language]
 * @returns {Promise<{ score: number, issues: Array }>}
 */
export async function reviewCode(code, language = "javascript") {
  return post("/api/ai/review", { code, language });
}

/**
 * Break down a feature description into subtasks.
 * @param {string} feature
 * @returns {Promise<{ tasks: Array }>}
 */
export async function breakdownFeature(feature) {
  return post("/api/ai/breakdown", { feature });
}

/**
 * Generate an AI sprint plan from a backlog of tasks.
 * @param {Array} tasks
 * @param {number} sprintDays
 * @returns {Promise<{ summary, totalEffort, plan }>}
 */
export async function generateSprintPlan(tasks, sprintDays = 14) {
  return post("/api/ai/sprint-plan", { tasks, sprintDays });
}

/**
 * Get live project health dashboard data.
 * @param {object} tasks - kanban columns object
 * @param {Array} members
 * @returns {Promise<{ healthScore, status, insights, metrics, memberStats, velocity }>}
 */
export async function getProjectHealth(tasks, members = []) {
  return post("/api/ai/health", { tasks, members });
}
