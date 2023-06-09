'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getVideoData, playOrPauseVideo, IVideoData } from '@/Components/VideoPLayer/UtilFunc'

/**
 * Main Video PLayer
 * @return {JSX}
 */
function VideoPlayer() {
    const VideoRef = useRef<HTMLVideoElement>(null)
    const urlParams = useSearchParams() //* vt = Video Token
    const [playing, setPlaying] = useState(false)
    const [showOverlay, setShowOverlay] = useState(false)

    const [VideoData, setVideoData] = useState<IVideoData>({ error: false, VideoFound: false, OwnerToken: '', PublishDate: '', VideoDescription: '', VideoTitle: '', AccountName: '', AccountFolowers: '' })

    useEffect(() => {
        if (urlParams.get('vt') == null) {
            console.log('CUM')
        }

        ;(async () => {
            const videoData = await getVideoData(urlParams.get('vt'))
            setVideoData(videoData)
        })()
    }, [])

    return (
        // * PLayer Outer Border
        <div className="flex flex-col mt-[3rem] ml-[5rem] h-[100vh] ">
            {/* //* VideoPlayer Border */}

            <div
                onClick={() => {
                    setPlaying(playOrPauseVideo(VideoRef))
                }}
                className=" w-[66.8vw] h-[73.8vh] "
            >
                {/* TODO  make video controll bar */}
                {showOverlay ? <div className="absolute bg-[#0000009c] w-[67vw] h-[74vh] "></div> : <div></div>}

                <video
                    ref={VideoRef}
                    className="w-full h-full"
                    onMouseEnter={() => {
                        setShowOverlay(true)
                    }}
                    onMouseLeave={() => {
                        setShowOverlay(false)
                    }}
                >
                    <source src={`${process.env.VIDEO_SERVER_BACKEND}/video-manager/video-stream/${urlParams.get('vt')}`} type="video/mp4" />
                    <p>Your user agent does not support the HTML5 Video element.</p>
                </video>
            </div>

            <div className="flex mt-[.5vh] h-[10vh] w-[66.8vw] bg-[#272727]">
                <Link className="ml-4 self-center" href={'/account'}>
                    <Image src="/AccountIcon.svg" width={70} height={50} alt="Picture of the author" />
                </Link>
                <div className="flex flex-col ml-4  ">
                    <h1 className="text-white mt-2 text-lg">{VideoData.VideoTitle}</h1>
                    <h1 className="text-white text-base">{VideoData.AccountName}</h1>
                    <h1 className="text-white text-xs">{VideoData.AccountFolowers} followers</h1>
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
