import { useMemo, useState } from 'react';
import './QodrivaLearningExperience.css';

const PATHS = [
  {
    id: 'dsa', tag: 'DSA', title: 'Data Structures & Algorithms',
    description: 'Build strong problem-solving skills from arrays through graphs and dynamic programming.',
    modules: [
      { title: 'Arrays and strings', level: 'Beginner', explanation: 'Arrays store values by index; strings represent sequences of characters. Practice scanning, transforming, and comparing sequences.', points: ['Array indexing commonly starts at zero.', 'A full scan is O(n); nested scans may be O(n²).', 'Watch for empty inputs, duplicates, and off-by-one errors.'], code: 'const nums = [4, 7, 2];\nconst total = nums.reduce((sum, n) => sum + n, 0);\nconsole.log(total);', output: '13', exercise: 'Return the largest value in an array without sorting it.', solution: 'function largest(nums) {\n  let best = nums[0];\n  for (const n of nums) if (n > best) best = n;\n  return best;\n}\nconsole.log(largest([4, 7, 2]));', problems: ['Find the maximum element', 'Find the minimum element', 'Reverse an array in place', 'Rotate an array by k positions', 'Remove duplicates from a sorted array', 'Move all zeroes to the end', 'Find the second-largest distinct value', 'Check whether a string is a palindrome', 'Count character frequencies', 'Find the longest common prefix'] },
      { title: 'Searching and sorting', level: 'Beginner', explanation: 'Searching locates data; sorting arranges it. Choose an algorithm based on input order, size, and performance requirements.', points: ['Binary search requires sorted input.', 'Binary search is O(log n); linear search is O(n).', 'Stable sorting preserves the relative order of equal items.'], code: 'const nums = [8, 3, 5, 1];\nnums.sort((a, b) => a - b);\nconsole.log(nums.join(", "));', output: '1, 3, 5, 8', exercise: 'Implement binary search and return the index or -1.', solution: 'function binarySearch(a, target) {\n  let lo = 0, hi = a.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (a[mid] === target) return mid;\n    if (a[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}', problems: ['Implement linear search', 'Implement binary search', 'Find the first occurrence of a target', 'Find the insertion position', 'Merge two sorted arrays', 'Sort an array of 0s, 1s, and 2s', 'Find the kth smallest element', 'Count inversions in an array', 'Find a pair with a target sum', 'Search in a rotated sorted array'] },
      { title: 'Stacks and queues', level: 'Intermediate', explanation: 'Stacks use last-in, first-out order. Queues use first-in, first-out order. They help model parsing, scheduling, and breadth-first processing.', points: ['Stack: push and pop.', 'Queue: enqueue and dequeue.', 'A deque supports operations at both ends.'], code: 'const stack = [];\nstack.push("first");\nstack.push("second");\nconsole.log(stack.pop());', output: 'second', exercise: 'Use a stack to check whether brackets are balanced.', solution: 'function balanced(s) {\n  const stack = [], pairs = { ")": "(", "]": "[", "}": "{" };\n  for (const c of s) {\n    if ("([{".includes(c)) stack.push(c);\n    else if (pairs[c] && stack.pop() !== pairs[c]) return false;\n  }\n  return stack.length === 0;\n}', problems: ['Implement a stack', 'Implement a queue using an array', 'Check balanced parentheses', 'Evaluate postfix notation', 'Design a min stack', 'Implement a queue using two stacks', 'Find the next greater element', 'Simplify a Unix file path', 'Reverse the first k queue elements', 'Find the sliding-window maximum'] },
      { title: 'Trees and graphs', level: 'Intermediate', explanation: 'Trees represent hierarchies and graphs represent connections. Traversal strategies help visit nodes and discover paths.', points: ['DFS explores deeply before backtracking.', 'BFS explores by distance layers.', 'Visited sets prevent repeated work in cyclic graphs.'], code: 'const graph = { A: ["B", "C"], B: ["A"], C: ["A"] };\nconst seen = new Set(["A"]), queue = ["A"];\nwhile (queue.length) {\n  const node = queue.shift();\n  for (const next of graph[node]) if (!seen.has(next)) { seen.add(next); queue.push(next); }\n}\nconsole.log([...seen].join(" "));', output: 'A B C', exercise: 'Return the level-order traversal of a binary tree.', solution: 'function levelOrder(root) {\n  if (!root) return [];\n  const out = [], q = [root];\n  while (q.length) {\n    const n = q.shift(); out.push(n.val);\n    if (n.left) q.push(n.left);\n    if (n.right) q.push(n.right);\n  }\n  return out;\n}', problems: ['Implement preorder traversal', 'Implement inorder traversal', 'Implement postorder traversal', 'Print a tree level by level', 'Find the maximum tree depth', 'Check whether two trees are equal', 'Count connected components', 'Detect a cycle in an undirected graph', 'Find shortest path in an unweighted graph', 'Perform topological sorting'] },
      { title: 'Dynamic programming', level: 'Advanced', explanation: 'Dynamic programming saves answers to overlapping subproblems. Define a state, recurrence, base cases, and an evaluation order.', points: ['Memoization is top-down; tabulation is bottom-up.', 'State what each DP entry means.', 'Check base cases and transition boundaries.'], code: 'const n = 6;\nconst dp = Array(n + 1).fill(0);\ndp[1] = 1;\nfor (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];\nconsole.log(dp[n]);', output: '8', exercise: 'Calculate the minimum number of coins needed for an amount.', solution: 'function minCoins(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity); dp[0] = 0;\n  for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a-c] + 1);\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}', problems: ['Compute Fibonacci with memoization', 'Count ways to climb stairs', 'Solve the house robber problem', 'Find minimum coins for an amount', 'Find longest increasing subsequence', 'Find longest common subsequence', 'Solve 0/1 knapsack', 'Count paths through a grid', 'Find minimum path sum', 'Partition an array into equal-sum subsets'] }
    ]
  },
  {
    id: 'web', tag: 'WEB', title: 'Web Development',
    description: 'Create accessible, responsive pages and interactive browser experiences.',
    modules: [
      { title: 'HTML and accessibility', level: 'Beginner', explanation: 'HTML gives a page structure and meaning. Semantic markup, labels, and keyboard support help more people use your site.', points: ['Use headings in a meaningful order.', 'Associate labels with form controls.', 'Add useful alt text to informative images.'], code: '<main>\n  <h1>My learning page</h1>\n  <p>Practice a little every day.</p>\n  <button type="button">Start learning</button>\n</main>', output: 'A heading, paragraph, and button render on the page.', exercise: 'Build a labelled registration form with name and email.', solution: '<form>\n  <label for="name">Name</label><input id="name" name="name" required />\n  <label for="email">Email</label><input id="email" name="email" type="email" required />\n  <button type="submit">Register</button>\n</form>', problems: ['Create a semantic page layout', 'Build a labelled login form', 'Add accessible navigation', 'Create a table with a caption', 'Add alt text to images', 'Build a form with required fields', 'Create a details/summary FAQ', 'Use correct heading hierarchy', 'Make a keyboard-accessible menu', 'Build a progress indicator'] },
      { title: 'CSS and responsive layouts', level: 'Beginner', explanation: 'CSS controls layout, visual style, and responsive behavior. Flexbox works well for one-dimensional layouts; Grid handles rows and columns.', points: ['Prefer reusable classes.', 'Use responsive units and breakpoints.', 'Keep focus states visible and contrast readable.'], code: '.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 1rem;\n}', output: 'Cards wrap to fit the available viewport width.', exercise: 'Create a responsive three-card layout.', solution: '.cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }\n.card { padding:1.25rem; border:1px solid #30364a; border-radius:1rem; }', problems: ['Center a card vertically and horizontally', 'Create a responsive navbar', 'Build a two-column Grid layout', 'Make a card grid responsive', 'Create a button hover state', 'Style an accessible focus state', 'Build a sticky header', 'Create a responsive pricing table', 'Use Flexbox to align a toolbar', 'Create a mobile breakpoint'] },
      { title: 'JavaScript fundamentals', level: 'Beginner', explanation: 'JavaScript adds behavior to websites. Variables hold values, functions package behavior, and conditions and loops control execution.', points: ['Use const by default and let for reassignment.', 'Keep functions focused.', 'Validate user input and handle errors.'], code: 'const scores = [70, 85, 95];\nconst average = scores.reduce((sum, n) => sum + n, 0) / scores.length;\nconsole.log(average);', output: '83.33333333333333', exercise: 'Write a function that returns the largest number in an array.', solution: 'function largest(values) { return Math.max(...values); }\nconsole.log(largest([4, 9, 2]));', problems: ['Build a tip calculator', 'Validate an email field', 'Create a countdown timer', 'Filter a list as the user types', 'Sort objects by a property', 'Count words in a sentence', 'Build a tab switcher', 'Create a modal dialog', 'Store a preference in localStorage', 'Fetch and display JSON data'] },
      { title: 'React essentials', level: 'Intermediate', explanation: 'React builds interfaces from components. Props pass data, state stores changing values, and effects synchronize with external systems.', points: ['Keep components reusable.', 'Use stable keys for rendered lists.', 'Update state immutably.'], code: 'function Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}', output: 'Renders a greeting with the supplied name.', exercise: 'Create a counter component with increment and reset buttons.', solution: 'function Counter() {\n  const [count, setCount] = React.useState(0);\n  return <><p>{count}</p><button onClick={() => setCount(c => c + 1)}>+</button><button onClick={() => setCount(0)}>Reset</button></>;\n}', problems: ['Build a reusable button component', 'Create a counter with useState', 'Render a list with stable keys', 'Build a controlled form', 'Lift state to a parent', 'Create a search/filter component', 'Fetch data in useEffect', 'Build tabs with active state', 'Create a reusable modal', 'Persist theme preference'] },
      { title: 'API integration', level: 'Intermediate', explanation: 'Frontend code exchanges data with a server through HTTP requests. Handle loading, errors, and empty states instead of assuming every request succeeds.', points: ['Check response.ok.', 'Never expose secrets in browser code.', 'Show clear loading and error messages.'], code: 'async function loadItems() {\n  const response = await fetch("/api/items");\n  if (!response.ok) throw new Error("Request failed");\n  return response.json();\n}', output: 'Returns parsed JSON when the request succeeds.', exercise: 'Fetch a list and show a loading message while waiting.', solution: 'async function load() {\n  setLoading(true); setError("");\n  try { const r = await fetch("/api/items"); if (!r.ok) throw new Error("Request failed"); setItems(await r.json()); }\n  catch (e) { setError(e.message); } finally { setLoading(false); }\n}', problems: ['Fetch and display a collection', 'Post a new record', 'Handle a 404 response', 'Add loading and error states', 'Paginate API results', 'Debounce a search request', 'Cancel a stale request', 'Submit a multipart form', 'Add retry for a temporary failure', 'Display API validation errors'] }
    ]
  },
  {
    id: 'java', tag: 'JAVA', title: 'Java Programming',
    description: 'Master Java syntax, object-oriented design, collections, and robust error handling.',
    modules: [
      { title: 'Java basics', level: 'Beginner', explanation: 'Java is statically typed and organizes behavior in classes. A standard application begins in the main method.', points: ['Declare variable types.', 'Use System.out.println for line output.', 'Understand compile-time and runtime errors.'], code: 'public class Main {\n  public static void main(String[] args) {\n    int a = 4, b = 7;\n    System.out.println(a + b);\n  }\n}', output: '11', exercise: 'Read two integers and print their product.', solution: 'Scanner sc = new Scanner(System.in);\nint a = sc.nextInt(), b = sc.nextInt();\nSystem.out.println(a * b);', problems: ['Print a greeting', 'Add two integers', 'Check even or odd', 'Find the largest of three numbers', 'Compute factorial', 'Print a multiplication table', 'Reverse an integer', 'Check a palindrome number', 'Generate Fibonacci terms', 'Count digits in an integer'] },
      { title: 'Object-oriented programming', level: 'Beginner', explanation: 'Classes describe objects. Encapsulation protects internal state, inheritance shares behavior, and interfaces define capabilities.', points: ['Use private fields where appropriate.', 'Constructors initialize new objects.', 'Prefer composition when it makes relationships clearer.'], code: 'class Counter {\n  private int value;\n  public void increment() { value++; }\n  public int getValue() { return value; }\n}', output: 'A counter can increment and expose its value.', exercise: 'Create a BankAccount with deposit and withdraw methods.', solution: 'class BankAccount {\n  private double balance;\n  public void deposit(double amount) { if (amount > 0) balance += amount; }\n  public boolean withdraw(double amount) { if (amount <= 0 || amount > balance) return false; balance -= amount; return true; }\n  public double getBalance() { return balance; }\n}', problems: ['Create a Student class', 'Add constructor overloading', 'Encapsulate a bank balance', 'Demonstrate inheritance', 'Implement an interface', 'Override toString', 'Compare composition and inheritance in code', 'Model a library book', 'Create an immutable class', 'Use polymorphism for shapes'] },
      { title: 'Collections framework', level: 'Intermediate', explanation: 'Collections provide standard structures. List preserves order, Set stores unique values, and Map stores key-value associations.', points: ['Choose structures based on operations.', 'Use generics for type safety.', 'Know common complexity tradeoffs.'], code: 'Set<Integer> values = new LinkedHashSet<>(Arrays.asList(2, 2, 3, 4));\nSystem.out.println(values);', output: '[2, 3, 4]', exercise: 'Count the frequency of each word using a Map.', solution: 'Map<String, Integer> counts = new HashMap<>();\nfor (String word : words) counts.put(word, counts.getOrDefault(word, 0) + 1);', problems: ['Remove duplicates from a list', 'Count word frequencies with a Map', 'Sort a list of names', 'Find a value in a HashSet', 'Group students by grade', 'Use a PriorityQueue for smallest values', 'Merge two maps', 'Sort objects with Comparator', 'Build an LRU cache outline', 'Find common elements of two lists'] },
      { title: 'Exception handling', level: 'Intermediate', explanation: 'Exceptions represent errors or unusual conditions. Handle expected failures deliberately and preserve useful diagnostic information.', points: ['Catch specific exception types.', 'Do not silently swallow errors.', 'Use try-with-resources for closeable resources.'], code: 'try {\n  int value = Integer.parseInt("42");\n  System.out.println(value);\n} catch (NumberFormatException error) {\n  System.out.println("Please enter an integer");\n}', output: '42', exercise: 'Parse user input and handle invalid numeric text.', solution: 'try { System.out.println(Integer.parseInt(input)); }\ncatch (NumberFormatException e) { System.out.println("Invalid integer"); }', problems: ['Handle invalid integer input', 'Create a custom exception', 'Use try-with-resources', 'Validate a withdrawal amount', 'Handle missing files', 'Explain checked vs unchecked exceptions', 'Rethrow an exception with context', 'Use finally for cleanup', 'Validate constructor arguments', 'Design useful error messages'] },
      { title: 'Algorithms and practice', level: 'Practice', explanation: 'Translate requirements into input/output behavior, select a suitable algorithm, and test boundary cases before optimizing.', points: ['Start with a correct simple solution.', 'Analyze time and space complexity.', 'Test empty, duplicate, and boundary inputs.'], code: 'int[] values = {3, 5, 7};\nint sum = 0;\nfor (int value : values) sum += value;\nSystem.out.println(sum);', output: '15', exercise: 'Find the minimum value in an integer array.', solution: 'int min = values[0];\nfor (int value : values) if (value < min) min = value;\nSystem.out.println(min);', problems: ['Find array sum', 'Find second-largest value', 'Check an anagram', 'Merge sorted arrays', 'Find a missing number', 'Use two pointers for pair sum', 'Implement binary search', 'Validate brackets with a stack', 'Find longest unique substring', 'Compute the maximum subarray sum'] }
    ]
  },
  {
    id: 'python', tag: 'PY', title: 'Python Programming',
    description: 'Learn Python syntax, functions, collections, files, and algorithmic thinking.',
    modules: [
      { title: 'Syntax and types', level: 'Beginner', explanation: 'Python uses indentation for blocks. Common types include integers, floats, strings, booleans, lists, tuples, sets, and dictionaries.', points: ['Indent blocks consistently.', 'Convert input strings when doing numeric work.', 'Use readable variable names.'], code: 'name = "Qodriva"\nlevel = 1\nprint(f"{name} level {level}")', output: 'Qodriva level 1', exercise: 'Read two numbers and print their sum.', solution: 'a = int(input())\nb = int(input())\nprint(a + b)', problems: ['Print a formatted greeting', 'Convert Celsius to Fahrenheit', 'Swap two variables', 'Check a number sign', 'Find the largest of three values', 'Calculate simple interest', 'Convert seconds to hours/minutes', 'Check leap year', 'Count digits in a string', 'Format a receipt total'] },
      { title: 'Conditions and loops', level: 'Beginner', explanation: 'Conditionals select a branch, while loops repeat code. Use clear conditions and ensure loops make progress toward termination.', points: ['Use if/elif/else for branching.', 'Use for to iterate over sequences.', 'range excludes its stop value.'], code: 'for number in range(1, 5):\n    print(number * number)', output: '1\n4\n9\n16', exercise: 'Print even numbers from 1 through 20.', solution: 'for n in range(1, 21):\n    if n % 2 == 0:\n        print(n)', problems: ['Print a number triangle', 'Sum numbers from 1 to n', 'Print a multiplication table', 'Count vowels in a string', 'Reverse digits with a loop', 'Find factorial iteratively', 'Print all primes in a range', 'Generate a Fibonacci sequence', 'Find the GCD of two integers', 'Validate a numeric password rule'] },
      { title: 'Functions and modules', level: 'Beginner', explanation: 'Functions package reusable behavior and can accept arguments and return results. Modules organize code into reusable files.', points: ['Choose descriptive function names.', 'Return values when callers need them.', 'Keep side effects easy to understand.'], code: 'def area(width, height):\n    return width * height\n\nprint(area(4, 3))', output: '12', exercise: 'Write a function that returns whether a number is prime.', solution: 'def is_prime(n):\n    if n < 2: return False\n    for d in range(2, int(n ** 0.5) + 1):\n        if n % d == 0: return False\n    return True', problems: ['Write a reusable calculator function', 'Return the maximum of a list', 'Create a temperature converter module', 'Use default arguments', 'Use *args to sum values', 'Write a recursive factorial', 'Create a validation function', 'Use a lambda with sorted', 'Import a helper from another file', 'Write unit tests for a function'] },
      { title: 'Collections and files', level: 'Intermediate', explanation: 'Lists are ordered and mutable, tuples are immutable, sets store unique items, and dictionaries map keys to values. Files let programs persist information.', points: ['Choose data structures by required operations.', 'Use with open(...) to close files safely.', 'Handle missing or malformed input.'], code: 'scores = {"Asha": 90, "Ravi": 82}\nprint(scores["Asha"])', output: '90', exercise: 'Count unique words in a text file.', solution: 'with open("input.txt", encoding="utf-8") as f:\n    words = f.read().lower().split()\nprint(len(set(words)))', problems: ['Count item frequencies with a dict', 'Remove duplicates from a list', 'Group records by category', 'Sort a dictionary by value', 'Read a text file safely', 'Write results to a CSV file', 'Merge two dictionaries', 'Find common set elements', 'Flatten a nested list', 'Build a simple contact book'] },
      { title: 'Algorithms and practice', level: 'Practice', explanation: 'Break a problem into steps, implement a correct baseline, test edge cases, and then improve time or memory use if needed.', points: ['Use enumerate when index and value are needed.', 'Use built-ins when they improve clarity.', 'Explain complexity for nontrivial algorithms.'], code: 'def contains(values, target):\n    for value in values:\n        if value == target:\n            return True\n    return False\n\nprint(contains([2, 5, 8], 5))', output: 'True', exercise: 'Return the first index of a target or -1 if absent.', solution: 'def find_index(values, target):\n    for i, value in enumerate(values):\n        if value == target: return i\n    return -1', problems: ['Find a pair with a target sum', 'Check a palindrome', 'Find the missing number', 'Merge sorted lists', 'Find the longest common prefix', 'Use a sliding window for maximum sum', 'Find the first non-repeating character', 'Implement binary search', 'Validate balanced brackets', 'Find the longest substring without repeats'] }
    ]
  },
  {
    id: 'full', tag: 'FULL', title: 'Full-Stack Development',
    description: 'Connect a frontend, API, backend logic, database, authentication, and deployment.',
    modules: [
      { title: 'Frontend foundations', level: 'Beginner', explanation: 'Frontend code presents information and captures user actions. Separate UI from data operations and make loading/error states clear.', points: ['Build reusable components.', 'Validate for usability, then validate again on the server.', 'Never place private credentials in frontend code.'], code: 'const message = document.querySelector("#message");\nmessage.textContent = "Welcome to Qodriva";', output: 'The element with id message displays the welcome text.', exercise: 'Build a form that validates required fields before submission.', solution: 'const form = document.querySelector("form");\nform.addEventListener("submit", event => {\n  if (!form.reportValidity()) event.preventDefault();\n});', problems: ['Build a responsive login form', 'Create a reusable navbar', 'Add client-side validation', 'Show a loading spinner', 'Display an empty state', 'Build a search and filter panel', 'Create a paginated table', 'Persist a theme preference', 'Handle form submission feedback', 'Make a layout mobile-friendly'] },
      { title: 'REST APIs and Express', level: 'Beginner', explanation: 'HTTP APIs expose resources through endpoints and methods. Routes should validate input, return useful status codes, and handle errors consistently.', points: ['GET reads; POST creates; PATCH updates; DELETE removes.', 'Use JSON request and response bodies intentionally.', 'Do not expose stack traces or secrets to clients.'], code: 'app.get("/api/health", (req, res) => {\n  res.json({ status: "ok" });\n});', output: 'GET /api/health returns a JSON health status.', exercise: 'Create a GET endpoint that returns a list of courses.', solution: 'app.get("/api/courses", async (req, res, next) => {\n  try { res.json(await courseService.list()); }\n  catch (error) { next(error); }\n});', problems: ['Create a health endpoint', 'Build GET /api/courses', 'Create a POST endpoint', 'Validate a request body', 'Return correct 404 responses', 'Add pagination query parameters', 'Add filtering by difficulty', 'Implement centralized error handling', 'Configure CORS for a frontend origin', 'Write an API request test'] },
      { title: 'Backend services and auth', level: 'Intermediate', explanation: 'Backend services enforce business rules and protect private operations. Authentication verifies identity; authorization decides what an identity may do.', points: ['Hash passwords; never store plain text.', 'Validate and authorize every protected action.', 'Keep secrets in environment variables.'], code: 'app.get("/api/profile", requireAuth, (req, res) => {\n  res.json({ userId: req.user.id });\n});', output: 'A protected route returns data for the authenticated user.', exercise: 'Describe how a registration endpoint should validate a password.', solution: 'Validate input, hash the password with a password-hashing library, store only the hash, and return no password data.', problems: ['Design registration validation', 'Hash a password securely', 'Protect a route with middleware', 'Check user roles before admin actions', 'Add login rate limiting', 'Validate an access token', 'Implement logout/session invalidation', 'Avoid leaking account existence', 'Store secrets in environment variables', 'Write an authorization test'] },
      { title: 'Database design and SQL', level: 'Intermediate', explanation: 'Relational databases store entities in tables connected by keys. Constraints protect data quality and parameterized queries help prevent SQL injection.', points: ['Choose primary and foreign keys.', 'Use transactions for multi-step updates.', 'Index columns used by frequent lookups.'], code: 'CREATE TABLE courses (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  title VARCHAR(120) NOT NULL\n);', output: 'Creates a courses table with a generated id and required title.', exercise: 'Create a lessons table that references courses.', solution: 'CREATE TABLE lessons (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  course_id INT NOT NULL,\n  title VARCHAR(120) NOT NULL,\n  FOREIGN KEY (course_id) REFERENCES courses(id)\n);', problems: ['Design users and courses tables', 'Add a foreign key constraint', 'Write a JOIN query', 'Count lessons per course', 'Find duplicate emails', 'Use a parameterized query', 'Wrap updates in a transaction', 'Choose an index for a lookup', 'Paginate SQL results', 'Design a many-to-many relationship'] },
      { title: 'Deployment and testing', level: 'Intermediate', explanation: 'Deployment packages your app for users. Configure environment variables, build assets, provision the database, run tests, and inspect logs after release.', points: ['Keep development and production configuration separate.', 'Never commit credentials.', 'Test health checks and database connectivity after deployment.'], code: 'npm run build\n# Set production environment variables\n# Deploy the frontend and backend services', output: 'A production build is created; exact deploy steps depend on the hosting provider.', exercise: 'List three checks to run after deploying an API.', solution: 'Check health endpoint, database connectivity, and logs; then test a real API request with valid and invalid input.', problems: ['Create a production build', 'Configure environment variables', 'Set allowed CORS origins', 'Add a health check', 'Read deployment logs', 'Run database migrations safely', 'Configure a custom domain', 'Add a basic CI test job', 'Plan a rollback', 'Verify production API connectivity'] }
    ]
  },
  {
    id: 'aiml', tag: 'AI/ML', title: 'AI & Machine Learning',
    description: 'Explore data preparation, model foundations, evaluation, and responsible AI.',
    modules: [
      { title: 'Python for data', level: 'Beginner', explanation: 'Python is commonly used for data workflows. Start by inspecting types, shapes, summary statistics, and data quality.', points: ['Inspect the dataset before transforming it.', 'Keep data transformations reproducible.', 'Document assumptions about columns and units.'], code: 'values = [3, 5, 7]\nmean = sum(values) / len(values)\nprint(mean)', output: '5.0', exercise: 'Compute the minimum, maximum, and mean of a list.', solution: 'values = [3, 5, 7]\nprint(min(values), max(values), sum(values) / len(values))', problems: ['Compute mean and median', 'Find missing values in records', 'Summarize a numeric column', 'Group rows by a category', 'Normalize a list of numbers', 'Detect duplicate rows', 'Read a CSV file', 'Plot a simple distribution', 'Compute a correlation matrix', 'Explain data types and units'] },
      { title: 'Data preparation', level: 'Beginner', explanation: 'Preparation addresses missing values, inconsistent formats, duplicates, encoding, and scaling. Fit learned transformations on training data only.', points: ['Explore missingness before imputing.', 'Avoid data leakage from test sets.', 'Apply transformations consistently at inference time.'], code: 'rows = [{"age": 20}, {"age": 30}, {"age": 40}]\nages = [row["age"] for row in rows]\nprint(sum(ages) / len(ages))', output: '30.0', exercise: 'Choose a sensible strategy for missing numeric values and explain why.', solution: 'A median imputer fitted on the training set can be appropriate for skewed numeric features; document the choice.', problems: ['Impute missing numeric values', 'Encode a categorical feature', 'Scale numeric columns', 'Split train and test data', 'Detect outliers', 'Remove duplicate records', 'Build a preprocessing pipeline', 'Avoid target leakage', 'Handle imbalanced labels', 'Validate input feature ranges'] },
      { title: 'Machine learning foundations', level: 'Intermediate', explanation: 'Supervised learning uses labeled examples; unsupervised learning explores structure without target labels. A baseline helps determine whether a model adds value.', points: ['Split data before fitting preprocessing.', 'Choose metrics that match the task.', 'Compare with a simple baseline.'], code: 'from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)', output: 'Creates train and test partitions when X and y are defined.', exercise: 'Explain the difference between classification and regression.', solution: 'Classification predicts categories; regression predicts numeric values.', problems: ['Build a train/test split', 'Train a baseline classifier', 'Fit a linear regression model', 'Compare KNN and logistic regression', 'Cluster unlabeled observations', 'Choose features and target', 'Explain overfitting', 'Explain bias and variance', 'Use cross-validation', 'Build a reproducible pipeline'] },
      { title: 'Model evaluation', level: 'Intermediate', explanation: 'Evaluation estimates generalization. Classification uses metrics such as precision, recall, and F1; regression may use MAE, MSE, or R².', points: ['Accuracy can mislead on imbalanced data.', 'Use validation data for model selection.', 'Report limitations and uncertainty.'], code: 'actual = [1, 1, 0, 0]\npredicted = [1, 0, 0, 0]\ncorrect = sum(a == p for a, p in zip(actual, predicted))\nprint(correct / len(actual))', output: '0.75', exercise: 'Explain why recall can matter for rare positive cases.', solution: 'Recall measures the fraction of actual positive cases detected; low recall means many positives are missed.', problems: ['Calculate accuracy', 'Calculate precision and recall', 'Build a confusion matrix', 'Compare MAE and MSE', 'Interpret an ROC curve', 'Choose a threshold for recall', 'Detect overfitting from scores', 'Compare cross-validation folds', 'Evaluate imbalanced classes', 'Write an honest model report'] },
      { title: 'Mini project and responsible AI', level: 'Practice', explanation: 'A useful project defines a question, dataset, baseline, model, evaluation, and limitations. Consider privacy, fairness, and how predictions may be used.', points: ['Define intended use and non-use.', 'Keep test data separate from training.', 'Document risks and data limitations.'], code: 'steps = ["Define question", "Inspect data", "Build baseline", "Train", "Evaluate", "Document limits"]\nfor step in steps:\n    print(step)', output: 'Prints the six project stages in order.', exercise: 'Write one measurable prediction question and one limitation.', solution: 'Example: predict house prices using a held-out test set and MAE. Limitation: results may not generalize to regions absent from training data.', problems: ['Choose a dataset and target', 'Define a baseline metric', 'Document dataset provenance', 'Check for subgroup performance gaps', 'Explain a prediction to a user', 'Identify privacy risks', 'Write a model card outline', 'Check for label leakage', 'Create a reproducible experiment', 'Present results and limitations'] }
    ]
  }
];

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C', 'C++', 'HTML/CSS'];

