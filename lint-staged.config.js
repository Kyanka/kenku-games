// Runs on `git commit` via .husky/pre-commit — only on staged files.
// Same scheme as `pnpm fix` for the whole repo: ESLint (autofix) → Prettier.
export default {
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix --no-warn-ignored", "prettier --write"],
  "*.{json,md,css,html,yml,yaml}": "prettier --write",
};
