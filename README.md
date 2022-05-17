# medium-clone

To set up project

## Create user and database in postgres (psql)
CREATE USER medium_clone_app WITH ENCRYPTED PASSWORD <see .env>;
CREATE DATABASE medium_clone WITH OWNER medium_clone_app;

## Create tables and seed data
npx dotenv sequelize-cli db:migrate
npx dotenv sequelize-cli db:seed:all

## Create session

