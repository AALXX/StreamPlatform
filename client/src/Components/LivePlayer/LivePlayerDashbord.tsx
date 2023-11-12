import React, { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import Link from 'next/link'
import { IDasbordLiveData, ILivePlayerProps } from './ILivePlayer'
import { startStopLive, getDashbordData } from './UtilFunc'
import { getCookie } from 'cookies-next'

const LivePlayerDashbord = (props: ILivePlayerProps) => {
    const VideoRef = useRef<HTMLVideoElement>(null)
    const [showOverlay, setShowOverlay] = useState(false)

    const hls = useRef<Hls | null>(null)
    const [isOnline, setIsOline] = useState<boolean>(true)

    const [LiveData, setLiveData] = useState<IDasbordLiveData>({
        error: false,
        AccountName: '',
        AccountFolowers: 0,
        LiveLikes: 0,
        LiveDislikes: 0
    })

    const [liveTitle, setLiveTitle] = useState<string>('placeHolder')
    const [isLive, setIsLive] = useState<boolean>(false)

    const [playing, setPlaying] = useState(false)
    const [Progress, setProgress] = useState(0)
    const [Volume, setVolume] = useState<number>(0.5)
    const [CurrentMinutes, setCurrentMinutes] = useState(0)
    const [CurrentSeconds, setCurrentSeconds] = useState(0)
    const [DurationMinutes, setDurationMinutes] = useState(0)
    const [DurationSeconds, setDurationSeconds] = useState(0)

    const [userLikedVideo, setUserLikedVideo] = useState<boolean>(false)
    const [userDisLikedVideo, setUserDisLikedVideo] = useState<boolean>(false)
    const [videoLikes, setVideoLikes] = useState<number>(0)
    const [videoDisLikes, setVideoDisLikes] = useState<number>(0)

    useEffect(() => {
        if (VideoRef.current) {
            const video = VideoRef.current

            if (Hls.isSupported()) {
                hls.current = new Hls()
                hls.current.loadSource(`${process.env.VIDEO_SERVER_BACKEND}/video-manager/live-stream/${props.userToken}/`)
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
                video.src = `${process.env.VIDEO_SERVER_BACKEND}/video-manager/live-stream/${props.userToken}/`
                video.addEventListener('loadedmetadata', function () {
                    video.play()
                })
            }
        }

        ;(async () => {
            const dashData = await getDashbordData(getCookie('userToken') as string)
            setLiveData(dashData)
            setLiveTitle(dashData.LiveTitle as string)
            setIsLive(dashData.IsLive)
        })()

        return () => {
            if (hls.current) {
                hls.current.destroy()
            }
        }
    }, [])

    return (
        <div className="flex flex-col mt-[3rem] ml-[6rem] h-[100vh]">
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
                <div className="flex mt-[.5vh] h-[10vh] w-[66.8vw] bg-[#292929]">
                    <Link className="ml-4 self-center" href={`/user?id=${getCookie('userPublicToken') as string}`}>
                        <img className="z-10 rounded-full" src={`${process.env.FILE_SERVER}/${getCookie('userPublicToken') as string}/Main_icon.png`} width={50} height={50} alt="Picture of the author" />
                    </Link>
                    <div className="flex flex-col ml-4 self-center">
                        <input
                            className=" text-[#ffffff]  bg-[#3b3b3b] h-[3vh] border-none w-full placeholder:text-white indent-3"
                            value={liveTitle}
                            onChange={e => {
                                setLiveTitle(e.target.value)
                            }}
                        />
                        <hr className="w-full" />
                        <div className="flex  ">
                            <div className="flex flex-col">
                                <h1 className="text-white text-base">{LiveData.AccountName}</h1>
                                <h1 className="text-white text-xs">{LiveData.AccountFolowers} followers</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex ml-auto mr-[2vw]">
                        {userLikedVideo ? (
                            <>
                                <img src="/assets/PlayerIcons/Liked_icon.svg" className="cursor-pointer w-[1.6rem] mr-[.5rem]" alt="not muted image" />
                            </>
                        ) : (
                            <>
                                <img src="/assets/PlayerIcons/Like_icon.svg" className="cursor-pointer w-[1.6rem] ml-auto mr-[.5rem]" alt="not muted image" />
                            </>
                        )}

                        <h1 className="text-white self-center mr-[1.5rem]">{videoLikes}</h1>

                        {userDisLikedVideo ? (
                            <>
                                <img src="/assets/PlayerIcons/DisLiked_icon.svg" className="cursor-pointer w-[1.6rem] ml-auto mr-[.5rem]" alt="not muted image" />
                            </>
                        ) : (
                            <>
                                <img src="/assets/PlayerIcons/DisLike_icon.svg" className="cursor-pointer w-[1.6rem] ml-auto mr-[.5rem]" alt="not muted image" />
                            </>
                        )}
                        <h1 className="text-white self-center mr-[4rem]">{videoDisLikes}</h1>
                    </div>
                    {isLive ? (
                        <button
                            className="text-[#e46a6a] mr-4  bg-[#3d3d3d] h-[4rem] self-center"
                            onClick={async () => {
                                const error = await startStopLive(liveTitle, getCookie('userToken') as string, LiveData.AccountFolowers)
                                if (!error) {
                                    setIsLive(!isLive)
                                }
                            }}
                        >
                            END LIVE
                        </button>
                    ) : (
                        <button
                            className="text-[#e46a6a] mr-4  bg-[#3d3d3d] h-[4rem] self-center"
                            onClick={async () => {
                                const error = await startStopLive(liveTitle, getCookie('userToken') as string, LiveData.AccountFolowers)
                                if (!error) {
                                    setIsLive(!isLive)
                                }
                            }}
                        >
                            GO LIVE
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LivePlayerDashbord
