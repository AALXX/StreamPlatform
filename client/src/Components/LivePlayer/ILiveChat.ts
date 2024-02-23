import { Dispatch, SetStateAction } from 'react'
import { Socket } from 'socket.io-client'
interface ILiveChatProps {
    UserToken: string | null
    UserRole: string | null
    LiveToken: string | null
    channelToken: string
    ClientSocket: Socket | null
    userLoggedIn?: boolean
}

interface ICommentProps {
    ownerToken: string
    ownerName: string
    message: string
    commentatorRole: string | null
    viewerRole: string | null
    channelToken: string
    onSelect?: () => void // Callback function to handle click event
}

export type { ILiveChatProps, ICommentProps }
