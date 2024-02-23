import Link from 'next/link'
import React, { useState } from 'react'
import { ICommentProps } from '../ILiveChat'

const Message = (props: ICommentProps) => {
    return (
        <div className="flex flex-col bg-[#494949] h-[8.5rem] w-[95%] mt-[1rem] self-center flex-shrink-0z">
            <div className="flex  w-full h-[4rem]">
                <Link className="ml-2 mt-2" href={`/user?id=${props.ownerToken}`}>
                    <img className="z-10 rounded-full" src={`${process.env.FILE_SERVER}/${props.ownerToken}/Main_Icon.png`} width={40} height={40} alt="Picture of the author" />
                </Link>
                <h2 className="text-white self-center ml-4">{props.ownerName}</h2>
                {props.commentatorRole === 'channel_owner' ? (
                    <>
                        <img src="/assets/LiveStreamIcons/streamer_crown_icon.svg" width={20} height={20} className="ml-2" />
                    </>
                ) : null}

                {props.viewerRole === 'channel_owner' || props.viewerRole === 'chanel_moderator' ? (
                    <>
                        <img src="/assets/AccountIcons/Settings_icon.svg" width={25} height={25} alt="SettingsIcon" className="ml-auto mr-4 cursor-pointer" onClick={props.onSelect} />
                    </>
                ) : null}
            </div>
            <hr className="mt-2" />
            <div className="flex  w-[92%] self-center  h-full">
                <textarea className="text-white mt-2 text-sm bg-[#494949] h-16 w-full resize-none" readOnly>
                    {props.message}
                </textarea>
            </div>
        </div>
    )
}

export default Message
