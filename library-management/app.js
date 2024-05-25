const express = require('express');
const app = express();


const sequelize = require('./models/sequelize');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const Borrowing = require('./models/Borrowing');
const { genericErrorHandler } = require('./middlewares/errorHandler'); // Adjust the path as necessary

app.use(express.json());

app.use('/users', userRoutes);
app.use('/books', bookRoutes);


const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database & tables created!');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to sync database:', error);
});

app.use(genericErrorHandler);





/*

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

*/