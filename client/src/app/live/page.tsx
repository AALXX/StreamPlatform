'use client'
import LivePlayer from '@/Components/LivePlayer/LivePlayer'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const LivePage = () => {
    const urlParams = useSearchParams() //* q =  search query

    return (
        <div className="flex flex-col">
            <div className="flex h-[100vh]">
                <LivePlayer userStreamToken={urlParams.get('t') as string} />
            </div>
        </div>
    )
}

export default LivePage
