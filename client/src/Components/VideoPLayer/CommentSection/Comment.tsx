import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

interface CommentProps {
    ownerToken: string
    comment: string
    ownerName: string
}

const Comment = (props: CommentProps) => {
    return (
        <div className="flex flex-col bg-[#494949] h-[8.5rem] w-[95%] mt-[1rem] self-center">
            <div className="flex  w-full h-[4rem]">
                <Link className="ml-2 mt-2" href={'/account'}>
                    <Image src="/AccountIcon.svg" width={40} height={40} alt="Picture of the author" />
                </Link>
                <h2 className="text-white mt-4 ml-2">{props.ownerName}</h2>
            </div>
            <hr className="mt-2" />
            <div className="flex  w-[92%] self-center  h-full">
                <h1 className="text-white mt-2 text-sm">{props.comment}</h1>
            </div>
        </div>
    )
}

export default Comment
