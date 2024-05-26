import express from 'express';
const router = express.Router();
import Book from '../models/Book.js';
import { createBookValidator, validateBookId } from '../validators/validators.js';
import { validationErrorHandler } from '../middlewares/errorHandler.js';


// Get all books
router.get('/', async (req, res,next) => {
    try {
        const books = await Book.findAll();
        if (books.length === 0) {
            return res.status(404).json({
                status: "error",
                message: 'No books found'
            });
        }
        res.status(200).json(
            {
                status: "success",
                message: 'Books retrieved successfully',
                data: books
            }
        );
    } catch (error) {
        console.error('Error getting books:', error);
        next(error);
    }
}
);

// Create a book
router.post('/', createBookValidator, validationErrorHandler, async (req, res,next) => {
    try {
        // Create a new book
        const newBook = await Book.create({
            name: req.body.name
        });
        // Send a response
        res.status(201).json({
            status: 'success',
            message: 'Book created successfully',
            data: newBook
          });
    } catch (error) {
        console.error('Error creating book:', error);
        // Pass the error to the error handler
        next(error);
    }

});

// Get a book by id
router.get('/:id', validateBookId, validationErrorHandler,async (req, res,next) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findByPk(bookId);
        if (book) {
            // Send a response
            res.status(200).json({
                status: 'success',
                message: 'Book retrieved successfully',
                data: book
              });
        } else {

            res.status(404).json({ 
                status: 'error', 
                message: 'Book not found' 
            });        }
    } catch (error) {
        console.error('Error getting book:', error);
        // Pass the error to the error handler
        next(error);
    }
}
);

export default router;