import express from 'express';
import { body } from 'express-validator';

import LiveStreamServices from '../../services/LiveStreamServicesManager/LiveStreamServicesManager';

const router = express.Router();

//* Stream auth
router.post('/stream-auth', LiveStreamServices.LiveStreamAuth);

//* Stream dashbord
router.get('/get-live-admin-data/:userPrivateToken', LiveStreamServices.GetLiveAdminData);
router.get('/get-live-data/:streamToken/:userPrivateToken', LiveStreamServices.GetLiveData);
router.post('/start-stop-live', LiveStreamServices.StartStopLive);

//* client stream 
router.post('/like-dislike-live', body('userToken').not().isEmpty().trim(), body('streamToken').not().isEmpty().trim(), LiveStreamServices.LikeDislikeLiveFunc);


export = router;
