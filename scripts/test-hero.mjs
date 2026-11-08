import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../app/components/gyros-motion.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { gyrosMotion } = await import('data:text/javascript;base64,' + Buffer.from(compiled.outputText).toString('base64'));

test('the complete photo and fully opened layers remain stable at both ends', () => {
  const start = gyrosMotion(0);
  const end = gyrosMotion(1);
  assert.equal(start.face, 'whole');
  assert.equal(start.faceWidth, 1);
  assert.equal(start.spread, 0);
  assert.equal(end.face, 'pieces');
  assert.equal(end.faceWidth, 1);
  assert.equal(end.spread, 1);
  assert.deepEqual(gyrosMotion(-10), start);
  assert.deepEqual(gyrosMotion(10), end);
  assert.deepEqual(gyrosMotion(NaN), start);
});

test('no ingredient moves while the whole photo is being exchanged', () => {
  for (let sample = 0; sample <= 340; sample++) {
    const pose = gyrosMotion(sample / 1000);
    assert.equal(pose.spread, 0, `premature expansion at ${sample}`);
  }
  assert.equal(gyrosMotion(.34).face, 'pieces');
  assert.equal(gyrosMotion(.34).faceWidth, 1);
});

test('the visible face changes once at a narrow central seam and never mirrors', () => {
  let switches = 0;
  let previous = gyrosMotion(0).face;
  for (let sample = 0; sample <= 1000; sample++) {
    const pose = gyrosMotion(sample / 1000);
    assert.ok(pose.faceWidth >= .001 && pose.faceWidth <= 1);
    if (pose.face !== previous) {
      switches++;
      assert.ok(pose.faceWidth < .025);
      previous = pose.face;
    }
  }
  assert.equal(switches, 1);
});

test('slow scrolling expands the layers continuously and reversing returns the same pose', () => {
  let previous = 0;
  const forward = [];
  for (let sample = 0; sample <= 1000; sample++) {
    const pose = gyrosMotion(sample / 1000);
    assert.ok(pose.spread >= previous);
    assert.ok(pose.spread - previous < .003);
    if (pose.spread > 0) {
      assert.equal(pose.face, 'pieces');
      assert.equal(pose.faceWidth, 1);
    }
    previous = pose.spread;
    forward.push(pose);
  }
  for (let sample = 1000; sample >= 0; sample--) assert.deepEqual(gyrosMotion(sample / 1000), forward[sample]);
});
