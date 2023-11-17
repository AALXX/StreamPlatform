import bcrypt from 'bcrypt';
import logging from '../config/logging';
import { connect, query } from '../config/mysql';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import utilFunctions from '../util/utilFunctions';

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

/**
 * Get User Private token by provided public Token
 * @param {string} userToken
 * @return {Promise<string | null>}
 */
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

/**
 * Get User Public token by provided private Token
 * @param {string} userPrivateToken
 * @return {Promise<string | null>}
 */
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

/**
 * Checks if user is following the account
 * @param {string} userToken
 * @param {string} accountPublicToken
 * @return {Promise<boolean>}
 */
const userFollowAccountCheck = async (userToken: string, accountPublicToken: string): Promise<boolean> => {
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
 * @return {string}
 */
const CreateVideoToken = (): string => {
    const NAMESPACE = 'CREATE_VIDEO_TOKEN_FUNCTION';

    const secretExt = new Date().getTime().toString();

    const jwtSecretKey = 'secret' + secretExt;

    const userprivateToken = jwt.sign({}, jwtSecretKey);

    return userprivateToken;
};

/**
 * It gets the video that user liked
 * @param {string} userToken
 * @param {string} VideoToken
 * @returns
 */
const getUserLikedOrDislikedVideo = async (userToken: string, VideoToken: string): Promise<{ userLiked: boolean; like_or_dislike: number }> => {
    const NAMESPACE = 'USER_LIKED_OR_DISLIKED_FUNCTION';
    const CheckIfUserFollwsAccountQuerryString = `SELECT * FROM user_liked_or_disliked_video_class WHERE userToken="${userToken}" AND videoToken="${VideoToken}";`;

    try {
        if (userToken === 'undefined') {
            return { userLiked: false, like_or_dislike: 0 };
        }

        const connection = await connect();
        const checkfollowResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        let checkfollowdata = JSON.parse(JSON.stringify(checkfollowResponse));
        if (Object.keys(checkfollowdata).length != 0) {
            return { userLiked: true, like_or_dislike: checkfollowdata[0].like_dislike };
        }
        return { userLiked: false, like_or_dislike: 0 };
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return { userLiked: false, like_or_dislike: 0 };
    }
};

/**
 * It gets the stream that user liked
 * @param {string} userToken
 * @param {string} StreamToken
 * @returns
 */
const getUserLikedOrDislikedStream = async (userToken: string, StreamToken: string): Promise<{ userLiked: boolean; like_or_dislike: number }> => {
    const NAMESPACE = 'USER_LIKED_OR_DISLIKED_FUNCTION';
    const CheckIfUserFollwsAccountQuerryString = `SELECT * FROM user_liked_or_disliked_stream_class WHERE userToken="${userToken}" AND StreamToken="${StreamToken}";`;

    try {
        if (userToken === 'undefined') {
            return { userLiked: false, like_or_dislike: 0 };
        }
        const connection = await connect();
        const checklikeResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        let checklikedata = JSON.parse(JSON.stringify(checklikeResponse));
        // console.log(checklikedata);
        if (Object.keys(checklikedata).length != 0) {
            return { userLiked: true, like_or_dislike: checklikedata[0].like_dislike };
        }
        return { userLiked: false, like_or_dislike: 0 };
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return { userLiked: false, like_or_dislike: 0 };
    }
};

/**
 * Removes a directory
 * @param {string} dirPath
 */
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

//* /////////////////////////////
//*        Live related        //
//* /////////////////////////////

/**
 * Start a live
 * @param {string} userPrivateToken
 * @return {}
 */
const CheckIfLive = async (userPrivateToken: string): Promise<{ isLive: boolean; error: boolean }> => {
    const NAMESPACE = 'CHECK_IF_IS_LIVE_FUNCTION';

    try {
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(userPrivateToken);
        const connection = await connect();
        if (UserPublicToken == null) {
            return { isLive: false, error: true };
        }
        const StatALiveQueryString = `SELECT id FROM streams WHERE UserPublicToken="${UserPublicToken}"`;

        const results = await query(connection, StatALiveQueryString);
        const data = JSON.parse(JSON.stringify(results));
        if (Object.keys(data).length == 0) {
            return { isLive: false, error: false };
        }
        return { isLive: true, error: false };
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        return { isLive: false, error: true };
    }
};

/**
 * Start a live
 * @param {string} userPrivateToken
 * @return {}
 */
const StartLive = async (LiveTitle: string, userPrivateToken: string): Promise<boolean> => {
    const NAMESPACE = 'START_LIVE_FUNCTION';
    logging.info(NAMESPACE, 'USed THE FUNCTION');

    try {
        const StreamToken = CreateVideoToken();
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(userPrivateToken);
        const connection = await connect();
        if (UserPublicToken == null) {
            return true;
        }
        const StatALiveQueryString = `INSERT INTO streams(StreamTitle, AccountFolowers, UserPublicToken, StreamToken)
SELECT "${LiveTitle}", u.AccountFolowers, "${UserPublicToken}", "${StreamToken}"
FROM users AS u
WHERE u.UserPublicToken = "${UserPublicToken}";`;

        const results = await query(connection, StatALiveQueryString);

        const data = JSON.parse(JSON.stringify(results));
        if (data.affectedRows == 0) {
            return true;
        }

        return false;
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        return true;
    }
};

/**
 * End a live
 * @param {string} userPrivateToken
 * @return {}
 */
const EndLive = async (userPrivateToken: string): Promise<boolean> => {
    const NAMESPACE = 'END_LIVE_FUNCTION';

    try {
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(userPrivateToken);
        const connection = await connect();
        if (UserPublicToken == null) {
            return true;
        }
        const StatALiveQueryString = `DELETE FROM streams WHERE UserPublicToken="${UserPublicToken}"`;

        const results = await query(connection, StatALiveQueryString);

        const data = JSON.parse(JSON.stringify(results));
        if (data.affectedRows == 0) {
            return true;
        }

        return false;
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        return true;
    }
};

export default {
    HashPassword,
    UserNameAndEmailExistCheck,
    CreateVideoToken,
    userFollowAccountCheck,
    getUserLikedOrDislikedVideo,
    getUserPublicTokenFromPrivateToken,
    getUserLikedOrDislikedStream,
    getUserPrivateTokenFromPublicToken,
    RemoveDirectory,
    CheckIfLive,
    StartLive,
    EndLive,
};
