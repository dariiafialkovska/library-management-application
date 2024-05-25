const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { createUserValidator, validateUserId } = require('../validators/validators');
const User = require('../models/User');
const { errorHandler } = require('../middlewares/errorHandler');

router.get('/', async (req, res) => {
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


router.post('/', createUserValidator, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newUser = await User.create({
            name: req.body.name
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        next(error);
    }

});


router.get('/:id', validateUserId, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        next(error);
    }
}
);

module.exports = router;
