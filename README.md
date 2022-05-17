# medium-clone

To set up project

## Create user and database in postgres (psql)
CREATE USER medium_clone_app WITH ENCRYPTED PASSWORD <see .env>;
CREATE DATABASE medium_clone WITH OWNER medium_clone_app;

## Create tables and seed data
npx dotenv sequelize-cli db:migrate
npx dotenv sequelize-cli db:seed:all

## Create session
added create table if doesn't exist option to connect-pg-simple session store

## font sizes
12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72

## fonts
system stack as default
-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue;
// sans-serif (choose one) for titles, names, etc. 
// serif font for article text.. 

## colors




