const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { rateLimit } = require('express-rate-limit');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PORT || 5000);
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : crypto.randomBytes(32).toString('hex'));
const STORAGE_MODE = process.env.STORAGE_MODE || (process.env.NODE_ENV === 'production' ? 'mysql' : 'memory');
const scrypt = promisify(crypto.scrypt);

if (!['mysql', 'memory'].includes(STORAGE_MODE)) {
  throw new Error('STORAGE_MODE must be either "mysql" or "memory".');
}

const allowedClientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedClientOrigins.includes(origin)),
  credentials: true,
}));
app.use((req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('Origin');
  if (!origin || allowedClientOrigins.includes(origin)) return next();
  return res.status(403).json({ message: 'This origin is not allowed to make API requests.' });
});
app.use(express.json({ limit: '60kb' }));

let sequelize = null;
let UserModel = null;
let SubmissionModel = null;
const inMemoryUsers = [
  { id: 1, name: 'Ava Thompson', email: 'ava@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Leo Martinez', email: 'leo@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Nina Patel', email: 'nina@example.com', role: 'Viewer', status: 'Pending' },
];
const problems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: 'N/A', topics: ['Array', 'Hash Table'], solved: true, testInput: '4 2 7 11 15\n9', expectedOutput: '0 1', description: 'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.', examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }, { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }], constraints: ['2 ≤ nums.length ≤ 10⁴', '−10⁹ ≤ nums[i] ≤ 10⁹', 'Exactly one valid answer exists.'] },
  { id: 2, title: 'Valid Parentheses', difficulty: 'Easy', acceptance: 'N/A', topics: ['String', 'Stack'], solved: true, testInput: '()', expectedOutput: 'true', description: 'Given a string s containing just the characters (), {}, and [], determine if the input string is valid.', examples: [{ input: 's = "()"', output: 'true' }, { input: 's = "([)]"', output: 'false' }], constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only: ()[]{}.'] },
  { id: 3, title: 'Merge Intervals', difficulty: 'Medium', acceptance: 'N/A', topics: ['Array', 'Sorting'], solved: false, testInput: '4\n1 3\n2 6\n8 10\n15 18', expectedOutput: '1 6\n8 10\n15 18', description: 'Given an array of intervals, merge all overlapping intervals and return the non-overlapping intervals.', examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }], constraints: ['1 ≤ intervals.length ≤ 10⁴', 'Each interval contains a start and end value.'] },
  { id: 4, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: 'N/A', topics: ['String', 'Sliding Window'], solved: false, testInput: 'abcabcbb', expectedOutput: '3', description: 'Given a string s, find the length of the longest substring without repeating characters.', examples: [{ input: 's = "abcabcbb"', output: '3' }, { input: 's = "bbbbb"', output: '1' }], constraints: ['0 ≤ s.length ≤ 5 × 10⁴', 's consists of English letters, digits, symbols and spaces.'] },
  { id: 5, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', acceptance: 'N/A', topics: ['Tree', 'Breadth-First Search'], solved: false, testInput: '3 9 20 null null 15 7', expectedOutput: '3\n9 20\n15 7', description: 'Given the root of a binary tree, return the level order traversal of its nodes’ values from left to right, level by level.', examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }], constraints: ['The number of nodes in the tree is in [0, 2000].', '−1000 ≤ Node.val ≤ 1000'] },
  { id: 6, title: 'Coin Change', difficulty: 'Medium', acceptance: 'N/A', topics: ['Dynamic Programming'], solved: false, testInput: '3 1 2 5\n11', expectedOutput: '3', description: 'Given an integer array coins and an integer amount, return the fewest number of coins needed to make up that amount, or -1 if it cannot be made.', examples: [{ input: 'coins = [1,2,5], amount = 11', output: '3' }], constraints: ['1 ≤ coins.length ≤ 12', '0 ≤ amount ≤ 10⁴'] },
  { id: 7, title: 'Course Schedule', difficulty: 'Medium', acceptance: 'N/A', topics: ['Graph', 'Depth-First Search'], solved: false, testInput: '2 1\n1 0', expectedOutput: 'true', description: 'There are numCourses courses and prerequisites. Return true if it is possible to finish all courses.', examples: [{ input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' }], constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ 5000'] },
  { id: 8, title: 'Trapping Rain Water', difficulty: 'Hard', acceptance: 'N/A', topics: ['Array', 'Two Pointers'], solved: false, testInput: '12 0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.', examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }], constraints: ['n == height.length', '1 ≤ n ≤ 2 × 10⁴', '0 ≤ height[i] ≤ 10⁵'] },
];

