const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { createUserValidator } = require('../validators/validators');
const User = require('../models/User');


router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);


router.post('/', createUserValidator, (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newUser = User.create({
            name: req.body.name
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});


router.get('/:id', async (req, res) => {
    try{
     const userId = req.params.id;
     const user = await User.findByPk(userId);
     if (user) {
       res.json(user);
     } else {
       res.status(404).json({ error: 'User not found' });
     }
    }catch(error){
     console.error('Error getting user:', error);
     res.status(500).json({ error: 'Internal server error' });
    }
 }
 );

module.exports = router;
 