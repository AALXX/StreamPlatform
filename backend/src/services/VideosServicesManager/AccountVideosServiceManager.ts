import { Request, Response } from 'express';

import multer from 'multer';
import fs from 'fs';
import FFmpeg from 'fluent-ffmpeg';

import logging from '../../config/logging';
import { connect, query } from '../../config/mysql';
import UtilFunc from '../../util/utilFunctions';

const NAMESPACE = 'AccountUploadServiceManager';

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

let upload = multer({
    storage: storage,
    // fileFilter: fileFilter,
}).single('VideoFile');

//---------------------------------------------------------------------------------
//                                  Account Videos                                |
//---------------------------------------------------------------------------------
const UploadVideoFileToServer = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, 'Posting Video service called');
    upload(req, res, async (err: any) => {
        if (err) {
            return res.status(200).json({
                error: true,
            });
        }

        const VideoToken = UtilFunc.CreateVideoToken();
        //* video file does not exist
        fs.mkdir(`../server/accounts/${req.body.UserPrivateToken}/${VideoToken}`, (err) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                });
            }

            //* Directory Created Succesfully
            fs.rename(`../server/accounts/VideosTmp/${req.file?.originalname}`, `../server/accounts/${req.body.UserPrivateToken}/${VideoToken}/${req.body.VideoTitle}_Source.mp4`, (err) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                    });
                }

                //*File Moved succesfully
                SendVideoDataToDb(req.body.UserPrivateToken, VideoToken, req.body.VideoTitle, req.body.VideoVisibility, async (err: boolean) => {
                    if (err) {
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
};

/**
 * Sends Video Data to Database
 * @param {string} userPrivateToken
 * @param {string} videoToken
 * @param {string} VideoTitle
 * @param {string} VideoVisibility
 * @param {any} callback
 */
const SendVideoDataToDb = (userPrivateToken: string, videoToken: string, VideoTitle: string, VideoVisibility: string, callback: any) => {
    let today = new Date().toISOString().slice(0, 10);
    const SendVidsDatasSqlQuery = `INSERT INTO videos (VideoTitle, Likes, PublishDate, VideoToken, OwnerToken, Visibility)
  VALUES("${VideoTitle}", "0", "${today}","${videoToken}", "${userPrivateToken}", "${VideoVisibility}")`;

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

export default {
    UploadVideoFileToServer,
};
