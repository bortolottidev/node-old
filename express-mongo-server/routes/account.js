const express = require('express');
const Mailgun = require('mailgun-js');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');

const randomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

router.get('/', (req, res, next) => {
    const { user } = req;
    if(!user) {
        res.redirect('/');
        return;
        //return next(new Error('Not logged in'));
    }

    Item.find((err, items) => {
        if(err) {
            return next(err);
        }

        Item.find({ interested: user._id }, (err, interested) => {
            if(err) return next(err);

            res.render('account', { user, items, interested });
        })
    });
});

router.get('/add-item/:id', (req, res, next) => {
    const { user } = req;
    if(!user || !req.params.id) {
        res.redirect('/');
        return;
    }

    Item.findById(req.params.id, (err, item) => {
        if(err) return next(err);

        if(item.interested.indexOf(user._id) === -1){
            item.interested.push(user._id);
            item.save();
        }
        res.redirect('/account');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.post('/reset-password', (req, res, next) => {
    const { email } = req.body;
    User.findOne({ email }, (err, user) => {
        if(err) { return next(err); }
        if(!user) { return next(new Error('User did not exists')); }

        user.nonceToken = randomString(15);
        user.passwordResetTime  = new Date();
        user.save();

        const mailgun = new Mailgun({
            apiKey: 'YOURAPIIIIHERE',
            domain: 'sandbox46783503e5e84a2092da30f076cab78d.mailgun.org'
        });

        const data = {
            to: email,
            from: 'noreply@samplestore.it',
            sender: 'Sample store',
            subject: 'Password reset request',
            html: `
                Please click
                <a style="color: red" href="http://localhost:5000/account/password-reset?nonce=${user.nonceToken}&id=${user._id}">
                    HERE
                </a>
                to reset your password.
                <br />
                This link is valid for 24 hours.
            `
        };

        mailgun.messages().send(data, (err, body) => {
            if(err) { return next(err); }
            res.send('Request has been sent');
        });
    });
});

router.get('/password-reset', (req, res, next) => {
    const { nonce, id } = req.query;
    if(!nonce || !id) {
        return next(new Error('Invalid request'));
    }

    User.findById(id, (err, user) => {
        if(err) { return next(err); }

        if(!user.nonceToken || !user.passwordResetTime) {
            return next(new Error('Invalid request'));
        }

        const secondsPassed = (new Date() - user.passwordResetTime) / 1000;
        if(user.nonceToken !== nonce || secondsPassed > 24*60*60) {
            console.log(`${user.nonceToken} vs ${nonce} or second passed ${secondsPassed}`);
            return next(new Error('Invalid request'));
        }

        res.render('password-reset', { user });
    });
});

router.post('/new-password', (req, res, next) => {
    const { password, passwordConfirm, nonce, id } = req.body;
    if(!password || !passwordConfirm || !nonce || !id) {
        return next(new Error('Invalid request'));
    }

    if(passwordConfirm !== password) {
        return next(new Error('Password does not match'));
    }

    User.findById(id, (err, user) => {
        if(err) { return next(err); }
        if(!user) { return new Error('User not found'); }

        const secondsPassed = (new Date() - user.passwordResetTime) / 1000;
        if(user.nonceToken !== nonce || secondsPassed > 24*60*60) {
            return next(new Error('Invalid request'));
        }

        user.password = bcryptjs.hashSync(password);
        user.passwordResetTime = null;
        user.nonceToken = null;
        user.save();
        res.json({ confirmation: 'Password has been changed!', user });
    });
})

module.exports = router;
