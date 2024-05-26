const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { createBookValidator,validateBookId } = require('../validators/validators');
const Book = require('../models/Book');
const { errorHandler , validationErrorHandler} = require('../middlewares/errorHandler');


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


router.post('/', createBookValidator, validationErrorHandler, async (req, res,next) => {
    try {
        const newBook = await Book.create({
            name: req.body.name
        });

        res.status(201).json({
            status: 'success',
            message: 'Book created successfully',
            data: newBook
          });
    } catch (error) {
        console.error('Error creating book:', error);
        next(error);
    }

});


router.get('/:id', validateBookId, validationErrorHandler,async (req, res,next) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findByPk(bookId);
        if (book) {
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
        next(error);
    }
}
);

module.exports = router;
