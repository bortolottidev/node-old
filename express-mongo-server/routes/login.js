const express = require('express');
const router = express.Router();
const passport = require('passport');


router.post('/', passport.authenticate('localLogin', {
    successRedirect: '/account'
}));

// router.post('/', (req, res, next) => {
//     const { email, password } = req.body;
//     User.findOne({ email }, (err, user) => {
//         if(err) {
//             // res.status(500);
//             // res.json({
//             //     confirmation: 'fail',
//             //     error: err
//             // });
//             return next(err);
//         }

//         if(!user) {
//         //     res.status(500);
//         //     res.json({
//         //         confirmation: 'fail',
//         //         error: 'User not found'
//         //     });
//             return next(new Error('User not found'));
//         }

//         if(user.password !== password) {
//             // res.status(500);
//             // res.json({
//             //     confirmation: 'fail',
//             //     error: 'Incorrect user or password'
//             // });
//             return next(new Error('Incorrect user or password'));
//         }

//         res.status(200);
//         res.json({
//             confirmation: 'success',
//             user
//         });
//     })
// });

module.exports = router;