const judgeTestCases = {
  1: [
    { input: '4 2 7 11 15\n9', expected: '0 1' },
    { input: '3 3 2 4\n6', expected: '1 2' },
    { input: '4 3 3 8 9\n6', expected: '0 1' },
  ],
  2: [{ input: '()', expected: 'true' }, { input: '([)]', expected: 'false' }],
  3: [{ input: '4\n1 3\n2 6\n8 10\n15 18', expected: '1 6\n8 10\n15 18' }],
  4: [{ input: 'abcabcbb', expected: '3' }, { input: 'bbbbb', expected: '1' }],
  5: [{ input: '3 9 20 null null 15 7', expected: '3\n9 20\n15 7' }],
  6: [{ input: '3 1 2 5\n11', expected: '3' }],
  7: [{ input: '2 1\n1 0', expected: 'true' }],
  8: [{ input: '12 0 1 0 2 1 0 1 3 2 1 2 1', expected: '6' }],
};
const inMemorySubmissions = [];

const judgeLanguageIds = {
  C: 50,
  'C++': 54,
  Java: 62,
  JavaScript: 63,
  Python: 71,
};

function normalizeUser(rawUser = {}) {
  return {
    id: Number(rawUser.id),
    name: String(rawUser.name || '').trim(),
    email: String(rawUser.email || '').trim(),
    role: String(rawUser.role || 'Member').trim() || 'Member',
    status: String(rawUser.status || 'Active').trim() || 'Active',
  };
}

function validateUser(payload = {}) {
  const user = normalizeUser(payload);

  if (!user.name) {
    throw new Error('Name is required');
  }

  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    throw new Error('A valid email is required');
  }

  return user;
}

async function initializeDatabase() {
  if (STORAGE_MODE === 'memory') {
    sequelize = null;
    UserModel = null;
    SubmissionModel = null;
    console.warn('Using in-memory storage. Accounts and submission progress will be lost on restart.');
    return false;
  }

  let database;
  try {
    const { Sequelize, DataTypes } = require('sequelize');
    const dbName = process.env.DB_NAME || 'fullstack_app';
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = Number(process.env.DB_PORT || 3306);

    database = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        connectTimeout: 20000,
      },
    });

    await database.authenticate();
    sequelize = database;

    UserModel = sequelize.define(
      'User',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        username: {
          type: DataTypes.STRING(24),
          allowNull: true,
          unique: true,
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'password_hash',
        },
        role: {
          type: DataTypes.STRING,
          defaultValue: 'Member',
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'Active',
        },
        points: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        solvedCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'solved_count',
        },
        streak: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        tableName: 'users',
        timestamps: false,
      },
    );

    SubmissionModel = sequelize.define(
      'Submission',
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
        problemId: { type: DataTypes.INTEGER, allowNull: false, field: 'problem_id' },
        language: { type: DataTypes.STRING(24), allowNull: false },
        status: { type: DataTypes.STRING(40), allowNull: false },
        submittedAt: { type: DataTypes.DATE, allowNull: false, field: 'submitted_at' },
        firstSolve: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'first_solve' },
      },
      { tableName: 'submissions', timestamps: false },
    );

    await sequelize.sync({ alter: true });
    console.log('Connected to MySQL database');
    return true;
  } catch (error) {
    await database?.close().catch((closeError) => {
      console.error('Failed to close the unavailable MySQL connection:', closeError.message);
    });
    sequelize = null;
    UserModel = null;
    SubmissionModel = null;
    console.error('MySQL storage initialization failed:', error.message);
    throw new Error('STORAGE_MODE=mysql is configured, but MySQL could not be initialized. Check DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, and ensure the database server is running.', { cause: error });
  }
}

async function listUsers() {
  if (UserModel) {
    const rows = await UserModel.findAll({ order: [['id', 'ASC']] });
    return rows.map((row) => normalizeUser(row.toJSON()));
  }

  return inMemoryUsers;
}

