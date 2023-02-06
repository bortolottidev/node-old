const express = require('express');

const app = express();

app.get('/', (req,res) => {
    res.send('Hello world!');
});

app.get('/random', (req,res) => {
    res.status(404).send({ error: 'page NOT found! '});
});

const port = 3000;
app.listen(port, () => 
    console.log(`Listening on port ${port}`)
);

module.exports = { app };