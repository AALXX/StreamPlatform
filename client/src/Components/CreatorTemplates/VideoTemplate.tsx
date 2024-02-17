'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { abbreviateNumber } from '../Profile/utils/NumberAbrev'
import TruncatedText from '../Util/TruncateText'

export interface IVideoTemplateProps {
    VideoTitle: string
    VideoToken: string
    Likes: number
    Dislikes: number
    OwnerName: string
    OwnerToken: string
}

export const VideoTamplate = (props: IVideoTemplateProps) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <>
            <Link href={`/watch?vt=${props.VideoToken}`}>
                <div
                    className="flex flex-col bg-white w-[15vw] h-[20vh] cursor-pointer"
                    onMouseEnter={() => {
                        setIsHovered(true)
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false)
                    }}
                >
                    <img src={`${process.env.FILE_SERVER}/${props.OwnerToken}/${props.VideoToken}/Thumbnail_image.jpg`} className="absolute w-[15vw] h-[20vh]" />

                    {isHovered ? (
                        <div className="flex flex-row mt-auto bg-[#00000088] h-[30%] z-10">
                            <img src={`${process.env.FILE_SERVER}/${props.OwnerToken}/Main_Icon.png`} alt="" className="z-10 rounded-full w-[2vw] h-[4vh] self-center ml-[0.5rem]" />
                            <div className="flex flex-col ml-4 self-center w-[x6vw] ">
                                <h1 className="text-white text-base">{props.OwnerName}</h1>
                                <hr className="w-full self-center" />

                                <TruncatedText className="text-white text-sm truncate " characters={20} text={props.VideoTitle} />
                            </div>
                            <div className="flex ml-auto">
                                <img src="/assets/PlayerIcons/Like_icon.svg" width={20} height={20} alt="LikeIcon" />
                                <h1 className="text-white self-center mr-2 ml-1">{abbreviateNumber(props.Likes)}</h1>

                                <img src="/assets/PlayerIcons/Dislike_icon.svg" width={20} height={20} alt="DisLikeIcon" />
                                <h1 className="text-white self-center mr-2">{abbreviateNumber(props.Dislikes)}</h1>
                            </div>
                        </div>
                    ) : null}
                </div>
            </Link>
        </>
    )
}

export default VideoTamplate
