PR Butler

Turn a working repository into a PR-ready change set. Execute the workflow, edit files, run commands, and verify results. Do not only describe what should be done.

Core rules

Work from the repository root that contains package.json. For this challenge, that is scaffold/website.

Inspect package.json, existing config files, source files, tests, README, and git status before changing anything.

Preserve pre-existing user changes. Never reset, discard, or overwrite unrelated work.

Make the smallest changes needed to satisfy the workflow. Avoid unrelated refactors.

Prefer the repository's existing scripts and tooling over introducing new tools.

Use Node 18 or newer. Stop and report a blocker if the runtime is older and cannot be changed.

Never weaken a test, skip a test, suppress lint errors, exclude real source files from coverage, or add ignore comments merely to make a gate pass.

Never fabricate command results, coverage numbers, translations, or documentation claims.

Keep the workflow idempotent. On reruns, update existing generated sections or files instead of duplicating them.

Do not commit or push unless the user explicitly authorizes it. Always generate the recommended commit message.

Do not declare the repository PR-ready until every quality gate passes.

Workflow

Execute these phases in order:

Preflight and baseline

Translation detection and fix

Code cleanup

Test automation and coverage

Documentation updates

Quality gates

PR preparation and final report

If a later phase exposes a problem from an earlier phase, fix it and rerun the affected checks.

1. Preflight and baseline

1.1 Inspect the repository

Before editing:

Run git status --short and note any pre-existing changes.

Read package.json and identify the scripts for build, lint, format, test, and coverage.

Identify the test runner and configuration from dependencies and config files.

Identify formatting and lint configuration before changing style.

Locate src/translations/en.json and src/translations/fr.json.

Locate existing tests and determine their naming and organization conventions.

Read README.md and any existing changelog or contribution guidance.

Do not assume a particular test runner or formatter when the repository already tells you what it uses.

1.2 Install dependencies safely

If dependencies are not installed and package-lock.json exists, prefer npm ci.

Otherwise run npm install.

Do not change dependency versions unless a required repository capability is genuinely missing.

1.3 Verify the baseline build

Run:

npm run build

The build must succeed before normal remediation continues. If it fails, inspect the error and repair only an in-scope scaffold problem. If the failure is environmental or unrelated to the task, stop and report the exact command, error, and blocker instead of pretending the workflow can continue.

Capture the baseline test and coverage state when practical so the final report can show improvement.

2. Translation detection and fix

Treat src/translations/en.json as the source of truth for translation keys unless the repository explicitly documents otherwise.

2.1 Detect missing keys

Parse both JSON files rather than comparing raw lines.

Compare all key paths recursively so nested objects are handled correctly.

Report:

keys present in English but missing in French,

keys present in French but not English,

placeholder or interpolation mismatches.

For this scaffold, expect en.json to contain 14 entries and fr.json to begin with only 2. Verify this from the files rather than hard-coding the result.

2.2 Add the French translations

For every English key missing from fr.json:

Translate the user-facing value into natural Canadian French appropriate for a professional Task Manager application.

Preserve the JSON key exactly.

Preserve interpolation tokens, variables, punctuation semantics, markup, and placeholders such as {name}, {{count}}, %s, or similar syntax exactly.

Use terminology consistently across related strings.

Do not translate brand names, code identifiers, or technical tokens that should remain unchanged.

Preserve the structure and ordering style of the translation file where practical.

After editing:

Parse both JSON files to prove they are valid JSON.

Recompare the recursive key sets.

Require zero English keys missing from French.

Require placeholder parity for matching strings.

If a French-only key appears to be obsolete, do not delete it automatically unless its removal is clearly safe and supported by repository usage.

3. Code cleanup

Clean the code without changing intended application behavior.

3.1 Format using project tooling

Use the repository's configured formatter or format script first.

If a format script exists, run it.

If Prettier is configured but no script exists, run it through the installed project tooling.

Do not reformat generated files or unrelated content unnecessarily.

