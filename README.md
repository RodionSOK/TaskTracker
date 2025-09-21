ДЛЯ ЗАПУСКА:

1. poetry install
2. poetry shell
3. cd backend
4. Нужно создать базу данных postgresql
5. Нужно создать .env файл и указать параметры
    DB_NAME
    DB_USER
    DB_PASSWORD
    DB_HOST
    DB_PORT
    Например:
    DB_NAME=testdb
    DB_USER=testuser
    DB_PASSWORD=123456789
    DB_HOST=localhost
    DB_PORT=5432
6. python3 manage.py makemigrations
7. python3 manage.py migrate
8. python3 manage.py runserver
9. cd frontend
10. npm install
11. npm run dev
12. перейти на страницу localhost:5173

