# Practice in Prisma ORM with PostgreSQL

## Development Environment

```bash
npm init
nvm use 18

npm install prisma --save-dev
npm install @prisma/client

npx prisma init

# Define models in schema.prisma, then
npx prisma migrate dev --name init # Sync the database
npx prisma generate # Generate the client

node index.js
```

## .env

```
DATABASE_URL=xxx
NODE_ENV=development
```