Pay special attention to handleSubmit() in main.ts, whose body is intentionally badly indented in the scaffold.

3.2 Fix lint and dead code issues

Run the configured linter.

Fix all lint errors, including unused variables and imports.

Remove an unused variable only after confirming it has no side effect or required semantic purpose.

Prefer code changes over lint suppression.

Preserve public APIs and behavior unless a change is required to fix a confirmed defect.

Run the linter again after fixes.

If the repository has ESLint configuration but no lint script, invoke the installed ESLint directly. If there is no lint capability at all, add the smallest project-compatible ESLint setup required to enforce the gate, update the lockfile, and document why it was necessary.

The phase is complete only when the lint command exits successfully with zero errors.

4. Test automation and coverage

4.1 Run existing tests first

Run the repository's existing test command before adding tests. Record failures and current coverage when available.

Fix production code only when a test exposes a real defect. Do not rewrite correct production behavior just to make an incorrect test pass.

4.2 Find meaningful coverage gaps

Map source functions to existing tests.

Identify exported or behaviorally important functions that have no meaningful test coverage.

For this scaffold, expect approximately six functions to be initially untested. Verify the actual list rather than assuming the number.

Prioritize business logic, validation, state changes, translation behavior, and DOM/user interactions over trivial implementation details.

4.3 Add missing tests

Follow the existing test framework and conventions. Add focused tests that cover, where applicable:

normal or happy-path behavior,

empty input and boundary cases,

invalid input or validation behavior,

state changes and side effects,

DOM-visible behavior for UI functions,

localization behavior when it is part of the function's responsibility.

Use Arrange/Act/Assert or the repository's equivalent convention. Keep tests deterministic and independent.

Do not inflate coverage with meaningless assertions such as testing constants, calling functions without checking outcomes, or duplicating the same path under different test names.

4.4 Measure coverage

Prefer an existing coverage script. Otherwise use the installed test runner's normal coverage mode, for example:

Vitest: run Vitest with --coverage.

Jest: run Jest with --coverage.

Another runner: use its supported coverage mechanism.

If the runner requires a coverage provider that is not installed, add only the compatible development dependency needed for that runner and update the lockfile.

Target at least 85% while writing tests so the final 80% requirement has margin.

Configure or enforce a global minimum of 80% for every coverage metric the project's coverage tool reports and supports, including lines, statements, functions, and branches. Do not lower an existing threshold that is already above 80%.

Rerun the full test suite with coverage until:

all tests pass, and

every enforced global coverage metric is at least 80%.

If a legitimate platform-only or generated file must be excluded, use an existing project convention and explain the exclusion. Never exclude ordinary application source merely to raise the percentage.

5. Documentation updates

Documentation must describe the final code, not the original scaffold.

5.1 Add or improve public-function docstrings

Identify public or exported functions that lack useful documentation.

For this scaffold, expect about nine public functions to need documentation. Verify the actual count.

Use the project's TypeScript/JavaScript documentation style. If none exists, use concise JSDoc/TSDoc comments.

State what the function does and document meaningful parameters, return values, side effects, and thrown errors when applicable.

Avoid comments that merely restate the function name or TypeScript types.

Example style:

/**
 * Adds a task after validating the submitted title.
 *
 * @param title - User-entered task title.
 * @returns The newly created task.
 */

5.2 Improve README.md

Preserve useful existing content and add missing sections rather than replacing the README wholesale.

Ensure the README contains clear, accurate sections for at least:

Features: summarize the actual Task Manager capabilities.

Testing: show the real commands for tests and coverage and mention the 80% minimum.

Contributing: explain setup and the required pre-PR checks.

Also correct stale setup commands if repository scripts show they are inaccurate.

Do not claim features or commands that do not exist.

5.3 Create or update CHANGELOG.md

Use an Unreleased section rather than inventing a release version or release date. Summarize the actual changes made by this workflow under sensible categories such as Added, Changed, and Fixed.

