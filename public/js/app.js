/**
 * Skill Quest Dashboard - Main Application
 * A browser-based learning progress tracker backed by an Express API
 * @version 2.0.0
 */

// ============================================================================
// Constants & Configuration
// ============================================================================

const STORAGE_KEYS = {
  skills: 'skillQuestSkills',
  tasks: 'skillQuestTasks',
  missions: 'skillQuestMissions',
  badges: 'skillQuestBadges',
  streak: 'skillQuestStreak',
  theme: 'skillQuestTheme',
  roadmap: 'skillQuestRoadmap'
};

const API_BASE = '/api';
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

const DIFFICULTY_CONFIG = {
  easy: { label: '🌱 Easy', color: 'var(--success)', class: 'easy' },
  medium: { label: '🌿 Medium', color: 'var(--warning)', class: 'medium' },
  hard: { label: '🌳 Hard', color: 'var(--danger)', class: 'hard' }
};

const QUEST_PRESETS = {
  html: [
    { title: 'Build a semantic profile page', difficulty: 'easy' },
    { title: 'Create an accessible contact form', difficulty: 'medium' },
    { title: 'Make a pricing table', difficulty: 'medium' },
    { title: 'Build a blog article layout', difficulty: 'medium' },
    { title: 'Add accessible image alt text', difficulty: 'easy' },
    { title: 'Build a full landing page structure', difficulty: 'hard' }
  ],
  css: [
    { title: 'Create hover and focus states', difficulty: 'easy' },
    { title: 'Build a responsive card grid', difficulty: 'medium' },
    { title: 'Style a navigation bar', difficulty: 'medium' },
    { title: 'Build a mobile-first layout', difficulty: 'medium' },
    { title: 'Practice CSS variables', difficulty: 'easy' },
    { title: 'Create a responsive dashboard layout', difficulty: 'hard' }
  ],
  javascript: [
    { title: 'Build a counter app', difficulty: 'easy' },
    { title: 'Practice array methods', difficulty: 'medium' },
    { title: 'Create a LocalStorage notes app', difficulty: 'hard' },
    { title: 'Build a quiz interaction', difficulty: 'medium' },
    { title: 'Validate a form', difficulty: 'medium' },
    { title: 'Filter a list dynamically', difficulty: 'medium' }
  ],
  typescript: [
    { title: 'Add types to a user profile object', difficulty: 'easy' },
    { title: 'Create typed function parameters', difficulty: 'easy' },
    { title: 'Build an interface for API data', difficulty: 'medium' },
    { title: 'Practice union types', difficulty: 'medium' },
    { title: 'Convert a small JavaScript module to TypeScript', difficulty: 'medium' },
    { title: 'Create a typed task manager model', difficulty: 'hard' }
  ],
  react: [
    { title: 'Create a reusable button component', difficulty: 'easy' },
    { title: 'Build a simple counter with state', difficulty: 'easy' },
    { title: 'Render a list from component data', difficulty: 'medium' },
    { title: 'Create a controlled form', difficulty: 'medium' },
    { title: 'Use props to compose cards', difficulty: 'medium' },
    { title: 'Build a small filtered todo view', difficulty: 'hard' }
  ],
  nodejs: [
    { title: 'Create a basic Node script', difficulty: 'easy' },
    { title: 'Read command line arguments', difficulty: 'easy' },
    { title: 'Use the fs module to read a file', difficulty: 'medium' },
    { title: 'Create a simple HTTP server', difficulty: 'medium' },
    { title: 'Load environment variables safely', difficulty: 'medium' },
    { title: 'Build a small CLI utility', difficulty: 'hard' }
  ],
  express: [
    { title: 'Create an Express server', difficulty: 'easy' },
    { title: 'Add a health check route', difficulty: 'easy' },
    { title: 'Create REST routes for tasks', difficulty: 'medium' },
    { title: 'Add request validation middleware', difficulty: 'medium' },
    { title: 'Handle route errors cleanly', difficulty: 'medium' },
    { title: 'Build a small JSON API', difficulty: 'hard' }
  ],
  python: [
    { title: 'Build a calculator script', difficulty: 'medium' },
    { title: 'Practice loops and functions', difficulty: 'easy' },
    { title: 'Create a file organizer plan', difficulty: 'easy' },
    { title: 'Work with lists and dictionaries', difficulty: 'medium' },
    { title: 'Build a number guessing game', difficulty: 'medium' },
    { title: 'Read and write a simple text file', difficulty: 'hard' }
  ],
  java: [
    { title: 'Practice classes and objects', difficulty: 'medium' },
    { title: 'Build a console menu', difficulty: 'medium' },
    { title: 'Understand inheritance', difficulty: 'medium' },
    { title: 'Use ArrayList', difficulty: 'medium' },
    { title: 'Practice methods', difficulty: 'easy' },
    { title: 'Build a simple student manager', difficulty: 'hard' }
  ],
  c: [
    { title: 'Print formatted output', difficulty: 'easy' },
    { title: 'Practice variables and types', difficulty: 'easy' },
    { title: 'Write a loop-based calculator', difficulty: 'medium' },
    { title: 'Use arrays for simple scores', difficulty: 'medium' },
    { title: 'Practice functions', difficulty: 'medium' },
    { title: 'Build a number guessing game', difficulty: 'hard' }
  ],
  cpp: [
    { title: 'Practice input and output streams', difficulty: 'easy' },
    { title: 'Create a simple class', difficulty: 'medium' },
    { title: 'Use vectors for a list of names', difficulty: 'medium' },
    { title: 'Practice constructors', difficulty: 'medium' },
    { title: 'Build a console menu', difficulty: 'medium' },
    { title: 'Create a small inventory manager', difficulty: 'hard' }
  ],
  csharp: [
    { title: 'Create a console hello world', difficulty: 'easy' },
    { title: 'Practice methods and parameters', difficulty: 'easy' },
    { title: 'Build a simple class model', difficulty: 'medium' },
    { title: 'Use List for task records', difficulty: 'medium' },
    { title: 'Practice properties', difficulty: 'medium' },
    { title: 'Build a student grade tracker', difficulty: 'hard' }
  ],
  php: [
    { title: 'Create a simple PHP page', difficulty: 'easy' },
    { title: 'Practice arrays and loops', difficulty: 'easy' },
    { title: 'Handle a basic form submission', difficulty: 'medium' },
    { title: 'Render a list from data', difficulty: 'medium' },
    { title: 'Create reusable include files', difficulty: 'medium' },
    { title: 'Build a small contact form flow', difficulty: 'hard' }
  ],
  sql: [
    { title: 'Write basic SELECT queries', difficulty: 'easy' },
    { title: 'Filter rows with WHERE', difficulty: 'easy' },
    { title: 'Sort and limit query results', difficulty: 'medium' },
    { title: 'Practice aggregate functions', difficulty: 'medium' },
    { title: 'Join two related tables', difficulty: 'medium' },
    { title: 'Design a small reporting query', difficulty: 'hard' }
  ],
  mysql: [
    { title: 'Create a database and table', difficulty: 'easy' },
    { title: 'Insert sample records', difficulty: 'easy' },
    { title: 'Update and delete rows safely', difficulty: 'medium' },
    { title: 'Create indexes for lookup fields', difficulty: 'medium' },
    { title: 'Write a grouped report query', difficulty: 'medium' },
    { title: 'Model a simple app schema', difficulty: 'hard' }
  ],
  mongodb: [
    { title: 'Create a collection of documents', difficulty: 'easy' },
    { title: 'Insert sample documents', difficulty: 'easy' },
    { title: 'Find documents with filters', difficulty: 'medium' },
    { title: 'Update nested document fields', difficulty: 'medium' },
    { title: 'Practice aggregation basics', difficulty: 'medium' },
    { title: 'Design a small document schema', difficulty: 'hard' }
  ],
  gitgithub: [
    { title: 'Initialize a Git repository', difficulty: 'easy' },
    { title: 'Make clear commits', difficulty: 'easy' },
    { title: 'Create and switch branches', difficulty: 'medium' },
    { title: 'Open a pull request checklist', difficulty: 'medium' },
    { title: 'Resolve a simple merge conflict', difficulty: 'medium' },
    { title: 'Publish a project to GitHub', difficulty: 'hard' }
  ]
};

