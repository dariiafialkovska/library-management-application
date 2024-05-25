const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { createBookValidator } = require('../validators/validators');
const Book = require('../models/Book');




router.get('/', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (error) {
        console.error('Error getting books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);


router.post('/', async (req, res) => {
    try {
        const newBook = await Book.create({
            name: req.body.name
        });

        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});


router.get('/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findByPk(bookId);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        console.error('Error getting book:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);