import { Router } from 'express';
import { auth } from '../../config/passport';
import Animal from '../../models/Animal';
import User from '../../models/User';

const router = Router();

router.get('/', auth, (req, res) => { 
    Animal.find(null, (err, doc) => {
        if(err) { return res.status(400).send(err); }

        return res.send(doc);
    })
});

router.get('/:id', auth, (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send('ID is required');
    }
    Animal.findById(id, (err, doc) => {
        if(err) { return res.status(400).send(err); }
        if(!doc) { return res.status(500).send({ error: 'ID not found' }); }

        return res.send(doc);
    });
});

router.post('/', auth, (req, res) => {
    const { type, name } = req.body;
    if(!type || !name) {
        return res.status(400).send('Type and Name are required');
    }

    const newAnimal = new Animal({
        name
        , type
        , owner: req.user._id
    });

    newAnimal.save(function(err, savedModel) {
        if(err) {
            return res.status(400).send({ err });
        }
        User.findByIdAndUpdate(req.user._id
            , { $push: { animals: savedModel._id } }
            , function(err){ 
                return res.send(savedModel);
            }
        )
    })
});

router.delete('/:id', auth, (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send('ID is required');
    }
    Animal.remove({_id: id}, (err, doc) => {
        if(err) { return res.status(400).send(err); }

        return res.status(204).send();
    });
});

router.put('/:id', auth, (req, res) => {
    const { id } = req.params;
    const { name, type, owner } = req.body;

    if(!type || !name) {
        return res.status(400).send({ error: 'Name and type are required' });
    }

    Animal.findByIdAndUpdate(id, { name, type, owner }, { new: true }, 
        (error, animal) => {
            if(error) { return res.status(400).send({ err }); }

            return res.send(animal);
        });
});

router.patch('/:id', auth, (req, res) => {
    const { id } = req.params;
    const { name, type, owner } = req.body;
    if(!type || !name) {
        return res.status(400).send({ error: 'Name and type are required' });
    }

    const updated = { name, type };
    if(owner) {
        updated.owner = owner;
    }
    Animal.findByIdAndUpdate(id, updated, { new: true }, (error, doc) => {
        if(error) {
            return res.send(400).send({ error });
        }
        return res.send(doc);
    });
});

export default router;