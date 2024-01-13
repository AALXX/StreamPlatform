'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getCookie } from 'cookies-next'
import { abbreviateNumber } from '../Profile/utils/NumberAbrev'
import { useEffect } from 'react'
import axios from 'axios'

export interface ILiveStreamProps {
    StreamTitle: string
    Likes: number
    Dislikes: number
    StreamToken: string
    StartedAt: string
}

export const Livetemplate = (props: ILiveStreamProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [liveViews, setLiveViews] = useState<number>(0)

    useEffect(() => {
        ;(async () => {
            const res = await axios.get(`${process.env.SERVER_BACKEND}/live-manager/get-stream-viwers/${props.StreamToken}`)
            setLiveViews(res.data.views)
        })()
    }, [])

    return (
        <>
            <Link href={`/live?t=${props.StreamToken}`} className="w-[15vw] h-[20vh] ">
                <div
                    className="flex flex-col bg-white w-[15vw] h-[20vh] cursor-pointer"
                    onMouseEnter={() => {
                        setIsHovered(true)
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false)
                    }}
                >
                    <img src={`${process.env.FILE_SERVER}/${getCookie('userPublicToken')}/${props.StreamToken}/Thumbnail_image.jpg`} className="absolute  w-[15vw] h-[20vh]" />
                    {isHovered ? (
                        <div className="flex flex-col h-full z-10">
                            {/* top side */}
                            <div className="flex flex-row mb-auto bg-[#00000088] h-[30%]">
                                <div className="flex ml-auto mr-[1rem] z-30 ">
                                    <img src="/assets/LiveStreamIcons/LiveViwers_icon.svg" className="cursor-pointer w-[1.6rem] ml-auto mr-[.5rem]" alt="viwers image" />
                                    <h1 className="text-white self-center mr-3">{abbreviateNumber(liveViews)}</h1>
                                </div>
                            </div>
                            {/* bottom side */}
                            <div className="flex flex-row mt-auto bg-[#00000088] h-[30%]">
                                <h1 className="text-white text-lg self-center ml-3 truncate">{props.StreamTitle}</h1>
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

export default Livetemplate