// ============================================================================
// State Management
// ============================================================================

const state = {
  skills: [],
  tasks: [],
  missions: [],
  badges: [],
  roadmapItems: [],
  streakData: {},
  currentView: 'dashboard',
  filters: {
    skill: 'all',
    difficulty: 'all',
    status: 'all',
    search: ''
  },
  editingTaskId: null,
  theme: 'light',
  toastTimer: null
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
const generateId = () => `sq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Escape HTML to prevent XSS
 * @param {string} value - String to escape
 * @returns {string} Escaped string
 */
const escapeHtml = (value = '') => {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
};

/**
 * Get today's date key in YYYY-MM-DD format
 * @param {Date} [date=new Date()] - Date object
 * @returns {string} Date key
 */
const todayKey = (date = new Date()) => date.toISOString().slice(0, 10);

/**
 * Check if a date string is from today
 * @param {string} dateString - ISO date string
 * @returns {boolean} Whether the date is today
 */
const isToday = (dateString) => {
  if (!dateString) return false;
  try {
    return todayKey(new Date(dateString)) === todayKey();
  } catch {
    return false;
  }
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Not yet';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Calculate skill level from XP
 * @param {number} xp - Total XP
 * @returns {number} Skill level
 */
const calculateLevel = (xp) => {
  return LEVEL_THRESHOLDS.reduce((level, threshold) => 
    xp >= threshold.minXp ? threshold.level : level, 1);
};

/**
 * Get XP range for current level
 * @param {number} level - Current level
 * @returns {Object} Min and next XP thresholds
 */
const getXpForNextLevel = (level) => {
  const current = LEVEL_THRESHOLDS.find(t => t.level === level);
  const next = LEVEL_THRESHOLDS.find(t => t.level === level + 1);
  return {
    currentMin: current ? current.minXp : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].minXp,
    nextMin: next ? next.minXp : null
  };
};

/**
 * Calculate skill progress percentage
 * @param {Object} skill - Skill object
 * @returns {Object} Progress percentage and XP needed
 */
const calculateSkillProgress = (skill) => {
  const range = getXpForNextLevel(skill.level);
  if (!range.nextMin) return { percent: 100, xpNeeded: 0 };
  const percent = ((skill.xp - range.currentMin) / (range.nextMin - range.currentMin)) * 100;
  return {
    percent: Math.max(0, Math.min(100, percent)),
    xpNeeded: Math.max(0, range.nextMin - skill.xp)
  };
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// ============================================================================
// Default Data
// ============================================================================

const getDefaultSkills = () => {
  const timestamp = new Date().toISOString();
  return [
    { id: 'html', name: 'HTML', icon: 'H', xp: 0, level: 1, color: '#e76f51', 
      description: 'Semantic structure, forms, and accessibility.', createdAt: timestamp },
    { id: 'css', name: 'CSS', icon: 'C', xp: 0, level: 1, color: '#2f80ed', 
      description: 'Layouts, responsive design, and visual polish.', createdAt: timestamp },
    { id: 'javascript', name: 'JavaScript', icon: 'JS', xp: 0, level: 1, color: '#c99400', 
      description: 'DOM, events, state, and small browser apps.', createdAt: timestamp },
    { id: 'typescript', name: 'TypeScript', icon: 'TS', xp: 0, level: 1, color: '#3178c6',
      description: 'Typed JavaScript, interfaces, and safer app logic.', createdAt: timestamp },
    { id: 'react', name: 'React', icon: 'R', xp: 0, level: 1, color: '#4fb8d8',
      description: 'Components, props, state, forms, and reusable UI.', createdAt: timestamp },
    { id: 'nodejs', name: 'Node.js', icon: 'N', xp: 0, level: 1, color: '#3c873a',
      description: 'Server-side JavaScript, scripts, files, and HTTP basics.', createdAt: timestamp },
    { id: 'express', name: 'Express', icon: 'EX', xp: 0, level: 1, color: '#6b7280',
      description: 'Routes, middleware, validation, and lightweight APIs.', createdAt: timestamp },
    { id: 'python', name: 'Python', icon: 'PY', xp: 0, level: 1, color: '#20966f', 
      description: 'Functions, scripts, loops, and automation thinking.', createdAt: timestamp },
    { id: 'java', name: 'Java', icon: 'J', xp: 0, level: 1, color: '#7b61ff', 
      description: 'Object-oriented programming and console projects.', createdAt: timestamp },
    { id: 'c', name: 'C', icon: 'C', xp: 0, level: 1, color: '#5c6bc0',
      description: 'Core programming, functions, arrays, and memory basics.', createdAt: timestamp },
    { id: 'cpp', name: 'C++', icon: 'C++', xp: 0, level: 1, color: '#4078c0',
      description: 'Classes, vectors, constructors, and console applications.', createdAt: timestamp },
    { id: 'csharp', name: 'C#', icon: 'C#', xp: 0, level: 1, color: '#8b5cf6',
      description: 'Methods, classes, lists, properties, and .NET fundamentals.', createdAt: timestamp },
    { id: 'php', name: 'PHP', icon: 'PHP', xp: 0, level: 1, color: '#777bb4',
      description: 'Server-rendered pages, forms, arrays, and includes.', createdAt: timestamp },
    { id: 'sql', name: 'SQL', icon: 'SQL', xp: 0, level: 1, color: '#0f766e',
      description: 'Queries, filtering, joins, aggregates, and reporting.', createdAt: timestamp },
    { id: 'mysql', name: 'MySQL', icon: 'MY', xp: 0, level: 1, color: '#00758f',
      description: 'Tables, records, indexes, schemas, and relational data.', createdAt: timestamp },
    { id: 'mongodb', name: 'MongoDB', icon: 'MDB', xp: 0, level: 1, color: '#13aa52',
      description: 'Documents, collections, filters, updates, and aggregation.', createdAt: timestamp },
    { id: 'gitgithub', name: 'Git/GitHub', icon: 'Git', xp: 0, level: 1, color: '#f05032',
      description: 'Repositories, commits, branches, pull requests, and publishing.', createdAt: timestamp }
  ];
};

const getDefaultTasks = () => {
  const timestamp = new Date().toISOString();
  return Object.entries(QUEST_PRESETS).flatMap(([skillId, presets]) =>
    presets.map((preset, index) => ({
      id: `default-${skillId}-${index + 1}`,
      skillId,
      title: preset.title,
      description: '',
      xpReward: XP_BY_DIFFICULTY[preset.difficulty],
      difficulty: preset.difficulty,
      completed: false,
      createdAt: timestamp,
      completedAt: ''
    }))
  );
};

const getDefaultMissions = () => {
  const timestamp = new Date().toISOString();
  return [
    { id: 'mission-complete-five', title: 'Complete 5 quests',
      description: 'Finish five learning quests across any skill.',
      targetCount: 5, currentCount: 0, xpReward: 100, completed: false, 
      rewardClaimed: false, createdAt: timestamp },
    { id: 'mission-earn-250', title: 'Earn 250 XP',
      description: 'Accumulate 250 XP from completed quests.',
      targetCount: 250, currentCount: 0, xpReward: 120, completed: false,
      rewardClaimed: false, createdAt: timestamp },
    { id: 'mission-js-task', title: 'Complete a JavaScript quest',
      description: 'Finish one JavaScript quest.',
      targetCount: 1, currentCount: 0, xpReward: 75, completed: false,
      rewardClaimed: false, createdAt: timestamp },
    { id: 'mission-streak-three', title: 'Update streak 3 times',
      description: 'Track three commit updates manually.',
      targetCount: 3, currentCount: 0, xpReward: 80, completed: false,
      rewardClaimed: false, createdAt: timestamp }
  ];
};

const getDefaultBadges = () => [
  { id: 'badge-first-quest', title: 'First Quest', description: 'Complete your first learning quest.',
    icon: '🏅', unlocked: false, unlockedAt: '', requirement: 'Complete 1 quest' },
  { id: 'badge-500xp', title: '500 XP', description: 'Earn 500 total XP.',
    icon: '⭐', unlocked: false, unlockedAt: '', requirement: 'Reach 500 total XP' },
  { id: 'badge-roadmap', title: 'Roadmap Started', description: 'Check your first roadmap item.',
    icon: '🗺️', unlocked: false, unlockedAt: '', requirement: 'Complete 1 roadmap item' },
  { id: 'badge-streak', title: '7 Day Streak', description: 'Track a seven day streak.',
    icon: '🔥', unlocked: false, unlockedAt: '', requirement: 'Reach 7 current streak' },
  { id: 'badge-level-five', title: 'Level 5', description: 'Raise any skill to level 5.',
    icon: '🎯', unlocked: false, unlockedAt: '', requirement: 'Reach level 5 in any skill' }
];

const getDefaultRoadmap = () => {
  const sections = {
    'Front-End Foundations': ['Learn semantic HTML', 'Learn responsive CSS', 'Build landing pages', 'Practice accessibility basics'],
    'JavaScript Practice': ['DOM manipulation', 'LocalStorage', 'Events', 'Arrays and objects', 'Small apps'],
    'Backend and Data': ['Learn Node.js later', 'Understand APIs later', 'Learn SQL concepts'],
    'Git and GitHub': ['Create repositories', 'Write README files', 'Push projects'],
    'Projects and Deployment': ['Build 5 portfolio projects', 'Deploy static sites']
  };

  let counter = 1;
  return Object.entries(sections).flatMap(([section, titles]) =>
    titles.map(title => ({
      id: `roadmap-${counter++}`,
      section,
      title,
      completed: false
    }))
  );
};

const getDefaultStreak = () => ({
  currentStreak: 0,
  longestStreak: 0,
  totalCommitsThisWeek: 0,
  lastUpdated: ''
});

// ============================================================================
// API Storage Operations
// ============================================================================

const createDefaultState = () => ({
  skills: getDefaultSkills(),
  tasks: getDefaultTasks(),
  missions: getDefaultMissions(),
  badges: getDefaultBadges(),
  roadmapItems: getDefaultRoadmap(),
  streakData: getDefaultStreak()
});

const normalizeApiState = (apiState = {}) => {
  const defaults = createDefaultState();

  return {
    skills: Array.isArray(apiState.skills) && apiState.skills.length
      ? apiState.skills
      : defaults.skills,
    tasks: Array.isArray(apiState.tasks) && apiState.tasks.length
      ? apiState.tasks
      : defaults.tasks,
    missions: Array.isArray(apiState.missions) && apiState.missions.length
      ? apiState.missions.map(mission => ({ rewardClaimed: false, ...mission }))
      : defaults.missions,
    badges: Array.isArray(apiState.badges) && apiState.badges.length
      ? apiState.badges
      : defaults.badges,
    roadmapItems: Array.isArray(apiState.roadmapItems) && apiState.roadmapItems.length
      ? apiState.roadmapItems
      : defaults.roadmapItems,
    streakData: apiState.streakData && Object.keys(apiState.streakData).length
      ? apiState.streakData
      : defaults.streakData
  };
};

const applyServerState = (apiState) => {
  Object.assign(state, normalizeApiState(apiState));
  ensureDefaultSkills();
};

const apiRequest = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return data;
};

/**
 * Load app data from the Express API. LocalStorage is kept for theme only.
 */
const loadAppState = async () => {
  state.theme = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  document.body.classList.toggle('dark-theme', state.theme === 'dark');

  try {
    const response = await fetch(`${API_BASE}/state`);
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    applyServerState(await response.json());
  } catch (error) {
    console.error('Error loading API state:', error);
    Object.assign(state, createDefaultState());
    showToast('Using default data because the API is unavailable.');
  }

};

/**
 * Legacy full-state save endpoint. Normal user actions use resource routes.
 */
const saveAll = async () => {
  try {
    await fetch(`${API_BASE}/state`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skills: state.skills,
        tasks: state.tasks,
        missions: state.missions,
        badges: state.badges,
        roadmapItems: state.roadmapItems,
        streakData: state.streakData
      })
    });
  } catch (error) {
    console.error('Error saving API state:', error);
    showToast('Failed to save data to the server.');
  }
};

/**
 * Add new built-in skills without replacing user progress
 */
const ensureDefaultSkills = () => {
  const existingIds = new Set(state.skills.map(skill => skill.id));
  const missingSkills = getDefaultSkills().filter(skill => !existingIds.has(skill.id));
  if (missingSkills.length) {
    state.skills = [...state.skills, ...missingSkills];
  }
};

// ============================================================================
// Data Operations
// ============================================================================

/**
 * Get skill by ID
 * @param {string} skillId - Skill ID
 * @returns {Object|undefined} Skill object
 */
const getSkillById = (skillId) => state.skills.find(skill => skill.id === skillId);

/**
 * Get total XP across all skills
 * @returns {number} Total XP
 */
const getTotalXp = () => state.skills.reduce((total, skill) => total + skill.xp, 0);

/**
 * Get completed tasks
 * @returns {Array} Completed tasks
 */
const getCompletedTasks = () => state.tasks.filter(task => task.completed);

/**
 * Get today's tasks
 * @returns {Array} Tasks from today
 */
const getTodayTasks = () => state.tasks.filter(task => 
  isToday(task.createdAt) || isToday(task.completedAt)
);

/**
 * Get tasks completed today
 * @returns {Array} Today's completed tasks
 */
const getTodayCompletedTasks = () => state.tasks.filter(task => 
  task.completed && isToday(task.completedAt)
);

/**
 * Get daily statistics
 * @returns {Object} Daily stats
 */
const getDailyStats = () => {
  const completedToday = getTodayCompletedTasks();
  const activeTasks = state.tasks.filter(task => !task.completed);
  const total = activeTasks.length || state.tasks.length || 1;
  
  return {
    completed: completedToday.length,
    total,
    percent: Math.round((completedToday.length / total) * 100)
  };
};

/**
 * Get top skill by XP
 * @returns {Object} Top skill
 */
const getTopSkill = () => {
  return [...state.skills].sort((a, b) => b.xp - a.xp)[0] || 
    { name: 'None', xp: 0, level: 1 };
};

/**
 * Get next incomplete task
 * @returns {Object|null} Next task
 */
const getNextTask = () => {
  return state.tasks.find(task => isToday(task.createdAt) && !task.completed) ||
         state.tasks.find(task => !task.completed) ||
         null;
};

/**
 * Update skill XP and level
 * @param {string} skillId - Skill ID
 * @param {number} xpAmount - XP to add (can be negative)
 */
const updateSkillXp = (skillId, xpAmount) => {
  const skill = getSkillById(skillId);
  if (!skill || xpAmount === 0) return;
  
  skill.xp = Math.max(0, skill.xp + xpAmount);
  skill.level = calculateLevel(skill.xp);
};

/**
 * Unlock a badge
 * @param {string} badgeId - Badge ID
 * @returns {string|null} Badge name or null
 */
const unlockBadge = (badgeId) => {
  const badge = state.badges.find(b => b.id === badgeId);
  if (!badge || badge.unlocked) return null;
  
  badge.unlocked = true;
  badge.unlockedAt = new Date().toISOString();
  return badge.title;
};

/**
 * Check and unlock eligible badges
 * @returns {string[]} Newly unlocked badge names
 */
const checkBadgeUnlocks = () => {
  const completedTasks = getCompletedTasks();
  const newlyUnlocked = [];
  
  // First quest badge
  if (completedTasks.length >= 1) {
    const badge = unlockBadge('badge-first-quest');
    if (badge) newlyUnlocked.push(badge);
  }
  
  // Skill-specific badges
  ['html', 'css', 'javascript', 'python', 'java'].forEach(skillId => {
    if (completedTasks.some(task => task.skillId === skillId)) {
      const badge = unlockBadge(`badge-${skillId}`);
      if (badge) newlyUnlocked.push(badge);
    }
  });
  
  // XP badges
  if (getTotalXp() >= 500) {
    const badge = unlockBadge('badge-500xp');
    if (badge) newlyUnlocked.push(badge);
  }
  
  // Roadmap badge
  if (state.roadmapItems.some(item => item.completed)) {
    const badge = unlockBadge('badge-roadmap');
    if (badge) newlyUnlocked.push(badge);
  }
  
  // Streak badge
  if (state.streakData.currentStreak >= 7) {
    const badge = unlockBadge('badge-streak');
    if (badge) newlyUnlocked.push(badge);
  }
  
  // Level 5 badge
  if (state.skills.some(skill => skill.level >= 5)) {
    const badge = unlockBadge('badge-level-five');
    if (badge) newlyUnlocked.push(badge);
  }
  
  return newlyUnlocked;
};

/**
 * Update mission progress
 */
const updateMissionProgress = () => {
  const completedTasks = getCompletedTasks();
  const totalXp = completedTasks.reduce((sum, task) => sum + task.xpReward, 0);
  const jsTasks = completedTasks.filter(task => task.skillId === 'javascript').length;
  
  const countMap = {
    'mission-complete-five': completedTasks.length,
    'mission-earn-250': totalXp,
    'mission-js-task': jsTasks,
    'mission-streak-three': Math.min(state.streakData.totalCommitsThisWeek, 3)
  };
  
  state.missions = state.missions.map(mission => {
    const currentCount = countMap[mission.id] ?? mission.currentCount;
    const completed = currentCount >= mission.targetCount;
    
    if (!mission.rewardClaimed && completed) {
      updateSkillXp(getTopSkill().id, mission.xpReward);
    }
    
    return {
      ...mission,
      currentCount,
      completed,
      rewardClaimed: mission.rewardClaimed || completed
    };
  });
};

/**
 * Get filtered tasks based on current filters
 * @returns {Array} Filtered tasks
 */
const getVisibleTasks = () => {
  const searchLower = state.filters.search.toLowerCase();
  
  return [...state.tasks]
    .sort((a, b) => Number(a.completed) - Number(b.completed) || 
                  new Date(b.createdAt) - new Date(a.createdAt))
    .filter(task => {
      const skillName = getSkillById(task.skillId)?.name || '';
      const searchable = `${task.title} ${task.description || ''} ${skillName}`.toLowerCase();
      
      const matchesSearch = !state.filters.search || searchable.includes(searchLower);
      const matchesSkill = state.filters.skill === 'all' || task.skillId === state.filters.skill;
      const matchesDifficulty = state.filters.difficulty === 'all' || task.difficulty === state.filters.difficulty;
      
      const matchesStatus = state.filters.status === 'all' ||
        (state.filters.status === 'today' && (isToday(task.createdAt) || isToday(task.completedAt))) ||
        (state.filters.status === 'active' && !task.completed) ||
        (state.filters.status === 'completed' && task.completed);
      
      return matchesSearch && matchesSkill && matchesDifficulty && matchesStatus;
    });
};

// ============================================================================
// User Actions
// ============================================================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 */
const showToast = (message) => {
  const toast = document.getElementById('feedbackToast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.remove('hidden');
  
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2800);
};

/**
 * Perform complete data refresh after changes
 * @param {string} [message=''] - Toast message
 */
const completeDataRefresh = (message = '') => {
  renderApp();
  if (message) {
    showToast(message);
  }
};

/**
 * Add a new task
 * @param {Object} taskData - Task data
 */
const addTask = async (taskData) => {
  try {
    applyServerState(await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    }));
    completeDataRefresh('✅ Quest added successfully!');
  } catch (error) {
    showToast(error.message);
  }
};

/**
 * Edit an existing task
 * @param {string} taskId - Task ID
 * @param {Object} taskData - Updated task data
 */
const editTask = async (taskId, taskData) => {
  try {
    applyServerState(await apiRequest(`/tasks/${encodeURIComponent(taskId)}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    }));
    completeDataRefresh('✏️ Quest updated successfully!');
  } catch (error) {
    showToast(error.message);
  }
};

