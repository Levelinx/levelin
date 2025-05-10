import { Router } from 'express';
import authRouter from './auth';
import domainRouter from './domain';
import profileRouter from './profile';
import challengeRouter from './challenge';

const router = Router();

router.use('/auth', authRouter);
router.use('/domains', domainRouter);
router.use('/profiles', profileRouter);
router.use('/challenges', challengeRouter);

export default router;