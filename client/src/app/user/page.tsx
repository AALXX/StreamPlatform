'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { followAccount } from '@/Components/VideoPLayer/UtilFunc'
import { getCookie } from 'cookies-next'
import VideoTamplate, { IVideoTemplateProps } from '@/Components/VideoTemplate/VideoTemplate'
import AboutChanelTab from '@/Components/Profile/AboutChanelTab'
import ProfileCards from '@/Components/Profile/utils/ProfileCards'

interface UserData {
    UserName: string
    UserDescription: string
    AccountFolowers: number
}

/**
 * watch video page
 * @return {JSX}
 */
export default function WatchVideoPage() {
    const urlParams = useSearchParams()
    const [userData, setUserData] = useState<UserData>({ UserName: '', UserDescription: '', AccountFolowers: 0 })
    const [userFollwsAccount, setUserFollwsAccount] = useState<boolean>(false)
    const [hasVideos, setHasVideos] = useState<boolean>(false)
    const [videosData, setVideosData] = useState<Array<IVideoTemplateProps>>([])
    const [componentToShow, setComponentToShow] = useState<string>('LandingPage')

    let component
    useEffect(() => {
        ;(async () => {
            const res = await axios.get(`${process.env.SERVER_BACKEND}/user-account/get-creator-data/${getCookie('userPublicToken')}/${urlParams.get('id')}`)
            setUserData(res.data.userData)
            setUserFollwsAccount(res.data.userFollowsCreator)

            const profileVideos = await axios.get(`${process.env.SERVER_BACKEND}/user-account/get-creator-videos/${urlParams.get('id')}`)
            if (Object.keys(profileVideos).length !== 0) {
                setHasVideos(true)
                setVideosData(profileVideos.data.videos)
            }
        })()
    }, [])

    switch (componentToShow) {
        case 'LandingPage':
            component = <div className="grid xl:grid-cols-6 lg:grid-cols-5 gap-4"></div>
            break
        case 'Videos':
            component = (
                <div className="grid xl:grid-cols-6 lg:grid-cols-5 gap-4">
                    {hasVideos ? (
                        <>
                            {videosData.map((video: IVideoTemplateProps, index: number) => (
                                <VideoTamplate key={index} VideoTitle={video.VideoTitle} VideoToken={video.VideoToken} OwnerName={userData.UserName} OwnerToken={video.OwnerToken} />
                            ))}
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            )

            break
        case 'About':
            component = <AboutChanelTab userDescription={userData.UserDescription} />
            break
        default:
            component = <div>No matching component found</div>
    }

    return (
        <>
            <div className="flex flex-col ">
                <img className="z-10 rounded-full self-center mt-6" src={`${process.env.FILE_SERVER}/${urlParams.get('id')}/Main_Icon.png`} width={120} height={120} alt="Picture of the author" />
                <h1 className="text-white self-center text-xl mt-4">{userData.UserName}</h1>
                <div className="flex self-center mt-4 ">
                    <h1 className="text-white self-center text-bg ">Folowers: {userData.AccountFolowers}</h1>
                    {userFollwsAccount ? (
                        <>
                            <button
                                className="text-white text-bg ml-6 bg-[#727272] h-[2rem] w-[5.5rem]"
                                onClick={async () => {
                                    setUserFollwsAccount(await followAccount(getCookie('userToken'), urlParams.get('id') as string, userFollwsAccount))
                                }}
                            >
                                UnFollow
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="text-white text-bg ml-6 bg-[#494949] h-[2rem] w-[5.5rem]"
                                onClick={async () => {
                                    setUserFollwsAccount(await followAccount(getCookie('userToken'), urlParams.get('id') as string, userFollwsAccount))
                                }}
                            >
                                Follow
                            </button>
                        </>
                    )}
                </div>
                <div className="flex h-[6.2vh] mt items-center ">
                    <ProfileCards Title="LANDING PAGE" TabName="LandingPage" setComponentToShow={setComponentToShow} />
                    <ProfileCards Title="VIDEOS" TabName="Videos" setComponentToShow={setComponentToShow} />
                    <ProfileCards Title="ABOUT ME" TabName="About" setComponentToShow={setComponentToShow} />
                </div>
                <hr className="" />
                <div className="flex w-[95%] mt-[2vh] self-center h-[100vh]">{component}</div>
            </div>
        </>
    )
}
