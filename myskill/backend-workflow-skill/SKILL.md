---
name: backend-workflow
description: A gated, developer-confirmed workflow for backend and software projects: inspect requirements and uploaded files, clarify understanding, create and continuously update a prioritized modular development task document, implement in small stages with tests, check sensitive information and Git push authorization, then verify and deliver. Use when starting or continuing a software project, implementing a feature, or coordinating staged development.
---

# Backend Workflow Skill

## Mission

Follow the developer's real project workflow. Treat this skill as a sequence of checkpoints, not a loose checklist. Ground decisions in the repository, requirements, uploaded files, and observed test results. Ask the developer to confirm your understanding even when the request appears clear. Do not begin substantial implementation before the plan and scope have been reviewed.

## Operating principles

1. **Inspect before assuming.** Read relevant project files, uploaded requirements, existing task documents, code conventions, tests, and repository state before proposing changes.
2. **Always confirm understanding.** After reviewing the request, summarize what you believe the developer wants and ask them to confirm or correct it. If anything is unclear, ask focused questions. Do not ask questions already answered by supplied material unless confirmation is important to prevent a costly mistake.
3. **Plan before substantial coding.** Create or update a Markdown development task document with architecture, stack, business flows, module boundaries, priorities, dependencies, and acceptance criteria.
4. **Work in small stages.** Default to the highest-priority unblocked task. Do not silently skip dependencies or bundle unrelated changes.
5. **Test each stage.** Verify normal cases, invalid input, boundary conditions, failure handling, permissions, persistence, and relevant business-flow closure as appropriate.
6. **Keep documentation current.** Update task status, decisions, tests, deviations, and remaining risks as work progresses.
7. **Protect secrets and external state.** Identify potential secrets and ask before removing or rotating them when a change could affect operation. Never commit or push to a remote Git repository without explicit developer confirmation.
8. **Report evidence honestly.** Distinguish passed, failed, blocked, not run, and not applicable. Never claim a test or action happened if it did not.

## Workflow

### Phase 1 — Discover requirements and confirm understanding

1. Read the developer's request.
2. If requirements, work orders, designs, schemas, screenshots, logs, or other files were uploaded or referenced, inspect the relevant materials before asking the developer to repeat information.
3. If working in an existing repository, inspect the project structure, stack, entry points, related modules, tests, configuration, and current Git status as relevant.
4. Identify the requested outcome, users/roles, scope, constraints, dependencies, existing behavior, and expected acceptance criteria.
5. Identify ambiguity, contradictions, missing business rules, technical risks, and assumptions.
6. Present a concise understanding summary, including:
   - what will change and what must not change;
   - key business flows and expected outcomes;
   - assumptions and unresolved questions;
   - likely affected modules and risks.
7. **Ask the developer to confirm the summary even when no ambiguity was found.** If unresolved issues materially affect design, data, security, APIs, or scope, ask focused questions and wait for answers before finalizing the plan.

Do not start substantial coding in this phase. Small read-only inspection and diagnostic commands are allowed.

### Phase 2 — Create the development task document

Create or update a Markdown task document. Default location for a new project is `docs/project/development-task.md`, unless the repository already has an established documentation location or the developer specifies another path.

The document should cover, where relevant:

- project background, goals, scope, non-goals, users and roles;
- confirmed technology stack and versions, with proposed items clearly labeled;
- architecture, module responsibilities, existing-code constraints and conventions;
- core entities, data relationships, API contracts and validation rules;
- end-to-end business flows, state transitions, error paths, authorization, transactions and idempotency;
- implementation tasks broken down by module and into small, verifiable units;
- task priority, dependencies, risks, file/module scope and acceptance criteria;
- testing strategy, test data requirements and environment assumptions;
- open questions and decisions awaiting developer confirmation.

Use the following priority guidance unless the developer or project has an established scheme:

- **P0 — Critical:** security exposure, data corruption/loss, major outage, or a core business flow completely blocked.
- **P1 — High:** essential functionality, critical business logic, or a dependency blocking later work.
- **P2 — Normal:** required functionality with limited impact or a task that does not block critical flows.
- **P3 — Low:** polish, minor improvements, or optional work.

Priority must reflect actual impact and dependency, not convenience. Split oversized tasks into smaller tasks that can each be implemented and tested. Record prerequisites and the order in which tasks should run.

