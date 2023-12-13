import axios from 'axios'
import { CookieValueTypes } from 'cookies-next'
import { Dispatch, RefObject, SetStateAction } from 'react'

interface IVideoData {
    error: boolean
    VideoFound: boolean
    VideoTitle: string
    VideoDescription: string
    PublishDate: string
    OwnerToken: string
    AccountName: string
    AccountFolowers: string
    UserFollwsAccount: boolean
    VideoLikes: number
    VideoDislikes: number
    UserLikedVideo: boolean
    UserLikedOrDislikedVideo: number
}

const getVideoData = async (VideoToken: string | null, userToken: string) => {
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
const playOrPauseVideo = (videoRef: RefObject<HTMLVideoElement>, allTimeWatch: number, setAllTimeWatch: Dispatch<SetStateAction<number>>, startTime: number, setStartTime: Dispatch<SetStateAction<number>>): boolean => {
    if (videoRef?.current?.paused) {
        setStartTime(Date.now())
        videoRef?.current?.play()
        return true
    } else {
        if (startTime != undefined) {
            const endTime = Date.now()
            const durationWatched = endTime - startTime
            setAllTimeWatch(allTimeWatch + durationWatched)
        }
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

export type { IVideoData }
export { getVideoData, playOrPauseVideo, changeVolume, followAccount, likeVideo, dislikeVideo }
