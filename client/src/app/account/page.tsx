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
        <div>
            {userLoggedIn ? (
                <AccountProfile />
            ) : (
                <div>
                    <h1>Not logged In</h1>
                    <Link href={'/account/login-register'}>
                        <h1>Go TO LOGIN</h1>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Profile
