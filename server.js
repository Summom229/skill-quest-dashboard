require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const XP_BY_DIFFICULTY = { easy: 25, medium: 50, hard: 100 };
const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0 },
  { level: 2, minXp: 100 },
  { level: 3, minXp: 250 },
  { level: 4, minXp: 450 },
  { level: 5, minXp: 700 },
  { level: 6, minXp: 1000 },
  { level: 7, minXp: 1400 },
  { level: 8, minXp: 1900 },
  { level: 9, minXp: 2500 },
  { level: 10, minXp: 3200 }
];

const QUEST_PRESETS = {
  html: [['Build a semantic profile page', 'easy'], ['Create an accessible contact form', 'medium'], ['Make a pricing table', 'medium'], ['Build a blog article layout', 'medium'], ['Add accessible image alt text', 'easy'], ['Build a full landing page structure', 'hard']],
  css: [['Create hover and focus states', 'easy'], ['Build a responsive card grid', 'medium'], ['Style a navigation bar', 'medium'], ['Build a mobile-first layout', 'medium'], ['Practice CSS variables', 'easy'], ['Create a responsive dashboard layout', 'hard']],
  javascript: [['Build a counter app', 'easy'], ['Practice array methods', 'medium'], ['Create a LocalStorage notes app', 'hard'], ['Build a quiz interaction', 'medium'], ['Validate a form', 'medium'], ['Filter a list dynamically', 'medium']],
  typescript: [['Add types to a user profile object', 'easy'], ['Create typed function parameters', 'easy'], ['Build an interface for API data', 'medium'], ['Practice union types', 'medium'], ['Convert a small JavaScript module to TypeScript', 'medium'], ['Create a typed task manager model', 'hard']],
  react: [['Create a reusable button component', 'easy'], ['Build a simple counter with state', 'easy'], ['Render a list from component data', 'medium'], ['Create a controlled form', 'medium'], ['Use props to compose cards', 'medium'], ['Build a small filtered todo view', 'hard']],
  nodejs: [['Create a basic Node script', 'easy'], ['Read command line arguments', 'easy'], ['Use the fs module to read a file', 'medium'], ['Create a simple HTTP server', 'medium'], ['Load environment variables safely', 'medium'], ['Build a small CLI utility', 'hard']],
  express: [['Create an Express server', 'easy'], ['Add a health check route', 'easy'], ['Create REST routes for tasks', 'medium'], ['Add request validation middleware', 'medium'], ['Handle route errors cleanly', 'medium'], ['Build a small JSON API', 'hard']],
  python: [['Build a calculator script', 'medium'], ['Practice loops and functions', 'easy'], ['Create a file organizer plan', 'easy'], ['Work with lists and dictionaries', 'medium'], ['Build a number guessing game', 'medium'], ['Read and write a simple text file', 'hard']],
  java: [['Practice classes and objects', 'medium'], ['Build a console menu', 'medium'], ['Understand inheritance', 'medium'], ['Use ArrayList', 'medium'], ['Practice methods', 'easy'], ['Build a simple student manager', 'hard']],
  c: [['Print formatted output', 'easy'], ['Practice variables and types', 'easy'], ['Write a loop-based calculator', 'medium'], ['Use arrays for simple scores', 'medium'], ['Practice functions', 'medium'], ['Build a number guessing game', 'hard']],
  cpp: [['Practice input and output streams', 'easy'], ['Create a simple class', 'medium'], ['Use vectors for a list of names', 'medium'], ['Practice constructors', 'medium'], ['Build a console menu', 'medium'], ['Create a small inventory manager', 'hard']],
  csharp: [['Create a console hello world', 'easy'], ['Practice methods and parameters', 'easy'], ['Build a simple class model', 'medium'], ['Use List for task records', 'medium'], ['Practice properties', 'medium'], ['Build a student grade tracker', 'hard']],
  php: [['Create a simple PHP page', 'easy'], ['Practice arrays and loops', 'easy'], ['Handle a basic form submission', 'medium'], ['Render a list from data', 'medium'], ['Create reusable include files', 'medium'], ['Build a small contact form flow', 'hard']],
  sql: [['Write basic SELECT queries', 'easy'], ['Filter rows with WHERE', 'easy'], ['Sort and limit query results', 'medium'], ['Practice aggregate functions', 'medium'], ['Join two related tables', 'medium'], ['Design a small reporting query', 'hard']],
  mysql: [['Create a database and table', 'easy'], ['Insert sample records', 'easy'], ['Update and delete rows safely', 'medium'], ['Create indexes for lookup fields', 'medium'], ['Write a grouped report query', 'medium'], ['Model a simple app schema', 'hard']],
  mongodb: [['Create a collection of documents', 'easy'], ['Insert sample documents', 'easy'], ['Find documents with filters', 'medium'], ['Update nested document fields', 'medium'], ['Practice aggregation basics', 'medium'], ['Design a small document schema', 'hard']],
  gitgithub: [['Initialize a Git repository', 'easy'], ['Make clear commits', 'easy'], ['Create and switch branches', 'medium'], ['Open a pull request checklist', 'medium'], ['Resolve a simple merge conflict', 'medium'], ['Publish a project to GitHub', 'hard']]
};

