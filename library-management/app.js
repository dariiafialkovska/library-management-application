const express = require('express');
const app = express();



const sequelize = require('./models/sequelize');
const User = require('./models/User');
const Book = require('./models/Book');
const Borrowing = require('./models/Borrowing');
const { body } = require('express-validator');
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


app.post('/users',
[
  body('name').isString().notEmpty().withMessage('Name is required')
],



 (req, res) => {
  try{
    const newUser=  User.create({
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


app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error('Error getting books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
);


app.post('/books', async (req, res) => {
  try{
    const newBook= await Book.create({
      name: req.body.name
    });

    res.status(201).json(newBook);
  }catch(error){
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});


app.get('/books/:id', async (req, res) => {
   try{
    const bookId = req.params.id;
    const book = await User.findByPk(bookId);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
   }catch(error){
    console.error('Error getting book:', error);
    res.status(500).json({ error: 'Internal server error' });
   }
}
);

app.post("/users/:userId/borrow/:bookId", async (req, res) => {

  const { userId, bookId } = req.params;


  try{
    const isBorrowed = await Borrowing.findOne({
      where: {
        bookId: bookId
      }
    });


    if (isBorrowed) {
      return res.status(400).json({ error: 'Book is already borrowed' });
    }

    const newBorrowing = await Borrowing.create({
      userId: userId,
      bookId: bookId
    });

    res.status(201).json(newBorrowing);

  }catch(error){
    console.error('Error borrowing book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});


app.post("/users/:userId/return/:bookId", async (req, res) => {

  const { userId, bookId } = req.params;
  const { score } = req.body;
  try{
    const isBorrowed = await Borrowing.findOne({
      where: {
        userId: userId,
        bookId: bookId
      }
    });

    if (!isBorrowed) {
      return res.status(400).json({ error: 'Book is not borrowed' });
    }

    isBorrowed.score= score;
    await isBorrowed.save();

    updateBookScore(bookId);

    res.status(204).send();
  }catch(error){
    console.error('Error returning book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

async function updateBookScore(bookId) {
  const allBorrowings = await Borrowing.findAll({
    where: {
      bookId: bookId
    }
  });

  const averageScore = allBorrowings.reduce((acc, curr) => acc + curr.score, 0) / allBorrowings.length;

  await Book.update({
    score: averageScore
  }, {
    where: {
      id: bookId
    }
  });

}