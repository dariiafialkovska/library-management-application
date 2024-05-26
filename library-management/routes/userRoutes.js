const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const sequelize = require('../models/sequelize');

const { createUserValidator, validateUserId, validateBookId, validateByUserId, validateByBookId } = require('../validators/validators');
const User = require('../models/User');
const Book = require('../models/Book');
const { validationErrorHandler, genericErrorHandler } = require('../middlewares/errorHandler');
const Borrowing = require('../models/Borrowing');
router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll();
        if (users.length === 0) {
            return res.status(404).json({
                status: "error",
                message: 'No users found'
            });
        }

        res.status(200).json(
            {
                status: "success",
                message: 'Users retrieved successfully',
                data: users
            }
        );
    } catch (error) {
        console.error('Error getting users:', error);
        next(error);

    }
}
);


router.post('/', createUserValidator, validationErrorHandler, async (req, res, next) => {


    try {
        const newUser = await User.create({
            name: req.body.name
        });

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        next(error);
    }

});


router.get('/:id', validateUserId, validationErrorHandler, async (req, res, next) => {

    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            include: [{
                model: Borrowing,
                include: [{
                    model: Book,
                    attributes: ['name', 'id'] // Add other attributes you need
                }]
            }],
            attributes: ['id', 'name'] // Add other attributes you need
        });

        if (user) {
            const responseData = {
                id: user.id,
                name: user.name,
                pastBorrowings: [],
                currentBorrowings: []
            };

            user.Borrowings.forEach(borrowing => {
                const borrowingData = {
                    bookId: borrowing.Book.id,
                    bookName: borrowing.Book.name,
                    score: borrowing.score,
                    borrowedAt: borrowing.createdAt // Assuming createdAt is the borrowing date
                };

                // You might want to adjust this based on how you track whether a book is returned
                if (borrowing.returned) { // Assuming there is a 'returned' flag in your model
                    responseData.pastBorrowings.push(borrowingData);
                } else {
                    responseData.currentBorrowings.push(borrowingData);
                }
            });


            res.status(200).json({
                status: 'success',
                message: 'User retrieved successfully',
                data: responseData
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        next(error);
    }
}
);




router.post("/:userId/borrow/:bookId", validateByBookId, validateByUserId, validationErrorHandler, async (req, res, next) => {
    const { userId, bookId } = req.params;

    try {
        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Check if the book exists and is available
        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ status: 'error', message: 'Book not found' });
        }
        if (!book.isAvailable) {
            return res.status(400).json({ status: 'error', message: 'Book is already borrowed' });
        }

        // Create the borrowing
        const newBorrowing = await Borrowing.create({
            userId: userId,
            bookId: bookId
        });

        // Update the book's availability
        await book.update({ isAvailable: false });

        res.status(201).json({
            status: 'success',
            message: 'Book borrowed successfully',
            data: newBorrowing
        });

    } catch (error) {
        console.error('Error borrowing book:', error);
        next(error);
    }
});


router.post("/:userId/return/:bookId", [
    validateByUserId,
    validateByBookId,
    validationErrorHandler
], async (req, res, next) => {

    const { userId, bookId } = req.params;

    try {
        // Check if user and book exist
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const bookExists = await Book.findByPk(bookId);
        if (!bookExists) {
            return res.status(404).json({ status: 'error', message: 'Book not found' });
        }

        // Check if the book is currently borrowed and not yet returned
        const isBorrowed = await Borrowing.findOne({
            where: {
                userId: userId,
                bookId: bookId,
                returned: false  // Ensure the book has not been returned yet
            }
        });

        if (!isBorrowed) {
            return res.status(400).json({ status: 'error', message: 'No current borrowing record found for this book or it has already been returned' });
        }

        // Mark as returned
        isBorrowed.returned = true;
        const { score } = req.body;
        if (score !== undefined) {
            isBorrowed.score = score;
            await updateBookScore(bookId);  // Make sure this function handles errors properly
        }
        await isBorrowed.save();

        // Update book availability
        await Book.update({ isAvailable: true }, { where: { id: bookId } });

        res.status(201).json({
            status: 'success',
            message: 'Book returned successfully',
        });
    } catch (error) {
        console.error('Error returning book:', error);
        next(error);
    }
});


async function updateBookScore(bookId) {
    try {
        // Start a transaction
        const result = await sequelize.transaction(async (t) => {
            const allBorrowings = await Borrowing.findAll({
                where: { bookId: bookId },
                transaction: t
            });

            // Filter out any borrowings that may not have a score yet
            const validBorrowings = allBorrowings.filter(b => b.score !== null);

            if (validBorrowings.length > 0) {
                const averageScore = validBorrowings.reduce((acc, curr) => acc + curr.score, 0) / validBorrowings.length;
                // Update the book with the new average score
                await Book.update({
                    score: averageScore
                }, {
                    where: { id: bookId },
                    transaction: t
                });
            }
        });

        return result;
    } catch (error) {
        console.error('Error updating book score:', error);
        throw new Error('Failed to update book score');
    }
}


module.exports = router;
