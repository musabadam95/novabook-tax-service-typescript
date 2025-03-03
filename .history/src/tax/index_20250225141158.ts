import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import transactions from './transaction';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/transactions', transactions);

export default router;
