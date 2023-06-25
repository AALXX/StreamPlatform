import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UtilFunc from '../../util/utilFunctions';
import { connect, query } from '../../config/mysql';
import logging from '../../config/logging';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const NAMESPACE = 'UserAccountService';

const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            errorMsg: error.msg,
        };
    },
});

const GetUserAccountData = (req: Request, res: Response) => {
    const GetUserDataQueryString = `SELECT UserName, UserDescription, AccountFolowers, UserEmail FROM users WHERE UserPrivateToken='${req.params.privateToken}';`;

    connect()
        .then((connection) => {
            //* deepcode ignore Sqli: <please specify a reason of ignoring this>
            query(connection, GetUserDataQueryString)
                .then((results) => {
                    const data = JSON.parse(JSON.stringify(results));

                    if (Object.keys(data).length === 0) {
                        return res.status(200).json({
                            error: false,
                            userData: null,
                            test: 'test',
                        });
                    }

                    return res.status(200).json({
                        error: false,
                        userData: data[0],
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

const FollowAccount = async (req: Request, res: Response) => {
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

// -------------------------------------------------------------------------
//                              Account Auth
// -------------------------------------------------------------------------
const RegisterUser = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
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
        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const LoginQueryString = `SELECT UserPrivateToken, UserPwd FROM users WHERE UserEmail='${req.body.userEmail}';`;
    connect()
        .then((connection) => {
            //* deepcode ignore Sqli: <please specify a reason of ignoring this>
            query(connection, LoginQueryString)
                .then((results) => {
                    const data = JSON.parse(JSON.stringify(results));
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

export default {
    GetUserAccountData,
    RegisterUser,
    FollowAccount,
    LoginUser,
};
