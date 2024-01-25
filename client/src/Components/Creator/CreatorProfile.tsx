import React, { Dispatch, SetStateAction, useState } from 'react'
import ProfileCards from '@/Components/Profile/utils/ProfileCards'
import { followAccount } from '@/Components/VideoPLayer/UtilFunc'
import VideoTamplate, { IVideoTemplateProps } from '@/Components/CreatorTemplates/VideoTemplate'

import AboutChanelTab from '@/Components/Profile/AboutChanelTab'
import { getCookie } from 'cookies-next'
import Livetemplate from '../CreatorTemplates/LiveTemplate'

export interface UserData {
    UserName: string
    UserDescription: string
    AccountFolowers: number
}

export interface ILiveDataProps {
    StreamTitle: string
    Likes: number
    Dislikes: number
    StreamToken: string
    StartedAt: string
}

interface ICreatorProfileProps {
    userData: UserData
    userFollwsAccount: boolean
    liveData: ILiveDataProps | null
    hasVideos: boolean
    videosData: Array<IVideoTemplateProps>
    videoToken: string
    setUserFollwsAccount: Dispatch<SetStateAction<boolean>>
}

const CreatorProfile = (props: ICreatorProfileProps) => {
    const [componentToShow, setComponentToShow] = useState<string>('LandingPage')

    let component
    switch (componentToShow) {
        case 'LandingPage':
            component = <div className="grid xl:grid-cols-6 lg:grid-cols-5 gap-4 ">
                {props.liveData == null ? (
                    null

                ) : (
                    <div>
                        <Livetemplate
                            StreamTitle={props.liveData.StreamTitle}
                            Likes={props.liveData.Likes}
                            Dislikes={props.liveData.Dislikes}
                            StreamToken={props.liveData.StreamToken}
                            StartedAt={props.liveData.StartedAt}
                        />
                    </div>
                )}
            </div>
            break
        case 'Videos':
            component = (
                <div>
                    {props.hasVideos ? (
                        <div className="grid xl:grid-cols-6 lg:grid-cols-5 gap-4">
                            <>
                                {props.videosData.map((video: IVideoTemplateProps, index: number) => (
                                    <VideoTamplate key={index} VideoTitle={video.VideoTitle} VideoToken={video.VideoToken} OwnerName={props.userData.UserName} OwnerToken={video.OwnerToken} />
                                ))}
                            </>
                        </div>
                    ) : (
                        <></>
                    )
                    }
                </div>
            )

            break
        case 'About':
            component = <AboutChanelTab userDescription={props.userData.UserDescription} />
            break
        default:
            component = <div>No matching component found</div>
    }

    return (
        <div className="flex flex-col ">
            <img className="z-10 rounded-full self-center mt-6" src={`${process.env.FILE_SERVER}/${props.videoToken}/Main_Icon.png`} width={120} height={120} alt="Picture of the author" />
            <h1 className="text-white self-center text-xl mt-4">{props.userData.UserName}</h1>
            <div className="flex self-center mt-4 ">
                <h1 className="text-white self-center text-bg ">Folowers: {props.userData.AccountFolowers}</h1>
                {props.userFollwsAccount ? (
                    <>
                        <button
                            className="text-white text-bg ml-6 bg-[#727272] h-[2rem] w-[5.5rem]"
                            onClick={async () => {
                                props.setUserFollwsAccount(await followAccount(getCookie('userToken'), props.videoToken as string, props.userFollwsAccount))
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
                                props.setUserFollwsAccount(await followAccount(getCookie('userToken'), props.videoToken as string, props.userFollwsAccount))
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
    )
}

export default CreatorProfile
