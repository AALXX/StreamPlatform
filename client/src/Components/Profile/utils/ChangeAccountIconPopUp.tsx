'use client'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { getCookie } from 'cookies-next'

interface IconProps {
    url: string
}

//* Icon Priview Component
const Icon = ({ url }: IconProps) => {
    const previousUrl = useRef(url)

    useEffect(() => {
        if (previousUrl.current === url) {
            return
        }

        previousUrl.current = url
    }, [url])

    if (url == '') {
        return (
            <div className="flex border-2 border-[#757575] w-full h-[10rem] flex-col rounded-full">
                <h1 className="text-white text-[0.8rem] m-auto">No image Inputed</h1>
            </div>
        )
    }

    return <img src={url} alt="" className="rounded-full" />
}

const ChangeAccountIconPopUp = () => {
    //* Video object states
    const [iconFile, setIconFile] = useState<FileList | null>(null)
    const [ObjectUrl, setObjectUrl] = useState<string>('')

    // *Creates a Url for preview video
    const previewIcon = (e: any) => {
        e.preventDefault()
        setObjectUrl(URL.createObjectURL(e.target.files[0]))
    }

    const changeIconSubmit = () => {
        if (iconFile![0] == null) {
            return window.alert('No Video file inputed')
        }

        const userToken: string = getCookie('userToken') as string

        const formData = new FormData()
        formData.append('iconFile', iconFile![0])
        formData.append('userToken', userToken)

        const config = {
            headers: { 'content-type': 'multipart/formdata' }
        }

        axios.post(`${process.env.SERVER_BACKEND}/user-account/change-user-icon`, formData, config).then(res => {
            console.log(res.data)
        })
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-col w-full items-center">
                <h1 className="text-[#ffffff] text-xl">Change Icon</h1>
                <hr color="#656565" className="w-[85%] mt-[1rem]" />
                <div className="flex w-[85%] mt-14">
                    <label htmlFor="iconFile" className="flex border-2  border-[#757575] border-solid w-[20rem] h-[10rem]  cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            id="iconFile"
                            onChange={e => {
                                setIconFile(e.target.files)
                                previewIcon(e)
                            }}
                            accept=".jpg,.png"
                        />
                        <img src="/assets/UploadPageIcons/VideoUploadIcon.svg" alt="AccountImageButton" className="m-auto w-[7rem] h-[2rem]" />
                    </label>

                    <div className="flex flex-col w-[10rem]  ml-auto">
                        <Icon url={ObjectUrl} />
                    </div>
                </div>
            </div>
            <hr color="#656565" className="w-[85%] mt-[4rem] self-center" />
            <div className="w-[85%] self-center">
                <button
                    className="bg-[#575757] border-none text-white mt-[1.5rem] h-[2.5rem] w-full cursor-pointer hover:bg-[#525252] active:bg-[#2b2b2b]"
                    onClick={() => {
                        changeIconSubmit()
                    }}
                >
                    Change Icon
                </button>
            </div>
        </div>
    )
}

export default ChangeAccountIconPopUp
