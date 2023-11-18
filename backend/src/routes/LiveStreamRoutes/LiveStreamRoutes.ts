import express from 'express';
import { body, param } from 'express-validator';

import LiveStreamServices from '../../services/LiveStreamServicesManager/LiveStreamServicesManager';

const router = express.Router();

//* Stream auth
router.post('/stream-auth', LiveStreamServices.LiveStreamAuth);

//* Stream dashbord
router.get('/get-live-admin-data/:userPrivateToken', param('userPrivateToken').not().isEmpty().trim(), LiveStreamServices.GetLiveAdminData);
router.get('/get-live-data/:streamToken/:userPrivateToken', param('streamToken').not().isEmpty().trim(), param('userPrivateToken').not().isEmpty().trim(), LiveStreamServices.GetLiveData);
router.post('/start-stop-live', body('UserPrivateToken').not().isEmpty().trim(), body('LiveTitle').not().isEmpty().trim(), body('StreamToken').not().isEmpty().trim(), LiveStreamServices.StartStopLive);

//* client stream
router.post('/like-dislike-live', body('userToken').not().isEmpty().trim(), body('streamToken').not().isEmpty().trim(), LiveStreamServices.LikeDislikeLiveFunc);

export = router;
