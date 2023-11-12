interface IDasbordLiveDataResponse {
    error: boolean
    LiveTitle: string
    IsLive: boolean
    AccountName: string
    AccountFolowers: number
    LiveLikes: number
    LiveDislikes: number
}

interface IDasbordLiveData{
    error: boolean
    AccountName: string
    AccountFolowers: number
    LiveLikes: number
    LiveDislikes: number
}

interface ILiveData {
    error: boolean
    LiveTitle: string
    AccountName: string
    AccountFolowers: number
    UserFollwsAccount: boolean
    VideoLikes: number
    VideoDislikes: number
    UserLikedVideo: boolean
    UserLikedOrDislikedVideo: number
}


interface ILivePlayerProps {
    userToken: string
}

export type { ILiveData, ILivePlayerProps, IDasbordLiveData, IDasbordLiveDataResponse }
