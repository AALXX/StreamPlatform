'use client'
import LivePlayerDashbord from '@/Components/LivePlayer/LivePlayerDashbord'
import { isLoggedIn } from '@/security/Accounts'
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const LiveDashbord = () => {
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        const loginAync = async () => {
            const usrLoggedIn = await isLoggedIn()
            setUserLoggedIn(usrLoggedIn)
        }
        loginAync()
    }, [])
    return (
        <>
            {userLoggedIn ? (
                <div className="flex flex-col">
                    <div className="flex h-[100vh]">
                        <LivePlayerDashbord userToken={getCookie('userPublicToken') as string} />
                    </div>
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
