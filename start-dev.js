import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('==============================================');
console.log('  CHILIKA SPICES - STARTING DEV ENVIRONMENT  ');
console.log('==============================================\n');

// 1. Start Backend Express Server
const serverProcess = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: process.env.PORT || '5000' }
});

// 2. Start Frontend Vite Dev Server
const clientProcess = spawn('npm', ['run', 'dev', '--', '--host', '--port', '5173'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nShutting down Chilika Spices dev processes...');
  try { serverProcess.kill(); } catch (e) {}
  try { clientProcess.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
