# Django Project Setup

## Steps

1. **Install PostgreSQL**:
   ```sh
   brew install postgresql
2. **Install Dependencies Using PIP**:
   ```sh
   pip install -r requirements.txt
3. **Create DB in PSQL**:
   ```sh
   psql
   CREATE DATABASE mydatabase;
4. **Migrate**:
   ```sh
   python manage.py makemigrations
   python manage.py migrate
5. **Run seed_data.py**:
   ```sh
   python manage.py shell
   with open('seed_data.py') as file:
    exec(file.read())
6. **Run Django Server**:
   ```sh
   python manage.py runserver
