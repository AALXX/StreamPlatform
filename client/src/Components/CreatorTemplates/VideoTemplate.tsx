'use client'
import React, { useState } from 'react'
import Link from 'next/link'

export interface IVideoTemplateProps {
    VideoTitle: string
    VideoToken: string
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
                            <div className="flex flex-col ml-4 self-center w-[6vw] ">
                                <h1 className="text-white text-base">{props.OwnerName}</h1>
                                <hr className="w-full self-center" />

                                <h1 className="text-white text-sm truncate ">{props.VideoTitle}</h1>
                            </div>
                        </div>
                    ) : null}
                </div>
            </Link>
        </>
    )
}

export default VideoTamplate
