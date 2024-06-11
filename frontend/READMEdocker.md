for docker compose
run
1. docker-compose up -d
using docker desktop, go to container
click progres-
go to exec tab
run
2. psql -h postgres -U $POSTGRES_USER -d $POSTGRES_DB -f /backups/db_backup.sql
3. password is postgres
run
4. psql -U postgres -d mydb
5. \dt
check your database, is it all there? else, update the db_backup.sql in the /backups