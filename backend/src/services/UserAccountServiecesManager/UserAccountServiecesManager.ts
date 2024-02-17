import { Response } from 'express';
import { validationResult } from 'express-validator';
import UtilFunc from '../../util/utilFunctions';
import { CustomRequest, query } from '../../config/mysql';
import logging from '../../config/logging';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';
import utilFunctions from '../../util/utilFunctions';

const NAMESPACE = 'UserAccountService';

/**
 * Validates and cleans the CustomRequest form
 */
const CustomRequestValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            errorMsg: error.msg,
        };
    },
});

/**
 * Gets a personal user account data by User Private Token
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetUserAccountData = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_DATA', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const UserPublicToken = await UtilFunc.getUserPublicTokenFromPrivateToken(req.pool!, req.params.privateToken);
        const GetUserDataQueryString = `SELECT UserName, UserDescription, AccountFolowers, UserEmail FROM users WHERE UserPrivateToken='${req.params.privateToken}';
        SELECT StreamTitle, Likes, Dislikes, StreamToken, StartedAt FROM streams WHERE UserPublicToken='${UserPublicToken}' AND  Active=1;`;

        const data = await query(connection, GetUserDataQueryString);
        if (Object.keys(data).length === 0) {
            return res.status(200).json({
                error: false,
                userData: null,
                liveData: null,
            });
        }

        if (Object.keys(data[1]).length === 0) {
            return res.status(200).json({
                error: false,
                userData: data[0][0],
                liveData: null,
            });
        }

        return res.status(200).json({
            error: false,
            userData: data[0][0],
            liveData: data[1][0],
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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetCreatorAccountData = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_DATA', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();

        const GetUserDataQueryString = `SELECT UserName, UserDescription, AccountFolowers, userVisibility FROM users WHERE UserPublicToken='${req.params.accountToken}';
        SELECT StreamTitle, Likes, Dislikes, StreamToken, StartedAt FROM streams WHERE UserPublicToken='${req.params.accountToken}' AND  Active=1;`;
        const data = await query(connection, GetUserDataQueryString);

        let accData = JSON.parse(JSON.stringify(data));

        let privateToken = null;
        if (req.pool !== undefined) {
            privateToken = await UtilFunc.getUserPrivateTokenFromPublicToken(req.pool, req.params.publicToken);
        }

        let itFollows = false;
        if (privateToken != null && req.pool !== undefined) {
            itFollows = await UtilFunc.userFollowAccountCheck(req.pool, privateToken as string, req.params.accountToken);
        }

        if (Object.keys(accData).length === 0) {
            return res.status(200).json({
                error: false,
                userData: null,
                liveData: null,
                userFollowsCreator: false,
            });
        }

        if (Object.keys(data[1]).length === 0) {
            return res.status(200).json({
                error: false,
                userData: accData[0][0],
                userFollowsCreator: itFollows,
                liveData: null,
            });
        }
        return res.status(200).json({
            error: false,
            userData: accData[0][0],
            liveData: accData[1][0],
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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetAccountVideos = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        // deepcode ignore CallbackShouldReturn: <please specify a reason of ignoring this>
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_VIDEOS', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        let ownerToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.params.accountToken);
        if (ownerToken == null) {
            return res.status(200).json({
                error: true,
            });
        }

        const connection = await req.pool?.promise().getConnection();
        const GetAccountVideosSQL = `SELECT * FROM videos WHERE OwnerToken="${ownerToken}"`;
        const accountVideosDB = await query(connection, GetAccountVideosSQL);

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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetCreatorVideos = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        // deepcode ignore CallbackShouldReturn: <please specify a reason of ignoring this>
        errors.array().map((error) => {
            logging.error('GET_CREATOR_VIDEOS', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const GetAccountVideosSQL = `SELECT VideoTitle, VideoDescription, Likes, Dislikes, PublishDate, VideoToken, OwnerToken FROM videos WHERE OwnerToken="${req.params.ownerToken}" AND Visibility="public"`;
        const accountVideosDB = await query(connection, GetAccountVideosSQL);

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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const FollowAccount = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
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

    const itFollows = await UtilFunc.userFollowAccountCheck(req.pool!, req.body.userToken, req.body.accountToken);
    const connection = await req.pool?.promise().getConnection();
    try {
        if (itFollows) {
            if (req.body.userToken !== undefined) {
                const updateunfollwCountQueryString = `DELETE FROM user_follw_account_class WHERE userToken="${req.body.userToken}" AND accountToken="${
                    req.body.accountToken
                }"; UPDATE users SET AccountFolowers = AccountFolowers-${1} WHERE UserPublicToken="${req.body.accountToken}";`;
                await query(connection, updateunfollwCountQueryString);
            }
        } else {
            if (req.body.userToken !== undefined) {
                const updatefollwCountQueryString = `INSERT INTO user_follw_account_class (userToken, accountToken) VALUES ('${req.body.userToken}','${
                    req.body.accountToken
                }'); UPDATE users SET AccountFolowers = AccountFolowers+${1} WHERE UserPublicToken="${req.body.accountToken}";`;
                await query(connection, updatefollwCountQueryString);
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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const ChangeUserData = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CHANGE_ACCOUNT_DATA_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const changeUserDataSQL = `UPDATE users SET UserName='${req.body.userName}',UserDescription='${req.body.userDescription}',UserEmail='${req.body.userEmail}', 
        userVisibility='${req.body.userVisibility}' WHERE UserPrivateToken='${req.body.userToken}';`;
        const accountVideosDB = await query(connection, changeUserDataSQL);

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
    destination: (req: CustomRequest, file: any, callback: any) => {
        callback(null, '../server/accounts/IconTmp');
    },

    filename: (req: CustomRequest, file, cb: any) => {
        cb(null, `${file.originalname}`);
    },
});

const fileFilter = (req: CustomRequest, file: any, cb: any) => {
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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const ChangeUserIcon = async (req: CustomRequest, res: Response) => {
    upload(req, res, async (err: any) => {
        if (err) {
            return res.status(200).json({
                msg: 'falied to upload',
                error: true,
            });
        }

        let userPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.body.userToken);
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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const RegisterUser = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
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

    const userPublicToken = jwt.sign(publicData, `${process.env.ACCOUNT_REGISTER_SECRET}`);

    const StreamKey = UtilFunc.GenerateRandomStreamKey();

    const InsertUserQueryString = `START TRANSACTION;
    INSERT INTO users (UserName, UserDescription, UserEmail, UserPwd, UserPrivateToken, UserPublicToken, StreamKey)
    VALUES ('${req.body.userName}', '', '${req.body.userEmail}', '${hashedpwd}', '${userPrivateToken}', '${userPublicToken}', '${StreamKey}');
    
    INSERT INTO channel_roles_alloc (UserPrivateToken, ChannelToken, RoleCategoryId)
    VALUES ('${userPrivateToken}', '${userPublicToken}', ${2});
    
    COMMIT;`;

    try {
        const connection = await req.pool?.promise().getConnection();
        await query(connection, InsertUserQueryString);
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
 * Deletes The user Account and all the videos with it
 */
