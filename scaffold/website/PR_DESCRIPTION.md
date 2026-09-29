## Summary
Complete the Task Manager's French localization and strengthen its implementation, automated checks, and contributor documentation.

## Changes
- Add all 12 missing Canadian French translations and apply translations to page controls and rendered tasks.
- Format and document the public task, localization, and page functions; render task descriptions as text.
- Add ESLint, recursive locale-parity checks, DOM and task-state tests, and global 80% coverage thresholds.
- Expand the README and add an Unreleased changelog.

## Validation
- Build: `npm run build` passed.
- Lint: `npm run lint` passed with 0 errors and 0 warnings.
- Tests: `npm test` passed, 12 tests across 3 files.
- Coverage: `npm run test:coverage` passed at 100% statements, branches, functions, and lines.
- Translation parity: 14 English keys and 14 French keys; no missing, extra, or placeholder-mismatched entries.
- Whitespace: `git -c core.whitespace=cr-at-eol diff --check` passed.

## Risk and Review Notes
Task persistence retains its existing local-storage shape. Review the translated labels and verify behavior with previously saved tasks. npm reported 8 dependency audit findings during installation (2 moderate, 4 high, 2 critical); dependency remediation is outside this workflow.