'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { isLoggedIn } from '@/security/Accounts'
import Link from 'next/link'
import EditVideoComponent from '@/Components/Profile/EditVideoComponent'

const EditVideo = () => {
    const urlParams = useSearchParams() //* t =  search query

    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        ;(async () => {
            const usrLoggedIn = await isLoggedIn()
            setUserLoggedIn(usrLoggedIn)
        })()
    }, [])

    return (
        <div className="flex flex-col">
            {userLoggedIn ? (
                <EditVideoComponent videoToken={urlParams.get('vt') as string} />
            ) : (
                <>
                    <h1 className="text-white self-center mt-[2rem]">Not logged In:</h1>
                    <Link className="self-center" href={'/account/login-register'}>
                        <h1 className="text-white">Login</h1>
                    </Link>
                </>
            )}
        </div>
    )
}

export default EditVideo