const skillsSeed = [
  ['html', 'HTML', 'H', '#e76f51', 'Semantic structure, forms, and accessibility.'],
  ['css', 'CSS', 'C', '#2f80ed', 'Layouts, responsive design, and visual polish.'],
  ['javascript', 'JavaScript', 'JS', '#c99400', 'DOM, events, state, and small browser apps.'],
  ['typescript', 'TypeScript', 'TS', '#3178c6', 'Typed JavaScript, interfaces, and safer app logic.'],
  ['react', 'React', 'R', '#4fb8d8', 'Components, props, state, forms, and reusable UI.'],
  ['nodejs', 'Node.js', 'N', '#3c873a', 'Server-side JavaScript, scripts, files, and HTTP basics.'],
  ['express', 'Express', 'EX', '#6b7280', 'Routes, middleware, validation, and lightweight APIs.'],
  ['python', 'Python', 'PY', '#20966f', 'Functions, scripts, loops, and automation thinking.'],
  ['java', 'Java', 'J', '#7b61ff', 'Object-oriented programming and console projects.'],
  ['c', 'C', 'C', '#5c6bc0', 'Core programming, functions, arrays, and memory basics.'],
  ['cpp', 'C++', 'C++', '#4078c0', 'Classes, vectors, constructors, and console applications.'],
  ['csharp', 'C#', 'C#', '#8b5cf6', 'Methods, classes, lists, properties, and .NET fundamentals.'],
  ['php', 'PHP', 'PHP', '#777bb4', 'Server-rendered pages, forms, arrays, and includes.'],
  ['sql', 'SQL', 'SQL', '#0f766e', 'Queries, filtering, joins, aggregates, and reporting.'],
  ['mysql', 'MySQL', 'MY', '#00758f', 'Tables, records, indexes, schemas, and relational data.'],
  ['mongodb', 'MongoDB', 'MDB', '#13aa52', 'Documents, collections, filters, updates, and aggregation.'],
  ['gitgithub', 'Git/GitHub', 'Git', '#f05032', 'Repositories, commits, branches, pull requests, and publishing.']
];

