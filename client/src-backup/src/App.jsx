import { useEffect, useMemo, useState } from 'react'
import { MetalFx } from 'metal-fx'
import { ThinkingOrb } from 'thinking-orbs'
import './App.css'

const languages = ['JavaScript', 'Python', 'Java', 'C++', 'C']
const templates = {
  JavaScript: "const fs = require('fs');\nconst values = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst count = values[0];\nconst nums = values.slice(1, count + 1);\nconst target = values[count + 1];\nconst seen = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const complement = target - nums[i];\n  if (seen.has(complement)) {\n    console.log(`${seen.get(complement)} ${i}`);\n    break;\n  }\n  seen.set(nums[i], i);\n}\n",
  Python: 'import sys\nvalues = list(map(int, sys.stdin.read().split()))\ncount = values[0]\nnums = values[1:count + 1]\ntarget = values[count + 1]\nseen = {}\nfor index, value in enumerate(nums):\n    complement = target - value\n    if complement in seen:\n        print(seen[complement], index)\n        break\n    seen[value] = index\n',
  Java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int count = scanner.nextInt();\n        int[] nums = new int[count];\n        for (int i = 0; i < count; i++) nums[i] = scanner.nextInt();\n        int target = scanner.nextInt();\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < count; i++) {\n            int complement = target - nums[i];\n            if (seen.containsKey(complement)) {\n                System.out.println(seen.get(complement) + " " + i);\n                break;\n            }\n            seen.put(nums[i], i);\n        }\n    }\n}\n',
  'C++': '#include <iostream>\n#include <unordered_map>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int count;\n    cin >> count;\n    vector<int> nums(count);\n    for (int& value : nums) cin >> value;\n    int target;\n    cin >> target;\n    unordered_map<int, int> seen;\n    for (int i = 0; i < count; i++) {\n        int complement = target - nums[i];\n        if (seen.count(complement)) {\n            cout << seen[complement] << " " << i << endl;\n            break;\n        }\n        seen[nums[i]] = i;\n    }\n}\n',
  C: '#include <stdio.h>\n\nint main(void) {\n    int count;\n    if (scanf("%d", &count) != 1) return 0;\n    int nums[10000];\n    for (int i = 0; i < count; i++) scanf("%d", &nums[i]);\n    int target;\n    scanf("%d", &target);\n    for (int i = 0; i < count; i++) {\n        for (int j = i + 1; j < count; j++) {\n            if (nums[i] + nums[j] == target) {\n                printf("%d %d\\n", i, j);\n                return 0;\n            }\n        }\n    }\n    return 0;\n}\n',
}
const blankTemplates = {
  JavaScript: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim();\n// Parse the input and print your answer.\n",
  Python: 'import sys\ninput_data = sys.stdin.read().strip()\n# Parse the input and print your answer.\n',
  Java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Parse the input and print your answer.\n    }\n}\n',
  'C++': '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    // Parse the input and print your answer.\n    return 0;\n}\n',
  C: '#include <stdio.h>\n\nint main(void) {\n    // Parse the input and print your answer.\n    return 0;\n}\n',
}

