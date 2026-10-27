# Project Development Task Document

> Status: Draft / Awaiting Confirmation / Approved / In Progress / Completed  
> Last updated: YYYY-MM-DD  
> Owner:  
> Repository / branch:  

## 1. Project overview

- **Background:**
- **Goals:**
- **Users and roles:**
- **Primary use cases:**
- **In scope:**
- **Out of scope:**
- **Constraints:**

## 2. Requirement understanding

### Confirmed requirements
- 

### Assumptions
- 

### Questions awaiting confirmation
| ID | Question | Why it matters | Options/recommendation | Status |
|---|---|---|---|---|
| Q-01 |  |  |  | 待确认 |

## 3. Existing project findings

- **Current architecture:**
- **Existing modules:**
- **Relevant files and conventions:**
- **Current tests and commands:**
- **Compatibility constraints:**

## 4. Technology stack and architecture

| Area | Decision | Status (confirmed/proposed) | Rationale / constraints |
|---|---|---|---|
| Language/runtime |  |  |  |
| Backend framework |  |  |  |
| Database/ORM |  |  |  |
| Cache/messaging |  |  |  |
| Authentication/authorization |  |  |  |
| Testing tools |  |  |  |
| Deployment/observability |  |  |  |

## 5. Business flows and closure

For each core flow, describe trigger, actor, preconditions, main steps, state/data changes, successful outcome, error/rollback path, permissions and idempotency.

### Flow BF-01: [Name]
1. Trigger:
2. Actor and permissions:
3. Preconditions:
4. Main steps:
5. Data/state changes:
6. Success outcome:
7. Failure/rollback behavior:
8. Duplicate/concurrent request behavior:
9. Related modules and APIs:
10. Acceptance criteria:

## 6. Data model and API contracts

- **Core entities and relationships:**
- **Important constraints/indexes:**
- **API conventions and response format:**
- **Validation/error conventions:**
- **Transaction and idempotency rules:**
- **Migration/backward-compatibility notes:**

## 7. Module and task breakdown

Priorities: P0 Critical, P1 High, P2 Normal, P3 Low. Adjust if the project has an established priority scheme.

| Task ID | Module | Task / deliverable | Priority | Dependencies | Acceptance criteria | Tests | Status |
|---|---|---|---|---|---|---|---|
| BE-001 |  |  | P1 |  |  |  | 待确认 |

### Task details

#### BE-001 — [Task title]
- **Goal:**
- **Scope:**
- **Out of scope:**
- **Likely files/modules:**
- **Dependencies:**
- **Implementation notes:**
- **Acceptance criteria:**
- **Tests to run:**
- **Risks:**
- **Status:** 待确认

## 8. Coding conventions and constraints

- Preserve unrelated behavior and modules.
- Follow existing naming, layering, DTO/VO, exception, logging, validation and response conventions.
- Do not change public API contracts or schema without documenting impact and obtaining approval where required.
- Do not commit secrets or real credentials.
- Do not push to a remote repository without explicit confirmation.
- Add tests for new behavior and relevant regressions.

## 9. Test and acceptance plan

| Scenario | Type | Expected result | Command/evidence | Status |
|---|---|---|---|---|
| Happy path |  |  |  | 未执行 |
| Invalid input |  |  |  | 未执行 |
| Boundary condition |  |  |  | 未执行 |
| Permission check |  |  |  | 未执行 |
| Failure/rollback |  |  |  | 未执行 |
| Business-flow closure |  |  |  | 未执行 |
| Regression |  |  |  | 未执行 |

## 10. Progress and decisions log

| Date | Task/decision | Change or result | Tests/evidence | Follow-up |
|---|---|---|---|---|
| YYYY-MM-DD |  |  |  |  |

## 11. Risks and blockers

| ID | Risk/blocker | Impact | Mitigation / decision needed | Status |
|---|---|---|---|---|
| R-01 |  |  |  | Open |

## 12. Change log

| Date | Version | Changes | Reason |
|---|---|---|---|
| YYYY-MM-DD | 0.1 | Initial draft |  |