Before substantial implementation, present the plan and ask the developer to confirm it. If the developer explicitly asks for autonomous execution, proceed only within the clearly authorized scope; still pause for decisions that materially affect security, data loss, public API contracts, scope, cost, or external side effects.

### Phase 3 — Implement in prioritized stages

1. Choose the highest-priority task whose dependencies are satisfied.
2. Re-read the relevant requirements and code before changing it.
3. Make the smallest coherent change that fulfills the task.
4. Follow existing architecture and coding conventions unless the approved plan explicitly changes them.
5. Avoid unrelated refactoring, broad formatting changes, dependency upgrades, schema changes, or edits outside the authorized scope.
6. Test the change before marking the task complete. Cover relevant:
   - successful behavior;
   - invalid or missing input;
   - boundary values;
   - error and timeout behavior;
   - authorization and data ownership;
   - persistence, transactions, state transitions and duplicate requests;
   - integration with adjacent modules and end-to-end business closure.
7. If a test fails, diagnose the cause and fix the implementation or test setup appropriately. Do not weaken assertions or delete meaningful tests merely to get a green result.
8. Update the task document immediately after the stage with:
   - status and changed files/modules;
   - implementation notes and decisions;
   - commands/tests actually executed and their results;
   - known limitations, regressions, and next steps.
9. Continue to the next task only after the current stage is verified or explicitly marked blocked with an agreed reason.

Suggested task states: `待确认`, `待开始`, `进行中`, `待验证`, `已完成`, `受阻`, `暂缓`. A task is not `已完成` merely because code was written.

### Phase 4 — Sensitive-information and Git checks

Before final delivery, and before any relevant Git operation:

1. Inspect changed files and relevant configuration for potential secrets, including API keys, access tokens, passwords, private keys, connection strings, signing secrets, and credentials embedded in code or logs.
2. Do not print full secret values in reports. Identify the file/location and secret type, masking the value.
3. If a potential secret is found, tell the developer what was found, where it appears, the risk, and a safe remediation option. Ask before removing, replacing, rotating, or changing configuration when doing so could affect operation. If a real secret may already have been exposed, recommend rotation and checking repository history.
4. Prefer environment variables or the project's existing secret-management mechanism. Ensure example configuration uses placeholders, not live credentials.
5. Inspect `git status`, staged changes, diff, ignored files, and commit scope where available. Check that generated files, local data, logs, and secrets are not accidentally included.
6. Local read-only Git inspection is allowed. Do not commit, push, publish a release, create a remote branch, or upload project contents to a remote service unless the developer explicitly confirms that specific action. Confirmation to implement code is not confirmation to push it.
7. If the developer has not authorized a remote operation, provide the proposed files/commit scope and ask for confirmation; otherwise leave remote state untouched.

### Phase 5 — Final verification and delivery

1. Run the relevant tests and quality checks that are available and safe in the current environment.
2. Verify core business flows, API compatibility, database changes/migrations, configuration, and adjacent-module regression risks as applicable.
3. Review the task document against actual implementation. Update statuses and record deviations.
4. Provide a concise final report:
   - what was implemented;
   - affected modules/files;
   - tests run and actual results;
   - security/Git checks and any findings;
   - outstanding work, known limitations, and risks;
   - documentation/artifact locations;
   - recommended next steps.
5. Clearly label tests that were not run or could not be run, with reasons. Do not present theoretical review as executed testing.
6. Do not claim completion if critical acceptance criteria remain unmet. Use a partial-completion report instead.

## Required decision gates

- **Gate A — Understanding:** developer has been asked to confirm the summarized requirement.
- **Gate B — Plan:** scope, task breakdown, priorities, and acceptance criteria are presented for confirmation before substantial implementation.
- **Gate C — Stage verification:** each implementation stage has test evidence or is explicitly blocked.
- **Gate D — Sensitive changes and remote Git:** potentially disruptive secret changes and remote publishing actions require explicit confirmation.
- **Gate E — Delivery:** report reflects actual code and test status.

## If blocked

State the blocker, evidence, decisions needed, and the safest next action. Do not fabricate missing information, silently expand scope, or make irreversible decisions to keep moving.

## References

Consult `references/workflow-gates.md` for checkpoint details, `references/testing-and-quality.md` for test expectations, and templates under `templates/` when creating project documents or reports.
