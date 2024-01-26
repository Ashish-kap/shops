const express = require('express')
const cors = require('cors');
const shopRoutes = require('./routes/shopRoutes.js')
const vendorRoutes = require('./routes/vendorRoutes')
const basicExpenseRoutes = require('./routes/basicExpenseRoutes.js')
const employeeRoutes = require('./routes/employeeRoutes.js')
const incomeRoutes = require('./routes/incomeRoutes.js')
const profitRoutes = require('./routes/profitRoutes.js')
const viewRoutes = require('./routes/viewRoutes.js')
const port = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");

const path = require('path')
const app = express()
require('dotenv').config();

app.use(express.json())
app.use(cors());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));



const mysql = require('mysql2');

 const connection = mysql.createConnection({
    host: 'cloud.racknetweb.com',
    user: 'erpmanifestsolut_root',
    password: 'Erpsolution@123',
    database: 'erpmanifestsolut_nodejs',
});

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'pass1234',
//   database: 'sugarcaneco',
// });


app.use(cors());
app.use(cookieParser());
app.use((req, res, next) => {
    req.requestTime = new Date().toTimeString();
    console.log(req.headers)
    next();
});

app.use('/',shopRoutes);
app.use('/',vendorRoutes);
app.use('/',basicExpenseRoutes);
app.use('/',employeeRoutes);
app.use('/',incomeRoutes);
app.use('/',profitRoutes);
app.use('/',viewRoutes);

// module.exports = app;


connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('database connection successful');
    
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
});


