'use client'
import LivePlayerDashbord from '@/Components/LivePlayer/LivePlayerDashbord'
import { isLoggedIn } from '@/security/Accounts'
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const LiveDashbord = () => {
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const loginAync = async () => {
            const usrLoggedIn = await isLoggedIn()
            setUserLoggedIn(usrLoggedIn)
        }
        loginAync()

        // Connect to the Socket.IO server only once when the component mounts
        const newSocket = io(process.env.LIVE_CHAT_SERVER as string); // Replace with your server URL
        setSocket(newSocket);

        return () => {
            newSocket.disconnect(); // Disconnect the socket on unmount
        };
    }, [])


    return (
        <>
            {userLoggedIn ? (
                <div className="flex flex-col">
                    <LivePlayerDashbord userStreamToken={getCookie('userToken') as string} socket={socket!}/>
                </div>
            ) : (
                <div className="flex flex-col ">
                    <h1 className="text-white self-center mt-[2rem]">Not logged In:</h1>
                    <Link className="self-center" href={'/account/login-register'}>
                        <h1 className="text-white">Login</h1>
                    </Link>
                </div>
            )}
        </>
    )
}

export default LiveDashbord
