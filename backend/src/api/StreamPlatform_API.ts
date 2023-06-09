import http from 'http';
import express, { NextFunction } from 'express';

//* imports from route folder
import UserAccountRoutes from '../routes/UserAccount/UserAccountRoutes';
import LiveStreamRoutes from '../routes/LiveStreamRoutes/LiveStreamRoutes';
import VideosRoutes from '../routes/VideosManagerRoutes/VideoRoutesControler';

//* Configs
import config from '../config/config';
import logging from '../config/logging';
const NAMESPACE = 'StreamPlatform_API';
const router = express();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

//* Rules of Api
router.use((req: any, res: any, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'GET POST PATCH DELETE PUT');
        return res.status(200).json({});
    }
    next();
});

//* Routes
router.use('/api/user-account/', UserAccountRoutes);
router.use('/api/live-stream/', LiveStreamRoutes);
router.use('/api/videos-manager/', VideosRoutes);

//* Error Handleling
router.use((req: any, res: any, next: NextFunction) => {
    const error = new Error('not found');

    return res.status(404).json({
        message: error.message,
    });
});

//* Create The Api
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => {
    logging.info(NAMESPACE, `Api is runing on: ${config.server.hostname}:${config.server.port}`);
});
