import { Request, Response } from 'express';
import { connect, query } from '../../config/mysql';
import logging from '../../config/logging';
import utilFunctions from '../../util/utilFunctions';

const NAMESPACE = 'LiveStreamService';

const LiveStreamAuth = async (req: Request, res: Response) => {
    try {
        const connection = await connect();
        const GetUserDataQueryString = `SELECT StreamKey FROM users WHERE UserPublicToken="${req.body.name}";`;

        const results = await query(connection, GetUserDataQueryString);

        const data = JSON.parse(JSON.stringify(results));

        if (Object.keys(data).length === 0) {
            return res.status(403).send();
        }

        if (data[0].StreamKey == req.body.key) {
            return res.status(200).send();
        }
        return res.status(403).send();
    } catch (error: any) {
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

const GetLiveAdminData = async (req: Request, res: Response) => {
    try {
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.params.userPrivateToken);
        const connection = await connect();
        const GetLiveAdminDataQueryString = `SELECT StreamTitle, Likes, Dislikes, AccountFolowers FROM streams WHERE UserPublicToken="${UserPublicToken}"; SELECT UserName, AccountFolowers FROM users WHERE UserPublicToken="${UserPublicToken}"`;

        const results = await query(connection, GetLiveAdminDataQueryString);

        const data = JSON.parse(JSON.stringify(results));

        if (Object.keys(data[0]).length === 0) {
            return res.status(200).json({
                error: false,
                IsLive: false,
                AccountName: data[1][0].UserName,
                AccountFolowers: data[1][0].AccountFolowers,
                LiveTitle: 'PlaceHolder',
                LiveLikes: 0,
                LiveDislikes: 0,
            });
        }

        return res.status(200).json({
            error: false,
            IsLive: true,
            AccountName: data[1][0].UserName,
            AccountFolowers: data[1][0].AccountFolowers,
            LiveTitle: data[0][0].StreamTitle,
            LiveLikes: data[0][0].LiveLikes,
            LiveDislikes: data[0][0].LiveDislikes,
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

const StartStopLive = async (req: Request, res: Response) => {
    const NAMESPACE = 'START_OR_STOP_LIVE_FUNCTION';
    try {
        const IsLiveCheck: { isLive: boolean; error: boolean } = await utilFunctions.CheckIfLive(req.body.UserPrivateToken);
        if (IsLiveCheck.error) {
            logging.error(NAMESPACE, 'is user live error');
            return res.status(202).json({
                error: true,
            });
        }

        if (IsLiveCheck.isLive) {
            const error = await utilFunctions.EndLive(req.body.UserPrivateToken);
            if (error) {
                return res.status(202).json({
                    error: true,
                });
            }
            return res.status(202).json({
                error: false,
            });
        } else if (IsLiveCheck.isLive === false) {
            const error = await utilFunctions.StartLive(req.body.LiveTitle, req.body.AccountFolowers, req.body.UserPrivateToken);
            if (error) {
                return res.status(202).json({
                    error: true,
                });
            }

            return res.status(202).json({
                error: false,
            });
        }
        
        return res.status(202).json({
            error: true,
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

export default {
    LiveStreamAuth,
    GetLiveAdminData,
    StartStopLive,
};
