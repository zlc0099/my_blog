# Testing and Quality Guide

Adapt this guide to the project's framework, architecture, and available environment. Do not force irrelevant test types onto a project.

## Test layers

- **Unit tests:** business rules, calculations, validators, state transitions and error branches.
- **API/integration tests:** request validation, response contract, authentication/authorization, persistence and transaction behavior.
- **Database tests:** constraints, migrations, rollback, concurrent updates, pagination, query correctness and data integrity.
- **Business-flow tests:** the complete user journey across modules, including expected state changes and failure paths.
- **Regression tests:** neighboring modules and existing behavior that could be affected by the change.
- **Static/quality checks:** formatting, linting, type checking, compilation, dependency checks or security scans when configured and safe.

## Coverage checklist

For each relevant endpoint or business operation, consider:

- valid request and expected result;
- missing, malformed, oversized, or invalid fields;
- boundary values and empty collections;
- unauthorized and forbidden access;
- missing records and conflicting state;
- duplicate submission and idempotency;
- transaction rollback after partial failure;
- concurrent updates and race conditions;
- downstream service timeout or failure;
- pagination and large data volume;
- logging without leaking secrets;
- correct status codes and stable response structure.

## Evidence rules

- Record exact commands or tool runs that were actually executed.
- Report summary counts when available, plus failures and relevant logs.
- Separate code review from executed tests.
- If the environment, credentials, dependencies, database, or external service are unavailable, report the limitation and the next action needed.
- Do not alter tests or assertions merely to force success. If a test is incorrect, explain the evidence and propose a separately justified correction.
- Do not claim load, security, or end-to-end testing unless those tests were actually run.

## Completion criteria

A task can be marked complete only when:
1. its acceptance criteria are met;
2. relevant tests have run and passed, or any agreed exception is explicitly recorded;
3. affected documentation and task status are updated;
4. no unresolved blocker is hidden.
