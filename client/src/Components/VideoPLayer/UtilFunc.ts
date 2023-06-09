import axios from 'axios'
import { RefObject } from 'react'

interface IVideoData {
    error: boolean
    VideoFound: boolean
    VideoTitle: string
    VideoDescription: string
    PublishDate: string
    OwnerToken: string
    AccountName: string
    AccountFolowers: string
}

const getVideoData = async (VideoToken: string | null) => {
    const videoData = await axios.get(`${process.env.SERVER_BACKEND}/videos-manager/get-video-data/${VideoToken}`)

    console.log(videoData)

    return {
        error: false,
        VideoFound: true,
        VideoTitle: videoData.data.VideoTitle,
        VideoDescription: videoData.data.VideoDescription,
        PublishDate: videoData.data.PublishDate,
        OwnerToken: videoData.data.OwnerToken,
        AccountName: videoData.data.AccountName,
        AccountFolowers: videoData.data.AccountFolowers
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

export type { IVideoData }
export { getVideoData, playOrPauseVideo }
