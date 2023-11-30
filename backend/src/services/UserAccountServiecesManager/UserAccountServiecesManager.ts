import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UtilFunc from '../../util/utilFunctions';
import { createPool, query } from '../../config/mysql';
import logging from '../../config/logging';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';
import utilFunctions from '../../util/utilFunctions';

const NAMESPACE = 'UserAccountService';

/**
 * Validates and cleans the request form
 */
const RequestValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            errorMsg: error.msg,
        };
    },
});

/**
 * Gets a personal user account data by User Private Token
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const GetUserAccountData = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_DATA', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const pool = createPool();

        const GetUserDataQueryString = `SELECT UserName, UserDescription, AccountFolowers, UserEmail FROM users WHERE UserPrivateToken='${req.params.privateToken}';`;
        const data = await query(pool, GetUserDataQueryString);

        let accData = JSON.parse(JSON.stringify(data));

        if (Object.keys(accData).length === 0) {
            return res.status(200).json({
                error: false,
                userData: null,
            });
        }

        return res.status(200).json({
            error: false,
            userData: accData[0],
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Gets a public  creator account data by User Public Token
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const GetCreatorAccountData = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_DATA', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const pool = createPool();

        const GetUserDataQueryString = `SELECT UserName, UserDescription, AccountFolowers, userVisibility FROM users WHERE UserPublicToken='${req.params.accountToken}';`;
        const data = await query(pool, GetUserDataQueryString);

        let accData = JSON.parse(JSON.stringify(data));

        const privateToken = await UtilFunc.getUserPrivateTokenFromPublicToken(req.params.publicToken);
        let itFollows = false;
        if (privateToken != null) {
            itFollows = await UtilFunc.userFollowAccountCheck(privateToken as string, req.params.accountToken);
        }

        if (Object.keys(accData).length === 0) {
            return res.status(200).json({
                error: false,
                userData: null,
                userFollowsCreator: false,
            });
        }

        return res.status(200).json({
            error: false,
            userData: accData[0],
            userFollowsCreator: itFollows,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};
/**
 * Gets user account public videos
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const GetAccountVideos = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        // deepcode ignore CallbackShouldReturn: <please specify a reason of ignoring this>
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_VIDEOS', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        let ownerToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.params.accountToken);
        if (ownerToken == null) {
            return res.status(200).json({
                error: true,
            });
        }

        const pool = createPool();
        const GetAccountVideosSQL = `SELECT * FROM videos WHERE OwnerToken="${ownerToken}"`;
        const accountVideosDB = await query(pool, GetAccountVideosSQL);

        let accountVideos = JSON.parse(JSON.stringify(accountVideosDB));
        res.status(202).json({
            error: false,
            videos: accountVideos,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Gets creator account public videos
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const GetCreatorVideos = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        // deepcode ignore CallbackShouldReturn: <please specify a reason of ignoring this>
        errors.array().map((error) => {
            logging.error('GET_CREATOR_VIDEOS', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const pool = createPool();
        const GetAccountVideosSQL = `SELECT VideoTitle, VideoDescription, Likes, Dislikes, PublishDate, VideoToken, OwnerToken FROM videos WHERE OwnerToken="${req.params.ownerToken}" AND Visibility="public"`;
        const accountVideosDB = await query(pool, GetAccountVideosSQL);

        let accountVideos = JSON.parse(JSON.stringify(accountVideosDB));

        res.status(202).json({
            error: false,
            videos: accountVideos,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Follws an account
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const FollowAccount = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('FOLLOW_ACCOUNT_FUNC', error.errorMsg);
        });
        return res.status(200).json({ error: true, errors: errors.array() });
    }

    if (req.body.userToken == req.body.accountToken) {
        return res.status(202).json({
            error: true,
            succes: false,
        });
    }

    const itFollows = await UtilFunc.userFollowAccountCheck(req.body.userToken, req.body.accountToken);
    const pool = createPool();
    try {
        if (itFollows) {
            if (req.body.userToken !== undefined) {
                const updateunfollwCountQueryString = `DELETE FROM user_follw_account_class WHERE userToken="${req.body.userToken}" AND accountToken="${
                    req.body.accountToken
                }"; UPDATE users SET AccountFolowers = AccountFolowers-${1} WHERE UserPublicToken="${req.body.accountToken}";`;
                await query(pool, updateunfollwCountQueryString);
            }
        } else {
            if (req.body.userToken !== undefined) {
                const updatefollwCountQueryString = `INSERT INTO user_follw_account_class (userToken, accountToken) VALUES ('${req.body.userToken}','${
                    req.body.accountToken
                }'); UPDATE users SET AccountFolowers = AccountFolowers+${1} WHERE UserPublicToken="${req.body.accountToken}";`;
                await query(pool, updatefollwCountQueryString);
            }
        }

        res.status(202).json({
            error: false,
            succes: true,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            succes: false,
        });
    }
};

/**
 * Change  users data
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const ChangeUserData = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CHANGE_ACCOUNT_DATA_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const pool = createPool();
        const changeUserDataSQL = `UPDATE users SET UserName='${req.body.userName}',UserDescription='${req.body.userDescription}',UserEmail='${req.body.userEmail}', 
        userVisibility='${req.body.userVisibility}' WHERE UserPrivateToken='${req.body.userToken}';`;
        const accountVideosDB = await query(pool, changeUserDataSQL);

        let accountVideos = JSON.parse(JSON.stringify(accountVideosDB));

        res.status(202).json({
            error: false,
            videos: accountVideos,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * file storage
 */