const makeId = () => `sq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const safeId = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const jsonError = (res, status, message) => res.status(status).json({ error: message });
const calculateLevel = (xp) => LEVEL_THRESHOLDS.reduce((level, threshold) => (xp >= threshold.minXp ? threshold.level : level), 1);
const validDifficulty = (difficulty) => Object.prototype.hasOwnProperty.call(XP_BY_DIFFICULTY, difficulty);

const createDefaultState = () => {
  const createdAt = new Date().toISOString();
  const skills = skillsSeed.map(([id, name, icon, color, description]) => ({ id, name, icon, color, description, xp: 0, level: 1, createdAt }));
  const tasks = Object.entries(QUEST_PRESETS).flatMap(([skillId, presets]) => (
    presets.map(([title, difficulty], index) => ({
      id: `default-${skillId}-${index + 1}`,
      skillId,
      title,
      description: '',
      difficulty,
      xpReward: XP_BY_DIFFICULTY[difficulty],
      completed: false,
      createdAt,
      completedAt: ''
    }))
  ));

  return {
    skills,
    tasks,
    missions: [
      { id: 'mission-complete-five', title: 'Complete 5 quests', description: 'Finish five learning quests across any skill.', targetCount: 5, currentCount: 0, xpReward: 100, completed: false, rewardClaimed: false, createdAt },
      { id: 'mission-earn-250', title: 'Earn 250 XP', description: 'Accumulate 250 XP from completed quests.', targetCount: 250, currentCount: 0, xpReward: 120, completed: false, rewardClaimed: false, createdAt },
      { id: 'mission-js-task', title: 'Complete a JavaScript quest', description: 'Finish one JavaScript quest.', targetCount: 1, currentCount: 0, xpReward: 75, completed: false, rewardClaimed: false, createdAt },
      { id: 'mission-streak-three', title: 'Update streak 3 times', description: 'Track three commit updates manually.', targetCount: 3, currentCount: 0, xpReward: 80, completed: false, rewardClaimed: false, createdAt }
    ],
    badges: [
      { id: 'badge-first-quest', title: 'First Quest', description: 'Complete your first learning quest.', icon: '🏅', unlocked: false, unlockedAt: '', requirement: 'Complete 1 quest' },
      { id: 'badge-500xp', title: '500 XP', description: 'Earn 500 total XP.', icon: '⭐', unlocked: false, unlockedAt: '', requirement: 'Reach 500 total XP' },
      { id: 'badge-roadmap', title: 'Roadmap Started', description: 'Check your first roadmap item.', icon: '🗺️', unlocked: false, unlockedAt: '', requirement: 'Complete 1 roadmap item' },
      { id: 'badge-streak', title: '7 Day Streak', description: 'Track a seven day streak.', icon: '🔥', unlocked: false, unlockedAt: '', requirement: 'Reach 7 current streak' },
      { id: 'badge-level-five', title: 'Level 5', description: 'Raise any skill to level 5.', icon: '🎯', unlocked: false, unlockedAt: '', requirement: 'Reach level 5 in any skill' }
    ],
    roadmapItems: [
      ['Front-End Foundations', 'Learn semantic HTML'], ['Front-End Foundations', 'Learn responsive CSS'], ['Front-End Foundations', 'Build landing pages'], ['Front-End Foundations', 'Practice accessibility basics'],
      ['JavaScript Practice', 'DOM manipulation'], ['JavaScript Practice', 'LocalStorage'], ['JavaScript Practice', 'Events'], ['JavaScript Practice', 'Arrays and objects'], ['JavaScript Practice', 'Small apps'],
      ['Backend and Data', 'Learn Node.js later'], ['Backend and Data', 'Understand APIs later'], ['Backend and Data', 'Learn SQL concepts'],
      ['Git and GitHub', 'Create repositories'], ['Git and GitHub', 'Write README files'], ['Git and GitHub', 'Push projects'],
      ['Projects and Deployment', 'Build 5 portfolio projects'], ['Projects and Deployment', 'Deploy static sites']
    ].map(([section, title], index) => ({ id: `roadmap-${index + 1}`, section, title, completed: false })),
    streakData: { currentStreak: 0, longestStreak: 0, totalCommitsThisWeek: 0, lastUpdated: '' }
  };
};

let appState = createDefaultState();

const getSkill = (skillId) => appState.skills.find((skill) => skill.id === skillId);
const updateSkillXp = (skillId, delta) => {
  const skill = getSkill(skillId);
  if (!skill) return;
  skill.xp = Math.max(0, Number(skill.xp || 0) + delta);
  skill.level = calculateLevel(skill.xp);
};
const totalXp = () => appState.skills.reduce((sum, skill) => sum + Number(skill.xp || 0), 0);
const getTopSkill = () => [...appState.skills].sort((a, b) => Number(b.xp || 0) - Number(a.xp || 0))[0];
const unlockBadge = (id) => {
  const badge = appState.badges.find((item) => item.id === id);
  if (badge && !badge.unlocked) {
    badge.unlocked = true;
    badge.unlockedAt = new Date().toISOString();
  }
};
const refreshMissionsAndBadges = () => {
  const completedTasks = appState.tasks.filter((task) => task.completed);
  const completedTaskXp = completedTasks.reduce((sum, task) => sum + Number(task.xpReward || 0), 0);
  const completedJsTasks = completedTasks.filter((task) => task.skillId === 'javascript').length;
  const missionCounts = {
    'mission-complete-five': completedTasks.length,
    'mission-earn-250': completedTaskXp,
    'mission-js-task': completedJsTasks,
    'mission-streak-three': Math.min(Number(appState.streakData.totalCommitsThisWeek || 0), 3)
  };

  appState.missions = appState.missions.map((mission) => {
    const currentCount = missionCounts[mission.id] ?? mission.currentCount;
    const completed = currentCount >= mission.targetCount;

    if (!mission.rewardClaimed && completed) {
      const topSkill = getTopSkill();
      if (topSkill) updateSkillXp(topSkill.id, mission.xpReward);
    }

    return {
      ...mission,
      currentCount,
      completed,
      rewardClaimed: mission.rewardClaimed || completed
    };
  });

  if (completedTasks.length >= 1) unlockBadge('badge-first-quest');
  if (totalXp() >= 500) unlockBadge('badge-500xp');
  if (appState.roadmapItems.some((item) => item.completed)) unlockBadge('badge-roadmap');
  if (Number(appState.streakData.currentStreak || 0) >= 7) unlockBadge('badge-streak');
  if (appState.skills.some((skill) => Number(skill.level || 1) >= 5)) unlockBadge('badge-level-five');
};
const sendState = (res) => {
  refreshMissionsAndBadges();
  res.json(appState);
};

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', storage: 'memory' }));
app.get('/api/state', (req, res) => sendState(res));

app.get('/api/tasks', (req, res) => res.json(appState.tasks));
app.post('/api/tasks', (req, res) => {
  const { skillId, title, difficulty, description = '' } = req.body || {};
  if (!skillId) return jsonError(res, 400, 'skillId is required.');
  if (!title || !String(title).trim()) return jsonError(res, 400, 'title is required.');
  if (!difficulty) return jsonError(res, 400, 'difficulty is required.');
  if (!validDifficulty(difficulty)) return jsonError(res, 400, 'difficulty must be easy, medium, or hard.');
  if (!getSkill(skillId)) return jsonError(res, 400, 'skillId must match an existing skill.');

  const task = {
    id: makeId(),
    skillId,
    title: String(title).trim(),
    description: String(description || '').trim(),
    difficulty,
    xpReward: XP_BY_DIFFICULTY[difficulty],
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: ''
  };
  appState.tasks.unshift(task);
  sendState(res.status(201));
});
app.put('/api/tasks/:id', (req, res) => {
  const task = appState.tasks.find((item) => item.id === req.params.id);
  if (!task) return jsonError(res, 404, 'Task not found.');

  const nextSkillId = req.body.skillId ?? task.skillId;
  const nextTitle = req.body.title ?? task.title;
  const nextDifficulty = req.body.difficulty ?? task.difficulty;

  if (!nextTitle || !String(nextTitle).trim()) return jsonError(res, 400, 'title is required.');
  if (!validDifficulty(nextDifficulty)) return jsonError(res, 400, 'difficulty must be easy, medium, or hard.');
  if (!getSkill(nextSkillId)) return jsonError(res, 400, 'skillId must match an existing skill.');

  if (task.completed) updateSkillXp(task.skillId, -task.xpReward);

  task.skillId = nextSkillId;
  task.title = String(nextTitle).trim();
  task.description = String(req.body.description ?? task.description ?? '').trim();
  task.difficulty = nextDifficulty;
  task.xpReward = XP_BY_DIFFICULTY[nextDifficulty];

  if (task.completed) updateSkillXp(task.skillId, task.xpReward);
  sendState(res);
});
app.delete('/api/tasks/:id', (req, res) => {
  const task = appState.tasks.find((item) => item.id === req.params.id);
  if (!task) return jsonError(res, 404, 'Task not found.');
  if (task.completed) updateSkillXp(task.skillId, -task.xpReward);
  appState.tasks = appState.tasks.filter((item) => item.id !== req.params.id);
  sendState(res);
});
app.patch('/api/tasks/:id/toggle', (req, res) => {
  const task = appState.tasks.find((item) => item.id === req.params.id);
  if (!task) return jsonError(res, 404, 'Task not found.');
  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : '';
  updateSkillXp(task.skillId, task.completed ? task.xpReward : -task.xpReward);
  sendState(res);
});

app.get('/api/skills', (req, res) => res.json(appState.skills));
app.post('/api/skills', (req, res) => {
  const { name, id, icon, color = '#3b82f6', description = '' } = req.body || {};
  if (!name || !String(name).trim()) return jsonError(res, 400, 'name is required.');
  const skillId = safeId(id || name);
  if (!skillId) return jsonError(res, 400, 'A valid skill id is required.');
  if (getSkill(skillId)) return jsonError(res, 409, 'Skill id already exists.');

  appState.skills.push({
    id: skillId,
    name: String(name).trim(),
    icon: icon || String(name).trim().slice(0, 2).toUpperCase(),
    color,
    description: String(description || '').trim() || 'Custom learning path.',
    xp: 0,
    level: 1,
    createdAt: new Date().toISOString()
  });
  sendState(res.status(201));
});
app.put('/api/skills/:id', (req, res) => {
  const skill = getSkill(req.params.id);
  if (!skill) return jsonError(res, 404, 'Skill not found.');
  const { name, icon, color, description } = req.body || {};
  if (name !== undefined && !String(name).trim()) return jsonError(res, 400, 'name cannot be empty.');
  if (name !== undefined) skill.name = String(name).trim();
  if (icon !== undefined) skill.icon = String(icon).trim();
  if (color !== undefined) skill.color = String(color).trim();
  if (description !== undefined) skill.description = String(description).trim();
  sendState(res);
});
app.delete('/api/skills/:id', (req, res) => {
  const skill = getSkill(req.params.id);
  if (!skill) return jsonError(res, 404, 'Skill not found.');
  if (appState.tasks.some((task) => task.skillId === req.params.id)) {
    return jsonError(res, 409, 'Cannot delete a skill with existing tasks.');
  }
  appState.skills = appState.skills.filter((item) => item.id !== req.params.id);
  sendState(res);
});

app.get('/api/roadmap', (req, res) => res.json(appState.roadmapItems));
app.patch('/api/roadmap/:id/toggle', (req, res) => {
  const item = appState.roadmapItems.find((roadmapItem) => roadmapItem.id === req.params.id);
  if (!item) return jsonError(res, 404, 'Roadmap item not found.');
  item.completed = !item.completed;
  sendState(res);
});

app.get('/api/streak', (req, res) => res.json(appState.streakData));
app.patch('/api/streak', (req, res) => {
  const { action, totalCommitsThisWeek } = req.body || {};
  if (action === 'commit') {
    appState.streakData.currentStreak += 1;
    appState.streakData.totalCommitsThisWeek += 1;
  } else if (action === 'manual-weekly') {
    appState.streakData.totalCommitsThisWeek = Math.max(0, Number(totalCommitsThisWeek) || 0);
  } else if (action === 'reset') {
    appState.streakData.currentStreak = 0;
  } else {
    return jsonError(res, 400, 'action must be commit, manual-weekly, or reset.');
  }
  appState.streakData.longestStreak = Math.max(appState.streakData.longestStreak, appState.streakData.currentStreak);
  appState.streakData.lastUpdated = new Date().toISOString();
  sendState(res);
});

app.post('/api/reset', (req, res) => {
  appState = createDefaultState();
  sendState(res);
});

app.put('/api/state', (req, res) => {
  appState = { ...createDefaultState(), ...(req.body || {}) };
  sendState(res);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Skill Quest Dashboard running at http://localhost:${PORT}`);
});
