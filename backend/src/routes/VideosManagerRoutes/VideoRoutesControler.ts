import express from 'express';
import { body, param } from 'express-validator';
import UploadVideoServices from '../../services/VideosServicesManager/AccountVideosServiceManager';
import ClientVideosServices from '../../services/VideosServicesManager/ClientVideosServiceManager';
const router = express.Router();

router.post('/upload-video', UploadVideoServices.UploadVideoFileToServer);

router.post('/like-dislike-video/', body('UserPublicToken').not().isEmpty().trim(), body('VideoToken').not().isEmpty().trim(), ClientVideosServices.LikeDislikeVideoFunc);
router.get('/get-video-data/:VideoToken/:UserToken', param('VideoToken').not().isEmpty(), param('UserToken').not().isEmpty(), ClientVideosServices.GetVideoDataByToken);
// router.get('/get-random-video-token/', VideoPlayerManager.GetRandomVideoToken);

router.get('/get-video-comments/:videoToken', param('videoToken').not().isEmpty(), ClientVideosServices.GetVideoComments);
router.post('/post-comment', body('UserToken').not().isEmpty(), body('VideoToken').not().isEmpty(), body('Comment').not().isEmpty(), ClientVideosServices.PostCommentToVideo);
router.post('/delete-comment', body('UserToken').not().isEmpty(), body('VideoToken').not().isEmpty(), ClientVideosServices.PostCommentToVideo);

export = router;
