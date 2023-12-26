'use client'
import { AccountAnalytics } from '@/Components/Profile/AccountAnalytics'
import { isLoggedIn } from '@/security/Accounts'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const page = () => {
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
                <div className="flex">
                    <AccountAnalytics />
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

export default page
