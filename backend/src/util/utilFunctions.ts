import bcrypt from 'bcrypt';
import logging from '../config/logging';
import { connect, query } from '../config/mysql';
import jwt from 'jsonwebtoken';

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

export default { HashPassword, UserNameAndEmailExistCheck, CreateVideoToken };
