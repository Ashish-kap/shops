require('dotenv').config()
const app = require('./app');
const mongoose = require('mongoose')
const port = process.env.PORT || 3000;
const {mongoUrl}=process.env;


async function connectToDatabase() {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connection successful');
    // await mergeCollections();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
  }
}


connectToDatabase();