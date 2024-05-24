const express = require('express');
const app = express();



const sequelize = require('./models/sequelize');
const User = require('./models/User');


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database & tables created!');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to sync database:', error);
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
);


app.post('/users', async (req, res) => {
  try{
    const newUser= await User.create({
      name: req.body.name
    });

    res.status(201).json(newUser);
  }catch(error){
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});


app.get('/users/:id', async (req, res) => {
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

