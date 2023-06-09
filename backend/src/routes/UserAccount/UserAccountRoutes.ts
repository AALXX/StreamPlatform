import express from 'express';
import { body, param } from 'express-validator';
import UserAccountServices from '../../services/UserAccountServiecesManager/UserAccountServiecesManager';

const router = express.Router();

//* Account auth
router.post('/register-account', body('userName').not().isEmpty(), body('userEmail').isEmail().not().isEmpty(), body('password').isLength({ min: 4 }).not().isEmpty().trim(), UserAccountServices.RegisterUser);
router.post('/login-account', body('userEmail').isEmail().not().isEmpty(), body('password').isLength({ min: 4 }).not().isEmpty().trim(), UserAccountServices.LoginUser);
router.post('/send-change-user-password-email', body('userToken').not().isEmpty(), UserAccountServices.SendPwdLinkToEmail);
router.get('/check-pwd-change-link/:tokenLink/:email', param('tokenLink').not().isEmpty(), UserAccountServices.CheckResetPasswordLinkValability);
router.post(
    '/change-user-account-password',
    body('oldPassword').isLength({ min: 4 }).not().isEmpty(),
    body('newPassword').isLength({ min: 4 }).not().isEmpty(),
    body('userEmail').not().isEmpty(),
    UserAccountServices.ChangeUserPasswod,
);

//* Account data
router.get('/get-account-data/:privateToken', UserAccountServices.GetUserAccountData);
router.get('/get-account-videos/:accountToken', param('accountToken').not().isEmpty(), UserAccountServices.GetAccountVideos);

router.post('/change-user-data', body('userName').not().isEmpty(), body('userEmail').not().isEmpty(), body('userDescription').not().isEmpty(), body('userVisibility').not().isEmpty(), UserAccountServices.ChangeUserData);

//*Cretor Account
router.post('/follow', body('accounttoken').isEmail().not().isEmpty(), UserAccountServices.FollowAccount);

export = router;
