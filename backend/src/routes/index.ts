import { Router } from 'express';
import authRouter from './auth';
import profileRouter from './profile';
import challengeRouter from './challenge';
import domainRouter from './domain';
import postsRouter from './posts';

const router = Router();

router.use('/auth', authRouter);
router.use('/domains', domainRouter);
router.use('/profiles', profileRouter);
router.use('/challenges', challengeRouter);
router.use('/posts', postsRouter);

export default router;