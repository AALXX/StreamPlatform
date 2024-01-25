'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { abbreviateNumber } from './utils/NumberAbrev'
import { getCookie } from 'cookies-next'

export interface IVideoTemplateProps {
    VideoTitle: string
    Likes: number
    Dislikes: number
    VideoToken: string
}

export const VideoTamplate = (props: IVideoTemplateProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)

    return (
        <>
            <Link href={`/watch?vt=${props.VideoToken}`} className="w-[15vw] h-[20vh]">
                <div
                    className="flex flex-col bg-white w-[15vw] h-[20vh] cursor-pointer"
                    onMouseEnter={() => {
                        setIsHovered(true)
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false)
                    }}
                >
                    <img src={`${process.env.FILE_SERVER}/${getCookie('userPublicToken')}/${props.VideoToken}/Thumbnail_image.jpg`} className="absolute  w-[15vw] h-[20vh]" />
                    {isHovered ? (
                        <div className="flex flex-col h-full z-10">
                            {/* top side */}
                            <div className="flex flex-row mb-auto bg-[#00000088] h-[30%]">
                                <div className="flex ml-auto mr-[1rem] z-30 ">
                                    <Link href={`/account/edit-video?vt=${props.VideoToken}`} className="self-center">
                                        <Image src="/assets/AccountIcons/Settings_icon.svg" width={20} height={20} alt="DisLikeIcon" />
                                    </Link>
                                </div>
                            </div>
                            {/* bottom side */}
                            <div className="flex flex-row mt-auto bg-[#00000088] h-[30%]">
                                <h1 className="text-white text-lg self-center ml-3 truncate">{props.VideoTitle}</h1>

                                <div className="flex ml-auto">
                                    <Image src="/assets/PlayerIcons/Like_icon.svg" width={20} height={20} alt="LikeIcon" />
                                    <h1 className="text-white self-center mr-3">{abbreviateNumber(props.Likes)}</h1>

                                    <Image src="/assets/PlayerIcons/Dislike_icon.svg" width={20} height={20} alt="DisLikeIcon" />
                                    <h1 className="text-white self-center mr-5">{abbreviateNumber(props.Dislikes)}</h1>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </Link>
        </>
    )
}

export default VideoTamplate
