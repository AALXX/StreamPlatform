'use client'
import React from 'react'
import { Suspense } from 'react'
import { VideoPlayerFallback, VideoPlayer } from '@/Components/VideoPLayer/VideoPlayer'
import CommentSection from '@/Components/VideoPLayer/CommentSection/CommentSection'
import { useSearchParams } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { VideosList } from '@/Components/VideoPLayer/NextVideoList/VideosList'

/**
 * watch video page
 * @return {JSX}
 */
export default function WatchVideoPage() {
    const urlParams = useSearchParams() //* vt = Video Token
    const userToken: string = getCookie('userToken') as string

    return (
        <div className="flex flex-col">
            <div className="flex h-[100vh]">
                <Suspense fallback={<VideoPlayerFallback />}>
                    <VideoPlayer VideoToken={urlParams.get('vt')} />
                </Suspense>
                <CommentSection VideoToken={urlParams.get('vt')} UserToken={userToken} />
            </div>
            <div className=" w-full">
                <VideosList />
            </div>
        </div>
    )
}
