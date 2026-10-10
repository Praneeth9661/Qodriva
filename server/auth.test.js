const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET ||= 'test-only-codearena-secret';
process.env.JUDGE0_API_URL ||= 'http://judge.test';
process.env.JUDGE0_POLL_INTERVAL_MS ||= '100';

const { app } = require('./index');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

async function request(path, options) {
  return fetch(`${baseUrl}${path}`, options);
}

test('registration creates a protected session and login/logout work', async () => {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const username = `tester_${suffix}`.slice(0, 24);
  const email = `${suffix}@example.test`;
  const password = 'safe-test-password-2026';

  const rejectedSubmission = await request('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(rejectedSubmission.status, 401);

  const registration = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, rememberMe: true }),
  });
  assert.equal(registration.status, 201);
  const created = await registration.json();
  assert.equal(created.user.username, username);
  assert.equal(created.user.email, email);
  assert.equal('password' in created.user, false);
  assert.equal('passwordHash' in created.user, false);

  const cookieHeader = registration.headers.get('set-cookie');
  assert.match(cookieHeader, /HttpOnly/i);
  assert.match(cookieHeader, /SameSite=Strict/i);
  assert.match(cookieHeader, /Max-Age=604800/i);
  const sessionCookie = cookieHeader.split(';')[0];

  const currentUser = await request('/api/auth/me', { headers: { Cookie: sessionCookie } });
  assert.equal(currentUser.status, 200);
  assert.equal((await currentUser.json()).user.username, username);

  const duplicate = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.toUpperCase(), email, password }),
  });
  assert.equal(duplicate.status, 409);

  const invalidLogin = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password: 'incorrect-password' }),
  });
  assert.equal(invalidLogin.status, 401);

  const login = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: username.toUpperCase(), password }),
  });
  assert.equal(login.status, 200);
  assert.equal((await login.json()).user.email, email);
  const loginCookie = login.headers.get('set-cookie').split(';')[0];

  const authenticatedSubmission = await request('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: loginCookie },
    body: JSON.stringify({}),
  });
  assert.equal(authenticatedSubmission.status, 400);

  const memberUserManagement = await request('/api/users', { headers: { Cookie: loginCookie } });
  assert.equal(memberUserManagement.status, 403);

  const logout = await request('/api/auth/logout', { method: 'POST' });
  assert.equal(logout.status, 204);
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/i);

  const invalidatedSession = await request('/api/auth/me');
  assert.equal(invalidatedSession.status, 401);
});

test('registration validates credentials before creating an account', async () => {
  const tooShortPassword = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'valid_user', email: 'valid@example.test', password: 'short' }),
  });
  assert.equal(tooShortPassword.status, 400);

  const invalidUsername = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'x!', email: 'valid@example.test', password: 'long-enough-password' }),
  });
  assert.equal(invalidUsername.status, 400);
});

test('API allows only configured browser origins and supports credentialed requests', async () => {
  const allowedOrigin = await request('/api/health', {
    headers: { Origin: 'http://localhost:5173' },
  });
  assert.equal(allowedOrigin.status, 200);
  assert.equal(allowedOrigin.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  assert.equal(allowedOrigin.headers.get('access-control-allow-credentials'), 'true');

  const rejectedOrigin = await request('/api/auth/logout', {
    method: 'POST',
    headers: { Origin: 'https://attacker.example' },
  });
  assert.equal(rejectedOrigin.status, 403);
});

test('production sessions use cross-site secure cookies for the Vercel frontend', async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const registration = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `prod_${suffix}`.slice(0, 24),
        email: `${suffix}@example.test`,
        password: 'safe-test-password-2026',
      }),
    });
    assert.equal(registration.status, 201);
    const cookie = registration.headers.get('set-cookie');
    assert.match(cookie, /SameSite=None/i);
    assert.match(cookie, /Secure/i);
    assert.match(cookie, /HttpOnly/i);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
  }
});

test('problem detail returns public fields and a not-found response for unknown IDs', async () => {
  const detail = await request('/api/problems/1');
  assert.equal(detail.status, 200);
  const problem = await detail.json();
  assert.equal(problem.id, 1);
  assert.equal(problem.title, 'Two Sum');
  assert.equal('expectedOutput' in problem, false);
  assert.equal('solved' in problem, false);

  const unknownProblem = await request('/api/problems/999');
  assert.equal(unknownProblem.status, 404);
  assert.deepEqual(await unknownProblem.json(), { message: 'Problem not found.' });

  const invalidProblemId = await request('/api/problems/not-a-number');
  assert.equal(invalidProblemId.status, 404);
  assert.deepEqual(await invalidProblemId.json(), { message: 'Problem not found.' });
});

