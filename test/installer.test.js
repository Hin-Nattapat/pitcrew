import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync, lstatSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { applySelection, chooseInteractive } from '../bin/pitcrew.js';

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

test('interactive chooser returns the selected target and scope', async () => {
  const answers = await chooseInteractive({
    select: async ({ message, choices }) => message.startsWith('Install for')
      ? choices.find(({ value }) => value === 'antigravity').value
      : choices.find(({ value }) => value === 'global').value,
  });

  assert.deepEqual(answers, { target: 'antigravity', scope: 'global' });
});

test('applies interactive choices before installation validation', () => {
  const options = { command: 'install' };

  applySelection(options, { target: 'antigravity', scope: 'project' });

  assert.equal(options.target, 'antigravity');
  assert.equal(options.scope, 'project');
});

test('installs Antigravity globally where Antigravity discovers skills', () => {
  const output = execFileSync(process.execPath, [installer, 'install', '--target', 'antigravity', '--scope', 'global', '--dry-run'], {
    encoding: 'utf8',
  });

  assert.match(output, /\.gemini\/config\/skills\/pitcrew$/m);
});

test('reports every global destination a harness actually reads', () => {
  const output = execFileSync(process.execPath, [installer, 'install', '--target', 'all', '--scope', 'global', '--dry-run'], {
    encoding: 'utf8',
  });

  assert.match(output, /\.gemini\/config\/skills\/pitcrew$/m);
  assert.match(output, /\.agents\/skills\/pitcrew$/m);
  assert.match(output, /\.claude\/skills\/pitcrew$/m);
  assert.doesNotMatch(output, /antigravity-cli/);
});

test('links the skill instead of copying it', () => {
  const project = mkdtempSync(join(tmpdir(), 'pitcrew-install-'));

  execFileSync(process.execPath, [installer, 'install', '--target', 'codex', '--scope', 'project', '--link'], {
    cwd: project,
    stdio: 'pipe',
  });

  const destination = join(project, '.agents', 'skills', 'pitcrew');
  assert.ok(lstatSync(destination).isSymbolicLink());
  assert.match(readFileSync(join(destination, 'SKILL.md'), 'utf8'), /^---\nname: pitcrew/m);
});

test('--force replaces a copied installation with a link', () => {
  const project = mkdtempSync(join(tmpdir(), 'pitcrew-install-'));
  const destination = join(project, '.agents', 'skills', 'pitcrew');

  execFileSync(process.execPath, [installer, 'install', '--target', 'codex', '--scope', 'project'], { cwd: project, stdio: 'pipe' });
  assert.equal(lstatSync(destination).isSymbolicLink(), false);

  execFileSync(process.execPath, [installer, 'install', '--target', 'codex', '--scope', 'project', '--link', '--force'], {
    cwd: project,
    stdio: 'pipe',
  });

  assert.ok(lstatSync(destination).isSymbolicLink());
});

test('--force clears files a previous installation left behind', () => {
  const project = mkdtempSync(join(tmpdir(), 'pitcrew-install-'));
  const destination = join(project, '.agents', 'skills', 'pitcrew');

  execFileSync(process.execPath, [installer, 'install', '--target', 'codex', '--scope', 'project'], { cwd: project, stdio: 'pipe' });
  writeFileSync(join(destination, 'stale.md'), 'removed in a later release');

  execFileSync(process.execPath, [installer, 'install', '--target', 'codex', '--scope', 'project', '--force'], {
    cwd: project,
    stdio: 'pipe',
  });

  assert.equal(existsSync(join(destination, 'stale.md')), false);
});
