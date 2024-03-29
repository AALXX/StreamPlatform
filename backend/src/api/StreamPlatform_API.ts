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

const httpServer = http.createServer(router);

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:7556'],
    },
});

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const pool = createPool();

//* Api rules
router.use((req: any, res: any, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    req.pool = pool;
    req.ioServer = io;

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
httpServer.listen(config.server.port, () => {
    logging.info(NAMESPACE, `Api is runing on: ${config.server.hostname}:${config.server.port}`);
});

io.on('connection', (socket) => {
    socket.on('join-live', async ({ LiveToken, UserPrivateToken }) => {
        return LiveServices.JoinLive(pool, io, LiveToken, UserPrivateToken, socket);
    });

    socket.on('send-message', async ({ message, LiveToken, UserPrivateToken, userRole }) => {
        return LiveServices.SendMessage(pool, io, socket, message, LiveToken, UserPrivateToken, userRole);
    });

    socket.on('ban-viewer', ({reason}) => {
        console.log(reason)
        return socket.emit('viewer-banned', { reason: reason });
    });

    socket.on('disconnect', () => {});
});