async function createUser(payload) {
  const user = validateUser(payload);

  if (UserModel) {
    const created = await UserModel.create({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    return normalizeUser(created.toJSON());
  }

  const nextId = inMemoryUsers.reduce((maxId, item) => Math.max(maxId, Number(item.id || 0)), 0) + 1;
  const newUser = { ...user, id: nextId };
  inMemoryUsers.push(newUser);
  return newUser;
}

async function updateUser(id, payload) {
  const user = validateUser(payload);

  if (UserModel) {
    const existingUser = await UserModel.findByPk(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    await existingUser.update({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    return normalizeUser(existingUser.toJSON());
  }

  const userIndex = inMemoryUsers.findIndex((entry) => Number(entry.id) === Number(id));
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  inMemoryUsers[userIndex] = { ...inMemoryUsers[userIndex], ...user, id: Number(id) };
  return inMemoryUsers[userIndex];
}

async function deleteUser(id) {
  if (UserModel) {
    const target = await UserModel.findByPk(id);
    if (!target) {
      throw new Error('User not found');
    }

    await target.destroy();
    return true;
  }

  const index = inMemoryUsers.findIndex((entry) => Number(entry.id) === Number(id));
  if (index === -1) {
    throw new Error('User not found');
  }

  inMemoryUsers.splice(index, 1);
  return true;
}

function publicAccount(account) {
  return {
    id: Number(account.id),
    username: String(account.username || account.name || ''),
    email: String(account.email || ''),
    role: String(account.role || 'Member'),
    points: Number(account.points || 0),
    solvedCount: Number(account.solvedCount || account.solved_count || 0),
    streak: Number(account.streak || 0),
  };
}

function pointsForProblem(problemId) {
  const difficulty = problems.find((problem) => problem.id === Number(problemId))?.difficulty;
  return difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 25 : difficulty === 'Hard' ? 50 : 0;
}

async function listAccountSubmissions(userId, acceptedOnly = false) {
  if (SubmissionModel) {
    const where = { userId: Number(userId) };
    if (acceptedOnly) where.status = 'Accepted';
    const rows = await SubmissionModel.findAll({ where, order: [['submittedAt', 'DESC']] });
    return rows.map((row) => row.toJSON());
  }
  return inMemorySubmissions.filter((submission) =>
    submission.userId === Number(userId) && (!acceptedOnly || submission.status === 'Accepted'),
  );
}

function currentStreak(submissions) {
  const completedDays = [...new Set(submissions.map((submission) =>
    new Date(submission.submittedAt).toISOString().slice(0, 10),
  ))].sort().reverse();
  if (!completedDays.length) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (completedDays[0] !== today && completedDays[0] !== yesterday) return 0;

  let streak = 1;
  for (let index = 1; index < completedDays.length; index += 1) {
    const previous = new Date(`${completedDays[index - 1]}T00:00:00.000Z`);
    const current = new Date(`${completedDays[index]}T00:00:00.000Z`);
    if ((previous - current) / 86400000 !== 1) break;
    streak += 1;
  }
  return streak;
}

async function saveSubmission(userId, problemId, language, status) {
  const submittedAt = new Date();
  if (SubmissionModel) {
    await sequelize.transaction(async (transaction) => {
      const account = await UserModel.findByPk(userId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!account) throw new Error('The signed-in account no longer exists.');

      const previouslySolved = status === 'Accepted' && await SubmissionModel.findOne({
        where: { userId: Number(userId), problemId: Number(problemId), status: 'Accepted' },
        transaction,
      });
      await SubmissionModel.create({
        userId: Number(userId),
        problemId: Number(problemId),
        language,
        status,
        submittedAt,
        firstSolve: status === 'Accepted' && !previouslySolved,
      }, { transaction });

      const accepted = await SubmissionModel.findAll({
        where: { userId: Number(userId), status: 'Accepted' },
        attributes: ['problemId', 'submittedAt'],
        transaction,
      });
      const solvedProblemIds = [...new Set(accepted.map((submission) => Number(submission.problemId)))];
      const points = solvedProblemIds.reduce((total, id) => total + pointsForProblem(id), 0);
      account.set({ solvedCount: solvedProblemIds.length, points, streak: currentStreak(accepted) });
      await account.save({ transaction });
    });
    return;
  }

  const account = inMemoryUsers.find((user) => Number(user.id) === Number(userId));
  if (!account) throw new Error('The signed-in account no longer exists.');
  const previouslySolved = status === 'Accepted' && inMemorySubmissions.some((submission) =>
    submission.userId === Number(userId) && submission.problemId === Number(problemId) && submission.status === 'Accepted',
  );
  inMemorySubmissions.push({
    userId: Number(userId),
    problemId: Number(problemId),
    language,
    status,
    submittedAt,
    firstSolve: status === 'Accepted' && !previouslySolved,
  });
  const accepted = await listAccountSubmissions(userId, true);
  const solvedProblemIds = [...new Set(accepted.map((submission) => Number(submission.problemId)))];
  account.solvedCount = solvedProblemIds.length;
  account.points = solvedProblemIds.reduce((total, id) => total + pointsForProblem(id), 0);
  account.streak = currentStreak(accepted);
}

async function getAccountProgress(userId) {
  const accepted = await listAccountSubmissions(userId, true);
  const solvedIds = [...new Set(accepted.map((submission) => Number(submission.problemId)))];
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const dailyProblemId = Math.floor(Date.now() / 86400000) % problems.length + 1;
  for (const id of solvedIds) {
    const difficulty = problems.find((problem) => problem.id === id)?.difficulty;
    if (difficulty) difficultyCounts[difficulty] += 1;
  }
  return {
    solvedIds,
    difficultyCounts,
    streak: currentStreak(accepted),
    dailyProblemId,
    dailySolved: solvedIds.includes(dailyProblemId),
  };
}

async function getLeaderboard() {
  const accounts = UserModel
    ? (await UserModel.findAll()).map((account) => account.toJSON()).filter((account) => account.passwordHash)
    : inMemoryUsers.filter((account) => account.passwordHash);
  const entries = await Promise.all(accounts.map(async (account) => {
    const accepted = await listAccountSubmissions(account.id, true);
    const solvedIds = [...new Set(accepted.map((submission) => Number(submission.problemId)))];
    return {
      username: String(account.username || account.name || 'Coder'),
      solved: solvedIds.length,
      points: solvedIds.reduce((total, id) => total + pointsForProblem(id), 0),
    };
  }));
  return entries
    .sort((left, right) => right.points - left.points || right.solved - left.solved || left.username.localeCompare(right.username))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${key.toString('hex')}`;
}

async function verifyPassword(password, passwordHash) {
  const [algorithm, salt, storedKey] = String(passwordHash || '').split('$');
  if (algorithm !== 'scrypt' || !/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(storedKey)) return false;

  const expectedKey = Buffer.from(storedKey, 'hex');
  const suppliedKey = await scrypt(password, salt, expectedKey.length);
  return expectedKey.length === suppliedKey.length && crypto.timingSafeEqual(expectedKey, suppliedKey);
}

let dummyPasswordHashPromise;
function getDummyPasswordHash() {
  if (!dummyPasswordHashPromise) {
    dummyPasswordHashPromise = hashPassword(crypto.randomBytes(32).toString('hex'));
  }
  return dummyPasswordHashPromise;
}

function findCookie(req, cookieName) {
  const cookieHeader = req.headers.cookie || '';
  const cookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`));
  return cookie ? cookie.slice(cookieName.length + 1) : '';
}

function writeAuthCookie(res, account, rememberMe) {
  const expiresIn = rememberMe ? '7d' : '8h';
  const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 8 * 60 * 60;
  const token = jwt.sign({ sub: String(account.id) }, JWT_SECRET, {
    algorithm: 'HS256',
    audience: 'codearena-web',
    expiresIn,
    issuer: 'codearena',
  });
  const production = process.env.NODE_ENV === 'production';
  const secure = production ? '; Secure' : '';
  const sameSite = production ? 'None' : 'Strict';
  res.setHeader('Set-Cookie', `codearena_session=${encodeURIComponent(token)}; HttpOnly; SameSite=${sameSite}; Path=/; Max-Age=${maxAge}${secure}`);
}

function clearAuthCookie(res) {
  const production = process.env.NODE_ENV === 'production';
  const secure = production ? '; Secure' : '';
  const sameSite = production ? 'None' : 'Strict';
  res.setHeader('Set-Cookie', `codearena_session=; HttpOnly; SameSite=${sameSite}; Path=/; Max-Age=0${secure}`);
}

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Wait 15 minutes and try again.' },
});

app.use('/api/auth', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

async function findAccountByEmail(email) {
  if (UserModel) return UserModel.findOne({ where: { email } });
  return inMemoryUsers.find((account) => account.email.toLowerCase() === email) || null;
}

async function findAccountByUsername(username) {
  if (UserModel) {
    return UserModel.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), username),
    });
  }
  return inMemoryUsers.find((account) => String(account.username || account.name).toLowerCase() === username) || null;
}