function makeStarter(module, language) {
  if (language === 'Python') return '# Write your solution here\n\ndef solve():\n    pass\n\nif __name__ == "__main__":\n    solve()';
  if (language === 'Java') return 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}';
  if (language === 'C') return '#include <stdio.h>\n\nint main(void) {\n    // Write your solution here\n    return 0;\n}';
  if (language === 'C++') return '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}';
  if (language === 'HTML/CSS') return '<!doctype html>\n<html>\n<head><meta charset="utf-8"><title>Practice</title></head>\n<body>\n  <!-- Build your solution here -->\n</body>\n</html>';
  return '// Write your solution here\nfunction solve(input) {\n  // TODO\n  return input;\n}\n\nconsole.log(solve("test"));';
}

export default function QodrivaLearningExperience() {
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qodriva-learning-progress-v3') || '{}'); } catch { return {}; }
  });
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [editorCode, setEditorCode] = useState('');
  const [runMessage, setRunMessage] = useState('Your output will appear here.');
  const [showSolution, setShowSolution] = useState(false);
  const [activeProblem, setActiveProblem] = useState(0);
  const [problemPage, setProblemPage] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qodriva-solved-problems-v1') || '{}'); } catch { return {}; }
  });

  const paths = useMemo(() => PATHS.map(path => {
    const total = path.modules.length;
    const done = path.modules.filter(m => m.problems.every((_, i) => solvedProblems[`${path.id}::${m.title}::${i}`])).length;
    return { ...path, total, done };
  }), [progress, solvedProblems]);
  const currentPath = selected ? PATHS.find(p => p.id === selected.pathId) : null;
  const currentModule = currentPath ? currentPath.modules.find(m => m.title === selected.moduleTitle) : null;
  const completedCount = PATHS.reduce((sum, p) => sum + p.modules.filter(m => m.problems.every((_, i) => solvedProblems[`${p.id}::${m.title}::${i}`])).length, 0);
  const totalLessons = PATHS.reduce((sum, p) => sum + p.modules.length, 0);

  function openModule(pathId, moduleTitle) {
    const module = PATHS.find(p => p.id === pathId)?.modules.find(m => m.title === moduleTitle);
    setSelected({ pathId, moduleTitle });
    setProblemPage(false);
    setLanguage(pathId === 'java' ? 'Java' : pathId === 'python' || pathId === 'aiml' ? 'Python' : 'JavaScript');
    setEditorCode(makeStarter(module, pathId === 'java' ? 'Java' : pathId === 'python' || pathId === 'aiml' ? 'Python' : 'JavaScript'));
    setRunMessage('Ready when you are. Write your solution in the editor and select Run.');
    setShowSolution(false);
    setActiveProblem(0);
  }

  function selectLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setEditorCode(makeStarter(currentModule, nextLanguage));
    setRunMessage(`Editor changed to ${nextLanguage}.`);
  }

  function markProblemSolved(pathId, moduleTitle, problemIndex) {
    const key = `${pathId}::${moduleTitle}::${problemIndex}`;
    setSolvedProblems(previous => {
      const next = { ...previous, [key]: true };
      try { localStorage.setItem('qodriva-solved-problems-v1', JSON.stringify(next)); } catch {}
      return next;
    });
    setRunMessage('Problem marked solved. Your topic and syllabus progress have been updated.');
  }

  function runCode() {
    if (!editorCode.trim()) { setRunMessage('Write some code before running it.'); return; }
    if (language !== 'JavaScript') {
      setRunMessage(`Your ${language} code is in the editor. To compile and run this language, connect a backend code-runner/judge API. This browser-only preview does not execute ${language}.`);
      return;
    }
    try {
      const logs = [];
      const safeConsole = { log: (...args) => logs.push(args.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(' ')), error: (...args) => logs.push(args.join(' ')), warn: (...args) => logs.push(args.join(' ')) };
      const fn = new Function('console', `"use strict";\n${editorCode}\n`); // JavaScript-only local preview
      fn(safeConsole);
      setRunMessage(logs.length ? logs.join('\n') : 'Executed successfully. No console output.');
    } catch (error) {
      setRunMessage(`Error: ${error.message}`);
    }
  }

  const visiblePaths = paths.filter(path => {
    const matchesFilter = filter === 'All' || (filter === 'In progress' && path.done > 0 && path.done < path.total) || (filter === 'Not started' && path.done === 0) || (filter === 'Completed' && path.done === path.total);
    const matchesSearch = `${path.title} ${path.description} ${path.modules.map(m => m.title).join(' ')}`.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (currentPath && currentModule) {
    const done = currentModule.problems.every((_, i) => solvedProblems[`${currentPath.id}::${currentModule.title}::${i}`]);
    const currentProblem = currentModule.problems[activeProblem];
    const problemSolved = Boolean(solvedProblems[`${currentPath.id}::${currentModule.title}::${activeProblem}`]);
    if (problemPage) return (
      <section className="qle-root qle-lesson-view qle-problem-page">
        <div className="qle-lesson-topbar">
          <button className="qle-ghost-button" onClick={() => setProblemPage(false)}>← Back to {currentModule.title}</button>
          <span>{currentPath.title} / {currentModule.title} / Problem {activeProblem + 1}</span>
        </div>
        <header className="qle-lesson-heading">
          <span className="qle-eyebrow">CODING CHALLENGE · {activeProblem + 1} OF {currentModule.problems.length}</span>
          <h1>{currentProblem}</h1>
          <p>{currentModule.explanation}</p>
          <div className="qle-lesson-meta"><span>Topic: {currentModule.title}</span><span>{problemSolved ? '✓ Solved' : 'Not completed yet'}</span></div>
        </header>
        <div className="qle-problem-detail-grid">
          <main className="qle-lesson-main">
            <article className="qle-content-card">
              <h2>Problem statement</h2>
              <p>Write a solution for <strong>{currentProblem}</strong>. Explain or implement the approach for the selected language. Consider empty inputs, duplicate values, and boundary cases where relevant.</p>
              <h3>Concepts to use</h3><ul className="qle-points">{currentModule.points.map(point => <li key={point}>{point}</li>)}</ul>
              <h3>Example reference</h3><pre className="qle-code"><code>{currentModule.code}</code></pre>
              <div className="qle-output"><span>EXPECTED EXAMPLE RESULT</span><pre>{currentModule.output}</pre></div>
            </article>
            <article className="qle-content-card qle-editor-card">
              <div className="qle-editor-header"><div><span className="qle-eyebrow">QODRIVA CODE LAB</span><h2>Your solution</h2><p>Write your code below, then run it to inspect the output.</p></div>
                <label className="qle-language-select">Language<select value={language} onChange={event => selectLanguage(event.target.value)}>{LANGUAGES.map(item => <option key={item}>{item}</option>)}</select></label>
              </div>
              <div className="qle-editor-toolbar"><span><b>solution.{language === 'JavaScript' ? 'js' : language === 'Python' ? 'py' : language === 'Java' ? 'java' : language === 'C++' ? 'cpp' : language === 'C' ? 'c' : 'html'}</b></span><button className="qle-ghost-button" onClick={() => setEditorCode(makeStarter(currentModule, language))}>Reset code</button></div>
              <textarea className="qle-code-editor" value={editorCode} onChange={event => setEditorCode(event.target.value)} spellCheck="false" aria-label="Problem solution editor" placeholder="Type your solution here..." />
              <div className="qle-run-row"><span>Run JavaScript locally; other languages need a backend runner.</span><button className="qle-primary-button" onClick={runCode}>▶ Run code</button></div>
              <div className="qle-console"><div className="qle-console-heading"><span>OUTPUT / CONSOLE</span><button className="qle-ghost-button" onClick={() => setRunMessage('Your output will appear here.')}>Clear</button></div><pre>{runMessage}</pre></div>
              <button className={problemSolved ? 'qle-complete-button is-done' : 'qle-complete-button'} disabled={problemSolved} onClick={() => markProblemSolved(currentPath.id, currentModule.title, activeProblem)}>{problemSolved ? '✓ Problem marked solved' : 'Mark problem solved'}</button>
              <p className="qle-run-note">Only mark the problem solved after you have checked your approach and output. Automated correctness tests require a judge backend.</p>
              <div className="qle-next-buttons"><button className="qle-outline-button" disabled={activeProblem === 0} onClick={() => { setActiveProblem(i => i - 1); setEditorCode(makeStarter(currentModule, language)); }}>← Previous problem</button><button className="qle-primary-button" disabled={activeProblem === currentModule.problems.length - 1} onClick={() => { setActiveProblem(i => i + 1); setEditorCode(makeStarter(currentModule, language)); setRunMessage('Next problem opened.'); }}>Next problem →</button></div>
            </article>
          </main>
          <aside className="qle-lesson-sidebar"><h2>Problems in this topic</h2>{currentModule.problems.map((problem, index) => <button key={problem} className={`qle-module-row ${activeProblem === index ? 'is-active' : ''}`} onClick={() => { setActiveProblem(index); setEditorCode(makeStarter(currentModule, language)); setRunMessage('Problem opened.'); }}><span>{solvedProblems[`${currentPath.id}::${currentModule.title}::${index}`] ? '✓' : index + 1}</span><b>{problem}</b></button>)}</aside>
        </div>
      </section>
    );
    return (
      <section className="qle-root qle-lesson-view">
        <div className="qle-lesson-topbar">
          <button className="qle-ghost-button" onClick={() => { setSelected(null); setProblemPage(false); }}>← All learning paths</button>
          <span>{currentPath.title} <b>/</b> {currentModule.title}</span>
        </div>
        <header className="qle-lesson-heading">
          <span className="qle-eyebrow">{currentPath.tag} LEARNING PATH · {currentModule.level}</span>
          <h1>{currentModule.title}</h1>
          <p>{currentModule.explanation}</p>
          <div className="qle-lesson-meta">
            <span>◷ 35–45 min</span><span>✓ Concept · Example · Practice</span><span>{done ? 'Completed' : 'In progress'}</span>
          </div>
        </header>

        <div className="qle-lesson-layout">
          <main className="qle-lesson-main">
            <article className="qle-content-card">
              <h2>Concepts to understand</h2>
              <ul className="qle-points">{currentModule.points.map(point => <li key={point}>{point}</li>)}</ul>
              <div className="qle-section-heading"><div><span className="qle-step">01</span><h2>Worked example</h2></div></div>
              <pre className="qle-code"><code>{currentModule.code}</code></pre>
              <div className="qle-output"><span>EXPECTED RESULT</span><pre>{currentModule.output}</pre></div>
              <div className="qle-exercise">
                <span className="qle-eyebrow">YOUR TURN</span>
                <h2>Practice exercise</h2>
                <p>{currentModule.exercise}</p>
                <button className="qle-outline-button" onClick={() => setShowSolution(v => !v)}>{showSolution ? 'Hide solution' : 'Need a hint? View solution'} <span>{showSolution ? '−' : '↗'}</span></button>
                {showSolution && <div className="qle-solution-panel"><h3>One possible solution</h3><pre className="qle-code"><code>{currentModule.solution}</code></pre><p>Try recreating the solution without looking, then test an edge case.</p></div>}
              </div>
            </article>

            <article className="qle-content-card qle-problem-card">
              <div className="qle-problem-heading">
                <div><span className="qle-eyebrow">PRACTICE SET</span><h2>10 problems for this topic</h2><p>Choose a problem, read the task, then type your answer in the editor below.</p></div>
                <span className="qle-problem-count">{activeProblem + 1} / {currentModule.problems.length}</span>
              </div>
              <div className="qle-problem-list">
                {currentModule.problems.map((problem, index) => (
                  <button key={problem} className={`qle-problem-item ${activeProblem === index ? 'is-selected' : ''}`} onClick={() => { setActiveProblem(index); setProblemPage(true); setEditorCode(makeStarter(currentModule, language)); setShowSolution(false); setRunMessage('Problem opened. Read the question, write your solution, then run it.'); }}>
                    <span className="qle-problem-number">{solvedProblems[`${currentPath.id}::${currentModule.title}::${index}`] ? '✓' : String(index + 1).padStart(2, '0')}</span>
                    <span className="qle-problem-title">{problem}</span>
                    <span className="qle-problem-arrow">{solvedProblems[`${currentPath.id}::${currentModule.title}::${index}`] ? 'Solved' : 'Open ↗'}</span>
                  </button>
                ))}
              </div>
              <div className="qle-current-problem">
                <span className="qle-eyebrow">SELECTED CHALLENGE</span>
                <h3>{currentProblem}</h3>
                <p>Implement a solution for this challenge. Consider normal cases, empty input where applicable, and boundary conditions. Add your own test examples before submitting.</p>
              </div>
            </article>

            <article className="qle-content-card qle-editor-card">
              <div className="qle-editor-header">
                <div><span className="qle-eyebrow">QODRIVA CODE LAB</span><h2>Write and test your solution</h2><p>The editor has a large typing area. Select a language and start coding.</p></div>
                <label className="qle-language-select">Language
                  <select value={language} onChange={event => selectLanguage(event.target.value)}>{LANGUAGES.map(item => <option key={item}>{item}</option>)}</select>
                </label>
              </div>
              <div className="qle-editor-toolbar"><span><i className="qle-dot qle-dot-red" /><i className="qle-dot qle-dot-yellow" /><i className="qle-dot qle-dot-green" /> <b>solution.{language === 'JavaScript' ? 'js' : language === 'Python' ? 'py' : language === 'Java' ? 'java' : language === 'C++' ? 'cpp' : language === 'C' ? 'c' : 'html'}</b></span><button className="qle-ghost-button" onClick={() => setEditorCode(makeStarter(currentModule, language))}>Reset code</button></div>
              <textarea className="qle-code-editor" value={editorCode} onChange={event => setEditorCode(event.target.value)} spellCheck="false" aria-label="Code editor" placeholder="Type your solution here..." />
              <div className="qle-run-row"><span>Tip: use the full editor area; you can resize it from the corner.</span><button className="qle-primary-button" onClick={runCode}>▶ Run code</button></div>
              <div className="qle-console"><div className="qle-console-heading"><span>OUTPUT / CONSOLE</span><button className="qle-ghost-button" onClick={() => setRunMessage('Your output will appear here.')}>Clear</button></div><pre>{runMessage}</pre></div>
              <p className="qle-run-note">JavaScript runs in this local preview. Python, Java, C, and C++ require a backend code execution service to compile and run securely.</p>
            </article>

            <div className="qle-complete-row">
              <div className="qle-topic-status">{done ? '✓ Topic completed — all 10 problems solved' : `${currentModule.problems.filter((_, i) => solvedProblems[`${currentPath.id}::${currentModule.title}::${i}`]).length} of ${currentModule.problems.length} problems solved`}</div>
              <div className="qle-next-buttons">
                <button className="qle-outline-button" disabled={currentPath.modules.findIndex(m => m.title === currentModule.title) === 0} onClick={() => { const i = currentPath.modules.findIndex(m => m.title === currentModule.title); openModule(currentPath.id, currentPath.modules[i - 1].title); }}>← Previous topic</button>
                <button className="qle-primary-button" disabled={currentPath.modules.findIndex(m => m.title === currentModule.title) === currentPath.modules.length - 1} onClick={() => { const i = currentPath.modules.findIndex(m => m.title === currentModule.title); openModule(currentPath.id, currentPath.modules[i + 1].title); }}>Next topic →</button>
              </div>
            </div>
          </main>

          <aside className="qle-lesson-sidebar">
            <h2>Course modules</h2>
            <p className="qle-sidebar-caption">{currentPath.modules.filter(m => m.problems.every((_, i) => solvedProblems[`${currentPath.id}::${m.title}::${i}`])).length} of {currentPath.modules.length} topics completed</p>
            {currentPath.modules.map((module, index) => (
              <button key={module.title} className={`qle-module-row ${module.title === currentModule.title ? 'is-active' : ''}`} onClick={() => openModule(currentPath.id, module.title)}>
                <span>{index + 1}</span><b>{module.title}</b><i>{module.problems.every((_, i) => solvedProblems[`${currentPath.id}::${module.title}::${i}`]) ? '✓' : `${module.problems.filter((_, i) => solvedProblems[`${currentPath.id}::${module.title}::${i}`]).length}/10`}</i>
              </button>
            ))}
            <div className="qle-sidebar-stat"><strong>{currentModule.problems.length}</strong><span>problems in this topic</span></div>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="qle-root">
      <header className="qle-page-header">
        <span className="qle-eyebrow">QODRIVA LEARNING ACADEMY</span>
        <h1>Learn concepts. <span>Practice for real.</span></h1>
        <p>Explore structured learning paths with explanations, worked examples, 10 practice problems per topic, and a roomy code editor.</p>
      </header>
      <div className="qle-progress-card">
        <div><span className="qle-eyebrow">YOUR LEARNING PROGRESS</span><h2>{completedCount} / {totalLessons} topics completed</h2></div>
        <div className="qle-progress-track"><span style={{ width: `${totalLessons ? completedCount / totalLessons * 100 : 0}%` }} /></div>
      </div>
      <div className="qle-path-controls">
        <label className="qle-search-box"><span>⌕</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search paths or concepts..." /></label>
        <div className="qle-filter-row">{['All', 'Not started', 'In progress', 'Completed'].map(item => <button key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
      </div>
      <div className="qle-path-grid">
        {visiblePaths.map(path => (
          <article className="qle-path-card" key={path.id}>
            <div className="qle-path-card-top"><span className="qle-path-tag">{path.tag}</span><span className="qle-path-progress">{path.done}/{path.total} topics</span></div>
            <h2>{path.title}</h2><p>{path.description}</p>
            <div className="qle-mini-progress"><span style={{ width: `${path.done / path.total * 100}%` }} /></div>
            <div className="qle-module-preview">{path.modules.slice(0, 3).map(module => <span key={module.title}>{module.title}</span>)}<small>+ {path.modules.length - 3} more topics</small></div>
            <button className="qle-primary-button qle-open-path" onClick={() => openModule(path.id, path.modules[0].title)}>Explore path <span>→</span></button>
            <div className="qle-topic-picker"><span>Jump to a topic</span><select defaultValue="" onChange={event => event.target.value && openModule(path.id, event.target.value)}><option value="" disabled>Select concept...</option>{path.modules.map(module => <option key={module.title} value={module.title}>{module.title}</option>)}</select></div>
          </article>
        ))}
      </div>
      {visiblePaths.length === 0 && <div className="qle-empty-state">No learning paths match that search. Try another keyword.</div>}
      <div className="qle-learning-note"><strong>Included:</strong> 6 learning paths · 30 concepts · 300 topic problems · lesson completion saved in this browser.</div>
    </section>
  );
}