const storage = multer.diskStorage({
    destination: (req: Request, file: any, callback: any) => {
        callback(null, '../server/accounts/IconTmp');
    },

    filename: (req: Request, file, cb: any) => {
        cb(null, `${file.originalname}`);
    },
});

const fileFilter = (req: Request, file: any, cb: any) => {
    // reject all files except jpeg
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

let upload = multer({
    storage: storage,
    // fileFilter: fileFilter,
}).single('iconFile');

/**
 * Change UserIcon
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const ChangeUserIcon = async (req: Request, res: Response) => {
    upload(req, res, async (err: any) => {
        if (err) {
            return res.status(200).json({
                msg: 'falied to upload',
                error: true,
            });
        }

        let userPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.body.userToken);
        if (userPublicToken == null) {
            return res.status(200).json({
                error: true,
            });
        }

        fs.stat(`../server/accounts/${userPublicToken}/Main_Icon.png`, (err, stats) => {
            if (stats !== undefined) {
                // deepcode ignore PT: <please specify a reason of ignoring this>
                fs.unlink(`../server/accounts/${userPublicToken}/Main_Icon.png`, (err) => {
                    if (err) {
                        return res.status(200).json({
                            error: true,
                            msg: err.message,
                        });
                    }
                    console.log('file deleted successfully');

                    fs.rename(`../server/accounts/IconTmp/${req.file?.originalname}`, `../server/accounts/${userPublicToken}/Main_Icon.png`, async (err) => {
                        if (err) {
                            return res.status(200).json({
                                error: true,
                            });
                        }

                        return res.status(200).json({
                            error: false,
                        });
                    });
                });
            } else {
                fs.rename(`../server/accounts/IconTmp/${req.file?.originalname}`, `../server/accounts/${userPublicToken}/Main_Icon.png`, async (err) => {
                    if (err) {
                        return res.status(200).json({
                            error: true,
                        });
                    }

                    return res.status(200).json({
                        error: false,
                    });
                });
            }
        });
    });
};

/**
 * Register User
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const RegisterUser = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('REGISTER_USER_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const hashedpwd = await UtilFunc.HashPassword(req.body.password);

    const jwtSecretKey = 'secret' + hashedpwd + req.body.userEmail;
    const privateData = {};

    const publicData = {};

    const userPrivateToken = jwt.sign(privateData, jwtSecretKey);

    const userPublicToken = jwt.sign(publicData, 'secret');

    const InsertUserQueryString = `INSERT INTO users (UserName, UserEmail, UserPwd, UserPrivateToken, UserPublicToken) VALUES 
        ('${req.body.userName}', '${req.body.userEmail}', '${hashedpwd}','${userPrivateToken}','${userPublicToken}');`;

    try {
        const pool = createPool();
        await query(pool, InsertUserQueryString);
        fs.mkdir(`../server/accounts/${userPublicToken}/`, (err) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                });
            }

            res.status(202).json({
                error: false,
                userprivateToken: userPrivateToken,
                userpublictoken: userPublicToken,
            });
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

/**
 * Login User
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const LoginUser = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('LOGiN_USER_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const pool = createPool();
        const LoginQueryString = `SELECT UserPrivateToken, UserPublicToken, UserPwd FROM users WHERE UserEmail='${req.body.userEmail}';`;

        const accountVideosDB = await query(pool, LoginQueryString);

        let data = JSON.parse(JSON.stringify(accountVideosDB));
        if (Object.keys(data).length === 0) {
            return res.status(200).json({
                error: false,
                userprivateToken: null,
            });
        }

        bcrypt.compare(req.body.password, data[0].UserPwd, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: true,
                });
            } else if (!isMatch) {
                return res.status(200).json({
                    error: false,
                    userprivateToken: null,
                });
            } else {
                return res.status(200).json({
                    error: false,
                    userprivateToken: data[0].UserPrivateToken,
                    userpublicToken: data[0].UserPublicToken,
                });
            }
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Sends passwords reset link to user email
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const SendPwdLinkToEmail = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('SEND_PASSWORD_RESET_LINK_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const pool = createPool();
        const getUserEmailSQl = `SELECT UserEmail FROM users WHERE UserPrivateToken='${req.body.userToken}';`;
        const userEmailDB = await query(pool, getUserEmailSQl);

        let userEmail = JSON.parse(JSON.stringify(userEmailDB));

        const Secret = process.env.CHANGE_PWD_SECRET + userEmail[0].UserEmail;
        const payload = { AccountEmail: userEmail[0].UserEmail };
        const token = jwt.sign(payload, Secret, { expiresIn: '15min' });
        const link = `http://localhost:3000/account/reset-password/${token}/?email=${userEmail[0].UserEmail}`;

        // Create a transporter with Gmail SMTP configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.platform_gmail,
                pass: process.env.platform_gmail_password,
            },
        });

        // Prepare the email options
        const mailOptions = {
            from: process.env.platform_gmail,
            to: userEmail[0].UserEmail,
            subject: 'Email Change Link',
            text: `Press the link: <a>${link}</a> to reset the password`,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * checks reset pasword link valability
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const CheckResetPasswordLinkValability = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CHECK_LINK_AVALABILITY_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }
    const secret = process.env.CHANGE_PWD_SECRET + req.params.email;
    try {
        jwt.verify(req.params.tokenLink, secret);
        return res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Change User Password
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const ChangeUserPasswod = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CHANGE_USER_PASSWOD_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, msg: errors.array() });
    }

    try {
        const pool = createPool();
        const getUserPassword = `SELECT UserPwd FROM users WHERE UserEmail='${req.body.userEmail}';`;
        const DBDataRaw = await query(pool, getUserPassword);

        let DbData = JSON.parse(JSON.stringify(DBDataRaw));

        const pwdMatch = await bcrypt.compare(req.body.oldPassword, DbData[0].UserPwd);

        if (pwdMatch) {
            const saltRounds = 10;
            bcrypt.hash(req.body.newPassword, saltRounds, async (err, hashedPwd) => {
                console.log(hashedPwd);
                console.log('$2b$10$W4moC8Mwx4wPckTkXqQTgOKSm.WBmWit6Xz9J2drufaJrsrWOw0/y');
                if (err) {
                    return res.status(500);
                }

                const changeUserPassword = `UPDATE users SET UserPwd="${hashedPwd}" WHERE UserEmail='${req.body.userEmail}';`;
                const DBDataRaw = await query(pool, changeUserPassword);
                let DbData = JSON.parse(JSON.stringify(DBDataRaw));
                console.log(DbData.affectedRows);
                if (DbData.affectedRows === 0) {
                    return res.status(200).json({
                        error: false,
                        pwdChanged: false,
                        msg: 'same password used',
                    });
                }

                return res.status(200).json({
                    error: false,
                    pwdChanged: true,
                });
            });
        } else {
            
            return res.status(200).json({
                error: false,
                pwdChanged: false,
                msg: "old password doesen't match",
            });
        }
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        res.status(202).json({
            error: true,
            msg: error.message,
        });
    }
};

export default {
    GetUserAccountData,
    GetAccountVideos,
    GetCreatorVideos,
    ChangeUserData,
    ChangeUserIcon,
    SendPwdLinkToEmail,
    CheckResetPasswordLinkValability,
    ChangeUserPasswod,
    RegisterUser,
    FollowAccount,
    LoginUser,
    GetCreatorAccountData,
};