async function findAccountById(id) {
  if (UserModel) return UserModel.findByPk(id);
  return inMemoryUsers.find((account) => Number(account.id) === Number(id)) || null;
}

async function requireAuth(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(503).json({ message: 'Authentication is unavailable until JWT_SECRET is configured.' });
  }

  try {
    const token = findCookie(req, 'codearena_session');
    if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });

    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      audience: 'codearena-web',
      issuer: 'codearena',
    });
    const account = await findAccountById(payload.sub);
    if (!account) {
      clearAuthCookie(res);
      return res.status(401).json({ message: 'Your session is no longer valid. Please sign in again.' });
    }

    req.authAccount = publicAccount(account.toJSON ? account.toJSON() : account);
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      clearAuthCookie(res);
      return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
    }
    return next(error);
  }
}

function requireAdmin(req, res, next) {
  if (req.authAccount.role !== 'Admin') {
    return res.status(403).json({ message: 'Administrator access is required for user management.' });
  }
  return next();
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    storage: UserModel ? 'mysql' : 'memory',
    storageMode: STORAGE_MODE,
    judge0: Boolean(process.env.JUDGE0_API_URL),
  });
});

app.post('/api/auth/register', authRateLimit, async (req, res) => {
  if (!JWT_SECRET) {
    return res.status(503).json({ message: 'Authentication is unavailable until JWT_SECRET is configured.' });
  }

  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = req.body?.password;
  const rememberMe = req.body?.rememberMe === true;

  if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
    return res.status(400).json({ message: 'Username must be 3–24 characters and use only letters, numbers, or underscores.' });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return res.status(400).json({ message: 'Password must be between 8 and 128 characters.' });
  }

  try {
    const [existingEmail, existingUsername] = await Promise.all([
      findAccountByEmail(email),
      findAccountByUsername(username.toLowerCase()),
    ]);
    if (existingEmail) return res.status(409).json({ message: 'An account with this email already exists.' });
    if (existingUsername) return res.status(409).json({ message: 'That username is already taken.' });

    const passwordHash = await hashPassword(password);
    let account;
    if (UserModel) {
      account = await UserModel.create({
        name: username,
        username: username.toLowerCase(),
        email,
        passwordHash,
        role: 'Member',
        status: 'Active',
        points: 0,
        solvedCount: 0,
        streak: 0,
      });
    } else {
      const nextId = inMemoryUsers.reduce((maxId, user) => Math.max(maxId, Number(user.id || 0)), 0) + 1;
      account = { id: nextId, name: username, username: username.toLowerCase(), email, passwordHash, role: 'Member', status: 'Active', points: 0, solvedCount: 0, streak: 0 };
      inMemoryUsers.push(account);
    }

    writeAuthCookie(res, account, rememberMe);
    return res.status(201).json({ user: publicAccount(account.toJSON ? account.toJSON() : account) });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'An account with this email or username already exists.' });
    }
    console.error('Account registration failed:', error.message);
    return res.status(500).json({ message: 'Unable to create your account right now.' });
  }
});

