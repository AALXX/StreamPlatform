import React, { useEffect, useState } from 'react'
import VideoTamplate, { IVideoTemplateProps } from '../CreatorTemplates/VideoTemplate'
import axios from 'axios'

const SearchResults = ({ searchInput }: { searchInput: string }) => {
    const [videosList, setVideoList] = useState<Array<IVideoTemplateProps>>([])
    useEffect(() => {
        ;(async () => {
            if (searchInput == '') {
                setVideoList([])
            } else {
                const res = await axios.get(`${process.env.SERVER_BACKEND}/videos-manager/search-video/${searchInput}`)
                setVideoList(res.data.Videos)
                console.log(res.data.Videos)
            }
        })()
    }, [])

    return (
        <>
            {Object.keys(videosList).length === 0 ? (
                <div>
                    <h1>SEARCH NOT FOUND</h1>
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className="grid xl:grid-cols-6 lg:grid-cols-5 gap-4 mt-[4vh] overflow-y-hidden self-center">
                        {videosList.map((video: IVideoTemplateProps, index: number) => (
                            <VideoTamplate
                                key={index}
                                VideoTitle={video.VideoTitle}
                                VideoToken={video.VideoToken}
                                OwnerName={video.OwnerName}
                                OwnerToken={video.OwnerToken}
                                Likes={video.Likes}
                                Dislikes={video.Dislikes}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default SearchResults
