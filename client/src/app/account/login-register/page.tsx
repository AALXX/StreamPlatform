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
                <div className="flex items-center bg-[#4A4A4A] w-[45%] h-[50vh] mt-[5rem] flex-col">
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
                            <input
                                value={loginEmail}
                                placeholder="email-address"
                                onChange={e => setLoginEmail(e.target.value)}
                                type="email"
                                className="text-white text-[1rem] text-center bg-[#575757] w-[90%] h-[1.8rem] border-none focus:bg-[#444444] focus:border-none"
                            />
                            <br />
                            <br />
                            <input
                                value={loginPassword}
                                placeholder="Enter password"
                                onChange={e => setLoginPassword(e.target.value)}
                                type="password"
                                className="text-white text-[1rem] text-center bg-[#575757] w-[90%] h-[1.8rem] border-none focus:bg-[#444444]"
                            />
                        </div>
                        <div className="bg-white w-[100%] h-[.1rem] mt-8" />
                        <input type="submit" value={'Log Into Account'} className="mt-5 text-white cursor-pointer" />
                    </form>
                    <button>
                        <h1
                            onClick={() => {
                                setRegisterForm(true)
                            }}
                        >
                            Don' t Have An Account?
                        </h1>
                    </button>
                </div>
            ) : (
                <div className="flex items-center bg-[#4A4A4A] w-[45%] h-[50vh] mt-[5rem] flex-col">
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
                            <input
                                value={registerUserName}
                                placeholder="Enter name"
                                onChange={e => setRegisterUserName(e.target.value)}
                                className="text-white text-[1rem] text-center bg-[#575757] w-[90%] h-[1.8rem] border-none focus:bg-[#444444] focus:border-none mt-[6%]"
                            />
                            <input
                                value={registerEmail}
                                placeholder="email-address"
                                onChange={e => setRegisterEmail(e.target.value)}
                                type="email"
                                className="text-white text-[1rem] text-center bg-[#575757] w-[90%] h-[1.8rem] border-none focus:bg-[#444444] focus:border-none mt-[6%]"
                            />
                            <input
                                value={registerPassword}
                                placeholder="Enter password"
                                onChange={e => setRegisterPassword(e.target.value)}
                                type="password"
                                className="text-white text-[1rem] text-center bg-[#575757] w-[90%] h-[1.8rem] border-none focus:bg-[#444444] mt-[6%]"
                            />
                            <input
                                value={registerRepetedPassword}
                                placeholder="Enter password"
                                onChange={e => setRegisterRepeatedPassword(e.target.value)}
                                type="password"
                                className="text-white text-[1rem] text-center bg-[#575757] w-[90%] h-[1.8rem] border-none focus:bg-[#444444] mt-[6%]"
                            />
                        </div>
                        <div className="bg-white w-[100%] h-[.1rem] mt-8" />
                        <input type="submit" value={'Log Into Account'} className="mt-5 text-white cursor-pointer" />
                    </form>
                    <button>
                        <h1
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
