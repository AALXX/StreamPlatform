'use client'
import AccountProfile from '@/Components/Profile/AccountProfile'
import { isLoggedIn } from '@/security/Accounts'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Profile = () => {
    const [userLoggedIn, setUserLoggedIn] = useState(false)

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
                    <AccountProfile />
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

export default Profile
