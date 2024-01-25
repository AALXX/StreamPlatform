import React from 'react'

interface IAboutChanelProps {
    userDescription: string
}

const AboutChanelTab = (props: IAboutChanelProps) => {
    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col bg-[#4B4B4B] w-[35rem] h-[30vh]">
                <h1 className="text-white text-lg mt-3 ml-3">Description:</h1>
                <hr className="mt-3" />
                <h1 className="text-white text-lg mt-3 ml-3">{props.userDescription}</h1>

                <hr className="mt-auto mb-8" />
            </div>
            <div className="flex flex-col bg-[#4B4B4B] w-[35rem] h-[30vh] ml-auto">
                <h1 className="text-white text-lg mt-3 ml-3">Statistics:</h1>
                <hr className="mt-3" />
            </div>
        </div>
    )
}
export default AboutChanelTab
 