const DeleteUserAccount = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('LOGiN_USER_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.body.userToken);
        const DeleteUserAccount = `
        DELETE FROM users WHERE UserPrivateToken='${req.body.userToken}';
        DELETE FROM videos WHERE OwnerToken='${UserPublicToken}';
        DELETE FROM comments WHERE ownerToken='${UserPublicToken}';
        DELETE FROM streams WHERE UserPublicToken='${UserPublicToken}';`;

        const resp = await query(connection, DeleteUserAccount);

        res.status(202).json({
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
 * Login User
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const LoginUser = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('LOGiN_USER_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const LoginQueryString = `SELECT UserPrivateToken, UserPublicToken, UserPwd FROM users WHERE UserEmail='${req.body.userEmail}';`;

        const accountVideosDB = await query(connection, LoginQueryString);

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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const SendPwdLinkToEmail = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('SEND_PASSWORD_RESET_LINK_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const getUserEmailSQl = `SELECT UserEmail FROM users WHERE UserPrivateToken='${req.body.userToken}';`;
        const userEmailDB = await query(connection, getUserEmailSQl);

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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const CheckResetPasswordLinkValability = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const ChangeUserPasswod = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CHANGE_USER_PASSWOD_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, msg: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const getUserPassword = `SELECT UserPwd FROM users WHERE UserEmail='${req.body.userEmail}';`;
        const DBDataRaw = await query(connection, getUserPassword);

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
                const DBDataRaw = await query(connection, changeUserPassword);
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

/**
 * Get User Analytics
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetUserAnalytics = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_USER_ACCOUNT_ANALYTICS_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, msg: errors.array() });
    }

    try {
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.params.UserPrivateToken);
        const connection = await req.pool?.promise().getConnection();
        const GetUserHistoryQueryString = `SELECT cah.*
        FROM users u
        JOIN user_account_history cah ON u.id = cah.user_id
        WHERE u.UserPublicToken="${UserPublicToken}"`;
        const userData = await query(connection, GetUserHistoryQueryString);

        const GetUserStats = `SELECT
        users.AccountFolowers AS followers,
        (
            SELECT COUNT(v.id)
            FROM videos v
            WHERE v.OwnerToken = users.UserPublicToken
        ) AS videos,
        CAST((
            SELECT SUM(v.views)
            FROM videos v
            WHERE v.OwnerToken = users.UserPublicToken
        ) AS SIGNED) AS total_views
        FROM
        users WHERE UserPublicToken="${UserPublicToken}";`;
        const userDataStat = await query(connection, GetUserStats);

        if (Object.keys(userData).length == 0) {
            return res.status(200).json({
                error: true,
            });
        }
        return res.status(200).json({
            error: false,
            userAnalyticsData: userDataStat[0],
            UserHistoryData: userData,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        res.status(202).json({
            error: true,
            msg: error.message,
        });
    }
};

/**
 * Change User Password
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetStreamAnalytics = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_STREAM_ANALYTICS_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, msg: errors.array() });
    }

    try {
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.params.UserPrivateToken);
        const connection = await req.pool?.promise().getConnection();
        const GetLiveStreamAnalytics = `SELECT StreamTitle, Likes, Dislikes, StartedAt, FinishedAt, MaxViwers, StreamToken 
        FROM streams 
        WHERE UserPublicToken = "${UserPublicToken}" AND DATE(StartedAt) = '${req.params.Date}';`;
        const liveData = await query(connection, GetLiveStreamAnalytics);

        let views: Array<{ views: number; snap_time: string }> = [];

        //find a more efficeint way
        for (let index = 0; index < Object.keys(liveData).length; index++) {
            const streamToken = liveData[index].StreamToken;
            const GetLiveStreamAnalytics = `            
            SELECT views, snap_time 
            FROM Live_Snapshots 
            WHERE streamToken = "${streamToken}";`;
            const liveViews = await query(connection, GetLiveStreamAnalytics);
            views.push(liveViews);
        }

        return res.status(200).json({ error: false, liveData: liveData, liveViwes: views });
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
    GetStreamAnalytics,
    GetCreatorVideos,
    GetUserAnalytics,
    ChangeUserData,
    ChangeUserIcon,
    SendPwdLinkToEmail,
    CheckResetPasswordLinkValability,
    ChangeUserPasswod,
    RegisterUser,
    DeleteUserAccount,
    FollowAccount,
    LoginUser,
    GetCreatorAccountData,
};
