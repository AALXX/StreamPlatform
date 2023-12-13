'use client'
import LiveChat from '@/Components/LivePlayer/LiveChat/LiveChat'
import LivePlayer from '@/Components/LivePlayer/LivePlayer'
import { getCookie } from 'cookies-next'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const LivePage = () => {
    const urlParams = useSearchParams() //* q =  search query
    const userToken: string = getCookie('userToken') as string

    return (
        <div className="flex flex-col">
            <div className="flex h-[100vh]">
                <LivePlayer userStreamToken={urlParams.get('t') as string} />
                <LiveChat UserToken={userToken} LiveToken={urlParams.get('t') as string} />
            </div>
        </div>
    )
}

export default LivePage