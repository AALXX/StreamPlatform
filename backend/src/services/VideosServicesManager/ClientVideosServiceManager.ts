import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import logging from '../../config/logging';
import { connect, query } from '../../config/mysql';
import UtilFunc from '../../util/utilFunctions';

const NAMESPACE = 'ClientVideosServiceManager';

const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            errorMsg: error.msg,
        };
    },
});

/**
 ** Gets Data About Video from db
 * @param req
 * @param res
 */
const GetVideoDataByToken = (req: Request, res: Response) => {
    const GetVideoDataByTokenQueryString = `SELECT VideoTitle, VideoDescription, PublishDate, OwnerToken FROM videos WHERE VideoToken="${req.params.VideoToken}"`;

    connect()
        .then(async (connection) => {
            const getVideoResponse = await query(connection, GetVideoDataByTokenQueryString);
            let Videodata = JSON.parse(JSON.stringify(getVideoResponse));

            const GetOwnerrDataQueryString = `SELECT UserName, AccountFolowers FROM users WHERE UserPrivateToken="${Videodata[0].OwnerToken}"`;

            const getUserDataResponse = await query(connection, GetOwnerrDataQueryString);
            let UserData = JSON.parse(JSON.stringify(getUserDataResponse));

            if (Object.keys(Videodata).length === 0) {
                return res.status(202).json({ error: false, VideoFound: false });
            }

            res.status(202).json({
                error: false,
                VideoFound: true,
                VideoTitle: Videodata[0].VideoTitle,
                VideoDescription: Videodata[0].VideoDescription,
                PublishDate: Videodata[0].PublishDate,
                OwnerToken: Videodata[0].OwnerToken,
                AccountName: UserData[0].UserName,
                AccountFolowers: UserData[0].AccountFolowers,
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error: true,
            });
        });
};

export default { GetVideoDataByToken };
