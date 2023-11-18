import React, { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import Link from 'next/link'
import { ILiveData, ILivePlayerProps } from './ILivePlayer'
import { dislikeVideo, followAccount, getLiveData, likeVideo } from './UtilFunc'
import { getCookie } from 'cookies-next'

const LivePlayer = (props: ILivePlayerProps) => {
    const VideoRef = useRef<HTMLVideoElement>(null)
    const [showOverlay, setShowOverlay] = useState(false)

    const hls = useRef<Hls | null>(null)
    const [isOnline, setIsOline] = useState<boolean>(true)

    const [liveData, setLiveData] = useState<ILiveData>({
        error: false,
        IsLive: false,
        LiveTitle: '',
        AccountName: '',
        AccountFolowers: 0,
        UserFollwsAccount: false,
        LiveLikes: 0,
        LiveDislikes: 0,
        UserLikedVideo: false,
        OwnerToken: '',
        UserLikedOrDislikedLive: { like_or_dislike: 0, userLiked: false }
    })

    const [playing, setPlaying] = useState(false)
    const [Progress, setProgress] = useState(0)
    const [Volume, setVolume] = useState<number>(0.5)
    const [CurrentMinutes, setCurrentMinutes] = useState(0)
    const [CurrentSeconds, setCurrentSeconds] = useState(0)
    const [DurationMinutes, setDurationMinutes] = useState(0)
    const [DurationSeconds, setDurationSeconds] = useState(0)

    const [userFollwsAccount, setUserFollwsAccount] = useState<boolean>(false)
    const [userLikedVideo, setUserLikedVideo] = useState<boolean>(false)
    const [userDisLikedVideo, setUserDisLikedVideo] = useState<boolean>(false)
    const [liveLikes, setLiveLikes] = useState<number>(0)
    const [liveDisLikes, setLiveDisLikes] = useState<number>(0)

    useEffect(() => {
        if (VideoRef.current) {
            const video = VideoRef.current

            if (Hls.isSupported()) {
                hls.current = new Hls()
                hls.current.loadSource(`${process.env.VIDEO_SERVER_BACKEND}/video-manager/live-stream/${props.userStreamToken}/`)
                hls.current.attachMedia(video)
                // Add an error event listener to capture and handle HLS errors
                hls.current.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                setIsOline(false)
                                console.error('HLS network error occurred')
                                // Handle network errors
                                break
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                setIsOline(false)
                                console.error('HLS media error occurred')
                                setIsOline(false)
                                // Handle media errors
                                break
                            default:
                                console.error('HLS error occurred')
                            // Handle other errors
                        }
                    }
                })

                hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(error => {
                        console.log('Error playing the video:', error)
                    })
                })
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = `${process.env.VIDEO_SERVER_BACKEND}/video-manager/live-stream/${props.userStreamToken}/`
                video.addEventListener('loadedmetadata', function () {
                    video.play()
                })
            }
        }

        ;(async () => {
            const LiveData = await getLiveData(getCookie('userToken') as string, props.userStreamToken)
            setLiveData(LiveData)
            setUserFollwsAccount(LiveData.UserFollwsAccount)
            setUserLikedVideo(LiveData.UserLikedVideo)
            if (LiveData.UserLikedOrDislikedLive.like_or_dislike === 1) {
                setUserLikedVideo(true)
            } else if (LiveData.UserLikedOrDislikedLive.like_or_dislike === 2) {
                setUserDisLikedVideo(true)
            }

            setLiveLikes(LiveData.LiveLikes)
            setLiveDisLikes(LiveData.LiveDislikes)
        })()

        return () => {
            if (hls.current) {
                hls.current.destroy()
            }
        }
    }, [])

    return (
        <div className="flex flex-col mt-[3rem] ml-[6rem] h-[100vh] ">
            {/*  VideoPlayer Border */}
            <div className="w-[66.8vw] h-[73.8vh] ">
                {isOnline == true ? (
                    <video
                        onClick={() => {
                            // setPlaying(playOrPauseVideo(VideoRef))
                        }}
                        autoPlay
                        ref={VideoRef}
                        className="w-full h-full"
                        onMouseEnter={() => {
                            setShowOverlay(true)
                        }}
                        onMouseLeave={() => {
                            setShowOverlay(false)
                        }}
                    >
                        <p>Your browser does not support the HTML5 Video element.</p>
                    </video>
                ) : (
                    <div className="w-full h-full border">
                        <h1>USer is offline</h1>
                    </div>
                )}
                <div className="flex mt-[.5vh] h-[11vh] w-[66.8vw] bg-[#292929]">
                    <Link className="ml-4 self-center" href={`/user?id=${props.userStreamToken}`}>
                        <img className="z-10 rounded-full" src={`${process.env.FILE_SERVER}/${liveData.OwnerToken}/Main_icon.png`} width={50} height={50} alt="Picture of the author" />
                    </Link>
                    <div className="flex flex-col ml-4 self-center">
                        <h1 className="text-white mt-2 text-lg">{liveData.LiveTitle}</h1>
                        <hr className="w-full" />
                        <div className="flex  ">
                            <div className="flex flex-col">
                                <h1 className="text-white text-base">{liveData.AccountName}</h1>
                                <h1 className="text-white text-xs">{liveData.AccountFolowers} followers</h1>
                            </div>
                            {userFollwsAccount ? (
                                <>
                                    <button
                                        className="text-white text-bg mt-2 ml-20 bg-[#727272] h-[2.5rem] w-[4.5rem]"
                                        onClick={async () => {
                                            setUserFollwsAccount(await followAccount(getCookie('userToken'), props.userStreamToken, userFollwsAccount))
                                        }}
                                    >
                                        UnFollow
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="text-white text-bg mt-2 ml-20 bg-[#494949] h-[2.5rem] w-[4.5rem]"
                                        onClick={async () => {
                                            setUserFollwsAccount(await followAccount(getCookie('userToken'), props.userStreamToken, userFollwsAccount))
                                        }}
                                    >
                                        Follow
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex ml-auto mr-[2vw]">
                        {userLikedVideo ? (
                            <>
                                <img
                                    src="/assets/PlayerIcons/Liked_icon.svg"
                                    className="cursor-pointer w-[1.6rem] mr-[.5rem]"
                                    alt="not muted image"
                                    onClick={async () => {
                                        setUserDisLikedVideo(false)
                                        setLiveLikes(liveLikes - 1)

                                        setUserLikedVideo(await likeVideo(getCookie('userToken'), props.userStreamToken, userLikedVideo, userDisLikedVideo))
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <img
                                    src="/assets/PlayerIcons/Like_icon.svg"
                                    className="cursor-pointer w-[1.6rem] ml-auto mr-[.5rem]"
                                    alt="not muted image"
                                    onClick={async () => {
                                        setUserDisLikedVideo(false)
                                        setLiveLikes(liveLikes + 1)
                                        if (userDisLikedVideo) {
                                            setLiveDisLikes(liveDisLikes - 1)
                                        }

                                        setUserLikedVideo(await likeVideo(getCookie('userToken'), props.userStreamToken, userLikedVideo, userDisLikedVideo))
                                    }}
                                />
                            </>
                        )}

                        <h1 className="text-white self-center mr-[1.5rem]">{liveLikes}</h1>

                        {userDisLikedVideo ? (
                            <>
                                <img
                                    src="/assets/PlayerIcons/DisLiked_icon.svg"
                                    className="cursor-pointer w-[1.6rem] ml-auto mr-[.5rem]"
                                    alt="not muted image"
                                    onClick={async () => {
                                        setUserLikedVideo(false)
                                        setLiveDisLikes(liveDisLikes - 1)

                                        setUserDisLikedVideo(await dislikeVideo(getCookie('userToken'), props.userStreamToken, userLikedVideo, userDisLikedVideo))
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <img
                                    src="/assets/PlayerIcons/DisLike_icon.svg"
                                    className="cursor-pointer w-[1.6rem] ml-auto mr-[.5rem]"
                                    alt="not muted image"
                                    onClick={async () => {
                                        setUserLikedVideo(false)
                                        setLiveDisLikes(liveDisLikes + 1)
                                        if (userLikedVideo) {
                                            setLiveLikes(liveLikes - 1)
                                        }
                                        setUserDisLikedVideo(await dislikeVideo(getCookie('userToken'), props.userStreamToken, userLikedVideo, userDisLikedVideo))
                                    }}
                                />
                            </>
                        )}
                        <h1 className="text-white self-center mr-[4rem]">{liveDisLikes}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LivePlayer