/**
 * Delete a task
 * @param {string} taskId - Task ID
 */
const deleteTask = async (taskId) => {
  try {
    applyServerState(await apiRequest(`/tasks/${encodeURIComponent(taskId)}`, {
      method: 'DELETE'
    }));
    completeDataRefresh('🗑️ Quest deleted.');
  } catch (error) {
    showToast(error.message);
  }
};

/**
 * Toggle task completion
 * @param {string} taskId - Task ID
 */
const toggleTaskComplete = async (taskId) => {
  const task = state.tasks.find(item => item.id === taskId);
  try {
    applyServerState(await apiRequest(`/tasks/${encodeURIComponent(taskId)}/toggle`, {
      method: 'PATCH'
    }));
    const message = task && !task.completed
      ? `🎉 +${task.xpReward} XP gained! Keep it up!`
      : `↩️ ${task?.xpReward || 0} XP removed. You can do it!`;
    completeDataRefresh(message);
  } catch (error) {
    showToast(error.message);
  }
};

/**
 * Add a new skill
 * @param {Object} skillData - Skill data
 */
const addSkill = async (skillData) => {
  try {
    applyServerState(await apiRequest('/skills', {
      method: 'POST',
      body: JSON.stringify(skillData)
    }));
    completeDataRefresh('🎯 New skill added!');
  } catch (error) {
    showToast(error.message);
  }
};

