const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const unless = require('express-unless')
const auth = require('./helpers/jwt.js');
const users = require('./controllers/userController.js')
const errors = require('./helpers/errorHandler.js')

const connectionString = process.env.DB_URL

app.use(cors({origin: "http://localhost:3001"})) // Default = CORS-enabled for all origins Access-Control-Allow-Origin: *!
app.use(express.json()) // middleware for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

// middleware for authenticating token submitted with requests
auth.authenticateToken.unless = unless
app.use(auth.authenticateToken.unless({
    path: [
        { url: '/users/login', methods: ['POST']},
        { url: '/users/register', methods: ['POST']}
    ]
}))

app.use('/users', users) // middleware for listening to routes
app.use(errors.errorHandler); // middleware for error responses

// MongoDB connection, success and error event responses
const uri = connectionString;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`Connected to mongo at ${uri}`));

app.listen(3000);