import http from 'http';
import express, { NextFunction } from 'express';

//* imports from route folder
import UserAccountRoutes from '../routes/UserAccount/UserAccountRoutes';
import LiveStreamRoutes from '../routes/LiveStreamRoutes/LiveStreamRoutes';
import LiveServices from '../services/LiveStreamServicesManager/LiveStreamServicesManager';
import VideosRoutes from '../routes/VideosManagerRoutes/VideoRoutesControler';
import { Server } from 'socket.io';

//* Configs
import config from '../config/config';
import logging from '../config/logging';
import { createPool } from '../config/mysql';

const NAMESPACE = 'StreamPlatform_API';
const router = express();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const pool = createPool();

//* Api rules
router.use((req: any, res: any, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    req.pool = pool;

    if (req.method == 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'GET POST PATCH DELETE PUT');
        return res.status(200).json({});
    }
    next();
});

//* Routes
router.use('/api/user-account/', UserAccountRoutes);
router.use('/api/videos-manager/', VideosRoutes);
router.use('/api/live-manager/', LiveStreamRoutes);

//* Error Handleling
router.use((req: express.Request, res: any, next: NextFunction) => {
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

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000'],
    },
});

io.on('connection', (socket) => {
    socket.on('join-live', async ({ LiveToken, test, UserPublicToken }) => {
        return LiveServices.JoinLive(pool, io, LiveToken, UserPublicToken, socket);
    });

    socket.on('send-message', async ({ message, LiveToken, UserPrivateToken }) => {
        return LiveServices.SendMessage(pool, io, socket, message, LiveToken, UserPrivateToken);
    });

    socket.on('disconnect', () => {});
});
