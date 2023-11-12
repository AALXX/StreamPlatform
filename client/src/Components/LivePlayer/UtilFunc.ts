import axios from 'axios'
import { CookieValueTypes } from 'cookies-next'
import { RefObject } from 'react'
import { IDasbordLiveDataResponse } from './ILivePlayer'

//* /////////////////////////////
//*      Live Dashbord Logic   //
//* /////////////////////////////

const getDashbordData = async (userToken: string): Promise<IDasbordLiveDataResponse> => {
    const dashbordData = await axios.get(`${process.env.SERVER_BACKEND}/live-manager/get-live-admin-data/${userToken}`)
    console.log(dashbordData.data)
    return {
        error: dashbordData.data.error,
        IsLive: dashbordData.data.IsLive,
        AccountName: dashbordData.data.AccountName,
        AccountFolowers: dashbordData.data.AccountFolowers,
        LiveTitle: dashbordData.data.LiveTitle,
        LiveLikes: dashbordData.data.LiveLikes,
        LiveDislikes: dashbordData.data.LiveDislikes
    }
}

const startStopLive = async (LiveTitle: string, UserPrivateToken: string, AccountFolowers: number): Promise<boolean> => {
    const resp = await axios.post(`${process.env.SERVER_BACKEND}/live-manager/start-stop-live`, {
        LiveTitle: LiveTitle,
        UserPrivateToken: UserPrivateToken,
        AccountFolowers: AccountFolowers
    })
    return resp.data.error
}

const getLiveData = async (VideoToken: string | null, userToken: string) => {
    const videoData = await axios.get(`${process.env.SERVER_BACKEND}/videos-manager/get-video-data/${VideoToken}/${userToken}`)
    return {
        error: false,
        VideoFound: true,
        VideoTitle: videoData.data.VideoTitle,
        VideoDescription: videoData.data.VideoDescription,
        PublishDate: videoData.data.PublishDate,
        OwnerToken: videoData.data.OwnerToken,
        AccountName: videoData.data.AccountName,
        AccountFolowers: videoData.data.AccountFolowers,
        UserFollwsAccount: videoData.data.UserFollwsAccount,
        VideoLikes: videoData.data.VideoLikes,
        VideoDislikes: videoData.data.VideoDislikes,
        UserLikedVideo: videoData.data.UserLikedVideo,
        UserLikedOrDislikedVideo: videoData.data.UserLikedOrDislikedVideo
    }
}

//* Play/Pause
const playOrPauseVideo = (videoRef: RefObject<HTMLVideoElement>): boolean => {
    if (videoRef?.current?.paused) {
        videoRef?.current?.play()
        return true
    } else {
        videoRef?.current?.pause()
        return false
    }
}

//* volume
const changeVolume = (videoRef: RefObject<HTMLVideoElement>, e: any) => {
    if (videoRef?.current?.volume) {
        videoRef.current.volume = e.target.value
    }

    localStorage.setItem('Volume', e.target.value)
    return e.target.value
}

const followAccount = async (usrToken: CookieValueTypes, ownerToken: string, userFollwsAccount: boolean) => {
    if (usrToken === ownerToken || usrToken == undefined || ownerToken == undefined) {
        return false
    }
    await axios.post(`${process.env.SERVER_BACKEND}/user-account/follow`, { userToken: usrToken, accountToken: ownerToken })
    return !userFollwsAccount
}

const likeVideo = async (usrToken: CookieValueTypes, videoToken: string | null, userLikedVideo: boolean, userDisLikedVideo: boolean) => {
    if (videoToken == null) {
        return false
    }

    if ((!userLikedVideo && !userDisLikedVideo) || (!userLikedVideo && userDisLikedVideo)) {
        await axios.post(`${process.env.SERVER_BACKEND}/videos-manager/like-dislike-video`, { userToken: usrToken, videoToken: videoToken, likeOrDislike: 1 })
    } else if (userLikedVideo) {
        await axios.post(`${process.env.SERVER_BACKEND}/videos-manager/like-dislike-video`, { userToken: usrToken, videoToken: videoToken, likeOrDislike: 0 })
    }

    return !userLikedVideo
}

const dislikeVideo = async (usrToken: CookieValueTypes, videoToken: string | null, userLikedVideo: boolean, userDisLikedVideo: boolean) => {
    if (videoToken == null) {
        return false
    }

    if ((!userLikedVideo && !userDisLikedVideo) || (userLikedVideo && !userDisLikedVideo)) {
        await axios.post(`${process.env.SERVER_BACKEND}/videos-manager/like-dislike-video`, { userToken: usrToken, videoToken: videoToken, likeOrDislike: 2 })
    } else if (userDisLikedVideo) {
        await axios.post(`${process.env.SERVER_BACKEND}/videos-manager/like-dislike-video`, { userToken: usrToken, videoToken: videoToken, likeOrDislike: 0 })
    }

    return !userDisLikedVideo
}

export { getLiveData, playOrPauseVideo, changeVolume, followAccount, likeVideo, dislikeVideo, getDashbordData, startStopLive }
