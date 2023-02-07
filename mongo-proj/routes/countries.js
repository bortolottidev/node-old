const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

router.get('/', (req, res, next) => {
    const query = req.query;

    Country.find(query)
        .then(countries => {
            return res.json({
                confirmation: 'success'
                , data: countries
            })
        })
        .catch(err => {
            return res.json({
                confirmation: 'fail'
                , message: err.message
            });
        });
});

module.exports = router;