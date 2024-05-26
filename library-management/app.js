const express = require('express');
const app = express();


const sequelize = require('./models/sequelize');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const Borrowing = require('./models/Borrowing');
const User = require('./models/User');
const Book = require('./models/Book');
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

User.hasMany(Borrowing, { foreignKey: 'userId' });
Borrowing.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Borrowing, { foreignKey: 'bookId' });
Borrowing.belongsTo(Book, { foreignKey: 'bookId' });

