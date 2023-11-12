import express from 'express';
// import { body } from 'express-validator';

import LiveStreamServices from '../../services/LiveStreamServicesManager/LiveStreamServicesManager';

const router = express.Router();

//* Stream auth
router.post('/stream-auth', LiveStreamServices.LiveStreamAuth);

//* Stream dashbord
router.get('/get-live-admin-data/:userPrivateToken', LiveStreamServices.GetLiveAdminData);
router.post('/start-stop-live', LiveStreamServices.StartStopLive);

export = router;
