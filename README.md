# Medium clone

## Introduction

A simplified clone of Medium, with randomly generated users, stories, comments, likes and follows, with stories and comments generated using “lorem ipsum” placeholder text. The currently logged in user can view their story feed, with a random selection of stories belonging to users they are following. Stories can be open and viewed, liked or commented on. Users can view, edit or delete their own stories, as well as create new stories.

New users can register, or log in as a demo user, creating a new user (who is following a random selection of other users) with their own stories generated (as well as likes and comments from other users). Demo users are isolated from other demo users so they only see the content generated for the seeded users, and the demo account is deleted when the user logs out.

## Live demo (note: server takes ~20 seconds to start)

https://medium.benparker.net

## Technologies

The backend is implemented in Node.js with the server built with Express.js. A PostgreSQL database stores and allows querying of the user data. Interaction with the database as well as initial creation of tables and seeding of user data is managed with the Sequelize ORM. The frontend pages are implemented using Pug templates which are populated on the server and served to the client by Express.js. Pages with user interaction (e.g. liking stories, following/unfollowing users) uses API calls, with user authorisation and authentication managed by the server (hence limited to currently logged in users).

## Motivation

This project was primarily a learning activity, to implement the technologies referenced above to implement a full-stack application with backend database, user authorisation/authentication and a responsive frontend.

## Future features

There are many features that could extend the user experience (e.g. tags for stories, improving the comment system, etc.). It would be interesting to improve the generated content by using a natural language generation model such as GPT-3.
