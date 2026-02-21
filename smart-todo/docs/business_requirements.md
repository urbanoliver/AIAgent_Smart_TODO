# Smart Todo – Business Requirements

## Scope
A rendszer egy egyszerű Todo alkalmazás, CRUD funkcionalitással.

## Entity: TodoItem
- Id (GUID)
- Title (string, required)
- Description (string, optional)
- Status (OPEN | IN_PROGRESS | DONE)
- Priority (LOW | MEDIUM | HIGH)
- DueDate (date, optional)
- IsOverdue (bool, calculated)
- CreatedAt (datetime)

## Business Rules
1. DONE státuszú TodoItem nem módosítható.
2. HIGH priority esetén DueDate kötelező.
3. IsOverdue érték backend oldalon számolt:
   - DueDate < today AND Status != DONE
4. Frontend nem implementál üzleti logikát, csak megjelenít.

## Out of Scope
- Authentication
- Authorization
- Notifications
- Multi-user support
