import React from 'react'
import { Suspense } from 'react'
import { VideoPlayerFallback, VideoPlayer } from '@/Components/VideoPLayer/VideoPlayer'


/**
 * watch video page
 * @return {JSX}
 */
export default function WatchVideoPage() {


    return (
        <div>
            <Suspense fallback={<VideoPlayerFallback />}>
                <VideoPlayer />
            </Suspense>
        </div>
    )
}
