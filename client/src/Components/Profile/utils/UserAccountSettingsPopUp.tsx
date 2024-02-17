'use client'
import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react'
import { getCookie } from 'cookies-next'
import { accLogout, deleteAccount } from '@/security/Accounts'

interface IAccoutSettingsPopupProps {
    UserName: string
    UserEmail: string
    UserVisibility: string
    UserDescription: string
    UserPrivateToken: string
    closePopup: () => void
}

const AccoutSettingsPopup = (props: IAccoutSettingsPopupProps) => {
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [Visibility, setVisibility] = useState('')
    const [description, setDescription] = useState('')
    const userToken: string = getCookie('userToken') as string

    const [sure, setSure] = useState(false)

    useEffect(() => {
        setUserName(props.UserName)
        setEmail(props.UserEmail)
        setVisibility(props.UserVisibility)
        setDescription(props.UserDescription)
    }, [])

    const changeUserData = () => {
        axios
            .post(`${process.env.SERVER_BACKEND}/user-account/change-user-data`, { userName: userName, userEmail: email, userDescription: description, userVisibility: Visibility, userToken: userToken })
            .then(res => {
                if (res.data.error) {
                    window.alert('error')
                }
                window.location.reload()
            })
            .catch(err => {
                if (err) {
                    window.alert(`error, ${err.message}`)
                }
            })
    }

    const changePassword = () => {
        axios.post(`${process.env.SERVER_BACKEND}/user-account/change-user-password-check-link`, { userEmail: props.UserEmail }).then(res => {
            if (res.data.error) {
                window.alert('error')
            }
            // Router.reload()
        })
    }

    return (
        <div className="fixed w-[100%] h-[100%] top-0 left-0 right-0 bottom-0 m-auto bg-[#0000005b] z-10">
            <div className="flex flex-col absolute left-[25%] right-[25%] top-[25%] bottom-[25%] w-[50vw] h-[88vh] m-auto bg-[#464646] border-[2px] border-solid border-b-[#656565] z-10 overflow-y-scroll items-center">
                <button className="text-[#ffffff] bg-transparent outline-none cursor-pointer ml-auto mt-[1vh] mr-[1vw]" onClick={props.closePopup}>
                    &#9587;
                </button>
                <form className="flex flex-col w-full items-center" onSubmit={changeUserData}>
                    <h1 className="text-[#ffffff] text-xl">SETTINGS</h1>
                    <hr color="#656565" className="w-[85%] mt-[1rem]" />
                    <div className="flex flex-col self-center w-[65%]">
                        <h1 className="text-[#ffffff] text-lg mt-[1rem]">Username</h1>
                        <div className="flex h-[2.5rem] mt-[1rem]">
                            <input
                                className="text-[#ffffff] bg-[#3b3b3b] h-[100%] border-none  w-full placeholder:text-white indent-3"
                                type="text"
                                placeholder="User Name..."
                                onChange={e => {
                                    setUserName(e.target.value)
                                }}
                                value={userName}
                                maxLength={10}
                            />
                        </div>

                        <h1 className="text-white text-lg mt-[1.2rem]">Email</h1>
                        <div className="flex h-[2.5rem] mt-[1rem]">
                            <input
                                className="text-[#ffffff]  bg-[#3b3b3b] h-[100%] border-none  w-full placeholder:text-white indent-3"
                                type="email"
                                placeholder="User Name..."
                                onChange={e => {
                                    setEmail(e.target.value)
                                }}
                                value={email}
                            />
                        </div>
                    </div>
                    <div className="flex self-center w-[65%] flex-col mt-[1rem]">
                        <h1 className="text-lg text-white mt-[1rem]">Profile:</h1>
                        <select name="videoVisibility" className="self-center indent-3 w-full mt-[.5rem] h-[2rem]  bg-[#3b3b3b] text-white border-none " onChange={e => setVisibility(e.target.value)} value={Visibility}>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                    <div className="flex self-center w-[65%] flex-col">
                        <h1 className="text-lg mt-[1rem] text-white">About Chanel:</h1>
                        <textarea
                            className="bg-[#3b3b3b] border-none text-white resize-none text-sm mt-[1rem] indent-3"
                            cols={10}
                            rows={7}
                            placeholder="your message"
                            name="message"
                            minLength={10}
                            maxLength={100}
                            onChange={e => {
                                setDescription(e.target.value)
                            }}
                            value={description}
                        />
                    </div>
                    <div className="w-[65%]">
                        <input type="submit" className="bg-[#575757] border-none w-full  text-white mt-[1.5rem] h-[2rem] cursor-pointer hover:bg-[#525252] active:bg-[#2b2b2b]" value="Update" />
                    </div>
                </form>

                <hr color="#656565" className="w-[85%] mt-[2.5rem]" />
                <div className="w-[65%]">
                    <button
                        className="bg-[#575757] border-none text-white mt-[1.5rem] h-[2.5rem] w-full cursor-pointer hover:bg-[#525252] active:bg-[#2b2b2b]"
                        onClick={() => {
                            changePassword()
                        }}
                    >
                        Change Password
                    </button>
                </div>
                <hr color="#656565" className="w-[85%] mt-[1.5rem]" />
                <div className="w-[65%]">
                    <button
                        className="bg-[#575757] border-none text-white mt-[1.5rem] h-[2.5rem] w-full cursor-pointer hover:bg-[#525252] active:bg-[#2b2b2b]"
                        onClick={() => {
                            accLogout()
                        }}
                    >
                        Log Out
                    </button>
                </div>
                <div className="flex w-[65%]">
                    <button
                        className="bg-[#575757] border-none text-[#ad2c2c] mt-[1.5rem] h-[2.5rem] w-[60%] cursor-pointer hover:bg-[#525252] active:bg-[#2b2b2b]"
                        onClick={async () => {
                            const succesfullDeleted = await deleteAccount(sure, userToken)
                            if (succesfullDeleted) {
                                accLogout()
                            }
                        }}
                    >
                        Delete Account
                    </button>
                    <h1 className="">Sure</h1>
                    <input
                        className=""
                        type="checkbox"
                        name="Sure"
                        defaultChecked={false}
                        onChange={e => {
                            setSure(e.target.checked)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AccoutSettingsPopup
