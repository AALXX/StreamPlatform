'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { IVideoTemplateProps, VideoTamplate } from '@/Components/VideoTemplate/VideoTemplate'

/**
 * watch video page
 * @return {JSX}
 */
export default function WatchVideoPage() { 
    const urlParams = useSearchParams() //* q =  search query
    const [videosList, setVideoList] = useState<Array<IVideoTemplateProps>>([])

    useEffect(() => {
        ;(async () => {
            const res = await axios.get(`${process.env.SERVER_BACKEND}/videos-manager/search-video/${urlParams.get('q')}`)
            setVideoList(res.data.Videos)
        })()
    }, [])

    return (
        <>
            {Object.keys(videosList).length === 0 ? (
                <div>
                    <h1>SEARCH NOT FOUND</h1>
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className="grid xl:grid-cols-6 lg:grid-cols-5 gap-4 mt-[4vh] overflow-y-hidden self-center">
                        {videosList.map((video: IVideoTemplateProps, index: number) => (
                            <VideoTamplate key={index} VideoTitle={video.VideoTitle} VideoToken={video.VideoToken} OwnerName={video.OwnerName} OwnerToken={video.OwnerToken} />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