If CHANGELOG.md already exists, update its existing Unreleased section. Do not create duplicate headings on repeated runs.

5.4 Create or update PR_DESCRIPTION.md

Create a concise PR description that a developer can paste directly into a pull request. Use this structure:

## Summary
[Why this PR exists and the outcome]

## Changes
- [Concrete change]
- [Concrete change]

## Validation
- Build: [command and result]
- Lint: [command and result]
- Tests: [command and result]
- Coverage: [actual metrics]

## Risk and Review Notes
[Anything reviewers should focus on, or "Low risk" with a reason]

Use actual command results. Never write "passes" before the command has been run successfully.

6. Quality gates

After all edits, run a clean final validation from the repository root. Resolve failures and rerun the relevant checks until all gates are green or a genuine blocker remains.

Required gates

Gate

Required result

Translation parity

Every English key exists in French and placeholders match

Build

npm run build exits 0

Lint

Project lint command exits 0 with zero errors

Tests

Full test suite passes with zero failing tests

Coverage

Every enforced global metric is at least 80%

Working tree hygiene

No accidental generated coverage output, debug files, or unrelated edits

Also run git diff --check and resolve whitespace errors.

If the test or coverage command generates a coverage/ directory, ensure it is ignored unless the repository intentionally versions coverage artifacts.

Never mark a failed or unexecuted gate as passed. If a gate cannot run, the final status must be BLOCKED, not READY FOR PR.

7. PR preparation

7.1 Review the final diff

Inspect:

git status --short

git diff --stat

the substantive diff itself

Confirm that every modified file belongs to this workflow and that no secrets, local environment files, debug output, or dependency artifacts were introduced accidentally.

7.2 Generate a conventional commit message

Generate one commit message based on the dominant user-facing purpose of the final diff. Follow Conventional Commits:

<type>(<optional-scope>): <imperative summary>

Use fix when the primary change corrects behavior, test when the primary change is test-only, docs for documentation-only work, and chore for maintenance that does not fit a more specific type. For this mixed PR-preparation workflow, prefer a meaningful chore, fix, or refactor description based on the actual diff rather than forcing a hard-coded message.

Keep the subject concise, imperative, and specific. Do not include a period at the end.

If the user explicitly authorizes commits, make logical commits rather than one giant commit where practical. Never push without explicit authorization.

7.3 Finalize the PR description

Rerun the final gate commands if documentation edits could have affected lint, tests, or build. Then update PR_DESCRIPTION.md so its validation results match the final run.

Final response format

Return a compact completion report using this exact structure:

# PR Butler Result: READY FOR PR | BLOCKED

## Changes completed
- Translation: [missing count fixed and final parity]
- Cleanup: [key fixes]
- Tests: [tests added/updated]
- Documentation: [docstrings/README/CHANGELOG/PR description]

## Quality gates
| Gate | Result | Evidence |
| --- | --- | --- |
| Build | PASS/FAIL | `command` |
| Lint | PASS/FAIL | `command`, error count |
| Tests | PASS/FAIL | `command`, passed/failed counts |
| Coverage | PASS/FAIL | actual percentages |
| Translation parity | PASS/FAIL | English/French key counts |

## Suggested conventional commit
`type(scope): summary`

## Files changed
- `path`

## Blockers
None.

When blocked, replace None. with the exact blocker and the failed command. Do not hide partial progress.

Definition of done

The skill is complete only when all of the following are true:

French translations contain every key present in English.

Translation placeholders are preserved.

Formatting and lint issues are resolved with zero lint errors.

All tests pass.

Coverage is at least 80% for every enforced global metric.

Public functions that need documentation have meaningful docstrings.

README includes Features, Testing, and Contributing guidance.

CHANGELOG contains accurate Unreleased notes.

PR_DESCRIPTION.md contains verified validation results.

npm run build succeeds after all edits.

git diff --check succeeds.

The final report includes a conventional commit message and only declares READY FOR PR when every required gate passes.
