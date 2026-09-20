import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const installer = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'bin', 'pitcrew.js');

test('installs the Pitcrew skill into a project-local Antigravity path', () => {
  const project = mkdtempSync(join(tmpdir(), 'pitcrew-install-'));

  execFileSync(process.execPath, [installer, 'install', '--target', 'antigravity', '--scope', 'project'], {
    cwd: project,
    stdio: 'pipe',
  });

  const skill = join(project, '.agents', 'skills', 'pitcrew', 'SKILL.md');
  assert.ok(existsSync(skill));
  assert.match(readFileSync(skill, 'utf8'), /^---\nname: pitcrew/m);
});

test('dry-run reports a destination without writing it', () => {
  const project = mkdtempSync(join(tmpdir(), 'pitcrew-install-'));

  const output = execFileSync(process.execPath, [installer, 'install', '--target', 'claude', '--scope', 'project', '--dry-run'], {
    cwd: project,
    encoding: 'utf8',
  });

  assert.match(output, /\.claude\/skills\/pitcrew/);
  assert.equal(existsSync(join(project, '.claude')), false);
});

test('supports help before the install subcommand', () => {
  const output = execFileSync(process.execPath, [installer, '--help'], { encoding: 'utf8' });
  assert.match(output, /Pitcrew installer/);
});

test('does not partially install all targets when one destination exists', () => {
  const project = mkdtempSync(join(tmpdir(), 'pitcrew-install-'));
  mkdirSync(join(project, '.claude', 'skills', 'pitcrew'), { recursive: true });

  assert.throws(
    () => execFileSync(process.execPath, [installer, 'install', '--target', 'all', '--scope', 'project'], { cwd: project, stdio: 'pipe' }),
    /already exists/,
  );
  assert.equal(existsSync(join(project, '.agents')), false);
});
