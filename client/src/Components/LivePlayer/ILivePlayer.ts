interface IDasbordLiveDataResponse {
    error: boolean
    LiveTitle: string
    IsLive: boolean
    AccountName: string
    AccountFolowers: number
    LiveLikes: number
    LiveDislikes: number
}

interface IDasbordLiveData {
    error: boolean
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
}

export type { ILiveData, ILivePlayerProps, IDasbordLiveData, IDasbordLiveDataResponse }
