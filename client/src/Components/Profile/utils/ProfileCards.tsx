import React, { Dispatch, SetStateAction } from 'react'

interface IProfileCardsProps {
    Title: string
    TabName: string
    setComponentToShow: Dispatch<SetStateAction<string>>
}

const ProfileCards = (props: IProfileCardsProps) => {
    return (
        <div
            className="flex flex-col bg-[#6b6b6b62] w-[10rem] h-[3rem] justify-center ml-1 cursor-pointer"
            onClick={() => {
                props.setComponentToShow(props.TabName)
            }}
        >
            <h1 className="text-white self-center text-xl">{props.Title}</h1>
        </div>
    )
}

export default ProfileCards
