'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProfileCards from '@/Components/Profile/utils/ProfileCards'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { isLoggedIn } from '@/security/Accounts'
import Link from 'next/link'

const EditVideo = () => {
    const urlParams = useSearchParams() //* t =  search query

    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)

    const [videoNotFoundScreen, setVideoNotFoundScreen] = useState<boolean>(false)
    const [componentToShow, setComponentToShow] = useState<string>('Thumbnails')
    const [videoTitle, setVideoTitle] = useState<string>('')
    const [publishDate, setPublishDate] = useState<string>('')
    const [videoVisibility, setVideoVisibility] = useState<string>('')
    const [videoLikes, setVideoLikes] = useState<number>(0)
    const [videoDislikes, setVideoDislikes] = useState<number>(0)
    const [videoOwnerToken, setVideoOwnerToken] = useState<string>('')
    const [showComments, setShowComments] = useState<boolean>(false)
    const [showLikesDislikes, setShowLikesDislikes] = useState<boolean>(false)

    let component

    useEffect(() => {
        ;(async () => {
            const usrLoggedIn = await isLoggedIn()
            setUserLoggedIn(usrLoggedIn)

            const res = await axios.get(`${process.env.SERVER_BACKEND}/videos-manager/get-creator-video-data/${urlParams.get('t')}`)
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
            VideoToken: urlParams.get('t'),
            UserPrivateToken: getCookie('userToken')
        })

        if (res.data.error === true) {
            return window.alert('Sorry, an error has ocured')
        } else {
            return window.alert('Succesfully Updated')
        }
    }

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

    if (videoNotFoundScreen) {
        return <>video Not Found</>
    }

    return (
        <div className="flex flex-col">
            {userLoggedIn ? (
                <>
                    <div className="flex h-[40vh] ">
                        <div className="flex bg-[#ffffff] w-[26rem] h-[16rem] mt-[5rem] ml-[5rem]">
                            <img src={`${process.env.FILE_SERVER}/${videoOwnerToken}/${urlParams.get('t')}/Thumbnail_image.jpg`} className="fixed w-[26rem] h-[16rem]" />
                        </div>

                        <form
                            className="flex flex-col items-center mt-[5rem] ml-auto mr-[35rem]"
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
                    </div>
                    <div className="flex h-[6.2vh]  items-center ">
                        <ProfileCards Title="THUMBNALS" TabName="Thumbnails" setComponentToShow={setComponentToShow} />
                        <ProfileCards Title="ANALYTICS" TabName="Analytics" setComponentToShow={setComponentToShow} />
                        <ProfileCards Title="EDITOR" TabName="editor" setComponentToShow={setComponentToShow} />
                    </div>
                    <hr className="w-[100%]" />
                    <div className="flex w-[95%] mt-[2vh] self-center h-[60vh] ">{component}</div>
                </>
            ) : (
                <>
                    <h1 className="text-white self-center mt-[2rem]">Not logged In:</h1>
                    <Link className="self-center" href={'/account/login-register'}>
                        <h1 className="text-white">Login</h1>
                    </Link>
                </>
            )}
        </div>
    )
}

export default EditVideo
