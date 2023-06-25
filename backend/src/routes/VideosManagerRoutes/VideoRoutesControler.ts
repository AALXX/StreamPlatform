import express from 'express';
import { body } from 'express-validator';
import UploadVideoServices from '../../services/VideosServicesManager/AccountVideosServiceManager';
import ClientVideosServices from '../../services/VideosServicesManager/ClientVideosServiceManager';
const router = express.Router();

router.post('/upload-video', UploadVideoServices.UploadVideoFileToServer);

router.post('/like-dislike-video/', body('UserPublicToken').not().isEmpty().trim(), body('VideoToken').not().isEmpty().trim(), ClientVideosServices.LikeDislikeVideoFunc);
router.get('/get-video-data/:VideoToken/:UserToken', ClientVideosServices.GetVideoDataByToken);
// router.get('/get-random-video-token/', VideoPlayerManager.GetRandomVideoToken);

// router.post('/get-video-comments', VideoCommentsManager.GetVideoComments);
// router.post('/post-comment-to-video', VideoCommentsManager.PostRecivedCommentToDataBase);

export = router;
