import { Request, Response } from 'express';
import { connect, query } from '../../config/mysql';
import logging from '../../config/logging';

const NAMESPACE = 'LiveStreamService';

const LiveStreamAuth = async (req: Request, res: Response) => {
    console.log(req.body);

    const GetUserDataQueryString = `SELECT StreamKey, StreamToken FROM users WHERE UserEmail='${req.body.name}';`;

    connect()
        .then((connection) => {
            //* deepcode ignore Sqli: <please specify a reason of ignoring this>
            query(connection, GetUserDataQueryString)
                .then((results) => {
                    const data = JSON.parse(JSON.stringify(results));

                    if (Object.keys(data).length === 0) {
                        return res.status(403).send();
                    }

                    if (data[0].StreamKey == req.body.key && data[0].StreamToken == req.body.token) {
                        return res.status(200).send();
                    }
                    return res.status(403).send();
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
            return res.status(403).send();
        });
};

export default {
    LiveStreamAuth,
};
