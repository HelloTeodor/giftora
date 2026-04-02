#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const nodeBinDir = path.dirname(process.execPath);
const env = { ...process.env, PATH: `${nodeBinDir}:${process.env.PATH || ''}` };

// Fall back to main project node_modules if worktree doesn't have its own
const localNext = path.join(__dirname, 'node_modules', '.bin', 'next');
const mainNext = path.join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'next');
const next = fs.existsSync(localNext) ? localNext : mainNext;

const child = spawn(process.execPath, [next, 'dev'], { env, stdio: 'inherit', cwd: __dirname });
child.on('exit', (code) => process.exit(code ?? 0));
