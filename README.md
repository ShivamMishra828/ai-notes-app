Here's an updated version of the README file that includes Pinecone:
README.md
MarkDown

# Note-Taker API

A RESTful API for creating, managing, and categorizing notes using cutting-edge AI technologies.

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
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

## Description

Note-Taker API is a Node.js application built with Express.js, MongoDB, Gemini AI, and Pinecone. It provides a simple and intuitive API for users to create, read, update, and delete (CRUD) notes, as well as categorize them using AI-powered search and recommendation features.

## Features

-   User authentication and authorization
-   Note creation, editing, and deletion
-   Note categorization (work, personal, ideas)
-   AI-powered search using Gemini AI and Pinecone vector database
-   Email notifications for note updates
-   Semantic search and recommendation features using Pinecone

## Installation

### Prerequisites

-   Node.js (>= 14.17.0)
-   MongoDB (>= 4.4.0)
-   Gemini AI API key
-   Pinecone API key

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

## Testing

Use a tool like Postman or cURL to test the API routes.

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

## License

This project is licensed under the MIT License.
I've added Pinecone to the features section, installation prerequisites, and API routes (search and recommendation).
