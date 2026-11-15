// Copies the authoritative template (../01_plan) next to the backend so it ships with the Vercel deploy.
import fs from 'node:fs';
import path from 'node:path';

const app = path.resolve(import.meta.dirname, '..');
const src = path.resolve(app, '../01_plan/TestPlan_Template.md');
const dest = path.resolve(app, 'src/backend/TestPlan_Template.md');
if (!fs.existsSync(src)) {
  console.log('Source template not found; keeping bundled copy.');
} else {
  fs.copyFileSync(src, dest);
  console.log('Template synced to src/backend/TestPlan_Template.md');
}
