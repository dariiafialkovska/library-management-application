# library-management-application
 
## Project Overview
Library Management System is a web application that allows users to manage book borrowing and returning processes. This system enables librarians to add books, manage book borrowings by users, and track book availability. It aims to streamline the process of managing books and user interactions in a library setting.



# Technologies Used:
## Backend:
- Node.js
- Expess.js 

## Database:
- PostgresSQL
- Sequilize

## Validation:
- Express Validator

## Version Control: 
- Git


# Endpoints Documentation
This application provides several endpoints:

## User Endpoints
- GET /users: Retrieves all users.
- POST /users: Creates a new user.
- GET /users/:id: Retrieves a specific user by ID.
## Book Endpoints
- GET /books: Retrieves all books.
- POST /books: Adds a new book to the library.
- GET /books/:id: Retrieves a specific book by ID.
## Borrowing Endpoints
- POST /users/:userId/borrow/:bookId: Allows a user to borrow a book.
- POST /users/:userId/return/:bookId: Allows a user to return a borrowed book.


# Database Setup
To set up the database schema, run the following command:
- Password is: postgres
```bash
psql -U postgres -d library_management -f ./database/schema.sql
