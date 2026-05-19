# Contributing to SignOff

First off, thank you for taking the time to contribute to SignOff! 🎉

Whether you are fixing a minor typo, designing a new dashboard component, or adding local payment gateways, your contributions make SignOff a better tool for logistics operations worldwide.

---

## 🗺️ How Can I Contribute?

### 1. Reporting Bugs
- Search existing [GitHub Issues](https://github.com/yourusername/signoff/issues) to ensure the bug hasn't already been reported.
- If it's a new issue, open a bug report explaining:
  - What you expected to happen.
  - What actually happened.
  - Clear steps to reproduce the bug (along with screenshots or error logs).

### 2. Suggesting Features
- We love feature requests! Open a new issue and detail:
  - What problem the feature solves.
  - A description of how it should work or look.
  - Potential implementation suggestions.

### 3. Submitting Pull Requests (PRs)
Follow these steps to submit a code contribution:
1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```
2. **Install** local dependencies:
   ```bash
   npm install
   ```
3. Make your changes. Ensure you write clean, modern, and accessible code.
4. **Test** your changes locally by starting the dev server:
   ```bash
   npm run dev
   ```
5. Ensure there are no ESLint errors:
   ```bash
   npm run lint
   ```
6. **Commit** your changes with clear, concise messages.
7. **Push** to your fork and submit a Pull Request to our repository.

---

## 🛠️ Local Development Setup

To speed up database setup, SignOff uses SQL schema files and self-contained TypeScript migration scripts:

- **Database Schemas:** The base database tables are defined in [`src/db/schema.sql`](./src/db/schema.sql).
- **TypeScript Migrations:** Use the helper scratch scripts to update tables locally:
  ```bash
  # Sets up base delivery tables
  npx tsx scratch_migrate.ts
  # Adds premium asset storage columns
  npx tsx scratch_migrate2.ts
  # Sets up credentials password hashing
  npx tsx scratch_migrate_password.ts
  ```

---

## 🎨 Code & Style Guidelines

- **Next.js & React:** Use standard App Router conventions, React Server Components (RSC) where possible, and Server Actions for form submissions.
- **Styling:** Use Tailwind CSS utility classes. Prioritize rich, modern, dark-mode aesthetics (glassmorphism, vibrant gradients, and elegant hover animations).
- **TypeScript:** Fully typed parameters. Avoid using `any` unless absolutely necessary for external library definitions.
- **Linting:** We enforce standard linting configurations. Run `npm run lint` before committing to avoid CI check failures.

Thank you again for contributing to SignOff! 🚀
