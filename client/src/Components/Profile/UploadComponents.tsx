'use client'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { getCookie } from 'cookies-next'

interface ClipProps {
    url: string
}

//* Video PriviewComponent
const Clip = ({ url }: ClipProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const previousUrl = useRef(url)

    useEffect(() => {
        if (previousUrl.current === url) {
            return
        }

        if (videoRef.current) {
            videoRef.current.load()
        }

        previousUrl.current = url
    }, [url])

    if (url == '') {
        return (
            <div className="flex border-2 border-[#464646] w-[25rem] h-[15rem] flex-col mt-4">
                <h1 className="text-white text-[1.3rem] m-auto">No video Inputed</h1>
            </div>
        )
    }

    return (
        <video ref={videoRef} controls className="border-[#464646] w-[25rem] h-[15rem] border-2 mt-4">
            <source src={url} />
        </video>
    )
}

const UploadComopnents = () => {
    //* Video attributes states
    const [videoTitle, setvideoTitle] = useState('')
    const [videoVisibility, setvideoVisibility] = useState('public')

    //* Video object states
    const [videoFile, setvideoFile] = useState<FileList | null>(null)
    const [ObjectUrl, setObjectUrl] = useState<string>('')

    //* Upload Progress State
    const [progress, setProgress] = useState(0)

    //* Uploads Video to server
    const uploadFile = () => {
        if (videoFile![0] == null) {
            return window.alert('No Video file inputed')
        }

        const userToken: string = getCookie('userToken') as string
        
        const formData = new FormData()
        formData.append('VideoFile', videoFile![0])
        formData.append('VideoTitle', videoTitle)
        formData.append('VideoVisibility', videoVisibility)
        formData.append('UserPrivateToken', userToken)

        const config = {
            header: { 'content-type': 'multipart/formdata' },
            onUploadProgress: (progressEvent: any) => {
                let percent = 0
                const { loaded, total } = progressEvent
                percent = Math.floor((loaded * 100) / total) //* set percent
                if (percent <= 100) {
                    setProgress(percent)
                }
            }
        }

        axios.post(`${process.env.SERVER_BACKEND}/videos-manager/upload-video`, formData, config).then(res => {
            console.log(res.data)
        })
    }

    // *Creates a Url for preview video
    const previewVideo = (e: any) => {
        e.preventDefault()
        setObjectUrl(URL.createObjectURL(e.target.files[0]))
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row items-center w-[100%] h-[19rem] ">
                <label htmlFor="VideoFile" className="flex border-2 border-white border-solid w-[20rem] h-[10rem] ml-[3vw] cursor-pointer">
                    <input
                        type="file"
                        className="hidden"
                        id="VideoFile"
                        onChange={e => {
                            setvideoFile(e.target.files)
                            previewVideo(e)
                            setProgress(0)
                        }}
                        accept=".mov,.mp4"
                    />
                    <img src="/assets/UploadPageIcons/VideoUploadIcon.svg" alt="AccountImageButton" className="m-auto w-[7rem] h-[2rem]" />
                </label>
                <div className="flex w-[100%] h-[52%] flex-col items-center">
                    <div className="relative h-[1.2rem] w-[62%] bg-[#292929] m-auto overflow-x-hidden rounded">
                        <div className="absolute h-[100%] rounded bg-blue-500" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex flex-col items-center">
                        <input
                            className="bg-[#414141] border-hidden w-[20rem] text-white mt-[2vh] text-center"
                            type="text"
                            placeholder="Video Title"
                            onChange={e => {
                                setvideoTitle(e.target.value)
                            }}
                        />

                        <select name="videoVisibility" onChange={e => setvideoVisibility(e.target.value)} className="w-[20rem] mt-[2vh] bg-[#414141] text-white border-hidden">
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>

                        <button
                            className="text-white mt-5 bg-[#414141] w-[20rem]"
                            onClick={() => {
                                uploadFile()
                            }}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>

            <hr color="#7c7c7c" className="w-[95%]" />

            <div className="flex flex-col w-[95%]">
                <h1 className="text-white text-[1.3rem] mt-4">Preview:</h1>
                <Clip url={ObjectUrl} />
            </div>
        </div>
    )
}

export default UploadComopnents
