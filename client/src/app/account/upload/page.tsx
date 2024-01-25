'use client'
import Link from 'next/link'
import { isLoggedIn } from '@/security/Accounts'
import { useEffect, useState } from 'react'
import UploadComopnents from '@/Components/Profile/UploadComponents'
import React from 'react'

const UploadPage = () => {
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
                <UploadComopnents />
            ) : (
                <div>
                    <h1>Account Not Found</h1>
                    <Link href={'/account/login-register'}>
                        <h1>Go TO LOGIN</h1>
                    </Link>
                </div>
            )}
        </>
    )
}

export default UploadPage
