A simple REST API using HashiCorp Vault to manage dynamic PostgreSQL credentials — no hardcoded passwords in code.

What's inside


- Node.js + Express — REST API
- PostgreSQL 17 — Database
- HashiCorp Vault — Dynamic secret management (auto-rotating DB credentials)
- Docker Compose — Local orchestration


How it works

Instead of hardcoding a password, the app asks Vault for a temporary PostgreSQL username/password at startup. Vault creates a real DB user, hands the credentials to the app, then automatically deletes that user when the TTL expires (default: 1 hour).