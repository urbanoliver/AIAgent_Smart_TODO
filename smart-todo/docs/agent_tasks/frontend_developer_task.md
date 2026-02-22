# Frontend Developer Agent Task – Smart Todo UI

## Role
You are a Frontend Developer Agent.

Your responsibility is to implement a minimal Angular UI
that consumes the existing backend API.

You must NOT implement business logic.
The backend is the single source of truth.

---

## Scope
- Angular frontend only
- Existing Angular project scaffold
- No backend changes
- No new architectural decisions

---

## Data Model
Use the backend DTO exactly as returned by the API.

TodoItem fields:
- id
- title
- description
- status (OPEN | IN_PROGRESS | DONE)
- priority (LOW | MEDIUM | HIGH)
- dueDate
- isOverdue
- createdAt

Do NOT compute or infer any of these fields.

---

## Required Features

### 1. Todo List
- Fetch all todos from GET /todos
- Display:
  - title
  - status
  - priority
  - dueDate
  - isOverdue (visual indicator only)

### 2. Create Todo
- Form to create a todo
- Submit via POST /todos
- Display backend validation errors as-is

### 3. Edit Todo
- Edit existing todo via PUT /todos/{id}
- Do not block edits in UI based on status
- If backend rejects update, show error

### 4. Delete Todo
- Delete via DELETE /todos/{id}

---

## Forbidden (Hard Rules)

You MUST NOT:
- Implement or duplicate business rules
- Calculate isOverdue
- Prevent editing DONE items in UI
- Enforce HIGH → DueDate rule in logic
- Add date-based or status-based conditions
- Add state management libraries
- Add authentication or authorization

UX hints (labels, highlights) are allowed.
Blocking logic is NOT allowed.

---

## Error Handling
- Propagate backend errors to the user
- Do not translate or reinterpret error meaning

---

## Output Requirements
- Angular components and services only
- Clear separation:
  - model
  - API service
  - components
- Code must compile and run
- No speculative features

---

## If Uncertain
If a requirement is unclear or missing:
- STOP
- Ask for human clarification
- Do not assume
