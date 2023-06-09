import express from 'express';
// import { body } from 'express-validator';

import LiveStreamServices from '../../services/LiveStreamServicesManager/LiveStreamServicesManager';

const router = express.Router();

//* Stream auth
router.post('/stream-auth', LiveStreamServices.LiveStreamAuth);

export = router;
