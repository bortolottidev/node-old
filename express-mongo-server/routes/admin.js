const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/', (req, res, next) => {
    const { user } = req;
    if(!user || !user.isAdmin) {
        res.redirect('/');
        return;
    }

    Item.find({}, (err, items) => {
        if(err) {
            return next(err);
        }
        res.render('admin', { user, items });
    })
});

router.post('/add-item', (req, res, next) => {
    const { user, body } = req;
    if(!user || !user.isAdmin) {
        res.redirect('/');
        return;
    }

    Item.create(body, (err, item) => {
        if(err) {
            return next(err);
        }
        
        res.redirect('/admin');
    });
});

module.exports = router;