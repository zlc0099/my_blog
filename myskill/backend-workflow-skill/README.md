# Backend Workflow Skill

A general-purpose, repository-aware workflow for coding agents. It is designed around five phases:

1. Discover requirements and confirm understanding.
2. Create a prioritized, modular development task document.
3. Implement in small stages, test each stage, and keep the document current.
4. Check potential secrets and require explicit approval before remote Git operations.
5. Verify and deliver with an evidence-based report.

## Contents

```text
backend-workflow-skill/
├── SKILL.md
├── README.md
├── references/
│   ├── workflow-gates.md
│   └── testing-and-quality.md
└── templates/
    ├── development-task.md
    ├── phase-report.md
    └── final-delivery.md
```

## Use

1. Copy the `backend-workflow-skill` directory into the skills directory supported by your coding agent.
2. Confirm that the agent supports the Agent Skills format (`SKILL.md` with YAML frontmatter). Some tools require a specific directory or installation step.
3. Invoke the skill by name if your agent supports explicit invocation, or describe a matching task and let the agent's skill-selection mechanism choose it.
4. For project-wide rules that must always apply, also place a short version of the non-negotiable rules in the tool's project instructions (for example, the repository's `AGENTS.md`, if supported). A Skill file alone does not guarantee it will automatically run in every conversation.

## Safety notes

- This skill does not itself execute tools or enforce permissions at the platform level; it describes required agent behavior.
- Explicit confirmation is required before committing, pushing, publishing, or uploading project contents to a remote service.
- Do not include actual credentials in documentation or example configuration.
- Adapt test commands and document paths to the repository's established conventions.

## Validation checklist

- [ ] `SKILL.md` exists and contains valid YAML frontmatter.
- [ ] `name` is lowercase and hyphenated.
- [ ] `description` explains purpose and when to use the skill.
- [ ] Referenced files exist.
- [ ] Each phase has clear inputs, outputs, and decision gates.
- [ ] Tests are reported as executed only when actually run.
- [ ] Remote Git operations require explicit confirmation.
