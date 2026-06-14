# Multi-stage Dockerfile for Next.js (React) + FastAPI (Python) App
# Stage 1: Build the Next.js Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/fe
COPY fe/package*.json ./
RUN npm install
COPY fe/ ./
RUN npm run build


# Stage 2: Final Runner (Python Environment)
FROM python:3.10-slim AS runner

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy python backend files
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY core/ ./core/
COPY configs/ ./configs/
COPY skills/ ./skills/
COPY tests/ ./tests/
COPY run_api.py .


# Copy frontend static build assets to the python static folder
COPY --from=frontend-builder /app/fe/out/ ./static/


# Expose port (Cloud Run defaults to PORT environment variable)
ENV PORT=3700
ENV SQLITE_DB_PATH=/app/data/steelworks.db

# Ensure data directory exists
RUN mkdir -p /app/data
COPY data/steelworks.db /app/data/steelworks.db


EXPOSE 3700

# Command to boot the FastAPI application
CMD uvicorn core.api_router:app --host 0.0.0.0 --port ${PORT}



