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

interface VideoCommentsToBeSendType {
    id: number;
    ownerToken: string;
    videoToken: string;
    comment: string;
    ownerName: string;
}

/**
 ** Gets Data About Video from db
 * @param req
 * @param res
 */
const GetVideoDataByToken = async (req: Request, res: Response) => {
    const GetVideoDataByTokenQueryString = `SELECT VideoTitle, VideoDescription, Likes, Dislikes, PublishDate, OwnerToken FROM videos WHERE VideoToken="${req.params.VideoToken}"`;

    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_VIDEO_DATA_BY_TOKEN_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

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
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('LIKE_OR_DISLIKE_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const checkuserlikedordislike = await UtilFunc.userLikedOrDislikedVideoCheck(req.body.userToken, req.body.videoToken);
    const getkuserlikedordislike = await UtilFunc.getUserLikedOrDislikedVideo(req.body.userToken, req.body.videoToken);

    const connection = await connect();

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

/**
 * post comment to a video
 * @param req
 * @param res
 */
const PostCommentToVideo = async (req: Request, res: Response) => {
    console.log('first');
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('POST_COMMENT_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const connection = await connect();

    try {
        const PostCommentSQL = `INSERT INTO comments (ownerToken, videoToken, comment) VALUES ("${req.body.UserToken}","${req.body.VideoToken}","${req.body.Comment}"); SELECT UserName FROM users WHERE UserPrivateToken="${req.body.UserToken}";`;
        const resData = await query(connection, PostCommentSQL);

        let userName = JSON.parse(JSON.stringify(resData));
        res.status(202).json({
            error: false,
            userName: userName[1][0].UserName,
        });
    } catch (error: any) {
        logging.error('POST_COMMENT_FUNC', error.message);
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * delete comment to a video
 * @param req
 * @param res
 */
const DeleteComment = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('DELETE_COMMENT_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const connection = await connect();

    try {
        const PostCommentSQL = `DELETE FROM comments WHERE userToken="${req.body.UserToken}" AND videoToken="${req.body.VideoToken}"`;
        await query(connection, PostCommentSQL);
        res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
            errmsg: error.msg,
        });
    }
};

/**
 * get comment from a video
 * @param req
 * @param res
 */
const GetVideoComments = async (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('POST_COMMENT_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const connection = await connect();

    try {
        const GetVideoCommentsSQL = `SELECT * FROM comments WHERE videoToken="${req.params.videoToken}"`;
        const getVideoComments = await query(connection, GetVideoCommentsSQL);

        let VideoComments = JSON.parse(JSON.stringify(getVideoComments));

        let VideoCommentsToBeSend: Array<VideoCommentsToBeSendType> = [];

        for (const comment in VideoComments) {
            if (Object.prototype.hasOwnProperty.call(VideoComments, comment)) {
                const GetOwnerNameSQL = `SELECT UserName FROM users WHERE UserPrivateToken="${VideoComments[comment].ownerToken}"`;
                const ownerNameData = await query(connection, GetOwnerNameSQL);
                let ownerName = JSON.parse(JSON.stringify(ownerNameData));

                VideoCommentsToBeSend.push({
                    id: VideoComments[comment].id,
                    ownerToken: VideoComments[comment].ownerToken,
                    videoToken: VideoComments[comment].videoToken,
                    comment: VideoComments[comment].comment,
                    ownerName: ownerName[0].UserName,
                });
            }
        }

        if (Object.keys(VideoCommentsToBeSend).length === 0) {
            return res.status(202).json({ error: false, CommentsFound: false });
        }
        res.status(202).json({
            error: false,
            comments: VideoCommentsToBeSend,
            CommentsFound: true,
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
            errmsg: error.msg,
        });
    }
};

export default { GetVideoDataByToken, LikeDislikeVideoFunc, GetVideoComments, PostCommentToVideo, DeleteComment };
