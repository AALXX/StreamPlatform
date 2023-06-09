'use client'
import { getProfileData } from '@/security/Accounts'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const AccountProfile = () => {
    const [userName, setUserName] = useState('')
    const [userFolowerCount, setUserFolowerCount] = useState(0)

    useEffect(() => {
        /**
         * Get user Data at the reload of the page
         */
        async function getUserDataFunc() {
            const profileData = await getProfileData()
            console.log(profileData)
            setUserName(profileData.UserName)
            setUserFolowerCount(profileData.AccountFolowers)
        }

        getUserDataFunc()
    }, [])

    return (
        <div className="flex flex-col">
            <Image className="self-center mt-6" src="/AccountIcon.svg" width={120} height={120} alt="Picture of the author" />
            <div className="flex flex-col w-[10vw] h-[7vh] self-center justify-center items-center">
                <h1 className="text-white">{userName}</h1>
                <h1>Folowers: {userFolowerCount}</h1>
            </div>
        </div>
    )
}

export default AccountProfile
