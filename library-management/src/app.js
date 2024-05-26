import express from 'express';
import sequelize from './models/sequelize.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import Borrowing from './models/Borrowing.js';
import User from './models/User.js';
import Book from './models/Book.js';
import { genericErrorHandler } from './middlewares/errorHandler.js';

// Create an instance of the express app
const app = express();

app.use(express.json());

// Add the user and book routes
app.use('/users', userRoutes);
app.use('/books', bookRoutes);

// Define the port number
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database & tables created!');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to sync database:', error);
});

// Add the generic error handler middleware
app.use(genericErrorHandler);

// Define the relationships between the models
User.hasMany(Borrowing, { foreignKey: 'userId' });
Borrowing.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Borrowing, { foreignKey: 'bookId' });
Borrowing.belongsTo(Book, { foreignKey: 'bookId' });

export default app;