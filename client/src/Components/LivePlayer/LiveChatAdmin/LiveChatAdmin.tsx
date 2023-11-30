import React, { useState } from 'react'
import Image from 'next/image'

import Comment from './MessageAdmin'
import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { getCookie } from 'cookies-next'
import { isLoggedIn } from '@/security/Accounts'
import Link from 'next/link'
import { ICommentProps, ILiveChatProps } from '../ILiveChat'

const LiveChatAdmin = (props: ILiveChatProps) => {
    const [commentInput, setCommentInput] = useState<string>('')
    const [liveMessages, setliveMessages] = useState<Array<ICommentProps>>([])
    const [socket, setSocket] = useState<Socket | null>(null)

    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        console.log(props.LiveToken)
        const loginAync = async () => {
            const usrLoggedIn = await isLoggedIn()
            setUserLoggedIn(usrLoggedIn)
        }
        loginAync()

        // Connect to the Socket.IO server
        const newSocket = io(process.env.LIVE_CHAT_SERVER as string) // Replace with your server URL
        setSocket(newSocket)

        newSocket.emit('join-live', { LiveToken: props.LiveToken })

        newSocket.on('recived-message', ({ message, ownerName, ownerToken, isStreamer }) => {
            console.log(message)
            setliveMessages(liveMessages => [...liveMessages, { ownerToken: ownerToken, message: message, ownerName: ownerName, isStreamer: isStreamer }])
        })

        // Cleanup on unmount
        return () => {
            newSocket.disconnect()
        }
    }, [props.LiveToken])

    const postMessage = (e: any) => {
        e.preventDefault()
        socket?.emit('send-message', { message: commentInput, LiveToken: props.LiveToken, UserPrivateToken: getCookie('userToken') as string })
    }

    return (
        <div className="flex flex-col ml-[.5rem] mt-[3rem] h-[85.4vh] w-[22vw] bg-[#2e2e2e] ">
            <div className="flex flex-col h-[88%] overflow-y-scroll">
                {Object.keys(liveMessages).length > 0 ? (
                    <>
                        {liveMessages.map((comment: ICommentProps, index: number) => (
                            <Comment key={index} ownerToken={comment.ownerToken} message={comment.message} ownerName={comment.ownerName} isStreamer={comment.isStreamer} />
                        ))}
                    </>
                ) : (
                    <></>
                )}
            </div>
            {userLoggedIn ? (
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
        </div>
    )
}

export default LiveChatAdmin
