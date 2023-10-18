'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProfileCards from '@/Components/Profile/utils/ProfileCards'
import axios from 'axios'

const EditVideo = () => {
    const urlParams = useSearchParams() //* t =  search query
    const [componentToShow, setComponentToShow] = useState<string>('Thumbnails')
    let component

    useEffect(() => {
        ;(async () => {
            const res = await axios.get(`${process.env.SEARCH_SERVER}/search/${urlParams.get('q')}`)
        })()
    }, [])

    switch (componentToShow) {
        case 'Thumbnails':
            component = <div></div>
            break
        case 'Analytics':
            component = <></>

            break
        case 'editor':
            component = <></>
            break
        default:
            component = <div>No matching component found</div>
    }

    return (
        <div className="flex flex-col">
            <div className="flex h-[40vh] ">
                <div className="flex bg-[#ffffff] w-[26rem] h-[16rem] mt-[5rem] ml-[5rem]"></div>
                <div className="flex flex-col items-center mt-[5rem] ml-auto mr-[35rem]">
                    <input
                        className="bg-[#414141] border-hidden w-[25rem] text-white mt-[2vh] text-center"
                        type="text"
                        placeholder="Video Title"
                        onChange={e => {
                            setvideoTitle(e.target.value)
                        }}
                    />

                    <select name="videoVisibility" onChange={e => setvideoVisibility(e.target.value)} className="w-[25rem] mt-[2vh] bg-[#414141] text-white border-hidden">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    <div className="flex w-[25rem] bg-[#414141] mt-5 h-[1.5rem] ">
                        <input type="checkbox" className="self-center bg-[#000000] m-[1rem]" />
                        <h1 className="text-white self-center ml-[6rem] text-sm">Show Comments</h1>
                    </div>
                    <div className="flex w-[25rem] bg-[#414141] mt-5 h-[1.5rem]">
                        <input type="checkbox" className="self-center bg-[#000000] m-[1rem]" />
                        <h1 className="text-white self-center ml-[6rem]  text-sm">Show Likes/Dislikes</h1>
                    </div>
                    <button className="text-white mt-5 bg-[#414141] w-[25rem]" onClick={() => {}}>
                        Upload
                    </button>
                </div>
            </div>
            <div className="flex h-[6.2vh]  items-center ">
                <ProfileCards Title="THUMBNALS" TabName="Thumbnails" setComponentToShow={setComponentToShow} />
                <ProfileCards Title="ANALYTICS" TabName="Analytics" setComponentToShow={setComponentToShow} />
                <ProfileCards Title="EDITOR" TabName="editor" setComponentToShow={setComponentToShow} />
            </div>
            <hr className="w-[100%]" />
            <div className="flex w-[95%] mt-[2vh] self-center h-[60vh] ">{component}</div>
        </div>
    )
}

export default EditVideo
