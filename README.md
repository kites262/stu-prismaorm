# Practice in Prisma ORM with PostgreSQL

## Development Environment

```
npm init
nvm use 18

npm install prisma --save-dev
npm install @prisma/client
npm install pg
s
npx prisma init

# Define models in schema.prisma, then

npx prisma generate
npx prisma migrate dev --name init

node index.js
```

## .env

```
DATABASE_URL=xxx
NODE_ENV=development
```