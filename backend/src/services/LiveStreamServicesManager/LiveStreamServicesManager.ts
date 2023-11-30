import { Request, Response } from 'express';
import { createPool, query } from '../../config/mysql';
import logging from '../../config/logging';
import utilFunctions from '../../util/utilFunctions';
import { validationResult } from 'express-validator';
import { Socket, Server } from 'socket.io';
import { SCYconnect, SCYquery } from '../../config/scylla';

const NAMESPACE = 'LiveStreamService';

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
 * Authentification for recived streamkey
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const LiveStreamAuth = async (req: Request, res: Response) => {
    try {
        const pool = createPool();
        const GetUserDataQueryString = `SELECT StreamKey FROM users WHERE UserPublicToken="${req.body.name}";`;

        const results = await query(pool, GetUserDataQueryString);

        const data = JSON.parse(JSON.stringify(results));

        if (Object.keys(data).length === 0) {
            return res.status(403).send();
        }

        if (data[0].StreamKey == req.body.key) {
            return res.status(200).send();
        }
        return res.status(403).send();
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Get live dashbord data for streamer
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const GetLiveAdminData = async (req: Request, res: Response) => {
    try {
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.params.userPrivateToken);
        const pool = createPool();
        const GetLiveAdminDataQueryString = `
        SELECT s.StreamTitle, s.Likes, s.Dislikes, s.StreamToken, u.UserName, u.AccountFolowers
        FROM users AS u
        LEFT JOIN streams AS s ON s.UserPublicToken = u.UserPublicToken
        WHERE u.UserPublicToken = "${UserPublicToken}";`;

        const results = await query(pool, GetLiveAdminDataQueryString);

        const data = JSON.parse(JSON.stringify(results));
        if (data[0].StreamTitle == null || data[0].Likes == null || data[0].StreamTitle == null) {
            return res.status(200).json({
                error: false,
                IsLive: false,
                LiveToken: '',
                AccountName: data[0].UserName,
                AccountFolowers: data[0].AccountFolowers,
                LiveTitle: 'PlaceHolder',
                LiveLikes: 0,
                LiveDislikes: 0,
            });
        }

        return res.status(200).json({
            error: false,
            IsLive: true,
            LiveToken: data[0].StreamToken,
            AccountName: data[0].UserName,
            AccountFolowers: data[0].AccountFolowers,
            LiveTitle: data[0].StreamTitle,
            LiveLikes: data[0].Likes,
            LiveDislikes: data[0].Dislikes,
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
 * Get Live data for viewr
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const GetLiveData = async (req: Request, res: Response) => {
    try {
        const pool = createPool();

        const GetLiveDataQueryString = `
        SELECT s.StreamTitle, s.Likes, s.Dislikes, s.Active, u.UserName, u.AccountFolowers AS UserAccountFolowers, u.UserPublicToken 
        FROM streams AS s
        LEFT JOIN users AS u ON s.UserPublicToken = u.UserPublicToken
        WHERE s.StreamToken = "${req.params.streamToken}";`;

        const results = await query(pool, GetLiveDataQueryString);
        const userPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.params.userPrivateToken);

        const data = JSON.parse(JSON.stringify(results));
        const itFollows = await utilFunctions.userFollowAccountCheck(req.params.userPrivateToken, data[0].UserPublicToken);
        const getUserLikedOrDisliked = await utilFunctions.getUserLikedOrDislikedStream(String(userPublicToken), req.params.streamToken);

        if (Object.keys(data[0]).length === 0) {
            return res.status(200).json({
                error: false,
                IsLive: false,
                OwnerToken: data[0].UserPublicToken,
                AccountName: data[0].UserName,
                AccountFolowers: data[0].AccountFolowers,
                LiveTitle: 'No Name',
                UserFollwsAccount: false,
                UserLikedOrDislikedLive: { userLiked: false, like_or_dislike: 0 },
                LiveLikes: 0,
                LiveDislikes: 0,
            });
        }
        if (data[0].Active == 0) {
            return res.status(200).json({
                error: false,
                IsLive: false,
                OwnerToken: data[0].UserPublicToken,
                AccountName: data[0].UserName,
                AccountFolowers: data[0].AccountFolowers,
                LiveTitle: 'No Name',
                UserFollwsAccount: false,
                UserLikedOrDislikedLive: { userLiked: false, like_or_dislike: 0 },
                LiveLikes: 0,
                LiveDislikes: 0,
            });
        }

        if (userPublicToken == null) {
            return res.status(200).json({
                error: false,
                IsLive: true,
                AccountName: data[0].UserName,
                AccountFolowers: data[0].AccountFolowers,
                OwnerToken: data[0].UserPublicToken,
                LiveTitle: data[0].StreamTitle,
                LiveLikes: data[0].Likes,
                LiveDislikes: data[0].Dislikes,
                UserFollwsAccount: false,
                UserLikedOrDislikedLive: { userLiked: false, like_or_dislike: 0 },
            });
        }

        return res.status(200).json({
            error: false,
            IsLive: true,
            AccountName: data[0].UserName,
            AccountFolowers: data[0].AccountFolowers,
            OwnerToken: data[0].UserPublicToken,
            LiveTitle: data[0].StreamTitle,
            LiveLikes: data[0].Likes,
            LiveDislikes: data[0].Dislikes,
            UserFollwsAccount: itFollows,
            UserLikedOrDislikedLive: getUserLikedOrDisliked,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, `GET_LIVE_DATA_FUNC ERROR: ${error}`);
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Starts or stops a stream trigered by admin
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const StartStopLive = async (req: Request, res: Response) => {
    try {
        const IsLiveCheck: { isLive: boolean; error: boolean } = await utilFunctions.CheckIfLive(req.body.UserPrivateToken);
        if (IsLiveCheck.error) {
            logging.error(NAMESPACE, 'START_OR_STOP_LIVE_FUNCTION');
            return res.status(202).json({
                error: true,
            });
        }

        if (IsLiveCheck.isLive) {
            const error = await utilFunctions.EndLive(req.body.UserPrivateToken, req.body.StreamToken);
            if (error) {
                return res.status(202).json({
                    error: true,
                });
            }
            return res.status(202).json({
                error: false,
            });
        } else if (IsLiveCheck.isLive === false) {
            const error = await utilFunctions.StartLive(req.body.LiveTitle, req.body.UserPrivateToken);
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
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Like the Live by token
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const LikeDislikeLiveFunc = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('LIKE_OR_DISLIKE_STREAM_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.body.userToken);
    if (UserPublicToken == null) {
        return res.status(202).json({
            error: true,
        });
    }
    const getkuserlikedordislike = await utilFunctions.getUserLikedOrDislikedStream(UserPublicToken as string, req.body.streamToken);
    try {
        const pool = createPool();
        if (getkuserlikedordislike.userLiked) {
            if (req.body.likeOrDislike === 0) {
                const deleteAndUpdateSql = `
                DELETE FROM user_liked_or_disliked_stream_class
                WHERE userToken="${UserPublicToken}" AND StreamToken="${req.body.streamToken}";

                UPDATE streams
                SET
                Likes = Likes - (CASE WHEN ${getkuserlikedordislike.like_or_dislike} = 1 THEN 1 ELSE 0 END),
                Dislikes = Dislikes - (CASE WHEN ${getkuserlikedordislike.like_or_dislike} = 2 THEN 1 ELSE 0 END)
                WHERE StreamToken="${req.body.streamToken}";
`;

                await query(pool, deleteAndUpdateSql);
            } else {
                const updateSql = `
                UPDATE user_liked_or_disliked_stream_class
                SET like_dislike=${req.body.likeOrDislike}
                WHERE userToken="${UserPublicToken}" AND StreamToken="${req.body.streamToken}";

                UPDATE streams
                SET
                Likes = Likes + (CASE WHEN ${req.body.likeOrDislike} = 1 THEN 1 ELSE -1 END),
                Dislikes = Dislikes + (CASE WHEN ${req.body.likeOrDislike} = 2 THEN 1 ELSE -1 END)
                WHERE StreamToken="${req.body.streamToken}" AND Active="1";
                `;

                await query(pool, updateSql);
            }
        } else {
            const insertOrUpdateDataSql = `
            INSERT INTO user_liked_or_disliked_stream_class (userToken, StreamToken, like_dislike)
            VALUES ('${UserPublicToken}', '${req.body.streamToken}', '${req.body.likeOrDislike}')
            ON DUPLICATE KEY UPDATE
            like_dislike = VALUES(like_dislike);

            UPDATE streams
            SET Likes = Likes + (CASE WHEN ${req.body.likeOrDislike} = 1 THEN 1 ELSE 0 END),
            Dislikes = Dislikes + (CASE WHEN ${req.body.likeOrDislike} = 2 THEN 1 ELSE 0 END)
            WHERE StreamToken="${req.body.streamToken}" AND Active="1";
`;

            await query(pool, insertOrUpdateDataSql);
        }
        res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        res.status(202).json({
            error: true,
        });
    }
};

const JoinLive = (LiveToken: string, socket: Socket) => {
    socket.join(LiveToken);
};

const delayBetweenRequests = 2000; // Adjust this to set the delay in milliseconds
const lastMessageTimes = new Map(); // Map to store last message times per socket ID
const SendMessage = async (io: Server, socket: Socket, Message: string, LiveToken: string, UserPrivateToken: string) => {
    const currentTime = Date.now();
    const socketId = socket.id;
    const lastMessageTime = lastMessageTimes.get(socketId) || 0;
    try {
        if (currentTime - lastMessageTime < delayBetweenRequests) {
            const timeToWait = delayBetweenRequests - (currentTime - lastMessageTime);
            console.log(`Too many requests, wait ${timeToWait}ms before sending another message`);
            return;
        } else {
            const pool = createPool();
            await SCYconnect();

            const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(UserPrivateToken);
            if (UserPublicToken === null) {
                return io.to(LiveToken).emit('undefinedToken');
            }
            const GetLiveDataQueryString = `
            SELECT u.UserName, s.UserPublicToken
            FROM users u
            LEFT JOIN streams s ON u.UserPublicToken = s.UserPublicToken AND s.StreamToken = "${LiveToken}"
            WHERE u.UserPublicToken = "${UserPublicToken}";`;

            const results = await query(pool, GetLiveDataQueryString);
            const data = JSON.parse(JSON.stringify(results));
            lastMessageTimes.set(socketId, currentTime);
            await SCYquery(`INSERT INTO LiveMessages (Id, livetoken, OwnerToken, Message, SentAt)
            // VALUES (uuid(), '${LiveToken}','${UserPublicToken}', '${Message}.', toTimestamp(now()));`);
            io.to(LiveToken).emit('recived-message', { message: Message, ownerName: data[0].UserName, ownerToken: UserPublicToken, isStreamer: UserPublicToken == data[0].UserPublicToken });
            return;
        }
    } catch (error) {
        return io.to(LiveToken).emit('Error');
    }
};

const LeaveLive = (LiveToken: string, io: Server) => {
    io.socketsLeave(LiveToken);
    console.log(`Discenect from: ${LiveToken}`);
};

export default {
    LiveStreamAuth,
    GetLiveAdminData,
    StartStopLive,
    GetLiveData,
    LikeDislikeLiveFunc,
    JoinLive,
    SendMessage,
    LeaveLive,
};
