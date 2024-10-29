# GREENROOTS Backend

## 1 - Clone projet

```bash
git clone https://github.com/username/greenroots-back.git
cd greenroots-back
```

## 2 - Instal Dependencies

```bash
 pnpm install #or
npm install
```

## 3 - Create Database

- Create the PostgreSQL database (make sure PostgreSQL is installed and running):

```bash
create DATABASE name_bdd;
```

## 4 - Setup .env

- Create a .env file in the root of the project and add your database configuration:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bdd_name
DB_USER=user_name
DB_PASSWORD=password
```

## 5 Initialize Tables and Seed Data

- Run the following command to create tables and seed initial data:

```bash
 npm run db:reset
 ```

## 6 Launch the projet

- Start the project in development mode:

```bash
npm run dev
```
