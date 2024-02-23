'use client'
import LiveChat from '@/Components/LivePlayer/LiveChat/LiveChat'
import LivePlayer from '@/Components/LivePlayer/LivePlayer'
import { getCookie } from 'cookies-next'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import { isLoggedIn } from '@/security/Accounts'
import { io, Socket } from 'socket.io-client'

const LivePage = () => {
    const urlParams = useSearchParams() //* q =  search query
    const userToken: string = getCookie('userToken') as string
    const [socket, setSocket] = useState<Socket | null>(null)

    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [channelToken, setChannelToken] = useState<string>('')
    const [userBanned, setUserBanned] = useState<{ isbanned: boolean; reason: string }>({ isbanned: false, reason: '' })

    useEffect(() => {
        const loginAync = async () => {
            const usrLoggedIn = await isLoggedIn()
            setUserLoggedIn(usrLoggedIn)
        }
        loginAync()

        // Connect to the Socket.IO server only once when the component mounts
        const newSocket = io(process.env.LIVE_CHAT_SERVER as string) // Replace with your server URL
        setSocket(newSocket)

        return () => {
            newSocket.disconnect() // Disconnect the socket on unmount
        }
    }, [])

    useEffect(() => {
        // Emit event and manage socket interactions when `socket` changes
        if (socket) {
            socket.emit('join-live', { LiveToken: urlParams.get('t') as string, UserPrivateToken: getCookie('userToken') as string })
            socket.on('viewer-banned', ({ reason }) => {
                setUserBanned({ isbanned: true, reason: reason })
            })
        }
    }, [socket, urlParams])

    return (
        <div className="flex flex-col">
            {!userBanned.isbanned ? (
                <div className="flex h-[100vh]">
                    <LivePlayer userStreamToken={urlParams.get('t') as string} socket={socket!} setUserRole={setUserRole} setChannelToken={setChannelToken} />
                    <Suspense fallback={<div>Loading...</div>}>
                        <LiveChat UserToken={userToken} LiveToken={urlParams.get('t') as string} ClientSocket={socket} userLoggedIn={userLoggedIn} UserRole={userRole} channelToken={channelToken} />
                    </Suspense>
                </div>
            ) : (
                <div>
                    <h1>The streammer has banned you for {userBanned.reason} </h1>
                </div>
            )}
        </div>
    )
}

export default LivePage
