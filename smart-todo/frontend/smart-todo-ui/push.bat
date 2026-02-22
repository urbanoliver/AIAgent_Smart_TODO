@echo off
cd /d "c:\Users\justf\AIAgent_Smart_TODO\smart-todo\frontend\smart-todo-ui"
echo Pulling from remote...
git pull origin main -X theirs
if %ERRORLEVEL% neq 0 (
    echo Pull failed, attempting merge...
    git merge --no-ff --no-edit origin/main
)
echo Pushing to remote...
git push origin main
echo Done!
