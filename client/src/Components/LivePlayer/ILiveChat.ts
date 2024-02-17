import { Socket } from 'socket.io-client'
interface ILiveChatProps {
    UserToken: string | null
    UserRole: string | null
    LiveToken: string | null
    ClientSocket: Socket | null
    userLoggedIn?: boolean
}

interface ICommentProps {
    ownerToken: string
    ownerName: string
    message: string
    commentatorRole: string | null
    viewerRole: string | null
}

export type { ILiveChatProps, ICommentProps }
