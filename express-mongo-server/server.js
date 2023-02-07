const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
require('./config/auth')(passport);

const homeRoute = require('./routes/home');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const accountRoute = require('./routes/account');
const adminRoute = require('./routes/admin');


const user = 'expressmongoserver';
const pw = '6VpTb1CWrTX4GqLL';
mongoose.connect(`mongodb+srv://${user}:${pw}@asd/test`,
    { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 5000, socketTimeoutMS: 5000 },
    (err, data) => {
        if(err) {
            console.log(`DB connection failed: ${err}`);
            return;
        }
        console.log(`DB connection success!`);
    });

const app = express();
app.use(session({ secret: 'random_secret123', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('pages', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoute);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/account', accountRoute);
app.use('/admin', adminRoute);
app.use((err, req, res, next) => {
    res.render('error', { message: err.message });
});

app.listen(5000, () => console.log('App running on port 5000'));
