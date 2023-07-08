'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getVideoData, IVideoData, playOrPauseVideo, followAccount, likeVideo, dislikeVideo } from '@/Components/VideoPLayer/UtilFunc'
import { getCookie } from 'cookies-next'
import PlayerOverlay from './PlayerOverlay'

interface VideoPlayerProps {
    VideoToken: string | null
}

/**
 * Main Video PLayer
 * @param {VideoPlayerProps} props
 * @return {JSX}
 */
const VideoPlayer = (props: VideoPlayerProps) => {
    const VideoRef = useRef<HTMLVideoElement>(null)
    const [showOverlay, setShowOverlay] = useState(false)

    const [playing, setPlaying] = useState(false)
    const [Progress, setProgress] = useState(0)
    const [Volume, setVolume] = useState<number>(0.5)
    const [CurrentMinutes, setCurrentMinutes] = useState(0)
    const [CurrentSeconds, setCurrentSeconds] = useState(0)
    const [DurationMinutes, setDurationMinutes] = useState(0)
    const [DurationSeconds, setDurationSeconds] = useState(0)

    const [VideoData, setVideoData] = useState<IVideoData>({
        error: false,
        VideoFound: false,
        OwnerToken: '',
        PublishDate: '',
        VideoDescription: '',
        VideoTitle: '',
        AccountName: '',
        AccountFolowers: '',
        UserFollwsAccount: false,
        VideoLikes: 0,
        VideoDislikes: 0,
        UserLikedVideo: false,
        UserLikedOrDislikedVideo: 0
    })

    const [userFollwsAccount, setUserFollwsAccount] = useState<boolean>(false)
    const [userLikedVideo, setUserLikedVideo] = useState<boolean>(false)
    const [userDisLikedVideo, setUserDisLikedVideo] = useState<boolean>(false)
    const [videoLikes, setVideoLikes] = useState<number>(0)
    const [videoDisLikes, setVideoDisLikes] = useState<number>(0)

    useEffect(() => {
        if (props.VideoToken == null) {
            console.log('CUM')
        }

        ;(async () => {
            const videoData = await getVideoData(props.VideoToken, getCookie('userToken') as string)
            setVideoData(videoData)
            setUserFollwsAccount(videoData.UserFollwsAccount)
            setUserLikedVideo(videoData.UserLikedVideo)
            if (videoData.UserLikedOrDislikedVideo === 1) {
                setUserLikedVideo(true)
            } else if (videoData.UserLikedOrDislikedVideo === 2) {
                setUserDisLikedVideo(true)
            }

            setVideoLikes(videoData.VideoLikes)
            setVideoDisLikes(videoData.VideoDislikes)
        })()

        const storageVolume = Number(localStorage.getItem('Volume'))

        // * this extra + will convert the string to integer.
        setVolume(storageVolume)

        setTimeout(() => {
            if (VideoRef.current) {
                VideoRef.current.volume = storageVolume
            }

            if (VideoRef?.current?.paused) {
                setPlaying(true)
            } else {
                setPlaying(false)
            }
        }, 100)

        //* update method every 1 sec
        const VideoChecks = window.setInterval(() => {
            //* it updates progress bar
            if (VideoRef?.current?.duration != undefined) setProgress((VideoRef?.current?.currentTime / VideoRef?.current?.duration) * 100)

            //* it updates current and total minutes shown
            if (VideoRef?.current) {
                setCurrentMinutes(Math.floor(VideoRef?.current?.currentTime / 60))
                setCurrentSeconds(Math.floor(VideoRef?.current?.currentTime - CurrentMinutes * 60))
                setDurationMinutes(Math.floor(VideoRef?.current?.duration / 60))
                setDurationSeconds(Math.floor(VideoRef?.current?.duration - DurationMinutes * 60))
            }

            if (VideoRef?.current?.duration === VideoRef?.current?.currentTime) {
                // setVideoEnded(true)
            }
        }, 1000)

        return () => {
            clearInterval(VideoChecks)
        }
    }, [])

    return (
        // * PLayer Outer Border
        <div className="flex flex-col mt-[3rem] ml-[6rem] h-[100vh] ">
            {/*  VideoPlayer Border */}

            <div className=" w-[66.8vw] h-[73.8vh] ">
                {/* TODO  make video controll bar */}
                {showOverlay ? (
                    <PlayerOverlay
                        Progress={Progress}
                        Playing={playing}
                        CurrentMinutes={CurrentMinutes}
                        CurrentSeconds={CurrentSeconds}
                        DurationMinutes={DurationMinutes}
                        DurationSeconds={DurationSeconds}
                        Volume={Volume}
                        setVolume={setVolume}
                        VideoRef={VideoRef}
                        playOrPauseVideo={playOrPauseVideo}
                        setPlaying={setPlaying}
                        setShowOverlay={setShowOverlay}
                    />
                ) : (
                    <div></div>
                )}

                <video
                    onClick={() => {
                        setPlaying(playOrPauseVideo(VideoRef))
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
                    <source src={`${process.env.VIDEO_SERVER_BACKEND}/video-manager/video-stream/${props.VideoToken}`} type="video/mp4" />
                    <p>Your user agent does not support the HTML5 Video element.</p>
                </video>
            </div>

            <div className="flex mt-[.5vh] h-[10vh] w-[66.8vw] bg-[#292929]">
                <Link className="ml-4 self-center" href={'/account'}>
                    <Image src="/AccountIcon.svg" width={70} height={50} alt="Picture of the author" />
                </Link>
                <div className="flex flex-col ml-4">
                    <h1 className="text-white mt-2 text-lg">{VideoData.VideoTitle}</h1>
                    <hr className="w-full" />
                    <div className="flex  ">
                        <div className="flex flex-col">
                            <h1 className="text-white text-base">{VideoData.AccountName}</h1>
                            <h1 className="text-white text-xs">{VideoData.AccountFolowers} followers</h1>
                        </div>
                        {userFollwsAccount ? (
                            <>
                                <button
                                    className="text-white text-bg mt-2 ml-20 bg-[#727272] h-[2.5rem] w-[4.5rem]"
                                    onClick={async () => {
                                        setUserFollwsAccount(await followAccount(getCookie('userToken'), VideoData.OwnerToken, userFollwsAccount))
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
                                        setUserFollwsAccount(await followAccount(getCookie('userToken'), VideoData.OwnerToken, userFollwsAccount))
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
                                    setVideoLikes(videoLikes - 1)

                                    setUserLikedVideo(await likeVideo(getCookie('userToken'), props.VideoToken, userLikedVideo, userDisLikedVideo))
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
                                    setVideoLikes(videoLikes + 1)
                                    if (userDisLikedVideo) {
                                        setVideoDisLikes(videoDisLikes - 1)
                                    }

                                    setUserLikedVideo(await likeVideo(getCookie('userToken'), props.VideoToken, userLikedVideo, userDisLikedVideo))
                                }}
                            />
                        </>
                    )}

                    <h1 className="text-white self-center mr-[1.5rem]">{videoLikes}</h1>

                    {userDisLikedVideo ? (
                        <>
                            <img
                                src="/assets/PlayerIcons/DisLiked_icon.svg"
                                className="cursor-pointer w-[1.6rem] ml-auto mr-[.5rem]"
                                alt="not muted image"
                                onClick={async () => {
                                    setUserLikedVideo(false)
                                    setVideoDisLikes(videoDisLikes - 1)

                                    setUserDisLikedVideo(await dislikeVideo(getCookie('userToken'), props.VideoToken, userFollwsAccount, userDisLikedVideo))
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
                                    setVideoDisLikes(videoDisLikes + 1)
                                    if (userLikedVideo) {
                                        setVideoLikes(videoLikes - 1)
                                    }
                                    setUserDisLikedVideo(await dislikeVideo(getCookie('userToken'), props.VideoToken, userFollwsAccount, userDisLikedVideo))
                                }}
                            />
                        </>
                    )}
                    <h1 className="text-white self-center mr-[4rem]">{videoDisLikes}</h1>
                </div>
            </div>
        </div>
    )
}

/**
 * Video Player fallback
 * @return {JSX}
 */
function VideoPlayerFallback() {
    return <>placeholder</>
}

export { VideoPlayer, VideoPlayerFallback }
