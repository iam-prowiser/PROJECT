// Simple test script to verify all applications are running
const http = require('http');

const apps = [
  { name: 'Landing Page', port: 3000, path: '/' },
  { name: 'Admin Portal', port: 3001, path: '/' },
  { name: 'Feedback Page', port: 3002, path: '/' },
  { name: 'Today\'s Menu', port: 3003, path: '/' }
];

async function testApp(app) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${app.port}${app.path}`, (res) => {
      console.log(`✅ ${app.name} (Port ${app.port}): ${res.statusCode} - ${res.statusMessage}`);
      resolve(true);
    });

    req.on('error', (err) => {
      console.log(`❌ ${app.name} (Port ${app.port}): ${err.message}`);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ ${app.name} (Port ${app.port}): Timeout`);
      req.destroy();
      resolve(false);
    });
  });
}

async function testAllApps() {
  console.log('🔍 Testing all applications...\n');
  
  const results = await Promise.all(apps.map(testApp));
  const successCount = results.filter(Boolean).length;
  
  console.log(`\n📊 Results: ${successCount}/${apps.length} applications are running`);
  
  if (successCount === apps.length) {
    console.log('🎉 All applications are working correctly!');
    console.log('\n🌐 Access your applications at:');
    console.log('   Landing Page: http://localhost:3000');
    console.log('   Admin Portal: http://localhost:3001');
    console.log('   Feedback Page: http://localhost:3002');
    console.log('   Today\'s Menu: http://localhost:3003');
  } else {
    console.log('⚠️  Some applications may not be running properly.');
  }
}

testAllApps(); 