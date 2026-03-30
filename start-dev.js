#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const nodeBinDir = path.dirname(process.execPath);
const env = { ...process.env, PATH: `${nodeBinDir}:${process.env.PATH || ''}` };

const next = path.join(__dirname, 'node_modules', '.bin', 'next');
const child = spawn(process.execPath, [next, 'dev'], { env, stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
