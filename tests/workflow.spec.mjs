import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const workflowPath = fileURLToPath(
  new URL('../.github/workflows/ci.yml', import.meta.url),
);

test('Pages publication is opt-in and waits for every validation gate', () => {
  const workflow = parse(readFileSync(workflowPath, 'utf8'));
  const publish = workflow.jobs?.['publish-pages'];

  assert.ok(publish, 'publish-pages job must exist');
  assert.deepEqual(
    [...publish.needs].sort(),
    ['landing-validation', 'terraform-static'],
  );
  assert.match(publish.if, /vars\.PAGES_ACTIONS_DEPLOYMENT_APPROVED == 'true'/);
  assert.match(publish.if, /github\.ref == 'refs\/heads\/main'/);
  assert.match(publish.if, /github\.event_name != 'pull_request'/);
  assert.equal(publish.permissions.pages, 'write');
  assert.equal(publish.permissions['id-token'], 'write');
  assert.equal(publish.environment.name, 'github-pages');

  const actions = publish.steps
    .map((step) => step.uses)
    .filter((uses) => uses !== undefined);

  assert.ok(actions.includes('actions/configure-pages@v5'));
  assert.ok(actions.includes('actions/upload-pages-artifact@v4'));
  assert.ok(actions.includes('actions/deploy-pages@v4'));
});
