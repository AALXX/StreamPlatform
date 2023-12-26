import { Socket } from 'socket.io-client';

interface IDasbordLiveDataResponse {
    error: boolean
    LiveToken: string
    LiveTitle: string
    IsLive: boolean
    AccountName: string
    AccountFolowers: number
    LiveLikes: number
    LiveDislikes: number
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
}

interface ILivePlayerProps {
    userStreamToken: string
    socket:Socket
}

export type { ILiveData, ILivePlayerProps, IDasbordLiveData, IDasbordLiveDataResponse }
