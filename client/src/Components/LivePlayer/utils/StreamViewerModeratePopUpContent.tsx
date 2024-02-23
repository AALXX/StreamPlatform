import React, { useEffect, useState } from 'react'
import { getViewerData } from '../UtilFunc'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { Socket } from 'socket.io-client'

interface IStreamViewerModeratePopUpContentProps {
    ownerToken: string
    channelToken: string
    clientSoket: Socket | null
}

interface IChatLog {
    message: string
    sentat: string
}

interface IUserData {
    UserName: string
    UserRole: string | null
    UserIsBanned: boolean
    ChatLogs: Array<IChatLog>
}

/**
 * User Chat Log
 * @param  {IChatLog} props
 * @return {React.JSX}
 */
const ChatLog = (props: IChatLog) => {
    const formattedDate = new Date(props.sentat).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })

    return (
        <div className="flex flex-col bg-[#494949] h-[8rem] w-[95%] mt-[1rem] self-center flex-shrink-0">
            <div className="flex  w-[92%] self-center  h-full">
                <textarea className="text-white mt-2 text-sm bg-[#494949] h-16 w-full resize-none" readOnly>
                    {props.message}
                </textarea>
            </div>
            <hr className="mt-2" />
            <div className="flex  w-[92%] self-center  h-full">
                <h1 className="text-white mt-4 text-sm">Sent at: {formattedDate}</h1>
            </div>
        </div>
    )
}

/**
 * Viewer moderete tool
 * @param {IStreamViewerModeratePopUpContentProps} props
 * @return {React.JSX}
 */
