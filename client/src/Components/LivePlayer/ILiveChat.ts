import { Socket } from 'socket.io-client';
interface ILiveChatProps {
    UserToken: string | null
    LiveToken: string | null
    ClientSocket: Socket | null
    userLoggedIn?:boolean
}

interface ICommentProps {
    ownerToken: string
    ownerName: string
    message: string
    isStreamer:boolean
    
}

export type { ILiveChatProps, ICommentProps }
