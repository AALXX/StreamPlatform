import bcrypt from 'bcrypt';
import logging from '../config/logging';
import { connect, query } from '../config/mysql';
import jwt from 'jsonwebtoken';
import fs from 'fs';

//* /////////////////////////////
//*      Account related       //
//* /////////////////////////////

/**
 ** Hash the password inputed by user
 * @param {string} password
 */
const HashPassword = async (password: string) => {
    const NAMESPACE = 'HASH_PASSWORD_FUNCTION';

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(11);

        // Hash password
        return await bcrypt.hash(password, salt);
    } catch (error) {
        logging.error(NAMESPACE, error as string);
    }

    // Return null if error
    return null;
};

/**
 ** checks if username and email exists in database
 * @param {string} UserName
 * @param {string} Email
 * @param {any} callback
 */
const UserNameAndEmailExistCheck = (UserName: string, Email: string, callback: any) => {
    const NAMESPACE = 'USERNAME_EMAIL_EXIST_CHECK_FUNCTION';

    const CheckIfUsernamexExistsQuerryString = `SELECT 1 FROM users WHERE UserName="${UserName}" OR UserEmail="${Email}";`;

    connect()
        .then((connection) => {
            query(connection, CheckIfUsernamexExistsQuerryString)
                .then((results) => {
                    //* Parse rows from database
                    const data = JSON.parse(JSON.stringify(results));

                    if (Object.keys(data).length === 1) {
                        return callback(false, true);
                    }

                    return callback(false, false);
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);
                    return callback(true, false);
                })
                .finally(() => {
                    connection.end();
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return callback(true, false);
        });
};

const getUserPrivateTokenFromPublicToken = async (userToken: string): Promise<string | null> => {
    const NAMESPACE = 'GET_USER_PRIVATE_TOKEN_FUNC';
    const CheckIfUserFollwsAccountQuerryString = `SELECT UserPrivateToken FROM users WHERE UserPublicToken="${userToken}";`;

    try {
        if (userToken === 'undefined') {
            return null;
        }
        const connection = await connect();
        const checkfollowResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        let userData = JSON.parse(JSON.stringify(checkfollowResponse));
        if (Object.keys(userData).length != 0) {
            return userData[0].UserPrivateToken;
        } else {
            return null;
        }
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return null;
    }
};

const getUserPublicTokenFromPrivateToken = async (userPrivateToken: string): Promise<string | null> => {
    const NAMESPACE = 'GET_USER_PRIVATE_TOKEN_FUNC';
    const CheckIfUserFollwsAccountQuerryString = `SELECT UserPublicToken FROM users WHERE UserPrivateToken="${userPrivateToken}" ;`;

    try {
        if (userPrivateToken === 'undefined') {
            return null;
        }
        const connection = await connect();
        const checkfollowResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        let userData = JSON.parse(JSON.stringify(checkfollowResponse));
        if (Object.keys(userData).length != 0) {
            return userData[0].UserPublicToken;
        } else {
            return null;
        }
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return null;
    }
};

const userFollowAccountCheck = async (userToken: string, accountPublicToken: string) => {
    const NAMESPACE = 'USER_FOLLOW_CHECK_FUNCTION';
    const CheckIfUserFollwsAccountQuerryString = `SELECT * FROM user_follw_account_class WHERE userToken="${userToken}" AND accountToken="${accountPublicToken}";`;

    try {
        if (userToken === 'undefined') {
            return false;
        }
        const connection = await connect();
        const checkfollowResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        let checkfollowdata = JSON.parse(JSON.stringify(checkfollowResponse));

        if (Object.keys(checkfollowdata).length != 0) {
            return true;
        } else {
            return false;
        }
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return false;
    }
};

//* /////////////////////////////
//*      Videos related        //
//* /////////////////////////////

/**
 ** creates video token
 */
const CreateVideoToken = (): string => {
    const NAMESPACE = 'CREATE_VIDEO_TOKEN_FUNCTION';

    const secretExt = new Date().getTime().toString();

    const jwtSecretKey = 'secret' + secretExt;

    const userprivateToken = jwt.sign({}, jwtSecretKey);

    return userprivateToken;
};

const getUserLikedOrDislikedVideo = async (userToken: string, VideoToken: string) => {
    const NAMESPACE = 'USER_FOLLOW_CHECK_FUNCTION';
    const CheckIfUserFollwsAccountQuerryString = `SELECT * FROM user_liked_or_disliked_video_class WHERE userToken="${userToken}" AND videoToken="${VideoToken}";`;

    try {
        if (userToken === 'undefined') {
            return false;
        }

        const connection = await connect();
        const checkfollowResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        let checkfollowdata = JSON.parse(JSON.stringify(checkfollowResponse));
        if (Object.keys(checkfollowdata).length != 0) {
            return checkfollowdata[0].like_dislike;
        }
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return false;
    }
};

const userLikedOrDislikedVideoCheck = async (userToken: string, VideoToken: string) => {
    const NAMESPACE = 'USER_FOLLOW_CHECK_FUNCTION';
    const CheckIfUserFollwsAccountQuerryString = `SELECT * FROM user_liked_or_disliked_video_class WHERE userToken="${userToken}" AND videoToken="${VideoToken}";`;

    try {
        if (userToken === 'undefined') {
            return false;
        }

        const connection = await connect();
        const checkfollowResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        let checkfollowdata = JSON.parse(JSON.stringify(checkfollowResponse));

        if (Object.keys(checkfollowdata).length != 0) {
            return true;
        } else {
            return false;
        }
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return false;
    }
};

const RemoveDirectory = (dirPath: string) => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            if (fs.lstatSync(dirPath).isDirectory()) {
                // If it's a directory, recursively remove it
                RemoveDirectory(dirPath);
            } else {
                // If it's a file, delete it
                fs.unlinkSync(dirPath);
            }
        });
        fs.rmdirSync(dirPath); // Remove the empty directory
    }
};

export default {
    HashPassword,
    UserNameAndEmailExistCheck,
    CreateVideoToken,
    userFollowAccountCheck,
    getUserLikedOrDislikedVideo,
    userLikedOrDislikedVideoCheck,
    getUserPublicTokenFromPrivateToken,
    getUserPrivateTokenFromPublicToken,
    RemoveDirectory,
};
