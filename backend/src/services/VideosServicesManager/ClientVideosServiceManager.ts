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
const GetVideoDataByToken = async (req: Request, res: Response) => {
    const GetVideoDataByTokenQueryString = `SELECT VideoTitle, VideoDescription, Likes, Dislikes, PublishDate, OwnerToken FROM videos WHERE VideoToken="${req.params.VideoToken}"`;

    try {
        const connection = await connect();
        const getVideoResponse = await query(connection, GetVideoDataByTokenQueryString);

        let Videodata = JSON.parse(JSON.stringify(getVideoResponse));

        const GetOwnerrDataQueryString = `SELECT UserName, AccountFolowers FROM users WHERE UserPrivateToken="${Videodata[0].OwnerToken}"`;

        const getUserDataResponse = await query(connection, GetOwnerrDataQueryString);
        let UserData = JSON.parse(JSON.stringify(getUserDataResponse));

        if (Object.keys(Videodata).length === 0) {
            return res.status(202).json({ error: false, VideoFound: false });
        }

        const itFollows = await UtilFunc.userFollowAccountCheck(req.params.UserToken, Videodata[0].OwnerToken);
        const getuserlikedordislike = await UtilFunc.getUserLikedOrDislikedVideo(req.params.UserToken, req.params.VideoToken);
        res.status(202).json({
            error: false,
            VideoFound: true,
            VideoTitle: Videodata[0].VideoTitle,
            VideoDescription: Videodata[0].VideoDescription,
            PublishDate: Videodata[0].PublishDate,
            OwnerToken: Videodata[0].OwnerToken,
            AccountName: UserData[0].UserName,
            AccountFolowers: UserData[0].AccountFolowers,
            VideoLikes: Videodata[0].Likes,
            VideoDislikes: Videodata[0].Dislikes,
            UserFollwsAccount: itFollows,
            UserLikedOrDislikedVideo: getuserlikedordislike,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

/**
 * Like the video by token
 * @param req
 * @param res
 */
const LikeDislikeVideoFunc = async (req: Request, res: Response) => {
    const checkuserlikedordislike = await UtilFunc.userLikedOrDislikedVideoCheck(req.body.userToken, req.body.videoToken);
    const getkuserlikedordislike = await UtilFunc.getUserLikedOrDislikedVideo(req.body.userToken, req.body.videoToken);

    const connection = await connect();

    if (req.body.likeOrDislike == undefined || req.body.likeOrDislike == null || req.body.userToken == undefined) {
        logging.error(NAMESPACE, 'like or disLiked is undefine or null', 'body request');

        return res.status(500).json({
            error: true,
        });
    }

    try {
        if (checkuserlikedordislike) {
            if (req.body.likeOrDislike === 0) {
                const DeleteSql = `DELETE FROM user_liked_or_disliked_video_class WHERE userToken="${req.body.userToken}" AND videoToken="${req.body.videoToken}";`;
                await query(connection, DeleteSql);

                if (getkuserlikedordislike === 1) {
                    const DeleteLikeDislikeSql = `UPDATE videos SET Likes = Likes-1 WHERE VideoToken="${req.body.videoToken}";`;
                    await query(connection, DeleteLikeDislikeSql);
                }

                if (getkuserlikedordislike === 2) {
                    const DeleteLikeDislikeSql = `UPDATE videos SET Dislikes = Dislikes-1 WHERE VideoToken="${req.body.videoToken}";`;
                    await query(connection, DeleteLikeDislikeSql);
                }
            } else {
                const updateLikeDislikeSql = `UPDATE user_liked_or_disliked_video_class SET like_dislike=${req.body.likeOrDislike} WHERE userToken="${req.body.userToken}" AND videoToken="${req.body.videoToken}";`;
                await query(connection, updateLikeDislikeSql);

                if (req.body.likeOrDislike === 1) {
                    const updateLikeOrDislikeDataSql = `UPDATE videos SET Likes = Likes+1, Dislikes = Dislikes-1 WHERE VideoToken="${req.body.videoToken}";`;
                    await query(connection, updateLikeOrDislikeDataSql);
                }

                if (req.body.likeOrDislike === 2) {
                    const updateLikeOrDislikeDataSql = `UPDATE videos SET Likes = Likes-1, Dislikes = Dislikes+1 WHERE VideoToken="${req.body.videoToken}";`;
                    await query(connection, updateLikeOrDislikeDataSql);
                }
            }
        } else {
            const insertDataSql = `INSERT INTO user_liked_or_disliked_video_class (userToken, videoToken, like_dislike) VALUES ('${req.body.userToken}','${req.body.videoToken}', '${req.body.likeOrDislike}');`;
            await query(connection, insertDataSql);
            if (req.body.likeOrDislike === 1) {
                const updateLikeOrDislikeDataSql = `UPDATE videos SET Likes = Likes+1 WHERE VideoToken="${req.body.videoToken}";`;
                await query(connection, updateLikeOrDislikeDataSql);
            }

            if (req.body.likeOrDislike === 2) {
                    const updateLikeOrDislikeDataSql = `UPDATE videos SET Dislikes = Dislikes+1 WHERE VideoToken="${req.body.videoToken}";`;
                await query(connection, updateLikeOrDislikeDataSql);
            }
        }

        res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
        });
    }
};

export default { GetVideoDataByToken, LikeDislikeVideoFunc };