const StreamViewerModeratePopUpContent = (props: IStreamViewerModeratePopUpContentProps) => {
    const [userData, setUserData] = useState<IUserData>({ UserName: '', UserRole: '', ChatLogs: [], UserIsBanned: false })
    const [banReason, setBanReason] = useState<string>('')

    useEffect(() => {
        ;(async () => {
            const data = await getViewerData(props.ownerToken, props.channelToken)
            const sortedChatLogs = data.ChatLogs.sort((a, b) => new Date(b.sentat).getTime() - new Date(a.sentat).getTime())

            console.log(data.UserIsBanned)
            setUserData({ ...data, ChatLogs: sortedChatLogs })
        })()
    }, [props.ownerToken])

    const promoteAccount = async () => {
        const res = await axios.post(`${process.env.SERVER_BACKEND}/live-manager/promote-viewer-account`, {
            UserPrivateToken: getCookie('userToken'),
            ChannelPublicToken: props.channelToken,
            PromotedAccountToken: props.ownerToken
        })

        if (res.data.error) {
            window.alert(`an error has occured: ${res.data.errmsg}`)
        } else {
            setUserData(prevUserData => ({
                ...prevUserData,
                UserRole: 'chanel_moderator'
            }))
        }
    }

    const demoteAccount = async () => {
        const res = await axios.post(`${process.env.SERVER_BACKEND}/live-manager/demote-viewer-account`, {
            UserPrivateToken: getCookie('userToken'),
            ChannelPublicToken: props.channelToken,
            PromotedAccountToken: props.ownerToken
        })

        if (res.data.error) {
            window.alert(`an error has occured: ${res.data.errmsg}`)
        } else {
            setUserData(prevUserData => ({
                ...prevUserData,
                UserRole: null
            }))
        }
    }

    const banAccount = async () => {
        //* user private token is the user that issues the ban, accountPublic Token is teh channel token and the blocked account is the account that is to beblocked
        const res = await axios.post(`${process.env.SERVER_BACKEND}/user-account/block-user-account`, {
            UserPrivateToken: getCookie('userToken'),
            ChannelPublicToken: props.channelToken,
            BlockedAccountToken: props.ownerToken,
            BlockReason: banReason
        })

        props.clientSoket?.emit('ban-viewer', { reason: banReason })

        if (res.data.error) {
            window.alert(`an error has occured: ${res.data.errmsg}`)
        } else {
            setUserData(prevUserData => ({
                ...prevUserData,
                UserIsBanned: !prevUserData.UserIsBanned
            }))
        }
    }

    const unbanAccount = async () => {
        //* user private token is the user that issues the ban, accountPublic Token is teh channel token and the blocked account is the account that is to beblocked
        const res = await axios.post(`${process.env.SERVER_BACKEND}/user-account/unblock-user-account`, {
            UserPrivateToken: getCookie('userToken'),
            ChannelPublicToken: props.channelToken,
            BlockedAccountToken: props.ownerToken
        })

        if (res.data.error) {
            window.alert(`an error has occured: ${res.data.errmsg}`)
        } else {
            setUserData(prevUserData => ({
                ...prevUserData,
                UserIsBanned: !prevUserData.UserIsBanned
            }))
        }
    }

    return (
        <div className="flex flex-col w-full h-full ">
            <div className="flex bg-[#3A3A3A] w-[30rem] h-[5rem] mt-8 self-center flex-shrink-0">
                <img className="z-10 rounded-full self-center ml-5" src={`${process.env.FILE_SERVER}/${props.ownerToken}/Main_icon.png`} width={50} height={50} alt="Picture of the author" />
                <h1 className="text-white self-center ml-6 text-[1.3rem]">{userData.UserName}</h1>
                <div className="h-full w-[0.1rem] bg-white ml-16"></div>
                {userData.UserRole !== null ? <h1 className="text-white self-center ml-6 text-[1.3rem]">Role: {userData.UserRole}</h1> : <h1 className="text-white self-center ml-6 text-[1.3rem]">Role: None</h1>}
            </div>
            <div className="flex self-center w-[90%] mt-10">
                {userData.UserRole !== 'channel_owner' ? (
                    <>
                        {userData.UserIsBanned == true ? (
                            <button
                                className="bg-[#3A3A3A] h-[4rem] w-[9rem] text-[#da7474]"
                                onClick={async () => {
                                    await unbanAccount()
                                }}
                            >
                                Unban Account
                            </button>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder="reason"
                                    className="bg-[#3A3A3A] mr-2 indent-2 text-white"
                                    value={banReason}
                                    onChange={e => {
                                        setBanReason(e.target.value)
                                    }}
                                />

                                <button
                                    className="bg-[#3A3A3A] h-[4rem] w-[9rem] text-[#da7474]"
                                    onClick={async () => {
                                        await banAccount()
                                    }}
                                >
                                    Ban Account
                                </button>
                            </>
                        )}
                    </>
                ) : null}

                {userData.UserRole === null ? (
                    <>
                        <button
                            className=" bg-[#3A3A3A] h-[4rem] w-[9rem] ml-auto text-white"
                            onClick={async () => {
                                await promoteAccount()
                            }}
                        >
                            Promote Account
                        </button>
                    </>
                ) : (
                    <>
                        {userData.UserRole !== 'channel_owner' ? (
                            <button
                                className=" bg-[#3A3A3A] h-[4rem] w-[9rem] ml-auto text-white"
                                onClick={async () => {
                                    await demoteAccount()
                                }}
                            >
                                Demote Account
                            </button>
                        ) : null}
                    </>
                )}
            </div>
            <hr className="mt-4 w-[90%] self-center" />
            <h1 className="text-white text-lg mt-5 ml-12">Chat Logs:</h1>
            <div className="flex flex-col w-[90%] self-center h-[60%] bg-[#3A3A3A] mt-2 ">
                {Object.keys(userData.ChatLogs).length > 0 ? (
                    <>
                        <div className="flex  flex-col w-full h-full overflow-y-scroll">
                            {userData.ChatLogs.map((log: IChatLog, index: number) => (
                                <ChatLog key={index} message={log.message} sentat={log.sentat} />
                            ))}
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
}

export default StreamViewerModeratePopUpContent
