'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import Message from './Message'
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import { ICommentProps, ILiveChatProps } from '../ILiveChat'
import PopupCanvas from '@/Components/Util/PopupCanvas'
import StreamViewerModeratePopUpContent from '../utils/StreamViewerModeratePopUpContent'

const LiveChat = (props: ILiveChatProps) => {
    const [commentInput, setCommentInput] = useState<string>('')
    const [liveMessages, setliveMessages] = useState<Array<ICommentProps>>([])
    const [ToggleChatModerationPopup, setToggleChatModerationPopup] = useState<boolean>(false)
    const [ownerToken, setOwnerToken] = useState<string>('')

    useEffect(() => {
        if (props.ClientSocket) {
            props.ClientSocket.on('recived-message', ({ message, ownerName, ownerToken, userRole }) => {
                setliveMessages(liveMessages => [...liveMessages, { ownerToken, message, ownerName, commentatorRole: userRole, viewerRole: props.UserRole, channelToken: props.channelToken }])
            })
        }
    }, [props.ClientSocket])

    const postMessage = (e: any) => {
        e.preventDefault()
        props.ClientSocket?.emit('send-message', { message: commentInput, LiveToken: props.LiveToken, UserPrivateToken: getCookie('userToken') as string, userRole: props.UserRole })
    }

    return (
        <div className="flex flex-col ml-[.5rem] mt-[3rem] h-[85.4vh] w-[22vw] bg-[#2e2e2e] ">
            <div className="flex flex-col h-[88%] overflow-y-scroll">
                {Object.keys(liveMessages).length > 0 ? (
                    <>
                        {liveMessages.map((comment: ICommentProps, index: number) => (
                            <Message
                                key={index}
                                ownerToken={comment.ownerToken}
                                message={comment.message}
                                ownerName={comment.ownerName}
                                commentatorRole={comment.commentatorRole}
                                viewerRole={props.UserRole}
                                channelToken={props.channelToken}
                                onSelect={() => {
                                    console.log('CUM')
                                    setToggleChatModerationPopup(true)
                                    setOwnerToken(comment.ownerToken)
                                }}
                            />
                        ))}
                    </>
                ) : (
                    <></>
                )}
            </div>
            {props.userLoggedIn ? (
                <form className="flex h-[12%] bg-[#292929]" onSubmit={postMessage}>
                    <input type="text" className="h-9 self-center ml-7 w-[75%] bg-[#373737] text-white indent-3" placeholder="Comment" onChange={e => setCommentInput(e.currentTarget.value)} />
                    <label className="flex bg-[#373737] ml-3 w-10  h-9 self-center cursor-pointer hover:bg-[#444444]" htmlFor="PostButton">
                        <Image className="ml-1 self-center" src="/assets/CommentsIcons/SendComment_icon.svg" width={30} height={30} alt="Send image" />
                        <input type="submit" className="hidden" id="PostButton" />
                    </label>
                </form>
            ) : (
                <div className="flex h-[12%] bg-[#292929] justify-center">
                    <Link className="self-center" href={'/account/login-register'}>
                        <h1 className="text-white self-center text-xl">To Send Messages, Please Log In! </h1>
                    </Link>
                </div>
            )}

            {ToggleChatModerationPopup ? (
                <PopupCanvas
                    closePopup={() => {
                        setToggleChatModerationPopup(!ToggleChatModerationPopup)
                    }}
                >
                    <StreamViewerModeratePopUpContent ownerToken={ownerToken} channelToken={props.channelToken} />
                </PopupCanvas>
            ) : null}
        </div>
    )
}

export default LiveChat
