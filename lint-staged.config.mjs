/**
 * Pre-commit checks (run by Husky via `npx lint-staged`).
 *
 * lint-staged runs commands from the repository root, but the ESLint flat
 * config lives in apps/web, so ESLint is executed inside that workspace.
 * Markdown is intentionally not formatted here: most root docs are Repo Forge
 * locked files and must only change through /repo-forge:change.
 */

const quote = (files) => files.map((f) => `"${f}"`).join(" ");

export default {
  "apps/web/**/*.{ts,tsx}": (files) => [
    `prettier --write ${quote(files)}`,
    `npm exec -w apps/web -- eslint --fix ${quote(files)}`,
  ],
  "apps/web/**/*.{css,json}": (files) => `prettier --write ${quote(files)}`,
};
