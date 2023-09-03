const express = require('express')
const cors = require('cors');
const shopRoutes = require('./routes/shopRoutes.js')
const vendorRoutes = require('./routes/vendorRoutes')
const basicExpenseRoutes = require('./routes/basicExpenseRoutes.js')
const employeeRoutes = require('./routes/employeeRoutes.js')
const incomeRoutes = require('./routes/incomeRoutes.js')
const profitRoutes = require('./routes/profitRoutes.js')
const viewRoutes = require('./routes/viewRoutes.js')


const cookieParser = require("cookie-parser");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');


var session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path')
const app = express()
require('dotenv').config();

app.use(express.json())
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://srigbok:test1234@cluster0.oj5qw.mongodb.net/session-store',
        ttl: 14 * 24 * 60 * 60 // 14 days
    })
}));



// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());


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

module.exports = app;