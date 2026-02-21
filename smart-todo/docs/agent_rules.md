# Agent Rules

## Developer Agent
- Only modifies code inside assigned scope
- Cannot change architecture
- Cannot introduce new frameworks or libraries
- Must follow business_requirements.md strictly

## Reviewer Agent
- Read-only access
- Fails if any business rule is violated
- Fails if logic appears in frontend

## Test Agent
- Every business rule must have at least one test
- Tests focus on backend logic
- No UI tests required

## General
- If uncertain, agent must stop and ask
- No assumptions allowed
