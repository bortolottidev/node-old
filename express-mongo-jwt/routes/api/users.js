import { Router } from 'express';
import User from '../../models/User';
import jwt from 'jsonwebtoken'
import { secret, auth } from '../../config/passport';

const   router = Router();

// Uncomment this to create new user
// router.post('/', (req, res) => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400)
//             .send({
//                 error: `Required Fields not founds:
//                     ${!username ? 'username': ''} 
//                     ${!password ? 'password': ''}`
//             });
//     }
//     const newUser = new User({
//         username
//         , password
//     });
//     newUser.save(function(err, model) {
//         if(err) {
//             return res.status(500).send(err);
//         }
//         console.log('Correctly saved ' + username);
//         return res.status(201).send(model.removePass());
//     });
// });

router.post('/token', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400)
            .send({
                error: `Required Fields not founds: ${!username ? 'username': ''} ${!password ? 'password': ''}`
            });
    }
    User.findOne({ username }, function(error, user) {
        if (error) {
            return res.status(400).send(error);
        }
        if (!user) {
            return res.status(400).send({ error: 'Cannot find user ' + username });
        }

        const passwordComparer = (error, isMatch) => {
            if(error) {
                return res.send(400).send(error);
            }
            if(!isMatch) {
                return res.status(401).send({ error: 'invalid password' });
            }
            const payload = { id: user.id };
            const token = jwt.sign(payload, secret);
            return res.send(token);
        }
        return user.comparePassword(password, passwordComparer);
    });
});

router.get('/', auth, (req, res) => {
    // Remove password
    User.find(null).select('-password').exec()
        .then(users => res.send(users))
        .catch(err => res.status(500).send(err));
});

router.get('/:id', auth, (request, response) => {
    const { id } = request.params;
    User.findById(id).select('-password')
        .exec((error, found) => {
            if(error) {
                return response.status(400).send(error); 
            }
            return response.send(found);
        });
});

// router.get('/current', auth, (req, res) => {
//     return res.send(req.user);
// });

export default router;