import express from 'express';
import { validationResult } from 'express-validator';
import sequelize from '../models/sequelize.js';
import { createUserValidator, validateUserId, validateBookId, validateByUserId, validateByBookId } from '../validators/validators.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
import { validationErrorHandler, genericErrorHandler } from '../middlewares/errorHandler.js';
import Borrowing from '../models/Borrowing.js';

const router = express.Router();

// Get all users
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

// Create a user
router.post('/', createUserValidator, validationErrorHandler, async (req, res, next) => {


    try {
        // Create a new user
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
        // Pass the error to the error handler
        next(error);
    }

});


router.get('/:id', validateUserId, validationErrorHandler, async (req, res, next) => {

    try {
        const userId = req.params.id;
        // Include the Borrowing and Book models to get the user's borrowing history
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
            // Prepare the response data
            const responseData = {
                id: user.id,
                name: user.name,
                pastBorrowings: [],
                currentBorrowings: []
            };
            // Loop through the user's borrowings and categorize them as past or current
            user.Borrowings.forEach(borrowing => {
                const borrowingData = {
                    bookId: borrowing.Book.id,
                    bookName: borrowing.Book.name,
                    score: borrowing.score,
                    borrowedAt: borrowing.createdAt
                };

                if (borrowing.returned) {
                    responseData.pastBorrowings.push(borrowingData);
                } else {
                    responseData.currentBorrowings.push(borrowingData);
                }
            });

            // Send the response
            res.status(200).json({
                status: 'success',
                message: 'User retrieved successfully',
                data: responseData
            });
        } else {
            // Send a 404 response if the user is not found
            res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        // Pass the error to the error handler
        next(error);
    }
}
);



// Borrow a book
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
        // Pass the error to the error handler
        next(error);
    }
});

// Return a book
router.post("/:userId/return/:bookId", [validateByUserId,validateByBookId,validationErrorHandler], async (req, res, next) => {

    const { userId, bookId } = req.params;
    // Check for validation errors
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
        // If no borrowing record is found, or the book has already been returned, return an error
        if (!isBorrowed) {
            return res.status(400).json({ status: 'error', message: 'No current borrowing record found for this book or it has already been returned' });
        }

        // Mark as returned
        isBorrowed.returned = true;
        const { score } = req.body;
        if (score !== undefined) {
            isBorrowed.score = score;
            await updateBookScore(bookId); 
        }
        await isBorrowed.save();

        // Update book availability
        await Book.update({ isAvailable: true }, { where: { id: bookId } });

        // Send a success response
        res.status(201).json({
            status: 'success',
            message: 'Book returned successfully',
        });
    } catch (error) {
        console.error('Error returning book:', error);
        // Pass the error to the error handler
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
        // Handle the error
        console.error('Error updating book score:', error);
        throw new Error('Failed to update book score');
    }
}


export default router;