app.post('/api/auth/login', authRateLimit, async (req, res) => {
  if (!JWT_SECRET) {
    return res.status(503).json({ message: 'Authentication is unavailable until JWT_SECRET is configured.' });
  }

  const identifier = typeof req.body?.identifier === 'string' ? req.body.identifier.trim().toLowerCase() : '';
  const password = req.body?.password;
  const rememberMe = req.body?.rememberMe === true;
  if (!identifier || identifier.length > 254 || typeof password !== 'string' || password.length > 128) {
    return res.status(400).json({ message: 'Enter your email or username and password.' });
  }

  try {
    const account = identifier.includes('@')
      ? await findAccountByEmail(identifier)
      : await findAccountByUsername(identifier);
    const rawAccount = account?.toJSON ? account.toJSON() : account;
    const passwordHash = rawAccount?.passwordHash || await getDummyPasswordHash();
    const passwordMatches = await verifyPassword(password, passwordHash);
    if (!rawAccount?.passwordHash || !passwordMatches) {
      return res.status(401).json({ message: 'Invalid email/username or password.' });
    }

    writeAuthCookie(res, rawAccount, rememberMe);
    return res.json({ user: publicAccount(rawAccount) });
  } catch (error) {
    console.error('Account sign-in failed:', error.message);
    return res.status(500).json({ message: 'Unable to sign in right now.' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res, next) => {
  try {
    const progress = await getAccountProgress(req.authAccount.id);
    const leaderboard = await getLeaderboard();
    const rank = leaderboard.findIndex((entry) => entry.username === req.authAccount.username) + 1;
    res.json({
      user: { ...req.authAccount, streak: progress.streak },
      ...progress,
      rank: rank || null,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/logout', (_req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
});

app.get('/api/problems', (_req, res) => {
  res.json(problems.map(({ expectedOutput, solved, ...problem }) => problem));
});

app.get('/api/problems/:id', (req, res) => {
  const problemId = Number(req.params.id);
  const problem = Number.isSafeInteger(problemId)
    ? problems.find((item) => item.id === problemId)
    : null;
  if (!problem) {
    return res.status(404).json({ message: 'Problem not found.' });
  }

  const { expectedOutput, solved, ...publicProblem } = problem;
  return res.json(publicProblem);
});

app.get('/api/leaderboard', async (_req, res, next) => {
  try {
    res.json(await getLeaderboard());
  } catch (error) {
    next(error);
  }
});

app.post('/api/submissions', requireAuth, async (req, res) => {
  const { problemId, language, sourceCode, mode, stdin } = req.body || {};
  const selectedProblem = problems.find((problem) => problem.id === Number(problemId));
  if (!selectedProblem) {
    return res.status(400).json({ message: 'Choose a valid problem before running code.' });
  }
  if (!judgeLanguageIds[language]) {
    return res.status(400).json({ message: 'Choose a supported programming language.' });
  }
  if (typeof sourceCode !== 'string' || !sourceCode.trim() || sourceCode.length > 50000) {
    return res.status(400).json({ message: 'Source code must contain 1 to 50,000 characters.' });
  }
  if (mode === 'run' && (typeof stdin !== 'string' || stdin.length > 10000)) {
    return res.status(400).json({ message: 'Standard input must be a string no longer than 10,000 characters.' });
  }
  if (mode !== 'run' && mode !== 'submit') {
    return res.status(400).json({ message: 'Mode must be either run or submit.' });
  }
  const baseUrl = process.env.JUDGE0_API_URL ? process.env.JUDGE0_API_URL.replace(/\/+$/, '') : null;
  if (!baseUrl) {
    return res.status(503).json({ message: 'Code execution is not configured. Set JUDGE0_API_URL in server/.env to enable the isolated Judge0 runner.' });
  }

  const headers = { 'Content-Type': 'application/json' };
  if (process.env.JUDGE0_API_KEY) headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
  if (process.env.JUDGE0_API_HOST) headers['X-RapidAPI-Host'] = process.env.JUDGE0_API_HOST;
  if (process.env.JUDGE0_AUTH_TOKEN) headers['X-Auth-Token'] = process.env.JUDGE0_AUTH_TOKEN;

  try {
    const runJudge = async (input, officialExpectedOutput) => {
      const timeoutMs = Number(process.env.JUDGE0_TIMEOUT_MS || 30000);
      const pollIntervalMs = Number(process.env.JUDGE0_POLL_INTERVAL_MS || 750);
      if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000
        || !Number.isInteger(pollIntervalMs) || pollIntervalMs < 100 || pollIntervalMs > 10000) {
        throw new Error('JUDGE0_TIMEOUT_MS must be 1000–120000 and JUDGE0_POLL_INTERVAL_MS must be 100–10000.');
      }

      const requestJudge = async (url, options) => {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: AbortSignal.timeout(timeoutMs),
        });
        let data;
        try {
          data = await response.json();
        } catch (error) {
          console.error('Judge0 returned invalid JSON:', error.message);
          throw new Error('The code execution service returned an invalid response.');
        }
        if (!response.ok) {
          console.error('Judge0 request failed:', response.status, data.message || data.error || 'Unknown response');
          throw new Error('The code execution service rejected the request. Check the Judge0 server configuration.');
        }
        return data;
      };

      const submission = await requestJudge(`${baseUrl}/submissions?base64_encoded=false`, {
        method: 'POST',
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: judgeLanguageIds[language],
          stdin: input,
        }),
      });
      let result = submission;
      if (submission.status?.id === 1 || submission.status?.id === 2) {
        if (typeof submission.token !== 'string' || !submission.token) {
          throw new Error('The code execution service queued the submission without returning a token.');
        }
        const deadline = Date.now() + timeoutMs;
        while (result.status?.id === 1 || result.status?.id === 2) {
          if (Date.now() >= deadline) {
            throw new Error('Code execution timed out while waiting for the Judge0 result.');
          }
          await new Promise((resolve) => setTimeout(resolve, Math.min(pollIntervalMs, deadline - Date.now())));
          result = await requestJudge(
            `${baseUrl}/submissions/${encodeURIComponent(submission.token)}?base64_encoded=false`,
            { method: 'GET' },
          );
        }
      }

      const judgeStatus = result.status?.description || 'Execution error';
      const stdout = result.stdout || '';
      const accepted = result.status?.id === 3
        && (officialExpectedOutput === null || stdout.trim() === officialExpectedOutput.trim());
      return {
        status: accepted ? 'Accepted' : result.status?.id === 3 ? 'Wrong Answer' : judgeStatus,
        stdout,
        stderr: result.stderr || '',
        time: result.time || null,
      };
    };

    if (mode === 'run') {
      const result = await runJudge(stdin, null);
      const successful = result.status === 'Accepted';
      const status = successful ? 'Run complete' : result.status;
      return res.json({
        status,
        message: successful ? (result.stdout.trim() || 'Program completed with no output.') : status,
        passed: 0,
        total: 0,
        results: [{ ...result, status }],
      });
    }

    const cases = judgeTestCases[selectedProblem.id];
    const results = [];
    for (const testCase of cases) {
      const result = await runJudge(testCase.input, testCase.expected);
      results.push(result);
      if (result.status !== 'Accepted') break;
    }
    const passed = results.filter((result) => result.status === 'Accepted').length;
    const status = passed === cases.length ? 'Accepted' : results[results.length - 1].status;
    await saveSubmission(req.authAccount.id, selectedProblem.id, language, status);
    const progress = await getAccountProgress(req.authAccount.id);
    const leaderboard = await getLeaderboard();
    const rank = leaderboard.findIndex((entry) => entry.username === req.authAccount.username) + 1;
    return res.json({
      status,
      message: status === 'Accepted' ? 'All test cases passed.' : `${passed}/${cases.length} test cases passed.`,
      passed,
      total: cases.length,
      results,
      user: { ...req.authAccount, solvedCount: progress.solvedIds.length, streak: progress.streak,
        points: progress.solvedIds.reduce((total, id) => total + pointsForProblem(id), 0) },
      ...progress,
      rank: rank || null,
      leaderboard,
    });
  } catch (error) {
    console.error('Judge0 execution failed:', error.message);
    const message = error.name === 'TimeoutError' || error.message.includes('timed out')
      ? 'Code execution timed out. Check the Judge0 service and try again.'
      : error.message.startsWith('The code execution service rejected')
        ? error.message
        : error.message.startsWith('JUDGE0_') || error.message.startsWith('The code execution service')
        ? error.message
        : 'Could not reach the code execution service. Check its URL and availability.';
    return res.status(502).json({ message });
  }
});

app.use('/api/users', requireAuth, requireAdmin);

app.get('/api/users', async (_req, res) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await createUser(req.body || {});
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Unable to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body || {});
    res.json(user);
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 400;
    res.status(statusCode).json({ message: error.message || 'Unable to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 400;
    res.status(statusCode).json({ message: error.message || 'Unable to delete user' });
  }
});

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.get('/', (_req, res) => {
  res.json({
    app: 'Full-stack React + Express + MySQL tutorial app',
    endpoints: ['/api/health', '/api/users'],
  });
});

async function startServer() {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be set when NODE_ENV=production.');
  }
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
  });
}

module.exports = { app, initializeDatabase, listUsers, createUser, updateUser, deleteUser };
