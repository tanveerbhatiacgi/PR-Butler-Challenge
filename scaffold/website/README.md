# Task Manager App

A bilingual task manager built with TypeScript and Vite.

## Features

- Create tasks with low, medium, or high priority.
- Mark tasks complete, delete tasks, and filter by status.
- Persist tasks in browser local storage.
- Switch the interface between English and French.

## Setup

```bash
npm ci
npm run dev
```

The app supports Node.js 18 or newer. Running all development checks, including ESLint 10, requires Node.js `^20.19.0`, `^22.13.0`, or `>=24`.

## Build

```bash
npm run build
```

## Testing

```bash
npm test
npm run test:coverage
```

Coverage is enforced at a minimum of 80% for statements, branches, functions, and lines.

## Contributing

Install dependencies with `npm ci`, then run `npm run lint`, `npm test`, `npm run test:coverage`, and `npm run build` before opening a pull request. Keep English and French translation keys and interpolation tokens in sync.
