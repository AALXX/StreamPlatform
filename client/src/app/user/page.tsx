'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getCookie } from 'cookies-next'

import CreatorProfile, { UserData } from '@/Components/Creator/CreatorProfile'
import { IVideoTemplateProps } from '@/Components/VideoTemplate/VideoTemplate'

/**
 * watch video page
 * @return {JSX}
 */
export default function WatchVideoPage() {
    const urlParams = useSearchParams()
    const [userData, setUserData] = useState<UserData>({ UserName: '', UserDescription: '', AccountFolowers: 0 })
    const [userFound, setUserFound] = useState<boolean>(false)
    const [userFollwsAccount, setUserFollwsAccount] = useState<boolean>(false)
    const [hasVideos, setHasVideos] = useState<boolean>(false)
    const [videosData, setVideosData] = useState<Array<IVideoTemplateProps>>([])

    useEffect(() => {
        ;(async () => {
            const res = await axios.get(`${process.env.SERVER_BACKEND}/user-account/get-creator-data/${getCookie('userPublicToken')}/${urlParams.get('id')}`)
            setUserData(res.data.userData)
            setUserFollwsAccount(res.data.userFollowsCreator)

            if (res.data.userData == null) {
                setUserFound(false)
            } else {
                setUserFound(true)
            }

            const profileVideos = await axios.get(`${process.env.SERVER_BACKEND}/user-account/get-creator-videos/${urlParams.get('id')}`)
            if (Object.keys(profileVideos).length !== 0) {
                setHasVideos(true)
                setVideosData(profileVideos.data.videos)
            }
        })()
    }, [])

    return (
        <>
            {userFound ? (
                <CreatorProfile
                    hasVideos={hasVideos}
                    setUserFollwsAccount={setUserFollwsAccount}
                    userData={userData}
                    userFollwsAccount={userFollwsAccount}
                    videoToken={urlParams.get('id') as string}
                    videosData={videosData}
                />
            ) : (
                <div className="flex flex-col ">
                    <h1 className="text-white self-center mt-[2rem]">User Not Found</h1>
                </div>
            )}
        </>
    )
}
