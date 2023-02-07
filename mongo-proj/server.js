const express = require('express');
const mongoose = require('mongoose');
const cities = require('./routes/cities');
const countries = require('./routes/countries');

const app = express();

mongoose.connect('mongodb://localhost:27017/world', { 
    useUnifiedTopology: true, 
    useNewUrlParser: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Cannot connect to MongoDB: ', err));

mongoose.connection.on('all', data => console.log(data));

app.use('/cities', cities);
app.use('/countries', countries);

app.get('/', (req, res, next) => {
    res.json({
        data: 'Welcome on mongo project'
    });
});

app.listen(5000);
console.log('Running on port 5000');