/**
 * Toggle roadmap item completion
 * @param {string} itemId - Roadmap item ID
 */
const toggleRoadmapItem = async (itemId) => {
  try {
    applyServerState(await apiRequest(`/roadmap/${encodeURIComponent(itemId)}/toggle`, {
      method: 'PATCH'
    }));
    completeDataRefresh('🗺️ Roadmap updated!');
  } catch (error) {
    showToast(error.message);
  }
};

/**
 * Update streak data
 * @param {string} action - Action to perform
 * @param {*} [value=null] - Optional value
 */
const updateStreak = async (action, value = null) => {
  try {
    applyServerState(await apiRequest('/streak', {
      method: 'PATCH',
      body: JSON.stringify({ action, totalCommitsThisWeek: value })
    }));
    const messages = {
      commit: '🔥 Streak updated! Keep going!',
      'manual-weekly': '📊 Weekly commits updated!',
      reset: '🔄 Streak reset. Time for a new beginning!'
    };
    completeDataRefresh(messages[action] || 'Streak updated.');
  } catch (error) {
    showToast(error.message);
  }
};

// ============================================================================
// Form Handling
// ============================================================================

/**
 * Show form error
 * @param {string} fieldName - Field name
 * @param {string} message - Error message
 */
const showFormError = (fieldName, message) => {
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');
  }
};

/**
 * Clear all form errors
 */
