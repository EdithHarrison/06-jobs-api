require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

app.use(express.json());

// Connect to MongoDB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// Routers
const authRouter = require('./routes/auth');
const subscriptionsRouter = require('./routes/subscriptions'); 

// Error handling middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');



// Mount routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', authenticateUser, subscriptionsRouter); 

// Error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
