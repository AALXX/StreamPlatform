import axios from 'axios'
import { CookieValueTypes } from 'cookies-next'
import { RefObject } from 'react'
import { IDasbordLiveDataResponse, ILiveData } from './ILivePlayer'

//* /////////////////////////////
//*      Live Dashbord Logic   //
//* /////////////////////////////

const getDashbordData = async (userToken: string): Promise<IDasbordLiveDataResponse> => {
    const dashbordData = await axios.get(`${process.env.SERVER_BACKEND}/live-manager/get-live-admin-data/${userToken}`)
    return {
        error: dashbordData.data.error,
        LiveToken: dashbordData.data.LiveToken,
        IsLive: dashbordData.data.IsLive,
        AccountName: dashbordData.data.AccountName,
        AccountFolowers: dashbordData.data.AccountFolowers,
        LiveTitle: dashbordData.data.LiveTitle,
        LiveLikes: dashbordData.data.LiveLikes,
        LiveDislikes: dashbordData.data.LiveDislikes,
        UserRole: dashbordData.data.UserRole,
    }
}

const getLiveData = async (useroken: string, StreamToken: string): Promise<ILiveData> => {
    const livedData = await axios.get(`${process.env.SERVER_BACKEND}/live-manager/get-live-data/${StreamToken}/${useroken}`)
    return {
        error: livedData.data.error,
        IsLive: livedData.data.IsLive,
        AccountName: livedData.data.AccountName,
        AccountFolowers: livedData.data.AccountFolowers,
        LiveTitle: livedData.data.LiveTitle,
        LiveLikes: livedData.data.LiveLikes,
        UserFollwsAccount: livedData.data.UserFollwsAccount,
        OwnerToken: livedData.data.OwnerToken,
        LiveDislikes: livedData.data.LiveDislikes,
        UserLikedVideo: livedData.data.UserLikedVideo,
        UserLikedOrDislikedLive: livedData.data.UserLikedOrDislikedLive,
        UserRole: livedData.data.UserRole,
    }
}

const startStopLive = async (LiveTitle: string, UserPrivateToken: string, AccountFolowers: number, LiveToken: string): Promise<string> => {
    const resp = await axios.post(`${process.env.SERVER_BACKEND}/live-manager/start-stop-live`, {
        LiveTitle: LiveTitle,
        UserPrivateToken: UserPrivateToken,
        AccountFolowers: AccountFolowers,
        StreamToken: LiveToken
    })

    if (resp.data.error) {
        return ''
    }
    return resp.data.LiveToken
}

//* /////////////////////////////
//*      Live CLient Logic     //
//* /////////////////////////////

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

const likeVideo = async (usrToken: CookieValueTypes, streamToken: string | null, userLikedVideo: boolean, userDisLikedVideo: boolean) => {
    if (streamToken == null) {
        return false
    }

    if ((!userLikedVideo && !userDisLikedVideo) || (!userLikedVideo && userDisLikedVideo)) {
        await axios.post(`${process.env.SERVER_BACKEND}/live-manager/like-dislike-live`, { userToken: usrToken, streamToken: streamToken, likeOrDislike: 1 })
    } else if (userLikedVideo) {
        await axios.post(`${process.env.SERVER_BACKEND}/live-manager/like-dislike-live`, { userToken: usrToken, streamToken: streamToken, likeOrDislike: 0 })
    }

    return !userLikedVideo
}

const dislikeVideo = async (usrToken: CookieValueTypes, streamToken: string | null, userLikedVideo: boolean, userDisLikedVideo: boolean) => {
    if (streamToken == null) {
        return false
    }

    if ((!userLikedVideo && !userDisLikedVideo) || (userLikedVideo && !userDisLikedVideo)) {
        await axios.post(`${process.env.SERVER_BACKEND}/live-manager/like-dislike-live`, { userToken: usrToken, streamToken: streamToken, likeOrDislike: 2 })
    } else if (userDisLikedVideo) {
        await axios.post(`${process.env.SERVER_BACKEND}/live-manager/like-dislike-live`, { userToken: usrToken, streamToken: streamToken, likeOrDislike: 0 })
    }

    return !userDisLikedVideo
}

export { getLiveData, playOrPauseVideo, changeVolume, followAccount, likeVideo, dislikeVideo, getDashbordData, startStopLive }
