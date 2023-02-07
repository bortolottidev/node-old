const express = require('express')
const router = express.Router()
const passport = require('passport');

router.post('/', passport.authenticate('localRegister', {
    successRedirect: '/account'
}))

// Moved on auth.js
// router.post('/', (req, res, next) => {
//     User.create(new User(req.body), (err, user) => {
//         if(err) {
//             res.json({
//                 confirmation: 'fail',
//                 error: err
//             });
//             return;
//         }

//         res.status(201);
//         res.json({
//             confirmation: 'success',
//             user
//         });
//     });
// })
 
module.exports = router;