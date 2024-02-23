import { Dispatch, SetStateAction } from 'react'
import { Socket } from 'socket.io-client'

interface IDasbordLiveDataResponse {
    error: boolean
    LiveToken: string
    LiveTitle: string
    IsLive: boolean
    AccountName: string
    AccountFolowers: number
    LiveLikes: number
    LiveDislikes: number
    UserRole: string | null
}

/**
 * Data to display
 */
interface IDasbordLiveData {
    error: boolean
    LiveToken: string
    AccountName: string
    AccountFolowers: number
    LiveLikes: number
    LiveDislikes: number
    UserRole: string | null
}

interface ILiveData {
    error: boolean
    IsLive: boolean
    LiveTitle: string
    OwnerToken: string
    AccountName: string
    AccountFolowers: number
    UserFollwsAccount: boolean
    LiveLikes: number
    LiveDislikes: number
    UserLikedVideo: boolean
    UserLikedOrDislikedLive: { like_or_dislike: number; userLiked: boolean }
    UserRole: string | null
}

interface ILivePlayerProps {
    userStreamToken: string
    socket: Socket
    setChannelToken?: Dispatch<SetStateAction<string>>
    setUserRole?: Dispatch<SetStateAction<string | null>>
}

export type { ILiveData, ILivePlayerProps, IDasbordLiveData, IDasbordLiveDataResponse }