const clearFormErrors = () => {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.removeAttribute('role');
  });
};

const getQuestPresetsForSkill = (skillId) => QUEST_PRESETS[skillId] || [];

const getSelectedQuestPreset = () => {
  const skillId = document.getElementById('taskSkill')?.value || '';
  const presetIndex = document.getElementById('taskPreset')?.value || '';
  const presets = getQuestPresetsForSkill(skillId);
  const preset = presets[Number(presetIndex)];
  return preset ? { ...preset, skillId } : null;
};

const updateQuestRewardPreview = (preset = null) => {
  const difficultyPreview = document.getElementById('taskDifficultyPreview');
  const xpPreview = document.getElementById('taskXpReward');
  const difficulty = preset?.difficulty;
  const xpReward = difficulty ? XP_BY_DIFFICULTY[difficulty] : 0;
  
  if (difficultyPreview) {
    difficultyPreview.textContent = difficulty 
      ? (DIFFICULTY_CONFIG[difficulty]?.label || difficulty)
      : 'Select a quest';
  }
  if (xpPreview) {
    xpPreview.textContent = `${xpReward} XP`;
  }
};

const populateQuestPresetSelect = (skillId, selectedTitle = '') => {
  const questSelect = document.getElementById('taskPreset');
  if (!questSelect) return;
  
  const presets = getQuestPresetsForSkill(skillId);
  questSelect.disabled = !skillId;
  
  if (!skillId) {
    questSelect.innerHTML = '<option value="">Select a skill first</option>';
    updateQuestRewardPreview();
    return;
  }
  
  const selectedIndex = presets.findIndex(preset => preset.title === selectedTitle);
  const hasTemporaryOption = selectedTitle && selectedIndex === -1;
  
  questSelect.innerHTML = '<option value="">Select a quest</option>' +
    presets.map((preset, index) => `
      <option value="${index}" ${index === selectedIndex ? 'selected' : ''}>
        ${escapeHtml(preset.title)}
      </option>
    `).join('') +
    (hasTemporaryOption ? `<option value="custom" selected>${escapeHtml(selectedTitle)} (current quest)</option>` : '');
  
  updateQuestRewardPreview(selectedIndex >= 0 ? presets[selectedIndex] : null);
};

/**
 * Validate task form
 * @returns {boolean} Whether form is valid
 */
const validateTaskForm = () => {
  clearFormErrors();
  let isValid = true;
  
  const skill = document.getElementById('taskSkill');
  if (!skill.value) {
    showFormError('skillId', 'Please select a skill.');
    if (isValid) skill.focus();
    isValid = false;
  }
  
  const quest = document.getElementById('taskPreset');
  if (!quest.value) {
    showFormError('presetQuest', 'Please select a quest.');
    if (isValid) quest.focus();
    isValid = false;
  }
  
  return isValid;
};

/**
 * Validate skill form
 * @returns {boolean} Whether form is valid
 */
const validateSkillForm = () => {
  clearFormErrors();
  
  const name = document.getElementById('skillName');
  if (name.value.trim()) return true;
  
  showFormError('skillName', 'Skill name is required.');
  name.focus();
  return false;
};

/**
 * Reset task form
 */
const resetTaskForm = () => {
  state.editingTaskId = null;
  document.getElementById('taskForm').reset();
  document.getElementById('taskModalTitle').textContent = 'Add Quest';
  document.getElementById('saveTaskButton').innerHTML = '<span class="button-icon">💾</span> Save Quest';
  populateQuestPresetSelect('');
  clearFormErrors();
};

/**
 * Populate task form for editing
 * @param {string} taskId - Task ID
 */
const populateTaskForm = (taskId) => {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  
  state.editingTaskId = task.id;
  document.getElementById('taskSkill').value = task.skillId;
  populateQuestPresetSelect(task.skillId, task.title);
  document.getElementById('taskModalTitle').textContent = 'Edit Quest';
  document.getElementById('saveTaskButton').innerHTML = '<span class="button-icon">✏️</span> Update Quest';
  
  if (document.getElementById('taskPreset').value === 'custom') {
    updateQuestRewardPreview({ difficulty: task.difficulty });
  }
};

/**
 * Open task modal
 * @param {string|null} [taskId=null] - Task ID for editing
 */
const openTaskModal = (taskId = null) => {
  const modal = document.getElementById('taskModal');
  resetTaskForm();
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  
  if (taskId) populateTaskForm(taskId);
  
  document.getElementById('taskSkill').focus();
  
  // Trap focus in modal
  modal.addEventListener('keydown', trapFocusInModal);
};

/**
 * Close task modal
 */
