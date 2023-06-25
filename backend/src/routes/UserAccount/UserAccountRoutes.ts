import express from 'express';
import { body } from 'express-validator';
import UserAccountServices from '../../services/UserAccountServiecesManager/UserAccountServiecesManager';

const router = express.Router();

//* Account auth
router.post('/register-account', body('userName').not().isEmpty(), body('userEmail').isEmail().not().isEmpty(), body('password').isLength({ min: 4 }).not().isEmpty().trim(), UserAccountServices.RegisterUser);
router.post('/login-account', body('userEmail').isEmail().not().isEmpty(), body('password').isLength({ min: 4 }).not().isEmpty().trim(), UserAccountServices.LoginUser);

//* Account data
router.get('/get-account-data/:privateToken', UserAccountServices.GetUserAccountData);

//*Cretor Account
router.post('/follow', body('accounttoken').isEmail().not().isEmpty(), UserAccountServices.FollowAccount);

export = router;