test('local frontend and same-origin app requests pass origin checks', async () => {
  for (const origin of ['http://localhost:5173', 'http://localhost:5000']) {
    const response = await request('/api/auth/logout', {
      method: 'POST',
      headers: { Origin: origin },
    });
    assert.equal(response.status, 204, `${origin} should be allowed`);
  }

  const untrustedOrigin = await request('/api/auth/logout', {
    method: 'POST',
    headers: { Origin: 'https://untrusted.example' },
  });
  assert.equal(untrustedOrigin.status, 403);
});

test('verified submissions are account-scoped and award points only once', async () => {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const register = async (username) => {
    const response = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email: `${username}@example.test`, password: 'safe-test-password-2026' }),
    });
    assert.equal(response.status, 201);
    return response.headers.get('set-cookie').split(';')[0];
  };

  const firstCookie = await register(`first_${suffix}`.slice(0, 24));
  const secondCookie = await register(`second_${suffix}`.slice(0, 24));
  const problems = await request('/api/problems');
  const catalog = await problems.json();
  assert.equal(catalog.some((problem) => Object.hasOwn(problem, 'expectedOutput')), false);

  const originalFetch = global.fetch;
  let outputMode = 'wrong';
  let asyncPolling = false;
  let asyncOutput = '';
  let pollCount = 0;
  const judgePayloads = [];
  global.fetch = async (input, options) => {
    if (!String(input).startsWith('http://judge.test/')) return originalFetch(input, options);
    if (options.method === 'GET') {
      pollCount += 1;
      const stillQueued = pollCount % 2 === 1;
      return new Response(JSON.stringify({
        status: stillQueued ? { id: 2, description: 'Processing' } : { id: 3, description: 'Accepted' },
        stdout: asyncOutput,
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    const payload = JSON.parse(options.body);
    judgePayloads.push(payload);
    const stdout = outputMode === 'pass'
      ? ({ '4 2 7 11 15\n9': '0 1', '3 3 2 4\n6': '1 2', '4 3 3 8 9\n6': '0 1' }[payload.stdin] || '')
      : '0 1';
    if (asyncPolling) {
      asyncOutput = stdout;
      return new Response(JSON.stringify({ token: 'test-token', status: { id: 1, description: 'In Queue' } }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ status: { id: 3, description: 'Accepted' }, stdout }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const submit = async (cookie, mode = 'submit') => request('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({
        problemId: 1,
        language: 'JavaScript',
        sourceCode: 'console.log("0 1")',
        mode,
        stdin: mode === 'run' ? '4 2 7 11 15\n9' : '',
        expectedOutput: '0 1',
      }),
    });

    const runOnly = await submit(firstCookie, 'run');
    assert.equal((await runOnly.json()).status, 'Run complete');

    const forgedExpectedOutput = await submit(firstCookie);
    assert.equal(forgedExpectedOutput.status, 200);
    assert.equal((await forgedExpectedOutput.json()).status, 'Wrong Answer');
    assert.equal(judgePayloads[0].expected_output, undefined);
    let current = await request('/api/auth/me', { headers: { Cookie: firstCookie } });
    assert.equal((await current.json()).user.solvedCount, 0);

    outputMode = 'pass';
    asyncPolling = true;
    const polledAccepted = await submit(firstCookie);
    assert.equal(polledAccepted.status, 200);
    assert.equal((await polledAccepted.json()).status, 'Accepted');
    assert.equal(pollCount, 6);

    asyncPolling = false;
    const repeatedAccepted = await submit(firstCookie);
    assert.equal(repeatedAccepted.status, 200);
    assert.equal((await repeatedAccepted.json()).status, 'Accepted');
    current = await request('/api/auth/me', { headers: { Cookie: firstCookie } });
    const progress = await current.json();
    assert.deepEqual(progress.solvedIds, [1]);
    assert.equal(progress.user.solvedCount, 1);
    assert.equal(progress.user.points, 10);

    const otherAccount = await request('/api/auth/me', { headers: { Cookie: secondCookie } });
    const otherProgress = await otherAccount.json();
    assert.deepEqual(otherProgress.solvedIds, []);
    assert.equal(otherProgress.user.points, 0);

    const rankings = await request('/api/leaderboard');
    const entries = await rankings.json();
    assert.equal(entries.find((entry) => entry.username.startsWith('first_')).points, 10);
    assert.equal(entries.some((entry) => entry.username === 'Sofia Chen'), false);
  } finally {
    global.fetch = originalFetch;
  }
});
