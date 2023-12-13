import React, { ReactNode } from 'react'

interface IPopupCanvasProps {
    closePopup: () => void
    children: ReactNode
}

const PopupCanvas = (props: IPopupCanvasProps) => {
    return (
        <div className="fixed w-[100%] h-[100%] top-0 left-0 right-0 bottom-0 m-auto bg-[#0000005b] z-10">
            <div className="flex flex-col absolute left-[25%] right-[25%] top-[25%] bottom-[25%] w-[50vw] h-[88vh] m-auto bg-[#464646] border-[2px] border-solid border-b-[#656565] z-10 overflow-y-scroll items-center">
                <button className="text-[#ffffff] bg-transparent outline-none cursor-pointer ml-auto mt-[1vh] mr-[1vw]" onClick={props.closePopup}>
                    &#9587;
                </button>
                <div>{props.children}</div>
            </div>
        </div>
    )
}

export default PopupCanvas