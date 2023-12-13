import { Response } from 'express';
import { validationResult } from 'express-validator';
import logging from '../../config/logging';
import { CustomRequest, createPool, query } from '../../config/mysql';
import UtilFunc from '../../util/utilFunctions';
import utilFunctions from '../../util/utilFunctions';
import axios from 'axios';

const NAMESPACE = 'ClientVideosServiceManager';

/**
 * Validates and cleans the CustomRequest form
 */
const CustomRequestValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            errorMsg: error.msg,
        };
    },
});

interface IVideoCommentsToBeSendType {
    id: number;
    ownerToken: string;
    videoToken: string;
    comment: string;
    ownerName: string;
}
interface ISearchVideoCards {
    VideoTitle: string;
    VideoToken: string;
    OwnerName: string;
    OwnerToken: string;
}

/**
 *Gets Data About Video from db
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetVideoDataByToken = async (req: CustomRequest, res: Response) => {
    const GetVideoDataByTokenQueryString = `SELECT VideoTitle, VideoDescription, Likes, Dislikes, PublishDate, OwnerToken FROM videos WHERE VideoToken="${req.params.VideoToken}"`;
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_VIDEO_DATA_BY_TOKEN_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        // const pool = await connect();
        const getVideoResponse = await query(connection, GetVideoDataByTokenQueryString);
        let Videodata = JSON.parse(JSON.stringify(getVideoResponse));

        const GetOwnerrDataQueryString = `SELECT UserName, AccountFolowers FROM users WHERE UserPublicToken="${Videodata[0].OwnerToken}"`;

        // const getUserDataResponse = await query(pool, GetOwnerrDataQueryString);
        const getUserDataResponse = await query(connection, GetOwnerrDataQueryString);

        let UserData = JSON.parse(JSON.stringify(getUserDataResponse));
        if (Object.keys(Videodata).length === 0) {
            return res.status(202).json({ error: false, VideoFound: false });
        }
        const itFollows = await UtilFunc.userFollowAccountCheck(req.pool!, req.params.UserPublicToken, Videodata[0].OwnerToken);
        const getuserlikedordislike = await UtilFunc.getUserLikedOrDislikedVideo(req.pool!, req.params.UserPublicToken, req.params.VideoToken);

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
        logging.error(NAMESPACE, error.message, error);

        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

/**
 * Like the video by token
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const LikeDislikeVideoFunc = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('LIKE_OR_DISLIKE_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const getkuserlikedordislike = await UtilFunc.getUserLikedOrDislikedVideo(req.pool!, req.body.userToken, req.body.videoToken);

    try {
        const connection = await req.pool?.promise().getConnection();

        if (getkuserlikedordislike.userLiked) {
            if (req.body.likeOrDislike === 0) {
                const deleteAndUpdateSql = `
                DELETE FROM user_liked_or_disliked_video_class
                WHERE userToken="${req.body.userToken}" AND videoToken="${req.body.videoToken}";

                UPDATE videos
                SET
                Likes = Likes - (CASE WHEN ${getkuserlikedordislike.like_or_dislike} = 1 THEN 1 ELSE 0 END),
                Dislikes = Dislikes - (CASE WHEN ${getkuserlikedordislike.like_or_dislike} = 2 THEN 1 ELSE 0 END)
                WHERE VideoToken = "${req.body.videoToken}";
`;

                await query(connection, deleteAndUpdateSql);
            } else {
                const updateSql = `
                UPDATE user_liked_or_disliked_video_class
                SET like_dislike=${req.body.likeOrDislike}
                WHERE userToken="${req.body.userToken}" AND videoToken="${req.body.videoToken}";
            
                UPDATE videos
                SET
                    Likes = Likes + (CASE WHEN ${req.body.likeOrDislike} = 1 THEN 1 ELSE -1 END),
                    Dislikes = Dislikes + (CASE WHEN ${req.body.likeOrDislike} = 2 THEN 1 ELSE -1 END)
                WHERE VideoToken="${req.body.videoToken}";
`;

                await query(connection, updateSql);
            }
        } else {
            const insertOrUpdateDataSql = `
            INSERT INTO user_liked_or_disliked_video_class (userToken, videoToken, like_dislike)
            VALUES ('${req.body.userToken}', '${req.body.videoToken}', '${req.body.likeOrDislike}')
            ON DUPLICATE KEY UPDATE
            like_dislike = VALUES(like_dislike);
        
            UPDATE videos
            SET Likes = Likes + (CASE WHEN ${req.body.likeOrDislike} = 1 THEN 1 ELSE 0 END),
            Dislikes = Dislikes + (CASE WHEN ${req.body.likeOrDislike} = 2 THEN 1 ELSE 0 END)
            WHERE VideoToken = "${req.body.videoToken}";
`;

            await query(connection, insertOrUpdateDataSql);
        }
        res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);

        res.status(202).json({
            error: true,
        });
    }
};

/**
 * post comment to a video
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const PostCommentToVideo = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('POST_COMMENT_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();

        let ownerToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.body.UserToken);
        if (ownerToken == null) {
            return res.status(200).json({
                error: true,
            });
        }

        const PostCommentSQL = `INSERT INTO comments (ownerToken, videoToken, comment) VALUES ("${ownerToken}","${req.body.VideoToken}","${req.body.Comment}"); SELECT UserName FROM users WHERE UserPublicToken="${ownerToken}";`;
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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const DeleteComment = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('DELETE_COMMENT_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const connection = await req.pool?.promise().getConnection();

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
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetVideoComments = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('POST_COMMENT_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();

        const GetVideoCommentsSQL = `SELECT * FROM comments WHERE videoToken="${req.params.videoToken}"`;
        const getVideoComments = await query(connection, GetVideoCommentsSQL);

        let VideoComments = JSON.parse(JSON.stringify(getVideoComments));
        let VideoCommentsToBeSend: Array<IVideoCommentsToBeSendType> = [];

        for (const comment in VideoComments) {
            if (Object.prototype.hasOwnProperty.call(VideoComments, comment)) {
                const GetOwnerNameSQL = `SELECT UserName FROM users WHERE UserPublicToken="${VideoComments[comment].ownerToken}"`;
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

        return res.status(202).json({
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

/**
 * Search a video
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const SearchVideo = async (req: CustomRequest, res: Response) => {
    const NAMESPACE = 'SEARCH_VIDEO_FUNC';
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error(NAMESPACE, error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }
    try {
        const connection = await req.pool?.promise().getConnection();

        const video_search_server_resp = await axios.get(`${process.env.SEARCH_SERVER}/search/${req.params.search_query}`);
        if (video_search_server_resp.data.error === true) {
            res.status(202).json({
                error: true,
            });
        }
        // console.log(video_search_server_resp.data);
        let videos: ISearchVideoCards[] = [];
        for (const video in video_search_server_resp.data.videoSearchedResults) {
            if (Object.prototype.hasOwnProperty.call(video_search_server_resp.data.videoSearchedResults, video)) {
                const videoData = video_search_server_resp.data.videoSearchedResults[video];
                const GetVideoDataSqlQuery = `SELECT VideoTitle, OwnerToken, u.UserName FROM videos v JOIN users u ON v.OwnerToken = u.UserPublicToken WHERE VideoToken="${videoData.VideoToken}" `;
                const getVideoData = await query(connection, GetVideoDataSqlQuery);
                let resp = JSON.parse(JSON.stringify(getVideoData));
                videos.push({ OwnerName: resp[0].UserName, VideoTitle: resp[0].VideoTitle, OwnerToken: resp[0].OwnerToken, VideoToken: videoData.VideoToken });
            }
        }

        return res.status(202).json({
            error: false,
            Videos: videos,
        });
    } catch (error: any) {
        console.log(error);
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.msg,
        });
    }
};

export default { GetVideoDataByToken, LikeDislikeVideoFunc, GetVideoComments, PostCommentToVideo, DeleteComment, SearchVideo };
