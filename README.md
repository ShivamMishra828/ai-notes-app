# Note-Taker API

A RESTful API for creating, managing, and categorizing notes.

## Table of Contents

- [Note-Taker API](#note-taker-api)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [API Routes](#api-routes)
    - [User Routes](#user-routes)
    - [Note Routes](#note-routes)
    - [Search Route](#search-route)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

## Description

Note-Taker API is a Node.js application built with Express.js, MongoDB, and Gemini AI. It provides a simple and intuitive API for users to create, read, update, and delete (CRUD) notes, as well as categorize them.

## Features

-   User authentication and authorization
-   Note creation, editing, and deletion
-   Note categorization (work, personal, ideas)
-   Search functionality using Gemini AI
-   Email notifications for note updates

## Installation

### Prerequisites

-   Node.js (>= 14.17.0)
-   MongoDB (>= 4.4.0)
-   Gemini AI API key

### Steps

1. Clone the repository: `git clone https://github.com/ShivamMishra828/ai-notes-app.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables (see `.env.example`)
4. Start the server: `npm start`

## API Routes

### User Routes

-   **POST /api/users** - Create a new user
    -   Request Body: `{ email, password }`
    -   Response: `{ userId, token }`
-   **GET /api/users** - Get all users
    -   Response: `[ { userId, email } ]`
-   **GET /api/users/:id** - Get a user by ID
    -   Response: `{ userId, email }`
-   **PATCH /api/users/:id** - Update a user
    -   Request Body: `{ email, password }`
    -   Response: `{ userId, email }`
-   **DELETE /api/users/:id** - Delete a user
    -   Response: `{ message: "User deleted" }`

### Note Routes

-   **POST /api/notes** - Create a new note
    -   Request Body: `{ title, content, category }`
    -   Response: `{ noteId, title, content, category }`
-   **GET /api/notes** - Get all notes
    -   Response: `[ { noteId, title, content, category } ]`
-   **GET /api/notes/:id** - Get a note by ID
    -   Response: `{ noteId, title, content, category }`
-   **PATCH /api/notes/:id** - Update a note
    -   Request Body: `{ title, content, category }`
    -   Response: `{ noteId, title, content, category }`
-   **DELETE /api/notes/:id** - Delete a note
    -   Response: `{ message: "Note deleted" }`

### Search Route

-   **GET /api/search** - Search notes using Gemini AI
    -   Query Parameters: `q` (search query)
    -   Response: `[ { noteId, title, content, category } ]`

## Testing

Use a tool like Postman or cURL to test the API routes.

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

## License

This project is licensed under the MIT License.