const demoProblems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: '—', topics: ['Array', 'Hash Table'], testInput: '4 2 7 11 15\n9', description: 'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.', examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }, { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }], constraints: ['2 ≤ nums.length ≤ 10⁴', '−10⁹ ≤ nums[i] ≤ 10⁹', 'Exactly one valid answer exists.'] },
  { id: 2, title: 'Valid Parentheses', difficulty: 'Easy', acceptance: '—', topics: ['String', 'Stack'], testInput: '()', description: 'Given a string s containing just the characters (), {}, and [], determine if the input string is valid.', examples: [{ input: 's = "()"', output: 'true' }, { input: 's = "([)]"', output: 'false' }], constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only: ()[]{}.'] },
  { id: 3, title: 'Merge Intervals', difficulty: 'Medium', acceptance: '—', topics: ['Array', 'Sorting'], testInput: '4\n1 3\n2 6\n8 10\n15 18', description: 'Given an array of intervals where intervals[i] = [startᵢ, endᵢ], merge all overlapping intervals and return an array of the non-overlapping intervals.', examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }], constraints: ['1 ≤ intervals.length ≤ 10⁴', 'intervals[i].length == 2', 'Intervals are sorted by their start value.'] },
  { id: 4, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: '—', topics: ['String', 'Sliding Window'], testInput: 'abcabcbb', description: 'Given a string s, find the length of the longest substring without repeating characters.', examples: [{ input: 's = "abcabcbb"', output: '3' }, { input: 's = "bbbbb"', output: '1' }], constraints: ['0 ≤ s.length ≤ 5 × 10⁴', 's consists of English letters, digits, symbols and spaces.'] },
  { id: 5, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', acceptance: '—', topics: ['Tree', 'Breadth-First Search'], testInput: '3 9 20 null null 15 7', description: 'Given the root of a binary tree, return the level order traversal of its nodes’ values from left to right, level by level.', examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }], constraints: ['The number of nodes in the tree is in [0, 2000].', '−1000 ≤ Node.val ≤ 1000'] },
  { id: 6, title: 'Coin Change', difficulty: 'Medium', acceptance: '—', topics: ['Dynamic Programming'], testInput: '3 1 2 5\n11', description: 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount.', examples: [{ input: 'coins = [1,2,5], amount = 11', output: '3' }], constraints: ['1 ≤ coins.length ≤ 12', '0 ≤ amount ≤ 10⁴'] },
  { id: 7, title: 'Course Schedule', difficulty: 'Medium', acceptance: '—', topics: ['Graph', 'Depth-First Search'], testInput: '2 1\n1 0', description: 'There are numCourses courses and prerequisites. Return true if it is possible to finish all courses.', examples: [{ input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' }], constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ 5000'] },
  { id: 8, title: 'Trapping Rain Water', difficulty: 'Hard', acceptance: '—', topics: ['Array', 'Two Pointers'], testInput: '12 0 1 0 2 1 0 1 3 2 1 2 1', description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.', examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }], constraints: ['n == height.length', '1 ≤ n ≤ 2 × 10⁴', '0 ≤ height[i] ≤ 10⁵'] },
]

const frontendOnlyMode = import.meta.env.VITE_API_MODE === 'demo'
const apiBaseUrl = String(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const demoAccountsKey = 'codearena.demo-accounts.v1'
const demoSessionKey = 'codearena.demo-session.v1'
const demoTabSessionKey = 'codearena.demo-tab-session.v1'

function apiFetch(path, options = {}) {
  return fetch(`${apiBaseUrl}${path}`, { ...options, credentials: 'include' })
}

function readDemoAccounts() {
  const storedAccounts = window.localStorage.getItem(demoAccountsKey)
  if (storedAccounts === null) return []

  const accounts = JSON.parse(storedAccounts)
  if (!Array.isArray(accounts) || accounts.some((account) => !account || typeof account.username !== 'string')) {
    throw new Error('The saved local demo profiles are invalid. Clear this site’s local storage to start fresh.')
  }
  return accounts
}

function createDemoAccount(username, email, existingAccount = null) {
  return {
    ...existingAccount,
    id: existingAccount?.id || `demo-${username.toLowerCase()}`,
    username,
    name: username,
    email,
    role: 'Member',
    status: 'Active',
    points: existingAccount?.points || 0,
    solvedCount: existingAccount?.solvedCount || 0,
    streak: existingAccount?.streak || 0,
    solvedIds: existingAccount?.solvedIds || [],
    difficultyCounts: existingAccount?.difficultyCounts || { Easy: 0, Medium: 0, Hard: 0 },
    rank: existingAccount?.rank || null,
    dailyProblemId: existingAccount?.dailyProblemId || 1,
    dailySolved: existingAccount?.dailySolved || false,
  }
}

function getPasswordStrength(password) {
  if (!password) return 0
  return [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length
}

function readDemoSession() {
  try {
    const sessionUsername = window.localStorage.getItem(demoSessionKey)
      || window.sessionStorage.getItem(demoTabSessionKey)
    const account = sessionUsername
      ? readDemoAccounts().find((profile) => profile.username.toLowerCase() === sessionUsername) || null
      : null
    return { account, error: '' }
  } catch (error) {
    return { account: null, error: `Could not load your local demo profile: ${error.message}` }
  }
}

function Icon({ name }) {
  const icons = {
    grid: '▦',
    code: '</>',
    trophy: '♜',
    user: '◉',
    search: '⌕',
    bell: '♧',
    chevron: '⌄',
    check: '✓',
    play: '▶',
    send: '↑',
    flame: '♨',
    clock: '◷',
    bars: '▤',
  }
  return <span className={`icon icon-${name}`} aria-hidden="true">{icons[name]}</span>
}

function App() {
  const [demoSession] = useState(() => frontendOnlyMode ? readDemoSession() : { account: null, error: '' })
  const [account, setAccount] = useState(demoSession.account)
  const [authLoading, setAuthLoading] = useState(!frontendOnlyMode)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ username: '', identifier: '', email: '', password: '', confirmPassword: '', rememberMe: false })
  const [showPassword, setShowPassword] = useState(false)
  const [authSubmitting, setAuthSubmitting] = useState(false)
  const [authError, setAuthError] = useState(demoSession.error)
  const [problems, setProblems] = useState(demoProblems)
  const [leaderboard, setLeaderboard] = useState([])
  const [activeView, setActiveView] = useState('Problems')
  const [selectedId, setSelectedId] = useState(1)
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('All difficulties')
  const [topic, setTopic] = useState('All topics')
  const [language, setLanguage] = useState('JavaScript')
  const [code, setCode] = useState(templates.JavaScript)
  const [output, setOutput] = useState(null)
  const [running, setRunning] = useState(false)
  const [apiError, setApiError] = useState('')
  const [catalogError, setCatalogError] = useState(false)
  const [stdin, setStdin] = useState('4 2 7 11 15\n9')

  useEffect(() => {
    if (frontendOnlyMode) return undefined

    let cancelled = false
    apiFetch('/api/auth/me')
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json()
          if (!cancelled) setAccount({ ...data.user, solvedIds: data.solvedIds, difficultyCounts: data.difficultyCounts, rank: data.rank, dailyProblemId: data.dailyProblemId, dailySolved: data.dailySolved })
        } else if (response.status !== 401) {
          throw new Error('Could not verify your session.')
        }
      })
      .catch((error) => {
        if (!cancelled) setAuthError(error.message)
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false)
      })
    apiFetch('/api/problems')
      .then((response) => {
        if (!response.ok) throw new Error('Problems API is unavailable')
        return response.json()
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length) setProblems(data)
      })
      .catch(() => {
        if (!cancelled) setCatalogError(true)
      })
    apiFetch('/api/leaderboard')
      .then((response) => {
        if (!response.ok) throw new Error('Leaderboard API is unavailable')
        return response.json()
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setLeaderboard(data)
      })
      .catch(() => {
        if (!cancelled) setCatalogError(true)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (frontendOnlyMode || !account?.id) return undefined

    let cancelled = false
    Promise.all([
      apiFetch('/api/auth/me').then(async (response) => {
        if (!response.ok) throw new Error('Could not refresh your coding progress.')
        return response.json()
      }),
      apiFetch('/api/leaderboard').then(async (response) => {
        if (!response.ok) throw new Error('Could not refresh the leaderboard.')
        return response.json()
      }),
    ]).then(([progress, rankings]) => {
      if (cancelled) return
      setAccount({
        ...progress.user,
        solvedIds: progress.solvedIds,
        difficultyCounts: progress.difficultyCounts,
        rank: progress.rank,
        dailyProblemId: progress.dailyProblemId,
        dailySolved: progress.dailySolved,
      })
      setLeaderboard(rankings)
    }).catch((error) => {
      if (!cancelled) setApiError(error.message)
    })
    return () => { cancelled = true }
  }, [account?.id])

  const selectedProblem = problems.find((problem) => problem.id === selectedId) || problems[0]
  const topics = useMemo(() => ['All topics', ...new Set(problems.flatMap((problem) => problem.topics || []))], [problems])
  const filteredProblems = useMemo(() => problems.filter((problem) => {
    const matchesQuery = `${problem.title} ${(problem.topics || []).join(' ')}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (difficulty === 'All difficulties' || problem.difficulty === difficulty) && (topic === 'All topics' || (problem.topics || []).includes(topic))
  }), [problems, query, difficulty, topic])
  const username = account?.username || 'Coder'
  const initials = username.slice(0, 2).toUpperCase()
  const dailyProblem = problems.find((problem) => problem.id === account?.dailyProblemId) || problems[0]
  const displayedLeaderboard = frontendOnlyMode
    ? account?.solvedCount > 0
      ? [{ rank: 1, username: account.username, solved: account.solvedCount, points: account.points }]
      : []
    : leaderboard

  const handleAuthChange = (event) => {
    const { name, value, checked, type } = event.target
    setAuthForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleAuthModeChange = (mode) => {
    setAuthMode(mode)
    setAuthError('')
    setAuthForm((current) => ({ ...current, password: '', confirmPassword: '' }))
  }

  const handleGuestDemo = () => {
    try {
      const savedAccounts = readDemoAccounts()
      let username = 'Explorer'
      let suffix = 2
      while (savedAccounts.some((profile) => profile.username.toLowerCase() === username.toLowerCase())) {
        username = `Explorer${suffix}`
        suffix += 1
      }

      const guestAccount = createDemoAccount(username, `${username.toLowerCase()}@local.demo`)
      window.localStorage.setItem(demoAccountsKey, JSON.stringify([...savedAccounts, guestAccount]))
      window.sessionStorage.setItem(demoTabSessionKey, guestAccount.username.toLowerCase())
      window.localStorage.removeItem(demoSessionKey)
      setAuthError('')
      setAccount(guestAccount)
    } catch (error) {
      setAuthError(`Could not start a local demo profile: ${error.message}`)
    }
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setAuthError('')

    if (authMode === 'register') {
      if (authForm.password.length < 8) {
        setAuthError('Use at least 8 characters for your password.')
        return
      }
      if (authForm.password !== authForm.confirmPassword) {
        setAuthError('Those passwords do not match. Try again.')
        return
      }
    }

    setAuthSubmitting(true)
    try {
      if (frontendOnlyMode) {
        const savedAccounts = readDemoAccounts()
        let localAccount

        if (authMode === 'register') {
          const username = authForm.username.trim()
          const email = authForm.email.trim().toLowerCase()
          const existingAccount = savedAccounts.find((profile) => profile.username.toLowerCase() === username.toLowerCase())
          const emailInUse = savedAccounts.some((profile) => profile.email.toLowerCase() === email && profile.username.toLowerCase() !== username.toLowerCase())
          if (emailInUse) throw new Error('That email is already used by another local demo profile.')

          localAccount = createDemoAccount(username, email, existingAccount)
          const nextAccounts = existingAccount
            ? savedAccounts.map((profile) => profile.username.toLowerCase() === username.toLowerCase() ? localAccount : profile)
            : [...savedAccounts, localAccount]
          window.localStorage.setItem(demoAccountsKey, JSON.stringify(nextAccounts))
        } else {
          const identifier = authForm.identifier.trim().toLowerCase()
          localAccount = savedAccounts.find((profile) => profile.username.toLowerCase() === identifier || profile.email.toLowerCase() === identifier)
          if (!localAccount) throw new Error('No matching local demo profile. Create an account in this browser first.')
        }

        window.localStorage.removeItem(demoSessionKey)
        window.sessionStorage.removeItem(demoTabSessionKey)
        if (authForm.rememberMe) {
          window.localStorage.setItem(demoSessionKey, localAccount.username.toLowerCase())
        } else {
          window.sessionStorage.setItem(demoTabSessionKey, localAccount.username.toLowerCase())
        }
        setAccount(localAccount)
        setAuthError('')
        return
      }

      const response = await apiFetch(`/api/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(authMode === 'register'
            ? { username: authForm.username, email: authForm.email, password: authForm.password }
            : { identifier: authForm.identifier, password: authForm.password }),
          rememberMe: authForm.rememberMe,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to sign in.')
      setAccount(data.user)
      setAuthError('')
    } catch (error) {
      setAuthError(error.message || 'Unable to sign in. Please try again.')
    } finally {
      setAuthSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    try {
      if (frontendOnlyMode) {
        window.localStorage.removeItem(demoSessionKey)
        window.sessionStorage.removeItem(demoTabSessionKey)
        setAccount(null)
        setAuthForm({ username: '', identifier: '', email: '', password: '', confirmPassword: '', rememberMe: false })
        setAuthMode('login')
        setActiveView('Problems')
        setAuthError('')
        return
      }

      const response = await apiFetch('/api/auth/logout', { method: 'POST' })
      if (!response.ok) throw new Error('Unable to sign out. Please try again.')
      setAccount(null)
      setAuthForm({ username: '', identifier: '', email: '', password: '', confirmPassword: '', rememberMe: false })
      setAuthMode('login')
      setActiveView('Problems')
      setAuthError('')
    } catch (error) {
      setAuthError(error.message)
    }
  }

  const chooseProblem = (problem) => {
    setSelectedId(problem.id)
    setCode(problem.id === 1 ? templates[language] : blankTemplates[language])
    setOutput(null)
    setApiError('')
    setStdin(problem.testInput || '')
  }

  const changeLanguage = (event) => {
    const nextLanguage = event.target.value
    setLanguage(nextLanguage)
    setCode(selectedProblem.id === 1 ? templates[nextLanguage] : blankTemplates[nextLanguage])
    setOutput(null)
  }

  const executeCode = async (mode) => {
    setRunning(true)
    setApiError('')
    setOutput(null)
    try {
      if (frontendOnlyMode) {
        setOutput({
          status: 'Preview only',
          message: 'Code was not executed. This frontend-only demo has no code execution service.',
        })
        return
      }

      const response = await apiFetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: selectedProblem.id, language, sourceCode: code, mode, stdin }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Code execution failed')
      setOutput(result)
      if (mode === 'submit' && result.status === 'Accepted') {
        setAccount({
          ...result.user,
          solvedIds: result.solvedIds,
          difficultyCounts: result.difficultyCounts,
          rank: result.rank,
          dailyProblemId: result.dailyProblemId,
          dailySolved: result.dailySolved,
        })
        setLeaderboard(result.leaderboard)
      }
    } catch (error) {
      setApiError(error.message)
    } finally {
      setRunning(false)
    }
  }

  if (authLoading) {
    return <main className="auth-loading" aria-label="Checking your session"><ThinkingOrb state="connecting" size={64} theme="light" aria-label="Checking your session" /><p>Getting your arena ready…</p></main>
  }

  if (!account) {
    const passwordStrength = getPasswordStrength(authForm.password)
    const strengthLabel = ['Add a password', 'Getting started', 'Fair', 'Good', 'Strong'][passwordStrength]
    return (
      <main className={`auth-screen auth-screen-${authMode}`}>
        <section className="auth-showcase">
          <div className="showcase-topline">
            <a className="auth-brand" href="#" onClick={(event) => event.preventDefault()} aria-label="Qodriva home">
            <img className="brand-mark brand-logo" src="/qodriva-logo.svg" alt="" aria-hidden="true" /><span>Qodriva<small>THE PRACTICE ARENA</small></span>
            </a>
            <nav className="showcase-nav" aria-label="Discover Qodriva">
              <a href="#auth-features">The practice</a>
              <a href="#auth-panel">Your next step <span>↗</span></a>
            </nav>
          </div>
          <div className="showcase-content">
            <span className="showcase-kicker"><span /> A PRACTICE SPACE FOR WHAT'S NEXT</span>
            <h1>Made to learn.<br /><span>Ready to</span> build.</h1>
            <p>Every great solution starts with a first attempt. Find your people, pick a challenge, and give your ideas room to grow.</p>
            <ThinkingOrb className="showcase-orb" state="weaving" size={64} theme="dark" color="#8ce6bb" aria-label="Qodriva animated thinking orb" />
            <div className="showcase-visual" aria-hidden="true">
              <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
              <div className="code-window">
                <div className="window-dots"><i /><i /><i /><span>daily-challenge.js</span><span className="window-language">JavaScript</span></div>
                <pre><span className="code-purple">function</span> <span className="code-blue">levelUp</span>() {'{\n'}  <span className="code-purple">const</span> practice = <span className="code-green">"every day"</span>{'\n'}  <span className="code-purple">return</span> progress + <span className="code-orange">1</span>{'\n'}{'}'}</pre>
                <div className="code-success"><span>✓</span> All tests passed <b>+50 pts</b></div>
              </div>
              <div className="float-badge badge-streak"><span>✦</span><div><strong>7 day streak</strong><small>Keep the momentum</small></div></div>
              <div className="float-badge badge-rank"><span>↗</span><div><strong>Top 5%</strong><small>of this week’s coders</small></div></div>
            </div>
            <div className="showcase-invitation">
              <a className="showcase-cta" href="#auth-panel">{authMode === 'login' ? 'Find your starting point' : 'Start your Qodriva journey'}<span>↗</span></a>
              <span className="showcase-invitation-note">A little progress is still progress.</span>
            </div>
            <div className="showcase-features" id="auth-features" aria-label="Qodriva features">
              <span><b>08</b> thoughtful challenges</span><i />
              <span><b>05</b> ways to create</span><i />
              <span><b>01</b> next step: yours</span>
            </div>
          </div>
          <div className="showcase-foot"><span>© 2026 Qodriva</span><span><span className="foot-live-dot" /> Better, together. One line at a time.</span></div>
        </section>

        <section className="auth-side">
          <div className="auth-card" id="auth-panel">
            <div className="auth-heading">
              <img className="auth-mobile-mark brand-mark brand-logo" src="/qodriva-logo.svg" alt="" aria-hidden="true" />
              <span className="auth-kicker"><i /> YOUR NEXT CHAPTER STARTS HERE</span>
              <h2>{authMode === 'login' ? 'Sign in to Qodriva' : 'Create your account'}</h2>
              <p>{authMode === 'login' ? 'Your next breakthrough is one good session away.' : 'Set up your profile and make this space yours.'}</p>
            </div>

            <div className="auth-switch" role="group" aria-label="Account access">
              <button type="button" aria-pressed={authMode === 'login'} className={authMode === 'login' ? 'selected' : ''} onClick={() => handleAuthModeChange('login')}>Sign in</button>
              <button type="button" aria-pressed={authMode === 'register'} className={authMode === 'register' ? 'selected' : ''} onClick={() => handleAuthModeChange('register')}>Create account</button>
              <span className={`auth-switch-indicator ${authMode}`} aria-hidden="true" />
            </div>

            <form className="auth-form" key={authMode} onSubmit={handleAuthSubmit}>
              {frontendOnlyMode && <p className="demo-notice"><span className="demo-notice-icon">✦</span><span><strong>Explore the local demo</strong><small>Your profile stays in this browser. No password is saved.</small></span></p>}
              {authMode === 'register' ? (
                <>
                  <label htmlFor="auth-username">Username <span>3–24 characters</span></label>
                  <input id="auth-username" name="username" value={authForm.username} onChange={handleAuthChange} autoComplete="username" placeholder="e.g. jordan_codes" minLength={3} maxLength={24} pattern="[A-Za-z0-9_]{3,24}" title="3–24 letters, numbers, or underscores" required />
                  <label htmlFor="auth-email">Email address</label>
                  <input id="auth-email" type="email" name="email" value={authForm.email} onChange={handleAuthChange} autoComplete="email" maxLength={254} placeholder="you@example.com" required />
                </>
              ) : (
                <>
                  <label htmlFor="auth-identifier">{frontendOnlyMode ? 'Profile name or email' : 'Email or username'}</label>
                  <input id="auth-identifier" name="identifier" value={authForm.identifier} onChange={handleAuthChange} autoComplete="username" placeholder="you@example.com or username" maxLength={254} required />
                </>
              )}

              <div className="password-label-row"><label htmlFor="auth-password">Password</label>{authMode === 'login' && <span>{frontendOnlyMode ? 'Demo only' : 'Keep it safe and secret'}</span>}</div>
              <div className="password-field">
                <input id="auth-password" type={showPassword ? 'text' : 'password'} name="password" value={authForm.password} onChange={handleAuthChange} autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength={authMode === 'register' ? 8 : undefined} maxLength={128} placeholder={authMode === 'login' ? 'Enter your password' : 'At least 8 characters'} required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
              </div>

              {authMode === 'register' && (
                <>
                  <div className="password-strength" aria-label={`Password strength: ${strengthLabel}`}>
                    <div className="password-strength-track">{[1, 2, 3, 4].map((level) => <i key={level} className={passwordStrength >= level ? `active strength-${passwordStrength}` : ''} />)}</div>
                    <span>{strengthLabel}</span>
                  </div>
                  <label htmlFor="auth-confirm-password">Confirm password</label>
                  <div className="password-field">
                    <input id="auth-confirm-password" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={authForm.confirmPassword} onChange={handleAuthChange} autoComplete="new-password" maxLength={128} placeholder="Enter your password again" required />
                    {authForm.confirmPassword && <span className={`match-indicator ${authForm.password === authForm.confirmPassword ? 'matches' : ''}`}>{authForm.password === authForm.confirmPassword ? '✓ Match' : 'Does not match'}</span>}
                  </div>
                  <p className="password-hint">Use 8–128 characters. A longer, unique passphrase is safer.</p>
                </>
              )}

              <label className="remember-option"><input type="checkbox" name="rememberMe" checked={authForm.rememberMe} onChange={handleAuthChange} /><span className="custom-check" />{frontendOnlyMode ? 'Remember this profile after closing the browser' : 'Keep me signed in for 7 days'}</label>
              {authError && <p className="auth-message auth-error" role="alert">{authError}</p>}
              <MetalFx className="auth-submit-metal" style={{ width: '100%' }} preset="chromatic" variant="button" theme="light" strength={0.72} glowGain={0.65} innerShadow normalizeHostStyles={false}>
                <button type="submit" className="auth-submit" disabled={authSubmitting}>{authSubmitting ? <><ThinkingOrb state={authMode === 'login' ? 'connecting' : 'composing'} size={20} theme="dark" color="#e5fff3" aria-label={authMode === 'login' ? 'Signing in' : 'Creating account'} />{authMode === 'login' ? 'Signing in…' : 'Creating account…'}</> : <>{authMode === 'login' ? 'Sign in' : 'Create account'} <span>→</span></>}</button>
              </MetalFx>
              {frontendOnlyMode && <><div className="auth-divider"><span>OR JUMP RIGHT IN</span></div><button type="button" className="guest-button" onClick={handleGuestDemo}><span>↗</span> Explore as a guest</button></>}
            </form>

            <p className="auth-terms">{frontendOnlyMode ? 'Demo profiles are saved only on this device. No real account or code execution required.' : 'By continuing, you agree to use Qodriva respectfully and keep your account credentials private.'}</p>
            <div className="auth-bottom"><span><span className="auth-trust-icon">✓</span> {frontendOnlyMode ? 'Private to this browser' : 'Your data stays protected'}</span><span>{frontendOnlyMode ? 'Local demo' : 'Secure sign-in'}</span></div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <div className="arena">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setActiveView('Problems') }}>
          <img className="brand-mark brand-logo" src="/qodriva-logo.svg" alt="" aria-hidden="true" />
          <span>Qodriva<small>LEVEL UP YOUR LOGIC</small></span>
        </a>
        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {[
            ['Problems', 'grid'],
            ['Leaderboard', 'trophy'],
            ['Profile', 'user'],
          ].map(([label, icon]) => (
            <button key={label} className={`nav-item ${activeView === label ? 'active' : ''}`} onClick={() => setActiveView(label)}>
              <Icon name={icon} />{label}{label === 'Problems' && <span className="nav-count">128</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="streak-card"><span className="streak-icon">✦</span><div><strong>{account.streak || 0} day streak</strong><small>{account.streak ? 'You’re on fire. Keep it up!' : 'Solve a problem today to start a streak.'}</small></div></div>
          <button className="profile-mini" onClick={() => setActiveView('Profile')}>
            <span className="avatar">{initials}</span><span><strong>{username}</strong><small>Qodriva member</small></span><Icon name="chevron" />
          </button>
        </div>
      </aside>

      <main className="main-area">
        {frontendOnlyMode && <div className="demo-banner" role="status">Frontend-only demo · profile data stays in this browser · code execution is disabled.</div>}
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{activeView}</strong></div>
          <div className="top-actions">
            <span className="date-label"><Icon name="clock" /> {frontendOnlyMode ? 'Local demo' : 'Global rankings · live'}</span>
            <button className="icon-button" aria-label="Notifications"><Icon name="bell" /><i /></button>
            <button type="button" className="sign-out-button" onClick={handleSignOut}>Sign out</button><span className="avatar avatar-small">{initials}</span>
          </div>
        </header>

        {activeView === 'Problems' && (
          <>
            <section className="welcome-row">
              <div><p className="eyebrow">YOUR QODRIVA</p><h1>Welcome back, {username} <span>✦</span></h1><p className="subheading">Ready to sharpen your skills? Your next challenge is waiting.</p></div>
              <button className="daily-button" onClick={() => dailyProblem && chooseProblem(dailyProblem)} disabled={!dailyProblem}><span>✦</span><div><small>DAILY CHALLENGE</small><strong>{dailyProblem?.title || 'Loading challenge'} <b>{account.dailySolved ? 'Completed' : '+Practice'}</b></strong></div><span className="daily-arrow">↗</span></button>
            </section>

            <section className="stats-grid" aria-label="Your coding statistics">
              <article className="stat-card"><div className="stat-heading">PROBLEMS SOLVED <span className="stat-icon blue"><Icon name="check" /></span></div><div className="stat-value">{account.solvedCount}<span> total</span></div><div className="stat-progress"><i style={{ width: `${Math.min(account.solvedCount, 100)}%` }} /></div><small>Keep practicing to build your streak</small></article>
              <article className="stat-card"><div className="stat-heading">TOTAL POINTS <span className="stat-icon purple">✦</span></div><div className="stat-value">{Number(account.points).toLocaleString()}</div><small>Your points from accepted solutions</small></article>
              <article className="stat-card"><div className="stat-heading">GLOBAL RANK <span className="stat-icon orange"><Icon name="trophy" /></span></div><div className="stat-value">{account.rank ? `#${account.rank}` : '—'}</div><small>{account.rank ? 'Among registered Qodriva members' : 'Solve problems to join the rankings'}</small></article>
              <article className="stat-card"><div className="stat-heading">CURRENT STREAK <span className="stat-icon red"><Icon name="flame" /></span></div><div className="stat-value">{account.streak} <span>days</span></div><small>Your current daily practice streak</small></article>
            </section>

            <section className="progress-panel">
              <div className="progress-title"><div><h2>Your progress</h2><p>Accepted solutions count toward your difficulty breakdown.</p></div><button onClick={() => setActiveView('Profile')}>View analytics <span>↗</span></button></div>
              <div className="difficulty-progress">{['Easy', 'Medium', 'Hard'].map((level) => {
                const count = account.difficultyCounts?.[level] || 0
                const total = problems.filter((problem) => problem.difficulty === level).length
                return <div className="difficulty-progress-row" key={level}><span className={`difficulty ${level.toLowerCase()}`}>{level}</span><div className="stat-progress"><i style={{ width: `${total ? count / total * 100 : 0}%` }} /></div><strong>{count}/{total}</strong></div>
              })}</div>
            </section>

            <section className="problems-section">
              <div className="section-heading"><div><h2>Problem set</h2><p>Find your next opportunity to grow.</p></div><button className="text-button" onClick={() => { setDifficulty('All difficulties'); setTopic('All topics'); setQuery('') }}>Browse all problems <span>→</span></button></div>
              {catalogError && <p className="api-notice">Showing the built-in sample catalog because the problems API could not be reached.</p>}
              <div className="filters">
                <label className="search-field"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search problems..." /></label>
                <select aria-label="Filter by difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option>All difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
                <select aria-label="Filter by topic" value={topic} onChange={(event) => setTopic(event.target.value)}>{topics.map((item) => <option key={item}>{item}</option>)}</select>
                <button className="filter-button" onClick={() => { setDifficulty('All difficulties'); setTopic('All topics') }}><Icon name="bars" /> Filters</button>
              </div>
              <div className="problem-table">
                <div className="table-header"><span>STATUS</span><span>TITLE</span><span>DIFFICULTY</span><span>ACCEPTANCE</span><span>TOPICS</span><span /></div>
                {filteredProblems.map((problem) => <button className={`problem-row ${selectedId === problem.id ? 'selected' : ''}`} key={problem.id} onClick={() => chooseProblem(problem)}>
                  <span className={`solved-indicator ${account.solvedIds?.includes(problem.id) ? 'done' : ''}`}>{account.solvedIds?.includes(problem.id) ? '✓' : ''}</span><span className="problem-title">{problem.title}</span><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><span className="acceptance">{problem.acceptance}</span><span className="topic-chips">{(problem.topics || []).slice(0, 2).map((item) => <i key={item}>{item}</i>)}</span><span className="row-arrow">›</span>
                </button>)}
                {filteredProblems.length === 0 && <div className="no-results">No problems match these filters.</div>}
              </div>
            </section>

            <section className="practice-panel">
              <div className="practice-intro">
                <div className="practice-meta"><span className={`difficulty ${selectedProblem.difficulty.toLowerCase()}`}>{selectedProblem.difficulty}</span><span>#{String(selectedProblem.id).padStart(3, '0')}</span><span>{selectedProblem.acceptance} acceptance</span></div>
                <h2>{selectedProblem.title}</h2>
                <div className="problem-description"><p>{selectedProblem.description}</p><h3>Examples</h3>{selectedProblem.examples?.map((example, index) => <div className="example" key={example.input}><strong>Example {index + 1}</strong><code>Input: {example.input}<br />Output: {example.output}</code></div>)}<h3>Constraints</h3><ul>{selectedProblem.constraints?.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul></div>
              </div>
              <div className="editor-panel">
                <div className="editor-toolbar"><div><span className="live-dot" /> CODE EDITOR</div><select aria-label="Programming language" value={language} onChange={changeLanguage}>{languages.map((item) => <option key={item}>{item}</option>)}</select></div>
                <div className="editor-wrap"><div className="line-numbers" aria-hidden="true">{code.split('\n').slice(0, 18).map((_, index) => <span key={index}>{index + 1}</span>)}</div><textarea aria-label="Code editor" spellCheck="false" value={code} onChange={(event) => setCode(event.target.value)} /></div>
                <div className="test-inputs"><label>Standard input<textarea aria-label="Standard input" value={stdin} onChange={(event) => setStdin(event.target.value)} placeholder="Input passed to your program" /></label></div>
                <div className="editor-footer"><span>⌘ Enter to run</span><div><button className="run-button" disabled={running} onClick={() => executeCode('run')}><Icon name="play" /> {running ? 'Running…' : 'Run code'}</button><button className="submit-button" disabled={running} onClick={() => executeCode('submit')}><Icon name="send" /> Submit</button></div></div>
                {(apiError || output) && <div className={`execution-result ${apiError ? 'execution-error' : output.status === 'Accepted' ? 'execution-success' : ''}`} role="status">{apiError ? <><strong>Execution unavailable</strong><span>{apiError}</span></> : <><strong>{output.status}</strong><span>{output.message || `${output.passed || 0}/${output.total || 0} test cases passed`}</span>{output.results?.map((test, index) => <small key={index}>Case {index + 1}: {test.status}</small>)}</>}</div>}
                <p className="judge-note">{frontendOnlyMode ? 'Preview only: this frontend demo does not execute code or save submissions.' : 'Run uses your standard input. Submit is checked against server-managed test cases. Configure Judge0 on the server.'}</p>
              </div>
            </section>
          </>
        )}

        {activeView === 'Leaderboard' && <section className="alternate-page"><p className="eyebrow">COMMUNITY</p><h1>Leaderboard <span>🏆</span></h1><p className="subheading">Global rankings based on accepted problem solutions.</p><div className="leaderboard-card"><div className="leader-row leader-head"><span>RANK</span><span>CODER</span><span>SOLVED</span><span>POINTS</span></div>{displayedLeaderboard.map(({ rank, username: coder, solved, points }) => <div className={`leader-row ${coder.toLowerCase() === username.toLowerCase() ? 'you' : ''}`} key={rank}><span className="rank-cell">{rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${String(rank).padStart(2, '0')}`}</span><span><span className="avatar avatar-tiny">{coder.slice(0, 2).toUpperCase()}</span>{coder}{coder.toLowerCase() === username.toLowerCase() && <i>You</i>}</span><span>{solved}</span><strong>{Number(points).toLocaleString()}</strong></div>)}{displayedLeaderboard.length === 0 && <div className="no-results">No ranked accounts yet. Solve a problem to appear here.</div>}</div></section>}

        {activeView === 'Profile' && <section className="alternate-page"><p className="eyebrow">YOUR JOURNEY</p><h1>Profile & analytics</h1><p className="subheading">A snapshot of your accepted solutions and practice streak.</p><div className="profile-overview"><span className="avatar avatar-large">{initials}</span><div><h2>{account.username}</h2><p>{account.email} · {account.rank ? `Global rank #${account.rank}` : 'Not ranked yet'}</p><span className="profile-tag">✦ Qodriva member</span></div></div><div className="profile-stats"><article className="stat-card"><div className="stat-heading">PROBLEMS SOLVED</div><div className="stat-value">{account.solvedCount}</div><small>Unique problems with accepted solutions</small></article><article className="stat-card"><div className="stat-heading">TOTAL POINTS</div><div className="stat-value">{Number(account.points).toLocaleString()}</div><small>10 Easy · 25 Medium · 50 Hard</small></article><article className="stat-card"><div className="stat-heading">CURRENT STREAK</div><div className="stat-value">{account.streak} <span>days</span></div><small>Consecutive days with accepted solutions</small></article></div><div className="progress-panel"><div className="progress-title"><div><h2>Difficulty breakdown</h2><p>Unique accepted problems by difficulty.</p></div></div><div className="difficulty-progress">{['Easy', 'Medium', 'Hard'].map((level) => <div className="difficulty-progress-row" key={level}><span className={`difficulty ${level.toLowerCase()}`}>{level}</span><div className="stat-progress"><i style={{ width: `${problems.filter((problem) => problem.difficulty === level).length ? (account.difficultyCounts?.[level] || 0) / problems.filter((problem) => problem.difficulty === level).length * 100 : 0}%` }} /></div><strong>{account.difficultyCounts?.[level] || 0}/{problems.filter((problem) => problem.difficulty === level).length}</strong></div>)}</div></div></section>}
      </main>
    </div>
  )
}

export default App
