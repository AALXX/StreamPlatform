'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { abbreviateNumber } from './utils/NumberAbrev'

export interface VideTemplateProps {
    VideoTitle: string
    Likes: number
    Dislikes: number
    VideoToken: string
}

export const VideoTamplate = (props: VideTemplateProps) => {
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
                    {isHovered ? (
                        <div className="flex flex-row mt-auto bg-[#00000088] h-[30%]">
                            <h1 className="text-white text-lg self-center ml-3">{props.VideoTitle}</h1>

                            <div className="flex ml-auto">
                                <Image src="/assets/PlayerIcons/Like_icon.svg" width={20} height={20} alt="LikeIcon" />
                                <h1 className="text-white self-center mr-3">{abbreviateNumber(props.Likes)}</h1>

                                <Image src="/assets/PlayerIcons/Dislike_icon.svg" width={20} height={20} alt="DisLikeIcon" />
                                <h1 className="text-white self-center mr-5">{abbreviateNumber(props.Dislikes)}</h1>
                            </div>
                        </div>
                    ) : null}
                </div>
            </Link>
        </>
    )
}

export default VideoTamplate
