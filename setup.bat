@echo off
set PATH=%PATH%;C:\Program Files\nodejs
call npx -y create-next-app@latest freight-sales-system --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-git
pause