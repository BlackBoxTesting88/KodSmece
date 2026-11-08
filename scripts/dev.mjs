import { realpathSync, rmSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { randomUUID } from 'node:crypto';

const project = realpathSync(fileURLToPath(new URL('../', import.meta.url)));
const scriptPath = fileURLToPath(import.meta.url);
const port = 3200;
const origin = `http://127.0.0.1:${port}`;
const session = randomUUID();

function isRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error.code === 'ESRCH') return false;
    throw error;
  }
}

function listenerPids() {
  try {
    return execFileSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t'], { encoding: 'utf8' })
      .trim().split(/\s+/).filter(Boolean).map(Number);
  } catch (error) {
    if (error.status === 1) return [];
    throw error;
  }
}

for (const pid of new Set(listenerPids())) {
  if (!isRunning(pid)) continue;
  const command = execFileSync('ps', ['-p', String(pid), '-o', 'command='], { encoding: 'utf8' }).trim();
  const cwd = process.platform === 'linux'
    ? realpathSync(`/proc/${pid}/cwd`)
    : execFileSync('lsof', ['-a', '-p', String(pid), '-d', 'cwd', '-Fn'], { encoding: 'utf8' })
        .split('\n').find(line => line.startsWith('n'))?.slice(1);
  const isProjectServer = command.includes(scriptPath)
    || /\bnode\s+scripts\/dev\.mjs(?:\s|$)/.test(command)
    || /\bhttp\.server\b/.test(command)
    || /^next-server\b/.test(command);

  if (!isProjectServer || cwd !== project) {
    throw new Error(`Port ${port} koristi drugi program. Proces je ostavljen da radi.`);
  }
  console.log('Zaustavljam prethodni Kod Šmece server…');
  process.kill(pid, 'SIGTERM');
  for (let attempt = 0; attempt < 60 && isRunning(pid); attempt++) await delay(100);
  if (isRunning(pid)) throw new Error('Prethodni server se još zatvara. Pokušaj ponovo za nekoliko sekundi.');
}


rmSync(new URL('../.next/dev/cache', import.meta.url), { recursive: true, force: true });
rmSync(new URL('../.next/dev/lock', import.meta.url), { force: true });

const child = spawn(process.execPath, [
  fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url)),
  'dev', '--webpack', '--hostname', '127.0.0.1', '--port', String(port),
], {
  cwd: project,
  stdio: 'inherit',
  env: { ...process.env, KOD_SMECE_DEV_SESSION: session },
});

let running = true;
child.on('error', error => {
  running = false;
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code, signal) => {
  running = false;
  process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1);
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

for (let attempt = 0; attempt < 90 && running; attempt++) {
  try {
    const response = await fetch(origin, { signal: AbortSignal.timeout(1500) });
    if (response.ok) {
      console.log(`\nKod Šmece je spreman: ${origin}/\nRazvojni keš je očišćen. Za zaustavljanje pritisni Ctrl+C.\n`);
      if (!process.argv.includes('--no-open')) {
        const opener = process.platform === 'darwin' ? 'open' : process.platform === 'linux' ? 'xdg-open' : null;
        if (opener) {
          const browser = spawn(opener, [origin + '/'], { stdio: 'ignore' });
          browser.on('error', () => console.log('Otvori navedenu adresu u svom pregledaču.'));
          browser.unref();
        }
      }
      break;
    }
  } catch {}
  await delay(500);
}
