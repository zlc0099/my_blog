# Workflow Gates and Decision Rules

## Gate A — Understanding confirmation

After reading the request and relevant source material, summarize:
- requested outcome and scope;
- known constraints and existing behavior to preserve;
- core business flow;
- affected modules and dependencies;
- assumptions, risks, and unresolved decisions.

Ask the developer to confirm the summary even if it appears unambiguous. Keep the question focused: ask for correction or confirmation, and list only decisions that genuinely need input.

Do not confuse “asking for confirmation” with asking the developer to repeat everything. Use evidence from their files and repository.

## Gate B — Plan approval

Before substantial implementation, show:
- module breakdown and task IDs;
- priority and dependency order;
- files/modules likely to change;
- technical decisions and whether each is confirmed or proposed;
- acceptance criteria and tests for each task;
- risks and any schema/API compatibility impact.

Wait for approval unless the developer has clearly authorized autonomous execution within the stated scope. Always pause for decisions with material security, data-loss, irreversible, external-side-effect, scope, or public-contract implications.

## Gate C — Stage completion

For each task:
1. Implement a bounded change.
2. Run relevant tests and inspect results.
3. Record actual commands, pass/fail/blocked status, and key evidence.
4. Update task status and changed files.
5. Continue only when verified or explicitly blocked.

A task with unexecuted tests must not be marked fully verified. Use `待验证` or `受阻` as appropriate.

## Gate D — Sensitive information and Git

- Mask secret values in reports.
- Ask before removing or rotating secrets when the change may affect runtime behavior.
- Recommend rotation when a real credential may have been exposed, including in repository history.
- Inspect diffs and staged files before proposing a commit.
- Never infer permission to push from permission to code.
- Ask for explicit confirmation before commit, push, release, remote branch creation, or uploading code/artifacts to a remote service.

## Gate E — Delivery

The final report must match the actual repository state. Include unfinished tasks and failed or unrun checks. Do not conceal defects to make delivery appear complete.

## When the developer changes scope

Update the plan first:
- describe the requested change;
- identify affected tasks and dependencies;
- call out impact on schedule, APIs, data, and tests;
- ask for confirmation if the change materially expands scope or adds risk;
- update the task document before proceeding.
