import React, { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import ProfileCards from '@/Components/Profile/utils/ProfileCards'
import axios from 'axios'
import PopupCanvas from '@/Components/Util/PopupCanvas'

const EditVideoComponent = ({ videoToken }: { videoToken: string }) => {
    const [ToggleDeleteVideoPopup, setToggleDeleteVideoPopup] = useState<boolean>(false)

    const [componentToShow, setComponentToShow] = useState<string>('Thumbnails')
    const [videoTitle, setVideoTitle] = useState<string>('')
    const [publishDate, setPublishDate] = useState<string>('')
    const [videoVisibility, setVideoVisibility] = useState<string>('')
    const [videoLikes, setVideoLikes] = useState<number>(0)
    const [videoDislikes, setVideoDislikes] = useState<number>(0)
    const [videoOwnerToken, setVideoOwnerToken] = useState<string>('')
    const [showComments, setShowComments] = useState<boolean>(false)
    const [showLikesDislikes, setShowLikesDislikes] = useState<boolean>(false)


    const [thumbnalFile, setThumbnalFile] = useState<File | null>(null)
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [videoNotFoundScreen, setVideoNotFoundScreen] = useState<boolean>(false)

    let component

    useEffect(() => {
        ;(async () => {
            const res = await axios.get(`${process.env.SERVER_BACKEND}/videos-manager/get-creator-video-data/${videoToken}`)
            setVideoNotFoundScreen(res.data.error)
            setVideoTitle(res.data.VideoTitle)
            setPublishDate(res.data.PublishDate)
            setVideoVisibility(res.data.VideoVisibility)
            setVideoLikes(res.data.VideoLikes)
            setVideoDislikes(res.data.VideoDislikes)
            setVideoOwnerToken(res.data.OwnerToken)
            setShowComments(res.data.ShowComments)
            setShowLikesDislikes(res.data.ShowLikesDislikes)
        })()
    }, [])

    const updateVideoData = async () => {
        const res = await axios.post(`${process.env.SERVER_BACKEND}/videos-manager/update-creator-video-data`, {
            VideoTitle: videoTitle,
            VideoVisibility: videoVisibility,
            ShowComments: showComments,
            ShowLikesDislikes: showLikesDislikes,
            VideoToken: videoToken,
            UserPrivateToken: getCookie('userToken')
        })

        if (res.data.error === true) {
            return window.alert('Sorry, an error has ocured')
        } else if (res.data.error === false) {
            return window.alert('Succesfully Updated')
        }
    }

    const deleteVideo = async () => {
        const res = await axios.post(`${process.env.SERVER_BACKEND}/videos-manager/delete-video`, {
            VideoToken: videoToken,
            UserPrivateToken: getCookie('userToken')
        })

        if (res.data.error === true) {
            return window.alert('Sorry, an error has ocured')
        } else {
            return window.alert('Succesfully Deleted')
        }
    }

    const changeVideoThumbnail = async () => {
        if (thumbnalFile == null) {
            return window.alert('No Video file inputed')
        }

        const userToken: string = getCookie('userToken') as string

        const formData = new FormData()
        formData.append('VideoThumbnail', thumbnalFile!)
        formData.append('UserPrivateToken', userToken)
        formData.append('VideoToken', videoToken as string)

        const config = {
            headers: { 'content-type': 'multipart/formdata' }
        }

        const res = await axios.post(`${process.env.SERVER_BACKEND}/videos-manager/change-thumbnail`, formData, config)

        if (res.data.error === true) {
            return window.alert('Sorry, an error has ocured')
        } else {
            return window.alert('Succesfully Changed thumbnail')
        }
    }

    switch (componentToShow) {
        case 'Thumbnails':
            if (thumbnalFile !== null) {
                component = (
                    <div className="flex flex-col w-[15rem] h-[11rem] ">
                        <label
                            htmlFor="thumbnailFile"
                            className="flex flex-col border-2 border-white border-solid w-full h-[9rem] cursor-pointer "
                            onMouseEnter={() => {
                                setIsHovered(true)
                            }}
                            onMouseLeave={() => {
                                setIsHovered(false)
                            }}
                        >
                            {isHovered ? (
                                <div className="flex flex-col absolute h-[8.5rem]  w-[14.5rem]">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="thumbnailFile"
                                        onChange={e => {
                                            setThumbnalFile(e.target.files![0])
                                        }}
                                    />
                                    <img src="/assets/UploadPageIcons/VideoUploadIcon.svg" alt="AccountImageButton" className="self-center mt-11 w-[7rem] h-[2rem]" />

                                    <h1 className="text-white text-[1rem] self-center">upload thumbnail</h1>
                                </div>
                            ) : null}

                            <img src={URL.createObjectURL(thumbnalFile)} alt="AccountImageButton" className=" w-full h-full " />
                        </label>
                        <button
                            className="text-white bg-[#414141] w-full mt-auto cursor-pointer"
                            onClick={async () => {
                                await changeVideoThumbnail()
                            }}
                        >
                            Update
                        </button>
                    </div>
                )
            } else {
                component = (
                    <label
                        htmlFor="thumbnailFile"
                        className="flex flex-col border-2 border-white border-solid w-[15rem] h-[9rem]  cursor-pointer "
                        onMouseEnter={() => {
                            setIsHovered(true)
                        }}
                        onMouseLeave={() => {
                            setIsHovered(false)
                        }}
                    >
                        <img
                            src={`${process.env.FILE_SERVER}/${videoOwnerToken}/${videoToken}/Thumbnail_image.jpg`}
                            alt={`Frame`}
                            className="border-2 border-white border-solid w-[15rem] h-[9rem] mt-auto cursor-pointer"
                        />
                        {isHovered ? (
                            <div className="flex flex-col absolute bg-[#0000005b] h-[8.3rem]  w-[14.5rem] mt-1 ml-[0.12rem]">
                                <input
                                    type="file"
                                    className="hidden"
                                    id="thumbnailFile"
                                    onChange={e => {
                                        setThumbnalFile(e.target.files![0])
                                    }}
                                />
                                <img src="/assets/UploadPageIcons/VideoUploadIcon.svg" alt="AccountImageButton" className="self-center mt-11 w-[7rem] h-[2rem]" />
                                <h1 className="text-white text-[1rem] self-center">upload thumbnail</h1>
                            </div>
                        ) : null}
                    </label>
                )
            }
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

    if (videoNotFoundScreen) {
        return <>video Not Found</>
    }

    return (
        <>
            <div className="flex h-[40vh] ">
                <div className="flex bg-[#ffffff] w-[26rem] h-[16rem] mt-[5rem] ml-[5rem]">
                    <img src={`${process.env.FILE_SERVER}/${videoOwnerToken}/${videoToken}/Thumbnail_image.jpg`} className="absolute w-[26rem] h-[16rem]" />
                </div>

                <div className="mt-[5rem] ml-auto mr-[35rem]">
                    <form
                        className="flex flex-col items-center"
                        onSubmit={async e => {
                            e.preventDefault()
                            await updateVideoData()
                        }}
                    >
                        <input
                            className="bg-[#414141] border-hidden w-[25rem] text-white mt-[2vh] text-center"
                            type="text"
                            value={videoTitle}
                            placeholder="Video Title"
                            onChange={e => {
                                setVideoTitle(e.target.value)
                            }}
                        />

                        <select name="videoVisibility" value={videoVisibility} onChange={e => setVideoVisibility(e.target.value)} className="w-[25rem] mt-[2vh] bg-[#414141] text-white border-hidden">
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                        <div className="flex w-[25rem] bg-[#414141] mt-5 h-[1.5rem] ">
                            <input type="checkbox" className="self-center bg-[#000000] m-[1rem]" checked={showComments} onChange={e => setShowComments(e.target.checked)} />
                            <h1 className="text-white self-center ml-[6rem] text-sm">Show Comments</h1>
                        </div>
                        <div className="flex w-[25rem] bg-[#414141] mt-5 h-[1.5rem]">
                            <input type="checkbox" className="self-center bg-[#000000] m-[1rem]" checked={showLikesDislikes} onChange={e => setShowLikesDislikes(e.target.checked)} />
                            <h1 className="text-white self-center ml-[6rem]  text-sm">Show Likes/Dislikes</h1>
                        </div>
                        <input type="submit" className="text-white mt-5 bg-[#414141] w-[25rem] cursor-pointer" value="Update" />
                    </form>

                    <button
                        className="text-white mt-5 bg-[#961a1a] w-[25rem] cursor-pointer"
                        onClick={() => {
                            setToggleDeleteVideoPopup(!ToggleDeleteVideoPopup)
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
            {ToggleDeleteVideoPopup ? (
                <PopupCanvas
                    closePopup={() => {
                        setToggleDeleteVideoPopup(!ToggleDeleteVideoPopup)
                    }}
                >
                    <div className="flex flex-col">
                        <h1 className="text-white self-center text-xl">Are you sure you want to delete the video</h1>

                        <button
                            className="text-white mt-5 bg-[#961a1a] w-[25rem] cursor-pointer"
                            onClick={async () => {
                                await deleteVideo()
                            }}
                        >
                            Yes
                        </button>
                    </div>
                </PopupCanvas>
            ) : null}
            <div className="flex h-[6.2vh]  items-center ">
                <ProfileCards Title="THUMBNALS" TabName="Thumbnails" setComponentToShow={setComponentToShow} />
                <ProfileCards Title="ANALYTICS" TabName="Analytics" setComponentToShow={setComponentToShow} />
                <ProfileCards Title="EDITOR" TabName="editor" setComponentToShow={setComponentToShow} />
            </div>
            <hr className="w-[100%]" />
            <div className="flex w-[95%] mt-[2vh] self-center h-[60vh] ">{component}</div>
        </>
    )
}

export default EditVideoComponent
