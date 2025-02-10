# Nuxt 3 Project - Grading Application

## Project Overview
This is a Nuxt 3 application that uses a MySQL database for data storage. The database is hosted locally using MAMP, and TablePlus is used for database management.

## Technologies Used
- **Nuxt 3** - Frontend framework
- **MySQL** - Database
- **Prisma** - ORM for database interaction
- **MAMP** - Local server for running MySQL
- **TablePlus** - Database management tool
- **API Key** - Securing API routes
- **Tailwind CSS** - Styling framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Token-based authentication
- **validator** - Input validation

## Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MAMP](https://www.mamp.info/en/)
- [TablePlus](https://tableplus.com/)

## Getting Started

### 1. Clone the Repository
```sh
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the project root with the following:
```env
DATABASE_URL="mysql://root:root@localhost:3306/your_database_name"
JWT_SECRET="your_jwt_secret"
API_KEY="your_secure_api_key"
```
- Replace `your_database_name` with your actual database name.
- Modify `root:root` if your MySQL user and password are different.
- Set a strong value for `JWT_SECRET` and `API_KEY`.

### 4. Start MySQL Database
- Open **MAMP** and start the MySQL server.
- Use **TablePlus** to create the database if it doesn't exist.

### 5. Apply Database Migrations
Run Prisma migration to ensure the database schema is up to date:
```sh
npx prisma migrate dev --name init
```

### 6. Start the Development Server
```sh
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
