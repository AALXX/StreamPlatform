import Link from 'next/link'
import React from 'react'
import { ICommentProps } from '../ILiveChat'

//TODO: DELTE THIS FILE

const MessageAdmin = (props: ICommentProps) => {
    return (
        <div className="flex flex-col bg-[#494949] h-[8.5rem] w-[95%] mt-[1rem] self-center">
            <div className="flex  w-full h-[4rem]">
                <Link className="ml-2 mt-2" href={`/user?id=${props.ownerToken}`}>
                    <img className="z-10 rounded-full" src={`${process.env.FILE_SERVER}/${props.ownerToken}/Main_Icon.png`} width={40} height={40} alt="Picture of the author" />
                </Link>
                <h2 className="text-white self-center ml-4">{props.ownerName}</h2>
                {props.isStreamer ? <img src="/assets/LiveStreamIcons/streamer_crown_icon.svg" width={20} height={20} className="ml-2" /> : null}
            </div>
            <hr className="mt-2" />
            <div className="flex  w-[92%] self-center  h-full">
                <h1 className="text-white mt-2 text-sm">{props.message}</h1>
            </div>
        </div>
    )
}

export default MessageAdmin
