/**
 * Integration Test Script for FlowBase
 * Tests the complete flow from frontend to backend
 */

const API_URL = process.env.API_URL || 'http://localhost:5000';
const TEST_REPO = 'https://github.com/sindresorhus/is'; // Small repo for faster testing

console.log('🧪 FlowBase Integration Test\n');
console.log(`Testing API at: ${API_URL}\n`);

// Test 1: Health Check
async function testHealthCheck() {
  console.log('1️⃣  Testing health endpoint...');
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    if (response.ok && (data.status === 'ok' || data.success)) {
      console.log('✅ Health check passed\n');
      return true;
    } else {
      console.log('❌ Health check failed:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

// Test 2: Complete Analysis (Synchronous)
async function testCompleteAnalysis() {
  console.log('2️⃣  Testing complete analysis (this may take 30-60 seconds)...');
  try {
    const startTime = Date.now();
    
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoUrl: TEST_REPO }),
    });
    
    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (response.ok && data.success && data.data) {
      console.log('✅ Analysis completed successfully');
      console.log(`   Duration: ${duration}s`);
      console.log(`   Repository: ${data.metadata?.repository?.fullName || 'N/A'}`);
      console.log(`   Graph nodes: ${data.data.graph?.nodes?.length || 0}`);
      console.log(`   Graph edges: ${data.data.graph?.edges?.length || 0}`);
      console.log(`   Roadmap steps: ${data.data.roadmap?.steps?.length || 0}`);
      console.log(`   File summaries: ${data.data.explain?.length || 0}\n`);
      return data;
    } else {
      console.log('❌ Analysis failed:', data.error || 'Unknown error');
      console.log(`   Duration: ${duration}s\n`);
      return null;
    }
  } catch (error) {
    console.log('❌ Analysis error:', error.message);
    return null;
  }
}

// Test 3: Validate Data Structure
function testValidateData(response) {
  console.log('3️⃣  Validating data structure...');
  
  const checks = [
    { name: 'Success flag', check: () => response.success === true },
    { name: 'Data object', check: () => !!response.data },
    { name: 'Metadata object', check: () => !!response.metadata },
    { name: 'Repository info', check: () => !!response.metadata?.repository },
    { name: 'Graph data', check: () => response.data.graph && Array.isArray(response.data.graph.nodes) && Array.isArray(response.data.graph.edges) },
    { name: 'Roadmap data', check: () => response.data.roadmap && Array.isArray(response.data.roadmap.steps) },
    { name: 'Explain data', check: () => Array.isArray(response.data.explain) },
    { name: 'Doctor data', check: () => Array.isArray(response.data.doctor) },
  ];
  
  let passed = 0;
  let failed = 0;
  
  checks.forEach(({ name, check }) => {
    try {
      if (check()) {
        console.log(`   ✅ ${name}`);
        passed++;
      } else {
        console.log(`   ❌ ${name}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ ${name} - Error: ${error.message}`);
      failed++;
    }
  });
  
  console.log(`\n   Total: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

// Main Test Runner
async function runTests() {
  console.log('Starting integration tests...\n');
  console.log('═'.repeat(50) + '\n');
  
  const startTime = Date.now();
  
  // Run tests sequentially
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ Health check failed. Make sure the server is running.');
    console.log(`   Start server with: npm run server\n`);
    process.exit(1);
  }
  
  const results = await testCompleteAnalysis();
  if (!results) {
    console.log('\n❌ Analysis failed. Check server logs.\n');
    process.exit(1);
  }
  
  const validationOk = testValidateData(results);
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('═'.repeat(50));
  console.log('\n📊 Test Summary\n');
  console.log(`   Duration: ${duration}s`);
  console.log(`   API URL: ${API_URL}`);
  console.log(`   Test Repo: ${TEST_REPO}`);
  
  if (validationOk) {
    console.log('\n✅ All tests passed! Integration is working correctly.\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some validation checks failed. Review the output above.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});

// Made with Bob
