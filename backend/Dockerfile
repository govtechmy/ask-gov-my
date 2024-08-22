FROM python:3.11-alpine

# PYTHONDONTWRITEBYTECODE=1 disable .pyc written into disc
# PYTHONUNBUFFERED=1 force print
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
RUN apk update && \
    apk add --no-cache gcc musl-dev libffi-dev postgresql-dev

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files into the container
COPY . /app/

# Expose the port that Django's development server uses
EXPOSE 8000

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]