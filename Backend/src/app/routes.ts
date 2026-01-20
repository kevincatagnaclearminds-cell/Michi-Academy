import { Router } from 'express';
import v1Routes from './routes-v1';

const router = Router();

router.use('/api/v1', v1Routes);

router.use('/api/auth', v1Routes);

export default router;
