const SONAR_HOST_URL = process.env.SONAR_HOST_URL || 'http://localhost:9000';
const SONAR_TOKEN = process.env.SONAR_TOKEN;
const GATE_NAME = process.env.GATE_NAME || 'QG_Certamen2';

if (!SONAR_TOKEN) {
  console.error('Set SONAR_TOKEN before running this script.');
  process.exit(1);
}

const auth = Buffer.from(`${SONAR_TOKEN}:`).toString('base64');

const conditions = [
  ['blocker_violations', 'GT', '0'],
  ['bugs', 'GT', '5'],
  ['code_smells', 'GT', '50'],
  ['coverage', 'LT', '60'],
  ['new_coverage', 'LT', '50'],
  ['critical_violations', 'GT', '10'],
  ['new_duplicated_lines_density', 'GT', '15'],
  ['sqale_rating', 'GT', '3'],
  ['new_maintainability_rating', 'GT', '2'],
  ['major_violations', 'GT', '20'],
  ['new_blocker_violations', 'GT', '0'],
  ['reliability_rating', 'GT', '3'],
  ['new_reliability_rating', 'GT', '2'],
  ['security_rating', 'GT', '3'],
  ['new_security_rating', 'GT', '2']
];

async function request(path, params = {}, method = 'POST') {
  const url = new URL(path, SONAR_HOST_URL);
  const init = {
    method,
    headers: {
      Authorization: `Basic ${auth}`
    }
  };

  if (method === 'GET') {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  } else {
    init.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    init.body = new URLSearchParams(params);
  }

  const response = await fetch(url, init);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${method} ${url.pathname} failed: ${response.status} ${text}`);
  }

  return text ? JSON.parse(text) : {};
}

async function ensureGate() {
  try {
    await request('/api/qualitygates/create', { name: GATE_NAME });
  } catch (_) {
    // If the gate already exists, continue and resolve it from the list endpoint.
  }

  const list = await request('/api/qualitygates/list', {}, 'GET');
  const qualityGates = list.qualitygates || list.qualityGates || [];
  const gate = qualityGates.find((item) => item.name === GATE_NAME);

  if (!gate) {
    throw new Error(`Quality gate ${GATE_NAME} was not found after creation.`);
  }

  return gate;
}

async function resetConditions(gateName) {
  const details = await request('/api/qualitygates/show', { name: gateName }, 'GET');
  const existingConditions = details.conditions || [];

  for (const condition of existingConditions) {
    await request('/api/qualitygates/delete_condition', { id: condition.id });
  }
}

async function createConditions(gateName) {
  for (const [metric, op, error] of conditions) {
    await request('/api/qualitygates/create_condition', {
      gateName,
      metric,
      op,
      error
    });
  }
}

async function main() {
  await ensureGate();
  await resetConditions(GATE_NAME);
  await createConditions(GATE_NAME);
  await request('/api/qualitygates/set_as_default', { name: GATE_NAME });
  console.log(`${GATE_NAME} configured as the default quality gate.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
