const app = require('./app');
const mongoose = require('mongoose')
const port = process.env.PORT || 3000;


async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://srigbok:test1234@cluster0.oj5qw.mongodb.net/sugarShop', {
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