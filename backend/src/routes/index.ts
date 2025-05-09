import { Router } from 'express';
import authRouter from './auth';
import domainRouter from './domain';

const router = Router();

router.use('/auth', authRouter);
router.use('/domain', domainRouter);

export default router;