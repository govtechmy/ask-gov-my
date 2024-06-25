# Django Project Setup

## Steps

1. **Install PostgreSQL**:
   ```sh
   brew install postgresql
2. **Install Dependencies Using PIP**:

3. **Migrate**:
   ```sh
   python manage.py makemigrations
   python manage.py migrate
3. **Restore DB**:
   ```sh
   python manage.py loaddata db_backup.json
5. **Run Django Server**:
   ```sh
   python manage.py runserver
