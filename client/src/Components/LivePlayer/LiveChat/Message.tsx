import Link from 'next/link'
import React from 'react'

interface ICommentProps {
    ownerToken: string
    message: string
    ownerName: string
}

const Message = (props: ICommentProps) => {
    return (
        <div className="flex flex-col bg-[#494949] h-[8.5rem] w-[95%] mt-[1rem] self-center">
            <div className="flex  w-full h-[4rem]">
                <Link className="ml-2 mt-2" href={`/user?id=${props.ownerToken}`}>
                    <img className="z-10 rounded-full" src={`${process.env.FILE_SERVER}/${props.ownerToken}/Main_Icon.png`} width={40} height={40} alt="Picture of the author" />
                </Link>
                <h2 className="text-white mt-4 ml-2">{props.ownerName}</h2>
            </div>
            <hr className="mt-2" />
            <div className="flex  w-[92%] self-center  h-full">
                <h1 className="text-white mt-2 text-sm">{props.message}</h1>
            </div>
        </div>
    )
}

export default Message
