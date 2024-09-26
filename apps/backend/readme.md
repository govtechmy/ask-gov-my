# Django Project Setup

## Steps

Run these commands from the project's root directory:

1. Setup the virtual environment

```sh
pnpm run setup --filter backend
```

2. Run docker compose

```sh
docker compose -f docker-compose.dev.yml up -d
```

3. Create an ElasticSearch API key

```sh
curl http://localhost:9200/_security/api_key?pretty=true \
   -u 'elastic:elastic'
   -X POST \
   -d '{"name": "my-api-key"}' \
   -H 'Content-Type: application/json'
```

Note: Copy the encoded API key. Paste it in your .env file later.

4. Create a .env file in `apps/backend`

```sh
cd apps/backend && cp .env.example .env
```

Here's an example .env file for local development using the docker compose services:

```sh
ELASTICSEARCH_URL="http://localhost:9200"
ELASTICSEARCH_API_KEY="<your-api-key>"
DB_NAME="askgov"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_HOST="localhost"
DB_PORT="5432"
OPENAI_API_KEY="<your-api-key>"
SECRET_KEY="<your-secret-key>"
```

5. Run the database migrations

```sh
python manage.py migrate

# Optionally, seed the database
# python manage.py create_questions
```

6. Start the Django dev server

```sh
cd ../.. && pnpm dev --filter backend
```
