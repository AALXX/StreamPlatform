import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UtilFunc from '../../util/utilFunctions';
import { connect, query } from '../../config/mysql';
import logging from '../../config/logging';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const NAMESPACE = 'UserAccountService';

const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            errorMsg: error.msg,
        };
    },
});

const GetUserAccountData = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_DATA', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await connect();

        const GetUserDataQueryString = `SELECT UserName, UserDescription, AccountFolowers, UserEmail FROM users WHERE UserPrivateToken='${req.params.privateToken}';`;
        const data = await query(connection, GetUserDataQueryString);

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
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

const GetAccountVideos = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_VIDEOS', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await connect();
        const GetAccountVideosSQL = `SELECT * FROM videos WHERE OwnerToken="${req.params.accountToken}"`;
        const accountVideosDB = await query(connection, GetAccountVideosSQL);

        let accountVideos = JSON.parse(JSON.stringify(accountVideosDB));

        res.status(202).json({
            error: false,
            videos: accountVideos,
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

const FollowAccount = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        logging.error('FOLLOW_ACCOUNT_FUNC', errors.array.name);
        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const itFollows = await UtilFunc.userFollowAccountCheck(req.body.userToken, req.body.accountToken);
    const connection = await connect();
    try {
        if (itFollows) {
            if (req.body.userToken !== undefined) {
                const updateunfollwCountQueryString = `DELETE FROM user_follw_account_class WHERE userToken="${req.body.userToken}" accountToken="${
                    req.body.accountPublicToken
                }"; UPDATE users SET AccountFolowers = AccountFolowers-${1} WHERE UserPrivateToken="${req.body.accountToken}";`;
                await query(connection, updateunfollwCountQueryString);
            }
        } else {
            if (req.body.userToken !== undefined) {
                const updatefollwCountQueryString = `INSERT INTO user_follw_account_class (userToken, accountToken) VALUES ('${req.body.userToken}','${
                    req.body.accountToken
                }'); UPDATE users SET AccountFolowers = AccountFolowers+${1} WHERE UserPrivateToken="${req.body.accountToken}";`;
                await query(connection, updatefollwCountQueryString);
            }
        }

        res.status(202).json({
            error: false,
            succes: true,
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
            succes: false,
        });
    }
};

const ChangeUserData = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CHANGE_ACCOUNT_DATA_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await connect();
        const changeUserDataSQL = `UPDATE users SET UserName='${req.body.userName}',UserDescription='${req.body.userDescription}',UserEmail='${req.body.userEmail}', 
        userVisibility='${req.body.userVisibility}' WHERE UserPrivateToken='${req.body.userToken}';`;
        const accountVideosDB = await query(connection, changeUserDataSQL);

        let accountVideos = JSON.parse(JSON.stringify(accountVideosDB));

        res.status(202).json({
            error: false,
            videos: accountVideos,
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

// -------------------------------------------------------------------------
//                              Account Auth
// -------------------------------------------------------------------------
const RegisterUser = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
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

    connect()
        .then((connection) => {
            //* deepcode ignore Sqli: <please specify a reason of ignoring this>
            query(connection, InsertUserQueryString)
                .then((results) => {
                    return res.status(200).json({
                        error: false,
                        userprivateToken: userPrivateToken,
                    });
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);
                    return res.status(500).json({
                        error: true,
                        message: error,
                    });
                })
                .finally(() => {
                    connection.end();
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                error: true,
                message: error,
            });
        });
};

const LoginUser = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('LOGiN_USER_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await connect();
        const LoginQueryString = `SELECT UserPrivateToken, UserPwd FROM users WHERE UserEmail='${req.body.userEmail}';`;

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
                });
            }
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

const SendPwdLinkToEmail = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('SEND_PASSWORD_RESET_LINK_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await connect();
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
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

const CheckResetPasswordLinkValability = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
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
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

const ChangeUserPasswod = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CHANGE_USER_PASSWOD_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, msg: errors.array() });
    }

    try {
        const connection = await connect();
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
        res.status(202).json({
            error: true,
            msg: error.message,
        });
    }
};

export default {
    GetUserAccountData,
    GetAccountVideos,
    ChangeUserData,
    SendPwdLinkToEmail,
    CheckResetPasswordLinkValability,
    ChangeUserPasswod,
    RegisterUser,
    FollowAccount,
    LoginUser,
};