const closeTaskModal = () => {
  const modal = document.getElementById('taskModal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  modal.removeEventListener('keydown', trapFocusInModal);
  resetTaskForm();
};

/**
 * Open skill modal
 */
const openSkillModal = () => {
  const modal = document.getElementById('skillModal');
  document.getElementById('skillForm').reset();
  document.getElementById('skillColor').value = '#3b72f6';
  clearFormErrors();
  
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('skillName').focus();
};

/**
 * Close skill modal
 */
const closeSkillModal = () => {
  const modal = document.getElementById('skillModal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  clearFormErrors();
};

/**
 * Trap focus within modal
 * @param {KeyboardEvent} event - Keyboard event
 */
const trapFocusInModal = (event) => {
  if (event.key !== 'Tab') return;
  
  const modal = document.getElementById('taskModal');
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  if (event.shiftKey) {
    if (document.activeElement === firstFocusable) {
      lastFocusable.focus();
      event.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      firstFocusable.focus();
      event.preventDefault();
    }
  }
};

// ============================================================================
// Rendering
// ============================================================================

/**
 * Render main view header
 */
const renderHeader = () => {
  const configs = {
    dashboard: { 
      title: 'Daily Dashboard', 
      desc: 'Focus on today, complete quests, and keep momentum visible.',
      action: '' 
    },
    tasks: { 
      title: 'Quests', 
      desc: 'Search, filter, complete, edit, or delete learning quests.',
      action: '<button class="primary-button" id="openAddTaskButton" type="button"><span class="button-icon">➕</span> Add Quest</button>'
    },
    skills: { 
      title: 'Skills', 
      desc: 'Each skill gains XP and levels from completed quests.',
      action: '<button class="primary-button" id="openAddSkillButton" type="button"><span class="button-icon">🎯</span> Add Skill</button>'
    },
    roadmap: { 
      title: 'Roadmap', 
      desc: 'A compact checklist for the larger learning path.',
      action: '' 
    },
    badges: { 
      title: 'Badges', 
      desc: 'Small milestones unlocked by progress.',
      action: '' 
    },
    missions: { 
      title: 'Missions', 
      desc: 'Bonus goals that reward consistency.',
      action: '' 
    },
    streak: { 
      title: 'Streak', 
      desc: 'Manual offline tracking for consistency.',
      action: '' 
    }
  };
  
  const config = configs[state.currentView] || configs.dashboard;
  
  document.getElementById('viewHeader').innerHTML = `
    <div class="view-header-copy">
      <p class="eyebrow">${escapeHtml(state.currentView)}</p>
      <h1>${escapeHtml(config.title)}</h1>
      <p class="helper-text">${escapeHtml(config.desc)}</p>
    </div>
    <div class="section-actions">${config.action}</div>
  `;
};

/**
 * Render dashboard view
 * @returns {string} HTML string
 */
const renderDashboard = () => {
  const daily = getDailyStats();
  const nextTask = getNextTask();
  const topSkill = getTopSkill();
  
  return `
    <section class="daily-progress-card" aria-label="Daily progress">
      <div class="daily-progress-top">
        <div>
          <p class="eyebrow">Today's Progress</p>
          <h2 class="section-heading">Daily progress</h2>
          <p class="helper-text">${daily.completed} of ${daily.total} quests completed today.</p>
        </div>
        <div class="daily-progress-number">${daily.percent}%</div>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${daily.percent}%" 
             role="progressbar" aria-valuenow="${daily.percent}" 
             aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </section>

    <section class="focus-card dashboard-focus" aria-label="Today's focus">
      <p class="eyebrow">Today's Focus</p>
      ${nextTask ? renderTaskSummary(nextTask, true) : `
        <h2 class="card-title">No active quests yet</h2>
        <p class="helper-text">Create one clear learning quest for today and keep the workspace focused.</p>
        <div class="section-actions">
          <button class="primary-button" id="openAddTaskButton" type="button">
            <span class="button-icon">➕</span> Add Quest
          </button>
        </div>
      `}
    </section>

    <section class="dashboard-stats" aria-label="Learning summary">
      <article class="summary-card">
        <p class="eyebrow">Done Today</p>
        <div class="summary-value">${daily.completed}</div>
        <p class="meta-text">quests completed</p>
      </article>
      <article class="summary-card">
        <p class="eyebrow">Active Quests</p>
        <div class="summary-value">${state.tasks.filter(t => !t.completed).length}</div>
        <p class="meta-text">waiting for you</p>
      </article>
      <article class="summary-card">
        <p class="eyebrow">Total XP</p>
        <div class="summary-value">${getTotalXp()}</div>
        <p class="meta-text">earned so far</p>
      </article>
      <article class="summary-card">
        <p class="eyebrow">Top Skill</p>
        <div class="summary-value" style="color: ${topSkill.color || 'var(--accent)'}">
          ${escapeHtml(topSkill.name)}
        </div>
        <p class="meta-text">Level ${topSkill.level}</p>
      </article>
    </section>
  `;
};

/**
 * Render task summary (used in focus card)
 * @param {Object} task - Task object
 * @param {boolean} [includeAction=false] - Whether to include action buttons
 * @returns {string} HTML string
 */
const renderTaskSummary = (task, includeAction = false) => {
  const skill = getSkillById(task.skillId) || {};
  
  return `
    <h2 class="card-title">${escapeHtml(task.title)}</h2>
    ${task.description ? `<p class="helper-text">${escapeHtml(task.description)}</p>` : ''}
    <div class="pill-row">
      <span class="skill-pill" style="color:${skill.color};">${escapeHtml(skill.name)}</span>
      <span class="difficulty-pill ${task.difficulty}">${DIFFICULTY_CONFIG[task.difficulty]?.label || task.difficulty}</span>
      <span class="xp-pill">${task.xpReward} XP</span>
    </div>
    ${includeAction ? `
      <div class="section-actions">
        <button class="primary-button" id="openAddTaskButton" type="button">
          <span class="button-icon">➕</span> Add Quest
        </button>
        <button class="secondary-button complete-task-button" type="button" data-task-id="${task.id}">
          ${task.completed ? '↩️ Mark Active' : '✅ Complete Quest'}
        </button>
      </div>
    ` : ''}
  `;
};

/**
 * Render skill card
 * @param {Object} skill - Skill object
 * @returns {string} HTML string
 */
const renderSkillCard = (skill) => {
  const progress = calculateSkillProgress(skill);
  const completedCount = state.tasks.filter(t => t.skillId === skill.id && t.completed).length;
  
  return `
    <article class="skill-card" tabindex="0">
      <div class="skill-topline">
        <div class="skill-icon" style="background: ${skill.color}20; color: ${skill.color};">
          ${escapeHtml(skill.icon)}
        </div>
        <span class="level-badge">Level ${skill.level}</span>
      </div>
      <div>
        <h2 class="card-title">${escapeHtml(skill.name)}</h2>
        <p class="helper-text">${escapeHtml(skill.description)}</p>
      </div>
      <div class="skill-stats">
        <span class="xp-pill">${skill.xp} XP</span>
        <span class="skill-pill">${completedCount} quests done</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${progress.percent}%; background:${skill.color};" 
             role="progressbar" aria-valuenow="${Math.round(progress.percent)}" 
             aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <p class="meta-text">
        ${progress.xpNeeded ? `${progress.xpNeeded} XP to next level` : 'Max level reached! 🎉'}
      </p>
      <button class="secondary-button view-skill-tasks-button" type="button" 
              data-skill-id="${skill.id}">
        View Quests
      </button>
    </article>
  `;
};

/**
 * Render task card
 * @param {Object} task - Task object
 * @returns {string} HTML string
 */
const renderTaskCard = (task) => {
  const skill = getSkillById(task.skillId) || {};
  
  return `
    <article class="task-card ${task.completed ? 'completed' : ''}" tabindex="0">
      <div class="task-topline">
        <div class="task-title-wrap">
          <input class="task-check" type="checkbox" ${task.completed ? 'checked' : ''} 
                 data-task-id="${task.id}" 
                 aria-label="Toggle completion for ${escapeHtml(task.title)}">
          <div>
            <h3 class="card-title task-title">${escapeHtml(task.title)}</h3>
            ${task.description ? `<p class="helper-text">${escapeHtml(task.description)}</p>` : ''}
          </div>
        </div>
        <span class="status-badge ${task.completed ? 'complete' : ''}">
          ${task.completed ? '✅ Completed' : '🔄 Active'}
        </span>
      </div>
      <div class="pill-row">
        <span class="skill-pill" style="color:${skill.color};">${escapeHtml(skill.name)}</span>
        <span class="difficulty-pill ${task.difficulty}">
          ${DIFFICULTY_CONFIG[task.difficulty]?.label || task.difficulty}
        </span>
        <span class="xp-pill">${task.xpReward} XP</span>
      </div>
      <div class="detail-list">
        <span class="meta-text">Created ${formatDate(task.createdAt)}</span>
        <span class="meta-text">
          ${task.completed ? `Completed ${formatDate(task.completedAt)}` : 'Not completed yet'}
        </span>
      </div>
      <div class="task-actions">
        <button class="ghost-button edit-task-button" type="button" data-task-id="${task.id}">
          ✏️ Edit
        </button>
        <button class="ghost-button delete-task-button" type="button" data-task-id="${task.id}">
          🗑️ Delete
        </button>
      </div>
    </article>
  `;
};

/**
 * Render skills view
 * @returns {string} HTML string
 */
const renderSkills = () => {
  return `<section class="skills-grid">${state.skills.map(renderSkillCard).join('')}</section>`;
};

/**
 * Render tasks view
 * @returns {string} HTML string
 */
const renderTasks = () => {
  const visibleTasks = getVisibleTasks();
  
  return `
    <section class="control-panel" aria-label="Quest filters">
      <div class="filter-tabs" role="tablist" aria-label="Quest status filters">
        ${['all', 'today', 'active', 'completed'].map(status => `
          <button class="filter-button ${state.filters.status === status ? 'active' : ''}" 
                  type="button" data-status-filter="${status}" role="tab"
                  aria-selected="${state.filters.status === status}">
            ${status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        `).join('')}
      </div>
      <div class="task-filter-row">
        <label class="filter-group">
          <span>🔍 Search</span>
          <input id="taskSearchInput" type="search" placeholder="Search quests..." 
                 value="${escapeHtml(state.filters.search)}"
                 aria-label="Search quests">
        </label>
        <label class="filter-group">
          <span>🎯 Skill</span>
          <select id="skillFilter" aria-label="Filter by skill">
            <option value="all">All Skills</option>
            ${state.skills.map(skill => `
              <option value="${skill.id}" ${state.filters.skill === skill.id ? 'selected' : ''}>
                ${escapeHtml(skill.name)}
              </option>
            `).join('')}
          </select>
        </label>
        <label class="filter-group">
          <span>📊 Difficulty</span>
          <select id="difficultyFilter" aria-label="Filter by difficulty">
            <option value="all">All</option>
            ${Object.entries(DIFFICULTY_CONFIG).map(([value, config]) => `
              <option value="${value}" ${state.filters.difficulty === value ? 'selected' : ''}>
                ${config.label}
              </option>
            `).join('')}
          </select>
        </label>
      </div>
    </section>
    
    ${visibleTasks.length ? `
      <section class="tasks-grid" aria-label="Quest list">
        ${visibleTasks.map(renderTaskCard).join('')}
      </section>
    ` : `
      <article class="empty-state" aria-label="No quests found">
        <div class="empty-state-icon">🔍</div>
        <h3 class="card-title">No quests found</h3>
        <p class="empty-state-copy helper-text">Try adjusting your filters or add a new quest.</p>
        <button class="primary-button" id="openAddTaskButton" type="button">
          <span class="button-icon">➕</span> Add Your First Quest
        </button>
      </article>
    `}
  `;
};

/**
 * Render missions view
 * @returns {string} HTML string
 */
const renderMissions = () => {
  return `<section class="missions-grid">${state.missions.map(mission => {
    const progress = Math.min(100, (mission.currentCount / mission.targetCount) * 100);
    return `
      <article class="mission-card" tabindex="0">
        <div class="mission-topline">
          <h2 class="card-title">${escapeHtml(mission.title)}</h2>
          <span class="status-badge ${mission.completed ? 'complete' : ''}">
            ${mission.completed ? '✅ Done' : '🔄 Active'}
          </span>
        </div>
        <p class="helper-text">${escapeHtml(mission.description)}</p>
        <div class="mission-progress-row">
          <span class="xp-pill">${mission.currentCount} / ${mission.targetCount}</span>
          <span class="skill-pill">+${mission.xpReward} bonus XP</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${progress}%" 
               role="progressbar" aria-valuenow="${Math.round(progress)}" 
               aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        ${mission.rewardClaimed ? '<p class="meta-text" style="color: var(--success)">✅ Reward claimed!</p>' : ''}
      </article>
    `;
  }).join('')}</section>`;
};

/**
 * Render badges view
 * @returns {string} HTML string
 */
const renderBadges = () => {
  return `<section class="badges-grid">${state.badges.map(badge => `
    <article class="badge-card ${badge.unlocked ? 'unlocked' : 'locked'}" tabindex="0">
      <div class="badge-topline">
        <div class="badge-icon" style="font-size: 1.8rem;">${escapeHtml(badge.icon)}</div>
        <span class="status-badge ${badge.unlocked ? 'complete' : ''}">
          ${badge.unlocked ? '🔓 Unlocked' : '🔒 Locked'}
        </span>
      </div>
      <div>
        <h2 class="card-title">${escapeHtml(badge.title)}</h2>
        <p class="helper-text">${escapeHtml(badge.description)}</p>
      </div>
      <div class="badge-lock-row">
        <span class="skill-pill">${escapeHtml(badge.requirement)}</span>
        <span class="meta-text">${badge.unlocked ? formatDate(badge.unlockedAt) : 'Not yet'}</span>
      </div>
    </article>
  `).join('')}</section>`;
};

/**
 * Render roadmap view
 * @returns {string} HTML string
 */
const renderRoadmap = () => {
  const grouped = state.roadmapItems.reduce((groups, item) => {
    (groups[item.section] = groups[item.section] || []).push(item);
    return groups;
  }, {});
  
  const completed = state.roadmapItems.filter(item => item.completed).length;
  const percent = state.roadmapItems.length ? 
    Math.round((completed / state.roadmapItems.length) * 100) : 0;
  
  return `
    <section class="daily-progress-card" aria-label="Roadmap progress">
      <div class="daily-progress-top">
        <div>
          <p class="eyebrow">Roadmap Progress</p>
          <h2 class="section-heading">${percent}% completed</h2>
        </div>
        <span class="xp-pill">${completed} / ${state.roadmapItems.length}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${percent}%" 
             role="progressbar" aria-valuenow="${percent}" 
             aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </section>
    <section class="roadmap-grid">
      ${Object.entries(grouped).map(([section, items]) => `
        <article class="roadmap-section" tabindex="0">
          <div class="roadmap-topline">
            <h2 class="card-title">${escapeHtml(section)}</h2>
            <span class="skill-pill">
              ${items.filter(i => i.completed).length} / ${items.length}
            </span>
          </div>
          <div class="roadmap-list">
            ${items.map(item => `
              <label class="roadmap-item ${item.completed ? 'completed' : ''}">
                <input type="checkbox" ${item.completed ? 'checked' : ''} 
                       data-roadmap-id="${item.id}" 
                       aria-label="${escapeHtml(item.title)}">
                <span>${escapeHtml(item.title)}</span>
              </label>
            `).join('')}
          </div>
        </article>
      `).join('')}
    </section>
  `;
};

/**
 * Render streak view
 * @returns {string} HTML string
 */
const renderStreak = () => {
  return `
    <section class="summary-grid" aria-label="Streak statistics">
      <article class="summary-card">
        <p class="eyebrow">Current Streak</p>
        <div class="summary-value">${state.streakData.currentStreak} 🔥</div>
        <p class="meta-text">Days in a row</p>
      </article>
      <article class="summary-card">
        <p class="eyebrow">Longest Streak</p>
        <div class="summary-value">${state.streakData.longestStreak} 🏆</div>
        <p class="meta-text">Best run</p>
      </article>
      <article class="summary-card">
        <p class="eyebrow">This Week</p>
        <div class="summary-value">${state.streakData.totalCommitsThisWeek} 📊</div>
        <p class="meta-text">Manual commits</p>
      </article>
      <article class="summary-card">
        <p class="eyebrow">Last Updated</p>
        <div class="summary-value" style="font-size: 1.3rem;">${formatDate(state.streakData.lastUpdated)}</div>
        <p class="meta-text">Keep it going!</p>
      </article>
    </section>
    
    <section class="focus-card" aria-label="Update streak">
      <h2 class="section-heading">Update Streak</h2>
      <div class="streak-actions">
        <button class="primary-button" id="addCommitButton" type="button">
          🔥 Add Today's Commit
        </button>
        <button class="secondary-button" id="resetStreakButton" type="button">
          🔄 Reset Streak
        </button>
      </div>
      <label class="field-group">
        <span>Commits this week</span>
        <div class="number-input-group">
          <input id="manualCommitInput" type="number" min="0" 
                 value="${state.streakData.totalCommitsThisWeek}" 
                 aria-label="Manual commit count">
          <button class="secondary-button" id="saveManualCommitsButton" type="button">
            💾 Save
          </button>
        </div>
      </label>
    </section>
  `;
};

/**
 * Render sidebar summary
 */
const renderSidebarSummary = () => {
  const daily = getDailyStats();
  const summary = document.getElementById('sidebarSummary');
  if (!summary) return;
  
  summary.innerHTML = `
    <strong style="display: flex; align-items: center; gap: 6px;">
      <span>📊</span> Today ${daily.percent}%
    </strong>
    <span>✅ ${daily.completed} completed</span>
    <span>🎯 ${state.tasks.filter(t => !t.completed).length} active quests</span>
    <span>⭐ ${getTotalXp()} total XP</span>
  `;
};

/**
 * Main render function
 */
const renderApp = () => {
  renderHeader();
  
  const viewRenderers = {
    dashboard: renderDashboard,
    tasks: renderTasks,
    skills: renderSkills,
    roadmap: renderRoadmap,
    badges: renderBadges,
    missions: renderMissions,
    streak: renderStreak
  };
  
  const renderer = viewRenderers[state.currentView] || renderDashboard;
  document.getElementById('mainWorkspace').innerHTML = renderer();
  
  renderSidebarSummary();
  
  // Update navigation
  document.querySelectorAll('.nav-item').forEach(button => {
    const isActive = button.dataset.view === state.currentView;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
  
  // Update theme toggle
  const themeLabel = document.getElementById('themeToggleLabel');
  const themeIcon = document.getElementById('themeToggleIcon');
  if (themeLabel) themeLabel.textContent = state.theme === 'dark' ? 'Dark' : 'Light';
  if (themeIcon) themeIcon.textContent = state.theme === 'dark' ? '🌙' : '☀️';
  
  // Populate task skill select
  const taskSkillSelect = document.getElementById('taskSkill');
  if (taskSkillSelect) {
    taskSkillSelect.innerHTML = '<option value="">Select a skill</option>' + 
      state.skills.map(skill => 
        `<option value="${skill.id}">${escapeHtml(skill.name)}</option>`
      ).join('');
  }
};

// ============================================================================
// Event Handling
// ============================================================================

/**
 * Register all event listeners
 */
const registerEventListeners = () => {
  // Click event delegation
  document.addEventListener('click', (event) => {
    const target = event.target;
    
    // Navigation
    const navButton = target.closest('.nav-item');
    if (navButton) {
      state.currentView = navButton.dataset.view;
      document.body.classList.remove('sidebar-open');
      const menuToggle = document.getElementById('menuToggle');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      renderApp();
      return;
    }
    
    // Menu toggle
    const menuToggle = target.closest('#menuToggle');
    if (menuToggle) {
      const isOpen = document.body.classList.toggle('sidebar-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      return;
    }
    
    // Task actions
    const addTaskBtn = target.closest('#openAddTaskButton');
    if (addTaskBtn) { openTaskModal(); return; }
    
    const editTaskBtn = target.closest('.edit-task-button');
    if (editTaskBtn) { openTaskModal(editTaskBtn.dataset.taskId); return; }
    
    const deleteTaskBtn = target.closest('.delete-task-button');
    if (deleteTaskBtn) { 
      if (confirm('Are you sure you want to delete this quest?')) {
        deleteTask(deleteTaskBtn.dataset.taskId);
      }
      return;
    }
    
    const completeTaskBtn = target.closest('.complete-task-button');
    if (completeTaskBtn) { toggleTaskComplete(completeTaskBtn.dataset.taskId); return; }
    
    // Skill actions
    const addSkillBtn = target.closest('#openAddSkillButton');
    if (addSkillBtn) { openSkillModal(); return; }
    
    const viewSkillTasksBtn = target.closest('.view-skill-tasks-button');
    if (viewSkillTasksBtn) {
      state.currentView = 'tasks';
      state.filters.skill = viewSkillTasksBtn.dataset.skillId;
      renderApp();
      return;
    }
    
    // Filters
    const statusFilterBtn = target.closest('[data-status-filter]');
    if (statusFilterBtn) {
      state.filters.status = statusFilterBtn.dataset.statusFilter;
      renderApp();
      return;
    }
    
    // Theme toggle
    const themeToggle = target.closest('#themeToggle');
    if (themeToggle) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.body.classList.toggle('dark-theme', state.theme === 'dark');
      localStorage.setItem(STORAGE_KEYS.theme, state.theme);
      renderApp();
      return;
    }
    
    // Modal close buttons
    if (target.closest('#closeModalButton') || target.closest('#cancelTaskButton')) {
      closeTaskModal();
      return;
    }
    
    if (target.closest('#closeSkillModalButton') || target.closest('#cancelSkillButton')) {
      closeSkillModal();
      return;
    }
    
    // Streak actions
    if (target.closest('#addCommitButton')) { updateStreak('commit'); return; }
    if (target.closest('#resetStreakButton')) {
      if (confirm('Are you sure you want to reset your streak?')) {
        updateStreak('reset');
      }
      return;
    }
    if (target.closest('#saveManualCommitsButton')) {
      const input = document.getElementById('manualCommitInput');
      if (input) updateStreak('manual-weekly', input.value);
      return;
    }
  });
  
  // Change event delegation
  document.addEventListener('change', (event) => {
    const target = event.target;
    
    // Task completion toggle
    if (target.matches('.task-check')) {
      toggleTaskComplete(target.dataset.taskId);
      return;
    }
    
    // Filter changes
    if (target.id === 'skillFilter') {
      state.filters.skill = target.value;
      renderApp();
      return;
    }
    
    if (target.id === 'difficultyFilter') {
      state.filters.difficulty = target.value;
      renderApp();
      return;
    }

    if (target.id === 'taskSkill') {
      populateQuestPresetSelect(target.value);
      clearFormErrors();
      return;
    }

    if (target.id === 'taskPreset') {
      const preset = getSelectedQuestPreset();
      if (target.value === 'custom' && state.editingTaskId) {
        const task = state.tasks.find(item => item.id === state.editingTaskId);
        updateQuestRewardPreview(task ? { difficulty: task.difficulty } : null);
      } else {
        updateQuestRewardPreview(preset);
      }
      clearFormErrors();
      return;
    }
    
    // Roadmap toggle
    if (target.matches('[data-roadmap-id]')) {
      toggleRoadmapItem(target.dataset.roadmapId);
      return;
    }
  });
  
  // Input events with debouncing for search
  document.addEventListener('input', debounce((event) => {
    if (event.target.id === 'taskSearchInput') {
      state.filters.search = event.target.value;
      renderApp();
    }
  }, 300));
  
  // Form submissions
  document.getElementById('taskForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateTaskForm()) return;
    
    const skillId = document.getElementById('taskSkill').value;
    const presetValue = document.getElementById('taskPreset').value;
    const currentTask = state.editingTaskId 
      ? state.tasks.find(task => task.id === state.editingTaskId)
      : null;
    const preset = presetValue === 'custom' && currentTask
      ? { title: currentTask.title, difficulty: currentTask.difficulty }
      : getSelectedQuestPreset();
    
    if (!preset) {
      showFormError('presetQuest', 'Please select a quest.');
      return;
    }
    
    const difficulty = preset.difficulty;
    const formData = {
      title: preset.title,
      description: presetValue === 'custom' ? (currentTask?.description || '') : '',
      skillId,
      difficulty,
      xpReward: XP_BY_DIFFICULTY[difficulty]
    };
    
    if (state.editingTaskId) {
      editTask(state.editingTaskId, formData);
    } else {
      addTask(formData);
    }
    
    closeTaskModal();
  });
  
  document.getElementById('skillForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateSkillForm()) return;
    
    addSkill({
      name: document.getElementById('skillName').value,
      color: document.getElementById('skillColor').value,
      description: document.getElementById('skillDescription').value
    });
    
    closeSkillModal();
  });
  
  // Modal overlay clicks
  document.getElementById('taskModal').addEventListener('click', (event) => {
    if (event.target.id === 'taskModal') closeTaskModal();
  });
  
  document.getElementById('skillModal').addEventListener('click', (event) => {
    if (event.target.id === 'skillModal') closeSkillModal();
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    
    document.body.classList.remove('sidebar-open');
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    
    const taskModal = document.getElementById('taskModal');
    const skillModal = document.getElementById('skillModal');
    
    if (!taskModal.classList.contains('hidden')) closeTaskModal();
    if (!skillModal.classList.contains('hidden')) closeSkillModal();
  });
};

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize the application
 */
const initializeApp = async () => {
  await loadAppState();
  renderApp();
  registerEventListeners();
  
  console.log('🚀 Skill Quest Dashboard initialized successfully!');
  console.log(`📊 ${state.tasks.length} quests | 🎯 ${state.skills.length} skills | 🏆 ${state.badges.filter(b => b.unlocked).length} badges`);
};

// Start the application
initializeApp();
