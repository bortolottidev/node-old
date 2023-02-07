import { Router } from 'express';
import userRouter from './users';
import animalRouter from './animals';

const router = Router();

router.use('/users', userRouter);
router.use('/animals', animalRouter);

router.get('/', (req, res) => res.send('Welcome on /api'));

export default router;