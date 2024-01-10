'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { IVideoTemplateProps, VideoTamplate } from './AccountVideoTamplate'
import { CookieValueTypes, getCookie } from 'cookies-next'
import axios from 'axios'
import AccoutSettingsPopup from './utils/UserAccountSettingsPopUp'
import ChangeAccountIconPopUp from './utils/ChangeAccountIconPopUp'
import ProfileCards from './utils/ProfileCards'
import AboutChanelTab from './AboutChanelTab'

interface IUserDataProps {
    UserName: string
    UserDescription: string
    UserEmail: string
    AccountFolowers: string
}

const AccountProfile = () => {
    const userToken: string = getCookie('userToken') as string

    const [userData, setUserData] = useState<IUserDataProps>({ UserName: '', UserDescription: '', UserEmail: '', AccountFolowers: '' })
    const [hasVideos, setHasVideos] = useState<boolean>(false)
    const [videosData, setVideosData] = useState<Array<IVideoTemplateProps>>([])

    const [ToggledSettingsPopUp, setToggledSettingsPopUp] = useState(false)
    const [ToggledIconChangePopUp, setToggledIconChangePopUp] = useState(false)

    const [isAccIconHovered, setIsAccIconHovered] = useState(false)
    const [componentToShow, setComponentToShow] = useState<string>('LandingPage')

    let component

    const getProfileData = async (userToken: CookieValueTypes) => {
        const resData = await axios.get(`${process.env.SERVER_BACKEND}/user-account/get-account-data/${userToken}`)
        if (resData.data.error == true) {
            return console.error('ERROR GET PROFILE DATA FAILED')
        }
        console.log(resData.data.userData)
        return resData.data.userData
    }

    const getProfileVideos = async (userToken: CookieValueTypes) => {
        const resData = await axios.get(`${process.env.SERVER_BACKEND}/user-account/get-account-videos/${userToken}`)
        if (resData.data.error == true) {
            return console.error('ERROR GET PROFILE DATA FAILED')
        }

        return resData.data.videos
    }

    useEffect(() => {
        /**
         * Get user profile Data
         */
        ; (async () => {
            const userToken = getCookie('userToken')

            const profileData = await getProfileData(userToken)
            setUserData(profileData)

            const profileVideos = await getProfileVideos(userToken)
            if (Object.keys(profileVideos).length !== 0) {
                setHasVideos(true)
                setVideosData(profileVideos)
            }
        })()
    }, [])

    switch (componentToShow) {
        case 'LandingPage':
            component = <div className="grid xl:grid-cols-6 lg:grid-cols-5 gap-4 "></div>
            break
        case 'Videos':
            component = (
                <div>
                    {hasVideos ? (
                        <div className="grid xl:grid-cols-6 lg:grid-cols-5 gap-4 ">
                            {videosData.map((video: IVideoTemplateProps, index: number) => (
                                <VideoTamplate key={index} VideoTitle={video.VideoTitle} VideoToken={video.VideoToken} Likes={video.Likes} Dislikes={video.Dislikes} />
                            ))}
                        </div>
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
        <div className="flex flex-col  w-full overflow-y-scroll ">
            <div className="flex flex-col self-center mt-6">
                {isAccIconHovered ? (
                    <Image
                        src="/assets/AccountIcons/EditProfileIcon_Icon.svg"
                        onMouseEnter={() => {
                            setIsAccIconHovered(true)
                        }}
                        onMouseLeave={() => {
                            setIsAccIconHovered(false)
                        }}
                        width={120}
                        height={120}
                        alt="edit icon"
                        onClick={() => {
                            setToggledIconChangePopUp(!ToggledIconChangePopUp)
                        }}
                    />
                ) : (
                    <img
                        onMouseEnter={() => {
                            setIsAccIconHovered(true)
                        }}
                        onMouseLeave={() => {
                            setIsAccIconHovered(false)
                        }}
                        className="z-10 rounded-full"
                        src={`${process.env.FILE_SERVER}/${getCookie('userPublicToken')}/Main_Icon.png`}
                        width={120}
                        height={120}
                        alt="Picture of the author"
                    />
                )}
            </div>

            <div className="flex flex-col w-[15vw]  h-[7vh] self-center justify-center items-center mt-4">
                <div className="flex w-full justify-center">
                    <h1 className="text-white self-center text-xl">{userData.UserName}</h1>
                    <Image
                        className="self-center ml-4 mt-1"
                        src="/assets/AccountIcons/Settings_icon.svg"
                        width={20}
                        height={20}
                        alt="Setting icon"
                        onClick={() => {
                            setToggledSettingsPopUp(!ToggledSettingsPopUp)
                        }}
                    />
                </div>
                <h1 className="text-white">Folowers: {userData.AccountFolowers}</h1>
            </div>
            {ToggledSettingsPopUp ? (
                <AccoutSettingsPopup
                    closePopup={() => {
                        setToggledSettingsPopUp(!ToggledSettingsPopUp)
                    }}
                    UserName={userData.UserName}
                    UserEmail={userData.UserEmail}
                    UserPrivateToken={userToken}
                    UserVisibility="public"
                    UserDescription={userData.UserDescription}
                />
            ) : null}

            {ToggledIconChangePopUp ? (
                <ChangeAccountIconPopUp
                    closePopup={() => {
                        setToggledIconChangePopUp(!ToggledIconChangePopUp)
                    }}
                    UserPrivateToken={userToken}
                />
            ) : null}
            <div className="flex h-[6.2vh]  items-center ">
                <ProfileCards Title="LANDING PAGE" TabName="LandingPage" setComponentToShow={setComponentToShow} />
                <ProfileCards Title="VIDEOS" TabName="Videos" setComponentToShow={setComponentToShow} />
                <ProfileCards Title="ABOUT ME" TabName="About" setComponentToShow={setComponentToShow} />
            </div>
            <hr className="" />
            <div className="flex w-[95%] mt-[2vh] self-center h-[100vh]">{component}</div>
        </div>
    )
}

export default AccountProfile
