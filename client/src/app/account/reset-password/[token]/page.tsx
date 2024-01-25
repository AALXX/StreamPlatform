'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

const ResetPassword = ({ params }: { params: { token: string } }) => {
    const [Linkvalid, setLinkValid] = useState<boolean>(false)
    const urlParams = useSearchParams() //* vt = Video Token
    const router = useRouter()

    const [oldPassword, setOldPassword] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeatPassword, setRepeatPassword] = useState<string>('')

    useEffect(() => {
        console.log(urlParams.get('email'))
        ;(async () => {
            if (urlParams.get('email') !== null && params.token !== null) {
                const res = await axios.get(`http://192.168.72.81:7000/api/user-account/check-pwd-change-link/${params.token}/${urlParams.get('email')}`)
                if (res.data.error === false) {
                    setLinkValid(true)
                }
            }
        })()
    }, [])

    const SubmitResetPwd = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password !== repeatPassword) {
            return window.alert("passwords don't match")
        }

        axios.post(`${process.env.SERVER_BACKEND}/user-account/change-user-account-password`, { oldPassword: oldPassword, newPassword: password, userEmail: urlParams.get('email') }).then(res => {
            console.log(res)
            if (res.data.error || res.data.pwdChanged !== true) {
                return window.alert(`an error has ocured: ${res.data.msg}`)
            }

            deleteCookie('userToken')
            router.push('/account')

            return window.alert('password succesfully changed')
        })
    }

    return (
        <div className="flex flex-col">
            {Linkvalid ? (
                <form className="flex  flex-col w-[35%] 3xl:h-[55vh] 2xl:h-[60vh]  mt-[5%] self-center  bg-[#2e2e2e]" onSubmit={SubmitResetPwd}>
                    <h1 className="text-white self-center mt-[1rem] text-lg">Change account password</h1>
                    <hr color="#676767" className="mt-[1rem]" />
                    <div className="flex flex-col self-center w-[85%] mt-[1rem]">
                        <h1 className="text-white">Old Password</h1>
                        <input
                            className=" text-[#ffffff] mt-[1vh] bg-[#3b3b3b] h-[6vh] border-none w-full placeholder:text-white indent-3"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setOldPassword(e.target.value)
                            }}
                            value={oldPassword}
                            type="password"
                            placeholder="Old Password..."
                        />
                    </div>

                    <div className="flex flex-col self-center w-[85%] mt-[1rem]">
                        <h1 className="text-white">Password</h1>
                        <input
                            className=" text-[#ffffff] mt-[1vh] bg-[#3b3b3b] h-[6vh] border-none w-full placeholder:text-white indent-3"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setPassword(e.target.value)
                            }}
                            value={password}
                            type="password"
                            placeholder="Password..."
                        />
                    </div>

                    <div className="flex flex-col self-center w-[85%] mt-[1rem]">
                        <h1 className="text-white">Repeat Password</h1>
                        <input
                            className=" text-[#ffffff] mt-[1vh] bg-[#3b3b3b] h-[6vh] border-none w-full placeholder:text-white indent-3"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setRepeatPassword(e.target.value)
                            }}
                            value={repeatPassword}
                            type="password"
                            placeholder="Repeat Password..."
                        />
                    </div>

                    <hr color="#676767" className="mt-[2rem]" />
                    <div className="flex flex-col  h-full">
                        <input className="self-center mt-[8%] cursor-pointer text-white" type="submit" value="Change Password" />
                    </div>
                </form>
            ) : (
                <div className="self-center">
                    <h1 className="text-white mt-10">Invalid Link</h1>
                </div>
            )}
        </div>
    )
}

export default ResetPassword
