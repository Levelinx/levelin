import { Router, Request, Response } from 'express';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', auth, (req: Request, res: Response) => {
  res.send('Hello World');
});

export default router;