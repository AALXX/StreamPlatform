'use client'
import React, { useState } from 'react'
import { accLoginFunc, accRegisterFunc } from '@/security/Accounts'
import { useRouter } from 'next/navigation'

/**
 * Login-Register-Screen
 * @return {jsx}
 */
export default function LoginRegisterScreen() {
    const [registerForm, setRegisterForm] = useState(false)
    const router = useRouter()

    // *-----------------------Register_Props-----------------------//
    const [registerUserName, setRegisterUserName] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [registerRepetedPassword, setRegisterRepeatedPassword] = useState('')

    // *-----------------------Login_Props-----------------------//
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    return (
        <div className="flex justify-center items-center flex-col">
            {!registerForm ? (
                <div className="flex  flex-col w-[40%] 3xl:h-[57vh] 2xl:h-[60vh]  mt-[5%] self-center  bg-[#2b2b2b]">
                    <form
                        className="flex w-[100%] h-[100%] flex-col items-center"
                        onSubmit={async e => {
                            e.preventDefault()
                            const succesfullLogin = await accLoginFunc(loginEmail, loginPassword)
                            if (succesfullLogin) {
                                router.push('/account')
                            }
                        }}
                    >
                        <h1 className="text-white text-[1.5rem] mt-[2rem]">Login</h1>
                        <div className="bg-white w-[100%] h-[.1rem] mt-8" />
                        <div className="flex items-center justify-center h-[60%] w-[100%] flex-col">
                            <div className="flex flex-col self-center w-[85%] mt-[1rem]">
                                <h1 className="text-white">Email</h1>
                                <input
                                    className=" text-[#ffffff] mt-[1vh] bg-[#3b3b3b] h-[6vh] border-none w-full placeholder:text-white indent-3"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setLoginEmail(e.target.value)
                                    }}
                                    value={loginEmail}
                                    type="email"
                                    placeholder="Email..."
                                />
                            </div>
                            <div className="flex flex-col self-center w-[85%] mt-[1rem]">
                                <h1 className="text-white">Password</h1>
                                <input
                                    className=" text-[#ffffff] mt-[1vh] bg-[#3b3b3b] h-[6vh] border-none w-full placeholder:text-white indent-3"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setLoginPassword(e.target.value)
                                    }}
                                    value={loginPassword}
                                    type="password"
                                    placeholder="Password..."
                                />
                            </div>
                        </div>
                        <div className="bg-white w-[100%] h-[.1rem] mt-8" />
                        <input type="submit" value={'Log Into Account'} className="mt-5 text-white cursor-pointer" />
                    </form>
                    <button>
                        <h1
                            className="text-[#9c9c9c]"
                            onClick={() => {
                                setRegisterForm(true)
                            }}
                        >
                            Don' t Have An Account?
                        </h1>
                    </button>
                </div>
            ) : (
                <div className="flex  flex-col w-[40%] 3xl:h-[70vh] 2xl:h-[60vh]  mt-[5%] self-center  bg-[#2b2b2b]">
                    <form
                        className="flex w-[100%] h-[100%] flex-col items-center"
                        onSubmit={async e => {
                            e.preventDefault()
                            const succesfullRegister = await accRegisterFunc(registerUserName, registerEmail, registerPassword, registerRepetedPassword)
                            if (succesfullRegister) {
                                router.push('/account')
                            }
                        }}
                    >
                        <h1 className="text-white text-[1.5rem] mt-[2rem]">Register</h1>
                        <div className="bg-white w-[100%] h-[.1rem] mt-8" />
                        <div className="flex items-center h-[60%] w-[100%] flex-col">
                            <div className="flex flex-col self-center w-[85%] mt-[1rem]">
                                <h1 className="text-white">UserName</h1>
                                <input
                                    className=" text-[#ffffff] mt-[1vh] bg-[#3b3b3b] h-[6vh] border-none w-full placeholder:text-white indent-3"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setRegisterUserName(e.target.value)
                                    }}
                                    value={registerUserName}
                                    type="text"
                                    placeholder="Enter name..."
                                />
                            </div>
                            <div className="flex flex-col self-center w-[85%] mt-[1rem]">
                                <h1 className="text-white">Email</h1>
                                <input
                                    className=" text-[#ffffff] mt-[1vh] bg-[#3b3b3b] h-[6vh] border-none w-full placeholder:text-white indent-3"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setRegisterEmail(e.target.value)
                                    }}
                                    value={registerEmail}
                                    type="email"
                                    placeholder="Email..."
                                />
                            </div>
                            <div className="flex flex-col self-center w-[85%] mt-[1rem]">
                                <h1 className="text-white">Password</h1>
                                <input
                                    className=" text-[#ffffff] mt-[1vh] bg-[#3b3b3b] h-[6vh] border-none w-full placeholder:text-white indent-3"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setRegisterPassword(e.target.value)
                                    }}
                                    value={registerEmail}
                                    type="password"
                                    placeholder="Password..."
                                />
                            </div>

                            <div className="flex flex-col self-center w-[85%] mt-[1rem]">
                                <h1 className="text-white">Repeat Password</h1>
                                <input
                                    className=" text-[#ffffff] mt-[1vh] bg-[#3b3b3b] h-[6vh] border-none w-full placeholder:text-white indent-3"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setRegisterRepeatedPassword(e.target.value)
                                    }}
                                    value={registerRepetedPassword}
                                    type="password"
                                    placeholder="Repeat Password..."
                                />
                            </div>
                        </div>
                        <div className="bg-white w-[100%] h-[.1rem] mt-20" />
                        <input type="submit" value={'Register Account'} className="mt-5 text-white cursor-pointer" />
                    </form>
                    <button>
                        <h1
                            className="text-[#9c9c9c]"
                            onClick={() => {
                                setRegisterForm(false)
                            }}
                        >
                            Already Have An Account?
                        </h1>
                    </button>
                </div>
            )}
        </div>
    )
}
