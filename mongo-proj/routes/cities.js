const express = require('express');
const router = express.Router();
const City = require('../models/City');

router.get('/', (req, res, next) => {
    const query = req.query;

    City.find(query)
        .then(cities => {
            return res.json({
                confirmation: 'success'
                , data: cities
            })
        })
        .catch(err => {
            return res.json({
                confirmation: 'fail'
                , message: err.message
            });
        });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    City.findById(id)
        .then(cities => {
            return res.json({
                confirmation: 'success'
                , data: cities
            })
        })
        .catch(err => {
            return res.json({
                confirmation: 'fail'
                , message: `City ${id} not found`
            });
        });
});

router.get('/add', (req, res, next) => {
    const data = req.query;

    City.create(data)
        .then(country => {
            return res.json({
                confirmation: 'success'
                , data: country
            })
        })
        .catch(err => {
            return res.json({
                confirmation: 'fail'
                , message: err.message
            });
        });
});

router.get('/update/:id', (req, res, next) => {
    const data = req.query;
    const id = req.params.id;

    City.findByIdAndUpdate(id, data, {new: true})
        .then(country => {
            return res.json({
                confirmation: 'success'
                , data: country
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