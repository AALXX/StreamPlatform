import { Request, Response } from 'express';

import multer from 'multer';
import fs from 'fs';
import FFmpeg from 'fluent-ffmpeg';

import logging from '../../config/logging';
import { connect, query } from '../../config/mysql';
import UtilFunc from '../../util/utilFunctions';
import axios from 'axios';
import utilFunctions from '../../util/utilFunctions';
import { validationResult } from 'express-validator';

const NAMESPACE = 'AccountUploadServiceManager';

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
 * file storage
 */
const storage = multer.diskStorage({
    destination: (req: Request, file: any, callback: any) => {
        callback(null, '../server/accounts/VideosTmp');
    },

    filename: (req: Request, file, cb: any) => {
        cb(null, `${file.originalname}`);
    },
});

const fileFilter = (req: Request, file: any, cb: any) => {
    // reject all files except jpeg
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

let videoUpload = multer({
    storage: storage,
    // fileFilter: fileFilter,
}).fields([
    {
        name: 'VideoFile',
        maxCount: 1,
    },
    {
        name: 'VideoThumbnail',
        maxCount: 1,
    },
]);

let thumbnailUpload = multer({
    storage: storage,
    // fileFilter: fileFilter,
}).fields([
    {
        name: 'VideoThumbnail',
        maxCount: 1,
    },
]);


/**
 * Uploads video file to video server
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const UploadVideoFileToServer = async (req: any, res: Response) => {
    logging.info(NAMESPACE, 'Posting Video service called');

    videoUpload(req, res, async (err: any) => {
        if (err) {
            return res.status(200).json({
                error: true,
            });
        }

        let userPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.body.UserPrivateToken);
        if (userPublicToken == null) {
            return res.status(200).json({
                error: true,
            });
        }

        const VideoToken = UtilFunc.CreateVideoToken();
        //* video file does not exist
        fs.mkdir(`../server/accounts/${userPublicToken}/${VideoToken}`, (err) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                });
            }

            //* Directory Created Succesfully
            fs.rename(`../server/accounts/VideosTmp/${req.files['VideoFile'][0].originalname}`, `../server/accounts/${userPublicToken}/${VideoToken}/Source.mp4`, async (err) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                    });
                }

                fs.rename(`../server/accounts/VideosTmp/${req.files['VideoThumbnail'][0].originalname}`, `../server/accounts/${userPublicToken}/${VideoToken}/Thumbnail_image.jpg`, async (err) => {
                    if (err) {
                        return res.status(200).json({
                            error: true,
                        });
                    }
                    //*Save video data to db
                    SendVideoDataToDb(userPublicToken as string, VideoToken, req.body.VideoTitle, req.body.VideoVisibility, async (err: boolean) => {
                        if (err) {
                            return res.status(200).json({
                                error: true,
                            });
                        }

                        await ThumbnailProceesor(`../server/accounts/${userPublicToken}/${VideoToken}/Thumbnail_image.jpg`);

                        const file = fs.readFileSync(`../server/accounts/${userPublicToken}/${VideoToken}/Source.mp4`);

                        // Encode the binary data as Base64
                        const base64Video = Buffer.from(file).toString('base64');

                        const formData = new FormData();
                        formData.append('file', base64Video);
                        formData.append('video_name', `${req.body.VideoTitle}.mp4`);

                        const video_category_server_resp = await axios.post(`http://localhost:6200/api/get-video-category`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        if (video_category_server_resp.data.error == true) {
                            return res.status(200).json({
                                error: true,
                            });
                        }

                        const vide_index_server_resp = await axios.post(`http://localhost:7300/api/index-video`, {
                            VideoTitle: req.body.VideoTitle,
                            VideoToken: VideoToken,
                            VideoVisibility: req.body.VideoVisibility,
                            OwnerPrivateToken: req.body.UserPrivateToken,
                        });

                        if (vide_index_server_resp.data.error == true) {
                            return res.status(200).json({
                                error: true,
                            });
                        }

                        if ((await SendVideoCategoryToDb(VideoToken, video_category_server_resp.data.video_type)) == false) {
                            return res.status(200).json({
                                error: true,
                            });
                        }

                        // * Creates a 720p and 480p variant of the video
                        // await VideoProceesor(`${req.body.VideoTitle}`, `../server/accounts/${req.body.UserPrivateToken}/${VideoToken}/${req.body.VideoTitle}_Source.mp4`, '1280x720').then(async () => {
                        //     await VideoProceesor(`${req.body.VideoTitle}`, `../videos/${VideoToken}/${req.body.VideoTitle}_Source.mp4`, '480x360').then(() => {});
                        // });

                        return res.status(200).json({
                            error: false,
                        });
                    });
                });
            });
        });
    });
};

/**
 * Sends Video Data to Database
 * @param {string} userPublicToken
 * @param {string} videoToken
 * @param {string} VideoTitle
 * @param {string} VideoVisibility
 * @param {any} callback
 */
const SendVideoDataToDb = (userPublicToken: string, videoToken: string, VideoTitle: string, VideoVisibility: string, callback: any) => {
    let today = new Date().toISOString().slice(0, 10);
    const SendVidsDatasSqlQuery = `INSERT INTO videos (VideoTitle, Likes, PublishDate, VideoToken, OwnerToken, Visibility)
  VALUES("${VideoTitle}", "0", "${today}","${videoToken}", "${userPublicToken}", "${VideoVisibility}")`;

    connect()
        .then((connection) => {
            query(connection, SendVidsDatasSqlQuery)
                .then(() => {
                    return callback(false);
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);
                })
                .finally(() => {
                    connection.end();
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
        });
};

/**
 * Sends Video Category to Database
 * @param {string} userPrivateToken
 * @param {string} videoToken
 * @param {string} VideoTitle
 * @param {string} VideoVisibility
 * @param {any} callback
 */
const SendVideoCategoryToDb = async (videoToken: string, CategoryId: string) => {
    try {
        const connection = await connect();

        const sendVideoCategoryToDbSQl = `INSERT INTO videos_categoriy_alloc (videoToken, CategoryId) VALUES ('${videoToken}','${CategoryId}')`;
        const data = await query(connection, sendVideoCategoryToDbSQl);

        let accData = JSON.parse(JSON.stringify(data));

        if (Object.keys(accData).length === 0) {
            return false;
        }

        return true;
    } catch (error: any) {
        return false;
    }
};

/**
 * Processes and make all thumbnails 626x325
 * @param {string} path 
 */
const ThumbnailProceesor = async (path: string) =>
    new Promise((resolve, reject) => {
        FFmpeg(path)
            .size(`626x352`)
            .on('end', () => {
                console.log('Image resizing complete');
                resolve({ error: false });
            })
            .on('error', (err) => {
                console.error('Error:', err);
                reject(err);
            })
            .save(path)
            .run();
    });

/**
 * Processes every video intto specified size 
 * @param {string} Title 
 * @param {string} path 
 * @param {string} VideoSize 
 */
const VideoProceesor = async (Title: string, path: string, VideoSize: string) =>
    new Promise((resolve, reject) => {
        FFmpeg(path)
            .videoCodec('libx264')
            .audioCodec('libmp3lame')
            .on('progress', (progress) => {
                console.log('Processing: ' + progress.timemark);
            })
            .size(VideoSize)
            .on('error', (err) => {
                reject(err);
            })
            .save(`/${Title}/${Title}_${VideoSize}.mp4`)
            .on('end', () => {
                resolve({ error: false });
            });
    });

/**
 * get creator video data
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const GetCreatorVideoData = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_CREATOR_VIDEO_DATA_BY_TOKEN_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const GetVideoDataQueryString = `SELECT VideoTitle, OwnerToken, Likes, Dislikes, PublishDate, Visibility, ShowComments, ShowLikesDislikes FROM videos WHERE VideoToken="${req.params.VideoToken}"`;
    try {
        const connection = await connect();
        const getVideoResponse = await query(connection, GetVideoDataQueryString);

        let Videodata = JSON.parse(JSON.stringify(getVideoResponse));
        if (Object.keys(Videodata).length === 0) {
            return res.status(202).json({
                error: true,
            });
        }

        return res.status(202).json({
            error: false,
            VideoTitle: Videodata[0].VideoTitle,
            PublishDate: Videodata[0].PublishDate,
            VideoVisibility: Videodata[0].Visibility,
            VideoLikes: Videodata[0].Likes,
            OwnerToken: Videodata[0].OwnerToken,
            VideoDislikes: Videodata[0].Dislikes,
            ShowComments: Videodata[0].ShowComments === 0 ? false : Videodata[0].ShowComments === 1 ? true : undefined,
            ShowLikesDislikes: Videodata[0].ShowLikesDislikes === 0 ? false : Videodata[0].ShowLikesDislikes === 1 ? true : undefined,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};


/**
 * update creator video data
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const UpdateCreatorVideoData = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_CREATOR_VIDEO_DATA_BY_TOKEN_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }
    try {
        const UserPublicToken = await UtilFunc.getUserPublicTokenFromPrivateToken(req.body.UserPrivateToken);

        const showCommentsConversion = req.body.ShowComments === true ? 1 : 0;
        const showLikesDislikesConversion = req.body.ShowLikesDislikes === true ? 1 : 0;

        const connection = await connect();
        const GetVideoDataQueryString = `UPDATE videos SET VideoTitle="${req.body.VideoTitle}", Visibility="${req.body.VideoVisibility}", ShowComments="${showCommentsConversion}", ShowLikesDislikes="${showLikesDislikesConversion}" WHERE VideoToken="${req.body.VideoToken}" AND  OwnerToken="${UserPublicToken}";`;
        const getVideoResponse = await query(connection, GetVideoDataQueryString);

        let Videodata = JSON.parse(JSON.stringify(getVideoResponse));
        const video_index_server_resp = await axios.post(`http://localhost:7300/api/update-indexed-video`, {
            VideoTitle: req.body.VideoTitle,
            VideoToken: req.body.VideoToken,
            VideoVisibility: req.body.VideoVisibility,
            UserPrivateToken: req.body.UserPrivateToken,
        });

        if (video_index_server_resp.data.error === true) {
            res.status(202).json({
                error: true,
            });
        }

        if (Videodata.affectedRows === 0) {
            res.status(202).json({
                error: true,
            });
        }

        res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

/**
 * delete creator video
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const DeleteCreatorVideoData = async (req: Request, res: Response) => {
    const errors = RequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_CREATOR_VIDEO_DATA_BY_TOKEN_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await connect();
        let ownerToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.body.UserPrivateToken);
        if (ownerToken == null) {
            return res.status(200).json({
                error: true,
            });
        }

        const video_index_server_resp = await axios.post(`http://localhost:7300/api/delete-indexed-video`, {
            VideoTitle: req.body.VideoTitle,
            VideoToken: req.body.VideoToken,
            UserPrivateToken: req.body.UserPrivateToken,
            VideoVisibility: req.body.VideoVisibility,
        });

        if (video_index_server_resp.data.error === true) {
            logging.error(NAMESPACE, 'SEARCH_SERVER_ERROR');
            return res.status(202).json({
                error: true,
            });
        }

        const GetVideoDataQueryString = `DELETE FROM videos WHERE VideoToken="${req.body.VideoToken}" AND OwnerToken="${ownerToken}"`;

        const getVideoResponse = await query(connection, GetVideoDataQueryString);

        let resp = JSON.parse(JSON.stringify(getVideoResponse));
        if (Object.keys(resp).length === 0) {
            return res.status(202).json({
                error: true,
            });
        }

        const userPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.body.UserPrivateToken);

        fs.stat(`../server/accounts/${userPublicToken}/${req.body.VideoToken}/`, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log(`File does not exist: ${req.body.VideoToken}`);
                    return res.status(202).json({
                        error: true,
                    });
                } else {
                    console.error(`Error checking file: ${err}`);
                    return res.status(202).json({
                        error: true,
                    });
                }
            } else {
                console.log('CUM');
                // utilFunctions.RemoveDirectory(`../server/accounts/${userPublicToken}/${req.body.VideoToken}/`);
                return res.status(202).json({
                    error: false,
                });
            }
        });

        return res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, `ERRRO: ${error.message}`);

        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

/**
 * Change Video Thumbnail
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
const ChangeVideoThumbnail = async (req: any, res: Response) => {
    thumbnailUpload(req, res, async (err: any) => {
        if (err) {
            return res.status(200).json({
                error: true,
            });
        }
        let userPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.body.UserPrivateToken);
        if (userPublicToken == null) {
            return res.status(200).json({
                error: true,
            });
        }
        console.log(userPublicToken);

        fs.rename(`../server/accounts/VideosTmp/${req.files['VideoThumbnail'][0].originalname}`, `../server/accounts/${userPublicToken}/${req.body.VideoToken}/Thumbnail_image.jpg`, async (err) => {
            if (err) {
                console.log(err);
                return res.status(200).json({
                    error: true,
                });
            }

            await ThumbnailProceesor(`../server/accounts/${userPublicToken}/${req.body.VideoToken}/Thumbnail_image.jpg`);

            return res.status(200).json({
                error: false,
            });
        });
    });
};

export default {
    UploadVideoFileToServer,
    GetCreatorVideoData,
    UpdateCreatorVideoData,
    DeleteCreatorVideoData,
    ChangeVideoThumbnail,
};
