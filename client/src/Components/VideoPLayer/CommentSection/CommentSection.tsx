'use client'
import React, { useState } from 'react'
import Image from 'next/image'

import Comment from './Comment'
import { useEffect } from 'react'
import axios from 'axios'

interface IVideoPlayerProps {
    VideoToken: string | null
    UserToken: string | null
}

interface ICommentProps {
    ownerToken: string
    videoToken: string
    comment: string
    ownerName: string
}

const CommentSection = (props: IVideoPlayerProps) => {
    const [commentInput, setCommentInput] = useState<string>('')
    const [videoComments, setVideoComments] = useState<Array<ICommentProps>>([])
    const [hasComments, setHasComments] = useState<boolean>(false)

    const postComment = async () => {
        const res = await axios.post(`${process.env.SERVER_BACKEND}/videos-manager/post-comment`, { UserToken: props.UserToken, VideoToken: props.VideoToken, Comment: commentInput })
        setVideoComments(videoComments => [...videoComments, { ownerToken: props.UserToken!, videoToken: props.VideoToken!, comment: commentInput, ownerName: res.data.userName }])
    }

    useEffect(() => {
        ;(async () => {
            const getCommentsForVideo = await axios.get(`${process.env.SERVER_BACKEND}/videos-manager/get-video-comments/${props.VideoToken}`)
            if (getCommentsForVideo.data.CommentsFound === true) {
                setHasComments(true)
                setVideoComments(getCommentsForVideo.data.comments)
            }
        })()
    }, [])

    return (
        <div className="flex flex-col ml-[.5rem] mt-[3rem] h-[85.4vh] w-[22vw] bg-[#2e2e2e] ">
            <div className="flex flex-col h-[88%] overflow-y-scroll">
                {hasComments ? (
                    <>
                        {videoComments.map((comment: ICommentProps, index: number) => (
                            <Comment key={index} ownerToken={comment.ownerToken} comment={comment.comment} ownerName={comment.ownerName} />
                        ))}
                    </>
                ) : (
                    <></>
                )}
            </div>
            <div className="flex h-[12%] bg-[#292929]">
                <input type="text" className="h-9 self-center ml-7 w-[75%] bg-[#373737] text-white indent-3" placeholder="Comment" onChange={e => setCommentInput(e.currentTarget.value)} />
                <div
                    className="flex bg-[#373737] ml-3 w-10  h-9 self-center cursor-pointer hover:bg-[#444444]"
                    onClick={() => {
                        postComment()
                    }}
                >
                    <Image className="ml-1 self-center" src="/assets/CommentsIcons/SendComment_icon.svg" width={30} height={30} alt="Send image" />
                </div>
            </div>
        </div>
    )
}

export default CommentSection
